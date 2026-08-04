import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";
import {
  incubationDaysData,
  scratchedDaysData,
  harvestDaysData,
} from "../../data/daysData";
import { getElapsedDays } from "../../utils/dateUtils";

const RoomCards = ({ room }) => {
  const navigation = useNavigation();
  const roomName = room?.name || "İsimsiz Oda";
  const startDate = room?.date || "01.01.2026";

  const elapsedDays = getElapsedDays(startDate);

  // Dynamic phase resolution
  let activePhaseInfo = incubationDaysData[elapsedDays] || incubationDaysData[1];
  if (room?.isPinSpotted) {
    activePhaseInfo =
      harvestDaysData[elapsedDays] ||
      harvestDaysData[1] ||
      harvestDaysData;
  } else if (room?.isScratchDone) {
    activePhaseInfo =
      scratchedDaysData[elapsedDays] ||
      scratchedDaysData[1] ||
      scratchedDaysData;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.card}
        onPress={() => navigation.navigate("Room", room)}
      >
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.headerLeft}>
            <Text style={styles.roomTitle}>{roomName}</Text>
            <View
              style={[
                styles.statusBadge,
                room?.isScratchDone && styles.scratchStatusBadge,
                room?.isPinSpotted && styles.pinStatusBadge,
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  room?.isScratchDone && styles.scratchStatusText,
                  room?.isPinSpotted && styles.pinStatusText,
                ]}
              >
                {activePhaseInfo.stage}
              </Text>
            </View>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.dayBadge}>
              <Text style={styles.dayText}>{elapsedDays}. Gün</Text>
            </View>
            <Feather
              name="chevron-right"
              size={20}
              color="rgba(255, 255, 255, 0.3)"
            />
          </View>
        </View>

        {/* Section Divider & Title */}
        <View style={styles.dividerContainer}>
          <Text style={styles.sectionTitle}>EVRE HEDEF PARAMETRELERİ</Text>
          <View style={styles.sectionDivider} />
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsRow}>
          {/* Temperature Metric */}
          <View style={styles.metricCard}>
            <FontAwesome6 name="temperature-half" size={16} color="#FF6B6B" />
            <Text style={styles.metricLabel}>Ortam</Text>
            <Text style={styles.metricValue}>{activePhaseInfo.targetTemp}</Text>
          </View>

          {/* Compost Temp Metric */}
          <View style={styles.metricCard}>
            <FontAwesome6 name="fire-flame-curved" size={15} color="#F4A261" />
            <Text style={styles.metricLabel}>Kompost</Text>
            <Text style={styles.metricValue}>
              {activePhaseInfo.targetCompostTemp || "24°C - 26°C"}
            </Text>
          </View>

          {/* Humidity Metric */}
          <View style={styles.metricCard}>
            <FontAwesome6 name="droplet" size={16} color="#4EA8DE" />
            <Text style={styles.metricLabel}>Nem</Text>
            <Text style={styles.metricValue}>{activePhaseInfo.targetHumidity}</Text>
          </View>

          {/* Ventilation Metric */}
          <View style={styles.metricCard}>
            <FontAwesome5
              name="fan"
              size={15}
              color="#52B788"
              style={styles.fanIcon}
            />
            <Text style={styles.metricLabel}>Fan</Text>
            <Text style={styles.metricValue}>
              {activePhaseInfo.targetFan || "Min"}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginVertical: 10,
  },
  card: {
    width: "100%",
    backgroundColor: "#112A20",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roomTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  statusBadge: {
    backgroundColor: "rgba(82, 183, 136, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(82, 183, 136, 0.15)",
  },
  statusText: {
    color: "#52B788",
    fontSize: 11,
    fontWeight: "600",
  },
  scratchStatusBadge: {
    backgroundColor: "rgba(233, 196, 106, 0.15)",
    borderColor: "rgba(233, 196, 106, 0.3)",
  },
  scratchStatusText: {
    color: "#E9C46A",
  },
  pinStatusBadge: {
    backgroundColor: "rgba(78, 168, 222, 0.15)",
    borderColor: "rgba(78, 168, 222, 0.3)",
  },
  pinStatusText: {
    color: "#4EA8DE",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dayBadge: {
    backgroundColor: "rgba(233, 196, 106, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.15)",
  },
  dayText: {
    color: "#E9C46A",
    fontSize: 11,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 12,
    gap: 10,
  },
  sectionTitle: {
    color: "rgba(255, 255, 255, 0.35)",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  sectionDivider: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: -4,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.16)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 2,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.03)",
    marginHorizontal: 2,
  },
  metricLabel: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 9,
    marginTop: 6,
    marginBottom: 4,
    textAlign: "center",
  },
  metricValue: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  fanIcon: {
    marginBottom: 2,
  },
});

export default RoomCards;
