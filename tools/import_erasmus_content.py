"""Extract curated Erasmus lesson and vocabulary data from the source files.

Usage:
    python tools/import_erasmus_content.py GUIDE.docx VOCABULARY.pdf

The source documents are input data. Their time boxes, checklists, and prose are
not copied into the app's lesson catalogue.
"""

from __future__ import annotations

import json
import re
import sys
from datetime import date
from pathlib import Path

import pdfplumber
from docx import Document


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "backend" / "data"
MONTHS = {"Ekim": 10, "Kasım": 11}
DAY_HEADING = re.compile(r"^Gün\s+(\d+)\s+(\d+)\s+(Ekim|Kasım)\s+")
VOCAB_HEADING = re.compile(r"^GÜN\s+(\d+)\s+-\s+(.+)$")
READING_SLUGS = {
    "A travel guide": "travel-guide",
    "Digital habits across generations": "digital-habits-across-generations",
    "Robot teachers": "robot-teachers",
    "How to spot fake news": "how-spot-fake-news",
    "Innovation in business": "innovation-business",
    "Encyclopedia entry": "encyclopedia-entry",
    "An email request for help": "email-request-help",
    "Social media influencers": "social-media-influencers",
    "Planning an event": "planning-event",
    "The legend of fairies": "legend-fairies",
    "A Plastic Ocean: a film review": "plastic-ocean-film-review",
    "Asteroids": "asteroids",
    "The sharing economy": "sharing-economy",
    "Why bridges collapse": "why-bridges-collapse",
    "Millennials in the workplace": "millennials-workplace",
    "The Buy Nothing movement": "buy-nothing-movement",
    "Cultural expectations and leadership": "cultural-expectations-leadership",
    "A short story extract": "short-story-extract",
    "Star Wars and the hero myth": "star-wars-hero-myth",
    "An email from a friend": "email-friend",
}


def compact(value: str | None) -> str:
    return " ".join((value or "").split())


def extract_lessons(path: Path) -> list[dict]:
    document = Document(path)
    paragraphs = document.paragraphs
    starts = [
        index
        for index, paragraph in enumerate(paragraphs)
        if paragraph.style.name == "Heading 2"
        and DAY_HEADING.match(paragraph.text)
    ]
    if len(starts) != 42:
        raise ValueError(f"Expected 42 lesson days, found {len(starts)}")

    lessons: list[dict] = []
    for position, start in enumerate(starts):
        end = starts[position + 1] if position + 1 < len(starts) else len(paragraphs)
        if position + 1 == len(starts):
            end = next(
                (
                    index
                    for index in range(start + 1, len(paragraphs))
                    if paragraphs[index].style.name == "Heading 1"
                ),
                end,
            )
        block = paragraphs[start:end]
        match = DAY_HEADING.match(block[0].text)
        assert match is not None
        number, day, month = match.groups()
        title_line = compact(block[1].text)
        title = re.split(r"\s+•\s+", title_line, maxsplit=1)[0]

        links = [
            {"label": compact(hyperlink.text), "url": hyperlink.url}
            for paragraph in block[1:]
            for hyperlink in paragraph.hyperlinks
            if hyperlink.url
        ]
        reading_link = next(
            (link for link in links if "reading" in link["url"]), None
        )
        lesson_link = next(
            (link for link in links if link is not reading_link), None
        )
        video_line = next(
            (compact(paragraph.text)[7:] for paragraph in block[2:] if paragraph.text.startswith("Video: ")),
            None,
        )
        reading_title_match = re.search(
            r"[“\"]([^”\"]+)[”\"]\s+metnini",
            " ".join(paragraph.text for paragraph in block),
        )
        reading_titles = (
            [compact(reading_title_match.group(1))] if reading_title_match else []
        )
        if not reading_titles:
            extra_reading = re.search(
                r"Metinler:\s*([^\.]+)\.",
                " ".join(paragraph.text for paragraph in block),
            )
            if extra_reading:
                reading_titles = [
                    compact(title)
                    for title in extra_reading.group(1).split(" ve ")
                ]
        readings = []
        if reading_link:
            for reading_title in reading_titles:
                slug = READING_SLUGS.get(reading_title)
                if slug is None:
                    raise ValueError(f"Reading URL not verified: {reading_title}")
                readings.append(
                    {"title": reading_title, "url": f"{reading_link['url']}/{slug}"}
                )
            if not readings:
                readings.append({"title": "Reading çalışması", "url": reading_link["url"]})

        if "Dinlenme" in title:
            kind = "rest"
        elif "deneme" in title.lower() or "ölçüm" in title.lower():
            kind = "practice_exam"
        else:
            kind = "lesson"

        lesson = {
            "day": int(number),
            "date": date(2026, MONTHS[month], int(day)).isoformat(),
            "title": title,
            "kind": kind,
            "video": (
                {"title": video_line, "url": lesson_link["url"]}
                if video_line and lesson_link
                else None
            ),
            "lesson_resource": (
                lesson_link if lesson_link and not video_line else None
            ),
            "readings": readings,
        }
        lessons.append(lesson)

    if [item["day"] for item in lessons] != list(range(1, 43)):
        raise ValueError("Lesson day numbers are not sequential")
    if len({item["date"] for item in lessons}) != 42:
        raise ValueError("Lesson dates are not unique")
    return lessons


