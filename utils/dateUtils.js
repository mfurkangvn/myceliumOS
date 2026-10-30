// utils/dateUtils.js
// Tarih, zaman ve veri ayrıştırma yardımcı fonksiyonları

/**
 * "DD.MM.YYYY" biçimindeki tarihi yerel gece yarısına ayarlı Date'e çevirir.
 * @param {string} dateStr - Örn: "16.07.2026"
 * @returns {Date|null}
 */
export const parseDisplayDate = (dateStr) => {
  if (!dateStr || typeof dateStr !== "string") return null;
  const parts = dateStr.split(".");
  if (parts.length !== 3) return null;
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  if ([day, month, year].some(Number.isNaN)) return null;
  return new Date(year, month, day);
};

/**
 * Başlangıç tarihinden (DD.MM.YYYY) bugüne geçen gün sayısını hesaplar.
 * @param {string} dateStr - Örn: "16.07.2026"
 * @param {Date} referenceDate - Hangi güne göre hesaplanacağı (varsayılan bugün)
 * @returns {number} Geçen gün sayısı (Min 1)
 */
export const getElapsedDays = (dateStr, referenceDate = new Date()) => {
  const dateObj = parseDisplayDate(dateStr);
  if (!dateObj) return 1;
  return getCalendarDaysSince(dateObj, referenceDate);
};

/**
 * Zaman damgasından (timestamp) bugüne geçen gün sayısını hesaplar.
 * Başlangıç tarihiyle tutarlı olması için takvim günü bazında sayar
 * (gün, işaretlemeden 24 saat sonra değil gece yarısı değişir).
 * @param {number} timestamp - Date.now() değeri
 * @param {Date} referenceDate - Hangi güne göre hesaplanacağı (varsayılan bugün)
 * @returns {number} Geçen gün sayısı (Min 1)
 */
export const getElapsedDaysFromTimestamp = (timestamp, referenceDate = new Date()) => {
  if (!timestamp) return 1;
  return getCalendarDaysSince(new Date(timestamp), referenceDate);
};

/**
 * Verilen tarihe gün ekler/çıkarır (negatif değer geçmişe gider).
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Verilen tarihin yerel gece yarısını döndürür.
 * @param {Date|number} date
 * @returns {Date}
 */
export const startOfDay = (date) => {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

// Başlangıç günü 1. gün sayılarak referans güne kadarki takvim günü sayısı.
// Yaz saati geçişlerinde 23/25 saatlik günler için Math.round kullanılır.
const getCalendarDaysSince = (startDate, referenceDate = new Date()) => {
  const start = startOfDay(startDate);
  const reference = startOfDay(referenceDate);

  const diffDays = Math.round((reference.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diffDays >= 1 ? diffDays : 1;
};

/**
 * Yerel saat dilimine göre YYYY-MM-DD tarih anahtarı döndürür.
 * @param {Date} date
 * @returns {string} Örn: "2026-07-21"
 */
export const getLocalDateKey = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Metin biçimindeki sayısal ölçümü parse eder (, veya . ayraçlarını destekler).
 * @param {string} value
 * @returns {number|null}
 */
export const parseMeasurement = (value) => {
  if (!value || typeof value !== "string") return null;
  const normalized = value.trim().replace(",", ".");
  if (!/^-?\d+(\.\d+)?$/.test(normalized)) return null;

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
};
