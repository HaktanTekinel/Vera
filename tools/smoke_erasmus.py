"""Small in-memory integration check for Erasmus package and review logic."""
import json
import sys
from datetime import timedelta
from pathlib import Path

from sqlalchemy import create_engine
from sqlalchemy.orm import Session

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "backend"))

import erasmus
import models


def main():
    engine = create_engine("sqlite://")
    models.Base.metadata.create_all(engine)
    source = json.loads((ROOT / "backend/data/erasmus_vocabulary.json").read_text(encoding="utf-8"))[0]
    with Session(engine) as db:
        user = models.User(username="smoke", email="smoke@example.invalid", password_hash="unused")
        db.add(user)
        for sequence, item in enumerate(source["words"], start=1):
            db.add(models.ErasmusWord(sequence=sequence, package_day=1, theme=source["theme"],
                eng_word=item["word"], tur_word=item["meaning_tr"], part_of_speech=item["part_of_speech"],
                exam_sections=item["exam_sections"], usage=item["usage"], source="pdf"))
        db.commit()
        assert len(erasmus.list_lessons(user, db)) == 42
        assert erasmus.get_lesson(erasmus.date(2026, 10, 8), user, db)["day"] == 1
        assert erasmus.update_lesson(erasmus.date(2026, 10, 8), erasmus.LessonUpdate(video_watched=True), user, db)["video_watched"]
        pack = erasmus.get_package(1, user, db)
        assert len(pack["questions"]) == 20
        answers = [erasmus.Answer(word_id=item["id"], answer=item["meaning_tr"]) for item in pack["words"]]
        result = erasmus.submit_package(1, erasmus.Submission(answers=answers), user, db)
        assert result["correct_count"] == 20
        assert erasmus.dashboard(user, db)["active_package_day"] == 2
        for progress in db.query(models.ErasmusWordProgress).all():
            progress.next_review_at = erasmus.utc_now() - timedelta(days=1)
        db.commit()
        assert erasmus.due_reviews(user, db)["count"] == 20
        review = erasmus.submit_reviews(erasmus.Submission(answers=answers), user, db)
        assert review["correct_count"] == 20
        assert all(item.current_stage == 1 for item in db.query(models.ErasmusWordProgress).all())
    print("Erasmus logic smoke test passed")


if __name__ == "__main__":
    main()
