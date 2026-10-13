import { Link } from "react-router-dom";
import Icon from "../../components/Icon/Icon";
import "../Erasmus/Erasmus.css";

export default function Games() {
  return <div className="study-shell"><div className="study-intro"><p className="study-eyebrow">Normal çalışma</p><h1>Oyunlar</h1><p>Öğrendiğin kelimelerle farklı biçimlerde pratik yap.</p></div><nav className="more-list"><Link className="more-link" to="/puzzle"><Icon name="grid" size={21}/><span><strong>Bulmaca</strong><small>Öğrendiğin kelimelerle Wordle oyna</small></span><Icon name="chevron" size={19}/></Link><Link className="more-link" to="/word-chain"><Icon name="book" size={21}/><span><strong>Word Chain</strong><small>Kelimelerden hikâye ve görsel oluştur</small></span><Icon name="chevron" size={19}/></Link></nav></div>;
}
