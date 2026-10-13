import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { clearAuthData } from "../../services/apiClient";
import Icon from "../Icon/Icon";
import "./AppLayout.css";

const normalItems = [
  { label: "Bugün", icon: "home", href: "/home" },
  { label: "Kelimeler", icon: "book", href: "/words" },
  { label: "Quiz", icon: "check", href: "/quiz" },
  { label: "Oyunlar", icon: "grid", href: "/games" },
  { label: "Diğer", icon: "more", href: "/more" },
];
const erasmusItems = [
  { label: "Ders", icon: "play", href: "/erasmus?tab=lesson", tab: "lesson" },
  { label: "Kelimeler", icon: "book", href: "/erasmus?tab=vocab", tab: "vocab" },
  { label: "Tekrar", icon: "repeat", href: "/erasmus?tab=review", tab: "review" },
  { label: "Grammar", icon: "layers", href: "/grammar" },
  { label: "Diğer", icon: "more", href: "/more" },
];

export default function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const savedMode = localStorage.getItem("vera:mode") || "normal";
  const isChoice = location.pathname === "/choose";
  const mode = location.pathname === "/erasmus" ? "erasmus" : ["/home", "/words", "/add-word", "/quiz", "/games", "/puzzle", "/word-chain", "/reports", "/settings"].includes(location.pathname) ? "normal" : savedMode;
  const currentTab = new URLSearchParams(location.search).get("tab") || "lesson";

  useEffect(() => {
    if (location.pathname === "/erasmus") localStorage.setItem("vera:mode", "erasmus");
    if (location.pathname === "/home") localStorage.setItem("vera:mode", "normal");
  }, [location.pathname]);

  function logout() {
    clearAuthData();
    navigate("/login", { replace: true });
  }

  const items = mode === "erasmus" ? erasmusItems : normalItems;
  return <div className="vera-app">
    <header className="vera-header"><div className="vera-header-inner">
      <Link className="vera-brand" to="/choose" aria-label="Vera, çalışma yolu seçimi"><span className="vera-mark"><Icon name="book" size={19} /></span>Vera</Link>
      {!isChoice && <div className="vera-header-right"><span className="vera-mode-label">{mode === "erasmus" ? "Erasmus" : "Normal çalışma"}</span><Link className="vera-change-mode" to="/choose">Yolu değiştir <Icon name="chevron" size={16} /></Link></div>}
    </div></header>
    <main className={`vera-main ${isChoice ? "vera-main-choice" : ""}`}><Outlet context={{ mode, logout }} /></main>
    {!isChoice && <nav className="vera-bottom-nav" aria-label="Ana gezinme"><div className="vera-bottom-inner">{items.map((item) => {
      const active = item.tab ? location.pathname === "/erasmus" && currentTab === item.tab : location.pathname === item.href || (item.href === "/games" && ["/puzzle", "/word-chain"].includes(location.pathname)) || (item.href === "/more" && ["/reports", "/settings", "/add-word"].includes(location.pathname));
      return <Link key={item.label} to={item.href} className={`vera-nav-item ${active ? "active" : ""}`} aria-current={active ? "page" : undefined}><Icon name={item.icon} size={21} /><span>{item.label}</span></Link>;
    })}</div></nav>}
  </div>;
}
