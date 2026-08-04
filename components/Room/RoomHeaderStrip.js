import React from "react";
import { View, Text, StyleSheet } from "react-native";

const RoomHeaderStrip = ({ capacity, startDate, elapsedDays }) => {
  return (
    <View style={styles.statsStrip}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>KAPASİTE</Text>
        <Text style={styles.statValue}>{capacity || "-"}</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>BAŞLANGIÇ</Text>
        <Text style={styles.statValue}>{startDate || "-"}</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>GEÇEN SÜRE</Text>
        <Text style={styles.statValueGold}>{elapsedDays}. Gün</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  statsStrip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#112A20",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  statLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#ffffff",
  },
  statValueGold: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#E9C46A",
  },
});

export default RoomHeaderStrip;
