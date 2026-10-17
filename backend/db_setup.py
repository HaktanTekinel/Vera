from __future__ import annotations

import csv
import hashlib
import json
import shutil
import sqlite3
from datetime import datetime
from pathlib import Path

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session

import models
from database import SessionLocal

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
WORD_SEED_CSV = ROOT_DIR / "database" / "word_seed_final_samples.csv"
ERASMUS_VOCABULARY_JSON = BASE_DIR / "data" / "erasmus_vocabulary.json"
ERASMUS_EXTRA_VOCABULARY_JSON = BASE_DIR / "data" / "erasmus_extra_vocabulary.json"

ID_TABLES = [
    "users",
    "user_settings",
    "words",
    "word_samples",
    "user_word_progress",
    "quiz_sessions",
    "quiz_answers",
    "password_reset_tokens",
    "report_snapshots",
    "study_attempts",
    "wordle_games",
    "wordle_guesses",
    "word_chain_stories",
    "grammar_notes",
    "erasmus_words",
    "erasmus_word_progress",
    "erasmus_package_progress",
    "erasmus_lesson_progress",
]


def is_sqlite(engine: Engine) -> bool:
    return engine.url.get_backend_name() == "sqlite"


def get_sqlite_path(engine: Engine) -> Path | None:
    database = engine.url.database
    if not database or database == ":memory":
        return None
    return Path(database).resolve()


def table_exists(cursor: sqlite3.Cursor, table_name: str) -> bool:
    cursor.execute(
        "SELECT 1 FROM sqlite_master WHERE type='table' AND name=?",
        (table_name,),
    )
    return cursor.fetchone() is not None


def has_sqlite_autoincrement_id(cursor: sqlite3.Cursor, table_name: str) -> bool:
    if not table_exists(cursor, table_name):
        return True

    cursor.execute(f"PRAGMA table_info({table_name})")
    for column in cursor.fetchall():
        # cid, name, type, notnull, dflt_value, pk
        _cid, name, column_type, _notnull, _default, primary_key = column
        if name == "id":
            return primary_key == 1 and str(column_type).upper() == "INTEGER"

    return True


def reset_broken_sqlite_database_if_needed(engine: Engine) -> None:
    """
    Eski kod SQLite üzerinde BIGINT PRIMARY KEY üretmişse otomatik id çalışmaz.
    Bu durumda register/quiz/settings 500 verir. Lokal geliştirme DB'si yedeklenip
    yeniden oluşturulur. PostgreSQL'e dokunmaz.
    """
    if not is_sqlite(engine):
        return

    db_path = get_sqlite_path(engine)
    if not db_path or not db_path.exists():
        return

    connection = sqlite3.connect(db_path)
    cursor = connection.cursor()

    try:
        broken_tables = [
            table_name
            for table_name in ID_TABLES
            if not has_sqlite_autoincrement_id(cursor, table_name)
        ]
    finally:
        connection.close()

    if not broken_tables:
        return

    engine.dispose()
    backup_path = db_path.with_name(
        f"{db_path.stem}.broken-{datetime.now().strftime('%Y%m%d%H%M%S')}{db_path.suffix}"
    )
    shutil.copy2(db_path, backup_path)
    db_path.unlink()
    print(
        "SQLite şeması eski olduğu için DB yenilendi. "
        f"Yedek: {backup_path.name}; sorunlu tablolar: {', '.join(broken_tables)}"
    )


def normalize_difficulty(row: dict, row_index: int) -> int:
    cefr = (row.get("level") or "").strip().upper()
    fallback_map = {
        "A1": 1,
        "A2": 2,
        "B1": 3,
        "B2": 4,
        "C1": 5,
        "C2": 6,
    }

    if cefr in fallback_map:
        return fallback_map[cefr]

    raw_value = (row.get("difficulty_level") or "").strip()
    if raw_value.isdigit():
        return min(max(int(raw_value), 1), 6)

    return (row_index % 6) + 1


