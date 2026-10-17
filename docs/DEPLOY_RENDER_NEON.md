# Vera API'yi Render ve Neon'da çalıştırma

Bu kurulum mobil uygulamanın FastAPI sunucusunu bilgisayardan taşır. Neon'da yeni,
boş bir PostgreSQL veritabanı açılır; yerel kullanıcı hesapları ve ilerleme
aktarılmaz. Başlangıç kelimeleri sunucu ilk açıldığında eklenir.

## Hizmetler

- **Neon PostgreSQL:** hesaplar, kelimeler ve çalışma ilerlemesi.
- **Neon Object Storage:** kullanıcı görselleri ve Word Chain görselleri.
- **Render Web Service:** FastAPI uygulaması ve HTTPS adresi.

Render'ın ücretsiz Web Service'i 15 dakika isteksiz kaldığında uyur. Sonraki
istek yeniden başlatmayı bekler; bu, kesintisiz çalışan bir sunucu değildir.
Render'ın ücretsiz yerel diski kalıcı olmadığı için `backend/vera.db` veya
yüklenen görseller orada saklanmaz.

## Hazırlık

1. Neon'da Frankfurt'a yakın bir bölgede proje ve PostgreSQL veritabanı açın.
   Bağlantı dizesini `?sslmode=require` ile alın. Bu dizeyi Git'e eklemeyin.
2. Aynı Neon projesinde `vera-uploads` adında Object Storage bucket'ı açın.
   S3 bağlantı bilgilerini (`AWS_ENDPOINT_URL_S3`, `AWS_REGION`,
   `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`) alın. Bucket özel kalabilir;
   dosyaları Vera API sunar.
3. Kodun güncel halini size ait özel GitHub `Vera` deposuna gönderin.
   `.env`, yerel `.db` ve kullanıcı yüklemeleri Git'e eklenmemelidir.
4. Render'da **New → Blueprint** ile depodaki `render.yaml` dosyasını seçin.
   `DATABASE_URL` alanına Neon bağlantı dizesini, `AWS_*` alanlarına Object
   Storage bilgilerini, `UPLOAD_BUCKET` alanına `vera-uploads` yazın.
   `SECRET_KEY` Render tarafından üretilir.
5. Dağıtım bitince `https://<servis>.onrender.com/` adresinin
   `{"message":"Backend çalışıyor"}` döndürdüğünü kontrol edin. Sonra yeni
   hesap oluşturup giriş ve quiz akışını deneyin.
6. Android uygulamasındaki **Sunucu bağlantısı** alanına Render HTTPS ana
   adresini yazın. Bu adres telefonda saklanır; APK'yı tekrar derlemek gerekmez.

Render'da `EXPOSE_RESET_TOKEN_IN_RESPONSE=false` olduğu için demo şifre sıfırlama
token'ı API yanıtında gösterilmez. E-posta gönderimi eklenene kadar şifre
sıfırlama özelliği kullanılamaz. Word Chain için ayrıca `OPENAI_API_KEY`
gerekir; anahtar eklenmezse uygulamanın diğer bölümleri çalışır.

## Kaynaklar

- [Render FastAPI dağıtımı](https://render.com/docs/deploy-fastapi)
- [Render ücretsiz hizmet sınırları](https://render.com/docs/free)
- [Neon Object Storage başlangıç](https://neon.com/docs/storage/get-started)
