# Vera web önizlemesi

Bu önizleme, React arayüzünü ve FastAPI ders/quiz verilerini yerel bilgisayarda
çalıştırır. APK üretmez. İki VS Code terminali açın ve komutları depo kökünden
çalıştırın.

**Terminal 1 — API**

```powershell
cd backend
$env:DATABASE_URL = 'sqlite:///./vera_preview.db'
$env:CORS_ORIGINS = 'http://127.0.0.1:5175,http://localhost:5175'
..\.venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8001
```

**Terminal 2 — web**

```powershell
cd frontend\kelime-ezberleme
$env:VITE_API_BASE_URL = 'http://127.0.0.1:8001'
node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5175 --strictPort
```

Tarayıcıdan <http://127.0.0.1:5175/> adresini açın. İlk kullanımda hesap
oluşturabilirsiniz. Önizleme ayrı `backend/vera_preview.db` dosyasını kullanır;
bu dosya Git'e eklenmez. Eski çalışma veriniz bu önizlemeye taşınmaz.

İçeriği incelerken Erasmus'ta tarih şeridinden 8 Ekim dersini veya istediğiniz
başka günü seçin. Video sonrası not ve grammar quizini, alt menüden 20 kelimelik
paketi ve tekrar ekranını ayrı ayrı deneyin. Üçüncü taraf video gömme tarayıcıya
göre kısıtlanırsa dersin “Kaynak sayfasını aç” bağlantısını kullanın.
