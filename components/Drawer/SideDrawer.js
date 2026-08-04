import React, { useContext, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  Alert,
  Dimensions,
  PanResponder,
} from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { RoomContext } from "../../RoomContext";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SideDrawer = () => {
  const navigation = useNavigation();
  const {
    isDrawerOpen,
    openDrawer,
    closeDrawer,
    userProfile,
    deleteUserProfile,
    rooms,
  } = useContext(RoomContext);

  // Swipe gesture for opening from left edge when closed
  const openPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: (evt) => {
        return evt.nativeEvent.pageX <= 45;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return evt.nativeEvent.pageX <= 45 && gestureState.dx > 10;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 20) {
          openDrawer();
        }
      },
    })
  ).current;

  // Swipe gesture for closing when open (swiping towards left)
  const closePanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return gestureState.dx < -15;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -25) {
          closeDrawer();
        }
      },
    })
  ).current;

  const handleNavigate = (screenName) => {
    closeDrawer();
    navigation.navigate(screenName);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Hesabı Sil",
      `"${userProfile?.name || "Kullanıcı"}" profilini ve kayıtlı tesis bilgilerini silmek istediğinize emin misiniz?\n\nBu işlem sonucunda tekrar kayıt sayfasına yönlendirileceksiniz.`,
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Evet, Sil",
          style: "destructive",
          onPress: async () => {
            closeDrawer();
            await deleteUserProfile();
            navigation.reset({
              index: 0,
              routes: [{ name: "Start" }],
            });
          },
        },
      ]
    );
  };

  return (
    <>
      {/* Dynamic Left Edge Swipe Strip when drawer is closed */}
      {!isDrawerOpen && (
        <View
          style={styles.leftSwipeEdge}
          {...openPanResponder.panHandlers}
        />
      )}

      {/* Drawer Modal */}
      {isDrawerOpen && (
        <Modal
          transparent={true}
          visible={isDrawerOpen}
          animationType="fade"
          onRequestClose={closeDrawer}
        >
          <View style={styles.overlayContainer}>
            {/* Backdrop Blur Pressable */}
            <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
              <Pressable style={styles.backdropPressable} onPress={closeDrawer} />
            </BlurView>

            {/* Left Aligned Compact Drawer Panel (55% Width) */}
            <View
              style={styles.drawerPanelLeft}
              {...closePanResponder.panHandlers}
            >
              {/* Top Profile Card */}
              <View style={styles.profileSection}>
                <View style={styles.avatarCircle}>
                  <FontAwesome6 name="user-large" size={16} color="#E9C46A" />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.userName} numberOfLines={1}>
                    {userProfile?.name || "Üretici"}
                  </Text>
                  <Text style={styles.userFacility} numberOfLines={1}>
                    {userProfile?.productionPlace || "Tesis Adı Girilmedi"}
                  </Text>
                  <View style={styles.statusBadge}>
                    <View style={styles.dot} />
                    <Text style={styles.statusText}>Aktif Üretici</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={closeDrawer}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={18} color="rgba(255,255,255,0.6)" />
                </TouchableOpacity>
              </View>

              {/* Middle Navigation Links */}
              <View style={styles.menuSection}>
                <Text style={styles.sectionHeaderTitle}>NAVİGASYON</Text>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("Home")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="home-outline" size={16} color="#E9C46A" />
                  <Text style={styles.menuItemText}>Ana Sayfa</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.menuItem}
                  onPress={() => handleNavigate("NewRoom")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="add-circle-outline" size={16} color="#52B788" />
                  <Text style={styles.menuItemText}>Yeni Oda</Text>
                </TouchableOpacity>

                <View style={styles.summaryBox}>
                  <Text style={styles.summaryLabel}>KAYITLI ODALAR</Text>
                  <Text style={styles.summaryVal}>{rooms.length} Aktif Oda</Text>
                </View>
              </View>

              {/* Bottom Settings Section */}
              <View style={styles.settingsSection}>
                <Text style={styles.sectionHeaderTitle}>⚙️ AYARLAR</Text>

                <View style={styles.versionRow}>
                  <Ionicons name="information-circle-outline" size={15} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.versionText}>myceliumOS v1.0.0</Text>
                </View>

                {/* Delete Account Button */}
                <TouchableOpacity
                  style={styles.deleteAccountBtn}
                  onPress={handleDeleteAccount}
                  activeOpacity={0.8}
                >
                  <Ionicons name="trash-outline" size={15} color="#FF6B6B" style={{ marginRight: 6 }} />
                  <Text style={styles.deleteAccountBtnText}>Hesabı Sil</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  leftSwipeEdge: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 35,
    zIndex: 9999,
    backgroundColor: "transparent",
  },
  overlayContainer: {
    flex: 1,
    flexDirection: "row",
  },
  backdropPressable: {
    flex: 1,
  },
  drawerPanelLeft: {
    width: "56%", // Compact half screen width
    backgroundColor: "#081C15",
    height: "100%",
    paddingTop: 45,
    paddingHorizontal: 12,
    paddingBottom: 24,
    borderRightWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#112A20",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.2)",
    gap: 8,
  },
  avatarCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(233, 196, 106, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E9C46A",
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
  },
  userFacility: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 10,
    marginTop: 1,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#52B788",
    marginRight: 4,
  },
  statusText: {
    color: "#52B788",
    fontSize: 9,
    fontWeight: "bold",
  },
  closeBtn: {
    padding: 2,
  },
  menuSection: {
    flex: 1,
    marginTop: 20,
  },
  sectionHeaderTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 8,
    gap: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  menuItemText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "600",
  },
  summaryBox: {
    backgroundColor: "rgba(233, 196, 106, 0.05)",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.15)",
  },
  summaryLabel: {
    fontSize: 8,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    marginBottom: 2,
  },
  summaryVal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#E9C46A",
  },
  settingsSection: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    paddingTop: 12,
  },
  versionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  versionText: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 11,
  },
  deleteAccountBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 107, 107, 0.12)",
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.3)",
  },
  deleteAccountBtnText: {
    color: "#FF6B6B",
    fontSize: 11,
    fontWeight: "bold",
  },
});

export default SideDrawer;
