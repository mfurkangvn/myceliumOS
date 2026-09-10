import React, { createContext, useState, useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  registerForPushNotificationsAsync,
  scheduleDynamicReminders,
  cancelAllScheduledNotifications,
} from "./utils/notificationHelper";

export const RoomContext = createContext();

const STORAGE_KEY = "@myceliumOS_rooms";
const PROFILE_KEY = "@myceliumOS_userProfile";
const NOTIFICATION_SETTINGS_KEY = "@myceliumOS_notificationSettings";

export const RoomProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    enabled: false,
    morningTime: "09:00",
    eveningTime: "19:00",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const persistQueueRef = useRef(Promise.resolve());

  // Uygulama ilk açıldığında kaydedilmiş odaları ve profil bilgilerini yükleme
  useEffect(() => {
    const loadAppData = async () => {
      try {
        const storedRooms = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedRooms !== null) {
          setRooms(JSON.parse(storedRooms));
        }

        const storedProfile = await AsyncStorage.getItem(PROFILE_KEY);
        if (storedProfile !== null) {
          setUserProfile(JSON.parse(storedProfile));
        }

        const storedNotificationSettings = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
        if (storedNotificationSettings !== null) {
          setNotificationSettings(JSON.parse(storedNotificationSettings));
        }
      } catch (error) {
        console.error("AsyncStorage verileri yüklenemedi:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAppData();
  }, []);

  // Odaları cihaz hafızasına kaydetme
  useEffect(() => {
    if (isLoading) return;

    const serializedRooms = JSON.stringify(rooms);
    persistQueueRef.current = persistQueueRef.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(STORAGE_KEY, serializedRooms))
      .catch((error) => {
        console.error("AsyncStorage'a odalar kaydedilemedi:", error);
      });
  }, [rooms, isLoading]);

  // Bildirimleri oda durumlarına veya ayarlara göre dinamik olarak planlama/güncelleme
  useEffect(() => {
    if (isLoading) return;

    const syncNotifications = async () => {
      try {
        if (notificationSettings && notificationSettings.enabled) {
          await scheduleDynamicReminders(
            rooms,
            notificationSettings.morningTime,
            notificationSettings.eveningTime
          );
        } else {
          await cancelAllScheduledNotifications();
        }
      } catch (error) {
        console.error("Dinamik bildirimler senkronize edilirken hata oluştu:", error);
      }
    };

    syncNotifications();
  }, [rooms, notificationSettings, isLoading]);

  // Profil Kaydetme
  const saveUserProfile = async (profileData) => {
    try {
      setUserProfile(profileData);
      await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(profileData));
    } catch (error) {
      console.error("Profil kaydedilemedi:", error);
    }
  };

  // Profil ve Hesap Silme
  const deleteUserProfile = async () => {
    try {
      setUserProfile(null);
      await AsyncStorage.removeItem(PROFILE_KEY);
    } catch (error) {
      console.error("Profil silinemedi:", error);
    }
  };

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  const addRoom = (newRoom) => {
    setRooms((prev) => {
      const updated = [
        ...prev,
        {
          ...newRoom,
          logs: {},
          harvestLogs: {},
          isScratchDone: false,
          scratchTimestamp: null,
          isPinSpotted: false,
          pinTimestamp: null,
        },
      ];
      return updated;
    });
  };

  const deleteRoom = (roomId) => {
    setRooms((prev) => {
      const updated = prev.filter((r) => String(r.id) !== String(roomId));
      return updated;
    });
  };

  const updateRoomLog = (roomId, dateKey, session, logData) => {
    setRooms((prev) => {
      const updated = prev.map((r) => {
        if (String(r.id) === String(roomId)) {
          const currentLogs = r.logs || {};
          const dayLogs = currentLogs[dateKey] || {};
          const updatedDayLogs = {
            ...dayLogs,
            [session]: {
              ...logData,
              updatedAt: new Date().toLocaleTimeString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
              }),
            },
          };
          return {
            ...r,
            logs: {
              ...currentLogs,
              [dateKey]: updatedDayLogs,
            },
          };
        }
        return r;
      });
      return updated;
    });
  };

  const addHarvestLog = (roomId, dateKey, weightKg) => {
    setRooms((prev) => {
      const updated = prev.map((r) => {
        if (String(r.id) === String(roomId)) {
          const currentHarvest = r.harvestLogs || {};
          const updatedHarvest = {
            ...currentHarvest,
            [dateKey]: parseFloat(weightKg) || 0,
          };
          return {
            ...r,
            harvestLogs: updatedHarvest,
          };
        }
        return r;
      });
      return updated;
    });
  };

  const toggleScratchStatus = (roomId) => {
    setRooms((prev) => {
      const updated = prev.map((r) => {
        if (String(r.id) === String(roomId)) {
          const nextState = !r.isScratchDone;
          return {
            ...r,
            isScratchDone: nextState,
            scratchDoneAt: nextState
              ? new Date().toLocaleDateString("tr-TR")
              : null,
            scratchTimestamp: nextState ? Date.now() : null,
          };
        }
        return r;
      });
      return updated;
    });
  };

  const togglePinStatus = (roomId) => {
    setRooms((prev) => {
      const updated = prev.map((r) => {
        if (String(r.id) === String(roomId)) {
          const nextState = !r.isPinSpotted;
          return {
            ...r,
            isPinSpotted: nextState,
            pinSpottedAt: nextState
              ? new Date().toLocaleDateString("tr-TR")
              : null,
            pinTimestamp: nextState ? Date.now() : null,
          };
        }
        return r;
      });
      return updated;
    });
  };

  const updateNotificationSettings = async (newSettings) => {
    try {
      if (newSettings.enabled) {
        const hasPermission = await registerForPushNotificationsAsync();
        if (!hasPermission) {
          const disabledSettings = { ...newSettings, enabled: false };
          setNotificationSettings(disabledSettings);
          await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(disabledSettings));
          return { success: false, error: "permission_denied" };
        }
        await scheduleDynamicReminders(rooms, newSettings.morningTime, newSettings.eveningTime);
      } else {
        await cancelAllScheduledNotifications();
      }

      setNotificationSettings(newSettings);
      await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(newSettings));
      return { success: true };
    } catch (error) {
      console.error("Bildirim ayarları kaydedilemedi:", error);
      return { success: false, error: error.message };
    }
  };

  return (
    <RoomContext.Provider
      value={{
        rooms,
        userProfile,
        saveUserProfile,
        deleteUserProfile,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addRoom,
        deleteRoom,
        updateRoomLog,
        addHarvestLog,
        toggleScratchStatus,
        togglePinStatus,
        isLoading,
        notificationSettings,
        updateNotificationSettings,
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
