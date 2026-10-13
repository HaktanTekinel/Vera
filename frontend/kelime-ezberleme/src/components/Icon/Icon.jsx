import PropTypes from "prop-types";

const paths = {
  home: <><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-7h6v7"/></>,
  book: <><path d="M12 7c-2-2-5-2-9-2v14c4 0 7 0 9 2 2-2 5-2 9-2V5c-4 0-7 0-9 2Z"/><path d="M12 7v14"/></>,
  check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  more: <><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></>,
  play: <><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></>,
  repeat: <><path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15"/><path d="m7 22-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  arrow: <><path d="M4 12h16"/><path d="m14 6 6 6-6 6"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/></>,
  external: <><path d="M13 5h6v6M19 5l-9 9"/><path d="M19 14v5H5V5h5"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M12 2v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-8M22 20V7"/></>,
  plus: <path d="M12 4v16M4 12h16"/>,
  volume: <><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15 9a5 5 0 0 1 0 6M18 6a9 9 0 0 1 0 12"/></>,
  alert: <><path d="m12 3 10 18H2z"/><path d="M12 9v5M12 18h.01"/></>,
  x: <path d="M5 5l14 14M19 5 5 19"/>,
};

export default function Icon({ name, size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.book}</svg>;
}
Icon.propTypes = { name: PropTypes.string.isRequired, size: PropTypes.number };