TOPIC_KEYWORDS = {
    "Hayvanlar": (
        "animal", "animals", "bear", "bird", "cat", "dog", "fish", "horse", "lion", "monkey", "rabbit", "tiger", "wolf", "zebra", "zoo", "zoology", "zoologist",
        "hayvan", "kuş", "kedi", "köpek", "balık", "at", "aslan", "kaplan", "kurt", "ayı", "zebra", "zooloji", "zoolog"
    ),
    "Yiyecek ve İçecek": (
        "apple", "banana", "bread", "cake", "candy", "cheese", "chicken", "coffee", "drink", "eat", "egg", "food", "fruit", "garlic", "juice", "meal", "milk", "onion", "orange", "pancake", "papaya", "rice", "salad", "salmon", "sausage", "tea", "vegetable", "walnut", "water",
        "elma", "muz", "ekmek", "pasta", "şeker", "peynir", "tavuk", "kahve", "içecek", "yemek", "yumurta", "meyve", "sarımsak", "süt", "soğan", "portakal", "salata", "çay", "sebze", "ceviz", "su"
    ),
    "Doğa": (
        "air", "beach", "cloud", "dark", "earth", "ecology", "ecological", "flower", "forest", "garden", "grass", "hill", "island", "lake", "land", "leaf", "mountain", "nature", "ocean", "plant", "rain", "river", "sea", "sky", "snow", "tree", "weather", "wind",
        "hava", "plaj", "bulut", "dünya", "çiçek", "orman", "bahçe", "çim", "tepe", "ada", "göl", "dağ", "doğa", "okyanus", "bitki", "yağmur", "nehir", "deniz", "gökyüzü", "kar", "ağaç", "rüzgar"
    ),
    "Eğitim": (
        "answer", "book", "campus", "class", "course", "education", "educational", "exam", "homework", "language", "learn", "lesson", "library", "page", "pen", "read", "school", "student", "study", "teacher", "test", "university", "vocabulary", "write",
        "cevap", "kitap", "kampüs", "sınıf", "kurs", "eğitim", "sınav", "ödev", "dil", "öğren", "ders", "kütüphane", "sayfa", "kalem", "oku", "okul", "öğrenci", "çalış", "öğretmen", "üniversite", "kelime", "yaz"
    ),
    "İş Dünyası": (
        "account", "agreement", "business", "career", "company", "customer", "deal", "employee", "factory", "job", "manager", "meeting", "occupation", "office", "project", "report", "salary", "sale", "service", "team", "work", "worker",
        "hesap", "anlaşma", "iş", "kariyer", "şirket", "müşteri", "çalışan", "fabrika", "meslek", "ofis", "proje", "rapor", "maaş", "satış", "hizmet", "takım"
    ),
    "Teknoloji": (
        "app", "camera", "computer", "data", "device", "digital", "email", "internet", "keyboard", "laptop", "message", "online", "phone", "robot", "screen", "software", "system", "technology", "video", "website",
        "uygulama", "kamera", "bilgisayar", "veri", "cihaz", "dijital", "e-posta", "internet", "klavye", "laptop", "mesaj", "çevrim", "telefon", "robot", "ekran", "yazılım", "sistem", "teknoloji", "video", "web"
    ),
    "Sağlık": (
        "back", "body", "doctor", "exercise", "fatigue", "health", "heart", "hospital", "ill", "medicine", "neck", "pain", "pandemic", "patient", "sleep", "sport", "strong", "tired", "walk",
        "vücut", "doktor", "egzersiz", "sağlık", "kalp", "hastane", "hasta", "ilaç", "boyun", "ağrı", "pandemi", "uyku", "spor", "güçlü", "yorgun", "yürü"
    ),
    "Seyahat": (
        "airport", "arrive", "bus", "car", "carrier", "ecotourism", "flight", "hotel", "journey", "map", "passport", "plane", "road", "station", "taxi", "ticket", "tour", "train", "travel", "trip", "vacation", "visit",
        "havaalanı", "varmak", "otobüs", "araba", "uçuş", "otel", "yolculuk", "harita", "pasaport", "uçak", "yol", "istasyon", "taksi", "bilet", "tur", "tren", "seyahat", "gezi", "tatil", "ziyaret"
    ),
    "Duygular": (
        "afraid", "angry", "bored", "calm", "cry", "emotion", "excited", "fear", "feel", "glad", "happy", "happiness", "hope", "laugh", "love", "sad", "smile", "surprise", "worry",
        "kork", "kızgın", "sıkılmış", "sakin", "ağla", "duygu", "heyecan", "mutlu", "umut", "gül", "sevgi", "üzgün", "gülümse", "şaş", "endişe"
    ),
    "Davranış ve Kişilik": (
        "action", "activity", "active", "bad", "badly", "brave", "careful", "clever", "easily", "friendly", "hardly", "honest", "kind", "kindly", "lazy", "noble", "polite", "quiet", "rude", "serious", "shy", "smart", "wordsmith",
        "davranış", "eylem", "aktif", "kötü", "cesur", "dikkatli", "zeki", "kolayca", "dostça", "dürüst", "nazik", "tembel", "soylu", "kibar", "sessiz", "kaba", "ciddi", "utangaç"
    ),
    "Sanat ve Kültür": (
        "actor", "art", "artist", "cinema", "culture", "dance", "dancing", "film", "magazine", "movie", "music", "paint", "painting", "picture", "song", "story", "theatre", "writer",
        "aktör", "sanat", "sanatçı", "sinema", "kültür", "dans", "film", "dergi", "müzik", "boya", "resim", "şarkı", "hikaye", "tiyatro", "yazar"
    ),
    "Bilim": (
        "biology", "calculation", "calculate", "chemistry", "economics", "energy", "experiment", "gravity", "history", "laboratory", "math", "physics", "research", "science", "space",
        "biyoloji", "hesaplama", "kimya", "ekonomi", "enerji", "deney", "yerçekimi", "tarih", "laboratuvar", "matematik", "fizik", "araştırma", "bilim", "uzay"
    ),
    "Günlük Yaşam": (
        "about", "above", "address", "after", "afternoon", "again", "always", "baby", "bag", "ball", "bar", "baseball", "basketball", "bed", "breakfast", "call", "card", "cash", "city", "dad", "daddy", "date", "day", "door", "ear", "early", "face", "family", "farm", "farmer", "gift", "girl", "girlfriend", "hair", "haircut", "hand", "home", "house", "jacket", "jeans", "kitchen", "lunch", "market", "money", "morning", "name", "night", "pants", "room", "shop", "street", "time", "today", "tomorrow", "waiter", "wall", "yes",
        "hakkında", "yukarı", "adres", "sonra", "öğleden", "bebek", "çanta", "top", "yatak", "kahvaltı", "ara", "kart", "nakit", "şehir", "baba", "tarih", "gün", "kapı", "kulak", "erken", "yüz", "aile", "çiftlik", "hediye", "kız", "saç", "el", "ev", "ceket", "kot", "mutfak", "öğle", "market", "para", "sabah", "isim", "gece", "pantolon", "oda", "mağaza", "sokak", "zaman", "bugün", "yarın", "garson", "duvar", "evet"
    ),
}
ORDER = list(TOPIC_KEYWORDS)


