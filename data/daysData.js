// data/daysData.js
// Mantar üretim döngüsü evre bazlı rehber ve iklim hedef verileri

// 1. KULUÇKA EVRESİ REHBERİ (Çizik atılana kadar devam eden 21 günlük liste)
export const incubationDaysData = {
  1: {
    day: 1,
    stage: "Kuluçka Evresi",
    title: "1. Gün - Kuluçka Başlangıcı ve Yerleşim",
    targetTemp: "24°C - 25°C",
    targetCompostTemp: "24°C - 30°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "⚠️ KRİTİK UYARI: Kompost iç sıcaklığı KESİNLİKLE 32°C üzerine çıkmamalıdır!",
    description:
      "Kompost odaya yerleştirildi. Misel sarmının başlaması için oda karanlık tutulmalı, havalandırma minimumda kalmalı ve kompost içi 32°C üzerine çıkarılmamalıdır.",
    tasks: [
      "Kompost ortam sıcaklığını 24°C civarında sabitleyin.",
      "Kompost iç sıcaklığını ölçün (⚠️ 32°C sınırına dikkat edin).",
      "Işıkları kapalı tutun.",
    ],
  },
  2: {
    day: 2,
    stage: "Kuluçka Evresi",
    title: "2. Gün - Misel Uyanışı",
    targetTemp: "24°C - 25°C",
    targetCompostTemp: "24°C - 30°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "⚠️ KRİTİK UYARI: Kompost iç sıcaklığının 32°C sınırını geçmediğini sık sık kontrol edin.",
    description:
      "Miseller kompost bloklarına tutunmaya başlıyor. Kompost içi ısınmaya meyilli olduğundan sıcaklık artışı yakından takip edilmelidir.",
    tasks: [
      "Kompost iç sıcaklığını problarla ölçün (Max 32°C).",
      "Oda sıcaklığını dengelemek için klima kullanın, su ile ıslatmak küf oluşumuna neden olabilir.",
      "Oda nemini stabilize edin.",
    ],
  },
  3: {
    day: 3,
    stage: "Kuluçka Evresi",
    title: "3. Gün - İlk Misel Yayılımı",
    targetTemp: "24°C - 25°C",
    targetCompostTemp: "25°C - 30°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "⚠️ SICAKLIK UYARISI: Kompost iç sıcaklığı 32°C üzerine çıkmamalıdır.",
    description: "Kompost yüzeyinde ilk beyaz misel ağları belirmeye başlar.",
    tasks: [
      "Ortam sıcaklığını 24-25°C arasında tutun.",
      "Kompost iç ısısını kontrol edin (⚠️ 32°C altı).",
      "Odaya doğrudan hava akımı girmesini engelleyin.",
    ],
  },
  4: {
    day: 4,
    stage: "Kuluçka Evresi",
    title: "4. Gün - Misel Gelişimi",
    targetTemp: "24°C - 25°C",
    targetCompostTemp: "25°C - 30°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "⚠️ SICAKLIK UYARISI: Kompost iç sıcaklığı 32°C üzerine çıkmamalıdır.",
    description:
      "Miseller besin ortamına yayılmaya devam ediyor. Isınan kompost blokları için soğutma önlemleri alınmalıdır.",
    tasks: [
      "Kompost iç sıcaklığını kontrol edin (32°C aşılmamalı).",
      "Nem sensörlerini kontrol edin.",
      "Aşırı ısınma varsa oda sıcaklığını 1-2°C düşürün.",
    ],
  },
  5: {
    day: 5,
    stage: "Kuluçka Evresi",
    title: "5. Gün - Kuluçka Denge Evresi",
    targetTemp: "24°C",
    targetCompostTemp: "25°C - 26.5°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "⚠️ SICAKLIK UYARISI: Kompost iç sıcaklığı 32°C üzerine çıkmamalıdır.",
    description:
      "Misel sarımı stabil bir hızda ilerliyor. Sıcaklığın 32°C sınırına yaklaşmamasına özen gösterin.",
    tasks: [
      "Kompost iç sıcaklığını ölçün (Max 32°C).",
      "Sıcaklık ve nem değerlerini kaydedin.",
      "Kapı ve havalandırmaların sızdırmazlığını denetleyin.",
    ],
  },
  6: {
    day: 6,
    stage: "Kuluçka Evresi",
    title: "6. Gün - Misel Yoğunlaşması",
    targetTemp: "24°C",
    targetCompostTemp: "25.5°C - 27°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "⚠️ SICAKLIK UYARISI: Kompost iç sıcaklığı 32°C üzerine çıkmamalıdır.",
    description: "Kompost bloklarının içinde beyazlaşma oranı artıyor.",
    tasks: [
      "Kompost iç ısısını denetleyin (⚠️ Max 32°C).",
      "Fan çalışmasını minimum seviyede tutun.",
      "Oda sıcaklığını 24°C civarında sabitleyin.",
    ],
  },
  7: {
    day: 7,
    stage: "Kuluçka Evresi",
    title: "7. Gün - 1. Hafta Tamamlandı",
    targetTemp: "24°C",
    targetCompostTemp: "25.5°C - 27°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "⚠️ SICAKLIK UYARISI: Kompost iç sıcaklığı 32°C üzerine çıkmamalıdır.",
    description:
      "Kuluçka döneminin ilk haftası geride kaldı. Kompost sarım oranı yaklaşık %35-40 seviyesine ulaştı.",
    tasks: [
      "Kompost iç sıcaklık kontrolü yapın (Max 32°C).",
      "Genel kompost durum kontrolü yapın.",
      "Küf veya yabancı organizma odakları olup olmadığını gözlemleyin.",
    ],
  },
  8: {
    day: 8,
    stage: "Kuluçka Evresi",
    title: "8. Gün - 🔍 Misel Sarım Kontrolü Başlangıcı",
    targetTemp: "24°C",
    targetCompostTemp: "26°C - 27.5°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "🔍 SARIM KONTROL UYARISI: 8. Günden itibaren sarım hızı kontrol edilmeli, hazır olan poşetler çizilmelidir!",
    description:
      "Miseller kompost içinde derinleşti. Sarımı tamamlanan poşetler için çizik atma zamanı yaklaştı.",
    tasks: [
      "🔍 Kompost poşetlerinde misel sarım ilerlemesini ve beyazlaşmayı kontrol edin.",
      "Sarı jel oluşumamasına dikkat edin.",
      "Kompost iç sıcaklığını kontrol etmeye devam edin (Max 32°C).",
    ],
  },
  9: {
    day: 9,
    stage: "Kuluçka Evresi",
    title: "9. Gün - 🔍 Sarım Takibi ve Çizik Öncesi Hazırlık",
    targetTemp: "24°C",
    targetCompostTemp: "25.5°C - 27°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "🔍 SARIM KONTROL UYARISI: Misel sarımının blok geneline yayıldığını doğrulayın.",
    description:
      "Misel sarım oranı ilerliyor. Çizik öncesi steril maket bıçağı veya çizim ekipmanlarını hazırlayın.",
    tasks: [
      "🔍 Misel sarım yoğunluğunu poşet yüzeylerinden denetleyin.",
      "Jel oluşmaması için sıcaklıkların artmamasına dikkat edin",
    ],
  },
  10: {
    day: 10,
    stage: "Kuluçka Evresi",
    title: "10. Gün - 🔍 Sarım ve Isı Takibi",
    targetTemp: "24°C",
    targetCompostTemp: "25°C - 26.5°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "⚠️ SICAKLIK UYARISI: Kompost iç sıcaklığı 32°C üzerine çıkmamalıdır.",
    description:
      "Kuluçka sarımı devam ediyor. Sarımı tamamlanmış poşetler varsa çizik atılabilir.",
    tasks: [
      "🔍 Kompost poşetlerinde misel sarım ilerlemesini kontrol edin.",
      "Kompost iç sıcaklığını  denetleyin (Max 32°C).",
      "Küf ve jel kontrolü yapın",
    ],
  },
  11: {
    day: 11,
    stage: "Kuluçka Evresi",
    title: "11. Gün - 🔍 Kuluçka Sarım Kontrolü",
    targetTemp: "24°C",
    targetCompostTemp: "25°C - 26.5°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "⚠️ SICAKLIK UYARISI: Kompost iç sıcaklığı 32°C üzerine çıkmamalıdır.",
    description: "Misel sarımı devam ediyor.",
    tasks: [
      "🔍 Kompost içindeki beyazlaşma oranını inceleyin.",
      "Küf ve jel kontrolü yapın",
    ],
  },
  12: {
    day: 12,
    stage: "Kuluçka Evresi",
    title: "12. Gün - 🔍 Kuluçka Denge Evresi",
    targetTemp: "23°C - 24°C",
    targetCompostTemp: "24.5°C - 26°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "⚠️ SICAKLIK UYARISI: Kompost iç sıcaklığı 32°C üzerine çıkmamalıdır.",
    description: "Kuluçka döneminin 12. günü.",
    tasks: [
      "🔍 Tüm poşetlerde misel sarım bütünlüğünü denetleyin.",
      "Sarım hazır olduğunda çizik atma işlemini tamamlayın.",
    ],
  },
  13: {
    day: 13,
    stage: "Kuluçka Evresi",
    title: "13. Gün - 🔍 Misel Sarım Devamı",
    targetTemp: "23°C",
    targetCompostTemp: "24.5°C - 26°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning:
      "🔍 SARIM KONTROLÜ: Küflenme veya kontaminasyon olup olmadığını inceleyin.",
    description: "Kuluçka evresi devam ediyor.",
    tasks: [
      "🔍 Kompost bloklarında küf odağı olup olmadığını kontrol edin.",
      "🔍 Misel sarımının homojen olup olmadığını denetleyin.",
    ],
  },
  14: {
    day: 14,
    stage: "Kuluçka Evresi",
    title: "14. Gün - 🔍 2. Hafta Kuluçka Sonu",
    targetTemp: "23°C",
    targetCompostTemp: "24°C - 25.5°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    warning: "🔍 SARIM KONTROLÜ: Sarım oranı %80 üzerine ulaşmış olmalıdır.",
    description: "Kuluçka evresinin 2. haftası tamamlanıyor.",
    tasks: [
      "🔍 Kompost bloklarında küf odağı olup olmadığını kontrol edin.",
      "🔍 Misel sarımının homojen olup olmadığını denetleyin.",
    ],
  },
  15: {
    day: 15,
    stage: "Kuluçka Evresi",
    title: "15. Gün - 🔍 Kuluçka Son Aşama",
    targetTemp: "22°C - 23°C",
    targetCompostTemp: "24°C - 25.5°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    description: "Kuluçka evresinin 15. günü.",
    tasks: [
      "🔍 Kompost bloklarında küf odağı olup olmadığını kontrol edin.",
      "🔍 Misel sarımının homojen olup olmadığını denetleyin.",
      "Odayı ısıtın sarımı hızlandırın.",
    ],
  },
  16: {
    day: 16,
    stage: "Kuluçka Evresi",
    title: "16. Gün - Misel Doku Olgunlaşması",
    targetTemp: "22°C - 23°C",
    targetCompostTemp: "23.5°C - 25°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    description: "Kompost içi misel sarımı %85+ seviyelerine ulaşıyor.",
    tasks: [
      "🔍 Kompost bloklarında küf odağı olup olmadığını kontrol edin.",
      "🔍 Misel sarımının homojen olup olmadığını denetleyin.",
      "Odayı ısıtın sarımı hızlandırın.",
    ],
  },
  17: {
    day: 17,
    stage: "Kuluçka Evresi",
    title: "17. Gün - Son Sarım Aşaması",
    targetTemp: "22°C",
    targetCompostTemp: "23°C - 24.5°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    description: "Miseller olgunlaşıyor.",
    tasks: [
      "🔍 Kompost bloklarında küf odağı olup olmadığını kontrol edin.",
      "🔍 Misel sarımının homojen olup olmadığını denetleyin.",
      "Odayı ısıtın sarımı hızlandırın.",
    ],
  },
  18: {
    day: 18,
    stage: "Kuluçka Evresi",
    title: "18. Gün - Şoklama Öncesi Kuluçka",
    targetTemp: "21°C - 22°C",
    targetCompostTemp: "22.5°C - 24°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    description: "Kuluçka evresinin son günleri.",
    tasks: [
      "🔍 Kompost bloklarında küf odağı olup olmadığını kontrol edin.",
      "🔍 Misel sarımının homojen olup olmadığını denetleyin.",
      "Odayı ısıtın sarımı hızlandırın.",
    ],
  },
  19: {
    day: 19,
    stage: "Kuluçka Evresi",
    title: "19. Gün - Misel Doygunluğu",
    targetTemp: "21°C",
    targetCompostTemp: "22°C - 23.5°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    description: "Kompost tamamen beyazlaştı.",
    tasks: [
      "🔍 Kompost bloklarında küf odağı olup olmadığını kontrol edin.",
      "🔍 Misel sarımının homojen olup olmadığını denetleyin.",
      "Odayı ısıtın sarımı hızlandırın.",
    ],
  },
  20: {
    day: 20,
    stage: "Kuluçka Evresi",
    title: "20. Gün - Kuluçka Sonu",
    targetTemp: "20°C - 21°C",
    targetCompostTemp: "21.5°C - 23°C",
    targetHumidity: "%40 - %50",
    targetFan: "Kapalı / Min (1/30)",
    description: "Kuluçka evresinin 20. günü.",
    tasks: [
      "🔍 Kompost bloklarında küf odağı olup olmadığını kontrol edin.",
      "🔍 Misel sarımının homojen olup olmadığını denetleyin.",
      "Odayı ısıtın sarımı hızlandırın.",
    ],
  },
  21: {
    day: 21,
    stage: "Kuluçka Evresi",
    title: "21. Gün - Kuluçka Tamamlandı",
    targetTemp: "19°C - 20°C",
    targetCompostTemp: "20.5°C - 22°C",
    targetHumidity: "%90",
    targetFan: "Kapalı / Min (1/30)",
    description: "🎉 21 Günlük Kuluçka Evresi tamamlandı!",
    tasks: [
      "🔍 Kompost bloklarında küf odağı olup olmadığını kontrol edin.",
      "🔍 Misel sarımının homojen olup olmadığını denetleyin.",
      "Odayı ısıtın sarımı hızlandırın.",
    ],
  },
};

