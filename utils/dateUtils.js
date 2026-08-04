// utils/dateUtils.js
// Tarih, zaman ve veri ayrıştırma yardımcı fonksiyonları

/**
 * Başlangıç tarihinden (DD.MM.YYYY) bugüne geçen gün sayısını hesaplar.
 * @param {string} dateStr - Örn: "16.07.2026"
 * @returns {number} Geçen gün sayısı (Min 1)
 */
export const getElapsedDays = (dateStr) => {
  try {
    if (!dateStr) return 1;
    const parts = dateStr.split(".");
    if (parts.length !== 3) return 1;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    const dateObj = new Date(year, month, day);
    const today = new Date();
    dateObj.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - dateObj.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays >= 1 ? diffDays : 1;
  } catch (e) {
    return 1;
  }
};

/**
 * Zaman damgasından (timestamp) bugüne geçen gün sayısını hesaplar.
 * @param {number} timestamp - Date.now() değeri
 * @returns {number} Geçen gün sayısı (Min 1)
 */
export const getElapsedDaysFromTimestamp = (timestamp) => {
  if (!timestamp) return 1;
  const diffTime = Date.now() - timestamp;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
