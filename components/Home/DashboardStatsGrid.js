import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

const DashboardStatsGrid = ({
  activeCount = 0,
  incubationCount = 0,
  scratchCount = 0,
  pinHarvestCount = 0,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        {/* Left Side: Active Room Stats */}
        <View style={styles.leftSection}>
          <View style={styles.activeBadge}>
            <FontAwesome6 name="warehouse" size={15} color="#E9C46A" />
          </View>
          <Text style={styles.activeCount}>{activeCount}</Text>
          <Text style={styles.activeLabel}>Aktif Oda</Text>
        </View>

        <View style={styles.divider} />

        {/* Right Side: Phase Distribution */}
        <View style={styles.rightSection}>
          {/* Phase 1: Kuluçka */}
          <View style={styles.phaseRow}>
            <View style={[styles.phaseIconBadge, { backgroundColor: "rgba(82, 183, 136, 0.12)" }]}>
              <FontAwesome5 name="flask" size={10} color="#52B788" />
            </View>
            <View style={styles.phaseInfo}>
              <Text style={styles.phaseName}>Kuluçka Evresi</Text>
              <Text style={styles.phaseValue}>{incubationCount} Oda</Text>
            </View>
          </View>

          {/* Phase 2: Çizik */}
          <View style={styles.phaseRow}>
            <View style={[styles.phaseIconBadge, { backgroundColor: "rgba(244, 162, 97, 0.12)" }]}>
              <FontAwesome6 name="scissors" size={10} color="#F4A261" />
            </View>
            <View style={styles.phaseInfo}>
              <Text style={styles.phaseName}>Çizik Dönemi</Text>
              <Text style={styles.phaseValue}>{scratchCount} Oda</Text>
            </View>
          </View>

          {/* Phase 3: Hasat */}
          <View style={styles.phaseRow}>
            <View style={[styles.phaseIconBadge, { backgroundColor: "rgba(78, 168, 222, 0.12)" }]}>
              <FontAwesome6 name="basket-shopping" size={10} color="#4EA8DE" />
            </View>
            <View style={styles.phaseInfo}>
              <Text style={styles.phaseName}>Pin & Hasat</Text>
              <Text style={styles.phaseValue}>{pinHarvestCount} Oda</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginBottom: 12,
  },
  summaryCard: {
    flexDirection: "row",
    backgroundColor: "#112A20",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
  },
  leftSection: {
    flex: 1.2,
    alignItems: "center",
    justifyContent: "center",
  },
  activeBadge: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "rgba(233, 196, 106, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  activeCount: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#E9C46A",
  },
  activeLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.4)",
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: "75%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginHorizontal: 12,
  },
  rightSection: {
    flex: 2,
    gap: 8,
  },
  phaseRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  phaseIconBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  phaseInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },
  phaseName: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "500",
  },
  phaseValue: {
    fontSize: 11,
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default DashboardStatsGrid;
