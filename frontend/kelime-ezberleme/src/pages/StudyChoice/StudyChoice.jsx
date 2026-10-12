import { Link } from "react-router-dom";
import "../Erasmus/Erasmus.css";

export default function StudyChoice() {
  return <div className="study-shell">
    <div className="study-intro"><p className="study-eyebrow">Çalışma alanın</p><h2>Bugün nasıl çalışmak istersin?</h2><p>İki çalışma yolu aynı hesapta, birbirinden ayrı ilerler.</p></div>
    <div className="study-choice-grid">
      <Link className="study-choice-card" to="/home"><span className="study-choice-icon">📚</span><h3>Kelime Hafızam</h3><p>Mevcut kelimelerin, tekrarların, oyunların ve raporların.</p><strong>Normal uygulamaya geç →</strong></Link>
      <Link className="study-choice-card featured" to="/erasmus"><span className="study-choice-icon">🎓</span><h3>Erasmus planım</h3><p>42 günlük ders akışı, 600 kelime ve sınava yönelik tekrarlar.</p><strong>Çalışma planını aç →</strong></Link>
    </div>
    <Link className="study-subtle-link" to="/grammar">A1–C1 grammar kütüphanesine git →</Link>
  </div>;
}
