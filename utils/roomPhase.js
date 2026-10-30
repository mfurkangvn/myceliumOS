// utils/roomPhase.js
// Bir odanın aktif evresini ve o evredeki gün hedeflerini tek yerden hesaplar.

import {
  getIncubationDayData,
  getScratchDayData,
  getHarvestDayData,
} from "../data/daysData";
import {
  addDays,
  startOfDay,
  getElapsedDays,
  getElapsedDaysFromTimestamp,
} from "./dateUtils";

// İşaretleme (çizik/pin) verilen günde veya öncesinde yapılmış mı?
const isMarkedOnOrBefore = (isMarked, timestamp, date) =>
  Boolean(isMarked && timestamp) && startOfDay(timestamp) <= startOfDay(date);

/**
 * Odanın belirli bir gündeki evresini, evre içindeki gününü ve hedef verisini döndürür.
 * Geçmiş bir gün sorulursa o gün henüz çizik/pin işaretlenmemişse önceki evre döner;
 * böylece eski ölçümler o günün gerçek hedefleriyle karşılaştırılabilir.
 * @param {object} room - State'teki oda objesi
 * @param {Date} date - Hangi gün için (varsayılan bugün)
 * @returns {{ phase: "incubation"|"scratch"|"harvest", day: number, info: object, startedOnDate: boolean }}
 */
export const getRoomPhaseAt = (room, date = new Date()) => {
  if (isMarkedOnOrBefore(room?.isPinSpotted, room?.pinTimestamp, date)) {
    const day = getElapsedDaysFromTimestamp(room.pinTimestamp, date);
    return { phase: "harvest", day, info: getHarvestDayData(day), startedOnDate: day === 1 };
  }

  if (isMarkedOnOrBefore(room?.isScratchDone, room?.scratchTimestamp, date)) {
    const day = getElapsedDaysFromTimestamp(room.scratchTimestamp, date);
    return { phase: "scratch", day, info: getScratchDayData(day), startedOnDate: day === 1 };
  }

  const day = getElapsedDays(room?.date, date);
  return { phase: "incubation", day, info: getIncubationDayData(day), startedOnDate: false };
};

/**
 * Odanın evresini, evre içindeki gününü ve o günün hedef verisini döndürür.
 * Çizik ve hasat günleri, başlangıç tarihinden değil ilgili işaretlemenin
 * yapıldığı günden itibaren sayılır.
 * @param {object} room - State'teki oda objesi
 * @param {number} futureDaysOffset - Kaç gün sonrası (0 = bugün)
 * @returns {{ phase: "incubation"|"scratch"|"harvest", day: number, info: object }}
 */
export const getRoomPhase = (room, futureDaysOffset = 0) =>
  getRoomPhaseAt(room, addDays(new Date(), futureDaysOffset));
