import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { topicForLesson } from "../../data/grammar";
import StudyQuiz from "../../components/StudyQuiz/StudyQuiz";
import { erasmusRequest } from "../../services/erasmusService";
import "./Erasmus.css";

const formatDate = (date) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }).format(new Date(`${date}T12:00:00`));

function GrammarPractice({ lesson, onComplete }) {
  const topic = topicForLesson(lesson.day);
  const [results, setResults] = useState(null);
  if (!topic) return null;
  const questions = topic.quiz.map(([prompt, correct, ...rest], index) => ({ id: index + 1, prompt, options: [correct, ...rest.slice(0, -1)] }));
  async function submit(answers) {
    const graded = topic.quiz.map(([prompt, correct, ...rest], index) => ({ id: index + 1, prompt, correct_answer: correct, selected: answers[index + 1], correct: answers[index + 1] === correct, explanation: rest.at(-1) }));
    setResults(graded);
    await onComplete(graded.filter((item) => item.correct).length);
  }
  return <section className="study-card"><p className="study-eyebrow">Ders sonrası</p><h3>{topic.title}</h3>
    {lesson.progress.video_watched || !lesson.video ? <><ul className="study-notes">{topic.notes.map((note) => <li key={note}>{note}</li>)}</ul><StudyQuiz title="Grammar quizi" questions={questions} onSubmit={submit} results={results} /></> : <p>Videoyu izledikten sonra kısa notların ve quizin burada açılacak.</p>}
    <Link className="study-subtle-link" to="/grammar">Grammar kütüphanesindeki dersi aç →</Link>
  </section>;
}

function VocabularyQuiz({ title, questions, endpoint, onFinished }) {
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  async function submit(answers) {
    try {
      const response = await erasmusRequest(endpoint, { method: "POST", body: JSON.stringify({ answers: questions.map((item) => ({ word_id: item.word_id, answer: answers[item.word_id] })) }) });
      setResults(response.results);
    } catch (cause) { setError(cause.message); throw cause; }
  }
  return <div className="study-card"><StudyQuiz title={title} questions={questions} onSubmit={submit} results={results} />{results && <button className="study-primary" type="button" onClick={onFinished}>Devam et</button>}{error && <p role="alert" className="study-error">{error}</p>}</div>;
}

