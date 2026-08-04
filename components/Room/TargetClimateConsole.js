import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const TargetClimateConsole = ({ activeTarget }) => {
  if (!activeTarget) return null;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>HEDEF PARAMETRELER</Text>
        <View style={styles.targetIndicator}>
          <Ionicons
            name="sparkles-outline"
            size={12}
            color="#E9C46A"
            style={{ marginRight: 4 }}
          />
          <Text style={styles.targetBadgeText}>GÜNLÜK HEDEF</Text>
        </View>
      </View>

      <View style={styles.sensorGrid}>
        {/* 1. Target Temperature */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorCardHeader}>
            <FontAwesome6 name="temperature-half" size={18} color="#FF6B6B" />
            <Text style={styles.sensorName}>Sıcaklık</Text>
          </View>
          <Text style={styles.targetRangeValue}>
            {activeTarget.targetTemp}
          </Text>
        </View>

        {/* 2. Target Humidity */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorCardHeader}>
            <FontAwesome6 name="droplet" size={18} color="#4EA8DE" />
            <Text style={styles.sensorName}>Nem</Text>
          </View>
          <Text style={styles.targetRangeValue}>
            {activeTarget.targetHumidity}
          </Text>
        </View>

        {/* 3. Target Fan Status */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorCardHeader}>
            <FontAwesome5 name="fan" size={16} color="#52B788" />
            <Text style={styles.sensorName}>Havalandırma</Text>
          </View>
          <Text style={styles.targetRangeValue}>
            {activeTarget.targetFan || "Kapalı / Min (1/10)"}
          </Text>
        </View>

        {/* 4. Target Compost Temp */}
        <View style={styles.sensorCard}>
          <View style={styles.sensorCardHeader}>
            <FontAwesome6
              name="fire-flame-curved"
              size={16}
              color="#F4A261"
            />
            <Text style={styles.sensorName}>Kompost Sıcaklığı</Text>
          </View>
          <Text style={styles.targetRangeValue}>
            {activeTarget.targetCompostTemp || "24°C - 26°C"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  sensorGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 10,
  },
  sensorCard: {
    width: "48%",
    backgroundColor: "#112A20",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  sensorCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  sensorName: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
  },
  targetRangeValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
  },
});

export default TargetClimateConsole;