def tokenize_topic_text(row: dict) -> set[str]:
    normalized = []
    text = f"{row.get('eng_word', '')} {row.get('tur_word', '')}".lower()

    for char in text:
        normalized.append(char if char.isalnum() else " ")

    return set("".join(normalized).split())


def has_topic_keyword(text: str, tokens: set[str], keyword: str) -> bool:
    if len(keyword) <= 4:
        return keyword in tokens

    return keyword in text


def infer_topic(row: dict) -> str:
    text = f"{row.get('eng_word', '')} {row.get('tur_word', '')}".lower()
    tokens = tokenize_topic_text(row)

    for topic in ORDER:
        if any(has_topic_keyword(text, tokens, keyword) for keyword in TOPIC_KEYWORDS[topic]):
            return topic

    return "Genel"

def clean_text(value: str | None) -> str | None:
    value = (value or "").strip()
    return value or None


def upsert_word_from_row(db: Session, row: dict, row_index: int) -> bool:
    eng_word = clean_text(row.get("eng_word"))
    tur_word = clean_text(row.get("tur_word"))

    if not eng_word or not tur_word:
        return False

    word = (
        db.query(models.Word)
        .filter(models.Word.eng_word.ilike(eng_word))
        .filter(models.Word.created_by_user_id.is_(None))
        .first()
    )

    difficulty_level = normalize_difficulty(row, row_index)
    topic = clean_text(row.get("topic")) or infer_topic(row)

    if not word:
        word = models.Word(
            eng_word=eng_word,
            tur_word=tur_word,
            difficulty_level=difficulty_level,
            topic=topic,
            picture_url=clean_text(row.get("picture")),
            audio_url=clean_text(row.get("audio_url")),
            is_active=True,
        )
        db.add(word)
        db.flush()
    else:
        word.tur_word = tur_word
        word.difficulty_level = difficulty_level
        word.topic = topic
        word.picture_url = clean_text(row.get("picture")) or word.picture_url
        word.audio_url = clean_text(row.get("audio_url")) or word.audio_url
        word.is_active = True

    samples = [
        clean_text(row.get("sample_sentence_1")),
        clean_text(row.get("sample_sentence_2")),
    ]

    for sample_order, sample_text in enumerate(samples, start=1):
        if not sample_text:
            continue

        exists = (
            db.query(models.WordSample)
            .filter(models.WordSample.word_id == word.id)
            .filter(models.WordSample.sample_text == sample_text)
            .first()
        )

        if not exists:
            db.add(
                models.WordSample(
                    word_id=word.id,
                    sample_text=sample_text,
                    sample_order=sample_order,
                )
            )

    return True


