import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

// Uyarı kartlarının önem derecesine göre renk ve ikonları
const SEVERITY_STYLES = {
  critical: { color: "#FF6B6B", icon: "alert-circle", label: "KRİTİK" },
  warning: { color: "#F4A261", icon: "warning-outline", label: "UYARI" },
  info: { color: "#4EA8DE", icon: "information-circle-outline", label: "BİLGİ" },
};

const DayInsight = ({
  day,
  activeInfo,
  plan,
  checkedTasks = {},
  onToggleTask,
  isScratchDone,
  scratchTimestamp,
  onToggleScratch,
  isPinSpotted,
  onTogglePin,
}) => {
  const isCorrective = plan?.mode === "corrective";

  const isScratchPeriod = Number(day) >= 8;

  // 1 Günlük Kilit Hesabı: Çizik atıldıktan sonra 24 saat geçti mi?
  const now = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const isOneDayPassed =
    scratchTimestamp && now - scratchTimestamp >= oneDayInMs;

  const canShowPinButton = isPinSpotted || (isScratchDone && isOneDayPassed);

  const effectiveTasks = plan?.tasks || [];
  const alerts = plan?.alerts || [];

  return (
    <View style={styles.container}>
      {/* 1. Card Header */}
      <View style={styles.cardHeader}>
        <View style={styles.titleWrapper}>
          <Ionicons name="sparkles-outline" size={20} color="#E9C46A" />
          <Text style={styles.cardTitle}>{activeInfo.title}</Text>
        </View>
        <View
          style={[
            styles.stageBadge,
            isScratchDone && styles.scratchStageBadge,
            isPinSpotted && styles.pinStageBadge,
          ]}
        >
          <Text
            style={[
              styles.stageText,
              isScratchDone && styles.scratchStageText,
              isPinSpotted && styles.pinStageText,
            ]}
          >
            {activeInfo.stage}
          </Text>
        </View>
      </View>

      {/* 2. Critical Warning Banner if present */}
      {activeInfo.warning && (
        <View style={styles.warningBox}>
          <Ionicons
            name="warning-outline"
            size={16}
            color="#FF6B6B"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.warningText}>{activeInfo.warning}</Text>
        </View>
      )}

      {/* 3. Daily Guide Description */}
      <View style={styles.descBox}>
        <Text style={styles.descText}>{activeInfo.description}</Text>
      </View>

      {/* 4. Milestone Action Buttons Bar */}
      {isScratchPeriod && (!isScratchDone || !isPinSpotted) && (
        <View style={styles.milestoneBar}>
          {/* Button 1: Çizikleri Attım (Tıklanınca kaybolur) */}
          {!isScratchDone && (
            <TouchableOpacity
              style={styles.milestoneBtnGold}
              onPress={onToggleScratch}
              activeOpacity={0.8}
            >
              <FontAwesome6
                name="scissors"
                size={14}
                color="#081C15"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.milestoneBtnGoldText}>
                ✂️ Çizikleri Attım
              </Text>
            </TouchableOpacity>
          )}

          {/* Button 2: Pinler Göründü (Çizik atıldıktan 1 gün sonra açılır, tıklanınca kaybolur) */}
          {isScratchDone &&
            !isPinSpotted &&
            (canShowPinButton ? (
              <TouchableOpacity
                style={styles.milestoneBtnBlue}
                onPress={onTogglePin}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="sparkles"
                  size={16}
                  color="#ffffff"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.milestoneBtnBlueText}>
                  📍 Pinler Göründü
                </Text>
              </TouchableOpacity>
            ) : (
              <View></View>
            ))}
        </View>
      )}

      {/* 5. Measurement-based Alerts */}
      {alerts.map((alert) => {
        const severityStyle = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
        return (
          <View
            key={alert.ruleId}
            style={[
              styles.alertCard,
              {
                borderColor: severityStyle.color,
                backgroundColor: `${severityStyle.color}1A`,
              },
            ]}
          >
            <View style={styles.alertHeader}>
              <Ionicons name={severityStyle.icon} size={16} color={severityStyle.color} />
              <Text style={[styles.alertSeverity, { color: severityStyle.color }]}>
                {severityStyle.label}
              </Text>
            </View>
            <Text style={styles.alertTitle}>{alert.title}</Text>
            <Text style={styles.alertReason}>{alert.reason}</Text>
          </View>
        );
      })}

      {/* 6. Actionable Task Checklist */}
      {effectiveTasks.length > 0 && (
        <View style={styles.tasksSection}>
          <Text
            style={[styles.tasksHeaderTitle, isCorrective && styles.tasksHeaderCorrective]}
          >
            {isCorrective ? "DÜZELTİCİ AKSİYON LİSTESİ" : "GÜNLÜK GÖREV LİSTESİ"}
          </Text>
          {effectiveTasks.map((task) => {
            const isDone = !!checkedTasks[task.id];
            return (
              <TouchableOpacity
                key={task.id}
                style={[styles.taskRow, isDone && styles.taskRowDone]}
                onPress={() => onToggleTask?.(task.id)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
                  {isDone && (
                    <Ionicons name="checkmark" size={12} color="#081C15" />
                  )}
                </View>
                <Text style={[styles.taskText, isDone && styles.taskTextDone]}>
                  {task.text}
                </Text>
              </TouchableOpacity>
            );
          })}
          {isCorrective && (
            <Text style={styles.correctiveNote}>
              Ölçümler hedef aralığa döndüğünde günlük görev listesi otomatik olarak geri gelir.
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#112A20",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.2)",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
    flexWrap: "wrap",
    gap: 8,
  },
  titleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    flexShrink: 1,
  },
  stageBadge: {
    backgroundColor: "rgba(82, 183, 136, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(82, 183, 136, 0.3)",
  },
  stageText: {
    color: "#52B788",
    fontSize: 10,
    fontWeight: "bold",
  },
  scratchStageBadge: {
    backgroundColor: "rgba(233, 196, 106, 0.2)",
    borderColor: "#E9C46A",
  },
  scratchStageText: {
    color: "#E9C46A",
  },
  pinStageBadge: {
    backgroundColor: "rgba(78, 168, 222, 0.2)",
    borderColor: "#4EA8DE",
  },
  pinStageText: {
    color: "#4EA8DE",
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
    marginBottom: 12,
  },
  warningText: {
    color: "#FF6B6B",
    fontSize: 11,
    fontWeight: "bold",
    flex: 1,
    lineHeight: 16,
  },
  descBox: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    borderLeftColor: "#E9C46A",
    marginBottom: 14,
  },
  descText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: 12,
    lineHeight: 18,
  },
  milestoneBar: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  milestoneBtnGold: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9C46A",
    height: 42,
    borderRadius: 12,
  },
  milestoneBtnGoldDone: {
    backgroundColor: "rgba(82, 183, 136, 0.25)",
    borderWidth: 1,
    borderColor: "#52B788",
  },
  milestoneBtnGoldText: {
    color: "#081C15",
    fontSize: 12,
    fontWeight: "bold",
  },
  milestoneBtnGoldTextDone: {
    color: "#52B788",
  },
  milestoneBtnBlue: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#4EA8DE",
    height: 42,
    borderRadius: 12,
  },
  milestoneBtnGreen: {
    backgroundColor: "#52B788",
  },
  milestoneBtnBlueText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  milestoneBtnLocked: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
  milestoneBtnLockedText: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 11,
    fontWeight: "bold",
  },
  alertCard: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 10,
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
  },
  alertSeverity: {
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  alertTitle: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 2,
  },
  alertReason: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 11,
    lineHeight: 16,
  },
  tasksSection: {
    marginTop: 4,
  },
  tasksHeaderCorrective: {
    color: "#F4A261",
  },
  correctiveNote: {
    color: "rgba(255, 255, 255, 0.45)",
    fontSize: 10,
    fontStyle: "italic",
    marginTop: 4,
  },
  tasksHeaderTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 1,
    marginBottom: 8,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
    gap: 10,
  },
  taskRowDone: {
    backgroundColor: "rgba(82, 183, 136, 0.08)",
    opacity: 0.7,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: {
    backgroundColor: "#52B788",
    borderColor: "#52B788",
  },
  taskText: {
    fontSize: 12,
    color: "#ffffff",
    flex: 1,
  },
  taskTextDone: {
    textDecorationLine: "line-through",
    color: "rgba(255, 255, 255, 0.4)",
  },
});

export default DayInsight;
