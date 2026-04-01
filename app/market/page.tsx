"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../lib/useTheme";
import { getColors } from "../lib/design";

var categories = [
  { key: "pct-gain", label: "Top % Gainers", icon: "📈" },
  { key: "pct-drop", label: "Top % Droppers", icon: "📉" },
  { key: "dollar-gain", label: "Top $ Gainers", icon: "💰" },
  { key: "dollar-drop", label: "Top $ Droppers", icon: "💸" },
  { key: "most-active", label: "Most Active", icon: "🔥" },
  { key: "new-highs", label: "New Highs", icon: "🎯" },
  { key: "new-lows", label: "New Lows", icon: "⬇️" },
];

var periods = [
  { key: "7d", label: "7 Days" },
  { key: "30d", label: "30 Days" },
  { key: "90d", label: "90 Days" },
];

function getDaysAgo(days: number) {
  var d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().slice(0, 10);
}

function calcMovers(cards: any[], period: string) {
  var daysMap: Record<string, number> = { "7d": 7, "30d": 30, "90d": 90 };
  var days = daysMap[period] || 30;
  // Map days to how many monthly chart points back to compare
  var monthsBack = period === "7d" ? 1 : period === "30d" ? 1 : 3;
  var cutoff = getDaysAgo(days);

  var results: any[] = [];

  cards.forEach(function (card) {
    var chartData = card.price_chart_data || {};
    var rawChart = chartData.raw || [];

    // Need at least 2 data points to compare
    if (rawChart.length < 2) return;

    // Current price = last chart point
    var current = rawChart[rawChart.length - 1].price;
    if (current < 5) return;

    // Compare to N months back in chart data
    var pastIdx = Math.max(0, rawChart.length - 1 - monthsBack);
    var pastPrice = rawChart[pastIdx].price;
    if (pastPrice < 1) return;
    // If same as current index, use the one before
    if (pastIdx === rawChart.length - 1 && rawChart.length >= 2) {
      pastPrice = rawChart[rawChart.length - 2].price;
    }

    var dollarChange = current - pastPrice;
    var pctChange = ((current - pastPrice) / pastPrice) * 100;

    // Count recent sales
    var sales = card.all_sales || [];
    var recentSales = sales.filter(function (s: any) {
      return s.date_sold && s.date_sold >= cutoff;
    });

    // All-time high/low from chart
    var allPrices = rawChart.map(function (p: any) { return p.price; });
    var allTimeHigh = Math.max.apply(null, allPrices);
    var positivePrices = allPrices.filter(function (p: number) { return p > 0; });
    var allTimeLow = positivePrices.length > 0 ? Math.min.apply(null, positivePrices) : current;
    var isNewHigh = current >= allTimeHigh * 0.95;
    var isNewLow = current <= allTimeLow * 1.05;

    results.push({
      id: card.id,
      name: card.name,
      set_name: card.set_name,
      image_url: card.image_url,
      current: Math.round(current),
      past: Math.round(pastPrice),
      dollarChange: Math.round(dollarChange),
      pctChange: Math.round(pctChange * 10) / 10,
      salesCount: recentSales.length,
      isNewHigh: isNewHigh,
      isNewLow: isNewLow,
    });
  });

  return results;
}

function getFiltered(results: any[], category: string) {
  var sorted = [...results];
  if (category === "pct-gain") {
    return sorted.filter(function (c) { return c.pctChange > 0; }).sort(function (a, b) { return b.pctChange - a.pctChange; }).slice(0, 50);
  } else if (category === "pct-drop") {
    return sorted.filter(function (c) { return c.pctChange < 0; }).sort(function (a, b) { return a.pctChange - b.pctChange; }).slice(0, 50);
  } else if (category === "dollar-gain") {
    return sorted.filter(function (c) { return c.dollarChange > 0; }).sort(function (a, b) { return b.dollarChange - a.dollarChange; }).slice(0, 50);
  } else if (category === "dollar-drop") {
    return sorted.filter(function (c) { return c.dollarChange < 0; }).sort(function (a, b) { return a.dollarChange - b.dollarChange; }).slice(0, 50);
  } else if (category === "most-active") {
    return sorted.filter(function (c) { return c.salesCount > 0; }).sort(function (a, b) { return b.salesCount - a.salesCount; }).slice(0, 50);
  } else if (category === "new-highs") {
    return sorted.filter(function (c) { return c.isNewHigh && c.pctChange > 0; }).sort(function (a, b) { return b.pctChange - a.pctChange; }).slice(0, 50);
  } else if (category === "new-lows") {
    return sorted.filter(function (c) { return c.isNewLow && c.pctChange < 0; }).sort(function (a, b) { return a.pctChange - b.pctChange; }).slice(0, 50);
  }
  return [];
}

