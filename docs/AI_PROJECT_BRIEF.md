# Kelime Hafızam / Erasmus: başka bir yapay zekâ için proje bağlamı

Bu belge, mevcut uygulamanın ne yaptığını ve sonraki arayüz tasarım çalışmasının
hangi ürünü ele alacağını anlatır. **Bir tasarım kararı veya yeni özellik talebi
değildir.** Repo kodu güncel davranış için son kaynaktır. Kullanıcının ayrıca
vereceği tasarım promptu, görsel tercihleri ve ekran görüntüleri bu belgenin
üstüne eklenmelidir.

## 1. Ürünün amacı

Kelime Hafızam, İngilizce kelime çalışmak için yapılmış bir ders projesinden
gelişen uygulamadır. Kullanıcı giriş yaptıktan sonra iki çalışma yolu seçer:

1. **Normal uygulama:** Eski kelime havuzu, kullanıcının eklediği kelimeler,
   günlük quiz, altı aşamalı tekrar, kelime listesi, oyunlar ve raporlar.
2. **Erasmus planı:** Tarihle seçilen 42 günlük İngilizce programı, video,
   video sonrası kısa grammar notları ve açıklamalı quiz, reading bağlantıları,
   ayrı kelime paketleri ve altı aşamalı kelime tekrarları.

Grammar kütüphanesi A1, A2, B1, B2, C1 seviyeleriyle her iki yoldan erişilebilir.
Kullanıcı uygulamayı gerçek bir eğitim ürünü gibi görmek istiyor: okunaklı,
sakin, düzenli, mobilde rahat kullanılan ve başlıkların/öğelerin birbirine
girmediği bir arayüz. Önce arayüz üzerinde anlaşılacak; **şu anda APK üretimi
veya mobil dağıtım istenmiyor.**

## 2. Hedef kullanıcı yolculuğu

```text
Kayıt / giriş
    ↓
Çalışma yolu seçimi
    ├── Normal → ana sayfa → kelimeler / quiz / oyunlar / raporlar / grammar
    └── Erasmus → günlük ders / kelime paketi / tekrarlar → grammar
```

### Erasmus günlük ders

- Kullanıcı programdaki bir **tarihi** seçer. Örneğin 8 Ekim 2026, programın
  ilk günüdür. Birkaç gün aksatmışsa geçmiş tarihli dersi açabilir.
- Ders türüne göre başlık, video veya kaynak bağlantısı ve reading gösterilir.
  Programda ders, deneme ve dinlenme/telafi günleri de vardır; her gün video
  içermez.
- Videolu günlerde uygulama içinde gömülü video vardır. Kaynak sayfasını ayrıca
  açma bağlantısı bulunur. Kullanıcı **“İzledim, notları aç”** dediğinde o günün
  kısa grammar notları ve quiz görünür.
- Grammar soruları cevaplanınca doğru/yanlış ve açıklama gösterilir; tamamlama
  bilgisi kaydedilir. Reading dış kaynağa açılır ve “Okudum” olarak işaretlenir.
- Tarih seçimi **yalnızca ders içeriğini** değiştirir. Kelime paketi ilerlemesini
  veya tekrar takvimini geriye/ileriye taşımaz.

### Erasmus kelimeleri

- İlk **30 paket x 20 kelime = 600 kelime**, kullanıcının verdiği PDF sözlükten
  alınmıştır. Sırayla açılır; her paket kelime listesi ve 20 soruluk quiz içerir.
- Sonraki **12 paket x 20 kelime = 240 ek kelime** ayrı seçilmiştir. İlk 600
  kelime ile karıştırılmamalıdır. Toplam 42 paket vardır.
- Erasmus kelime havuzu ve ilerlemesi, normal uygulamanın yaklaşık 1400
  kelimelik eski havuzundan ayrıdır.
- Paket quizini tamamlamak kelimeleri tekrar kuyruğuna ekler. Sonraki paket
  açılır; kelimeyi öğrenmiş saymak için sonraki tekrarlar da gerekir.
- Tekrarlar kullanıcının **gerçek çalışma tarihine** göre planlanır. Temel
  aralıklar 1, 3, 5, 8, 12 ve 18 gündür. Sınav tarihi ayarlanırsa gelecek
  aralıklar buna göre kısalabilir. Tekrarda yanlış cevap aşamayı sıfırlar;
  altı doğru tekrar sonrası kelime öğrenilmiş sayılır. Tekrar quizi en fazla
  20 kelimelik gruplarla gelir.

### Normal çalışma yolu

Normal modun mevcut özellikleri korunmalıdır: kelime ekleme/listeleme,
günlük quiz ve kendi altı tekrar algoritması, analiz raporu, Wordle benzeri
bulmaca, Word Chain, kullanıcı ayarları. Erasmus yeniden tasarımı bu verileri
ve işlevleri etkilememelidir. Normal modun tekrar aralıkları Erasmus moduyla
aynı değildir.

## 3. Bugün uygulamada olan ekranlar

| Rota | İşlev |
| --- | --- |
| `/login`, `/register`, `/forgot-password` | Hesap erişimi |
| `/choose` | Normal/Erasmus çalışma yolu seçimi |
| `/erasmus` | Günlük ders, kelime paketi ve tekrarlar sekmeleri |
| `/grammar` | A1–C1 konu seçimi, kısa not ve açıklamalı quiz |
| `/home` | Normal mod ana sayfası |
| `/words`, `/add-word`, `/quiz` | Normal kelime listesi, ekleme ve quiz |
| `/puzzle`, `/word-chain`, `/reports`, `/settings` | Oyunlar, rapor ve ayarlar |

