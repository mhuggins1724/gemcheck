"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../lib/useTheme";

var gradients: Record<string, string> = { fire: "linear-gradient(145deg,#7c2d12,#1c1917)", water: "linear-gradient(145deg,#1e3a5f,#0f172a)", electric: "linear-gradient(145deg,#854d0e,#1c1917)", grass: "linear-gradient(145deg,#14532d,#0f172a)", psychic: "linear-gradient(145deg,#581c87,#0f172a)", dragon: "linear-gradient(145deg,#1e3a5f,#581c87)", normal: "linear-gradient(145deg,#44403c,#1c1917)" };

function CardDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { isDark, toggleTheme } = useTheme();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"pricing" | "population">("pricing");
  const [gradeView, setGradeView] = useState("raw");
  // Derived values for chart and sales filter
  var chartGrade = gradeView === "PSA 9" ? "psa9" : gradeView === "PSA 10" ? "psa10" : gradeView === "raw" ? "raw" : "other";
  var salesFilter = gradeView;

  useEffect(function() {
    supabase.from("cards").select("id,name,set_name,set_code,year,card_type,rarity,gem_rate,raw_price,psa10_price,psa9_price,psa10_trend,psa9_trend,grading_fee,pop_10,pop_9,pop_8,pop_7,grade_score,price_history,image_url,tcg_product_id,market_price,low_price,mid_price,high_price,tcg_url,all_sales,psa_pop,cgc_pop,last_sales_refresh").eq("id", id).single().then(function(res) {
      if (res.data) setCard(res.data);
      setLoading(false);
    });
  }, [id]);

  var bg = isDark ? "#0c0c0f" : "#f8f8fa";
  var text = isDark ? "#ececf0" : "#1a1a2e";
  var textSec = isDark ? "#9898a4" : "#1a1a2e";
  var textTer = isDark ? "#5c5c6a" : "#3a3a4e";
  var cardBg = isDark ? "#1a1a20" : "#ffffff";
  var border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.18)";
  var navBg = isDark ? "rgba(12,12,15,0.95)" : "rgba(255,255,255,0.95)";
  var searchBgColor = isDark ? "#1e1e24" : "#f0f0f4";
  var tertBg = isDark ? "#1e1e24" : "#e8e8ec";
  var green = isDark ? "#22c55e" : "#16a34a";
  var greenBg = isDark ? "rgba(34,197,94,0.1)" : "rgba(22,163,74,0.1)";
  var greenText = isDark ? "#4ade80" : "#047857";
  var redText = isDark ? "#f87171" : "#b91c1c";
  var amberBg = isDark ? "rgba(234,179,8,0.1)" : "rgba(202,138,4,0.1)";
  var amber = isDark ? "#eab308" : "#be185d";
  var blueText = isDark ? "#60a5fa" : "#1e40af";

  if (loading) return <div style={{ background: bg, color: text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>Loading card data...</div>;
  if (!card) return <div style={{ background: bg, color: text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>Card not found</div>;

  var profit10 = card.psa10_price - card.raw_price - card.grading_fee;
  var profit9 = card.psa9_price - card.raw_price - card.grading_fee;
  var scoreColor = card.grade_score >= 7 ? green : card.grade_score >= 5 ? "#eab308" : "#ef4444";
  var scoreBg = card.grade_score >= 7 ? greenBg : card.grade_score >= 5 ? amberBg : "rgba(239,68,68,0.1)";
  var scoreLabel = card.grade_score >= 7 ? "Recommended to grade" : card.grade_score >= 5 ? "Marginal - proceed with caution" : "Not recommended";

  // Calculate avg of last 10 sold for each grade from all_sales
  var allSales = card.all_sales || [];
  function avgLast10(filterFn: (s: any) => boolean) {
    var filtered = allSales.filter(filterFn).slice(0, 10);
    if (filtered.length === 0) return null;
    var sum = filtered.reduce(function(a: number, s: any) { return a + s.price; }, 0);
    return Math.round(sum / filtered.length);
  }
  var rawAvg = avgLast10(function(s: any) { return s.grade === "raw"; });
  var psa9Avg = avgLast10(function(s: any) { return s.company === "PSA" && s.grade === "9"; });
  var psa10Avg = avgLast10(function(s: any) { return s.company === "PSA" && s.grade === "10"; });

  // Last sold for each grade
  function lastSold(filterFn: (s: any) => boolean) {
    var filtered = allSales.filter(filterFn);
    return filtered.length > 0 ? Math.round(filtered[0].price) : null;
  }
  var rawLast = lastSold(function(s: any) { return s.grade === "raw"; });
  var psa9Last = lastSold(function(s: any) { return s.company === "PSA" && s.grade === "9"; });
  var psa10Last = lastSold(function(s: any) { return s.company === "PSA" && s.grade === "10"; });

  // Gem rate from population data
  var psaPop = card.psa_pop || [];
  var cgcPop = card.cgc_pop || [];
  var psaTotal = psaPop.reduce(function(a: number, b: number) { return a + b; }, 0);
  var cgcTotal = cgcPop.reduce(function(a: number, b: number) { return a + b; }, 0);
  var psaPop10 = psaPop.length >= 10 ? psaPop[9] : 0;
  var gemRate = psaTotal > 0 ? Math.round((psaPop10 / psaTotal) * 100) : card.gem_rate;

  // Price history from sales for chart
  function getSalesForChart(grade: string) {
    var filtered = allSales.filter(function(s: any) {
      if (grade === "raw") return s.grade === "raw";
      if (grade === "psa9") return s.company === "PSA" && s.grade === "9";
      if (grade === "psa10") return s.company === "PSA" && s.grade === "10";
      return false;
    }).slice(0, 20).reverse();
    return filtered;
  }

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: green, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "#fff", fontWeight: 700 }}>G</div>
            <a href="/" style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", textDecoration: "none", color: text }}>GemCheck</a>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: searchBgColor, border: "1px solid " + border, borderRadius: 8, padding: "7px 12px" }}>
              <input type="text" placeholder="Search any card..." style={{ background: "none", border: "none", outline: "none", color: text, fontSize: 13, width: 180, fontFamily: "DM Sans, sans-serif" }} />
            </div>
            <button onClick={function() { toggleTheme(); }} style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: textSec, fontSize: 16, border: "1px solid " + border, background: "none", cursor: "pointer" }}>
              {isDark ? "\u2600\uFE0F" : "\uD83C\uDF19"}
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "80px 24px 40px" }}>
        <a href="#" onClick={function(e: any) { e.preventDefault(); window.history.back(); }} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: textSec, marginBottom: 20, padding: "6px 12px", borderRadius: 8, textDecoration: "none", cursor: "pointer" }}>&larr; Back</a>

        <div style={{ display: "flex", gap: 40, marginBottom: 32, flexWrap: "wrap" as const, justifyContent: "center" }}>
          <div style={{ width: 380, flexShrink: 0 }}>
            <div style={{ width: "100%", borderRadius: 16, overflow: "hidden", border: "1px solid " + border, background: gradients[card.card_type] || gradients.normal, boxShadow: isDark ? "0 8px 32px rgba(0,0,0,0.4)" : "0 8px 32px rgba(0,0,0,0.12)" }}>
              {card.image_url ? (
                <img src={card.image_url} alt={card.name} style={{ width: "100%", display: "block" }} />
              ) : (
                <div style={{ width: "100%", aspectRatio: "0.72", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "rgba(255,255,255,0.4)" }}>{card.name.split(" ")[0]}</div>
              )}
            </div>
          </div>

          <div style={{ flex: 1, minWidth: 300 }}>
            <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4 }}>{card.name}</h1>
            <p style={{ fontSize: 13, color: textSec, marginBottom: 16 }}>{card.set_name} &middot; {card.set_code} &middot; {card.year}</p>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" as const, background: "rgba(239,68,68,0.15)", color: "#f87171" }}>{card.card_type}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" as const, background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>{card.rarity}</span>
            </div>

            <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", flexShrink: 0, background: scoreBg, color: scoreColor }}>{card.grade_score}</div>
                <div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{scoreLabel}</h3>
                  <p style={{ fontSize: 12, color: textSec, lineHeight: 1.4 }}>{gemRate}% gem rate &middot; {profit10 >= 0 ? "+$" + profit10 : "-$" + Math.abs(profit10)} expected on PSA 10</p>
                </div>
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: textTer, marginBottom: 3 }}><span>0%</span><span>Gem rate: {gemRate}%</span><span>100%</span></div>
                <div style={{ height: 5, background: tertBg, borderRadius: 3, overflow: "hidden" }}><div style={{ height: "100%", width: gemRate + "%", borderRadius: 3, background: green }}></div></div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              <button style={{ flex: 1, padding: 12, borderRadius: 10, fontSize: 13, fontWeight: 600, background: green, color: "#fff", border: "none", cursor: "pointer" }}>Add to watchlist</button>
              <button style={{ flex: 1, padding: 12, borderRadius: 10, fontSize: 13, fontWeight: 600, background: "transparent", border: "1px solid " + border, color: textSec, cursor: "pointer" }}>View on eBay</button>
            </div>
          </div>
        </div>

        {/* Pricing / Population toggle */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, background: tertBg, borderRadius: 10, padding: 3, width: "fit-content" }}>
          {(["pricing", "population"] as const).map(function(mode) {
            var active = viewMode === mode;
            return (
              <button key={mode} onClick={function() { setViewMode(mode); }} style={{ padding: "8px 20px", borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400, background: active ? (isDark ? "#2a2a32" : "#ffffff") : "transparent", color: active ? text : textSec, border: "none", cursor: "pointer", transition: "all 0.2s ease", boxShadow: active ? (isDark ? "0 1px 3px rgba(0,0,0,0.3)" : "0 1px 3px rgba(0,0,0,0.1)") : "none" }}>{mode === "pricing" ? "Pricing" : "Population Report"}</button>
            );
          })}
        </div>

        {viewMode === "pricing" && (
          <div>
            {/* Three price boxes */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 16 }}>
              {/* Raw */}
              <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>Raw</div>
                <div style={{ fontSize: 11, color: textSec, marginBottom: 2 }}>Last Sold</div>
                <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: blueText, marginBottom: 8 }}>{rawLast !== null ? "$" + rawLast.toLocaleString() : "$" + card.raw_price}</div>
                <div style={{ fontSize: 11, color: textSec }}>Avg of last 10 sold</div>
                <div style={{ fontSize: 14, fontWeight: 500, fontFamily: "JetBrains Mono, monospace", color: textSec }}>{rawAvg !== null ? "$" + rawAvg.toLocaleString() : "—"}</div>
              </div>
              {/* PSA 9 */}
              <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>PSA 9</div>
                <div style={{ fontSize: 11, color: textSec, marginBottom: 2 }}>Last Sold</div>
                <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: blueText, marginBottom: 8 }}>{psa9Last !== null ? "$" + psa9Last.toLocaleString() : "$" + card.psa9_price}</div>
                <div style={{ fontSize: 11, color: textSec }}>Avg of last 10 sold</div>
                <div style={{ fontSize: 14, fontWeight: 500, fontFamily: "JetBrains Mono, monospace", color: textSec }}>{psa9Avg !== null ? "$" + psa9Avg.toLocaleString() : "—"}</div>
              </div>
              {/* PSA 10 */}
              <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 11, color: textTer, textTransform: "uppercase" as const, letterSpacing: "0.5px", marginBottom: 6 }}>PSA 10</div>
                <div style={{ fontSize: 11, color: textSec, marginBottom: 2 }}>Last Sold</div>
                <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: blueText, marginBottom: 8 }}>{psa10Last !== null ? "$" + psa10Last.toLocaleString() : "$" + card.psa10_price}</div>
                <div style={{ fontSize: 11, color: textSec }}>Avg of last 10 sold</div>
                <div style={{ fontSize: 14, fontWeight: 500, fontFamily: "JetBrains Mono, monospace", color: textSec, marginBottom: 8 }}>{psa10Avg !== null ? "$" + psa10Avg.toLocaleString() : "—"}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 8px", borderRadius: 6, background: greenBg, width: "fit-content" }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: green }}></div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: greenText }}>{gemRate}% Gem Rate</span>
                </div>
              </div>
            </div>

            {/* Profit calculator */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div style={{ padding: 14, borderRadius: 12, border: "1px solid " + border, position: "relative" as const, overflow: "hidden" }}>
                <div style={{ position: "absolute" as const, top: 0, left: 0, width: 3, height: "100%", background: green }}></div>
                <div style={{ fontSize: 12, color: textSec, marginBottom: 4, paddingLeft: 8 }}>If PSA 10 ({gemRate}% chance)</div>
                <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: greenText, paddingLeft: 8 }}>{profit10 >= 0 ? "+" : ""}{profit10 < 0 ? "\u2212" : ""}${Math.abs(profit10)}</div>
                <div style={{ fontSize: 10, color: textTer, marginTop: 4, lineHeight: 1.5, paddingLeft: 8 }}>${card.psa10_price} sale &minus; ${card.raw_price} raw &minus; ${card.grading_fee} grading</div>
              </div>
              <div style={{ padding: 14, borderRadius: 12, border: "1px solid " + border, position: "relative" as const, overflow: "hidden" }}>
                <div style={{ position: "absolute" as const, top: 0, left: 0, width: 3, height: "100%", background: "#ef4444" }}></div>
                <div style={{ fontSize: 12, color: textSec, marginBottom: 4, paddingLeft: 8 }}>If PSA 9 ({100 - gemRate}% chance)</div>
                <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: profit9 >= 0 ? greenText : redText, paddingLeft: 8 }}>{profit9 >= 0 ? "+" : ""}{profit9 < 0 ? "\u2212" : ""}${Math.abs(profit9)}</div>
                <div style={{ fontSize: 10, color: textTer, marginTop: 4, lineHeight: 1.5, paddingLeft: 8 }}>${card.psa9_price} sale &minus; ${card.raw_price} raw &minus; ${card.grading_fee} grading</div>
              </div>
            </div>

            {/* Price history chart */}
            <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Price History</div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["raw", "PSA 9", "PSA 10"].map(function(g) {
                    var active = gradeView === g;
                    return (
                      <button key={g} onClick={function() { setGradeView(g); }} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: active ? 600 : 400, background: active ? green : "transparent", color: active ? "#fff" : textSec, border: active ? "none" : "1px solid " + border, cursor: "pointer" }}>{g === "raw" ? "Raw" : g}</button>
                    );
                  })}
                </div>
              </div>
              {(function() {
                var chartSales = getSalesForChart(chartGrade);
                if (chartSales.length < 2) return (
                  <div style={{ textAlign: "center", padding: 32, color: textTer, fontSize: 13 }}>Not enough sales data for chart</div>
                );
                var chartPrices = chartSales.map(function(s: any) { return s.price; });
                var minP = Math.min(...chartPrices);
                var maxP = Math.max(...chartPrices);
                var range = maxP - minP || 1;
                var w = 100;
                var h = 160;
                var padX = 0;
                var padY = 10;
                var points = chartSales.map(function(s: any, i: number) {
                  var x = padX + (i / (chartSales.length - 1)) * (w - padX * 2);
                  var y = padY + (1 - (s.price - minP) / range) * (h - padY * 2);
                  return { x: x, y: y, price: s.price, date: s.date_sold };
                });
                var lineColor = chartGrade === "raw" ? (isDark ? "#60a5fa" : "#2563eb") : chartGrade === "psa10" ? green : amber;
                var pathD = points.map(function(p: any, i: number) { return (i === 0 ? "M" : "L") + p.x + " " + p.y; }).join(" ");
                var areaD = pathD + " L" + points[points.length - 1].x + " " + h + " L" + points[0].x + " " + h + " Z";

                return (
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 10, color: textTer, fontFamily: "JetBrains Mono, monospace" }}>
                      <span>${maxP.toLocaleString()}</span>
                      <span>${minP.toLocaleString()}</span>
                    </div>
                    <svg viewBox={"0 0 " + w + " " + h} style={{ width: "100%", height: 160 }} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={lineColor} stopOpacity="0.2" />
                          <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      <path d={areaD} fill="url(#chartFill)" />
                      <path d={pathD} fill="none" stroke={lineColor} strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" />
                      {points.map(function(p: any, i: number) {
                        return <circle key={i} cx={p.x} cy={p.y} r="0.8" fill={lineColor} />;
                      })}
                    </svg>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: textTer }}>
                      <span>{chartSales[0].date_sold}</span>
                      <span>{chartSales[chartSales.length - 1].date_sold}</span>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Recent Sales */}
            <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap" as const, gap: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Recent Sales</div>
                <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                  {["raw", "PSA 9", "PSA 10"].map(function(btn) {
                    var active = gradeView === btn;
                    return (
                      <button key={btn} onClick={function() { setGradeView(btn); }} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: active ? 600 : 400, background: active ? green : "transparent", color: active ? "#fff" : textSec, border: active ? "none" : "1px solid " + border, cursor: "pointer" }}>{btn === "raw" ? "Raw" : btn}</button>
                    );
                  })}
                  <select value={["raw", "PSA 9", "PSA 10"].includes(gradeView) ? "" : gradeView} onChange={function(e) { if (e.target.value) setGradeView(e.target.value); }} style={{ padding: "4px 8px", borderRadius: 6, fontSize: 11, background: !["raw", "PSA 9", "PSA 10"].includes(gradeView) ? green : (isDark ? "#1a1a20" : "#ffffff"), color: !["raw", "PSA 9", "PSA 10"].includes(gradeView) ? "#fff" : textSec, border: "1px solid " + border, cursor: "pointer", outline: "none" }}>
                    <option value="">Other Grades</option>
                    <optgroup label="PSA">
                      <option value="PSA 10">PSA 10</option>
                      <option value="PSA 9">PSA 9</option>
                      <option value="PSA 8">PSA 8</option>
                      <option value="PSA 7">PSA 7</option>
                      <option value="PSA 6">PSA 6</option>
                      <option value="PSA 5">PSA 5</option>
                      <option value="PSA 4">PSA 4</option>
                      <option value="PSA 3">PSA 3</option>
                      <option value="PSA 2">PSA 2</option>
                      <option value="PSA 1">PSA 1</option>
                    </optgroup>
                    <optgroup label="CGC">
                      <option value="CGC 10">CGC 10</option>
                      <option value="CGC 9.5">CGC 9.5</option>
                      <option value="CGC 9">CGC 9</option>
                      <option value="CGC 8.5">CGC 8.5</option>
                      <option value="CGC 8">CGC 8</option>
                      <option value="CGC 7.5">CGC 7.5</option>
                      <option value="CGC 7">CGC 7</option>
                      <option value="CGC 6.5">CGC 6.5</option>
                      <option value="CGC 6">CGC 6</option>
                    </optgroup>
                    <optgroup label="BGS">
                      <option value="BGS 9.5">BGS 9.5</option>
                      <option value="BGS 9">BGS 9</option>
                      <option value="BGS 8.5">BGS 8.5</option>
                      <option value="BGS 8">BGS 8</option>
                      <option value="BGS 7">BGS 7</option>
                    </optgroup>
                    <optgroup label="SGC">
                      <option value="SGC 10">SGC 10</option>
                      <option value="SGC 9.5">SGC 9.5</option>
                      <option value="SGC 9">SGC 9</option>
                      <option value="SGC 8">SGC 8</option>
                    </optgroup>
                  </select>
                </div>
              </div>
              {(function() {
                var filtered = allSales.filter(function(s: any) {
                  if (salesFilter === "raw") return s.grade === "raw";
                  return s.company && (s.company + " " + s.grade) === salesFilter;
                }).slice(0, 30);
                var filterLabel = salesFilter === "raw" ? "Ungraded" : salesFilter;
                if (allSales.length === 0) return (
                  <div style={{ textAlign: "center", padding: 24, color: textTer, fontSize: 13 }}>No sales data available yet</div>
                );
                if (filtered.length === 0) return (
                  <div style={{ textAlign: "center", padding: 24, color: textTer, fontSize: 13 }}>No {filterLabel} sales found for this card</div>
                );
                return (
                  <div>
                    <div style={{ fontSize: 11, color: textTer, marginBottom: 8 }}>Showing {filtered.length} most recent {filterLabel} sales</div>
                    <div style={{ overflowX: "auto" as const }}>
                      <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 12 }}>
                        <thead>
                          <tr style={{ borderBottom: "1px solid " + border }}>
                            <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 500, fontSize: 11 }}>Sale Price</th>
                            <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 500, fontSize: 11 }}>Grade</th>
                            <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 500, fontSize: 11 }}>Date Sold</th>
                            <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 500, fontSize: 11 }}>Listing</th>
                            <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 500, fontSize: 11 }}>Title</th>
                            <th style={{ textAlign: "right" as const, padding: "8px 6px", color: textTer, fontWeight: 500, fontSize: 11 }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(function(sale: any, idx: number) {
                            var listingUrl = sale.source === "ebay" ? "https://www.ebay.com/itm/" + sale.listing_id : "https://www.tcgplayer.com/product/" + sale.listing_id;
                            var gradeDisplay = sale.grade === "raw" ? "Ungraded" : (sale.company + " " + sale.grade);
                            return (
                              <tr key={sale.listing_id + "-" + idx} style={{ borderBottom: "1px solid " + border }}>
                                <td style={{ padding: "8px 6px", fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: greenText }}>${sale.price.toFixed(2)}</td>
                                <td style={{ padding: "8px 6px", color: textSec }}>{gradeDisplay}</td>
                                <td style={{ padding: "8px 6px", color: textSec }}>{sale.date_sold}</td>
                                <td style={{ padding: "8px 6px" }}><a href={listingUrl} target="_blank" rel="noopener noreferrer" style={{ color: isDark ? "#60a5fa" : "#2563eb", textDecoration: "none", fontSize: 11 }}>{sale.source === "ebay" ? "eBay" : "TCGPlayer"} #{sale.listing_id.slice(-6)}</a></td>
                                <td style={{ padding: "8px 6px", color: textSec, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis" as const, whiteSpace: "nowrap" as const }}>{sale.title}</td>
                                <td style={{ padding: "8px 6px", textAlign: "right" as const }}><a href={"mailto:support@gemcheck.io?subject=Report Sale " + sale.listing_id + "&body=Card: " + encodeURIComponent(card.name) + "%0ASale ID: " + sale.listing_id + "%0APrice: $" + sale.price + "%0AReason: "} style={{ color: isDark ? "#f87171" : "#b91c1c", textDecoration: "none", fontSize: 10, opacity: 0.6 }}>Report</a></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Attribution */}
            <div style={{ fontSize: 11, color: textTer, textAlign: "center" as const, marginBottom: 20 }}>Pricing data provided by <a href="https://www.pricecharting.com" target="_blank" rel="noopener noreferrer" style={{ color: textTer, textDecoration: "underline" }}>PriceCharting</a></div>
          </div>
        )}

        {viewMode === "population" && (
          <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Population Report</div>
              <div style={{ fontSize: 11, color: textTer }}>Total graded: {(psaTotal + cgcTotal).toLocaleString()}</div>
            </div>
            {(function() {
              var grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

              if (psaPop.length === 0 && cgcPop.length === 0) return (
                <div style={{ textAlign: "center", padding: 32, color: textTer, fontSize: 13 }}>No population data available yet</div>
              );

              function PopRow(props: { label: string; data: number[]; total: number; color: string }) {
                return (
                  <tr>
                    <td style={{ padding: "10px 12px", fontWeight: 600, fontSize: 12, color: props.color, whiteSpace: "nowrap" as const }}>{props.label}</td>
                    {grades.map(function(g, i) {
                      var count = props.data[i] || 0;
                      return <td key={g} style={{ textAlign: "center" as const, padding: "10px 6px", fontFamily: "JetBrains Mono, monospace", fontSize: 12, color: count > 0 ? text : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)") }}>{count > 0 ? count.toLocaleString() : "-"}</td>;
                    })}
                    <td style={{ textAlign: "center" as const, padding: "10px 8px", fontFamily: "JetBrains Mono, monospace", fontSize: 12, fontWeight: 700, color: text, borderLeft: "1px solid " + border }}>{props.total.toLocaleString()}</td>
                  </tr>
                );
              }

              return (
                <div>
                  <div style={{ overflowX: "auto" as const, borderRadius: 10, border: "1px solid " + border }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 12 }}>
                      <thead>
                        <tr style={{ background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}>
                          <th style={{ textAlign: "left" as const, padding: "10px 12px", color: textTer, fontWeight: 500, fontSize: 11, minWidth: 50 }}>Grader</th>
                          {grades.map(function(g) { return <th key={g} style={{ textAlign: "center" as const, padding: "10px 6px", color: textTer, fontWeight: 500, fontSize: 11, minWidth: 40 }}>{g}</th>; })}
                          <th style={{ textAlign: "center" as const, padding: "10px 8px", color: textSec, fontWeight: 600, fontSize: 11, borderLeft: "1px solid " + border }}>Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {psaPop.length > 0 && PopRow({ label: "PSA", data: psaPop, total: psaTotal, color: isDark ? "#60a5fa" : "#2563eb" })}
                        {psaPop.length > 0 && cgcPop.length > 0 && (
                          <tr><td colSpan={12} style={{ padding: 0 }}><div style={{ borderTop: "1px solid " + border }}></div></td></tr>
                        )}
                        {cgcPop.length > 0 && PopRow({ label: "CGC", data: cgcPop, total: cgcTotal, color: isDark ? "#f59e0b" : "#d97706" })}
                      </tbody>
                    </table>
                  </div>
                  <div style={{ display: "flex", gap: 20, marginTop: 14 }}>
                    {psaPop.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: isDark ? "#60a5fa" : "#2563eb" }}></div>
                        <span style={{ fontSize: 11, color: textSec }}>PSA: {psaTotal.toLocaleString()}</span>
                      </div>
                    )}
                    {cgcPop.length > 0 && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: isDark ? "#f59e0b" : "#d97706" }}></div>
                        <span style={{ fontSize: 11, color: textSec }}>CGC: {cgcTotal.toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        <div style={{ borderTop: "1px solid " + border, padding: "24px 0", marginTop: 20 }}>
          <div style={{ fontSize: 12, color: textTer }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
        </div>
      </div>
    </div>
  );
}

export default function CardPage() {
  return (
    <Suspense fallback={<div style={{ background: "#0c0c0f", color: "#ececf0", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <CardDetailContent />
    </Suspense>
  );
}
