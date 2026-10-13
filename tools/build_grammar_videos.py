"""Verify curated engVid pages and capture their official teacher/video metadata."""

import html
import json
import re
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "tools" / "grammar_video_candidates.json"
OUTPUT = ROOT / "frontend" / "kelime-ezberleme" / "src" / "data" / "grammarVideos.json"
BASE = "https://www.engvid.com/"
TEACHER = re.compile(r'class="featured_author".*?/english-teacher/([^/]+)/', re.S)
TITLE = re.compile(r'<h1 class="posttitle".*?<a[^>]*>(.*?)</a>', re.S)
YOUTUBE = re.compile(r'(?:youtube\.com/embed/)([A-Za-z0-9_-]{11})')
TAGS = re.compile(r"<[^>]+>")


def fetch(slug):
    url = f"{BASE}{slug}/"
    request = urllib.request.Request(url, headers={"User-Agent": "Vera curriculum link verifier/1.0"})
    with urllib.request.urlopen(request, timeout=20) as response:
        page = response.read().decode("utf-8")
        if response.url.rstrip("/") != url.rstrip("/"):
            raise ValueError(f"Redirected lesson: {url} -> {response.url}")
    teacher = TEACHER.search(page)
    title = TITLE.search(page)
    video = YOUTUBE.search(page)
    if not teacher or not title or not video:
        raise ValueError(f"Incomplete engVid lesson: {url}")
    return slug, {
        "title": html.unescape(TAGS.sub("", title.group(1))).strip(),
        "teacher": teacher.group(1).capitalize(),
        "url": url,
        "embed_url": f"https://www.youtube.com/embed/{video.group(1)}",
    }


def main():
    candidates = json.loads(SOURCE.read_text(encoding="utf-8"))
    slugs = list(dict.fromkeys(slug for group in candidates.values() for slug in group))
    with ThreadPoolExecutor(max_workers=6) as pool:
        details = dict(pool.map(fetch, slugs))
    videos = {topic: [details[slug] for slug in group] for topic, group in candidates.items()}
    OUTPUT.write_text(json.dumps(videos, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Verified {len(slugs)} engVid pages for {len(videos)} grammar topics")


if __name__ == "__main__":
    main()
