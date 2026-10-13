import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { topicForLesson } from "../../data/grammar";
import { grammarQuestionsForLesson } from "../../data/grammarPractice";
import StudyQuiz from "../../components/StudyQuiz/StudyQuiz";
import Icon from "../../components/Icon/Icon";
import { erasmusRequest } from "../../services/erasmusService";
import "./Erasmus.css";

const dateText = (value) => new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "long", weekday: "long" }).format(new Date(`${value}T12:00:00`));
const shortDay = (value) => new Intl.DateTimeFormat("tr-TR", { weekday: "short" }).format(new Date(`${value}T12:00:00`));
const sections = ["Video", "Notlar", "Quiz", "Reading"];

function GrammarPractice({ lesson, onComplete }) {
  const topic = topicForLesson(lesson.day);
  const [results, setResults] = useState(null);
  const [started, setStarted] = useState(false);
  if (!topic) return null;
  const questions = grammarQuestionsForLesson(topic);
  async function submit(answers) {
    const graded = questions.map((question) => ({ id: question.id, prompt: question.prompt, correct_answer: question.correct, selected: answers[question.id], correct: answers[question.id] === question.correct, explanation: question.explanation }));
    setResults(graded);
    await onComplete(graded.filter((item) => item.correct).length);
  }
  if (lesson.video && !lesson.progress.video_watched) return null;
  return <section className="lesson-section"><p className="study-eyebrow">Ders notları</p><h2>{topic.title}</h2><ul className="study-notes">{topic.notes.map((note) => <li key={note}>{note}</li>)}</ul>
    {!started ? <button type="button" className="study-primary" onClick={() => setStarted(true)}>{lesson.progress.grammar_completed ? `Grammar quizini yeniden çöz · ${questions.length} soru` : `Grammar quizine başla · ${questions.length} soru`}</button> : <StudyQuiz title="Grammar quizi" questions={questions} onSubmit={submit} results={results} instantFeedback/>}</section>;
}

function VocabularyQuiz({ title, questions, endpoint, onFinished }) {
  const [results, setResults] = useState(null);
  async function submit(answers) {
    const response = await erasmusRequest(endpoint, { method: "POST", body: JSON.stringify({ answers: questions.map((item) => ({ word_id: item.word_id, answer: answers[item.word_id] })) }) });
    setResults(response.results);
  }
  return <div className="lesson-section"><StudyQuiz title={title} questions={questions} onSubmit={submit} results={results}/>{results && <button type="button" className="study-primary" onClick={onFinished}>Devam et</button>}</div>;
}

