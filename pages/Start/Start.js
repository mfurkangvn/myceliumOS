import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { RoomContext } from "../../RoomContext";

export default function Start() {
  const navigation = useNavigation();
  const { saveUserProfile } = useContext(RoomContext);

  const [name, setName] = useState("");
  const [productionPlace, setProductionPlace] = useState("");

  const handleCreateProfile = () => {
    if (!name.trim() || !productionPlace.trim()) {
      Alert.alert(
        "Eksik Bilgi",
        "Lütfen Ad Soyad ve Üretim Tesis Adını doldurunuz."
      );
      return;
    }

    const profileData = {
      name: name.trim(),
      productionPlace: productionPlace.trim(),
      createdAt: new Date().toLocaleDateString("tr-TR"),
    };

    saveUserProfile(profileData);
    navigation.reset({
      index: 0,
      routes: [{ name: "Home" }],
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#081C15" />
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Branding */}
          <View style={styles.brandContainer}>
            <View style={styles.logoBadge}>
              <FontAwesome6 name="leaf" size={28} color="#E9C46A" />
            </View>
            <Text style={styles.appName}>myceliumOS</Text>
            <Text style={styles.appTagline}>
              Akıllı Mantar Üretim & İklim Takip Sistemi
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Hesap ve Tesis Kaydı</Text>
            <Text style={styles.cardSubtitle}>
              İstridye mantarı üretim tesisinizi dijitalleştirmek için bilgilerinizi giriniz.
            </Text>

            {/* Input 1: Ad Soyad */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>AD SOYAD *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="person-outline"
                  size={18}
                  color="#E9C46A"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="örn: Mustafa Furkan"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={name}
                  onChangeText={setName}
                />
              </View>
            </View>

            {/* Input 2: Üretim Yeri */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>ÜRETİM YERİ / TESİS ADI *</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="business-outline"
                  size={18}
                  color="#E9C46A"
                  style={{ marginRight: 10 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="örn: Merkez Mantar Tesisi"
                  placeholderTextColor="rgba(255, 255, 255, 0.3)"
                  value={productionPlace}
                  onChangeText={setProductionPlace}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                (!name.trim() || !productionPlace.trim()) &&
                  styles.submitBtnDisabled,
              ]}
              onPress={handleCreateProfile}
              activeOpacity={0.8}
            >
              <Text style={styles.submitBtnText}>Hesabı Oluştur ve Başla</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#081C15"
                style={{ marginLeft: 6 }}
              />
            </TouchableOpacity>
          </View>

          {/* Privacy Note */}
          <View style={styles.infoBadge}>
            <Ionicons
              name="shield-checkmark-outline"
              size={18}
              color="#52B788"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.infoText}>
              Bilgileriniz sadece kendi cihazınızda güvenle saklanır ve üretim döngülerinize özel rehber sunmak için kullanılır.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#081C15",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    justifyContent: "center",
  },
  brandContainer: {
    alignItems: "center",
    marginBottom: 26,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(233, 196, 106, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.3)",
    marginBottom: 12,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  appTagline: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 4,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#112A20",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#E9C46A",
    marginBottom: 6,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.6)",
    lineHeight: 18,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.25)",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  input: {
    flex: 1,
    color: "#ffffff",
    fontSize: 14,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E9C46A",
    height: 48,
    borderRadius: 14,
    marginTop: 10,
  },
  submitBtnDisabled: {
    backgroundColor: "rgba(233, 196, 106, 0.35)",
  },
  submitBtnText: {
    color: "#081C15",
    fontSize: 14,
    fontWeight: "bold",
  },
  infoBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(82, 183, 136, 0.1)",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(82, 183, 136, 0.2)",
  },
  infoText: {
    flex: 1,
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 11,
    lineHeight: 16,
  },
});
