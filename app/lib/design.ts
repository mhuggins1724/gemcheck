// Shared design tokens for consistent styling across all pages
export function getColors(isDark: boolean) {
  return {
    bg: isDark ? "#09090b" : "#ffffff",
    surface: isDark ? "#141418" : "#f9fafb",
    card: isDark ? "#18181c" : "#ffffff",
    border: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.08)",
    borderStrong: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)",
    nav: isDark ? "rgba(9,9,11,0.9)" : "rgba(255,255,255,0.9)",

    text: isDark ? "#fafafa" : "#09090b",
    textSecondary: isDark ? "#a1a1aa" : "#52525b",
    textTertiary: isDark ? "#71717a" : "#a1a1aa",
    textMuted: isDark ? "#52525b" : "#d4d4d8",

    accent: "#10b981", // emerald-500
    accentLight: isDark ? "#34d399" : "#059669",
    accentBg: isDark ? "rgba(16,185,129,0.1)" : "rgba(16,185,129,0.08)",
    accentText: isDark ? "#34d399" : "#059669",

    blue: isDark ? "#60a5fa" : "#2563eb",
    blueBg: isDark ? "rgba(96,165,250,0.1)" : "rgba(37,99,235,0.08)",

    red: isDark ? "#f87171" : "#dc2626",
    redBg: isDark ? "rgba(248,113,113,0.1)" : "rgba(220,38,38,0.08)",

    amber: isDark ? "#fbbf24" : "#d97706",
    amberBg: isDark ? "rgba(251,191,36,0.1)" : "rgba(217,119,6,0.08)",

    shadow: isDark ? "0 1px 3px rgba(0,0,0,0.4)" : "0 1px 3px rgba(0,0,0,0.06)",
    shadowHover: isDark ? "0 8px 30px rgba(0,0,0,0.3)" : "0 8px 30px rgba(0,0,0,0.1)",
  };
}
