"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../lib/supabase";
import { useTheme } from "../../lib/useTheme";
import { getColors } from "../../lib/design";

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
    var res = await supabase.from("cards").select("id,name,set_code,card_type,image_url,raw_price,gem_rate,psa_pop").eq("set_code", code).range(page * pageSize, (page + 1) * pageSize - 1);
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
  const [search, setSearch] = useState("");

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

  var filteredCards = search.trim() === "" ? cards : cards.filter(function(card) {
    var q = search.trim().toLowerCase();
    var name = (card.name || "").toLowerCase();
    // Match against card name
    if (name.includes(q)) return true;
    // Match against card number (e.g. "25" matches "25/198" or "025/198")
    var numMatch = name.match(/(\d+)\//);
    if (numMatch) {
      var cardNum = parseInt(numMatch[1]).toString();
      if (cardNum === q || numMatch[1] === q) return true;
    }
    return false;
  });
  var sortedCards = sortCards(filteredCards, sort);

  var co = getColors(isDark);
  var bg = co.bg; var text = co.text; var textSec = co.textSecondary; var textTer = co.textTertiary;
  var cardBg = co.card; var border = co.border; var navBg = co.nav; var tertBg = co.surface;
  var green = co.accent; var greenBg = co.accentBg; var greenText = co.accentText;
  var redBg = co.redBg; var redText = co.red; var amberBg = co.amberBg; var amberText = co.amber; var amber = co.amber;

  function handleImgError(e: any) {
    e.target.onerror = null;
    e.target.src = fallbackImg;
  }

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="34" height="38" viewBox="0 0 52 60" fill="none"><defs><linearGradient id="ns" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs><path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="url(#ns)"/><path d="M16 30L23 37L36 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <a href="/" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", textDecoration: "none", background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>GemCheck</a>
          </div>
          <div style={{ display: "flex", gap: 4, marginLeft: 16 }}>
            <a href="/" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Home</a>
            <a href="/sets" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: text, background: tertBg, textDecoration: "none" }}>Sets</a>
            <a href="/market" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Market Movers</a>
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

        {/* Set header with blurred pack/logo background */}
        <div style={{ position: "relative" as const, borderRadius: 16, overflow: "hidden", marginBottom: 24, padding: "40px 24px", textAlign: "center" }}>
          {(function() {
            var bgImg = (setInfo && setInfo.pack_image_url) || (setInfo && setInfo.logo_url);
            var isPack = setInfo && setInfo.pack_image_url;
            if (!bgImg) return null;
            return <div style={{ position: "absolute" as const, inset: 0, backgroundImage: "url(" + bgImg + ")", backgroundSize: isPack ? "200px auto" : "cover", backgroundPosition: "center", backgroundRepeat: "repeat", filter: "blur(" + (isPack ? "1px" : "10px") + ") saturate(1.5)", transform: "scale(1.05)", opacity: isPack ? 0.9 : 0.6 }}></div>;
          })()}
          <div style={{ position: "absolute" as const, inset: 0, background: (setInfo && (setInfo.pack_image_url || setInfo.logo_url)) ? (isDark ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.45)") : co.surface }}></div>
          <div style={{ position: "relative" as const, zIndex: 1 }}>
            {setInfo && setInfo.logo_url && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
                <img src={setInfo.logo_url} alt={setInfo.name} style={{ maxHeight: 80, objectFit: "contain", filter: "drop-shadow(0 2px 12px rgba(0,0,0,0.6)) drop-shadow(0 0 20px rgba(0,0,0,0.3))" }} />
              </div>
            )}
            <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 6, color: "#fff", textShadow: "0 2px 8px rgba(0,0,0,0.5), 0 0 20px rgba(0,0,0,0.3)" }}>{setInfo ? setInfo.name : code}</h1>
            <p style={{ fontSize: 16, fontWeight: 700, color: "rgba(255,255,255,0.9)", marginBottom: 0, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}>{setInfo ? setInfo.era + " \u00B7 " + (setInfo.release_date ? new Date(setInfo.release_date + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : setInfo.year) + " \u00B7 " : ""}{cards.length} cards</p>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12 }}>
          <div style={{ position: "relative", flex: "1", maxWidth: 320 }}>
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", width: 14, height: 14, color: textTer }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
            <input value={search} onChange={function(e) { setSearch(e.target.value); }} placeholder="Search card..." style={{ width: "100%", padding: "8px 14px 8px 32px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: isDark ? "#1a1a20" : "#ffffff", color: text, border: "1px solid " + border, outline: "none" }} />
          </div>
          <select value={sort} onChange={function(e) { setSort(e.target.value); }} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: isDark ? "#1a1a20" : "#ffffff", color: text, border: "1px solid " + border, cursor: "pointer", outline: "none" }}>
            {sortOptions.map(function(opt) {
              return <option key={opt.key} value={opt.key}>{opt.label}</option>;
            })}
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: textTer }}>Loading cards...</div>
        ) : sortedCards.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40, color: textTer }}>{search.trim() ? "No cards matching \"" + search.trim() + "\"" : "No cards found for this set."}</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {sortedCards.map(function(card) {
              // Calculate gem rate from pop data (same as card detail page)
              var pop = card.psa_pop || [];
              var popTotal = pop.reduce(function(a: number, b: number) { return a + b; }, 0);
              var pop10 = pop.length >= 10 ? pop[9] : 0;
              var realGemRate = popTotal > 0 ? Math.round((pop10 / popTotal) * 100) : card.gem_rate;
              var avgPrice = card.raw_price;
              
              var gemBg2 = realGemRate >= 65 ? greenBg : realGemRate >= 45 ? amberBg : redBg;
              var gemColor = realGemRate >= 65 ? greenText : realGemRate >= 45 ? amberText : redText;
              return (
                <a key={card.id} href={"/card?id=" + card.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card-tile" style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 14, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.06)" }}>
                    <div style={{ width: "100%", aspectRatio: "0.72", borderRadius: 10, marginBottom: 12, overflow: "hidden", background: gradients[card.card_type] || gradients.normal }}>
                      <img src={card.image_url || fallbackImg} alt={card.name} onError={handleImgError} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: "normal", overflow: "visible", lineHeight: "1.3", minHeight: "34px" }}>{card.name}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                      <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", padding: "3px 8px", borderRadius: 6, background: realGemRate > 0 ? gemBg2 : (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)"), color: realGemRate > 0 ? gemColor : textTer }}>{realGemRate > 0 ? realGemRate + "% gem" : "Low Data"}</span>
                      <span style={{ fontSize: 13, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: avgPrice > 0 ? greenText : textTer }}>{avgPrice > 0 ? "$" + avgPrice.toLocaleString() : "Low Data"}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        <div style={{ borderTop: "1px solid " + border, padding: "24px 0", marginTop: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
        </div>
      </div>
    </div>
  );
}