def seed_words_from_csv() -> None:
    if not WORD_SEED_CSV.exists():
        print(f"Kelime CSV bulunamadı: {WORD_SEED_CSV}")
        return

    db = SessionLocal()

    try:
        with WORD_SEED_CSV.open("r", encoding="utf-8-sig", newline="") as csv_file:
            reader = csv.DictReader(csv_file)
            changed_count = 0

            for row_index, row in enumerate(reader):
                if upsert_word_from_row(db, row, row_index):
                    changed_count += 1

        db.commit()
        print(f"Kelime seed kontrolü tamamlandı. İşlenen kelime: {changed_count}")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def seed_erasmus_words_from_json() -> None:
    pdf_packages = json.loads(ERASMUS_VOCABULARY_JSON.read_text(encoding="utf-8"))
    extra_packages = json.loads(ERASMUS_EXTRA_VOCABULARY_JSON.read_text(encoding="utf-8"))
    packages = pdf_packages + extra_packages
    if len(pdf_packages) != 30 or len(extra_packages) != 12 or any(len(package["words"]) != 20 for package in packages):
        raise ValueError("Erasmus vocabulary must contain 30 PDF and 12 extra packages of 20 words")
    if len({item["word"].casefold() for package in packages for item in package["words"]}) != 840:
        raise ValueError("Erasmus vocabulary words must be unique")

    db = SessionLocal()
    try:
        existing = {
            word.sequence: word for word in db.query(models.ErasmusWord).all()
        }
        sequence = 0
        for package in packages:
            for item in package["words"]:
                sequence += 1
                word = existing.get(sequence)
                if word is None:
                    word = models.ErasmusWord(sequence=sequence)
                    db.add(word)
                word.package_day = package["day"]
                word.theme = package["theme"]
                word.eng_word = item["word"]
                word.tur_word = item["meaning_tr"]
                word.part_of_speech = item["part_of_speech"]
                word.exam_sections = item["exam_sections"]
                word.usage = item["usage"]
                word.source = "pdf" if package["day"] <= 30 else "extra"
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def seed_when_changed(engine: Engine, name: str, paths: list[Path], seed) -> None:
    checksum = hashlib.sha256()
    for path in paths:
        checksum.update(path.read_bytes())
    digest = checksum.hexdigest()
    with engine.begin() as connection:
        connection.execute(text(
            "CREATE TABLE IF NOT EXISTS seed_state "
            "(name VARCHAR(64) PRIMARY KEY, checksum VARCHAR(64) NOT NULL)"
        ))
        current = connection.execute(
            text("SELECT checksum FROM seed_state WHERE name = :name"), {"name": name}
        ).scalar_one_or_none()
    if current == digest:
        return

    seed()
    with engine.begin() as connection:
        connection.execute(text("DELETE FROM seed_state WHERE name = :name"), {"name": name})
        connection.execute(
            text("INSERT INTO seed_state (name, checksum) VALUES (:name, :checksum)"),
            {"name": name, "checksum": digest},
        )


def initialize_database(engine: Engine) -> None:
    reset_broken_sqlite_database_if_needed(engine)
    models.Base.metadata.create_all(bind=engine)
    columns = {column["name"] for column in inspect(engine).get_columns("study_attempts")}
    with engine.begin() as connection:
        if "lesson_day" not in columns:
            connection.execute(text("ALTER TABLE study_attempts ADD COLUMN lesson_day INTEGER"))
        if "answers_json" not in columns:
            connection.execute(text("ALTER TABLE study_attempts ADD COLUMN answers_json JSON"))
    if WORD_SEED_CSV.exists():
        seed_when_changed(engine, "normal_words", [WORD_SEED_CSV], seed_words_from_csv)
    seed_when_changed(
        engine,
        "erasmus_words",
        [ERASMUS_VOCABULARY_JSON, ERASMUS_EXTRA_VOCABULARY_JSON],
        seed_erasmus_words_from_json,
    )

    inspector = inspect(engine)
    table_names = set(inspector.get_table_names())
    missing_tables = {table for table in ID_TABLES if table not in table_names}

    if missing_tables:
        print(f"Eksik tablo uyarısı: {', '.join(sorted(missing_tables))}")
