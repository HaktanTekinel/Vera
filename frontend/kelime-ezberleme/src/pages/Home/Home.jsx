import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDashboardSummaryAPI } from "../../services/dashboardService";
import Icon from "../../components/Icon/Icon";
import "./Home.css";

export default function Home() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getDashboardSummaryAPI().then(setSummary).catch((cause) => setError(cause.message)); }, []);
  return <div className="normal-home"><div className="study-intro"><p className="study-eyebrow">Normal çalışma</p><h1>Bugün ne çalışalım?</h1><p>Kelimelerini tekrar ederek ilerlemeye devam et.</p></div>
    {error && <div className="study-error" role="alert">Durumun yüklenemedi: {error}</div>}
    <section className="normal-focus"><p className="study-eyebrow">Bugünün çalışması</p><h2>Günlük quiz</h2><p>{summary ? `${summary.stats.pending_reviews} kelime tekrar bekliyor.` : "Günlük durumun yükleniyor..."}</p><Link className="study-primary" to="/quiz">Quize başla <Icon name="arrow" size={18}/></Link></section>
    <div className="normal-summary"><div><strong>{summary?.daily_goal.completed ?? "–"} / {summary?.daily_goal.target ?? "–"}</strong><span>Günlük hedef</span></div><div><strong>{summary?.stats.learned_words ?? "–"}</strong><span>Öğrenilen kelime</span></div></div>
    <section className="normal-next"><h2>Diğer çalışmalar</h2><Link to="/words"><Icon name="book" size={20}/>Kelimelerime bak <Icon name="chevron" size={18}/></Link><Link to="/grammar"><Icon name="layers" size={20}/>Grammar çalış <Icon name="chevron" size={18}/></Link></section>
  </div>;
}
