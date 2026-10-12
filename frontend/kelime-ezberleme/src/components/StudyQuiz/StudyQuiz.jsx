import { useState } from "react";
import PropTypes from "prop-types";

export default function StudyQuiz({ questions, onSubmit, results, title }) {
  const [answers, setAnswers] = useState({});
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const complete = questions.length > 0 && questions.every((item) => answers[item.id ?? item.word_id]);

  async function submit(event) {
    event.preventDefault();
    setWorking(true);
    setError("");
    try { await onSubmit(answers); } catch (cause) { setError(cause.message); } finally { setWorking(false); }
  }

  return <form className="study-quiz" onSubmit={submit}>
    <h3>{title}</h3>
    {questions.map((item, index) => {
      const id = item.id ?? item.word_id;
      const result = results?.find((row) => (row.id ?? row.word_id) === id);
      return <fieldset className="study-question" key={id}>
        <legend><span>{index + 1}.</span> {item.prompt ?? item.word}</legend>
        <div className="study-options">{item.options.map((option) => <label key={option} className={answers[id] === option ? "selected" : ""}>
          <input type="radio" name={`question-${id}`} value={option} checked={answers[id] === option} disabled={Boolean(results)} onChange={() => setAnswers((previous) => ({ ...previous, [id]: option }))} />{option}
        </label>)}</div>
        {result && <p className={result.correct ? "answer-correct" : "answer-wrong"}>{result.correct ? "Doğru" : `Doğru cevap: ${result.correct_answer}`}{result.explanation ? ` — ${result.explanation}` : ""}</p>}
      </fieldset>;
    })}
    {error && <p role="alert" className="study-error">{error}</p>}
    {!results && <button className="study-primary" type="submit" disabled={!complete || working}>{working ? "Kaydediliyor..." : "Cevapları kontrol et"}</button>}
    {results && <p className="study-score">{results.filter((item) => item.correct).length} / {results.length} doğru</p>}
  </form>;
}

StudyQuiz.propTypes = { questions: PropTypes.array.isRequired, onSubmit: PropTypes.func.isRequired, results: PropTypes.array, title: PropTypes.string.isRequired };
