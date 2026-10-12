import { useState } from "react";
import { grammarTopics } from "../../data/grammar";
import StudyQuiz from "../../components/StudyQuiz/StudyQuiz";
import "../Erasmus/Erasmus.css";

const levels = ["A1", "A2", "B1", "B2", "C1"];

export default function Grammar() {
  const [level, setLevel] = useState("A1");
  const [topicId, setTopicId] = useState("present-simple");
  const [results, setResults] = useState(null);
  const topic = grammarTopics.find((item) => item.id === topicId);
  const questions = topic.quiz.map(([prompt, correct, ...rest], index) => ({ id: index + 1, prompt, options: [correct, ...rest.slice(0, -1)] }));

  function chooseLevel(next) { setLevel(next); setTopicId(grammarTopics.find((item) => item.level === next).id); setResults(null); }
  async function submit(answers) {
    setResults(topic.quiz.map(([prompt, correct, ...rest], index) => ({ id: index + 1, prompt, correct_answer: correct, selected: answers[index + 1], correct: answers[index + 1] === correct, explanation: rest.at(-1) })));
  }

  return <div className="study-shell"><div className="study-intro"><p className="study-eyebrow">Grammar kütüphanesi</p><h2>Konu seç, öğren, kendini dene</h2><p>Bu derslere normal uygulamadan ve Erasmus planından erişebilirsin.</p></div>
    <div className="study-levels">{levels.map((item) => <button type="button" className={level === item ? "active" : ""} onClick={() => chooseLevel(item)} key={item}>{item}</button>)}</div>
    <div className="study-two-columns"><nav className="study-topic-list" aria-label="Grammar konuları">{grammarTopics.filter((item) => item.level === level).map((item) => <button type="button" key={item.id} className={topicId === item.id ? "active" : ""} onClick={() => { setTopicId(item.id); setResults(null); }}>{item.title}</button>)}</nav>
      <article className="study-card"><p className="study-eyebrow">{topic.level} · Ders notu</p><h3>{topic.title}</h3><ul className="study-notes">{topic.notes.map((note) => <li key={note}>{note}</li>)}</ul><StudyQuiz key={topic.id} title="Kendini dene" questions={questions} onSubmit={submit} results={results} /></article>
    </div>
  </div>;
}
