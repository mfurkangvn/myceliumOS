import React, { useContext, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { RoomContext } from "../../RoomContext";

const NewRoom = () => {
  const navigation = useNavigation();
  const { addRoom } = useContext(RoomContext);

  const [name, setName] = useState("");
  const [productionPlace, setProductionPlace] = useState("");
  const [date, setDate] = useState("");
  const [focusedInput, setFocusedInput] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const isValidDate = (dateStr) => {
    const reg = /^(\d{2})\.(\d{2})\.(\d{4})$/;
    if (!reg.test(dateStr)) return false;

    const [, dStr, mStr, yStr] = dateStr.match(reg);
    const day = parseInt(dStr, 10);
    const month = parseInt(mStr, 10);
    const year = parseInt(yStr, 10);

    if (year < 2000 || year > 2100) return false;
    if (month < 1 || month > 12) return false;

    const maxDays = new Date(year, month, 0).getDate();
    return day >= 1 && day <= maxDays;
  };

  const handleDateChange = (text) => {
    const cleaned = text.replace(/[^0-9]/g, "");
    let formatted = "";

    if (cleaned.length <= 2) {
      formatted = cleaned;
    } else if (cleaned.length <= 4) {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2)}`;
    } else {
      formatted = `${cleaned.slice(0, 2)}.${cleaned.slice(2, 4)}.${cleaned.slice(4, 8)}`;
    }

    setDate(formatted);
  };

  const parseCompostWeight = (value) => {
    const normalized = value.trim().replace(",", ".");
    if (!/^\d+(\.\d+)?(?:\s*kg)?$/i.test(normalized)) return null;

    const weight = Number.parseFloat(normalized);
    return Number.isFinite(weight) && weight > 0 ? weight : null;
  };

  const handleStartProduction = () => {
    const isDateValid = date.length === 10 && isValidDate(date);
    const compostWeight = parseCompostWeight(productionPlace);

    if (!name.trim() || !productionPlace.trim() || !isDateValid) {
      setAlertMessage("Lütfen oda adı, kompost miktarı ve geçerli başlangıç tarihini girin.");
      setShowAlert(true);
      return;
    }

    if (compostWeight === null) {
      setAlertMessage("Kompost miktarını 0'dan büyük bir sayı olarak girin. Örnek: 1000 veya 1000,5 kg.");
      setShowAlert(true);
      return;
    }

    const newRoomObj = {
      id: Date.now(),
      name: name.trim(),
      productionPlace: String(compostWeight),
      date: date,
    };

    addRoom(newRoomObj);

    navigation.replace("Room", newRoomObj);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header/Banner Section */}
          <View style={styles.headerContainer}>
            <View style={styles.iconWrapper}>
              <FontAwesome5 name="plus-circle" size={32} color="#E9C46A" />
            </View>
            <Text style={styles.title}>Yeni Üretim Başlat</Text>
            <Text style={styles.subtitle}>
              Mantar odasının fiziksel ve üretim detaylarını girerek yeni bir
              izleme döngüsü başlatın.
            </Text>
          </View>

          {/* Form Card */}
          <View style={styles.card}>
            {/* Input 1: Oda Adı */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>ODA ADI</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === "name" && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="home-outline"
                  size={20}
                  color={
                    focusedInput === "name"
                      ? "#E9C46A"
                      : "rgba(255, 255, 255, 0.4)"
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="örn: Oda 1, Kuluçka Bölümü"
                  placeholderTextColor="rgba(255, 255, 255, 0.25)"
                  value={name}
                  onChangeText={setName}
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Input 2: Kompost Miktarı */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>KOMPOST MİKTARI</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === "productionPlace" &&
                    styles.inputWrapperFocused,
                ]}
              >
                <FontAwesome5
                  name="weight-hanging"
                  size={16}
                  color={
                    focusedInput === "productionPlace"
                      ? "#E9C46A"
                      : "rgba(255, 255, 255, 0.4)"
                  }
                  style={[styles.inputIcon, { marginRight: 12, marginLeft: 2 }]}
                />
                <TextInput
                  style={styles.input}
                  placeholder="örn: 1000 kg"
                  placeholderTextColor="rgba(255, 255, 255, 0.25)"
                  keyboardType="numeric"
                  value={productionPlace}
                  onChangeText={setProductionPlace}
                  onFocus={() => setFocusedInput("productionPlace")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Input 3: Başlangıç Tarihi */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>BAŞLANGIÇ TARİHİ</Text>
              <View
                style={[
                  styles.inputWrapper,
                  focusedInput === "date" && styles.inputWrapperFocused,
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={
                    focusedInput === "date"
                      ? "#E9C46A"
                      : "rgba(255, 255, 255, 0.4)"
                  }
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="örn: 16.07.2026"
                  placeholderTextColor="rgba(255, 255, 255, 0.25)"
                  keyboardType="numeric"
                  maxLength={10}
                  value={date}
                  onChangeText={handleDateChange}
                  onFocus={() => setFocusedInput("date")}
                  onBlur={() => setFocusedInput(null)}
                />
              </View>
            </View>

            {/* Action Button */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.button,
                (!name.trim() ||
                  !productionPlace.trim() ||
                  date.length !== 10) &&
                  styles.buttonDisabled,
              ]}
              onPress={handleStartProduction}
            >
              <Ionicons
                name="play-circle-outline"
                size={22}
                color="#081C15"
                style={{ marginRight: 6 }}
              />
              <Text style={styles.textButton}>Üretim Döngüsünü Başlat</Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#E9C46A"
            />
            <Text style={styles.infoText}>
              Oda oluşturulduktan sonra varsayılan mantar gelişim evresi
              hedefleri otomatik olarak atanır ve izleme aktifleşir.
            </Text>
          </View>
          <Modal transparent={true} visible={showAlert} animationType="fade">
            <View style={styles.overlay}>
              <BlurView
                intensity={50}
                tint="dark"
                style={StyleSheet.absoluteFill}
              />
              <BlurView intensity={85} tint="dark" style={styles.alertBox}>
                <Text style={styles.alertTitle}>Önemli</Text>

                <Text style={styles.alertMessage}>{alertMessage}</Text>

                <Pressable
                  style={styles.Aletbutton}
                  onPress={() => setShowAlert(false)}
                >
                  <Text style={styles.buttonText}>Tamam</Text>
                </Pressable>
              </BlurView>
            </View>
          </Modal>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

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
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 25,
    width: "100%",
  },
  iconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(233, 196, 106, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.2)",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    paddingHorizontal: 15,
    lineHeight: 18,
  },
  card: {
    width: "100%",
    backgroundColor: "#112A20",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.4)",
    marginBottom: 6,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 52,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  inputWrapperFocused: {
    borderColor: "#E9C46A",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#ffffff",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#E9C46A",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#E9C46A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: "rgba(233, 196, 106, 0.35)",
    shadowOpacity: 0,
    elevation: 0,
  },
  textButton: {
    color: "#081C15",
    fontSize: 15,
    fontWeight: "bold",
  },
  infoBox: {
    width: "100%",
    backgroundColor: "rgba(233, 196, 106, 0.05)",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.1)",
  },
  infoText: {
    flex: 1,
    color: "rgba(255, 255, 255, 0.55)",
    fontSize: 12,
    lineHeight: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },

  alertBox: {
    width: "80%",
    padding: 25,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "rgba(17, 42, 32, 0.7)",
    borderWidth: 1,
    borderColor: "rgba(233, 196, 106, 0.2)",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,

    elevation: 10,
  },

  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#E9C46A",
    marginBottom: 10,
    textAlign: "center",
  },

  alertMessage: {
    fontSize: 15,
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 20,
  },

  Aletbutton: {
    backgroundColor: "#E9C46A",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#E9C46A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },

  buttonText: {
    color: "#081C15",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default NewRoom;
