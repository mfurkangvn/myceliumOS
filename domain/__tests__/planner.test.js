import { buildDailyPlan } from "../planner";
import { parseRange, getTargetRange, METRICS } from "../targetRanges";
import { addDays, getLocalDateKey } from "../../utils/dateUtils";
import { getRoomPhaseAt } from "../../utils/roomPhase";

// Testler bugünün tarihine bağlı olmasın diye sabit referans gün
const TODAY = new Date(2026, 9, 30, 10, 0);
const YESTERDAY = addDays(TODAY, -1);

const keyFor = (offset) => getLocalDateKey(addDays(TODAY, offset));
const displayDate = (date) =>
  `${String(date.getDate()).padStart(2, "0")}.${String(date.getMonth() + 1).padStart(2, "0")}.${date.getFullYear()}`;

// İstenen günde başlayan, uzun süredir var olan bir oda (kuluçka 5. gün)
const makeRoom = (overrides = {}) => ({
  id: 1,
  name: "Oda 1",
  date: displayDate(addDays(TODAY, -4)),
  createdAt: addDays(TODAY, -10).getTime(),
  logs: {},
  ...overrides,
});

// Odanın verilen gündeki hedeflerinin tam ortasındaki ölçüm
const midReading = (room, date) => {
  const { info } = getRoomPhaseAt(room, date);
  const reading = {};
  Object.keys(METRICS).forEach((metricKey) => {
    const range = getTargetRange(info, metricKey);
    reading[metricKey] = (range.min + range.max) / 2;
  });
  return reading;
};

const targetOf = (room, date, metricKey) =>
  getTargetRange(getRoomPhaseAt(room, date).info, metricKey);

const ruleIds = (plan) => plan.alerts.map((a) => a.ruleId);

describe("parseRange", () => {
  it("aralık, tek değer ve yüzde biçimlerini ayrıştırır", () => {
    expect(parseRange("24°C - 25°C")).toEqual({ min: 24, max: 25 });
    expect(parseRange("20.5°C - 22°C")).toEqual({ min: 20.5, max: 22 });
    expect(parseRange("%40 - %50")).toEqual({ min: 40, max: 50 });
    expect(parseRange("%90")).toEqual({ min: 90, max: 90 });
    expect(parseRange("24°C")).toEqual({ min: 24, max: 24 });
    expect(parseRange("")).toBeNull();
    expect(parseRange(undefined)).toBeNull();
  });
});

