import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { parseMeasurement } from "../../utils/dateUtils";

const TelemetryEntryCard = ({ existingDayLogs, onSaveTelemetry }) => {
  const [activeSession, setActiveSession] = useState("morning");
  const [roomTempInput, setRoomTempInput] = useState("");
  const [compostTempInput, setCompostTempInput] = useState("");
  const [humidityInput, setHumidityInput] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [savedTimeBadge, setSavedTimeBadge] = useState(null);

  // Effect'i yalnızca aktif oturumun kayıtlı verisine bağlıyoruz. Bu referans
  // state'ten geldiği için sabittir (yoksa undefined); `= {}` gibi her render'da
  // yeni obje üreten bir varsayılan, her tuş vuruşunda girişleri sıfırlıyordu.
  const sessionData = existingDayLogs?.[activeSession];

  useEffect(() => {
    if (sessionData) {
      setRoomTempInput(String(sessionData.roomTemp ?? ""));
      setCompostTempInput(String(sessionData.compostTemp ?? ""));
      setHumidityInput(String(sessionData.humidity ?? ""));
      setIsSaved(true);
      setSavedTimeBadge(sessionData.updatedAt || null);
    } else {
      setRoomTempInput("");
      setCompostTempInput("");
      setHumidityInput("");
      setIsSaved(false);
      setSavedTimeBadge(null);
    }
  }, [activeSession, sessionData]);

  const handleSave = () => {
    const roomTemp = parseMeasurement(roomTempInput);
    const compostTemp = parseMeasurement(compostTempInput);
    const humidity = parseMeasurement(humidityInput);

    if (roomTemp === null || compostTemp === null || humidity === null) {
      Alert.alert(
        "Geçersiz ölçüm",
        "Lütfen ortam, kompost ve nem değerlerini sayı olarak giriniz."
      );
      return;
    }

    if (
      roomTemp < -10 ||
      roomTemp > 50 ||
      compostTemp < 0 ||
      compostTemp > 50 ||
      humidity < 0 ||
      humidity > 100
    ) {
      Alert.alert(
        "Geçersiz ölçüm aralığı",
        "Ortam (-10..50°C), Kompost (0..50°C) ve Nem (%0..100) aralığında olmalıdır."
      );
      return;
    }

    const logData = {
      roomTemp,
      compostTemp,
      humidity,
    };

    if (compostTemp >= 32) {
      Alert.alert(
        "KRİTİK KOMPOST ISISI!",
        "32°C ve üzeri kompost sıcaklığı misel canlılığı için büyük risk taşır. Yine de kaydetmek istiyor musunuz?",
        [
          { text: "İptal", style: "cancel" },
          {
            text: "Kaydet",
            style: "destructive",
            onPress: () => commitSave(activeSession, logData),
          },
        ]
      );
      return;
    }

    commitSave(activeSession, logData);
  };

  const commitSave = (session, data) => {
    onSaveTelemetry(session, data);
    setIsSaved(true);
    const currentTimeStr = new Date().toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
    setSavedTimeBadge(currentTimeStr);
    Alert.alert(
      "Ölçüm Kaydedildi",
      `${
        session === "morning" ? "Sabah (1. Ölçüm)" : "Akşam (2. Ölçüm)"
      } iklim verileri kaydedildi.`
    );
  };

  const isCompostTempHigh = parseFloat(compostTempInput) >= 30;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>GÜNLÜK İKLİM ÖLÇÜM GİRİŞİ</Text>
        <View style={styles.targetIndicator}>
          <Ionicons
            name="time-outline"
            size={12}
            color="#E9C46A"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.targetBadgeText}>GÜNDE 2 KEZ</Text>
        </View>
      </View>

      <View style={styles.telemetryCard}>
        {/* Session Tabs */}
        <View style={styles.sessionTabRow}>
          <TouchableOpacity
            style={[
              styles.sessionTab,
              activeSession === "morning" && styles.sessionTabActive,
            ]}
            onPress={() => setActiveSession("morning")}
            activeOpacity={0.8}
          >
            <Feather
              name="sun"
              size={14}
              color={
                activeSession === "morning"
                  ? "#081C15"
                  : "rgba(255, 255, 255, 0.6)"
              }
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.sessionTabText,
                activeSession === "morning" && styles.sessionTabTextActive,
              ]}
            >
              1. Ölçüm (Sabah)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sessionTab,
              activeSession === "evening" && styles.sessionTabActive,
            ]}
            onPress={() => setActiveSession("evening")}
            activeOpacity={0.8}
          >
            <Feather
              name="moon"
              size={14}
              color={
                activeSession === "evening"
                  ? "#081C15"
                  : "rgba(255, 255, 255, 0.6)"
              }
              style={{ marginRight: 6 }}
            />
            <Text
              style={[
                styles.sessionTabText,
                activeSession === "evening" && styles.sessionTabTextActive,
              ]}
            >
              2. Ölçüm (Akşam)
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inputs Grid */}
        <View style={styles.telemetryInputsRow}>
          {/* Ortam Sıcaklığı */}
          <View style={styles.telemetryInputContainer}>
            <Text style={styles.telemetryInputLabel}>ORTAM ISR °C</Text>
            <View style={styles.telemetryInputWrapper}>
              <TextInput
                style={styles.telemetryInput}
                placeholder="24.5"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                keyboardType="numeric"
                value={roomTempInput}
                onChangeText={setRoomTempInput}
              />
            </View>
          </View>

          {/* Kompost Sıcaklığı */}
          <View style={styles.telemetryInputContainer}>
            <Text style={styles.telemetryInputLabel}>KOMPOST ISR °C</Text>
            <View style={styles.telemetryInputWrapper}>
              <TextInput
                style={styles.telemetryInput}
                placeholder="26.0"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                keyboardType="numeric"
                value={compostTempInput}
                onChangeText={setCompostTempInput}
              />
            </View>
          </View>

          {/* Nem Oranı */}
          <View style={styles.telemetryInputContainer}>
            <Text style={styles.telemetryInputLabel}>NEM ORANI %</Text>
            <View style={styles.telemetryInputWrapper}>
              <TextInput
                style={styles.telemetryInput}
                placeholder="88"
                placeholderTextColor="rgba(255, 255, 255, 0.3)"
                keyboardType="numeric"
                value={humidityInput}
                onChangeText={setHumidityInput}
              />
            </View>
          </View>
        </View>

        {/* High Temp Warning */}
        {isCompostTempHigh && (
          <View style={styles.compostWarningBox}>
            <Ionicons
              name="alert-circle-outline"
              size={16}
              color="#FF6B6B"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.compostWarningText}>
              YÜKSEK KOMPOST ISISI! Kompost sıcaklığı {compostTempInput}°C seviyesinde. 32°C kritik sınıra dikkat ediniz.
            </Text>
          </View>
        )}

        {/* Save Button */}
        <TouchableOpacity
          style={styles.saveLogButton}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Ionicons
            name="checkmark-done"
            size={18}
            color="#081C15"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.saveLogButtonText}>
            {isSaved ? "Ölçümü Güncelle" : "Ölçümü Kaydet"}
          </Text>
        </TouchableOpacity>

        {savedTimeBadge && (
          <View style={styles.savedFeedbackBadge}>
            <Ionicons
              name="checkmark-circle-outline"
              size={14}
              color="#52B788"
              style={{ marginRight: 4 }}
            />
            <Text style={styles.savedFeedbackText}>
              Son kayıt saati: {savedTimeBadge}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 1,
  },
  targetIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(233, 196, 106, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.2)",
  },
  targetBadgeText: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#E9C46A",
  },
  telemetryCard: {
    backgroundColor: "#112A20",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  sessionTabRow: {
    flexDirection: "row",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 10,
    padding: 3,
    marginBottom: 14,
  },
  sessionTab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  sessionTabActive: {
    backgroundColor: "#E9C46A",
  },
  sessionTabText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.6)",
  },
  sessionTabTextActive: {
    color: "#081C15",
  },
  telemetryInputsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 14,
  },
  telemetryInputContainer: {
    flex: 1,
  },
  telemetryInputLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 0.8,
    marginBottom: 6,
    textAlign: "center",
  },
  telemetryInputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 10,
    paddingHorizontal: 8,
    height: 44,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  telemetryInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  compostWarningBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
    marginBottom: 12,
  },
  compostWarningText: {
    color: "#FF6B6B",
    fontSize: 11,
    fontWeight: "bold",
    flex: 1,
    lineHeight: 15,
  },
  saveLogButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9C46A",
    height: 44,
    borderRadius: 12,
  },
  saveLogButtonText: {
    color: "#081C15",
    fontSize: 13,
    fontWeight: "bold",
  },
  savedFeedbackBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  savedFeedbackText: {
    fontSize: 11,
    color: "#52B788",
    fontWeight: "600",
  },
});

export default TelemetryEntryCard;
