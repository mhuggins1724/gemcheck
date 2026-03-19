"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: () => void;
}>({
  theme: "dark",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

const themes = {
  dark: {
    bg: "#0c0c0f",
    text: "#ececf0",
    textSecondary: "#9898a4",
    textTertiary: "#5c5c6a",
    card: "#1a1a20",
    border: "rgba(255,255,255,0.08)",
    navBg: "rgba(12,12,15,0.85)",
    searchBg: "#1e1e24",
    tertiary: "#1e1e24",
  },
  light: {
    bg: "#f8f8fa",
    text: "#1a1a2e",
    textSecondary: "#6b6b80",
    textTertiary: "#9898a8",
    card: "#ffffff",
    border: "rgba(0,0,0,0.08)",
    navBg: "rgba(248,248,250,0.9)",
    searchBg: "#f0f0f4",
    tertiary: "#f0f0f4",
  },
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const saved = localStorage.getItem("gemcheck-theme") as Theme | null;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("gemcheck-theme", next);
  };

  const colors = themes[theme];

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--bg-card", colors.card);
    root.style.setProperty("--text-primary", colors.text);
    root.style.setProperty("--text-secondary", colors.textSecondary);
    root.style.setProperty("--text-tertiary", colors.textTertiary);
    root.style.setProperty("--border-primary", colors.border);
    root.style.setProperty("--nav-bg", colors.navBg);
    root.style.setProperty("--search-bg", colors.searchBg);
    root.style.setProperty("--bg-tertiary", colors.tertiary);
    root.style.setProperty("--accent-green", theme === "light" ? "#16a34a" : "#22c55e");
    root.style.setProperty("--accent-green-bg", theme === "light" ? "rgba(22,163,74,0.08)" : "rgba(34,197,94,0.1)");
    root.style.setProperty("--accent-green-text", theme === "light" ? "#15803d" : "#4ade80");
    root.style.setProperty("--accent-red-bg", theme === "light" ? "rgba(220,38,38,0.08)" : "rgba(239,68,68,0.1)");
    root.style.setProperty("--accent-red-text", theme === "light" ? "#b91c1c" : "#f87171");
    root.style.setProperty("--accent-amber", theme === "light" ? "#ca8a04" : "#eab308");
    root.style.setProperty("--accent-amber-bg", theme === "light" ? "rgba(202,138,4,0.08)" : "rgba(234,179,8,0.1)");
    root.style.setProperty("--accent-amber-text", theme === "light" ? "#a16207" : "#facc15");
    root.style.setProperty("--accent-blue-text", theme === "light" ? "#1d4ed8" : "#60a5fa");
    root.style.setProperty("--accent-purple", theme === "light" ? "#7c3aed" : "#8b5cf6");
  }, [theme, colors]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div style={{ background: colors.bg, color: colors.text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