describe("buildDailyPlan", () => {
  it("dünkü ölçümler hedefteyse normal günlük listeyi verir", () => {
    const room = makeRoom();
    const reading = midReading(room, YESTERDAY);
    room.logs = { [keyFor(-1)]: { morning: reading, evening: reading } };

    const plan = buildDailyPlan(room, TODAY);

    expect(plan.mode).toBe("normal");
    expect(plan.alerts).toEqual([]);
    expect(plan.phase).toBe("incubation");
    expect(plan.day).toBe(5);
    expect(plan.tasks.map((t) => t.text)).toEqual(plan.info.tasks);
  });

  it("dünkü kompost ortalaması yüksekse düzeltici liste normal listenin yerine geçer", () => {
    const room = makeRoom();
    const reading = midReading(room, YESTERDAY);
    const { max } = targetOf(room, YESTERDAY, "compostTemp");
    room.logs = {
      [keyFor(-1)]: {
        morning: { ...reading, compostTemp: max + 1.5 },
        evening: { ...reading, compostTemp: max + 1 },
      },
    };

    const plan = buildDailyPlan(room, TODAY);

    expect(plan.mode).toBe("corrective");
    expect(ruleIds(plan)).toEqual(["incubation-compost-high"]);
    expect(plan.alerts[0].reason).toContain("Dünkü ortalama kompost sıcaklığı");
    plan.info.tasks.forEach((task) =>
      expect(plan.tasks.map((t) => t.text)).not.toContain(task)
    );
  });

  it("sabah ve akşamın ortalamasına bakar, tek bir sapmaya tepki vermez", () => {
    const room = makeRoom();
    const reading = midReading(room, YESTERDAY);
    const { min, max } = targetOf(room, YESTERDAY, "humidity");
    const mid = (min + max) / 2;
    room.logs = {
      [keyFor(-1)]: {
        morning: { ...reading, humidity: mid + (max - min) },
        evening: { ...reading, humidity: mid - (max - min) },
      },
    };

    expect(buildDailyPlan(room, TODAY).mode).toBe("normal");
  });

  it("tolerans payı içindeki sapmayı hedefte sayar", () => {
    const room = makeRoom();
    const reading = midReading(room, YESTERDAY);
    const { max } = targetOf(room, YESTERDAY, "roomTemp");
    room.logs = { [keyFor(-1)]: { morning: { ...reading, roomTemp: max + 0.4 } } };

    expect(buildDailyPlan(room, TODAY).mode).toBe("normal");
  });

  it("bugün girilen kritik kompost ölçümü planı anında kritik moda geçirir", () => {
    const room = makeRoom();
    const reading = midReading(room, YESTERDAY);
    room.logs = {
      [keyFor(-1)]: { morning: reading, evening: reading },
      [keyFor(0)]: { morning: { ...midReading(room, TODAY), compostTemp: 33 } },
    };

    const plan = buildDailyPlan(room, TODAY);

    expect(plan.mode).toBe("corrective");
    expect(plan.alerts[0].ruleId).toBe("compost-temp-critical");
    expect(plan.alerts[0].severity).toBe("critical");
    expect(plan.alerts[0].reason).toContain("Bugün ölçülen");
  });

  it("dün ölçüm girilmediyse bilgi notu ekler ama normal listeyi korur", () => {
    const room = makeRoom();

    const plan = buildDailyPlan(room, TODAY);

    expect(plan.mode).toBe("normal");
    expect(ruleIds(plan)).toEqual(["missing-readings"]);
    expect(plan.tasks[0].id).toBe("missing-readings-0");
    expect(plan.tasks.slice(1).map((t) => t.text)).toEqual(plan.info.tasks);
  });

  it("bugün eklenen odada 'ölçüm girilmedi' uyarısı vermez", () => {
    const room = makeRoom({ createdAt: TODAY.getTime() - 60 * 1000 });

    expect(buildDailyPlan(room, TODAY).alerts).toEqual([]);
  });

  it("evre bugün değiştiyse önceki evrenin sapmalarını yeni evreye taşımaz", () => {
    const room = makeRoom({ isScratchDone: true, scratchTimestamp: TODAY.getTime() });
    const reading = midReading(room, YESTERDAY);
    // Kritik sınır kuralı (32°C) evreden bağımsız çalıştığı için düşük yönde sapma kullanılır
    const { min } = targetOf(room, YESTERDAY, "compostTemp");
    room.logs = { [keyFor(-1)]: { morning: { ...reading, compostTemp: min - 3 } } };

    const plan = buildDailyPlan(room, TODAY);

    expect(plan.phase).toBe("scratch");
    expect(plan.mode).toBe("normal");
  });

  it("evrenin başladığı geçiş gününün ölçümlerini ortalamaya katmaz", () => {
    const room = makeRoom({ isScratchDone: true, scratchTimestamp: YESTERDAY.getTime() });
    const reading = midReading(room, YESTERDAY);
    room.logs = { [keyFor(-1)]: { morning: { ...reading, humidity: 45 } } };

    expect(buildDailyPlan(room, TODAY).mode).toBe("normal");
  });

  it("evreye özel kural, aynı ölçüm için genel kuralın önüne geçer", () => {
    const room = makeRoom({
      isScratchDone: true,
      scratchTimestamp: addDays(TODAY, -3).getTime(),
    });
    const reading = midReading(room, YESTERDAY);
    const { max } = targetOf(room, YESTERDAY, "compostTemp");
    room.logs = { [keyFor(-1)]: { morning: { ...reading, compostTemp: max + 2 } } };

    const plan = buildDailyPlan(room, TODAY);

    expect(ruleIds(plan)).toEqual(["scratch-compost-high"]);
  });

  it("hasat planı bittiğinde son günün hedefleriyle değerlendirmeye devam eder", () => {
    const room = makeRoom({
      date: displayDate(addDays(TODAY, -40)),
      isScratchDone: true,
      scratchTimestamp: addDays(TODAY, -20).getTime(),
      isPinSpotted: true,
      pinTimestamp: addDays(TODAY, -14).getTime(),
    });
    const reading = midReading(room, YESTERDAY);
    const { min } = targetOf(room, YESTERDAY, "humidity");
    room.logs = { [keyFor(-1)]: { evening: { ...reading, humidity: min - 10 } } };

    const plan = buildDailyPlan(room, TODAY);

    expect(plan.phase).toBe("harvest");
    expect(plan.day).toBe(15);
    expect(plan.info.day).toBe(10);
    expect(ruleIds(plan)).toEqual(["harvest-humidity-low"]);
  });

  it("birden fazla sapmada kritik uyarı önce gelir ve görev kimlikleri benzersizdir", () => {
    const room = makeRoom();
    const reading = midReading(room, YESTERDAY);
    const humidity = targetOf(room, YESTERDAY, "humidity");
    room.logs = {
      [keyFor(-1)]: { morning: { ...reading, humidity: humidity.max + 10, compostTemp: 32.5 } },
    };

    const plan = buildDailyPlan(room, TODAY);
    const ids = plan.tasks.map((t) => t.id);

    expect(plan.alerts[0].severity).toBe("critical");
    expect(ruleIds(plan)).toEqual(
      expect.arrayContaining(["compost-temp-critical", "incubation-humidity-high"])
    );
    expect(new Set(ids).size).toBe(ids.length);
  });
});
