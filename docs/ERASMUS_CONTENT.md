# Erasmus içerik verisi

`backend/data/erasmus_lessons.json` günlük çalışma rehberinden çıkarılan 42
takvim gününü içerir. Her kayıt gün numarası, tarih, ders başlığı, gün türü,
varsa video veya ders kaynağı ve doğrudan açılan reading bağlantılarını taşır.
Rehberdeki dakika aralıkları, kontrol kutuları ve uzun görev metinleri uygulama
içeriğine alınmaz. Kısa ders notları ve açıklamalı grammar soruları
`frontend/kelime-ezberleme/src/data/grammar.js` dosyasında tutulur.
Videoların gömme adresleri resmi engVid sayfalarından çıkarılır; orijinal ders
bağlantısı da arayüzde kalır.

`backend/data/erasmus_vocabulary.json` sözlük PDF'sindeki 30 adet 20 kelimelik
paketi içerir. Kelime paketinin `day` alanı sözlükteki sıra numarasıdır; ders
takvimindeki gün numarası değildir. Kullanıcı eski bir tarihli dersi bugün
çalışsa bile sıradaki kelime paketini atlamamalıdır. Tekrar tarihleri seçilen
ders tarihine göre değil, kelimenin gerçekten çalışıldığı tarihe göre
hesaplanmalıdır.

PDF'deki 600 kelime Erasmus modunun ilk 30 paketidir. Sonraki 12 paketteki
240 ek kelime `backend/data/erasmus_extra_vocabulary.json` içindedir. Bunlar
`tools/build_extra_vocabulary.py` ile kürate edilmiş, PDF kelimeleriyle
çakışmayan sözcüklerdir. Normal moddaki kelimeler otomatik olarak Erasmus
havuzuna katılmaz.

Backend bu kelimeleri `erasmus_words` tablosuna aktarır. Kullanıcı tekrarları
`erasmus_word_progress` tablosunda tutulur; normal modun `words` ve
`user_word_progress` tablolarına dokunulmaz. Erasmus ders kataloğu ile
kelime paketleri `/erasmus` altındaki ayrı uç noktalardan okunur.

Kaynak dosyalar yerel makinededir ve depoya eklenmez. İçeriği yeniden üretmek
için:

```text
python tools/import_erasmus_content.py GUIDE.docx VOCABULARY.pdf
```

İçe aktarma aracı 42 günü, PDF'deki 30 paketi ve paket başına 20 kelimeyi doğrular.
Ek paketleri yeniden oluşturmak için `python tools/build_extra_vocabulary.py`
komutunu kullanın. Video gömme adresleri mevcut ders verisinde saklanır.
Reading başlıkları British Council'daki doğrudan ders sayfalarına bağlanır.
