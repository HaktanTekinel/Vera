import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

import models
from auth import CurrentUser, DbSession

router = APIRouter()
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent"


class AskRequest(BaseModel):
    api_key: str = Field(min_length=10, max_length=256)
    question: str = Field(min_length=3, max_length=600)
    topic_title: str = Field(default="", max_length=150)
    context: str = Field(default="", max_length=500)


class NoteCreate(BaseModel):
    topic_id: str = Field(min_length=1, max_length=100)
    question: str = Field(min_length=3, max_length=600)
    answer: str = Field(min_length=1, max_length=5000)


def serialize_note(note: models.GrammarNote):
    return {
        "id": note.id,
        "topic_id": note.topic_id,
        "question": note.question,
        "answer": note.answer,
        "created_at": note.created_at.isoformat() if note.created_at else None,
    }


@router.get("")
def list_notes(current_user: CurrentUser, db: DbSession):
    notes = db.query(models.GrammarNote).filter(models.GrammarNote.user_id == current_user.id).order_by(models.GrammarNote.created_at.desc(), models.GrammarNote.id.desc()).all()
    return [serialize_note(note) for note in notes]


@router.post("", status_code=201)
def create_note(payload: NoteCreate, current_user: CurrentUser, db: DbSession):
    topic_id = payload.topic_id.strip()
    question = payload.question.strip()
    answer = payload.answer.strip()
    if not all((topic_id, question, answer)):
        raise HTTPException(status_code=422, detail="Not alanları boş olamaz.")
    note = models.GrammarNote(user_id=current_user.id, topic_id=topic_id, question=question, answer=answer)
    db.add(note)
    db.commit()
    db.refresh(note)
    return serialize_note(note)


@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: int, current_user: CurrentUser, db: DbSession):
    note = db.query(models.GrammarNote).filter(models.GrammarNote.id == note_id, models.GrammarNote.user_id == current_user.id).first()
    if note is None:
        raise HTTPException(status_code=404, detail="Not bulunamadı.")
    db.delete(note)
    db.commit()


@router.post("/ask")
async def ask_tutor(payload: AskRequest, current_user: CurrentUser):
    # The user's key is used for this request only; it is never persisted or logged.
    prompt = f"Konu: {payload.topic_title.strip() or 'İngilizce dil bilgisi'}\nİlgili soru veya cümle: {payload.context.strip()}\nÖğrencinin sorusu: {payload.question.strip()}"
    body = {
        "system_instruction": {"parts": [{"text": "Sen Vera adlı İngilizce öğrenme uygulamasında dil bilgisi öğretmenisin. Türkçe, açık ve doğru yanıt ver. Kuralı açıkla, gerekirse yanlış varsayımı düzelt ve 1-2 kısa İngilizce örnek kullan. Bilmediğinde kesin konuşma. Yanıtı yaklaşık 200 kelimeyle sınırla."}]},
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.3, "maxOutputTokens": 700},
    }
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(GEMINI_URL, headers={"x-goog-api-key": payload.api_key.strip()}, json=body)
        if response.status_code in (400, 401, 403):
            raise HTTPException(status_code=400, detail="Gemini API anahtarı geçersiz veya bu model için yetkisiz.")
        if response.status_code == 429:
            raise HTTPException(status_code=429, detail="Gemini kullanım sınırına ulaşıldı. Daha sonra yeniden dene.")
        response.raise_for_status()
        answer = "\n".join(part.get("text", "") for candidate in response.json().get("candidates", []) for part in candidate.get("content", {}).get("parts", []) if part.get("text")).strip()
        if not answer:
            raise HTTPException(status_code=502, detail="Gemini bu soruya yanıt üretemedi.")
        return {"answer": answer}
    except httpx.HTTPError:
        raise HTTPException(status_code=502, detail="Gemini bağlantısı şu anda kurulamadı.")
