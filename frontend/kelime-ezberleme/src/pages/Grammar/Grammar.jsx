import { useState } from "react";
import { grammarTopics } from "../../data/grammar";
import { grammarLessons } from "../../data/grammarLessons";
import { grammarQuestions, grammarQuestionCounts } from "../../data/grammarPractice";
import StudyQuiz from "../../components/StudyQuiz/StudyQuiz";
import "../Erasmus/Erasmus.css";

const levels = ["A1", "A2", "B1", "B2", "C1"];

export default function Grammar() {
  const [level, setLevel] = useState("A1");
  const [topicId, setTopicId] = useState(null);
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState(null);
  const topic = grammarTopics.find((item) => item.id === topicId);
  const lesson = grammarLessons[topicId];
  const questions = grammarQuestions(topicId);

  function chooseLevel(next) {
    setLevel(next);
    setTopicId(null);
    setStarted(false);
    setResults(null);
  }

  function chooseTopic(next) {
    setTopicId(next);
    setStarted(false);
    setResults(null);
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
      {grammarTopics.filter((item) => item.level === level).map((item) => <button type="button" key={item.id} onClick={() => chooseTopic(item.id)}>
        <strong>{item.title}</strong><span>Detaylı ders · {grammarQuestionCounts[item.id] || 0} grammar sorusu</span>
      </button>)}
    </nav> : <article className="lesson-section grammar-lesson">
      <button className="study-secondary grammar-back" type="button" onClick={() => chooseTopic(null)}>← Konulara dön</button>
      <header className="grammar-lesson-header">
        <p className="study-eyebrow">{topic.level} · Grammar dersi</p>
        <h2>{topic.title}</h2>
        <p>{lesson?.intro}</p>
      </header>
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
