import { Link, useOutletContext } from "react-router-dom";
import Icon from "../../components/Icon/Icon";
import "../Erasmus/Erasmus.css";

export default function More() {
  const { mode, logout } = useOutletContext();
  const links = mode === "erasmus" ? [
    { title: "Sınav tarihi", description: "Tekrar takvimini sınavına göre ayarla", href: "/erasmus?tab=review#settings", icon: "calendar" },
    { title: "Grammar", description: "A1–C1 konularını çalış", href: "/grammar", icon: "layers" },
  ] : [
    { title: "Kelime ekle", description: "Yeni kelime ve örnek cümle kaydet", href: "/add-word", icon: "plus" },
    { title: "Grammar", description: "A1–C1 konularını çalış", href: "/grammar", icon: "layers" },
    { title: "Analiz raporu", description: "Gelişimini incele ve rapor yazdır", href: "/reports", icon: "chart" },
    { title: "Ayarlar", description: "Çalışma tercihlerini düzenle", href: "/settings", icon: "settings" },
  ];
  return <div className="study-shell"><div className="study-intro"><p className="study-eyebrow">Vera</p><h1>Diğer</h1><p>Çalışma araçların ve hesap seçeneklerin.</p></div><nav className="more-list">{links.map((item) => <Link to={item.href} key={item.title} className="more-link"><Icon name={item.icon} size={21}/><span><strong>{item.title}</strong><small>{item.description}</small></span><Icon name="chevron" size={19}/></Link>)}</nav><button type="button" className="study-secondary" onClick={logout}>Çıkış yap</button></div>;
}
