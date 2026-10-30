// domain/analysis.js
// Bir günün ölçümlerini o günün hedefleriyle karşılaştırır.

import { getLocalDateKey } from "../utils/dateUtils";
import { getRoomPhaseAt } from "../utils/roomPhase";
import { METRICS, getTargetRange } from "./targetRanges";

const SESSIONS = ["morning", "evening"];

/**
 * Odanın belirli bir gündeki ölçümlerini (sabah, akşam sırasıyla) döndürür.
 * @param {object} room
 * @param {string} dateKey - YYYY-MM-DD
 * @returns {Array<{session: string, roomTemp: number, compostTemp: number, humidity: number}>}
 */
export const getDayReadings = (room, dateKey) => {
  const dayLogs = room?.logs?.[dateKey] || {};
  return SESSIONS.filter((session) => dayLogs[session]).map((session) => ({
    session,
    ...dayLogs[session],
  }));
};

const getStatus = (average, range, tolerance) => {
  if (average > range.max + tolerance) return "high";
  if (average < range.min - tolerance) return "low";
  return "ok";
};

/**
 * Bir günün ölçüm ortalamalarını o günün evre hedefleriyle karşılaştırır.
 * Evrenin o gün başladığı geçiş günlerinde (örn. çizik atılan gün) sabah ve akşam
 * farklı hedeflere ait olabileceği için ortalama karşılaştırması yapılmaz.
 * @param {object} room
 * @param {Date} date - Analiz edilecek gün
 * @returns {{
 *   dateKey: string,
 *   phase: string,
 *   readingCount: number,
 *   isTransitionDay: boolean,
 *   metrics: Object<string, {average: number|null, range: object|null, status: "low"|"ok"|"high"|"unknown"}>
 * }}
 */
export const analyzeDay = (room, date) => {
  const dateKey = getLocalDateKey(date);
  const { phase, info, startedOnDate } = getRoomPhaseAt(room, date);
  const readings = getDayReadings(room, dateKey);

  const metrics = {};
  Object.entries(METRICS).forEach(([metricKey, { tolerance }]) => {
    const values = readings
      .map((reading) => reading[metricKey])
      .filter((value) => typeof value === "number" && Number.isFinite(value));
    const range = getTargetRange(info, metricKey);

    if (values.length === 0 || !range || startedOnDate) {
      metrics[metricKey] = { average: null, range, status: "unknown" };
      return;
    }

    const average = values.reduce((sum, v) => sum + v, 0) / values.length;
    metrics[metricKey] = { average, range, status: getStatus(average, range, tolerance) };
  });

  return {
    dateKey,
    phase,
    readingCount: readings.length,
    isTransitionDay: startedOnDate,
    metrics,
  };
};