// 2. ÇİZİK & SARIM EVRESİ REHBERİ (Çizik Butonuna Basılınca Devreye Giren 10 Günlük Liste)
export const scratchedDaysData = {
  stage: "Çizik & Sarım Evresi",
  title: "✂️ Çizik Dönemi ve Pin Takibi",
  targetTemp: "22°C - 23°C",
  targetCompostTemp: "24°C - 25.5°C",
  targetHumidity: "%88 - %92",
  targetFan: "Min (1/10)",
  warning:
    "🔍 ÇİZİK VE YARA BAKIM UYARISI: Çizik ağızlarının kurumaması için nem oranını %90 civarında sabitleyin!",

  tasks: [
    "📌 Çizik ağızlarında pamuklanma ve pin (mantar başı) oluşumunu günlük kontrol edin.",
    "💧 Çizik bölgelerin kurumaması için nem oranını %88 - %92 seviyesinde sabitleyin.",
    "🔍 Çizik yarıklarda yeşil küf veya kontaminasyon olup olmadığını denetleyin.",
    "🌡️ Kompost iç sıcaklığını kontrol etmeye devam edin (Max 32°C).",
  ],
  1: {
    day: 1,
    stage: "Çizik & Sarım Evresi",
    title: "1. Gün (Çizik Sonrası) ",
    targetTemp: "22°C - 23°C",
    targetCompostTemp: "24°C - 25.5°C",
    targetHumidity: "%88 - %92",
    targetFan: "Min (1/10)",
    warning:
      "🔍 ÇİZİK BAKIM UYARISI: Nem seviyesini %90 civarında sabit tutarak yaraların kurumasını engelleyin.",

    tasks: [
      "📌 Çizik ağızlarında pamuklanma ve doku gelişimini kontrol edin.",
      "💧 Nemi %88 - %92 seviyesinde tutun.",
      "🌡️ Kompost iç sıcaklığını ölçün.",
    ],
  },
  2: {
    day: 2,
    stage: "Çizik & Sarım Evresi",
    title: "2. Gün (Çizik Sonrası) ",
    targetTemp: "22°C - 23°C",
    targetCompostTemp: "24°C - 25.5°C",
    targetHumidity: "%88 - %92",
    targetFan: "Min (1/10)",
    warning:
      "🔍 NÖDÜL KONTROLÜ: Çizik yarıklardan beyaz misel küreleri beliriyor mu takip edin.",

    tasks: [
      "🔍 Çizik yarıklardan misellerin dışarı taşmasını denetleyin.",
      "Nem oranını %90'da koruyun.",
    ],
  },
  3: {
    day: 3,
    stage: "Çizik & Sarım Evresi",
    title: "3. Gün (Çizik Sonrası) ",
    targetTemp: "22°C",
    targetCompostTemp: "24°C - 25°C",
    targetHumidity: "%88 - %92",
    targetFan: "Min (1/10)",
    warning:
      "🔍 KONTAMİNASYON KONTROLÜ: Çizik yarıklarda yeşil küf odağı var mı denetleyin.",

    tasks: [
      "🔍 Çizik alanlarında küflenme denetimi yapın.",
      "Yara alanlarının kurumadığından emin olun.",
    ],
  },
  4: {
    day: 4,
    stage: "Çizik & Sarım Evresi",
    title: "4. Gün (Çizik Sonrası) ",
    targetTemp: "22°C",
    targetCompostTemp: "24°C - 25°C",
    targetHumidity: "%88 - %92",
    targetFan: "Min (1/10)",

    tasks: [
      "🔍 Düğümleşen misel noktalarını kontrol edin.",
      "Pinler belirginleştiyse 'Pinler Göründü' butonuna basın.",
    ],
  },
  5: {
    day: 5,
    stage: "Çizik & Sarım Evresi",
    title: "5. Gün (Çizik Sonrası)",
    targetTemp: "21°C - 22°C",
    targetCompostTemp: "23.5°C - 25°C",
    targetHumidity: "%88 - %92",
    targetFan: "Min (1/10)",

    tasks: [
      "📍 Pin başlarını (mantar başları) kontrol edin.",
      "Pinler belirginleştiyse 'Pinler Göründü' butonuna basın.",
    ],
  },
  6: {
    day: 6,
    stage: "Çizik & Sarım Evresi",
    title: "6. Gün (Çizik Sonrası)",
    targetTemp: "21°C - 22°C",
    targetCompostTemp: "23°C - 24.5°C",
    targetHumidity: "%88 - %92",
    targetFan: "Min (1/10)",

    tasks: [
      "📍 Pin başlarını (mantar başları) kontrol edin.",
      "Pinler belirginleştiyse 'Pinler Göründü' butonuna basın.",
    ],
  },
  7: {
    day: 7,
    stage: "Çizik & Sarım Evresi",
    title: "7. Gün (Çizik Sonrası) ",
    targetTemp: "21°C",
    targetCompostTemp: "23°C - 24°C",
    targetHumidity: "%88 - %92",
    targetFan: "Min (1/10)",

    tasks: [
      "📍 Pin başlarını (mantar başları) kontrol edin.",
      "Pinler belirginleştiyse 'Pinler Göründü' butonuna basın.",
    ],
  },
  8: {
    day: 8,
    stage: "Çizik & Sarım Evresi",
    title: "8. Gün (Çizik Sonrası) ",
    targetTemp: "20°C - 21°C",
    targetCompostTemp: "22.5°C - 23.5°C",
    targetHumidity: "%88 - %92",
    targetFan: "Min (1/10)",

    tasks: [
      "📍 Pin başlarını (mantar başları) kontrol edin.",
      "Pinler belirginleştiyse 'Pinler Göründü' butonuna basın.",
    ],
  },
  9: {
    day: 9,
    stage: "Çizik & Sarım Evresi",
    title: "9. Gün (Çizik Sonrası) - Şoklama Öncesi Final",
    targetTemp: "20°C",
    targetCompostTemp: "22°C - 23°C",
    targetHumidity: "%88 - %92",
    targetFan: "Min (1/10)",
    description: "Pinler şapkanın büyümesi için şoklama bekliyor.",
    tasks: [
      "📍 Pin başlarını (mantar başları) kontrol edin.",
      "Pinler belirginleştiyse 'Pinler Göründü' butonuna basın.",
    ],
  },
  10: {
    day: 10,
    stage: "Çizik & Sarım Evresi",
    title: "10. Gün (Çizik Sonrası) - Çizik Evresi Sonu",
    targetTemp: "20°C",
    targetCompostTemp: "21.5°C - 22.5°C",
    targetHumidity: "%88 - %92",
    targetFan: "Min (1/10)",
    description: "Çizik dönemi 10. gününü doldurdu.",
    tasks: [
      "📍 Pin başlarını (mantar başları) kontrol edin.",
      "Pinler belirginleştiyse 'Pinler Göründü' butonuna basın.",
    ],
  },
};

