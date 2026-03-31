"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../lib/useTheme";
import { getColors } from "../lib/design";

var gradients: Record<string, string> = { fire: "linear-gradient(145deg,#7c2d12,#1c1917)", water: "linear-gradient(145deg,#1e3a5f,#0f172a)", electric: "linear-gradient(145deg,#854d0e,#1c1917)", grass: "linear-gradient(145deg,#14532d,#0f172a)", psychic: "linear-gradient(145deg,#581c87,#0f172a)", dragon: "linear-gradient(145deg,#1e3a5f,#581c87)", normal: "linear-gradient(145deg,#44403c,#1c1917)" };

async function smartSearch(q: string) {
  if (!q.trim()) return [];
  q = q.trim();

  var hasSlash = q.includes("/");
  var parts = q.split(/\s+/);
  var textParts: string[] = [];
  var numParts: string[] = [];

  parts.forEach(function(p) {
    if (/^\d+$/.test(p) || p.includes("/")) numParts.push(p);
    else textParts.push(p);
  });

  var nameText = textParts.join(" ");
  var numStr = numParts.join(" ");

  if (hasSlash && !nameText) {
    var padded = numStr.replace(/^(\d+)\//, function(m, n) { return n.padStart(3, "0") + "/"; });
    var unpadded = numStr.replace(/^0+(\d+\/)/, "$1");
    var res = await supabase.from("cards").select("*").or("name.ilike.%" + padded + "%,name.ilike.%" + unpadded + "%").order("grade_score", { ascending: false }).limit(200);
    return res.data || [];
  }

  if (nameText && numStr) {
    var num = numStr.replace(/\/.*/,"");
    var paddedNum = num.padStart(3, "0");
    var searchPatterns = [];
    if (hasSlash) {
      var fullPadded = numStr.replace(/^(\d+)\//, function(m, n) { return n.padStart(3, "0") + "/"; });
      searchPatterns.push("%" + nameText + "%" + fullPadded + "%");
      searchPatterns.push("%" + nameText + "%" + numStr + "%");
    } else {
      searchPatterns.push("%" + nameText + "%" + paddedNum + "/%");
      searchPatterns.push("%" + nameText + "%" + num + "/%");
    }
    var orFilter = searchPatterns.map(function(p) { return "name.ilike." + p; }).join(",");
    var res = await supabase.from("cards").select("*").or(orFilter).order("grade_score", { ascending: false }).limit(200);
    return res.data || [];
  }

  if (numStr && !nameText && !hasSlash) {
    var paddedN = numStr.padStart(3, "0");
    var res = await supabase.from("cards").select("*").or("name.ilike.% " + paddedN + "/%,name.ilike.% " + numStr + "/%").order("grade_score", { ascending: false }).limit(200);
    return res.data || [];
  }

  var res = await supabase.from("cards").select("*").ilike("name", "%" + nameText + "%").order("grade_score", { ascending: false }).limit(200);
  return res.data || [];
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const { isDark, toggleTheme } = useTheme();
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [hasSearched, setHasSearched] = useState(false);
  const [sort, setSort] = useState("best-match");
  const timerRef = useRef<any>(null);

  useEffect(function() {
    if (initialQuery) {
      setLoading(true);
      smartSearch(initialQuery).then(function(results) {
        setCards(results);
        setLoading(false);
        setHasSearched(true);
      });
    }
  }, [initialQuery]);

  function onInputChange(value: string) {
    setSearchInput(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!value.trim()) {
      setCards([]);
      setHasSearched(false);
      return;
    }
    timerRef.current = setTimeout(function() {
      setLoading(true);
      setHasSearched(true);
      smartSearch(value).then(function(results) {
        setCards(results);
        setLoading(false);
      });
    }, 300);
  }

  var co = getColors(isDark);
  var bg = co.bg; var text = co.text; var textSec = co.textSecondary; var textTer = co.textTertiary;
  var cardBg = co.card; var border = co.border; var navBg = co.nav;
  var green = co.accent; var greenBg = co.accentBg; var greenText = co.accentText;
  var redBg = co.redBg; var redText = co.red; var amberBg = co.amberBg; var amberText = co.amber; var amber = co.amber;
  var blueText = co.blue; var tertBg = co.surface;

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="34" height="38" viewBox="0 0 52 60" fill="none"><defs><linearGradient id="ns2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs><path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="url(#ns2)"/><path d="M16 30L23 37L36 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <a href="/" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", textDecoration: "none", background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>GemCheck</a>
          </div>
          <div style={{ display: "flex", gap: 4, marginLeft: 16 }}>
            <a href="/" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Home</a>
            <a href="/sets" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Sets</a>
            <a href="/market" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: textSec, textDecoration: "none" }}>Market Movers</a>
            <a href="/search" style={{ padding: "8px 14px", borderRadius: 8, fontSize: 13, fontWeight: 500, color: text, background: tertBg, textDecoration: "none" }}>Search</a>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={function() { toggleTheme(); }} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: textSec, fontSize: 16, border: "1px solid " + border, background: "none", cursor: "pointer" }}>
              {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 40px" }}>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: textSec, marginBottom: 20, padding: "6px 12px", borderRadius: 8, textDecoration: "none" }}>&larr; Back to home</a>

        <div style={{ marginBottom: 32 }}>
          <input type="text" value={searchInput} onChange={function(e) { onInputChange(e.target.value); }} autoFocus placeholder="Start typing to search... (e.g. Charizard, 020/230, Charizard 20)" style={{ width: "100%", padding: "16px 20px", fontSize: 18, background: cardBg, border: "1px solid " + border, borderRadius: 12, color: text, outline: "none", fontFamily: "DM Sans, sans-serif" }} />
        </div>

        {loading && (
          <div style={{ textAlign: "center", padding: 20, color: textTer }}>Searching...</div>
        )}

        {hasSearched && !loading && (
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: textSec }}>{cards.length} results {searchInput ? "for \"" + searchInput + "\"" : ""}</h2>
            <select value={sort} onChange={function(e) { setSort(e.target.value); }} style={{ padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: isDark ? "#1a1a20" : "#ffffff", color: text, border: "1px solid " + border, cursor: "pointer", outline: "none" }}>
              <option value="best-match">Best Match</option>
              <option value="value-desc">Value High to Low</option>
              <option value="value-asc">Value Low to High</option>
              <option value="name-asc">A-Z</option>
              <option value="name-desc">Z-A</option>
              <option value="number-asc">Card Number Lo-Hi</option>
              <option value="number-desc">Card Number Hi-Lo</option>
            </select>
          </div>
        )}

        {!hasSearched && !loading && (
          <div style={{ textAlign: "center", padding: "60px 0", color: textTer }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>&#128269;</div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: textSec, marginBottom: 8 }}>Search 12,000+ Pokemon cards</h2>
            <p style={{ fontSize: 14 }}>Results update as you type</p>
          </div>
        )}

        {!loading && cards.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {(function() {
              var sorted = [...cards];
              if (sort === "value-desc") sorted.sort(function(a, b) { return b.raw_price - a.raw_price; });
              else if (sort === "value-asc") sorted.sort(function(a, b) { return a.raw_price - b.raw_price; });
              else if (sort === "name-asc") sorted.sort(function(a, b) { return a.name.localeCompare(b.name); });
              else if (sort === "name-desc") sorted.sort(function(a, b) { return b.name.localeCompare(a.name); });
              else if (sort === "number-asc") sorted.sort(function(a, b) {
                var numA = parseInt((a.name.match(/(\d+)\//) || ["","0"])[1]);
                var numB = parseInt((b.name.match(/(\d+)\//) || ["","0"])[1]);
                return numA - numB;
              });
              else if (sort === "number-desc") sorted.sort(function(a, b) {
                var numA = parseInt((a.name.match(/(\d+)\//) || ["","0"])[1]);
                var numB = parseInt((b.name.match(/(\d+)\//) || ["","0"])[1]);
                return numB - numA;
              });
              // best-match: keep original order from Supabase (grade_score desc)
              return sorted;
            })().map(function(card) {
              var pop = card.psa_pop || [];
              var popTotal = pop.reduce(function(a: number, b: number) { return a + b; }, 0);
              var pop10 = pop.length >= 10 ? pop[9] : 0;
              var realGemRate = popTotal > 0 ? Math.round((pop10 / popTotal) * 100) : card.gem_rate;
              var cardSales = card.all_sales || [];
              var rawSales5 = cardSales.filter(function(s: any) { return s.grade === "raw"; }).slice(0, 5);
              var rawAvgPrice = rawSales5.length > 0 ? Math.round(rawSales5.reduce(function(a: number, s: any) { return a + s.price; }, 0) / rawSales5.length) : card.raw_price;
              
              var gemBg2 = realGemRate >= 65 ? greenBg : realGemRate >= 45 ? amberBg : redBg;
              var gemColor = realGemRate >= 65 ? greenText : realGemRate >= 45 ? amberText : redText;
              return (
                <a key={card.id} href={"/card?id=" + card.id} style={{ textDecoration: "none", color: "inherit" }}>
                  <div className="card-tile" style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 14, cursor: "pointer", position: "relative", overflow: "hidden", boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(0,0,0,0.06)" }}>
                    
                    <div style={{ width: "100%", aspectRatio: "0.72", borderRadius: 8, marginBottom: 12, overflow: "hidden", background: gradients[card.card_type] || gradients.normal }}>
                      {card.image_url ? (
                        <img src={card.image_url} alt={card.name} style={{ width: "100%", height: "100%", objectFit: "cover", referrerPolicy: "no-referrer" } as any} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>{card.name.split(" ")[0]}</div>
                      )}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2, whiteSpace: "normal", overflow: "visible", lineHeight: "1.3", minHeight: "34px" }}>{card.name}</div>
                    <div style={{ fontSize: 11, color: textTer, marginBottom: 10 }}>{card.set_name}</div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 11, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", padding: "3px 8px", borderRadius: 6, background: gemBg2, color: gemColor }}>{realGemRate}% gem</span>
                      <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: blueText }}>${rawAvgPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        )}

        {hasSearched && !loading && cards.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: textTer }}>
            <p style={{ fontSize: 14 }}>No cards found. Try a different search term.</p>
          </div>
        )}

        <div style={{ borderTop: "1px solid " + border, padding: "24px 0", marginTop: 40 }}>
          <div style={{ fontSize: 12, fontWeight: 600, background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ background: "#0c0c0f", color: "#ececf0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
