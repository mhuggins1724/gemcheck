"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { supabase } from "../lib/supabase";
import { useTheme } from "../lib/useTheme";
import { getColors } from "../lib/design";

var gradients: Record<string, string> = { fire: "linear-gradient(145deg,#7c2d12,#1c1917)", water: "linear-gradient(145deg,#1e3a5f,#0f172a)", electric: "linear-gradient(145deg,#854d0e,#1c1917)", grass: "linear-gradient(145deg,#14532d,#0f172a)", psychic: "linear-gradient(145deg,#581c87,#0f172a)", dragon: "linear-gradient(145deg,#1e3a5f,#581c87)", normal: "linear-gradient(145deg,#44403c,#1c1917)" };

function CardDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  const { isDark, toggleTheme } = useTheme();
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"pricing" | "population">("pricing");
  const [gradeView, setGradeView] = useState("raw");
  const [chartHover, setChartHover] = useState<any>(null);
  const [chartRange, setChartRange] = useState("ALL");
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [reportModal, setReportModal] = useState<any>(null);
  const [reportReason, setReportReason] = useState("Not this card");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitting, setReportSubmitting] = useState(false);
  // Derived values for chart and sales filter
  var chartGrade = gradeView === "PSA 9" ? "psa9" : gradeView === "PSA 10" ? "psa10" : gradeView === "raw" ? "raw" : "other";
  var salesFilter = gradeView;

  useEffect(function() {
    // Load blocked listings from DB + localStorage
    var localBlocked = JSON.parse(localStorage.getItem("gemcheck-blocked-sales") || "[]");
    supabase.from("blocked_listings").select("listing_id").then(function(blRes) {
      var dbBlocked = (blRes.data || []).map(function(r: any) { return r.listing_id; });
      setBlockedIds(new Set([...localBlocked, ...dbBlocked]));
    });

    supabase.from("cards").select("id,name,set_name,set_code,year,card_type,rarity,gem_rate,raw_price,psa10_price,psa9_price,psa10_trend,psa9_trend,grading_fee,pop_10,pop_9,pop_8,pop_7,grade_score,price_history,image_url,tcg_product_id,market_price,low_price,mid_price,high_price,tcg_url,all_sales,psa_pop,cgc_pop,last_sales_refresh,price_chart_data,sales_history").eq("id", id).single().then(function(res) {
      if (res.data) setCard(res.data);
      setLoading(false);
    });
  }, [id]);

  var co = getColors(isDark);
  var bg = co.bg; var text = co.text; var textSec = co.textSecondary; var textTer = co.textTertiary;
  var cardBg = co.card; var border = co.border; var navBg = co.nav; var searchBgColor = co.surface;
  var tertBg = co.surface; var green = co.accent; var greenBg = co.accentBg; var greenText = co.accentText;
  var redText = co.red; var amberBg = co.amberBg; var amber = co.amber;
  var blueText = co.blue;

  if (loading) return <div style={{ background: bg, color: text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>Loading card data...</div>;
  if (!card) return <div style={{ background: bg, color: text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>Card not found</div>;

  // Filter sales by blocked + eBay only
  var allSales = (card.all_sales || []).filter(function(s: any) { return !blockedIds.has(s.listing_id); });

  function avgLast5(filterFn: (s: any) => boolean) {
    var filtered = allSales.filter(filterFn).slice(0, 5);
    if (filtered.length === 0) return null;
    var sum = filtered.reduce(function(a: number, s: any) { return a + s.price; }, 0);
    return Math.round(sum / filtered.length);
  }
  function lastSoldPrice(filterFn: (s: any) => boolean) {
    var filtered = allSales.filter(filterFn);
    return filtered.length > 0 ? Math.round(filtered[0].price) : null;
  }

  var rawAvg = avgLast5(function(s: any) { return s.grade === "raw"; });
  var psa9Avg = avgLast5(function(s: any) { return s.company === "PSA" && s.grade === "9"; });
  var psa10Avg = avgLast5(function(s: any) { return s.company === "PSA" && s.grade === "10"; });
  var rawLast = lastSoldPrice(function(s: any) { return s.grade === "raw"; });
  var psa9Last = lastSoldPrice(function(s: any) { return s.company === "PSA" && s.grade === "9"; });
  var psa10Last = lastSoldPrice(function(s: any) { return s.company === "PSA" && s.grade === "10"; });

  var effectiveRaw = rawAvg !== null ? rawAvg : card.raw_price;
  var effectivePsa9 = psa9Avg !== null ? psa9Avg : card.psa9_price;
  var effectivePsa10 = psa10Avg !== null ? psa10Avg : card.psa10_price;
  var ebayFeePct = 0.13;
  var netPsa10 = Math.round(effectivePsa10 * (1 - ebayFeePct));
  var netPsa9 = Math.round(effectivePsa9 * (1 - ebayFeePct));
  var ebayFee10 = Math.round(effectivePsa10 * ebayFeePct);
  var ebayFee9 = Math.round(effectivePsa9 * ebayFeePct);
  var profit10 = netPsa10 - effectiveRaw - card.grading_fee;
  var profit9 = netPsa9 - effectiveRaw - card.grading_fee;

  // Gem rate from population data
  var psaPop = card.psa_pop || [];
  var cgcPop = card.cgc_pop || [];
  var psaTotal = psaPop.reduce(function(a: number, b: number) { return a + b; }, 0);
  var cgcTotal = cgcPop.reduce(function(a: number, b: number) { return a + b; }, 0);
  var psaPop10 = psaPop.length >= 10 ? psaPop[9] : 0;
  var gemRate = psaTotal > 0 ? Math.round((psaPop10 / psaTotal) * 100) : card.gem_rate;

  // Report a sale
  function submitReport() {
    if (!reportModal) return;
    setReportSubmitting(true);
    // Save to DB
    supabase.from("sale_reports").insert({
      card_id: card.id,
      listing_id: reportModal.listing_id,
      reason: reportReason,
      details: reportDetails || null,
    }).then(function() {
      // Add to localStorage for instant hide
      var local = JSON.parse(localStorage.getItem("gemcheck-blocked-sales") || "[]");
      local.push(reportModal.listing_id);
      localStorage.setItem("gemcheck-blocked-sales", JSON.stringify(local));
      // Update state
      setBlockedIds(function(prev: Set<string>) { var next = new Set(prev); next.add(reportModal.listing_id); return next; });
      setReportModal(null);
      setReportReason("Not this card");
      setReportDetails("");
      setReportSubmitting(false);
    });
  }

  // Price history from sales for chart
  // Use sales_history (cumulative) for chart if available, otherwise all_sales
  var chartSalesSource = (card.sales_history && card.sales_history.length > 0 ? card.sales_history : (card.all_sales || [])).filter(function(s: any) { return !blockedIds.has(s.listing_id); });
  function getAllSalesForGrade(grade: string) {
    return chartSalesSource.filter(function(s: any) {
      if (grade === "raw") return s.grade === "raw";
      if (grade === "psa9") return s.company === "PSA" && s.grade === "9";
      if (grade === "psa10") return s.company === "PSA" && s.grade === "10";
      return false;
    }).reverse(); // oldest first for chart
  }

  return (
    <div style={{ background: bg, color: text, minHeight: "100vh", transition: "background 0.3s ease, color 0.3s ease" }}>
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, background: navBg, backdropFilter: "blur(20px)", borderBottom: "1px solid " + border }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="34" height="38" viewBox="0 0 52 60" fill="none"><defs><linearGradient id="ns3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6"/><stop offset="100%" stopColor="#7c3aed"/></linearGradient></defs><path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="url(#ns3)"/><path d="M16 30L23 37L36 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <a href="/" style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", textDecoration: "none", background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>GemCheck</a>
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
            <p style={{ fontSize: 13, fontWeight: 600, color: textSec, marginBottom: 16 }}>{card.set_name} &middot; {card.set_code} &middot; {card.year}</p>

            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, marginBottom: 16 }}>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" as const, background: "rgba(239,68,68,0.15)", color: "#f87171" }}>{card.card_type}</span>
              <span style={{ fontSize: 11, fontWeight: 600, padding: "4px 10px", borderRadius: 6, textTransform: "uppercase" as const, background: "rgba(139,92,246,0.15)", color: "#a78bfa" }}>{card.rarity}</span>
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
              <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? "#ffffff" : "#18181b", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 6 }}>Raw</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? "#e4e4e7" : "#27272a", marginBottom: 2 }}>Avg of last 5 sold</div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: blueText, marginBottom: 8 }}>{rawAvg !== null ? "$" + rawAvg.toLocaleString() : "$" + card.raw_price}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? "#e4e4e7" : "#27272a" }}>Last Sold</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: isDark ? "#e4e4e7" : "#27272a" }}>{rawLast !== null ? "$" + rawLast.toLocaleString() : "—"}</div>
              </div>
              <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? "#ffffff" : "#18181b", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 6 }}>PSA 9</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? "#e4e4e7" : "#27272a", marginBottom: 2 }}>Avg of last 5 sold</div>
                <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: blueText, marginBottom: 8 }}>{psa9Avg !== null ? "$" + psa9Avg.toLocaleString() : "$" + card.psa9_price}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? "#e4e4e7" : "#27272a" }}>Last Sold</div>
                <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: isDark ? "#e4e4e7" : "#27272a" }}>{psa9Last !== null ? "$" + psa9Last.toLocaleString() : "—"}</div>
              </div>
              <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 12, padding: 16, display: "flex", gap: 16 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: isDark ? "#ffffff" : "#18181b", textTransform: "uppercase" as const, letterSpacing: "1px", marginBottom: 6 }}>PSA 10</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? "#e4e4e7" : "#27272a", marginBottom: 2 }}>Avg of last 5 sold</div>
                  <div style={{ fontSize: 24, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: blueText, marginBottom: 8 }}>{psa10Avg !== null ? "$" + psa10Avg.toLocaleString() : "$" + card.psa10_price}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: isDark ? "#e4e4e7" : "#27272a" }}>Last Sold</div>
                  <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "JetBrains Mono, monospace", color: isDark ? "#e4e4e7" : "#27272a" }}>{psa10Last !== null ? "$" + psa10Last.toLocaleString() : "—"}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", padding: "8px 12px", borderRadius: 12, background: green, minWidth: 80 }}>
                  <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "JetBrains Mono, monospace", color: "#ffffff", lineHeight: 1 }}>{gemRate}%</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#ffffff", marginTop: 4, textTransform: "uppercase" as const, letterSpacing: "0.5px" }}>Gem Rate</div>
                </div>
              </div>
            </div>

            {/* Profit calculator */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
              <div style={{ padding: 14, borderRadius: 12, border: "1px solid " + border, position: "relative" as const, overflow: "hidden" }}>
                <div style={{ position: "absolute" as const, top: 0, left: 0, width: 3, height: "100%", background: green }}></div>
                <div style={{ fontSize: 12, fontWeight: 600, color: textSec, marginBottom: 4, paddingLeft: 8 }}>If PSA 10 ({gemRate}% chance)</div>
                <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: profit10 >= 0 ? greenText : redText, paddingLeft: 8 }}>{profit10 >= 0 ? "+" : ""}{profit10 < 0 ? "\u2212" : ""}${Math.abs(profit10).toLocaleString()}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: textTer, marginTop: 4, lineHeight: 1.6, paddingLeft: 8 }}>
                  ${effectivePsa10.toLocaleString()} avg sale<br/>
                  &minus; ${ebayFee10.toLocaleString()} eBay fee (13%)<br/>
                  &minus; ${effectiveRaw.toLocaleString()} avg raw cost<br/>
                  &minus; ${card.grading_fee} grading fee
                </div>
              </div>
              <div style={{ padding: 14, borderRadius: 12, border: "1px solid " + border, position: "relative" as const, overflow: "hidden" }}>
                <div style={{ position: "absolute" as const, top: 0, left: 0, width: 3, height: "100%", background: "#ef4444" }}></div>
                <div style={{ fontSize: 12, fontWeight: 600, color: textSec, marginBottom: 4, paddingLeft: 8 }}>If PSA 9 ({100 - gemRate}% chance)</div>
                <div style={{ fontSize: 22, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: profit9 >= 0 ? greenText : redText, paddingLeft: 8 }}>{profit9 >= 0 ? "+" : ""}{profit9 < 0 ? "\u2212" : ""}${Math.abs(profit9).toLocaleString()}</div>
                <div style={{ fontSize: 10, fontWeight: 600, color: textTer, marginTop: 4, lineHeight: 1.6, paddingLeft: 8 }}>
                  ${effectivePsa9.toLocaleString()} avg sale<br/>
                  &minus; ${ebayFee9.toLocaleString()} eBay fee (13%)<br/>
                  &minus; ${effectiveRaw.toLocaleString()} avg raw cost<br/>
                  &minus; ${card.grading_fee} grading fee
                </div>
              </div>
            </div>

            {/* Price history chart */}
            <div style={{ background: cardBg, border: "1px solid " + border, borderRadius: 14, padding: 20, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap" as const, gap: 8 }}>
                <div><div style={{ fontSize: 14, fontWeight: 600 }}>Price History</div><div style={{ fontSize: 10, fontWeight: 600, color: textTer }}>eBay sales data</div></div>
                <div style={{ display: "flex", gap: 4 }}>
                  {["raw", "PSA 9", "PSA 10"].map(function(g) {
                    var active = gradeView === g;
                    return (
                      <button key={g} onClick={function() { setGradeView(g); }} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 11, fontWeight: active ? 600 : 400, background: active ? green : "transparent", color: active ? "#fff" : textSec, border: active ? "none" : "1px solid " + border, cursor: "pointer" }}>{g === "raw" ? "Raw" : g}</button>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", gap: 3, marginBottom: 14 }}>
                {["1M", "6M", "1Y", "5Y", "ALL"].map(function(r) {
                  var active = chartRange === r;
                  return (
                    <button key={r} onClick={function() { setChartRange(r); setChartHover(null); }} style={{ padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: active ? 600 : 400, background: active ? (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)") : "transparent", color: active ? text : textTer, border: "none", cursor: "pointer" }}>{r}</button>
                  );
                })}
              </div>
              {(function() {
                // Determine date cutoff based on range
                var now = new Date();
                var cutoff = new Date("2000-01-01");
                if (chartRange === "1M") cutoff = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
                else if (chartRange === "6M") cutoff = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate());
                else if (chartRange === "1Y") cutoff = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
                else if (chartRange === "5Y") cutoff = new Date(now.getFullYear() - 5, now.getMonth(), now.getDate());
                var cutoffStr = cutoff.toISOString().slice(0, 10);

                var chartGradeKey = chartGrade === "psa9" ? "psa9" : chartGrade === "psa10" ? "psa10" : "raw";
                var chartPoints: any[] = [];
                var pcData = card.price_chart_data || {};
                var isAvgData = false;

                if (chartRange === "1M") {
                  // 1M: use individual sales only
                  var gradeSales = getAllSalesForGrade(chartGrade);
                  chartPoints = gradeSales.filter(function(s: any) {
                    var saleDate = s.date_sold || s.date || "";
                    return saleDate >= cutoffStr;
                  }).map(function(s: any) { return { date: s.date_sold || s.date, price: s.price, isAvg: false }; });
                } else if (pcData[chartGradeKey] && pcData[chartGradeKey].length > 0) {
                  // 6M+ with chart data: use monthly averages filtered by range
                  chartPoints = pcData[chartGradeKey].filter(function(p: any) { return p.date >= cutoffStr && p.price > 0; }).map(function(p: any) { return { date: p.date, price: p.price, isAvg: true }; });
                  isAvgData = true;
                } else {
                  // Fallback: use individual sales if no chart data
                  var gradeSales2 = getAllSalesForGrade(chartGrade);
                  chartPoints = gradeSales2.filter(function(s: any) {
                    var saleDate = s.date_sold || s.date || "";
                    return saleDate >= cutoffStr;
                  }).map(function(s: any) { return { date: s.date_sold || s.date, price: s.price, isAvg: false }; });
                }

                if (chartPoints.length < 2) return (
                  <div style={{ textAlign: "center", padding: 32, color: textTer, fontSize: 13 }}>Not enough data for this time range</div>
                );
                var chartPrices = chartPoints.map(function(s: any) { return s.price; });
                var minP = Math.min(...chartPrices);
                var maxP = Math.max(...chartPrices);
                var range = maxP - minP || 1;
                // Calculate nice round tick steps
                function niceStep(r: number) {
                  var rough = r / 4;
                  if (rough <= 0) return 1;
                  var mag = Math.pow(10, Math.floor(Math.log10(rough)));
                  var norm = rough / mag;
                  var s;
                  if (norm < 1.5) s = 1;
                  else if (norm < 3) s = 2;
                  else if (norm < 7) s = 5;
                  else s = 10;
                  return s * mag;
                }
                var step = niceStep(range);
                var niceMin = Math.floor(minP / step) * step;
                var niceMax = Math.ceil(maxP / step) * step;
                if (niceMin === niceMax) niceMax = niceMin + step;
                var padMinP = niceMin;
                var padMaxP = niceMax;
                var padRange = padMaxP - padMinP || 1;

                var chartW = 800;
                var chartH = 200;
                var marginLeft = 70;
                var marginRight = 70;
                var marginTop = 15;
                var marginBottom = 30;
                var plotW = chartW - marginLeft - marginRight;
                var plotH = chartH - marginTop - marginBottom;

                var points = chartPoints.map(function(s: any, i: number) {
                  var x = marginLeft + (i / (chartPoints.length - 1)) * plotW;
                  var y = marginTop + (1 - (s.price - padMinP) / padRange) * plotH;
                  return { x: x, y: y, price: s.price, date: s.date, isAvg: s.isAvg, index: i };
                });
                var lineColor = chartGrade === "raw" ? (isDark ? "#60a5fa" : "#1e40af") : chartGrade === "psa10" ? green : amber;
                var pathD = points.map(function(p: any, i: number) { return (i === 0 ? "M" : "L") + p.x + " " + p.y; }).join(" ");
                var areaD = pathD + " L" + points[points.length - 1].x + " " + (marginTop + plotH) + " L" + points[0].x + " " + (marginTop + plotH) + " Z";

                // Y-axis ticks at nice round values
                var yTicks: any[] = [];
                for (var tickVal = niceMin; tickVal <= niceMax; tickVal += step) {
                  var tickY = marginTop + (1 - (tickVal - niceMin) / padRange) * plotH;
                  yTicks.push({ y: tickY, label: "$" + Math.round(tickVal).toLocaleString() });
                }

                // X-axis labels — evenly spaced, max 5, no overlap
                var showYear = ["6M", "1Y", "5Y", "ALL"].includes(chartRange);
                var maxTicks = 5;
                var xTicks: any[] = [];
                if (chartPoints.length <= maxTicks) {
                  // Few points — show all
                  for (var xi2 = 0; xi2 < chartPoints.length; xi2++) {
                    var d = chartPoints[xi2].date || chartPoints[xi2].date_sold || "";
                    xTicks.push({ x: points[xi2].x, label: showYear ? d.slice(0, 7) : d.slice(5, 10) });
                  }
                } else {
                  // Spread evenly across the range
                  for (var ti = 0; ti < maxTicks; ti++) {
                    var idx = Math.round(ti * (chartPoints.length - 1) / (maxTicks - 1));
                    var d2 = chartPoints[idx].date || chartPoints[idx].date_sold || "";
                    xTicks.push({ x: points[idx].x, label: showYear ? d2.slice(0, 7) : d2.slice(5, 10) });
                  }
                }

                return (
                  <div style={{ position: "relative" as const }} onMouseLeave={function() { setChartHover(null); }}>
                    <svg viewBox={"0 0 " + chartW + " " + chartH} style={{ width: "100%", height: "auto" }}>
                      <defs>
                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={lineColor} stopOpacity="0.15" />
                          <stop offset="100%" stopColor={lineColor} stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      {/* Grid lines */}
                      {yTicks.map(function(t: any, i: number) {
                        return <line key={i} x1={marginLeft} y1={t.y} x2={chartW - marginRight} y2={t.y} stroke={isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"} strokeWidth="0.5" />;
                      })}
                      {/* Y-axis labels (left) */}
                      {yTicks.map(function(t: any, i: number) {
                        return <text key={"l" + i} x={marginLeft - 8} y={t.y + 3} textAnchor="end" fontSize="10" fill={isDark ? "#5c5c6a" : "#3a3a4e"} fontFamily="JetBrains Mono, monospace">{t.label}</text>;
                      })}
                      {/* Y-axis labels (right) */}
                      {yTicks.map(function(t: any, i: number) {
                        return <text key={"r" + i} x={chartW - marginRight + 8} y={t.y + 3} textAnchor="start" fontSize="10" fill={isDark ? "#5c5c6a" : "#3a3a4e"} fontFamily="JetBrains Mono, monospace">{t.label}</text>;
                      })}
                      {/* X-axis labels */}
                      {xTicks.map(function(t: any, i: number) {
                        return <text key={i} x={t.x} y={chartH - 5} textAnchor="middle" fontSize="9" fill={isDark ? "#5c5c6a" : "#3a3a4e"} fontFamily="JetBrains Mono, monospace">{t.label}</text>;
                      })}
                      {/* Area + line */}
                      <path d={areaD} fill="url(#chartFill)" />
                      <path d={pathD} fill="none" stroke={lineColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      {/* Data points + invisible hover targets */}
                      {points.map(function(p: any, i: number) {
                        var isHovered = chartHover && chartHover.index === i;
                        return (
                          <g key={i}>
                            <circle cx={p.x} cy={p.y} r={isHovered ? 5 : 3} fill={lineColor} stroke={isDark ? "#1a1a20" : "#ffffff"} strokeWidth={isHovered ? 2 : 1} />
                            <circle cx={p.x} cy={p.y} r="15" fill="transparent" onMouseEnter={function() { setChartHover(p); }} />
                          </g>
                        );
                      })}
                    </svg>
                    {/* Tooltip */}
                    {chartHover && (
                      <div style={{ position: "absolute" as const, left: (chartHover.x / chartW * 100) + "%", top: (chartHover.y / chartH * 100 - 18) + "%", transform: "translateX(-50%)", background: isDark ? "#2a2a32" : "#ffffff", border: "1px solid " + border, borderRadius: 8, padding: "6px 10px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)", pointerEvents: "none" as const, zIndex: 10, whiteSpace: "nowrap" as const }}>
                        <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "JetBrains Mono, monospace", color: lineColor }}>{chartHover.isAvg ? "Avg: " : ""}${chartHover.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                        <div style={{ fontSize: 10, color: textTer }}>{chartHover.isAvg ? chartHover.date.slice(0, 7) : chartHover.date}</div>
                        {chartHover.isAvg && <div style={{ fontSize: 9, color: textTer, fontStyle: "italic" as const }}>Monthly average</div>}
                      </div>
                    )}
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
                            <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 600, fontSize: 11 }}>Sale Price</th>
                            <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 600, fontSize: 11 }}>Grade</th>
                            <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 600, fontSize: 11 }}>Date Sold</th>
                            <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 600, fontSize: 11 }}>Source</th>
                            <th style={{ textAlign: "left" as const, padding: "8px 6px", color: textTer, fontWeight: 600, fontSize: 11 }}>Title</th>
                            <th style={{ textAlign: "right" as const, padding: "8px 6px", color: textTer, fontWeight: 600, fontSize: 11 }}></th>
                          </tr>
                        </thead>
                        <tbody>
                          {filtered.map(function(sale: any, idx: number) {
                            var gradeDisplay = sale.grade === "raw" ? "Ungraded" : (sale.company + " " + sale.grade);
                            var marketplace = sale.source === "ebay" ? "eBay" : "TCGPlayer";
                            return (
                              <tr key={sale.listing_id + "-" + idx} style={{ borderBottom: "1px solid " + border }}>
                                <td style={{ padding: "8px 6px", fontFamily: "JetBrains Mono, monospace", fontWeight: 600, color: greenText }}>${sale.price.toFixed(2)}</td>
                                <td style={{ padding: "8px 6px", color: textSec }}>{gradeDisplay}</td>
                                <td style={{ padding: "8px 6px", color: textSec }}>{sale.date_sold}</td>
                                <td style={{ padding: "8px 6px", fontSize: 11, color: textSec }}>{marketplace}</td>
                                <td style={{ padding: "8px 6px", color: textSec, maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis" as const, whiteSpace: "nowrap" as const }}>{sale.title}</td>
                                <td style={{ padding: "8px 6px", textAlign: "right" as const }}><button onClick={function() { setReportModal(sale); setReportReason("Not this card"); setReportDetails(""); }} style={{ color: isDark ? "#ef4444" : "#dc2626", background: "none", border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, padding: 0 }}>Report</button></td>
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
                          <th style={{ textAlign: "left" as const, padding: "10px 12px", color: textTer, fontWeight: 600, fontSize: 11, minWidth: 50 }}>Grader</th>
                          {grades.map(function(g) { return <th key={g} style={{ textAlign: "center" as const, padding: "10px 6px", color: textTer, fontWeight: 600, fontSize: 11, minWidth: 40 }}>{g}</th>; })}
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
          <div style={{ fontSize: 12, fontWeight: 600, background: "linear-gradient(135deg, #3b82f6, #7c3aed)", backgroundClip: "text", WebkitBackgroundClip: "text", color: "transparent", WebkitTextFillColor: "transparent" }}>&copy; 2026 GemCheck. Not affiliated with PSA or The Pok&eacute;mon Company.</div>
        </div>
      </div>

      {/* Report Modal */}
      {reportModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div onClick={function() { setReportModal(null); }} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}></div>
          <div style={{ position: "relative", background: cardBg, border: "1px solid " + border, borderRadius: 16, padding: 24, width: 420, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Report Incorrect Sale</div>
            <div style={{ fontSize: 12, color: textSec, marginBottom: 16 }}>This sale will be hidden from your view immediately and sent for review.</div>

            <div style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 12 }}>
              <div style={{ color: textTer, marginBottom: 4 }}>Sale being reported:</div>
              <div style={{ fontWeight: 600 }}>${reportModal.price.toFixed(2)} &middot; {reportModal.date_sold}</div>
              <div style={{ color: textSec, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis" as const, whiteSpace: "nowrap" as const }}>{reportModal.title}</div>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: textSec, display: "block", marginBottom: 4 }}>Reason</label>
              <select value={reportReason} onChange={function(e) { setReportReason(e.target.value); }} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, fontSize: 13, background: isDark ? "#1e1e24" : "#f5f5f7", color: text, border: "1px solid " + border, outline: "none" }}>
                <option>Not this card</option>
                <option>Sealed product</option>
                <option>Wrong grade</option>
                <option>Duplicate listing</option>
                <option>Reprint / different version</option>
                <option>Other</option>
              </select>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: textSec, display: "block", marginBottom: 4 }}>Details (optional)</label>
              <textarea value={reportDetails} onChange={function(e) { setReportDetails(e.target.value); }} placeholder="Any additional context..." rows={2} style={{ width: "100%", padding: "8px 10px", borderRadius: 8, fontSize: 13, background: isDark ? "#1e1e24" : "#f5f5f7", color: text, border: "1px solid " + border, outline: "none", resize: "vertical" as const, fontFamily: "DM Sans, sans-serif" }}></textarea>
            </div>

            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={function() { setReportModal(null); }} style={{ flex: 1, padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 500, background: "transparent", border: "1px solid " + border, color: textSec, cursor: "pointer" }}>Cancel</button>
              <button onClick={submitReport} disabled={reportSubmitting} style={{ flex: 1, padding: 10, borderRadius: 8, fontSize: 13, fontWeight: 600, background: isDark ? "#ef4444" : "#dc2626", color: "#fff", border: "none", cursor: "pointer", opacity: reportSubmitting ? 0.6 : 1 }}>{reportSubmitting ? "Submitting..." : "Report & Remove"}</button>
            </div>
          </div>
        </div>
      )}
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