// 3. PİN & HASAT EVRESİ REHBERİ (Pin Göründü Butonuna Basılınca Devreye Girer 10 Günlük Liste)
export const harvestDaysData = {
  stage: "Pin & Hasat Evresi",
  title: "❄️ İklim Şoklaması ve Hasat Dönemi",
  targetTemp: "16°C - 18°C",
  targetCompostTemp: "18°C - 20°C",
  targetHumidity: "%85 - %90",
  targetFan: "Açık / Yüksek (6-8/10)",
  targetLight: "Açık (8-10 Saat)",
  warning:
    "❄️ İKLİM ŞOKLAMASI & TAZE HAVA UYARISI: Sıcaklık 16-18°C olmalı, taze hava fanları açık tutulmalıdır!",
  description:
    "Pinler (mantar başları) belirdi! Oda iklim şoklamasına alındı. Taze hava ve ışık ile mantar şapkaları hızla büyüyecek.",
  tasks: [
    "❄️ İKLİM ŞOKLAMASI: Oda sıcaklığını 16°C - 18°C seviyesinde sabit tutun.",
    "🌬️ TAZE HAVA: Havalandırma fanlarını çalıştırarak CO2 (karbondioksit) seviyesini düşürün.",
    "💡 IŞIKLANDIRMA: Mantar şapkalarının gelişimi için oda ışıklarını açık tutun.",
    "🌾 HASAT TAKİBİ: Olgunlaşan mantar şapkalarını toplayın ve günlük kg miktarını kaydedin.",
  ],
  1: {
    day: 1,
    stage: "Pin & Hasat Evresi",
    title: "1. Gün (Hasat/Şok) - Şok Başlangıcı ve Taze Hava",
    targetTemp: "16°C - 18°C",
    targetCompostTemp: "18°C - 20°C",
    targetHumidity: "%85 - %90",
    targetFan: "Açık / Yüksek (6-8/10)",
    targetLight: "Açık (8-10 Saat)",
    warning:
      "❄️ İKLİM ŞOKLAMASI UYARISI: Oda sıcaklığını 16-18°C'ye düşürün, fanları çalıştırın.",
    description: "Pinler görüldü. İklim şoklaması başlatıldı.",
    tasks: [
      "❄️ İKLİM ŞOKLAMASI: Sıcaklığı 16-18°C yapın.",
      "🌬️ TAZE HAVA: Fanları açarak CO2 düşürün.",
      "💡 IŞIKLANDIRMA: Oda ışıklarını yakın.",
    ],
  },
  2: {
    day: 2,
    stage: "Pin & Hasat Evresi",
    title: "2. Gün (Hasat/Şok) - Şapka Belirginleşmesi",
    targetTemp: "16°C - 18°C",
    targetCompostTemp: "18°C - 20°C",
    targetHumidity: "%85 - %90",
    targetFan: "Açık / Yüksek (6-8/10)",
    targetLight: "Açık (8-10 Saat)",
    warning: "❄️ İKLİM ŞOKLAMASI: 16-18°C ortam sıcaklığını koruyun.",
    description: "Pinler mantar şapkasına dönüşmeye başladı.",
    tasks: [
      "❄️ Sıcaklığın 18°C üstüne çıkmamasına dikkat edin.",
      "🌬️ Taze hava akışını sürdürün.",
    ],
  },
  3: {
    day: 3,
    stage: "Pin & Hasat Evresi",
    title: "3. Gün (Hasat/Şok) - Hızlı Şapka Büyümesi",
    targetTemp: "16°C - 18°C",
    targetCompostTemp: "18°C - 20°C",
    targetHumidity: "%85 - %90",
    targetFan: "Açık / Yüksek (6-8/10)",
    targetLight: "Açık (8-10 Saat)",
    description: "Mantar şapkaları hızla irileşiyor.",
    tasks: [
      "💧 Nem seviyesini %85-90 arasında koruyun.",
      "Işıkları günde 8-10 saat açık tutun.",
    ],
  },
  4: {
    day: 4,
    stage: "Pin & Hasat Evresi",
    title: "4. Gün (Hasat/Şok) - 1. Flaş Hasat Başlangıcı",
    targetTemp: "16°C - 18°C",
    targetCompostTemp: "18°C - 20°C",
    targetHumidity: "%85 - %90",
    targetFan: "Açık / Yüksek (6-8/10)",
    targetLight: "Açık (8-10 Saat)",
    warning:
      "🌾 HASAT BAŞLADI: Şapka altı zarları yırtılmadan olgunlaşan mantarları toplayın.",
    description: "1. Flaş (dalga) mantar hasadı başladı.",
    tasks: [
      "🌾 Olgunlaşan mantarları çevirerek sapıyla toplayın.",
      "Toplanan kg miktarını Hasat Kaydı alanına girin.",
    ],
  },
  5: {
    day: 5,
    stage: "Pin & Hasat Evresi",
    title: "5. Gün (Hasat/Şok) - Yoğun Hasat Toplama",
    targetTemp: "16°C - 18°C",
    targetCompostTemp: "18°C - 20°C",
    targetHumidity: "%85 - %90",
    targetFan: "Açık / Yüksek (6-8/10)",
    targetLight: "Açık (8-10 Saat)",
    description: "Hasat en yüksek seviyede.",
    tasks: [
      "🌾 Sabah ve akşam olgun mantarları toplayın.",
      "Günlük toplanan kilogramı kaydedin.",
    ],
  },
  6: {
    day: 6,
    stage: "Pin & Hasat Evresi",
    title: "6. Gün (Hasat/Şok) - 1. Flaş Sonu & Temizlik",
    targetTemp: "16°C - 18°C",
    targetCompostTemp: "18°C - 20°C",
    targetHumidity: "%85 - %90",
    targetFan: "Açık (4-6/10)",
    targetLight: "Açık (8-10 Saat)",
    description: "1. Flaş hasadı tamamlanıyor. Kök temizliği yapın.",
    tasks: [
      "🌾 Poşet üzerinde kalan kök artıklarını temizleyin.",
      "Kompost yüzeylerini nemlendirin.",
    ],
  },
  7: {
    day: 7,
    stage: "Pin & Hasat Evresi",
    title: "7. Gün (Hasat/Şok) - Dinlendirme ve Nemlendirme",
    targetTemp: "17°C - 19°C",
    targetCompostTemp: "19°C - 21°C",
    targetHumidity: "%90",
    targetFan: "Min (2/10)",
    description: "Kompost 2. flaş için dinlenmeye alındı.",
    tasks: ["💧 Nemi yüksek tutarak 2. dalga pinleşmeyi destekleyin."],
  },
  8: {
    day: 8,
    stage: "Pin & Hasat Evresi",
    title: "8. Gün (Hasat/Şok) - 2. Flaş Pin Gelişimi",
    targetTemp: "16°C - 18°C",
    targetCompostTemp: "18°C - 20°C",
    targetHumidity: "%85 - %90",
    targetFan: "Açık (6-8/10)",
    description: "2. Flaş pinleri büyümeye başladı.",
    tasks: ["❄️ Sıcaklığı tekrar 16-18°C'de sabitleyin."],
  },
  9: {
    day: 9,
    stage: "Pin & Hasat Evresi",
    title: "9. Gün (Hasat/Şok) - 2. Flaş Hasat Toplama",
    targetTemp: "16°C - 18°C",
    targetCompostTemp: "18°C - 20°C",
    targetHumidity: "%85 - %90",
    targetFan: "Açık (6-8/10)",
    description: "2. Dalga mantarlar toplanıyor.",
    tasks: ["🌾 2. Flaş mantarlarını toplayın ve kg miktarını girin."],
  },
  10: {
    day: 10,
    stage: "Pin & Hasat Evresi",
    title: "10. Gün (Hasat/Şok) - Genel Dönem Değerlendirmesi",
    targetTemp: "16°C - 18°C",
    targetCompostTemp: "18°C - 20°C",
    targetHumidity: "%85 - %90",
    targetFan: "Açık (6-8/10)",
    description: "Hasat evresi 10. gününü tamamladı.",
    tasks: ["📊 Toplam toplanan kilosunu ve verim oranını kontrol edin."],
  },
};

