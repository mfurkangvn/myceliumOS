import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./Home/Home";
import NewRoom from "./Newroom/NewRoom";
import Room from "./Room/Room";
import Start from "./Start/Start";
import { RoomContext } from "../RoomContext";

const Stack = createNativeStackNavigator();

export const Navigator = () => {
  const { userProfile } = useContext(RoomContext);
  const initialRoute = userProfile ? "Home" : "Start";

  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerStyle: {
          backgroundColor: "#081C15",
        },
        headerTintColor: "#fff",
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="Start"
        component={Start}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NewRoom"
        component={NewRoom}
        options={{ title: "myceliumOS" }}
      />
      <Stack.Screen
        name="Room"
        component={Room}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};
