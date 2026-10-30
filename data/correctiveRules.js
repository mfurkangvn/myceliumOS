// data/correctiveRules.js
// Ölçümler hedef dışına çıktığında üretilecek düzeltici görev listeleri.
//
// ⚠️ TASLAK İÇERİK: Genel istiridye mantarı yetiştiriciliği bilgisine göre hazırlandı.
// Eşikleri ve görev metinlerini kendi üretim tecrübenize göre güncelleyin.
//
// Kural alanları:
//   id        : benzersiz anahtar (görev işaretleri bu anahtarla saklanır)
//   phases    : geçerli evreler ("incubation" | "scratch" | "harvest"); yazılmazsa tüm evreler
//   metric    : "roomTemp" | "compostTemp" | "humidity"
//   trigger   : "high" / "low"  → önceki günün ortalaması hedef aralığın üstünde/altında
//               "limit"         → herhangi bir ölçüm `threshold` değerine ulaştı (anında devreye girer)
//               "missing"       → önceki gün hiç ölçüm girilmedi
//   severity  : "critical" | "warning" → normal görev listesinin yerine geçer
//               "info"                → normal listenin üstünde not olarak gösterilir
//   title     : uyarı başlığı
//   tasks     : yapılacaklar listesi
//
// Aynı ölçüm ve yön için evreye özel bir kural varsa, genel (phases yazılmamış) kural kullanılmaz.