// Geriye dönük uyumluluk için yardımcı değişkenler
export const scratchTasks = scratchedDaysData.tasks;
export const pinSpottedTasks = harvestDaysData.tasks;
export const daysData = incubationDaysData;

// Kuluçka planı 21 gün sürer. Çizik gecikirse son günün hedeflerini
// koruyarak kullanıcıyı 1. güne geri döndürmeyelim.
export const getIncubationDayData = (day) => {
  const normalizedDay = Math.max(1, Math.floor(Number(day) || 1));
  const incubationDay = Math.min(normalizedDay, 21);
  return incubationDaysData[incubationDay] || incubationDaysData[1];
};

// Çizik ve hasat günlerinin bazılarında evre adı, başlık veya açıklama
// tanımlı değil; bunlar evrenin genel değerlerinden tamamlanır.
const INHERITED_PHASE_FIELDS = [
  "stage",
  "title",
  "targetTemp",
  "targetCompostTemp",
  "targetHumidity",
  "targetFan",
  "targetLight",
  "description",
];

// Plan süresi aşıldığında 1. güne dönmek yerine son günün hedefleri korunur.
const getPhaseDayData = (phaseData, day) => {
  const dayKeys = Object.keys(phaseData).map(Number).filter(Number.isInteger);
  const lastDay = Math.max(...dayKeys);
  const normalizedDay = Math.max(1, Math.floor(Number(day) || 1));
  const dayEntry = phaseData[Math.min(normalizedDay, lastDay)] || {};

  const inherited = {};
  INHERITED_PHASE_FIELDS.forEach((field) => {
    if (phaseData[field] !== undefined) inherited[field] = phaseData[field];
  });

  return { ...inherited, ...dayEntry };
};

export const getScratchDayData = (day) => getPhaseDayData(scratchedDaysData, day);
export const getHarvestDayData = (day) => getPhaseDayData(harvestDaysData, day);

export default daysData;