export default function Erasmus() {
  const [searchParams] = useSearchParams();
  const tab = ["lesson", "vocab", "review"].includes(searchParams.get("tab")) ? searchParams.get("tab") : "lesson";
  const [lessons, setLessons] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [lesson, setLesson] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [pack, setPack] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [settings, setSettings] = useState(null);
  const [quizType, setQuizType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const dateStripRef = useRef(null);

  const refresh = useCallback(async () => {
    const [overview, due] = await Promise.all([erasmusRequest("/dashboard"), erasmusRequest("/vocabulary/reviews/due")]);
    const nextPack = await erasmusRequest(`/vocabulary/packages/${overview.active_package_day}`);
    setDashboard(overview); setReviews(due); setPack(nextPack); setQuizType("");
  }, []);

  useEffect(() => {
    Promise.all([erasmusRequest("/lessons"), erasmusRequest("/settings"), erasmusRequest("/dashboard"), erasmusRequest("/vocabulary/reviews/due")]).then(async ([items, planSettings, overview, due]) => {
      const nextPack = await erasmusRequest(`/vocabulary/packages/${overview.active_package_day}`);
      setLessons(items); setSettings(planSettings); setDashboard(overview); setReviews(due); setPack(nextPack);
      const today = new Date().toLocaleDateString("sv-SE");
      setSelectedDate(items.some((item) => item.date === today) ? today : items[0]?.date || "");
    }).catch((cause) => setError(cause.message)).finally(() => setLoading(false));
  }, []);

  useEffect(() => { if (selectedDate) erasmusRequest(`/lessons/${selectedDate}`).then(setLesson).catch((cause) => setError(cause.message)); }, [selectedDate]);
  useEffect(() => {
    const strip = dateStripRef.current;
    const active = strip?.querySelector(".selected");
    if (strip && active) strip.scrollTo({ left: active.offsetLeft - strip.offsetLeft - strip.clientWidth / 2 + active.clientWidth / 2, behavior: "smooth" });
  }, [selectedDate, lessons.length]);

  async function markLesson(change) {
    try {
      const progress = await erasmusRequest(`/lessons/${selectedDate}/progress`, { method: "PATCH", body: JSON.stringify(change) });
      setLesson((previous) => ({ ...previous, progress }));
      if (change.grammar_completed) refresh();
    } catch (cause) { setError(cause.message); }
  }
  async function saveExamDate(event) {
    try { setSettings(await erasmusRequest("/settings", { method: "PUT", body: JSON.stringify({ exam_date: event.target.value || null }) })); }
    catch (cause) { setError(cause.message); }
  }

  if (loading) return <div className="study-state"><p>Çalışma planın yükleniyor...</p></div>;
  if (error && !lessons.length) return <div className="study-state" role="alert"><h1>Plan açılamadı</h1><p>{error}</p><button type="button" className="study-secondary" onClick={() => window.location.reload()}>Yeniden dene</button></div>;

  return <div className="study-shell">
    {error && <p role="alert" className="study-error">{error}</p>}
    {tab === "lesson" && <><div className="study-intro"><p className="study-eyebrow">Erasmus planı</p><h1>Günlük ders</h1><p>Çalışmak istediğin tarihi seç ve kaldığın yerden devam et.</p></div>
      <div className="date-strip" ref={dateStripRef} aria-label="Program günleri">{lessons.map((item) => <button type="button" key={item.date} className={`date-pill ${selectedDate === item.date ? "selected" : ""}`} onClick={() => {setLesson(null);setSelectedDate(item.date);}}><strong>{new Date(`${item.date}T12:00:00`).getDate()}</strong><span>{shortDay(item.date)}</span></button>)}</div>
      <label className="date-jump"><Icon name="calendar" size={17}/>Tarihe git<select value={selectedDate} onChange={(event) => {setLesson(null);setSelectedDate(event.target.value);}} aria-label="Program tarihini seç">{lessons.map((item) => <option key={item.date} value={item.date}>{dateText(item.date)} · {item.title}</option>)}</select></label>
      {!lesson ? <div className="study-state">Ders yükleniyor...</div> : <>
        <div className="lesson-heading"><p className="study-eyebrow">{lesson.day}. gün · {dateText(lesson.date)}</p><h2>{lesson.title}</h2></div>
        {lesson.kind === "rest" ? <section className="study-card"><h2>Dinlenme ve telafi günü</h2><p>Bugünü eksik kalan derslerine dönmek için kullanabilirsin.</p></section> : lesson.kind === "practice_exam" ? <section className="study-card"><h2>Deneme ve analiz</h2><p>Denemeni tamamladıktan sonra zorlandığın konulara geri dönebilirsin.</p></section> : <>
          <div className="lesson-progress" aria-label="Ders adımları">{sections.map((item, i) => <div className={`lesson-step ${i === 0 || (i >= 1 && lesson.progress.video_watched) || (i >= 3 && lesson.progress.grammar_completed) ? "reached" : ""}`} key={item}><span>{i + 1}</span><small>{item}</small></div>)}</div>
          {lesson.video && (lesson.progress.video_watched ? <div className="video-complete"><Icon name="check" size={19}/><span>Video izlendi</span><a href={lesson.video.url} target="_blank" rel="noreferrer">Kaynağa dön <Icon name="external" size={15}/></a></div> : <section className="lesson-section"><div className="study-video-frame"><iframe title={lesson.video.title} src={lesson.video.embed_url || lesson.video.url} allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen/></div><p className="video-title">{lesson.video.title}</p><a className="study-inline-link" href={lesson.video.url} target="_blank" rel="noreferrer">Kaynak sayfasını aç <Icon name="external" size={16}/></a><button className="study-primary" type="button" onClick={() => markLesson({ video_watched: true })}>İzledim, notları aç</button></section>)}
          {lesson.lesson_resource && <a className="study-resource-link" href={lesson.lesson_resource.url} target="_blank" rel="noreferrer">{lesson.lesson_resource.title} <Icon name="external" size={17}/></a>}
          <GrammarPractice key={lesson.day} lesson={lesson} onComplete={(correct) => markLesson({ grammar_completed: true, grammar_correct: correct })}/>
          {lesson.readings.length > 0 && (!topicForLesson(lesson.day) || lesson.progress.grammar_completed) && <section className="lesson-section"><p className="study-eyebrow">Son adım</p><h2>Reading</h2><p>Okuma metnini kaynak sayfasında aç.</p>{lesson.readings.map((reading) => <a className="study-resource-link" href={reading.url} target="_blank" rel="noreferrer" key={reading.url}>{reading.title}<Icon name="external" size={17}/></a>)}<button className="study-secondary" type="button" onClick={() => markLesson({ reading_completed: true })}>{lesson.progress.reading_completed ? "Okundu" : "Okudum"}</button></section>}
        </>}
      </>}
    </>}
    {tab === "vocab" && <><div className="study-intro"><p className="study-eyebrow">Erasmus kelimeleri</p><h1>Kelime paketi</h1><p>Her pakette 20 kelime var. Paketler sırayla açılır.</p></div>{pack && <><div className="package-header"><span className="package-count">{dashboard?.completed_packages || 0} / 42 paket tamamlandı</span><h2>{pack.day}. paket · {pack.theme}</h2><p>{pack.day <= 30 ? "PDF sözlüğü · İlk 600 kelime" : "Ek çalışma · Son 240 kelime"}</p></div><div className="package-track" aria-label="Paket ilerlemesi"><span style={{width:`${((dashboard?.completed_packages || 0)/42)*100}%`}}/></div><details className="study-card word-details"><summary>Paketteki 20 kelimeyi gör</summary><div className="study-word-list">{pack.words.map((word) => <div key={word.id}><strong>{word.word}</strong><span>{word.meaning_tr}</span>{word.usage && <small>{word.usage}</small>}</div>)}</div></details>{pack.completed ? <div className="study-state"><h2>Tüm paketler tamamlandı</h2><p>Tekrarlar bölümünden çalışmaya devam edebilirsin.</p></div> : quizType === "vocab" ? <VocabularyQuiz key={pack.day} title="Kelime quizi" questions={pack.questions} endpoint={`/vocabulary/packages/${pack.day}/submit`} onFinished={refresh}/> : <button type="button" className="study-primary" onClick={() => setQuizType("vocab")}>20 soruluk quize başla</button>}</>}</>}
    {tab === "review" && <><div className="study-intro"><p className="study-eyebrow">Erasmus kelimeleri</p><h1>Tekrarlar</h1><p>Altı doğru tekrar, kelimeyi öğrenilmiş hâle getirir.</p></div><div className="review-hero"><strong>{dashboard?.due_reviews ?? 0}</strong><span>bekleyen kelime</span></div><div className="review-stages" aria-label="Altı tekrar aşaması">{[1,2,3,4,5,6].map((stage) => <span key={stage}>{stage}</span>)}</div><p className="review-caption">Bir turda en fazla 20 kelime çalışırsın. Yanlış cevaplanan kelime ilk aşamaya döner.</p>{reviews?.count ? quizType === "review" ? <VocabularyQuiz key={reviews.count} title="Kelime tekrarı" questions={reviews.questions} endpoint="/vocabulary/reviews/submit" onFinished={refresh}/> : <button type="button" className="study-primary" onClick={() => setQuizType("review")}>Tekrara başla</button> : <div className="study-state"><h2>Bugün tekrar yok</h2><p>Yeni kelime paketi çalışabilir veya günlük derse dönebilirsin.</p></div>}<section className="study-card exam-setting" id="settings"><h2>Sınav tarihi</h2><p>Sınav yaklaştığında tekrar aralıkların kısalır.</p><input aria-label="Sınav tarihi" type="date" value={settings?.exam_date || ""} onChange={saveExamDate}/></section></>}
  </div>;
}