export default function MarketMoversPage() {
  const { isDark, toggleTheme } = useTheme();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("pct-gain");
  const [period, setPeriod] = useState("30d");
  const [movers, setMovers] = useState<any[]>([]);

  var co = getColors(isDark);

  useEffect(function () {
    // Fetch in two steps: IDs first (fast), then chart data in batches
    (async function () {
      // Step 1: Get IDs of cards worth $10+
      var { data: idRows } = await supabase.from("cards").select("id").gt("raw_price", 9).limit(2000);
      if (!idRows || idRows.length === 0) { setLoading(false); return; }
      var allIds = idRows.map(function (r: any) { return r.id; });

      // Step 2: Batch fetch chart data 50 at a time
      var allCards: any[] = [];
      for (var i = 0; i < allIds.length; i += 50) {
        var batch = allIds.slice(i, i + 50);
        var { data } = await supabase.from("cards").select("id,name,set_name,image_url,raw_price,price_chart_data,all_sales").in("id", batch);
        if (data) allCards.push.apply(allCards, data);
      }
      setCards(allCards);
      setLoading(false);
    })();
  }, []);

  useEffect(function () {
    if (cards.length === 0) return;
    var results = calcMovers(cards, period);
    setMovers(results);
  }, [cards, period]);

  var filtered = getFiltered(movers, category);

  return (
    <div style={{ background: co.bg, color: co.text, minHeight: "100vh" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: co.nav, backdropFilter: "blur(16px)", borderBottom: "1px solid " + co.border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 56, display: "flex", alignItems: "center", gap: 32 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: co.text }}>
            <svg width="34" height="38" viewBox="0 0 52 60" fill="none"><defs><linearGradient id="ns" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient></defs><path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="url(#ns)" /><path d="M16 30L23 37L36 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>GemCheck</span>
          </a>
          <div style={{ display: "flex", gap: 2 }}>
            {[{ label: "Home", href: "/" }, { label: "Sets", href: "/sets" }, { label: "Market Movers", href: "/market", active: true }, { label: "Search", href: "/search" }].map(function (nav) {
              return <a key={nav.label} href={nav.href} style={{ padding: "6px 14px", borderRadius: 6, fontSize: 15, fontWeight: 700, color: nav.active ? co.text : co.textSecondary, background: nav.active ? co.surface : "transparent", textDecoration: "none" }}>{nav.label}</a>;
            })}
          </div>
          <div style={{ marginLeft: "auto" }}>
            <button onClick={toggleTheme} style={{ width: 32, height: 32, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: co.textSecondary, fontSize: 14, border: "1px solid " + co.border, background: "none", cursor: "pointer" }}>
              {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 40px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4 }}>Market Movers</h1>
        <p style={{ fontSize: 14, color: co.textSecondary, marginBottom: 24 }}>Daily price movements and market trends for Pokemon cards valued above $5</p>

        {/* Period selector */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: co.surface, borderRadius: 10, padding: 3, width: "fit-content" }}>
          {periods.map(function (p) {
            var active = period === p.key;
            return (
              <button key={p.key} onClick={function () { setPeriod(p.key); }} style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: active ? 700 : 500, background: active ? (isDark ? "#2a2a32" : "#ffffff") : "transparent", color: active ? co.text : co.textSecondary, border: "none", cursor: "pointer", boxShadow: active ? co.shadow : "none" }}>{p.label}</button>
            );
          })}
        </div>

        {/* Category tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" as const }}>
          {categories.map(function (cat) {
            var active = category === cat.key;
            return (
              <button key={cat.key} onClick={function () { setCategory(cat.key); }} style={{ padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: active ? 700 : 500, background: active ? (isDark ? "rgba(59,130,246,0.15)" : "rgba(59,130,246,0.1)") : co.surface, color: active ? co.blue : co.textSecondary, border: active ? "1px solid " + co.blue : "1px solid " + co.border, cursor: "pointer" }}>
                {cat.icon} {cat.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 48, color: co.textTertiary }}>Loading market data...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: 48, color: co.textTertiary }}>No movers found for this period</div>
        ) : (
          <div>
            {/* Table view */}
            <div style={{ overflowX: "auto" as const }}>
              <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid " + co.border }}>
                    <th style={{ textAlign: "left" as const, padding: "10px 8px", color: co.textTertiary, fontWeight: 600, fontSize: 11 }}>#</th>
                    <th style={{ textAlign: "left" as const, padding: "10px 8px", color: co.textTertiary, fontWeight: 600, fontSize: 11 }}>Card</th>
                    <th style={{ textAlign: "left" as const, padding: "10px 8px", color: co.textTertiary, fontWeight: 600, fontSize: 11 }}>Set</th>
                    <th style={{ textAlign: "right" as const, padding: "10px 8px", color: co.textTertiary, fontWeight: 600, fontSize: 11 }}>Current</th>
                    <th style={{ textAlign: "right" as const, padding: "10px 8px", color: co.textTertiary, fontWeight: 600, fontSize: 11 }}>Previous</th>
                    <th style={{ textAlign: "right" as const, padding: "10px 8px", color: co.textTertiary, fontWeight: 600, fontSize: 11 }}>$ Change</th>
                    <th style={{ textAlign: "right" as const, padding: "10px 8px", color: co.textTertiary, fontWeight: 600, fontSize: 11 }}>% Change</th>
                    {category === "most-active" && <th style={{ textAlign: "right" as const, padding: "10px 8px", color: co.textTertiary, fontWeight: 600, fontSize: 11 }}>Sales</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(function (card, idx) {
                    var isGain = card.dollarChange >= 0;
                    var changeColor = isGain ? co.accentText : co.red;
                    return (
                      <tr key={card.id} style={{ borderBottom: "1px solid " + co.border, cursor: "pointer" }} onClick={function () { window.location.href = "/card?id=" + card.id; }}>
                        <td style={{ padding: "10px 8px", color: co.textTertiary, fontWeight: 600 }}>{idx + 1}</td>
                        <td style={{ padding: "10px 8px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {card.image_url ? (
                              <img src={card.image_url} alt="" style={{ width: 32, height: 44, objectFit: "cover" as const, borderRadius: 4 }} />
                            ) : (
                              <div style={{ width: 32, height: 44, borderRadius: 4, background: co.surface }}></div>
                            )}
                            <span style={{ fontWeight: 600 }}>{card.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: "10px 8px", color: co.textSecondary, fontSize: 12 }}>{card.set_name}</td>
                        <td style={{ padding: "10px 8px", textAlign: "right" as const, fontWeight: 700, fontFamily: "var(--font-jetbrains)" }}>${card.current.toLocaleString()}</td>
                        <td style={{ padding: "10px 8px", textAlign: "right" as const, color: co.textSecondary, fontFamily: "var(--font-jetbrains)" }}>${card.past.toLocaleString()}</td>
                        <td style={{ padding: "10px 8px", textAlign: "right" as const, fontWeight: 700, fontFamily: "var(--font-jetbrains)", color: changeColor }}>{isGain ? "+" : ""}{card.dollarChange < 0 ? "\u2212" : ""}${Math.abs(card.dollarChange).toLocaleString()}</td>
                        <td style={{ padding: "10px 8px", textAlign: "right" as const }}>
                          <span style={{ padding: "3px 8px", borderRadius: 6, fontSize: 12, fontWeight: 700, fontFamily: "var(--font-jetbrains)", background: isGain ? co.accentBg : co.redBg, color: changeColor }}>{isGain ? "+" : ""}{card.pctChange}%</span>
                        </td>
                        {category === "most-active" && <td style={{ padding: "10px 8px", textAlign: "right" as const, fontWeight: 700, fontFamily: "var(--font-jetbrains)" }}>{card.salesCount}</td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ borderTop: "1px solid " + co.border, padding: "24px 0", marginTop: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
        </div>
      </div>
    </div>
  );
}
