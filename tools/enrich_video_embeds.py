"""Read the official engVid pages and capture their embedded YouTube player IDs."""
import json
import re
import urllib.request
from pathlib import Path

PATH = Path(__file__).resolve().parents[1] / "backend/data/erasmus_lessons.json"
VIDEO_ID = re.compile(r"(?:youtube(?:-nocookie)?\.com/embed/|youtu\.be/|youtube\.com/watch\?v=)([A-Za-z0-9_-]{11})")


def main():
    lessons = json.loads(PATH.read_text(encoding="utf-8"))
    embeds = {}
    for lesson in lessons:
        video = lesson.get("video")
        if not video or video["url"] in embeds:
            continue
        request = urllib.request.Request(video["url"], headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(request, timeout=20) as response:
            html = response.read().decode("utf-8", errors="replace")
        match = VIDEO_ID.search(html)
        if not match:
            raise ValueError(f"No official embedded video found: {video['url']}")
        embeds[video["url"]] = "https://www.youtube-nocookie.com/embed/" + match.group(1)
    for lesson in lessons:
        if lesson.get("video"):
            lesson["video"]["embed_url"] = embeds[lesson["video"]["url"]]
    PATH.write_text(json.dumps(lessons, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {len(embeds)} official video embeds")


if __name__ == "__main__":
    main()
