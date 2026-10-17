from fastapi import APIRouter, Query
from sqlalchemy import func

import models
import schemas
from auth import CurrentUser, DbSession
from report_helpers import build_report_data

router = APIRouter()


@router.get("/me", response_model=schemas.ReportResponse)
def get_my_report(
    current_user: CurrentUser,
    db: DbSession,
):
    return schemas.ReportResponse(**build_report_data(db, current_user.id))


@router.post("/study-attempts", status_code=201)
def save_study_attempt(payload: schemas.StudyAttemptCreate, current_user: CurrentUser, db: DbSession):
    answers = [answer.model_dump() for answer in payload.answers]
    wrong_items = [
        {"question_id": answer.question_id, "prompt": answer.prompt,
         "selected": answer.selected, "correct_answer": answer.correct_answer,
         "explanation": answer.explanation}
        for answer in payload.answers if answer.selected != answer.correct_answer
    ]
    attempt = models.StudyAttempt(
        user_id=current_user.id, mode=payload.mode, kind=payload.kind,
        topic_id=payload.topic_id, topic_title=payload.topic_title,
        lesson_day=payload.lesson_day, answers_json=answers,
        correct_count=len(payload.answers) - len(wrong_items),
        total_questions=len(payload.answers), wrong_items_json=wrong_items,
    )
    db.add(attempt)
    db.commit()
    return {"id": attempt.id}


@router.get("/study-attempts")
def list_study_attempts(current_user: CurrentUser, db: DbSession,
                        lesson_day: int = Query(ge=1, le=42)):
    attempts = db.query(models.StudyAttempt).filter_by(
        user_id=current_user.id, mode="erasmus", lesson_day=lesson_day,
    ).order_by(models.StudyAttempt.created_at.desc(), models.StudyAttempt.id.desc()).all()
    return [{"id": item.id, "kind": item.kind, "topic_title": item.topic_title,
             "lesson_day": item.lesson_day, "correct": item.correct_count,
             "total": item.total_questions, "created_at": item.created_at,
             "answers": item.answers_json or [], "wrong_items": item.wrong_items_json}
            for item in attempts]


@router.get("/study-analysis")
def get_study_analysis(current_user: CurrentUser, db: DbSession):
    rows = db.query(
        models.StudyAttempt.topic_id, models.StudyAttempt.topic_title,
        models.StudyAttempt.mode, models.StudyAttempt.kind,
        func.count(models.StudyAttempt.id),
        func.sum(models.StudyAttempt.correct_count),
        func.sum(models.StudyAttempt.total_questions),
    ).filter(models.StudyAttempt.user_id == current_user.id).group_by(
        models.StudyAttempt.topic_id, models.StudyAttempt.topic_title,
        models.StudyAttempt.mode, models.StudyAttempt.kind,
    ).all()
    topics = [{
        "topic_id": topic_id, "topic_title": title, "mode": mode, "kind": kind,
        "attempts": attempts, "correct": correct or 0, "total": total or 0,
        "accuracy": round(100 * (correct or 0) / total) if total else 0,
    } for topic_id, title, mode, kind, attempts, correct, total in rows]
    topics.sort(key=lambda item: (item["accuracy"], -item["total"], item["topic_title"]))
    recent = db.query(models.StudyAttempt).filter_by(user_id=current_user.id).order_by(
        models.StudyAttempt.created_at.desc(), models.StudyAttempt.id.desc()
    ).limit(10).all()
    return {
        "topics": topics,
        "recent": [{"id": item.id, "topic_title": item.topic_title, "topic_id": item.topic_id,
                    "mode": item.mode, "kind": item.kind, "correct": item.correct_count,
                    "total": item.total_questions, "wrong_items": item.wrong_items_json,
                    "created_at": item.created_at} for item in recent],
    }