export default function Erasmus() {
  const [lessons, setLessons] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [lesson, setLesson] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [pack, setPack] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [settings, setSettings] = useState(null);
  const [tab, setTab] = useState("lesson");
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    const [overview, due] = await Promise.all([erasmusRequest("/dashboard"), erasmusRequest("/vocabulary/reviews/due")]);
    setDashboard(overview); setReviews(due);
    setPack(await erasmusRequest(`/vocabulary/packages/${overview.active_package_day}`));
  }, []);

  useEffect(() => {
    Promise.all([erasmusRequest("/lessons"), erasmusRequest("/settings")]).then(([items, planSettings]) => {
      setLessons(items); setSettings(planSettings);
      const today = new Date().toLocaleDateString("sv-SE");
      setSelectedDate(items.some((item) => item.date === today) ? today : items[0].date);
      refresh();
    }).catch((cause) => setError(cause.message));
  }, [refresh]);

  useEffect(() => { if (selectedDate) erasmusRequest(`/lessons/${selectedDate}`).then(setLesson).catch((cause) => setError(cause.message)); }, [selectedDate]);

  async function markLesson(change) {
    const progress = await erasmusRequest(`/lessons/${selectedDate}/progress`, { method: "PATCH", body: JSON.stringify(change) });
    setLesson((previous) => ({ ...previous, progress }));
    if (change.grammar_completed) refresh();
  }

  async function saveExamDate(event) {
    const response = await erasmusRequest("/settings", { method: "PUT", body: JSON.stringify({ exam_date: event.target.value || null }) });
    setSettings(response);
  }

  return <div className="study-shell">
    <div className="study-intro"><p className="study-eyebrow">Erasmus çalışma planı</p><h2>Dersin, kelimelerin ve tekrarların</h2><p>İstediğin ders tarihine dönebilirsin. Kelime paketleri kendi sırayla ilerler.</p></div>
    {error && <p role="alert" className="study-error">{error}</p>}
    <div className="study-metrics"><div><strong>{dashboard?.completed_packages ?? "–"}/42</strong><span>Kelime paketi</span></div><div><strong>{dashboard?.due_reviews ?? "–"}</strong><span>Bekleyen tekrar</span></div><div><strong>{dashboard?.learned_words ?? "–"}</strong><span>Öğrenilen kelime</span></div><div><strong>{dashboard?.completed_grammar_lessons ?? "–"}</strong><span>Tamamlanan grammar</span></div></div>
    <div className="study-tabs"><button type="button" className={tab === "lesson" ? "active" : ""} onClick={() => setTab("lesson")}>Günlük ders</button><button type="button" className={tab === "vocab" ? "active" : ""} onClick={() => setTab("vocab")}>Kelime paketi</button><button type="button" className={tab === "review" ? "active" : ""} onClick={() => setTab("review")}>Tekrarlar{reviews?.count ? ` (${reviews.count})` : ""}</button></div>

    {tab === "lesson" && <><section className="study-card study-date-card"><div><p className="study-eyebrow">42 günlük program</p><h3>Tarih seç</h3></div><div className="study-date-controls"><input aria-label="Ders tarihi" type="date" min={lessons[0]?.date} max={lessons.at(-1)?.date} value={selectedDate} onChange={(event) => { if (lessons.some((item) => item.date === event.target.value)) setSelectedDate(event.target.value); }} /><select aria-label="Program günü" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}>{lessons.map((item) => <option value={item.date} key={item.day}>{item.day}. gün · {item.title}</option>)}</select></div></section>
      {lesson && <><section className="study-card"><p className="study-eyebrow">{lesson.day}. gün · {formatDate(lesson.date)}</p><h3>{lesson.title}</h3>{lesson.kind === "rest" && <p>Bu gün dinlenme veya eksik kalan dersi tamamlama için ayrılmış.</p>}{lesson.kind === "practice_exam" && <p>Bu gün deneme ve yanlış analizi için ayrılmış. Önceki derslere tarih seçicisinden dönebilirsin.</p>}
        {lesson.video && <div className="study-video"><div className="study-video-frame"><iframe title={lesson.video.title} src={lesson.video.embed_url || lesson.video.url} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen /></div><div className="study-video-meta"><strong>{lesson.video.title}</strong><a href={lesson.video.url} target="_blank" rel="noreferrer">Videoyu kaynakta aç ↗</a></div><button className="study-primary" type="button" onClick={() => markLesson({ video_watched: true })}>{lesson.progress.video_watched ? "İzlendi ✓" : "İzledim, notları aç"}</button></div>}
        {lesson.lesson_resource && <a className="study-resource-link" href={lesson.lesson_resource.url} target="_blank" rel="noreferrer">{lesson.lesson_resource.title} ↗</a>}</section>
        <GrammarPractice key={lesson.day} lesson={lesson} onComplete={(correct) => markLesson({ grammar_completed: true, grammar_correct: correct })} />
        {lesson.readings.length > 0 && <section className="study-card"><p className="study-eyebrow">Reading</p><h3>Okuma metni</h3>{lesson.readings.map((reading) => <a className="study-resource-link" href={reading.url} target="_blank" rel="noreferrer" key={reading.url}>{reading.title} ↗</a>)}<button className="study-secondary" type="button" onClick={() => markLesson({ reading_completed: true })}>{lesson.progress.reading_completed ? "Okundu ✓" : "Okudum"}</button></section>}
      </>}
    </>}

    {tab === "vocab" && pack && <><section className="study-card"><p className="study-eyebrow">{pack.day <= 30 ? "PDF sözlüğü · 600 kelime" : "Ek çalışma · 240 kelime"}</p><h3>{pack.day}. paket: {pack.theme}</h3><p>Bu paket 20 kelimeden oluşur. Quiz tamamlanınca sonraki paket açılır.</p><div className="study-word-grid">{pack.words.map((word) => <div key={word.id}><strong>{word.word}</strong><span>{word.meaning_tr}</span>{word.usage && <small>{word.usage}</small>}</div>)}</div></section>{pack.completed ? <p className="study-card">Tüm paketler tamamlandı. Tekrarlar sekmesinden çalışmaya devam et.</p> : <VocabularyQuiz key={pack.day} title="20 soruluk kelime quizi" questions={pack.questions} endpoint={`/vocabulary/packages/${pack.day}/submit`} onFinished={refresh} />}</>}

    {tab === "review" && <><section className="study-card study-settings"><div><p className="study-eyebrow">6 aşamalı tekrar</p><h3>Tekrar takvimi</h3><p>İlk çalıştığın güne göre tekrarlar planlanır. Sınav yaklaştığında aralıklar kısalır.</p></div><label>Sınav tarihi<input type="date" value={settings?.exam_date || ""} onChange={saveExamDate} /></label></section>{reviews?.count ? <VocabularyQuiz key={reviews.count} title={`${reviews.count} kelime tekrar bekliyor`} questions={reviews.questions} endpoint="/vocabulary/reviews/submit" onFinished={refresh} /> : <section className="study-card"><h3>Bugün tekrar yok</h3><p>Yeni paket çalışabilir veya önceki derslere dönebilirsin.</p></section>}</>}
    <Link className="study-subtle-link" to="/grammar">Tüm grammar derslerini gör →</Link>
  </div>;
}
