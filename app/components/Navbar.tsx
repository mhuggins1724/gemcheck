"use client";

import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="nav">
      <div className="nav-inner">
        <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--accent-green)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700 }}>
            G
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px" }}>GemCheck</span>
        </div>

        <div style={{ display: "flex", gap: 4, marginLeft: 16 }}>
          <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "var(--text-primary)", background: "var(--bg-tertiary)", textDecoration: "none" }}>Home</a>
          <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", background: "transparent", textDecoration: "none" }}>Sets</a>
          <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", background: "transparent", textDecoration: "none" }}>Hot Cards</a>
          <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", background: "transparent", textDecoration: "none" }}>Watchlist</a>
          <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", background: "transparent", textDecoration: "none" }}>Pricing</a>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--search-bg)", border: "1px solid var(--border-primary)", borderRadius: 8, padding: "7px 12px" }}>
            <span style={{ color: "var(--text-tertiary)", fontSize: 14 }}>&#128269;</span>
            <input type="text" placeholder="Search any card..." style={{ background: "none", border: "none", outline: "none", color: "var(--text-primary)", fontSize: 13, width: 180, fontFamily: "var(--font-dm-sans)" }} />
          </div>
          <button onClick={toggleTheme} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-secondary)", fontSize: 16, border: "1px solid var(--border-primary)", background: "none", cursor: "pointer" }}>
            {theme === "dark" ? "\u2600\uFE0F" : "\uD83C\uDF19"}
          </button>
        </div>
      </div>
    </nav>
  );
}
