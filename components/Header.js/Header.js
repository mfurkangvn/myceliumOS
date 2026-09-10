import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { RoomContext } from "../../RoomContext";

const Header = ({ title }) => {
  const navigation = useNavigation();
  const { openDrawer } = useContext(RoomContext);

  const bugun = new Date();
  const aylar = [
    "Ocak",
    "Şubat",
    "Mart",
    "Nisan",
    "Mayıs",
    "Haziran",
    "Temmuz",
    "Ağustos",
    "Eylül",
    "Ekim",
    "Kasım",
    "Aralık",
  ];

  const formattedDate = `${bugun.getDate()} ${aylar[bugun.getMonth()]} ${bugun.getFullYear()}`;

  return (
    <View style={styles.headerContainer}>
      {/* Left Row (Menu Button + Title) */}
      <View style={styles.leftRow}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={openDrawer}
          activeOpacity={0.7}
        >
          <Ionicons name="menu-outline" size={24} color="#E9C46A" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          activeOpacity={0.7}
        >
          <Text style={styles.appTitle}>{title || "Mantar Asistanı"}</Text>
          <Text style={styles.headerSubtitle}>Mantar Üretim Kontrol Paneli</Text>
        </TouchableOpacity>
      </View>

      {/* Date Badge (Right side) */}
      <View style={styles.dateBadge}>
        <Ionicons name="calendar-outline" size={13} color="#E9C46A" />
        <Text style={styles.dateText}>{formattedDate}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "rgba(233, 196, 106, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.25)",
  },
  appTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 1,
  },
  dateBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  dateText: {
    color: "#E9C46A",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
});

export default Header;
