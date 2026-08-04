import React, { useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../../components/Header/Header";
import DayInsight from "../../components/DayInsight/DayInsight";
import RoomHeaderStrip from "../../components/Room/RoomHeaderStrip";
import TargetClimateConsole from "../../components/Room/TargetClimateConsole";
import HarvestYieldModule from "../../components/Room/HarvestYieldModule";
import TelemetryEntryCard from "../../components/Room/TelemetryEntryCard";

import {
  getIncubationDayData,
  scratchedDaysData,
  harvestDaysData,
} from "../../data/daysData";
import { RoomContext } from "../../RoomContext";
import {
  getLocalDateKey,
  getElapsedDays,
  getElapsedDaysFromTimestamp,
} from "../../utils/dateUtils";

const Room = ({ route, navigation }) => {
  const {
    rooms,
    deleteRoom,
    updateRoomLog,
    addHarvestLog,
    toggleScratchStatus,
    togglePinStatus,
  } = useContext(RoomContext);

  // Read route parameters passed from NewRoom
  const { id, name, productionPlace, date } = route.params || {};

  const currentRoom = rooms.find((r) => String(r.id) === String(id)) || {
    id,
    name,
    productionPlace,
    date,
    logs: {},
    harvestLogs: {},
  };

  const todayKey = getLocalDateKey();
  const roomName = currentRoom?.name || name || "Oda Detayı";
  const roomCapacity = currentRoom?.productionPlace || productionPlace || "-";
  const startDate = currentRoom?.date || date || "-";

  // Days calculations
  const elapsedDays = getElapsedDays(startDate);
  const scratchDays = getElapsedDaysFromTimestamp(currentRoom?.scratchTimestamp);
  const pinDays = getElapsedDaysFromTimestamp(currentRoom?.pinTimestamp);

  // Default incubation target data
  const currentDayData = getIncubationDayData(elapsedDays);

  // Resolve active phase target
  let activeTarget = currentDayData;
  if (currentRoom?.isPinSpotted) {
    activeTarget =
      harvestDaysData[pinDays] ||
      harvestDaysData[1] ||
      harvestDaysData;
  } else if (currentRoom?.isScratchDone) {
    activeTarget =
      scratchedDaysData[scratchDays] ||
      scratchedDaysData[1] ||
      scratchedDaysData;
  }

  const handleDeleteRoom = () => {
    const targetRoomId = id || currentRoom?.id;
    if (!targetRoomId) return;

    Alert.alert(
      "Odayı Sil",
      `"${roomName}" isimli odayı ve tüm geçmiş verilerini silmek istediğinize emin misiniz?`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Evet, Sil",
          style: "destructive",
          onPress: () => {
            deleteRoom(targetRoomId);
            navigation.navigate("Home");
          },
        },
      ]
    );
  };

  const handleSaveTelemetry = (session, logData) => {
    const targetRoomId = id || currentRoom?.id;
    if (targetRoomId) {
      updateRoomLog(targetRoomId, todayKey, session, logData);
    }
  };

  const handleSaveHarvest = (weightKg) => {
    const targetRoomId = id || currentRoom?.id;
    if (targetRoomId) {
      addHarvestLog(targetRoomId, todayKey, weightKg);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#081C15" />
      <View style={styles.container}>
        {/* Header */}
        <Header title={roomName} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 1. Component: Quick Stats Banner */}
          <RoomHeaderStrip
            capacity={roomCapacity}
            startDate={startDate}
            elapsedDays={elapsedDays}
          />

          {/* 2. Component: Dynamic Daily Insight Guidance */}
          <DayInsight
            day={elapsedDays}
            isScratchDone={currentRoom?.isScratchDone}
            scratchTimestamp={currentRoom?.scratchTimestamp}
            onToggleScratch={() =>
              (id || currentRoom?.id) &&
              toggleScratchStatus(id || currentRoom?.id)
            }
            isPinSpotted={currentRoom?.isPinSpotted}
            pinTimestamp={currentRoom?.pinTimestamp}
            onTogglePin={() =>
              (id || currentRoom?.id) &&
              togglePinStatus(id || currentRoom?.id)
            }
          />

          {/* 3. Component: Target Values Console */}
          <TargetClimateConsole activeTarget={activeTarget} />

          {/* 4. Component: Harvest & Yield Module (Active only in Pin/Harvest phase) */}
          {currentRoom?.isPinSpotted && (
            <HarvestYieldModule
              harvestLogs={currentRoom?.harvestLogs}
              compostCapacityStr={roomCapacity}
              onSaveHarvest={handleSaveHarvest}
              todayKey={todayKey}
            />
          )}

          {/* 5. Component: Daily Telemetry Input (Morning / Evening) */}
          <TelemetryEntryCard
            existingDayLogs={currentRoom?.logs?.[todayKey]}
            onSaveTelemetry={handleSaveTelemetry}
          />

          {/* 6. Delete Room Button */}
          <TouchableOpacity
            style={styles.deleteRoomButton}
            onPress={handleDeleteRoom}
            activeOpacity={0.8}
          >
            <Ionicons
              name="trash-outline"
              size={18}
              color="#FF6B6B"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.deleteRoomButtonText}>Odayı Sil</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#081C15",
  },
  container: {
    flex: 1,
    backgroundColor: "#081C15",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 30,
    paddingTop: 10,
  },
  deleteRoomButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
    marginBottom: 20,
    marginTop: 10,
  },
  deleteRoomButtonText: {
    color: "#FF6B6B",
    fontSize: 13,
    fontWeight: "bold",
  },
});

export default Room;
