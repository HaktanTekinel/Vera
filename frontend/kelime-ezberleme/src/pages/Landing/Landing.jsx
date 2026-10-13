import { Link } from "react-router-dom";
import Icon from "../../components/Icon/Icon";
import "./Landing.css";

export default function Landing() {
  return <div className="landing-page"><header className="landing-navbar"><Link className="vera-brand" to="/"><Icon name="book" size={22}/>Vera</Link><Link className="landing-login" to="/login">Giriş yap</Link></header><main className="landing-main"><p className="study-eyebrow">İngilizce çalışma alanın</p><h1>Her gün biraz daha ileri.</h1><p>Günlük derslerini, kelimelerini ve tekrarlarını tek yerde çalış. Kendi hızında ilerle veya Erasmus planını takip et.</p><Link className="study-primary" to="/register">Çalışmaya başla <Icon name="arrow" size={18}/></Link><Link className="landing-subtle" to="/login">Zaten hesabım var</Link></main><footer className="landing-footer">Vera · İngilizce öğrenme alanı</footer></div>;
}