def extract_vocabulary(path: Path) -> list[dict]:
    packages: list[dict] = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            first_line = (page.extract_text() or "").splitlines()[0]
            match = VOCAB_HEADING.match(first_line)
            if not match:
                continue
            tables = page.extract_tables()
            if len(tables) != 1:
                raise ValueError(f"Expected one table on vocabulary page {page.page_number}")
            rows = tables[0]
            if len(rows) != 21:
                raise ValueError(
                    f"Expected 20 words on vocabulary page {page.page_number}, found {len(rows) - 1}"
                )

            words = []
            for expected_number, row in enumerate(rows[1:], start=1):
                if len(row) != 6 or compact(row[0]) != str(expected_number):
                    raise ValueError(
                        f"Malformed vocabulary row {expected_number} on page {page.page_number}"
                    )
                words.append(
                    {
                        "word": compact(row[1]),
                        "meaning_tr": compact(row[2]),
                        "part_of_speech": compact(row[3]),
                        "exam_sections": compact(row[4]).split("-"),
                        "usage": compact(row[5]),
                    }
                )
            packages.append(
                {"day": int(match.group(1)), "theme": compact(match.group(2)), "words": words}
            )

    if [item["day"] for item in packages] != list(range(1, 31)):
        raise ValueError("Expected 30 sequential vocabulary packages")
    return packages


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Usage: python tools/import_erasmus_content.py GUIDE.docx VOCABULARY.pdf")
    guide, vocabulary = map(Path, sys.argv[1:])
    lessons = extract_lessons(guide)
    existing_lessons_path = OUTPUT_DIR / "erasmus_lessons.json"
    if existing_lessons_path.exists():
        existing = json.loads(existing_lessons_path.read_text(encoding="utf-8"))
        embeds = {item["video"]["url"]: item["video"].get("embed_url") for item in existing if item.get("video")}
        for item in lessons:
            if item.get("video") and embeds.get(item["video"]["url"]):
                item["video"]["embed_url"] = embeds[item["video"]["url"]]
    packages = extract_vocabulary(vocabulary)
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUTPUT_DIR / "erasmus_lessons.json").write_text(
        json.dumps(lessons, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    (OUTPUT_DIR / "erasmus_vocabulary.json").write_text(
        json.dumps(packages, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )
    print(f"Imported {len(lessons)} lessons and {sum(len(p['words']) for p in packages)} words")


if __name__ == "__main__":
    main()
