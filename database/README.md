# Database

Bu klasör Veranin veritabanı şemasını ve seed dosyalarını içerir.

## Güncel tablo kaynağı

Ana kaynak `backend/models.py` dosyasıdır. Backend açılırken:

1. SQLite bozuk/eski şema kontrol edilir.
2. Eksik tablolar SQLAlchemy ile oluşturulur.
3. `database/word_seed_final_samples.csv` içindeki kelimeler otomatik içeri aktarılır.

Bu yüzden lokal geliştirmede ayrıca SQL çalıştırmadan backend başlatmak yeterlidir:

```bash
cd backend
python -m uvicorn main:app --reload
```

## Kelime seed durumu

`word_seed_final_samples.csv` dosyası güncellendi:

- 1540 kelime var: önceki 1440 kelime ve Oxford A1 listesinden seçilen 100 kelimelik deneme grubu.
- Her kelimenin Türkçe karşılığı var.
- Her kelimede 2 örnek cümle var.
- Eski 1440 kaydın CSV içindeki `difficulty_level` değerleri 1–10 aralığındadır; yeni A1 kelimeleri 1 değerindedir.
- İlk 1440 kelimenin CEFR bilgisi `level` kolonundadır; Oxford ile açık eşleşen 293 seviye etiketi düzeltildi.
- Yeni A1 grubunun kaynak verisi `database/oxford_a1_pilot_001.tsv` içindedir. Bu grubun ses dosyası araştırması sonraya bırakıldı; web arayüzünde cihazın İngilizce seslendirmesi kullanılabilir.

Backend içe aktarırken geçerli `level` etiketini A1–C2 için 1–6 düzeyine dönüştürür; arayüz CEFR etiketini bu düzeyden gösterir.

## PostgreSQL kullanımı

PostgreSQL için `init.sql` dosyası çalıştırılabilir. Ancak seed verileri backend açılışında CSV üzerinden otomatik aktarılır.

Örnek `.env`:

```env
DATABASE_URL=postgresql://postgres:SIFRE@localhost:5432/vera
```

## SQLite kullanımı

`.env` içinde `DATABASE_URL` boşsa veya SQLite verilirse backend otomatik `backend/vera.db` kullanır.

```env
DATABASE_URL=sqlite:///./vera.db
```

Önceki hatanın sebebi SQLite'ta `BIGINT PRIMARY KEY` kullanılmasıydı. Güncel modelde ID alanları SQLite ile uyumlu `INTEGER PRIMARY KEY` olarak oluşturulur.
