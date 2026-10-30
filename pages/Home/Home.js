import React, { useContext } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Header from "../../components/Header/Header";
import DashboardStatsGrid from "../../components/Home/DashboardStatsGrid";
import RoomCards from "../../components/RoomCards/RoomCards";
import AddCardButton from "./AddCardButton";
import { RoomContext } from "../../RoomContext";
import { buildDailyPlan } from "../../domain/planner";

const Home = () => {
  const navigation = useNavigation();
  const { rooms } = useContext(RoomContext);

  const parseWeight = (placeStr) => {
    if (!placeStr) return 1000;
    const num = parseFloat(placeStr.replace(/[^0-9.]/g, ""));
    return isNaN(num) ? 1000 : num;
  };

  const activeCount = rooms.length;
  const incubationRooms = rooms.filter(
    (r) => !r.isScratchDone && !r.isPinSpotted,
  );
  const scratchRooms = rooms.filter((r) => r.isScratchDone && !r.isPinSpotted);
  const pinHarvestRooms = rooms.filter((r) => r.isPinSpotted);
  const correctiveRooms = rooms.filter((r) => buildDailyPlan(r).mode === "corrective");

  const totalCompostKg = rooms.reduce(
    (acc, r) => acc + parseWeight(r.productionPlace),
    0,
  );

  const totalActualHarvestKg = rooms.reduce((acc, r) => {
    const logs = r.harvestLogs || {};
    const roomTotal = Object.values(logs).reduce(
      (sum, val) => sum + (parseFloat(val) || 0),
      0,
    );
    return acc + roomTotal;
  }, 0);

  const targetYieldKg = Math.round(totalCompostKg * 0.25);
  const efficiencyRatePercent = totalCompostKg > 0
    ? ((totalActualHarvestKg / totalCompostKg) * 100).toFixed(1)
    : "0.0";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* App Header */}
        <Header />

        {/* 1. Dashboard Section Header */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleWrapper}>
            <FontAwesome6 name="chart-pie" size={13} color="#E9C46A" />
            <Text style={styles.sectionTitle}>GENEL DURUM PANELİ</Text>
          </View>
          <View style={styles.liveBadge}>
            <View style={styles.dotPulse} />
            <Text style={styles.liveText}>CANLI VERİ</Text>
          </View>
        </View>

        {/* 2. Sub-component: Dashboard Stats Grid (2x2) */}
        <DashboardStatsGrid
          activeCount={activeCount}
          incubationCount={incubationRooms.length}
          scratchCount={scratchRooms.length}
          pinHarvestCount={pinHarvestRooms.length}
        />

        {/* 3. Yield Progress & Efficiency Card */}
        {activeCount > 0 && (
          <View style={styles.yieldCard}>
            {/* Header */}
            <View style={styles.yieldCardHeader}>
              <FontAwesome6 name="wheat-awn" size={13} color="#52B788" />
              <Text style={styles.yieldCardTitle}>HASAT VERİMLİLİK PANELİ</Text>
            </View>

            {/* Metrics Grid */}
            <View style={styles.yieldMetricsGrid}>
              <View style={styles.yieldMetricItem}>
                <Text style={styles.yieldMetricLabel}>Toplam Kompost</Text>
                <Text style={styles.yieldMetricValue}>{totalCompostKg.toLocaleString()} kg</Text>
              </View>

              <View style={styles.yieldMetricDivider} />

              <View style={styles.yieldMetricItem}>
                <Text style={styles.yieldMetricLabel}>Toplam Hasat</Text>
                <Text style={[styles.yieldMetricValue, { color: "#52B788" }]}>{totalActualHarvestKg.toLocaleString()} kg</Text>
              </View>

              <View style={styles.yieldMetricDivider} />

              <View style={styles.yieldMetricItem}>
                <Text style={styles.yieldMetricLabel}>Verim Oranı</Text>
                <Text style={[styles.yieldMetricValue, { color: "#E9C46A" }]}>%{efficiencyRatePercent}</Text>
              </View>
            </View>

            {/* Progress Bar Section */}
            <View style={styles.progressSection}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressLabelLeft}>Rekolte Hedefi: ~{targetYieldKg.toLocaleString()} kg</Text>
                <Text style={styles.progressLabelRight}>%{targetYieldKg > 0 ? Math.round((totalActualHarvestKg / targetYieldKg) * 100) : 0}</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View 
                  style={[
                    styles.progressBarFill, 
                    { width: `${Math.min(targetYieldKg > 0 ? Math.round((totalActualHarvestKg / targetYieldKg) * 100) : 0, 100)}%` }
                  ]} 
                />
              </View>
              <Text style={styles.progressStatusText}>
                * İdeal verimlilik kompost ağırlığının %25'idir (biyolojik etkinlik).
              </Text>
            </View>
          </View>
        )}

        {/* Measurement-based Corrective Plan Banner */}
        {correctiveRooms.length > 0 && (
          <View
            style={[
              styles.alertBanner,
              {
                backgroundColor: "rgba(255, 107, 107, 0.08)",
                borderColor: "rgba(255, 107, 107, 0.3)",
              },
            ]}
          >
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color="#FF6B6B"
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: "#FF6B6B" }]}>
                DÜZELTİCİ AKSİYON GEREKİYOR
              </Text>
              <Text style={styles.alertText}>
                {correctiveRooms.map((r) => r.name).join(", ")}: ölçümler hedef
                aralığın dışında. Oda sayfasındaki düzeltici listeyi uygulayın.
              </Text>
            </View>
          </View>
        )}

        {/* 4. Critical Scratch Alert Banner */}
        {scratchRooms.length > 0 && (
          <View style={styles.alertBanner}>
            <Ionicons
              name="sparkles-outline"
              size={20}
              color="#E9C46A"
              style={{ marginRight: 10 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>⚠️ ÇİZİK VE SARIM UYARISI</Text>
              <Text style={styles.alertText}>
                {scratchRooms.length} adet odanız kritik çizik döneminde. Nem
                oranını %90 seviyesinde tutun.
              </Text>
            </View>
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* 5. Rooms Section Title */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleWrapper}>
            <FontAwesome6 name="layer-group" size={13} color="#52B788" />
            <Text style={styles.sectionTitle}>
              ÜRETİM ODALARI ({rooms.length})
            </Text>
          </View>
        </View>

        {/* 6. Rooms List or Empty State */}
        {rooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconWrapper}>
              <FontAwesome5
                name="store-alt-slash"
                size={28}
                color="rgba(255, 255, 255, 0.3)"
              />
            </View>
            <Text style={styles.emptyTitle}>Henüz Oda Eklenmedi</Text>
            <Text style={styles.emptySubtitle}>
              Mantar tesisinizin günlük gelişimini ve iklim şartlarını izlemek
              için hemen yeni bir oda ekleyin.
            </Text>
          </View>
        ) : (
          rooms.map((room) => <RoomCards key={room.id} room={room} />)
        )}

        {/* Add Room Button */}
        <AddCardButton
          title="Yeni Oda Ekle"
          onPress={() => navigation.navigate("NewRoom")}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#081C15",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    paddingBottom: 40,
    paddingTop: 10,
  },
  sectionHeader: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 10,
  },
  sectionTitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 1,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(82, 183, 136, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(82, 183, 136, 0.2)",
  },
  dotPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#52B788",
    marginRight: 5,
  },
  liveText: {
    color: "#52B788",
    fontSize: 9,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  yieldCard: {
    width: "90%",
    backgroundColor: "#112A20",
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(82, 183, 136, 0.2)",
    marginBottom: 12,
  },
  yieldCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  yieldCardTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 0.8,
  },
  yieldMetricsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "rgba(0, 0, 0, 0.15)",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  yieldMetricItem: {
    flex: 1,
    alignItems: "center",
  },
  yieldMetricLabel: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.4)",
    marginBottom: 4,
    fontWeight: "500",
  },
  yieldMetricValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#ffffff",
  },
  yieldMetricDivider: {
    width: 1,
    height: 20,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
  },
  progressSection: {
    width: "100%",
  },
  progressLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressLabelLeft: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.6)",
    fontWeight: "600",
  },
  progressLabelRight: {
    fontSize: 10,
    color: "#52B788",
    fontWeight: "bold",
  },
  progressBarBg: {
    width: "100%",
    height: 8,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#52B788",
    borderRadius: 4,
  },
  progressStatusText: {
    fontSize: 8.5,
    color: "rgba(255, 255, 255, 0.35)",
    fontStyle: "italic",
  },
  alertBanner: {
    width: "90%",
    backgroundColor: "rgba(233, 196, 106, 0.08)",
    borderRadius: 14,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.2)",
    marginBottom: 10,
  },
  alertTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#E9C46A",
    marginBottom: 2,
  },
  alertText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.7)",
    lineHeight: 15,
  },
  divider: {
    width: "90%",
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    marginVertical: 10,
  },
  emptyContainer: {
    width: "90%",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    borderStyle: "dashed",
    marginVertical: 10,
  },
  emptyIconWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.45)",
    textAlign: "center",
    lineHeight: 18,
  },
});

export default Home;
