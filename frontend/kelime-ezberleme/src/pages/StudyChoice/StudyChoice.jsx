import { Link } from "react-router-dom";
import Icon from "../../components/Icon/Icon";
import "../Erasmus/Erasmus.css";

export default function StudyChoice() {
  return <div className="study-shell choice-shell">
    <div className="study-intro"><p className="study-eyebrow">Çalışma alanın</p><h1>Nasıl çalışmak istersin?</h1><p>İki yol, tek hesap. İstediğin zaman aralarında geçiş yapabilirsin.</p></div>
    <div className="study-choice-grid">
      <Link className="study-choice-card" to="/home" onClick={() => localStorage.setItem("vera:mode", "normal")}><span className="study-choice-icon"><Icon name="book" size={30}/></span><h2>Normal çalışma</h2><p>Kelimelerini çalış, günlük quizini çöz ve gelişimini takip et.</p><span className="choice-arrow"><Icon name="arrow" size={21}/></span></Link>
      <Link className="study-choice-card" to="/erasmus?tab=lesson" onClick={() => localStorage.setItem("vera:mode", "erasmus")}><span className="study-choice-icon"><Icon name="layers" size={30}/></span><h2>Erasmus planı</h2><p>Günlük ders, kelime paketleri ve sınava yönelik tekrarlar.</p><span className="choice-arrow"><Icon name="arrow" size={21}/></span></Link>
    </div>
  </div>;
}
