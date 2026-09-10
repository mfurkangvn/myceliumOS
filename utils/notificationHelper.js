import { isRunningInExpoGo } from "expo";
import { Platform } from "react-native";
import { getIncubationDayData, scratchedDaysData, harvestDaysData } from "../data/daysData";
import { getElapsedDays, getElapsedDaysFromTimestamp } from "./dateUtils";

// expo-notifications SDK 53+ ile Android Expo Go içinde çalıştırıldığında hata fırlatır.
// Bu yüzden yalnızca Expo Go dışındayken (APK ve Standalone ortamlarda) yüklenir.
let Notifications = null;
if (!isRunningInExpoGo()) {
  try {
    Notifications = require("expo-notifications");
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
  } catch (e) {
    console.warn("expo-notifications yüklenemedi:", e);
  }
}

/**
 * Registers notification channel (for Android) and requests user permission.
 * @returns {Promise<boolean>} True if permission granted, otherwise false.
 */
export async function registerForPushNotificationsAsync() {
  if (isRunningInExpoGo() || !Notifications) {
    return false;
  }

  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#E9C46A",
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    return finalStatus === "granted";
  } catch (e) {
    console.warn("registerForPushNotificationsAsync hatası:", e);
    return false;
  }
}

/**
 * Calculates a room's target data for a given future offset in days.
 * @param {object} room - Room object from state
 * @param {number} futureDaysOffset - Number of days in the future (0 = today, 1 = tomorrow, etc.)
 */
export function getRoomDataForFutureDay(room, futureDaysOffset) {
  // Base elapsed days calculation
  const elapsedDays = getElapsedDays(room.date) + futureDaysOffset;
  
  if (room.isPinSpotted) {
    const pinDays = getElapsedDaysFromTimestamp(room.pinTimestamp) + futureDaysOffset;
    const target = harvestDaysData[pinDays] || harvestDaysData[10] || harvestDaysData[1];
    return {
      stage: "Pin & Hasat Evresi",
      day: pinDays,
      title: target?.title || "Pin & Hasat Evresi",
      warning: target?.warning || null,
      tasks: target?.tasks || [],
    };
  } else if (room.isScratchDone) {
    const scratchDays = getElapsedDaysFromTimestamp(room.scratchTimestamp) + futureDaysOffset;
    const target = scratchedDaysData[scratchDays] || scratchedDaysData[10] || scratchedDaysData[1];
    return {
      stage: "Çizik & Sarım Evresi",
      day: scratchDays,
      title: target?.title || "Çizik & Sarım Evresi",
      warning: target?.warning || null,
      tasks: target?.tasks || [],
    };
  } else {
    const target = getIncubationDayData(elapsedDays);
    return {
      stage: "Kuluçka Evresi",
      day: elapsedDays,
      title: target?.title || "Kuluçka Evresi",
      warning: target?.warning || null,
      tasks: target?.tasks || [],
    };
  }
}

/**
 * Generates appropriate title and body for a notification at a future date offset.
 * @param {Array} rooms - List of active rooms
 * @param {number} futureDaysOffset - Date offset
 * @param {boolean} isMorning - Morning vs evening reminder
 */
