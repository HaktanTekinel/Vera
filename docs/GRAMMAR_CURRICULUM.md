# Vera grammar konu haritası

Bu harita dersleri uygulamada çalışılabilir gruplara ayırır. Cambridge kitaplarının
üniteleri bire bir kopyalanmadı; anlatımlar ve quiz soruları Vera için özgün yazıldı.
CEFR etiketleri uygulamanın öğretim sırasıdır, Cambridge'in her üniteye verdiği
resmî A1/B1/B2 etiketi olarak okunmamalıdır.

| Seviye | Konu | Kapsam |
| --- | ---: | --- |
| A1 | 14 | be, zamir/iyelik, isim/article, işaret sözcükleri, there is/are, have/have got, Present Simple ve Continuous, sorular, miktar, can/emir, yer/zaman edatları, like/want/would like, Past Simple |
| A2 | 9 | Present Simple/Continuous ve Past Simple/Continuous seçimi, Past Continuous, Present Perfect temeli, gelecek biçimleri, could/have to/should, fiilden sonra -ing/to, sıfat/zarf, karşılaştırma ve miktar |
| B1 | 10 | Present Perfect ve Continuous, Past Perfect, modals, article/edat tekrarı, passive, used to, reported speech, tanımlayıcı relative clauses, dolaylı sorular |
| B2 | 10 | relative clauses, conditionals, gerund/infinitive, bağlaçlar, sınav stratejileri, Future Continuous/Perfect, wish/if only, ileri reported speech, ettirgen, participle clauses |
| C1 | 3 | inversion, geçmiş modals, nominalisation |

Bir konunun olumlu, olumsuz ve soru biçimleri aynı dersin içinde. `Have` ve
`have got` da birlikte karşılaştırılır. Her kütüphane dersinde ayrıntılı açıklama,
örnekler, kısa not ve 20 açıklamalı **grammar** sorusu vardır. Erasmus kelime
paketleri ayrı veri havuzunda kalır.

Her konu dersinin notlarından önce doğrulanmış bir engVid video dersi bulunur.
Birleştirilmiş konularda ilgili alt başlıklar için ek videolar seçilebilir.
Öğretmen adı, ders başlığı ve gömülü oynatıcı kimliği engVid kaynak sayfasından
alınır; oynatıcı erişilemezse kaynak sayfası bağlantısı kullanılabilir.
Video eşleştirmeleri `tools/grammar_video_candidates.json` dosyasında tutulur;
`python tools/build_grammar_videos.py` komutu veriyi yeniden doğrular.

Yeni soru yazarken doğru seçeneğin iki örneğe de uyduğunu elle kontrol edin:
`npm run review:grammar -- A1` veya tek konu için
`npm run review:grammar -- have-got`. Bu komut soruları doğru cevapla doldurulmuş
cümleler olarak listeler. Ardından `npm run test:grammar` yapısal kontrolü çalıştırır.

Konu kapsamını karşılaştırırken kullanılan birincil kaynaklar:

- [Cambridge Essential Grammar in Use, 4. baskı içindekiler](https://assets.cambridge.org/97811074/80551/toc/9781107480551_toc.pdf)
- [Cambridge English Grammar in Use, 5. baskı içindekiler](https://assets.cambridge.org/97811084/57651/toc/9781108457651_toc.pdf)
- [Cambridge Empower Starter/A1 Workbook içindekiler](https://assets.cambridge.org/97811089/61738/toc/9781108961738_toc.pdf)
- [Cambridge Empower Elementary/A2 Student's Book içindekiler](https://assets.cambridge.org/97811089/65262/toc/9781108965262_toc.pdf)
