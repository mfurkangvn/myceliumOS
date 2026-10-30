// domain/planner.js
// Ölçümlere göre odanın günlük görev planını üretir.
//
// Akış:
//   1. Önceki günün (son 24 saatin) ölçüm ortalamaları, o günün hedefleriyle karşılaştırılır.
//   2. Hedef dışındaki ölçümler data/correctiveRules.js'teki kurallarla eşleştirilir.
//   3. Kritik sınır kuralları dünün ve bugünün tek tek ölçümlerine bakar; bugün girilen
//      bir ölçüm sınırı aşarsa plan o an düzeltici moda geçer.
//   4. Uyarı/kritik kural varsa düzeltici görevler normal listenin yerine geçer.
//
// Plan saklanmaz, her seferinde ölçümlerden yeniden hesaplanır: aynı girdiler aynı planı
// üretir ve gün içinde sadece bugün girilen ölçümler kritik sınırı aşarsa değişir.

import { correctiveRules } from "../data/correctiveRules";
import {
  addDays,
  startOfDay,
  getLocalDateKey,
  parseDisplayDate,
} from "../utils/dateUtils";
import { getRoomPhaseAt } from "../utils/roomPhase";
import { analyzeDay, getDayReadings } from "./analysis";
import { METRICS, formatMetricValue, formatMetricRange } from "./targetRanges";

const SEVERITY_ORDER = { critical: 0, warning: 1, info: 2 };

const appliesToPhase = (rule, phase) => !rule.phases || rule.phases.includes(phase);

const lowerLabel = (metricKey) => METRICS[metricKey].label.toLocaleLowerCase("tr-TR");

// Ortalama kuralları: aynı ölçüm ve yön için evreye özel kural varsa genel kural kullanılmaz.
const matchAverageRules = (rules, analysis) => {
  const matches = [];

  Object.entries(analysis.metrics).forEach(([metricKey, result]) => {
    if (result.status !== "high" && result.status !== "low") return;

    const candidates = rules.filter(
      (rule) =>
        rule.trigger === result.status &&
        rule.metric === metricKey &&
        appliesToPhase(rule, analysis.phase)
    );
    const phaseSpecific = candidates.filter((rule) => rule.phases);
    const selected = phaseSpecific.length > 0 ? phaseSpecific : candidates;

    selected.forEach((rule) =>
      matches.push({
        rule,
        reason: `Dünkü ortalama ${lowerLabel(metricKey)} ${formatMetricValue(
          metricKey,
          result.average
        )} · hedef ${formatMetricRange(metricKey, result.range)}`,
      })
    );
  });

  return matches;
};

// Kritik sınır kuralları: dün ve bugün girilen her ölçüme ayrı ayrı bakılır.
const matchLimitRules = (rules, phase, labeledReadings) =>
  rules
    .filter((rule) => rule.trigger === "limit" && appliesToPhase(rule, phase))
    .map((rule) => {
      const peak = labeledReadings
        .filter((r) => typeof r[rule.metric] === "number" && r[rule.metric] >= rule.threshold)
        .sort((a, b) => b[rule.metric] - a[rule.metric])[0];
      if (!peak) return null;

      return {
        rule,
        reason: `${peak.dayLabel} ölçülen ${lowerLabel(rule.metric)} ${formatMetricValue(
          rule.metric,
          peak[rule.metric]
        )} · kritik sınır ${formatMetricValue(rule.metric, rule.threshold)}`,
      };
    })
    .filter(Boolean);

// Oda dün tam gün boyunca var mıydı? (Yeni eklenen odada "ölçüm girilmedi" denmesin.)
// Eski kayıtlarda createdAt yok; NewRoom'da id olarak Date.now() kullanıldığı için ona düşülür.
const existedWholeDay = (room, day) => {
  const createdAt = room?.createdAt ?? (typeof room?.id === "number" ? room.id : null);
  if (createdAt !== null && createdAt >= day.getTime()) return false;

  const startDate = parseDisplayDate(room?.date);
  return !startDate || startDate <= day;
};

/**
 * Odanın verilen günkü görev planını üretir.
 * @param {object} room - State'teki oda objesi
 * @param {Date} referenceDate - Planın günü (varsayılan bugün)
 * @param {Array} rules - Kural listesi (testlerde değiştirilebilir)
 * @returns {{
 *   dateKey: string,
 *   mode: "normal"|"corrective",
 *   phase: string,
 *   day: number,
 *   info: object,
 *   alerts: Array<{ruleId: string, severity: string, title: string, reason: string}>,
 *   tasks: Array<{id: string, text: string}>,
 * }}
 */
export const buildDailyPlan = (room, referenceDate = new Date(), rules = correctiveRules) => {
  const today = startOfDay(referenceDate);
  const yesterday = addDays(today, -1);
  const dateKey = getLocalDateKey(today);
  const { phase, day, info } = getRoomPhaseAt(room, today);

  const analysis = analyzeDay(room, yesterday);
  const labeledReadings = [
    ...getDayReadings(room, analysis.dateKey).map((r) => ({ ...r, dayLabel: "Dün" })),
    ...getDayReadings(room, dateKey).map((r) => ({ ...r, dayLabel: "Bugün" })),
  ];

  const matches = [
    ...matchLimitRules(rules, phase, labeledReadings),
    // Evre bugün değiştiyse dünkü sapmalar önceki evrenin hedeflerine aittir; yeni evre temiz başlar.
    ...(analysis.phase === phase ? matchAverageRules(rules, analysis) : []),
  ];

  if (analysis.readingCount === 0 && existedWholeDay(room, yesterday)) {
    rules
      .filter((rule) => rule.trigger === "missing" && appliesToPhase(rule, phase))
      .forEach((rule) => matches.push({ rule, reason: "Dünkü sapmalar hesaplanamadı." }));
  }

  // Aynı kural iki kez eşleşmesin, en önemliler üstte olsun
  const uniqueMatches = matches
    .filter((match, index) => matches.findIndex((m) => m.rule.id === match.rule.id) === index)
    .sort((a, b) => SEVERITY_ORDER[a.rule.severity] - SEVERITY_ORDER[b.rule.severity]);

  const alerts = uniqueMatches.map(({ rule, reason }) => ({
    ruleId: rule.id,
    severity: rule.severity,
    title: rule.title,
    reason,
  }));

  const blocking = uniqueMatches.filter(({ rule }) => rule.severity !== "info");
  const mode = blocking.length > 0 ? "corrective" : "normal";

  const ruleTasks = (list) =>
    list.flatMap(({ rule }) => rule.tasks.map((text, i) => ({ id: `${rule.id}-${i}`, text })));

  let tasks;
  if (mode === "corrective") {
    const seen = new Set();
    tasks = ruleTasks(blocking).filter(({ text }) => !seen.has(text) && seen.add(text));
  } else {
    const infoMatches = uniqueMatches.filter(({ rule }) => rule.severity === "info");
    tasks = [
      ...ruleTasks(infoMatches),
      ...(info.tasks || []).map((text, i) => ({ id: `${phase}-${day}-${i}`, text })),
    ];
  }

  return { dateKey, mode, phase, day, info, alerts, tasks };
};
