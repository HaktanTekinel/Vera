"""Separate Erasmus plan, vocabulary and spaced review API."""
import json
import random
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

import models
from auth import CurrentUser, DbSession

router = APIRouter()
LESSONS = json.loads((Path(__file__).parent / "data" / "erasmus_lessons.json").read_text(encoding="utf-8"))
LESSONS_BY_DATE = {item["date"]: item for item in LESSONS}
OFFSETS = (1, 3, 5, 8, 12, 18)


class Answer(BaseModel):
    word_id: int
    answer: str


class Submission(BaseModel):
    answers: list[Answer] = Field(min_length=1)


class LessonUpdate(BaseModel):
    video_watched: bool | None = None
    reading_completed: bool | None = None
    grammar_completed: bool | None = None
    grammar_correct: int | None = Field(default=None, ge=0)


class SettingsUpdate(BaseModel):
    exam_date: date | None = None


def utc_now():
    return datetime.now(timezone.utc).replace(tzinfo=None)


def exam_date(db, user_id):
    settings = db.get(models.ErasmusSettings, user_id)
    return settings.exam_date if settings else None


def next_review(now, stage, deadline):
    days = OFFSETS[min(stage, 5)]
    if deadline and deadline > now.date():
        days = min(days, max(1, (deadline - now.date()).days // (6 - stage)))
    return datetime.combine(now.date() + timedelta(days=days), time.min)


def lesson_progress(item):
    return {"video_watched": bool(item and item.video_watched),
            "reading_completed": bool(item and item.reading_completed),
            "grammar_completed": bool(item and item.grammar_completed),
            "grammar_correct": item.grammar_correct if item else None}


def active_package(db, user_id):
    completed = {item.package_day for item in db.query(models.ErasmusPackageProgress).filter_by(user_id=user_id).all()}
    return next((day for day in range(1, 43) if day not in completed), 42)


def question(word, pool):
    distractors = list(dict.fromkeys(item.tur_word for item in pool if item.id != word.id and item.tur_word != word.tur_word))
    rng = random.Random(word.id)
    options = [word.tur_word, *rng.sample(distractors, min(3, len(distractors)))]
    rng.shuffle(options)
    return {"word_id": word.id, "word": word.eng_word, "options": options, "usage": word.usage}


def grade(answers, words):
    submitted = {item.word_id: item.answer for item in answers}
    if len(answers) != len(words) or set(submitted) != {word.id for word in words}:
        raise HTTPException(422, "Her kelime için bir cevap gönderilmelidir.")
    return [{"word_id": word.id, "word": word.eng_word, "selected": submitted[word.id],
             "correct_answer": word.tur_word, "correct": submitted[word.id] == word.tur_word} for word in words]


@router.get("/lessons")
def list_lessons(current_user: CurrentUser, db: DbSession):
    progress = {item.lesson_day: item for item in db.query(models.ErasmusLessonProgress).filter_by(user_id=current_user.id).all()}
    return [{"day": lesson["day"], "date": lesson["date"], "title": lesson["title"],
             "kind": lesson["kind"], "progress": lesson_progress(progress.get(lesson["day"]))} for lesson in LESSONS]


@router.get("/lessons/{lesson_date}")
def get_lesson(lesson_date: date, current_user: CurrentUser, db: DbSession):
    lesson = LESSONS_BY_DATE.get(lesson_date.isoformat())
    if not lesson:
        raise HTTPException(404, "Bu tarihe ait Erasmus dersi bulunamadı.")
    progress = db.query(models.ErasmusLessonProgress).filter_by(user_id=current_user.id, lesson_day=lesson["day"]).first()
    return {**lesson, "progress": lesson_progress(progress)}


@router.patch("/lessons/{lesson_date}/progress")
def update_lesson(lesson_date: date, payload: LessonUpdate, current_user: CurrentUser, db: DbSession):
    lesson = LESSONS_BY_DATE.get(lesson_date.isoformat())
    if not lesson:
        raise HTTPException(404, "Bu tarihe ait Erasmus dersi bulunamadı.")
    item = db.query(models.ErasmusLessonProgress).filter_by(user_id=current_user.id, lesson_day=lesson["day"]).first()
    if item is None:
        item = models.ErasmusLessonProgress(user_id=current_user.id, lesson_day=lesson["day"])
        db.add(item)
    for key, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    db.commit()
    return lesson_progress(item)


@router.get("/settings")
def get_settings(current_user: CurrentUser, db: DbSession):
    value = exam_date(db, current_user.id)
    return {"exam_date": value.isoformat() if value else None, "review_offsets": OFFSETS}


@router.put("/settings")
def update_settings(payload: SettingsUpdate, current_user: CurrentUser, db: DbSession):
    item = db.get(models.ErasmusSettings, current_user.id)
    if item is None:
        item = models.ErasmusSettings(user_id=current_user.id)
        db.add(item)
    item.exam_date = payload.exam_date
    db.commit()
    return {"exam_date": item.exam_date.isoformat() if item.exam_date else None, "review_offsets": OFFSETS}


@router.get("/dashboard")
def dashboard(current_user: CurrentUser, db: DbSession):
    due = db.query(models.ErasmusWordProgress).filter(models.ErasmusWordProgress.user_id == current_user.id,
        models.ErasmusWordProgress.is_learned.is_(False), models.ErasmusWordProgress.next_review_at <= utc_now()).count()
    return {"active_package_day": active_package(db, current_user.id),
            "completed_packages": db.query(models.ErasmusPackageProgress).filter_by(user_id=current_user.id).count(),
            "due_reviews": due,
            "learned_words": db.query(models.ErasmusWordProgress).filter_by(user_id=current_user.id, is_learned=True).count(),
            "completed_grammar_lessons": db.query(models.ErasmusLessonProgress).filter_by(user_id=current_user.id, grammar_completed=True).count()}


@router.get("/vocabulary/reviews/due")
def due_reviews(current_user: CurrentUser, db: DbSession):
    items = db.query(models.ErasmusWordProgress).filter(models.ErasmusWordProgress.user_id == current_user.id,
        models.ErasmusWordProgress.is_learned.is_(False), models.ErasmusWordProgress.next_review_at <= utc_now()).order_by(models.ErasmusWordProgress.next_review_at).limit(20).all()
    pool = db.query(models.ErasmusWord).all()
    return {"count": len(items), "questions": [question(item.word, pool) for item in items]}


@router.post("/vocabulary/reviews/submit")
def submit_reviews(payload: Submission, current_user: CurrentUser, db: DbSession):
    now = utc_now()
    items = db.query(models.ErasmusWordProgress).filter(models.ErasmusWordProgress.user_id == current_user.id,
        models.ErasmusWordProgress.is_learned.is_(False), models.ErasmusWordProgress.next_review_at <= now).all()
    by_id = {item.word_id: item for item in items}
    ids = [answer.word_id for answer in payload.answers]
    if len(set(ids)) != len(ids) or not set(ids) <= set(by_id):
        raise HTTPException(422, "Tekrar cevapları geçersiz.")
    results = grade(payload.answers, [by_id[word_id].word for word_id in ids])
    deadline = exam_date(db, current_user.id)
    for result in results:
        item = by_id[result["word_id"]]
        item.last_answer_correct = result["correct"]
        if result["correct"]:
            item.current_stage += 1
            item.is_learned = item.current_stage >= 6
            item.next_review_at = None if item.is_learned else next_review(now, item.current_stage, deadline)
        else:
            item.current_stage = 0
            item.reset_count += 1
            item.next_review_at = next_review(now, 0, deadline)
    db.commit()
    return {"correct_count": sum(row["correct"] for row in results), "total": len(results), "results": results}


@router.get("/vocabulary/packages/{package_day}")
def get_package(package_day: int, current_user: CurrentUser, db: DbSession):
    if not 1 <= package_day <= 42:
        raise HTTPException(404, "Kelime paketi bulunamadı.")
    words = db.query(models.ErasmusWord).filter_by(package_day=package_day).order_by(models.ErasmusWord.sequence).all()
    if not words:
        raise HTTPException(404, "Kelime paketi bulunamadı.")
    completed = db.query(models.ErasmusPackageProgress).filter_by(user_id=current_user.id, package_day=package_day).first()
    return {"day": package_day, "theme": words[0].theme, "completed": bool(completed),
            "active_package_day": active_package(db, current_user.id),
            "words": [{"id": word.id, "sequence": word.sequence, "word": word.eng_word,
                       "meaning_tr": word.tur_word, "part_of_speech": word.part_of_speech,
                       "exam_sections": word.exam_sections, "usage": word.usage} for word in words],
            "questions": [question(word, words) for word in words]}


@router.post("/vocabulary/packages/{package_day}/submit")
def submit_package(package_day: int, payload: Submission, current_user: CurrentUser, db: DbSession):
    if package_day != active_package(db, current_user.id) or db.query(models.ErasmusPackageProgress).filter_by(user_id=current_user.id, package_day=package_day).first():
        raise HTTPException(409, "Önce sıradaki kelime paketini tamamlayın.")
    words = db.query(models.ErasmusWord).filter_by(package_day=package_day).order_by(models.ErasmusWord.sequence).all()
    if len(words) != 20:
        raise HTTPException(404, "Kelime paketi bulunamadı.")
    results = grade(payload.answers, words)
    now = utc_now()
    deadline = exam_date(db, current_user.id)
    for word, result in zip(words, results):
        db.add(models.ErasmusWordProgress(user_id=current_user.id, word_id=word.id, current_stage=0,
               introduced_at=now, next_review_at=next_review(now, 0, deadline), last_answer_correct=result["correct"]))
    db.add(models.ErasmusPackageProgress(user_id=current_user.id, package_day=package_day,
                                         completed_at=now, correct_count=sum(row["correct"] for row in results)))
    db.commit()
    return {"correct_count": sum(row["correct"] for row in results), "total": len(results), "results": results}
