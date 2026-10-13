import { useState } from "react";
import PropTypes from "prop-types";

export default function StudyQuiz({ questions, onSubmit, results, title, instantFeedback = false }) {
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState({});
  const [index, setIndex] = useState(0);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const current = questions[index];
  const currentId = current?.id ?? current?.word_id;
  const wrong = results?.filter((item) => !item.correct) || [];

  async function advance() {
    if (instantFeedback && !revealed[currentId]) {
      setRevealed((previous) => ({ ...previous, [currentId]: true }));
      return;
    }
    if (index < questions.length - 1) { setIndex(index + 1); return; }
    setWorking(true); setError("");
    try { await onSubmit(answers); } catch (cause) { setError(cause.message); } finally { setWorking(false); }
  }

  if (!questions.length) return <div className="study-empty"><h2>Henüz soru yok</h2><p>Bu çalışmada gösterilecek soru bulunamadı.</p></div>;

  if (results) return <section className="study-quiz study-result" aria-live="polite">
    <p className="study-eyebrow">Çalışma tamamlandı</p><h2>{title}</h2>
    <div className="result-number">{results.filter((item) => item.correct).length}<span> / {results.length} doğru</span></div>
    {wrong.length ? <><h3>Tekrar bakılacak sorular</h3><div className="result-list">{wrong.map((item) => <div key={item.id ?? item.word_id} className="result-row"><strong>{item.prompt || item.word || questions.find((q) => (q.id ?? q.word_id) === (item.id ?? item.word_id))?.prompt || questions.find((q) => (q.id ?? q.word_id) === (item.id ?? item.word_id))?.word}</strong>{item.selected && <small>Senin cevabın: {item.selected}</small>}<span>Doğru cevap: {item.correct_answer}</span>{item.explanation && <small>{item.explanation}</small>}</div>)}</div></> : <p className="study-success">Harika, tüm soruları doğru yanıtladın.</p>}
  </section>;

  return <section className="study-quiz"><div className="quiz-topline"><span>{title}</span><strong>{index + 1} / {questions.length}</strong></div><div className="quiz-progress" aria-hidden="true"><span style={{width:`${((index + 1) / questions.length) * 100}%`}}/></div>
    <h2 className="quiz-prompt">{current.prompt ?? current.word}</h2>
    {current.usage && <p className="quiz-hint">{current.usage}</p>}
    <fieldset className="quiz-options"><legend className="sr-only">Cevabını seç</legend>{current.options.map((option) => <label key={option} className={`quiz-option ${revealed[currentId] && instantFeedback ? option === current.correct ? "correct" : answers[currentId] === option ? "wrong" : "" : answers[currentId] === option ? "selected" : ""}`}><input type="radio" name={`question-${currentId}`} value={option} checked={answers[currentId] === option} disabled={instantFeedback && Boolean(revealed[currentId])} onChange={() => setAnswers((previous) => ({ ...previous, [currentId]: option }))}/><span>{option}</span></label>)}</fieldset>
    {instantFeedback && revealed[currentId] && <div className={`quiz-feedback ${answers[currentId] === current.correct ? "correct" : "wrong"}`} role="status"><strong>{answers[currentId] === current.correct ? "Doğru cevap" : `Doğru cevap: ${current.correct}`}</strong><p>{current.explanation}</p></div>}
    {error && <p role="alert" className="study-error">{error}</p>}
    <div className="quiz-actions">{index > 0 && <button type="button" className="study-secondary" onClick={() => setIndex(index - 1)}>Önceki</button>}<button type="button" className="study-primary" disabled={!answers[currentId] || working} onClick={advance}>{working ? "Kontrol ediliyor..." : instantFeedback && !revealed[currentId] ? "Cevabı kontrol et" : index === questions.length - 1 ? "Sonucu gör" : "Sonraki soru"}</button></div>
  </section>;
}

StudyQuiz.propTypes = { questions: PropTypes.array.isRequired, onSubmit: PropTypes.func.isRequired, results: PropTypes.array, title: PropTypes.string.isRequired, instantFeedback: PropTypes.bool };
