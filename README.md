# Mantar Asistanı (myceliumOS) 🍄

[![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

**Mantar Asistanı (myceliumOS)**, istiridye mantarı üreticilerinin tesislerindeki üretim odalarını, iklimsel hedef parametrelerini ve günlük hasat verimliliğini takip etmeleri için tasarlanmış **React Native (Expo)** tabanlı bir mobil takip ve yönetim uygulamasıdır.

Uygulama, mantar yetiştiriciliğinin kritik evrelerini (Kuluçka, Çizik, Pin ve Hasat) gün gün izleyerek üreticiye akıllı tavsiyeler ve iklimsel hedef parametreleri sunar.

---

## 🚀 Öne Çıkan Özellikler

*   **Evre Bazlı Akıllı Yönlendirme:** Mantar odasının ömrüne göre kuluçka, çizik veya hasat evrelerinde olması gereken sıcaklık, nem, kompost sıcaklığı ve havalandırma (fan) hedefleri dinamik olarak hesaplanır ve gösterilir.
*   **Gelişmiş Hasat Takibi ve Verimlilik Paneli:** Pinlenme oluştuktan sonra aktifleşen hasat modülüyle günlük toplanan mantar miktarları sisteme girilir. Uygulama, kompost miktarına göre **Biyolojik Etkinlik (Verimlilik)** oranını hesaplar ve rekolte hedefine ulaşma durumunu şık bir ilerleme çubuğuyla (progress bar) görselleştirir.
*   **Günlük İklim Günlüğü (Telemetri Kaydı):** Günde iki kez (Sabah ve Akşam) ortam sıcaklığı, kompost sıcaklığı, nem oranı ve fan çalışma durumu sisteme kaydedilerek geçmişe dönük veri takibi sağlanır.
*   **Görev Kontrol Listesi (Checklist):** Her güne özel mantarhanede yapılması gereken kritik işler (nemlendirme sıklığı, ışıklandırma durumu, havalandırma kontrolü) interaktif bir görev listesi olarak sunulur.
*   **Tamamen Çevrimdışı ve Güvenli (Offline-First):** Kullanıcı verileri ve odalara ait tüm geçmiş loglar, internete ihtiyaç duyulmadan tamamen yerel cihaz hafızasında (`AsyncStorage`) güvenle saklanır.

---

## 🛠️ Kullanılan Teknolojiler

*   **Mobil Altyapı:** React Native / Expo SDK
*   **Navigasyon:** `@react-navigation/native` & `@react-navigation/native-stack`
*   **Durum Yönetimi (State):** React Context API (`RoomContext`)
*   **Yerel Depolama:** `@react-native-async-storage/async-storage`
*   **Tasarım & Arayüz:** Vanilla StyleSheet (Özel koyu yeşil premium tema, altın ve yeşil vurgu renkleri)
*   **İkonlar:** `@expo/vector-icons` (Ionicons, FontAwesome5, FontAwesome6, Feather)

---

## 💻 Kurulum ve Çalıştırma

Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları takip edebilirsiniz:

### Gereksinimler
*   Bilgisayarınızda **Node.js** (LTS sürümü önerilir) kurulu olmalıdır.
*   Mobil cihazınızda test etmek için **Expo Go** (Android/iOS) uygulaması yüklü olmalıdır.

### Adımlar

1.  **Projeyi Klonlayın:**
    ```bash
    git clone https://github.com/KULLANICI_ADINIZ/myceliumOS.git
    cd myceliumOS
    ```

2.  **Bağımlılıkları Yükleyin:**
    ```bash
    npm install
    ```

3.  **Geliştirici Sunucusunu Başlatın:**
    ```bash
    npx expo start
    ```

4.  **Cihazınızda Çalıştırın:**
    *   Terminal ekranında veya tarayıcıda açılan **QR kodu** telefonunuzun kamerasıyla ya da **Expo Go** uygulamasıyla taratın.
    *   Alternatif olarak, bilgisayarınızda Android Emulator veya iOS Simulator kurulu ise sırasıyla `a` veya `i` tuşlarına basarak uygulamayı simülatörde çalıştırabilirsiniz.

---

## 📁 Proje Klasör Yapısı

```text
myceliumOS/
├── App.js                # Uygulama başlangıcı ve sağlayıcı (Provider) tanımlamaları.
├── RoomContext.js        # Global veri yönetimi, AsyncStorage işlemleri.
├── pages/                # Ekran yönlendirmeleri (Start, Home, NewRoom, Room)
├── components/           # Alt arayüz bileşenleri (Header, SideDrawer, DayInsight, vb.)
├── constants/            # Renk ve tasarım teması.
├── data/                 # Gün bazlı mantar yetiştirme bilgi bankası (daysData.js)
└── utils/                # Tarih ve hesaplama yardımcı metotları.
```

---

## 📝 Lisans

Bu proje **MIT Lisansı** altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına göz atabilirsiniz.