export function generateNotificationText(rooms, futureDaysOffset, isMorning) {
  const timeLabel = isMorning ? "Sabah Ölçümü" : "Akşam Ölçümü";
  const emoji = isMorning ? "☀️" : "🌙";

  if (!rooms || rooms.length === 0) {
    return {
      title: `${timeLabel} Hatırlatıcısı ${emoji}`,
      body: isMorning
        ? "Mantar odanızın sabah iklim verilerini kaydetmeyi unutmayın!"
        : "Mantar odanızın akşam iklim verilerini kaydetmeyi unutmayın!",
    };
  }

  if (rooms.length === 1) {
    const room = rooms[0];
    const info = getRoomDataForFutureDay(room, futureDaysOffset);
    
    let body = `Gelişim: ${info.day}. Gün. İklim verilerini kaydetme zamanı.`;
    if (info.warning) {
      body = `⚠️ ${info.warning.replace(/⚠️/g, "").trim()}`;
    } else if (info.tasks && info.tasks.length > 0) {
      body = `Görev: ${info.tasks[0].replace(/[🔍📌💧🌡️🌾]/g, "").trim()}`;
    }

    return {
      title: `${room.name} - ${timeLabel} ${emoji}`,
      body: body.length > 120 ? body.substring(0, 117) + "..." : body,
    };
  } else {
    // Multiple rooms check: priority on warnings
    let warningRoom = null;
    let warningText = null;

    for (const room of rooms) {
      const info = getRoomDataForFutureDay(room, futureDaysOffset);
      if (info.warning) {
        warningRoom = room;
        warningText = info.warning;
        break;
      }
    }

    if (warningText) {
      const cleanWarning = warningText.replace(/⚠️/g, "").trim();
      return {
        title: `Kritik Uyarı ${emoji} (${rooms.length} Oda)`,
        body: `${warningRoom.name}: ${cleanWarning}`.substring(0, 120),
      };
    }

    // Default aggregated rooms summary text
    const roomDetails = rooms.map(room => {
      const info = getRoomDataForFutureDay(room, futureDaysOffset);
      return `${room.name} (${info.stage})`;
    }).join(", ");

    return {
      title: `${rooms.length} Mantar Odası ${emoji}`,
      body: `${timeLabel} Zamanı. Odalar: ${roomDetails}`.substring(0, 120),
    };
  }
}

/**
 * Schedules daily morning and evening reminders for the next 7 days based on room tasks.
 * @param {Array} rooms - Active rooms from state
 * @param {string} morningTimeStr - Format: "HH:MM", e.g. "09:00"
 * @param {string} eveningTimeStr - Format: "HH:MM", e.g. "19:00"
 */
export async function scheduleDynamicReminders(rooms, morningTimeStr, eveningTimeStr) {
  if (isRunningInExpoGo() || !Notifications) {
    return;
  }

  try {
    // Clear any existing notifications before scheduling new ones to prevent overlaps
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule for the next 7 days (day 0 to day 6)
    for (let i = 0; i < 7; i++) {
      // Morning reminder
      if (morningTimeStr) {
        const triggerDate = new Date();
        triggerDate.setDate(triggerDate.getDate() + i);
        const [mHour, mMinute] = morningTimeStr.split(":").map(Number);
        triggerDate.setHours(mHour, mMinute, 0, 0);

        if (triggerDate.getTime() > Date.now()) {
          const text = generateNotificationText(rooms, i, true);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: text.title,
              body: text.body,
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: triggerDate,
            },
          });
        }
      }

      // Evening reminder
      if (eveningTimeStr) {
        const triggerDate = new Date();
        triggerDate.setDate(triggerDate.getDate() + i);
        const [eHour, eMinute] = eveningTimeStr.split(":").map(Number);
        triggerDate.setHours(eHour, eMinute, 0, 0);

        if (triggerDate.getTime() > Date.now()) {
          const text = generateNotificationText(rooms, i, false);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: text.title,
              body: text.body,
              sound: true,
            },
            trigger: {
              type: Notifications.SchedulableTriggerInputTypes.DATE,
              date: triggerDate,
            },
          });
        }
      }
    }
  } catch (e) {
    console.warn("scheduleDynamicReminders hatası:", e);
  }
}

/**
 * Triggers a one-off test notification after 5 seconds.
 */
export async function triggerTestNotification() {
  if (isRunningInExpoGo() || !Notifications) {
    return false;
  }

  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Mantar Asistanı 🍄",
        body: "Harika! Bildirim sisteminiz başarıyla çalışıyor.",
        sound: true,
      },
      trigger: {
        seconds: 5,
      },
    });
    return true;
  } catch (e) {
    console.warn("triggerTestNotification hatası:", e);
    return false;
  }
}

/**
 * Cancels all scheduled local notifications.
 */
export async function cancelAllScheduledNotifications() {
  if (isRunningInExpoGo() || !Notifications) {
    return;
  }

  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (e) {
    console.warn("cancelAllScheduledNotifications hatası:", e);
  }
}
