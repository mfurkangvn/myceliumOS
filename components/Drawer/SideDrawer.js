import React, { useContext, useRef, useState, useEffect } from "react";
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
  Switch,
  TextInput,
} from "react-native";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useNavigation } from "@react-navigation/native";
import { RoomContext } from "../../RoomContext";
import { triggerTestNotification } from "../../utils/notificationHelper";

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
    notificationSettings,
    updateNotificationSettings,
  } = useContext(RoomContext);

  // Notification states
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [morningHour, setMorningHour] = useState("09");
  const [morningMinute, setMorningMinute] = useState("00");
  const [eveningHour, setEveningHour] = useState("19");
  const [eveningMinute, setEveningMinute] = useState("00");

  // Sync state when modal opens or settings change
  useEffect(() => {
    if (notificationSettings) {
      setNotifEnabled(notificationSettings.enabled ?? false);
      const [mH, mM] = (notificationSettings.morningTime || "09:00").split(":");
      const [eH, eM] = (notificationSettings.eveningTime || "19:00").split(":");
      setMorningHour(mH || "09");
      setMorningMinute(mM || "00");
      setEveningHour(eH || "19");
      setEveningMinute(eM || "00");
    }
  }, [isNotificationModalOpen, notificationSettings]);

  const handleSaveNotifications = async () => {
    const mH = parseInt(morningHour, 10);
    const mM = parseInt(morningMinute, 10);
    const eH = parseInt(eveningHour, 10);
    const eM = parseInt(eveningMinute, 10);

    if (
      isNaN(mH) || mH < 0 || mH > 23 ||
      isNaN(mM) || mM < 0 || mM > 59 ||
      isNaN(eH) || eH < 0 || eH > 23 ||
      isNaN(eM) || eM < 0 || eM > 59
    ) {
      Alert.alert("Geçersiz Zaman", "Lütfen geçerli saat (0-23) ve dakika (0-59) giriniz.");
      return;
    }

    const morningTime = `${String(mH).padStart(2, "0")}:${String(mM).padStart(2, "0")}`;
    const eveningTime = `${String(eH).padStart(2, "0")}:${String(eM).padStart(2, "0")}`;

    const res = await updateNotificationSettings({
      enabled: notifEnabled,
      morningTime,
      eveningTime,
    });

    if (res.success) {
      Alert.alert("Başarılı", "Bildirim ayarlarınız güncellendi.");
      setIsNotificationModalOpen(false);
    } else if (res.error === "permission_denied") {
      Alert.alert(
        "İzin Reddedildi",
        "Bildirim gönderebilmek için cihaz ayarlarından uygulamaya bildirim izni vermeniz gerekmektedir."
      );
    } else {
      Alert.alert("Hata", "Bildirim ayarları kaydedilirken hata oluştu: " + res.error);
    }
  };

  const handleTestNotification = async () => {
    await triggerTestNotification();
    Alert.alert("Test Bildirimi", "5 saniye içerisinde test bildirimi cihazınıza ulaşacaktır.");
  };

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

  if (!userProfile) {
    return null;
  }

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

                {/* Notification Settings Button */}
                <TouchableOpacity
                  style={styles.settingsBtn}
                  onPress={() => {
                    closeDrawer();
                    setIsNotificationModalOpen(true);
                  }}
                  activeOpacity={0.8}
                >
                  <Ionicons name="notifications-outline" size={15} color="#E9C46A" style={{ marginRight: 6 }} />
                  <Text style={styles.settingsBtnText}>Bildirim Ayarları</Text>
                </TouchableOpacity>

                <View style={styles.versionRow}>
                  <Ionicons name="information-circle-outline" size={15} color="rgba(255,255,255,0.4)" />
                  <Text style={styles.versionText}>Mantar Asistanı v1.0.0</Text>
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

      {/* Notification Settings Modal */}
      {isNotificationModalOpen && (
        <Modal
          transparent={true}
          visible={isNotificationModalOpen}
          animationType="fade"
          onRequestClose={() => setIsNotificationModalOpen(false)}
        >
          <View style={styles.modalOverlay}>
            <BlurView intensity={30} tint="dark" style={StyleSheet.absoluteFill}>
              <Pressable style={styles.backdropPressable} onPress={() => setIsNotificationModalOpen(false)} />
            </BlurView>

            <View style={styles.modalContainer}>
              {/* Header */}
              <View style={styles.modalHeader}>
                <View style={styles.modalIconWrapper}>
                  <Ionicons name="notifications-outline" size={20} color="#E9C46A" />
                </View>
                <Text style={styles.modalTitle}>Bildirim Ayarları</Text>
              </View>

              {/* Body */}
              <ScrollView contentContainerStyle={styles.modalBody} keyboardShouldPersistTaps="handled">
                <Text style={styles.modalSubtitle}>
                  Günlük sabah ve akşam ölçümlerini zamanında yapabilmeniz için hatırlatıcılar kurun.
                </Text>

                {/* Toggle Row */}
                <View style={styles.notifToggleRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.toggleLabel}>Günlük Hatırlatıcılar</Text>
                    <Text style={styles.toggleDesc}>
                      Bildirimleri açtığınızda sabah ve akşam saatlerinde uyarı alırsınız.
                    </Text>
                  </View>
                  <Switch
                    trackColor={{ false: "#1B3B2B", true: "#52B788" }}
                    thumbColor={notifEnabled ? "#E9C46A" : "#a1a1a1"}
                    ios_backgroundColor="#1B3B2B"
                    onValueChange={setNotifEnabled}
                    value={notifEnabled}
                  />
                </View>

                {/* Time Inputs (visible only if enabled) */}
                {notifEnabled && (
                  <View style={styles.timeInputsContainer}>
                    <Text style={styles.sectionLabel}>HATIRLATICI SAATLERİ</Text>

                    {/* Morning Reminder Time */}
                    <View style={styles.timeInputRow}>
                      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="sunny-outline" size={16} color="#E9C46A" style={{ marginRight: 8 }} />
                        <Text style={styles.timeLabel}>Sabah Hatırlatıcısı</Text>
                      </View>
                      <View style={styles.timePickerContainer}>
                        <TextInput
                          style={styles.timeInput}
                          keyboardType="numeric"
                          maxLength={2}
                          value={morningHour}
                          onChangeText={(val) => {
                            setMorningHour(val.replace(/[^0-9]/g, ""));
                          }}
                          placeholder="09"
                          placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                        <Text style={styles.timeSeparator}>:</Text>
                        <TextInput
                          style={styles.timeInput}
                          keyboardType="numeric"
                          maxLength={2}
                          value={morningMinute}
                          onChangeText={(val) => {
                            setMorningMinute(val.replace(/[^0-9]/g, ""));
                          }}
                          placeholder="00"
                          placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                      </View>
                    </View>

                    {/* Evening Reminder Time */}
                    <View style={styles.timeInputRow}>
                      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                        <Ionicons name="moon-outline" size={16} color="#52B788" style={{ marginRight: 8 }} />
                        <Text style={styles.timeLabel}>Akşam Hatırlatıcısı</Text>
                      </View>
                      <View style={styles.timePickerContainer}>
                        <TextInput
                          style={styles.timeInput}
                          keyboardType="numeric"
                          maxLength={2}
                          value={eveningHour}
                          onChangeText={(val) => {
                            setEveningHour(val.replace(/[^0-9]/g, ""));
                          }}
                          placeholder="19"
                          placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                        <Text style={styles.timeSeparator}>:</Text>
                        <TextInput
                          style={styles.timeInput}
                          keyboardType="numeric"
                          maxLength={2}
                          value={eveningMinute}
                          onChangeText={(val) => {
                            setEveningMinute(val.replace(/[^0-9]/g, ""));
                          }}
                          placeholder="00"
                          placeholderTextColor="rgba(255,255,255,0.3)"
                        />
                      </View>
                    </View>

                    {/* Test Button */}
                    <TouchableOpacity
                      style={styles.testBtn}
                      onPress={handleTestNotification}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="sparkles-outline" size={14} color="#E9C46A" style={{ marginRight: 6 }} />
                      <Text style={styles.testBtnText}>Test Bildirimi Gönder (5sn)</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </ScrollView>

              {/* Actions Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setIsNotificationModalOpen(false)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelBtnText}>İptal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalSaveBtn}
                  onPress={handleSaveNotifications}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalSaveBtnText}>Değişiklikleri Kaydet</Text>
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
  settingsBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(233, 196, 106, 0.1)",
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.25)",
    marginBottom: 10,
  },
  settingsBtnText: {
    color: "#E9C46A",
    fontSize: 11,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#081C15",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.2)",
    padding: 20,
    maxHeight: "80%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  modalIconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(233, 196, 106, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.3)",
  },
  modalTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
  modalBody: {
    paddingBottom: 16,
  },
  modalSubtitle: {
    color: "rgba(255, 255, 255, 0.5)",
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  notifToggleRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#112A20",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 16,
  },
  toggleLabel: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 2,
  },
  toggleDesc: {
    color: "rgba(255, 255, 255, 0.4)",
    fontSize: 10.5,
    lineHeight: 14,
  },
  timeInputsContainer: {
    backgroundColor: "#112A20",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  timeInputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  timeLabel: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 8,
    height: 36,
  },
  timeInput: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    width: 24,
    textAlign: "center",
    padding: 0,
  },
  timeSeparator: {
    color: "#E9C46A",
    fontWeight: "bold",
    marginHorizontal: 2,
  },
  testBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(233, 196, 106, 0.08)",
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.2)",
    marginTop: 8,
  },
  testBtnText: {
    color: "#E9C46A",
    fontSize: 11,
    fontWeight: "bold",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.08)",
    paddingTop: 14,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  modalCancelBtnText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 12,
    fontWeight: "600",
  },
  modalSaveBtn: {
    paddingHorizontal: 16,
    height: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E9C46A",
  },
  modalSaveBtnText: {
    color: "#081C15",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default SideDrawer;