export const correctiveRules = [
  // ─── ANINDA DEVREYE GİREN KRİTİK SINIRLAR ───────────────────────────────
  {
    id: "compost-temp-critical",
    metric: "compostTemp",
    trigger: "limit",
    threshold: 32,
    severity: "critical",
    title: "Kompost ısısı kritik sınırda (32°C+)",
    tasks: [
      "🌬️ Taze hava fanlarını hemen açın ve kompost ısısı düşene kadar çalıştırın.",
      "🌡️ Oda sıcaklığını 2-3°C düşürün (soğutma veya gece havası ile).",
      "📦 Blok/torba aralarını açın, üst üste istifleri azaltarak ısı çıkışını kolaylaştırın.",
      "⏱️ Kompost iç sıcaklığını 2-3 saatte bir ölçüp kaydedin.",
    ],
  },
  {
    id: "room-temp-critical",
    metric: "roomTemp",
    trigger: "limit",
    threshold: 30,
    severity: "critical",
    title: "Oda sıcaklığı kritik sınırda (30°C+)",
    tasks: [
      "❄️ Soğutmayı devreye alın; yoksa serin saatlerde odayı havalandırın.",
      "☀️ Odaya güneş/ısı kaynağı giriyorsa kapatın veya gölgeleyin.",
      "🌡️ Kompost iç sıcaklığını hemen ölçün; ortam sıcaklığı kompostu da ısıtır.",
    ],
  },

  // ─── KULUÇKA EVRESİ ──────────────────────────────────────────────────────
  {
    id: "incubation-compost-high",
    phases: ["incubation"],
    metric: "compostTemp",
    trigger: "high",
    severity: "warning",
    title: "Kompost ısısı hedefin üzerinde",
    tasks: [
      "🌬️ Havalandırmayı kısa aralıklarla çalıştırarak biriken ısıyı atın.",
      "🌡️ Oda sıcaklığını 1-2°C düşürün.",
      "📦 Bloklar arasındaki mesafeyi açın, istif yüksekliğini azaltın.",
      "⏱️ Kompost iç sıcaklığını günde 3 kez ölçün.",
    ],
  },
  {
    id: "incubation-compost-low",
    phases: ["incubation"],
    metric: "compostTemp",
    trigger: "low",
    severity: "warning",
    title: "Kompost ısısı hedefin altında — misel sarımı yavaşlayabilir",
    tasks: [
      "🌡️ Oda sıcaklığını kademeli olarak 1°C artırın (ani ısıtmadan kaçının).",
      "🌬️ Havalandırmayı minimuma indirin.",
      "🚪 Kapı ve pencerelerde soğuk hava sızıntısı olup olmadığını kontrol edin.",
      "🧱 Bloklar soğuk zemindeyse altına palet veya yalıtım koyun.",
    ],
  },
  {
    id: "incubation-room-high",
    phases: ["incubation"],
    metric: "roomTemp",
    trigger: "high",
    severity: "warning",
    title: "Oda sıcaklığı kuluçka hedefinin üzerinde",
    tasks: [
      "🌬️ Serin saatlerde kısa süreli taze hava verin.",
      "❄️ Soğutma varsa hedef aralığa ayarlayın.",
      "🌡️ Kompost iç sıcaklığını takip edin; oda ısısı kompostu da ısıtır.",
    ],
  },
  {
    id: "incubation-room-low",
    phases: ["incubation"],
    metric: "roomTemp",
    trigger: "low",
    severity: "warning",
    title: "Oda sıcaklığı kuluçka hedefinin altında",
    tasks: [
      "🔥 Isıtmayı kademeli olarak açın, hedef aralığa getirin.",
      "🌬️ Havalandırmayı minimuma indirin.",
      "🚪 Soğuk hava girişlerini kapatın.",
    ],
  },
  {
    id: "incubation-humidity-high",
    phases: ["incubation"],
    metric: "humidity",
    trigger: "high",
    severity: "warning",
    title: "Kuluçkada nem fazla — küf riski",
    tasks: [
      "💧 Nemlendiriciyi kapatın, zemindeki su birikintilerini kurulayın.",
      "🌬️ Kısa süreli havalandırma ile fazla nemi atın.",
      "🔍 Blok yüzeylerinde yeşil küf veya ıslak leke olup olmadığını kontrol edin.",
    ],
  },
  {
    id: "incubation-humidity-low",
    phases: ["incubation"],
    metric: "humidity",
    trigger: "low",
    severity: "warning",
    title: "Kuluçkada nem düşük",
    tasks: [
      "💧 Zemini hafifçe ıslatın (bloklara doğrudan su püskürtmeyin).",
      "🌬️ Havalandırma süresini azaltın.",
    ],
  },

  // ─── ÇİZİK EVRESİ ───────────────────────────────────────────────────────
  {
    id: "scratch-humidity-low",
    phases: ["scratch"],
    metric: "humidity",
    trigger: "low",
    severity: "warning",
    title: "Çizik döneminde nem düşük — çizik ağızları kuruyabilir",
    tasks: [
      "💧 Nemlendirici/sisleme süresini artırın, hedef %88-92.",
      "🌊 Zemini ve duvarları ıslatarak ortam nemini yükseltin.",
      "🚪 Kapıları kapalı tutun, gereksiz hava akışını kesin.",
      "🔍 Çizik ağızlarında kuruma veya kararma olup olmadığını kontrol edin.",
    ],
  },
  {
    id: "scratch-humidity-high",
    phases: ["scratch"],
    metric: "humidity",
    trigger: "high",
    severity: "warning",
    title: "Çizik döneminde nem fazla — bakteriyel leke riski",
    tasks: [
      "💧 Sisleme süresini azaltın, bloklara doğrudan su gelmesin.",
      "🌬️ Kısa süreli taze hava ile yoğuşmayı giderin.",
      "🔍 Çizik bölgelerde sararma, yapışkanlık veya kötü koku kontrolü yapın.",
    ],
  },
  {
    id: "scratch-compost-high",
    phases: ["scratch"],
    metric: "compostTemp",
    trigger: "high",
    severity: "warning",
    title: "Çizik sonrası kompost ısısı yükseliyor",
    tasks: [
      "🌬️ Havalandırmayı biraz artırın (nemi düşürmeden).",
      "🌡️ Oda sıcaklığını 1°C düşürün.",
      "⏱️ Kompost iç sıcaklığını günde 3 kez ölçün.",
    ],
  },

  // ─── PİN & HASAT EVRESİ ─────────────────────────────────────────────────
  {
    id: "harvest-room-high",
    phases: ["harvest"],
    metric: "roomTemp",
    trigger: "high",
    severity: "warning",
    title: "İklim şoku tutmuyor — oda sıcaklığı yüksek",
    tasks: [
      "❄️ Oda sıcaklığını 16-18°C'ye indirin (soğutma veya gece havası).",
      "🌬️ Taze hava fanlarını yükseltin; yüksek CO₂ uzun sap ve küçük şapka yapar.",
      "🍄 Olgunlaşan mantarları bekletmeden toplayın.",
    ],
  },
  {
    id: "harvest-room-low",
    phases: ["harvest"],
    metric: "roomTemp",
    trigger: "low",
    severity: "warning",
    title: "Hasat döneminde oda çok soğuk — gelişim yavaşlar",
    tasks: [
      "🔥 Sıcaklığı kademeli olarak hedef aralığa getirin.",
      "🌬️ Taze hava akışını kesmeden soğuk hava girişini azaltın.",
    ],
  },
  {
    id: "harvest-humidity-low",
    phases: ["harvest"],
    metric: "humidity",
    trigger: "low",
    severity: "warning",
    title: "Hasat döneminde nem düşük — şapka kenarları çatlayabilir",
    tasks: [
      "💧 Sisleme sıklığını artırın; mantarların üzerine doğrudan su püskürtmeyin.",
      "🌊 Zemini ıslatarak ortam nemini yükseltin.",
      "🔍 Şapka kenarlarında kuruma ve çatlama kontrolü yapın.",
    ],
  },
  {
    id: "harvest-humidity-high",
    phases: ["harvest"],
    metric: "humidity",
    trigger: "high",
    severity: "warning",
    title: "Hasat döneminde nem fazla — bakteriyel leke riski",
    tasks: [
      "🌬️ Fan süresini artırarak şapka yüzeylerinin kurumasını sağlayın.",
      "💧 Sisleme süresini kısaltın.",
      "🔍 Şapkalarda sarı/kahverengi leke çıkan mantarları ayırın.",
    ],
  },

  // ─── GENEL (EVREYE ÖZEL KURAL YOKSA) ────────────────────────────────────
  {
    id: "compost-high",
    metric: "compostTemp",
    trigger: "high",
    severity: "warning",
    title: "Kompost ısısı hedefin üzerinde",
    tasks: [
      "🌬️ Havalandırmayı artırın.",
      "🌡️ Oda sıcaklığını 1-2°C düşürün.",
      "⏱️ Kompost iç sıcaklığını günde 3 kez ölçün.",
    ],
  },
  {
    id: "compost-low",
    metric: "compostTemp",
    trigger: "low",
    severity: "warning",
    title: "Kompost ısısı hedefin altında",
    tasks: [
      "🌡️ Oda sıcaklığını kademeli olarak 1°C artırın.",
      "🚪 Soğuk hava girişlerini kontrol edin.",
    ],
  },
  {
    id: "room-high",
    metric: "roomTemp",
    trigger: "high",
    severity: "warning",
    title: "Oda sıcaklığı hedefin üzerinde",
    tasks: [
      "❄️ Soğutmayı hedef aralığa ayarlayın veya serin saatlerde havalandırın.",
      "🌡️ Kompost iç sıcaklığını takip edin.",
    ],
  },
  {
    id: "room-low",
    metric: "roomTemp",
    trigger: "low",
    severity: "warning",
    title: "Oda sıcaklığı hedefin altında",
    tasks: [
      "🔥 Isıtmayı kademeli olarak hedef aralığa getirin.",
      "🚪 Soğuk hava girişlerini kapatın.",
    ],
  },

  // ─── VERİ EKSİKLİĞİ ─────────────────────────────────────────────────────
  {
    id: "missing-readings",
    trigger: "missing",
    severity: "info",
    title: "Dün ölçüm girilmedi",
    tasks: [
      "📝 Bugün sabah ve akşam ölçümlerini mutlaka girin; ölçüm olmadan sapmalar fark edilemez.",
    ],
  },
];

export default correctiveRules;
