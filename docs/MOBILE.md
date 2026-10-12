# Mobil geliştirme

React uygulaması Capacitor ile Android projesine dönüştürülür. Web arayüzü ve FastAPI sunucusu aynı API'yi kullanır. Yerel `127.0.0.1` adresi telefonda bilgisayarı göstermez; cihaz testinde erişilebilir bir HTTPS API adresini `VITE_API_BASE_URL` olarak derleme sırasında ayarlayın.

```powershell
cd frontend\kelime-ezberleme
npm.cmd install
npm.cmd run build
npm.cmd run mobile:android
```

Android Studio ve Android SDK gerekir. Her React değişikliğinden sonra `npm.cmd run mobile:sync` çalıştırın. iOS projesi yalnızca macOS/Xcode ortamında üretilebilir.

Bu depoda Android projesi oluşturulmuştur; mevcut kurulumda yeniden `cap add android`
çalıştırmayın. Android derlemesi için Java 17–24 kullanın. Gradle 8.14.3
Java 25 üzerinde çalışmaz. Windows'ta `JAVA_HOME` geçerli bir JDK'ya işaret etmelidir.

Video ve reading bağlantıları üçüncü taraf içeriktir; sağlayıcının gömme iznine bağlıdır. Ders sayfasında doğrudan kaynak bağlantısı da bulunur.
