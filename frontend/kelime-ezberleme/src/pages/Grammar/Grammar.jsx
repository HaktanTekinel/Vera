import { useState } from "react";
import { grammarTopics } from "../../data/grammar";
import { grammarLessons } from "../../data/grammarLessons";
import { grammarQuestions, grammarQuestionCounts } from "../../data/grammarPractice";
import grammarVideos from "../../data/grammarVideos.json";
import StudyQuiz from "../../components/StudyQuiz/StudyQuiz";
import Icon from "../../components/Icon/Icon";
import "../Erasmus/Erasmus.css";

const levels = ["A1", "A2", "B1", "B2", "C1"];
const a1Order = ["be-present", "pronouns-possessives", "articles-nouns", "demonstratives", "there-is-are", "have-got", "present-simple", "present-continuous", "basic-questions", "some-any-count", "can-imperatives", "basic-prepositions", "likes-would-like", "past-simple"];
const a2Order = ["present-tense-choice", "past-continuous", "past-tense-choice", "future", "present-perfect-intro", "ability-obligation-advice", "verb-ing-preferences", "adjectives-adverbs", "comparison"];

export default function Grammar() {
  const [level, setLevel] = useState("A1");
  const [topicId, setTopicId] = useState(null);
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState(null);
  const [videoIndex, setVideoIndex] = useState(0);
  const topic = grammarTopics.find((item) => item.id === topicId);
  const lesson = grammarLessons[topicId];
  const questions = grammarQuestions(topicId);
  const videos = grammarVideos[topicId] || [];
  const activeVideo = videos[videoIndex] || videos[0];

  function chooseLevel(next) {
    setLevel(next);
    setTopicId(null);
    setStarted(false);
    setResults(null);
    setVideoIndex(0);
  }

  function chooseTopic(next) {
    setTopicId(next);
    setStarted(false);
    setResults(null);
    setVideoIndex(0);
  }

  function submit(answers) {
    setResults(questions.map((question) => ({
      id: question.id,
      prompt: question.prompt,
      correct_answer: question.correct,
      selected: answers[question.id],
      correct: answers[question.id] === question.correct,
      explanation: question.explanation,
    })));
  }

  return <div className="study-shell grammar-library">
    <div className="study-intro">
      <p className="study-eyebrow">Konu kütüphanesi</p>
      <h1>Grammar</h1>
      <p>Konuyu örneklerle öğren, kısa özeti tekrar et ve grammar sorularıyla kendini dene.</p>
    </div>
    <div className="study-levels" aria-label="Seviye seçimi">
      {levels.map((item) => <button type="button" className={level === item ? "active" : ""} onClick={() => chooseLevel(item)} key={item}>{item}</button>)}
    </div>
    {!topic ? <nav className="study-topic-list" aria-label="Grammar konuları">
      {grammarTopics.filter((item) => item.level === level).sort((a, b) => {
        const order = level === "A1" ? a1Order : level === "A2" ? a2Order : null;
        return order ? order.indexOf(a.id) - order.indexOf(b.id) : 0;
      }).map((item) => <button type="button" key={item.id} onClick={() => chooseTopic(item.id)}>
        <strong>{item.title}</strong><span>Detaylı ders · {grammarQuestionCounts[item.id] || 0} grammar sorusu</span>
      </button>)}
    </nav> : <article className="lesson-section grammar-lesson">
      <button className="study-secondary grammar-back" type="button" onClick={() => chooseTopic(null)}>← Konulara dön</button>
      <header className="grammar-lesson-header">
        <p className="study-eyebrow">{topic.level} · Grammar dersi</p>
        <h2>{topic.title}</h2>
        <p>{lesson?.intro}</p>
      </header>
      {activeVideo && <section className="grammar-video" aria-label="Konu videosu">
        <div className="grammar-video-heading">
          <p className="study-eyebrow">Video dersi · engVid</p>
          <h3>{activeVideo.teacher} ile izle</h3>
          <p>{activeVideo.title}</p>
        </div>
        <div className="study-video-frame">
          <iframe key={activeVideo.embed_url} title={`${activeVideo.teacher}: ${activeVideo.title}`} src={activeVideo.embed_url} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen />
        </div>
        <a className="study-inline-link" href={activeVideo.url} target="_blank" rel="noopener noreferrer">engVid kaynak sayfasını aç <Icon name="external" size={16}/></a>
        <p className="grammar-video-help">Oynatıcı açılmazsa dersi engVid kaynak sayfasından izleyebilirsin.</p>
        {videos.length > 1 && <div className="grammar-video-list" aria-label="İlgili video dersleri">
          {videos.map((video, index) => <button key={video.url} type="button" className={index === videoIndex ? "active" : ""} aria-pressed={index === videoIndex} onClick={() => setVideoIndex(index)}>
            <span>{video.teacher}</span><strong>{video.title}</strong>
          </button>)}
        </div>}
      </section>}
      <div className="grammar-sections">
        {lesson?.sections.map(([heading, body, example], index) => <section className="grammar-section" key={heading}>
          <span className="grammar-section-number">{String(index + 1).padStart(2, "0")}</span>
          <div><h3>{heading}</h3><p>{body}</p><div className="grammar-example">{example.split(" · ").map((line) => <span key={line}>{line}</span>)}</div></div>
        </section>)}
      </div>
      <aside className="grammar-summary">
        <p className="study-eyebrow">Kısa not</p>
        <h3>Akılda kalması gerekenler</h3>
        <ul>{lesson?.summary.map((note) => <li key={note}>{note}</li>)}</ul>
      </aside>
      <section className="grammar-practice" aria-label="Grammar alıştırması">
        <div><p className="study-eyebrow">Alıştırma</p><h3>Konuyu pekiştir</h3><p>{questions.length} grammar sorusu · Her cevap için açıklama</p></div>
        {started ? <>
          <StudyQuiz key={topic.id} title={topic.title + " quizi"} questions={questions} onSubmit={submit} results={results} instantFeedback />
          {results && <button className="study-secondary" type="button" onClick={() => { setResults(null); setStarted(false); }}>Tekrar çöz</button>}
        </> : <button className="study-primary" type="button" onClick={() => setStarted(true)}>Grammar quizine başla</button>}
      </section>
    </article>}
  </div>;
}
