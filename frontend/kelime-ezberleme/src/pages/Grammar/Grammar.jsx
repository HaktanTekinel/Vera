import { useState } from "react";
import { grammarTopics } from "../../data/grammar";
import StudyQuiz from "../../components/StudyQuiz/StudyQuiz";
import "../Erasmus/Erasmus.css";

const levels = ["A1", "A2", "B1", "B2", "C1"];

export default function Grammar() {
  const [level, setLevel] = useState("A1");
  const [topicId, setTopicId] = useState(null);
  const [started, setStarted] = useState(false);
  const [results, setResults] = useState(null);
  const topic = grammarTopics.find((item) => item.id === topicId);
  const questions = topic?.quiz.map(([prompt, correct, ...rest], index) => ({ id: index + 1, prompt, options: [correct, ...rest.slice(0, -1)] })) || [];

  function chooseLevel(next) { setLevel(next); setTopicId(null); setStarted(false); setResults(null); }
  function chooseTopic(next) { setTopicId(next); setStarted(false); setResults(null); }
  async function submit(answers) {
    setResults(topic.quiz.map(([prompt, correct, ...rest], index) => ({ id: index + 1, prompt, correct_answer: correct, selected: answers[index + 1], correct: answers[index + 1] === correct, explanation: rest.at(-1) })));
  }

  return <div className="study-shell"><div className="study-intro"><p className="study-eyebrow">Konu kütüphanesi</p><h1>Grammar</h1><p>Seviyeni seç, kısa notları oku ve kendini dene.</p></div>
    <div className="study-levels" aria-label="Seviye seçimi">{levels.map((item) => <button type="button" className={level === item ? "active" : ""} onClick={() => chooseLevel(item)} key={item}>{item}</button>)}</div>
    {!topic ? <nav className="study-topic-list" aria-label="Grammar konuları">{grammarTopics.filter((item) => item.level === level).map((item) => <button type="button" key={item.id} onClick={() => chooseTopic(item.id)}>{item.title}</button>)}</nav> : <section className="lesson-section grammar-note"><button className="study-secondary" type="button" onClick={() => chooseTopic(null)}>← Konulara dön</button><p className="study-eyebrow">{topic.level} · Ders notu</p><h2>{topic.title}</h2><ul className="study-notes">{topic.notes.map((note) => <li key={note}>{note}</li>)}</ul>{started ? <StudyQuiz key={topic.id} title="Grammar quizi" questions={questions} onSubmit={submit} results={results}/> : <button className="study-primary" type="button" onClick={() => setStarted(true)}>Quize başla</button>}</section>}
  </div>;
}
