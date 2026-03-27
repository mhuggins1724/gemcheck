"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/useTheme";

var gradients: Record<string, string> = { fire: "linear-gradient(145deg,#7c2d12,#1c1917)", water: "linear-gradient(145deg,#1e3a5f,#0f172a)", electric: "linear-gradient(145deg,#854d0e,#1c1917)", grass: "linear-gradient(145deg,#14532d,#0f172a)", psychic: "linear-gradient(145deg,#581c87,#0f172a)", dragon: "linear-gradient(145deg,#1e3a5f,#581c87)", normal: "linear-gradient(145deg,#44403c,#1c1917)" };
var fallbackImg = "https://rjtwqtpdmmkeknllsuvr.supabase.co/storage/v1/object/public/Logos/NO%20IMAGE%20POKEMON.webp";

var sortOptions = [
  { label: "Value High to Low", key: "value-desc" },
  { label: "Value Low to High", key: "value-asc" },
  { label: "A-Z", key: "name-asc" },
  { label: "Z-A", key: "name-desc" },
  { label: "Card Number Lo-Hi", key: "number-asc" },
  { label: "Card Number Hi-Lo", key: "number-desc" },
];

function sortCards(cards: any[], sortKey: string) {
  var sorted = [...cards];
  if (sortKey === "value-desc") sorted.sort(function(a, b) { return b.raw_price - a.raw_price; });
  else if (sortKey === "value-asc") sorted.sort(function(a, b) { return a.raw_price - b.raw_price; });
  else if (sortKey === "name-asc") sorted.sort(function(a, b) { return a.name.localeCompare(b.name); });
  else if (sortKey === "name-desc") sorted.sort(function(a, b) { return b.name.localeCompare(a.name); });
  else if (sortKey === "number-asc") sorted.sort(function(a, b) {
    var numA = parseInt((a.name.match(/(\d+)\//) || ["","0"])[1]);
    var numB = parseInt((b.name.match(/(\d+)\//) || ["","0"])[1]);
    return numA - numB;
  });
  else if (sortKey === "number-desc") sorted.sort(function(a, b) {
    var numA = parseInt((a.name.match(/(\d+)\//) || ["","0"])[1]);
    var numB = parseInt((b.name.match(/(\d+)\//) || ["","0"])[1]);
    return numB - numA;
  });
  return sorted;
}

async function fetchAllCards(code: string) {
  var allCards: any[] = [];
  var page = 0;
  var pageSize = 1000;
  while (true) {
    var res = await supabase.from("cards").select("*").eq("set_code", code).range(page * pageSize, (page + 1) * pageSize - 1);
    if (!res.data || res.data.length === 0) break;
    allCards.push(...res.data);
    if (res.data.length < pageSize) break;
    page++;
  }
  return allCards;
}

export default function SetDetailPage() {
  const params = useParams();
  const code = (params.code as string || "").toUpperCase();
  const { isDark, toggleTheme } = useTheme();
  const [cards, setCards] = useState<any[]>([]);
  const [setInfo, setSetInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("value-desc");

  useEffect(function() {
    Promise.all([
      fetchAllCards(code),
      supabase.from("sets").select("*").eq("code", code).single()
    ]).then(function(results) {
      setCards(results[0]);
      if (results[1].data) setSetInfo(results[1].data);
      setLoading(false);
    });
  }, [code]);

  var sortedCards = sortCards(cards, sort);

  var bg = isDark ? "#0c0c0f" : "#f8f8fa";
  var text = isDark ? "#ececf0" : "#1a1a2e";
  var textSec = isDark ? "#9898a4" : "#1a1a2e";
  var textTer = isDark ? "#5c5c6a" : "#3a3a4e";
  var cardBg = isDark ? "#1a1a20" : "#ffffff";
  var border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.18)";
  var navBg = isDark ? "rgba(12,12,15,0.95)" : "rgba(255,255,255,0.95)";
  var tertBg = isDark ? "#1e1e24" : "#e8e8ec";
  var green = isDark ? "#22c55e" : "#16a34a";
  var greenBg = isDark ? "rgba(34,197,94,0.1)" : "rgba(22,163,74,0.1)";
  var greenText = isDark ? "#4ade80" : "#047857";
  var redBg = isDark ? "rgba(239,68,68,0.1)" : "rgba(220,38,38,0.1)";
  var redText = isDark ? "#f87171" : "#b91c1c";
  var amberBg = isDark ? "rgba(234,179,8,0.1)" : "rgba(202,138,4,0.1)";
  var amberText = isDark ? "#facc15" : "#a16207";
  var amber = isDark ? "#eab308" : "#be185d";

  function handleImgError(e: any) {
    e.target.onerror = null;
    e.target.src = fallbackImg;
  }

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700 }}>G</div>
            <a href="/" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", textDecoration: "none", color: text }}>GemCheck</a>
          </div>
          <div style={{ display: "flex", gap: 4, marginLeft: 16 }}>
            <a href="/" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Home</a>
            <a href="/sets" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: text, background: tertBg, textDecoration: "none" }}>Sets</a>
            <a href="#" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Hot Cards</a>
            <a href="/search" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Search</a>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={function() { toggleTheme(); }} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: textSec, fontSize: 16, border: "1px solid " + border, background: "none", cursor: "pointer" }}>
              {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 40px" }}>
        <a href="/sets" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: textSec, marginBottom: 20, padding: "6px 12px", borderRadius: 8, textDecoration: "none" }}>&larr; Back to sets</a>

        {setInfo && setInfo.logo_url && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <img src={setInfo.logo_url} alt={setInfo.name} style={{ maxHeight: 60, objectFit: "contain" }} />
          </div>
        )}

        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4, textAlign: "center" }}>{setInfo ? setInfo.name : code}</h1>
        <p style={{ fontSize: 14, color: textSec, marginBottom: 24, textAlign: "center" }}>{setInfo ? setInfo.era + " \u00B7 " + setInfo.year + " \u00B7 " : ""}{cards.length} cards</p>

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
          <select value={sort} onChange={function(e) { setSort(e.target.value); }} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: isDark ? "#1a1a20" : "#ffffff", color: text, border: "1px solid " + border, cursor: "pointer", outline: "none" }}>
            {sortOptions.map(function(opt) {
              return <option key={opt.key} value={opt.key}>{opt.label}</option>;
            })}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: textTer }}>Loading cards...</div>
        ) : sortedCards.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: textTer }}>No cards found for this set.</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {sortedCards.map(function(card) {
              // Calculate gem rate from pop data (same as card detail page)
              var pop = card.psa_pop || [];
              var popTotal = pop.reduce(function(a: number, b: number) { return a + b; }, 0);
              var pop10 = pop.length >= 10 ? pop[9] : 0;
              var realGemRate = popTotal > 0 ? Math.round((pop10 / popTotal) * 100) : card.gem_rate;
              // Calculate avg last 5 sold price (same as card detail page)
              var sales = card.all_sales || [];
              var rawSales = sales.filter(function(s: any) { return s.grade === "raw"; }).slice(0, 5);
              var avgPrice = rawSales.length > 0 ? Math.round(rawSales.reduce(function(a: number, s: any) { return a + s.price; }, 0) / rawSales.length) : card.raw_price;
              
              var gemBg2 = realGemRate >= 65 ? greenBg : realGemRate >= 45 ? amberBg : redBg;
              var gemColor = realGemRate >= 65 ? greenText : realGemRate >= 45 ? amberText : redText;
              return (
                <a key={card.id} href={"/card?id=" + card.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 14, cursor: "pointer", position: "relative", overflow: "hidden", transition: "all 0.25s ease" }}>
                    
                    <div style={{ width: "100%", aspectRatio: "0.72", borderRadius: 8, marginBottom: 12, overflow: "hidden", background: gradients[card.card_type] || gradients.normal }}>
                      <img src={card.image_url || fallbackImg} alt={card.name} onError={handleImgError} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: "normal", overflow: "visible", lineHeight: "1.3", minHeight: "34px" }}>{card.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", padding: "3px 8px", borderRadius: 6, background: gemBg2, color: gemColor }}>{realGemRate}% gem</span>
                      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: greenText }}>${avgPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div style={{ borderTop: "1px solid " + border, padding: "24px 0", marginTop: 40 }}>
          <div style={{ fontSize: 12, color: textTer }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
        </div>
      </div>
    </div>
  );
}
