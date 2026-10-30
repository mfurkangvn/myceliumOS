// domain/targetRanges.js
// daysData'daki metin hedefleri ("24°C - 25°C", "%40 - %50", "%90") sayısal aralığa çevirir.

/**
 * Takip edilen ölçümler. `targetField`, daysData içindeki hedef alanıdır;
 * `tolerance`, ölçüm hatası payıdır (bu kadar sapma "hedefte" sayılır).
 */
export const METRICS = {
  roomTemp: {
    label: "Ortam sıcaklığı",
    unit: "°C",
    targetField: "targetTemp",
    tolerance: 0.5,
  },
  compostTemp: {
    label: "Kompost sıcaklığı",
    unit: "°C",
    targetField: "targetCompostTemp",
    tolerance: 0.5,
  },
  humidity: {
    label: "Nem",
    unit: "%",
    targetField: "targetHumidity",
    tolerance: 2,
  },
};

/**
 * Hedef metnini {min, max} aralığına çevirir. Tek değer ("24°C") için min = max.
 * @param {string} text
 * @returns {{min: number, max: number}|null}
 */
export const parseRange = (text) => {
  if (!text || typeof text !== "string") return null;
  const numbers = (text.match(/\d+(?:[.,]\d+)?/g) || []).map((n) =>
    Number.parseFloat(n.replace(",", "."))
  );
  if (numbers.length === 0) return null;

  const [first, second = first] = numbers;
  return { min: Math.min(first, second), max: Math.max(first, second) };
};

/**
 * Bir gün verisinden metriğin hedef aralığını döndürür.
 * @param {object} dayInfo - getRoomPhaseAt(...).info
 * @param {string} metricKey - METRICS anahtarı
 */
export const getTargetRange = (dayInfo, metricKey) =>
  parseRange(dayInfo?.[METRICS[metricKey].targetField]);

/**
 * Değeri birimiyle Türkçe biçimde yazar: 31,2°C veya %88,5
 * @param {string} metricKey
 * @param {number} value
 */
export const formatMetricValue = (metricKey, value) => {
  const rounded = String(Math.round(value * 10) / 10).replace(".", ",");
  const { unit } = METRICS[metricKey];
  return unit === "%" ? `%${rounded}` : `${rounded}${unit}`;
};

/**
 * Aralığı birimiyle yazar: 24–25°C veya %88–92
 * @param {string} metricKey
 * @param {{min: number, max: number}} range
 */
export const formatMetricRange = (metricKey, range) => {
  const fmt = (v) => String(v).replace(".", ",");
  const { unit } = METRICS[metricKey];
  const body = range.min === range.max ? fmt(range.min) : `${fmt(range.min)}–${fmt(range.max)}`;
  return unit === "%" ? `%${body}` : `${body}${unit}`;
};
