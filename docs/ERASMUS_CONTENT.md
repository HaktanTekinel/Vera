# Erasmus içerik verisi

`backend/data/erasmus_lessons.json` günlük çalışma rehberinden çıkarılan 42
takvim gününü içerir. Her kayıt gün numarası, tarih, ders başlığı, gün türü,
varsa video veya ders kaynağı ve doğrudan açılan reading bağlantılarını taşır.
Rehberdeki dakika aralıkları, kontrol kutuları ve uzun görev metinleri uygulama
içeriğine alınmaz. Kısa ders notları ve açıklamalı grammar soruları ayrı,
editoryal olarak hazırlanacak içeriklerdir.

`backend/data/erasmus_vocabulary.json` sözlük PDF'sindeki 30 adet 20 kelimelik
paketi içerir. Kelime paketinin `day` alanı sözlükteki sıra numarasıdır; ders
takvimindeki gün numarası değildir. Kullanıcı eski bir tarihli dersi bugün
çalışsa bile sıradaki kelime paketini atlamamalıdır. Tekrar tarihleri seçilen
ders tarihine göre değil, kelimenin gerçekten çalışıldığı tarihe göre
hesaplanmalıdır.

PDF'deki 600 kelime Erasmus modunun başlangıç havuzudur. İleride eklenebilecek
12 paket, yalnızca gözden geçirilmiş ve mevcut 600 kelimeyle çakışmayan
kelimelerden hazırlanmalıdır. Normal moddaki kelimeler otomatik olarak Erasmus
havuzuna katılmaz.

Kaynak dosyalar yerel makinededir ve depoya eklenmez. İçeriği yeniden üretmek
için:

```text
python tools/import_erasmus_content.py GUIDE.docx VOCABULARY.pdf
```

İçe aktarma aracı 42 günü, 30 paketi ve paket başına 20 kelimeyi doğrular.
Reading başlıkları British Council'daki doğrudan ders sayfalarına bağlanır.
