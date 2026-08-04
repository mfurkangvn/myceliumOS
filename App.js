import { StatusBar } from "expo-status-bar";
import React, { useContext } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Navigator } from "./pages/Navigator";
import { RoomContext, RoomProvider } from "./RoomContext";
import SideDrawer from "./components/Drawer/SideDrawer";

const AppContent = () => {
  const { isLoading } = useContext(RoomContext);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />
        <ActivityIndicator size="large" color="#E9C46A" />
        <Text style={styles.loadingText}>Profil ve Odalar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Navigator />
      <SideDrawer />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <RoomProvider>
      <AppContent />
    </RoomProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: "#081C15",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginTop: 14,
  },
});
