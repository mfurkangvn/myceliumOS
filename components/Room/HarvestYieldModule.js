import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

const HarvestYieldModule = ({
  harvestLogs = {},
  compostCapacityStr = "1000 kg",
  onSaveHarvest,
  todayKey,
}) => {
  const [harvestInput, setHarvestInput] = useState("");
  const [harvestSavedAt, setHarvestSavedAt] = useState(null);

  // Calculate total harvest kg
  const totalHarvestKg = Object.values(harvestLogs).reduce(
    (sum, val) => sum + (parseFloat(val) || 0),
    0
  );

  const compostKg =
    parseFloat(String(compostCapacityStr || "").replace(/[^0-9.]/g, "")) ||
    1000;

  const yieldPercent = ((totalHarvestKg / compostKg) * 100).toFixed(1);

  const handleSave = () => {
    if (!harvestInput.trim() || isNaN(harvestInput)) {
      Alert.alert("Hata", "Lütfen geçerli bir kilo (kg) miktarı giriniz.");
      return;
    }

    onSaveHarvest(harvestInput);
    setHarvestSavedAt(
      new Date().toLocaleTimeString("tr-TR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setHarvestInput("");
  };

  return (
    <View style={styles.harvestContainer}>
      <View style={styles.harvestHeader}>
        <Ionicons name="basket-outline" size={20} color="#52B788" />
        <Text style={styles.harvestTitle}>GÜNLÜK HASAT VE VERİM TAKİBİ</Text>
      </View>

      {/* Stat Grid */}
      <View style={styles.harvestStatsGrid}>
        <View style={styles.harvestStatCard}>
          <Text style={styles.harvestStatLabel}>TOPLAM HASAT</Text>
          <Text style={styles.harvestStatValGold}>{totalHarvestKg} kg</Text>
        </View>
        <View style={styles.harvestStatCard}>
          <Text style={styles.harvestStatLabel}>VERİM ORANI</Text>
          <Text style={styles.harvestStatValGreen}>%{yieldPercent}</Text>
        </View>
      </View>

      {/* Daily Harvest Input */}
      <View style={styles.harvestInputRow}>
        <TextInput
          style={styles.harvestInput}
          placeholder="Bugün Toplanan Mantar (kg)"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          keyboardType="numeric"
          value={harvestInput}
          onChangeText={setHarvestInput}
        />
        <TouchableOpacity
          style={styles.saveHarvestBtn}
          onPress={handleSave}
          activeOpacity={0.8}
        >
          <Ionicons
            name="save-outline"
            size={16}
            color="#081C15"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.saveHarvestBtnText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      {harvestSavedAt && (
        <Text style={styles.harvestSavedBadge}>
          ✓ {todayKey} kaydı eklendi ({harvestSavedAt})
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  harvestContainer: {
    backgroundColor: "#112A20",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(82, 183, 136, 0.3)",
    marginBottom: 16,
  },
  harvestHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  harvestTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#52B788",
    letterSpacing: 0.8,
  },
  harvestStatsGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  harvestStatCard: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  harvestStatLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 4,
  },
  harvestStatValGold: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#E9C46A",
  },
  harvestStatValGreen: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#52B788",
  },
  harvestInputRow: {
    flexDirection: "row",
    gap: 10,
  },
  harvestInput: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    color: "#ffffff",
    fontSize: 13,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  saveHarvestBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#52B788",
    paddingHorizontal: 16,
    borderRadius: 10,
    height: 42,
  },
  saveHarvestBtnText: {
    color: "#081C15",
    fontSize: 12,
    fontWeight: "bold",
  },
  harvestSavedBadge: {
    fontSize: 10,
    color: "#52B788",
    marginTop: 8,
    textAlign: "center",
  },
});

export default HarvestYieldModule;
