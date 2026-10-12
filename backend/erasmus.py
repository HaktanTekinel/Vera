"""Read-only Erasmus lesson and curated vocabulary catalogue endpoints."""

from __future__ import annotations

import json
from datetime import date
from pathlib import Path

from fastapi import APIRouter, HTTPException, status

import models
from auth import CurrentUser, DbSession


router = APIRouter()
LESSONS_PATH = Path(__file__).resolve().parent / "data" / "erasmus_lessons.json"
LESSONS = json.loads(LESSONS_PATH.read_text(encoding="utf-8"))
LESSONS_BY_DATE = {lesson["date"]: lesson for lesson in LESSONS}


@router.get("/lessons")
def list_lessons(current_user: CurrentUser):
    del current_user
    return [
        {
            "day": lesson["day"],
            "date": lesson["date"],
            "title": lesson["title"],
            "kind": lesson["kind"],
        }
        for lesson in LESSONS
    ]


@router.get("/lessons/{lesson_date}")
def get_lesson(lesson_date: date, current_user: CurrentUser):
    del current_user
    lesson = LESSONS_BY_DATE.get(lesson_date.isoformat())
    if lesson is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bu tarihe ait Erasmus dersi bulunamadı.",
        )
    return lesson


@router.get("/vocabulary/packages/{package_day}")
def get_vocabulary_package(
    package_day: int,
    current_user: CurrentUser,
    db: DbSession,
):
    del current_user
    words = (
        db.query(models.ErasmusWord)
        .filter(models.ErasmusWord.package_day == package_day)
        .order_by(models.ErasmusWord.sequence)
        .all()
    )
    if not words:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Kelime paketi bulunamadı.",
        )
    return {
        "day": package_day,
        "theme": words[0].theme,
        "words": [
            {
                "id": word.id,
                "sequence": word.sequence,
                "word": word.eng_word,
                "meaning_tr": word.tur_word,
                "part_of_speech": word.part_of_speech,
                "exam_sections": word.exam_sections,
                "usage": word.usage,
            }
            for word in words
        ],
    }