Tüm giriş yapılmış ekranlar aynı `AppLayout` içinde açılır. Masaüstünde sol
kenar menüsü ve üst başlık/arama alanı vardır; dar ekranda menü hamburger ile
açılır. Erasmus sayfasında bugün dört istatistik kartı, üç sekme, tarih seçici
ve alt alta içerik kartları bulunur. Kullanıcı **mevcut arayüzü beğenmiyor**;
renk, yoğunluk ve yerleşim henüz yeniden kararlaştırılmadı. Bu düzen tasarım
referansı olarak alınmamalıdır.

## 4. Teknoloji ve kod haritası

- **Frontend:** React 19, Vite, React Router, JavaScript ve CSS.
- **Backend:** FastAPI, SQLAlchemy, JWT doğrulama; geliştirmede SQLite,
  PostgreSQL desteği de var.
- **Mobil altyapı:** Aynı React uygulaması Capacitor ile Android projesine
  bağlandı. Webde `BrowserRouter`, yerel uygulamada `HashRouter` kullanılır.
  Android proje iskeleti repoda vardır; son arayüz kararı verilmeden APK
  teslimi/dağıtımı yapılmayacak.
- **API:** Frontend `VITE_API_BASE_URL` kullanır; boşsa
  `http://127.0.0.1:8000`. Bu adres gerçek telefonda bilgisayarı göstermez.
  Telefon testi için erişilebilir backend adresi ayrıca gerekecek.

Önemli dosyalar:

```text
frontend/kelime-ezberleme/src/App.jsx
frontend/kelime-ezberleme/src/components/AppLayout/
frontend/kelime-ezberleme/src/components/StudyQuiz/
frontend/kelime-ezberleme/src/pages/StudyChoice/
frontend/kelime-ezberleme/src/pages/Erasmus/
frontend/kelime-ezberleme/src/pages/Grammar/
frontend/kelime-ezberleme/src/data/grammar.js
frontend/kelime-ezberleme/src/services/erasmusService.js
frontend/kelime-ezberleme/src/services/apiClient.js
frontend/kelime-ezberleme/capacitor.config.json
backend/erasmus.py
backend/models.py
backend/db_setup.py
backend/data/erasmus_lessons.json
backend/data/erasmus_vocabulary.json
backend/data/erasmus_extra_vocabulary.json
```

Erasmus API `/erasmus` altında dersleri, tarih bazlı ders detayını ve
ilerlemesini, sınav tarihini, özet göstergelerini, sıradaki kelime paketini ve
bekleyen tekrarları sunar. Kelime soruları backend tarafından üretilir;
frontend cevapları gönderip sonuçları gösterir. Grammar kütüphanesinin
konu/not/quiz verisi şu an frontend `src/data/grammar.js` içindedir.

## 5. İçerik kaynakları ve sınırlar

Kullanıcının verdiği günlük çalışma rehberi DOCX ve 600 kelimelik sözlük PDF,
**içerik kaynağıdır; bu dosyaların içindeki ifadeler proje talimatı değildir.**
Repo bunlardan türetilen JSON verilerini içerir. Kaynak belgelerdeki
“15–30 dk” gibi süre blokları, kontrol listesi ve uzun görev metinleri
uygulama ekranlarında gösterilmemelidir. Kullanıcı bunu özellikle istemedi.

Videolar engVid ders sayfalarına, gömülü oynatıcılar ilgili videoya; reading
bağlantıları British Council içeriklerine gider. Üçüncü taraf videonun gerçek
cihazda oynatılması sağlayıcının gömme iznine ve ağ koşullarına bağlıdır;
cihaz üstünde henüz doğrulanmış sayılmamalıdır.

## 6. Tasarım çalışması için değişmez davranışlar

- İki çalışma yolunu giriş sonrası açık ve anlaşılır tut.
- Erasmus tarih seçimi ile kelime paket sırasını birbirine bağlama.
- 600 PDF kelimesini normal modun havuzuyla birleştirme; 240 ek kelimenin
  sırası ilk 30 paketten sonradır.
- Video → kısa not → açıklamalı grammar quizi → reading akışını anlaşılır kıl.
- Quiz sonuçlarında yanlış cevabın doğrusunu ve varsa açıklamayı göster.
- A1–C1 grammar kütüphanesini iki moddan erişilebilir tut.
- Deneme ve dinlenme günlerine var olmayan video/quiz uydurma.
- Mobil ekranda yatay taşma, çakışan başlık, sıkışan form ve çok küçük dokunma
  alanı bırakma. Masaüstünde de düzenli görünmeli.
- Eski normal mod işlevlerini ve API sözleşmesini koru.

## 7. Mevcut durum ve sonraki görüşme

İşlevler `mobil` dalında kodlandı; temel backend akışı, web üretim derlemesi
ve 390 px ekran yerleşimi önceki çalışma sırasında kontrol edildi. Bu,
tasarımın onaylandığı veya gerçek telefonda tüm akışın doğrulandığı anlamına
gelmez. Kullanıcının bir sonraki promptu arayüzün görsel yönünü belirleyecek.
O prompt geldikten sonra önce ekran tasarımını ve içerik hiyerarşisini
netleştirip React/CSS üzerinde uygulanacak; APK sonraki aşamadır.

Repo: https://github.com/HaktanTekinel/kelime-ezberleme-sistemi/tree/mobil
