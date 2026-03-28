"use client";

export default function LogoPreview() {
  return (
    <div style={{ background: "#0c0c0f", color: "#ececf0", minHeight: "100vh", padding: "40px 24px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 40, textAlign: "center" }}>Logo Options — Pick Your Favorite</h1>

        {/* Option 1: Diamond + Text (current) */}
        <div style={{ background: "#1a1a20", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, color: "#5c5c6a", marginBottom: 20, textTransform: "uppercase", letterSpacing: "2px" }}>Option 1 — Diamond Gem</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="56" y2="56">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <path d="M28 4L52 24L28 52L4 24Z" fill="url(#g1)" />
              <path d="M28 4L52 24L28 28L4 24Z" fill="rgba(255,255,255,0.2)" />
              <path d="M28 4L4 24L28 28Z" fill="rgba(255,255,255,0.15)" />
              <path d="M28 4L52 24L28 52L4 24Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <path d="M4 24L28 28L52 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            </svg>
            <div>
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, background: "linear-gradient(135deg, #22c55e, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GEM CHECK</div>
              <div style={{ fontSize: 13, letterSpacing: "6px", textTransform: "uppercase", color: "#5c5c6a", marginTop: 2 }}>POKEMON CARD DATA</div>
            </div>
          </div>
        </div>

        {/* Option 2: Shield/Badge with checkmark */}
        <div style={{ background: "#1a1a20", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, color: "#5c5c6a", marginBottom: 20, textTransform: "uppercase", letterSpacing: "2px" }}>Option 2 — Shield Badge</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <svg width="52" height="60" viewBox="0 0 52 60" fill="none">
              <defs>
                <linearGradient id="g2" x1="0" y1="0" x2="52" y2="60">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#16a34a" />
                </linearGradient>
              </defs>
              {/* Shield shape */}
              <path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="url(#g2)" />
              <path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />
              {/* Checkmark */}
              <path d="M16 30L23 37L36 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              {/* Shine */}
              <path d="M26 2L50 14V20L26 8L2 20V14L26 2Z" fill="rgba(255,255,255,0.15)" />
            </svg>
            <div>
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, color: "#22c55e" }}>GEM<span style={{ color: "#ececf0" }}>CHECK</span></div>
              <div style={{ fontSize: 13, letterSpacing: "6px", textTransform: "uppercase", color: "#5c5c6a", marginTop: 2 }}>POKEMON CARD DATA</div>
            </div>
          </div>
        </div>

        {/* Option 3: Minimalist gem cut with stacked text */}
        <div style={{ background: "#1a1a20", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, color: "#5c5c6a", marginBottom: 20, textTransform: "uppercase", letterSpacing: "2px" }}>Option 3 — Hexagon Gem</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 18 }}>
            <svg width="54" height="58" viewBox="0 0 54 58" fill="none">
              <defs>
                <linearGradient id="g3a" x1="0" y1="0" x2="54" y2="58">
                  <stop offset="0%" stopColor="#22c55e" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
                <linearGradient id="g3b" x1="0" y1="0" x2="54" y2="30">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                </linearGradient>
              </defs>
              {/* Hexagon gem */}
              <path d="M27 2L50 16V42L27 56L4 42V16L27 2Z" fill="url(#g3a)" />
              <path d="M27 2L50 16L27 29L4 16Z" fill="url(#g3b)" />
              {/* G letter inside */}
              <text x="27" y="36" textAnchor="middle" fill="#fff" fontSize="26" fontWeight="800" fontFamily="DM Sans, sans-serif">G</text>
            </svg>
            <div>
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-1px", lineHeight: 1 }}>
                <span style={{ color: "#22c55e" }}>GEM</span> <span style={{ color: "#ececf0" }}>CHECK</span>
              </div>
              <div style={{ fontSize: 13, letterSpacing: "6px", textTransform: "uppercase", color: "#5c5c6a", marginTop: 4 }}>POKEMON CARD DATA</div>
            </div>
          </div>
        </div>

        {/* Option 4: Bold stacked with gem accent */}
        <div style={{ background: "#1a1a20", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, color: "#5c5c6a", marginBottom: 20, textTransform: "uppercase", letterSpacing: "2px" }}>Option 4 — Stacked Bold</div>
          <div style={{ display: "inline-block", textAlign: "left" }}>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-3px", lineHeight: 0.9, background: "linear-gradient(180deg, #22c55e, #059669)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GEM</div>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-3px", lineHeight: 0.9, color: "#ececf0" }}>CHECK</div>
            <div style={{ width: "100%", height: 3, background: "linear-gradient(90deg, #22c55e, #3b82f6)", borderRadius: 2, marginTop: 6 }}></div>
            <div style={{ fontSize: 11, letterSpacing: "4px", textTransform: "uppercase", color: "#5c5c6a", marginTop: 6 }}>POKEMON CARD DATA</div>
          </div>
        </div>

        {/* Option 5: Circular gem with modern text */}
        <div style={{ background: "#1a1a20", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, color: "#5c5c6a", marginBottom: 20, textTransform: "uppercase", letterSpacing: "2px" }}>Option 5 — Circle Badge</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: "linear-gradient(135deg, #22c55e, #059669)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 20px rgba(34,197,94,0.3)" }}>
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L26 12L14 26L2 12Z" fill="rgba(255,255,255,0.9)" />
                <path d="M14 2L26 12L14 14L2 12Z" fill="rgba(255,255,255,1)" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1 }}>
                <span style={{ color: "#ececf0" }}>GEM</span><span style={{ color: "#22c55e" }}>CHECK</span>
              </div>
              <div style={{ fontSize: 12, letterSpacing: "5px", textTransform: "uppercase", color: "#5c5c6a", marginTop: 2 }}>POKEMON CARD DATA</div>
            </div>
          </div>
        </div>

        {/* Option 6: Gold/Premium */}
        <div style={{ background: "#1a1a20", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, color: "#5c5c6a", marginBottom: 20, textTransform: "uppercase", letterSpacing: "2px" }}>Option 6 — Gold Premium</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16 }}>
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
              <defs>
                <linearGradient id="g6" x1="0" y1="0" x2="52" y2="52">
                  <stop offset="0%" stopColor="#f59e0b" />
                  <stop offset="50%" stopColor="#eab308" />
                  <stop offset="100%" stopColor="#d97706" />
                </linearGradient>
              </defs>
              <path d="M26 2L48 18L40 50H12L4 18Z" fill="url(#g6)" />
              <path d="M26 2L48 18L26 22L4 18Z" fill="rgba(255,255,255,0.25)" />
              <path d="M12 50L26 22L40 50Z" fill="rgba(0,0,0,0.1)" />
              <path d="M26 2L48 18L40 50H12L4 18Z" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
              <path d="M4 18L26 22L48 18" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" />
              <path d="M12 50L26 22L40 50" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
            </svg>
            <div>
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, background: "linear-gradient(135deg, #f59e0b, #eab308, #d97706)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GEM CHECK</div>
              <div style={{ fontSize: 13, letterSpacing: "6px", textTransform: "uppercase", color: "#5c5c6a", marginTop: 2 }}>POKEMON CARD DATA</div>
            </div>
          </div>
        </div>

        {/* Option 7: Electric Blue/Cyan */}
        <div style={{ background: "#1a1a20", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, color: "#5c5c6a", marginBottom: 20, textTransform: "uppercase", letterSpacing: "2px" }}>Option 7 — Electric Blue</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 14 }}>
            <div style={{ width: 54, height: 54, borderRadius: 12, background: "linear-gradient(135deg, #06b6d4, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 24px rgba(6,182,212,0.3)" }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M15 2L28 12L15 28L2 12Z" fill="white" opacity="0.95" />
                <path d="M15 2L28 12L15 15L2 12Z" fill="white" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 48, fontWeight: 800, letterSpacing: "-2px", lineHeight: 1, background: "linear-gradient(135deg, #06b6d4, #3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GEM CHECK</div>
              <div style={{ fontSize: 13, letterSpacing: "6px", textTransform: "uppercase", color: "#5c5c6a", marginTop: 2 }}>POKEMON CARD DATA</div>
            </div>
          </div>
        </div>

        {/* Option 8: Red/Fire */}
        <div style={{ background: "#1a1a20", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, color: "#5c5c6a", marginBottom: 20, textTransform: "uppercase", letterSpacing: "2px" }}>Option 8 — Fire Red</div>
          <div style={{ display: "inline-block" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <defs>
                  <linearGradient id="g8" x1="0" y1="0" x2="44" y2="44">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
                <path d="M22 2L42 18L22 42L2 18Z" fill="url(#g8)" />
                <path d="M22 2L42 18L22 22L2 18Z" fill="rgba(255,255,255,0.2)" />
              </svg>
              <div style={{ fontSize: 44, fontWeight: 900, letterSpacing: "-2px", lineHeight: 1 }}>
                <span style={{ background: "linear-gradient(135deg, #ef4444, #f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GEM</span>
                <span style={{ color: "#ececf0" }}>CHECK</span>
              </div>
            </div>
            <div style={{ fontSize: 12, letterSpacing: "8px", textTransform: "uppercase", color: "#5c5c6a", marginTop: 6, textAlign: "center" }}>POKEMON CARD DATA</div>
          </div>
        </div>

        {/* Option 9: Sleek minimal with line accent */}
        <div style={{ background: "#1a1a20", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 12, color: "#5c5c6a", marginBottom: 20, textTransform: "uppercase", letterSpacing: "2px" }}>Option 9 — Minimal Line</div>
          <div style={{ display: "inline-block" }}>
            <div style={{ fontSize: 52, fontWeight: 300, letterSpacing: "8px", lineHeight: 1, color: "#ececf0", textTransform: "uppercase" }}>GEM<span style={{ fontWeight: 800 }}>CHECK</span></div>
            <div style={{ width: "100%", height: 2, background: "linear-gradient(90deg, transparent, #22c55e, #3b82f6, #8b5cf6, transparent)", marginTop: 8 }}></div>
            <div style={{ fontSize: 11, letterSpacing: "8px", textTransform: "uppercase", color: "#5c5c6a", marginTop: 8 }}>POKEMON CARD DATA</div>
          </div>
        </div>

        {/* Option 10: Neon glow */}
        <div style={{ background: "#0c0c0f", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ fontSize: 12, color: "#5c5c6a", marginBottom: 20, textTransform: "uppercase", letterSpacing: "2px" }}>Option 10 — Neon Glow</div>
          <div style={{ display: "inline-block", position: "relative" as const }}>
            <div style={{ position: "absolute" as const, top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, height: 100, background: "radial-gradient(ellipse, rgba(139,92,246,0.15) 0%, transparent 70%)", pointerEvents: "none" as const }}></div>
            <div style={{ fontSize: 56, fontWeight: 900, letterSpacing: "-1px", lineHeight: 1, color: "#a78bfa", textShadow: "0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(139,92,246,0.2)", position: "relative" as const }}>GEM CHECK</div>
            <div style={{ fontSize: 12, letterSpacing: "8px", textTransform: "uppercase", color: "#7c3aed", marginTop: 8, position: "relative" as const }}>POKEMON CARD DATA</div>
          </div>
        </div>

        {/* Light mode versions */}
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20, marginTop: 40, textAlign: "center" }}>Light Mode Preview</h2>

        <div style={{ background: "#f8f8fa", borderRadius: 16, padding: 48, marginBottom: 32, textAlign: "center", border: "1px solid rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", gap: 60, justifyContent: "center", flexWrap: "wrap" as const }}>
            {/* Option 1 light */}
            <div>
              <div style={{ fontSize: 10, color: "#999", marginBottom: 12 }}>Option 1</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="36" height="36" viewBox="0 0 56 56" fill="none">
                  <path d="M28 4L52 24L28 52L4 24Z" fill="url(#g1)" />
                  <path d="M28 4L52 24L28 28L4 24Z" fill="rgba(255,255,255,0.2)" />
                </svg>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", background: "linear-gradient(135deg, #22c55e, #3b82f6, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>GEM CHECK</div>
              </div>
            </div>
            {/* Option 2 light */}
            <div>
              <div style={{ fontSize: 10, color: "#999", marginBottom: 12 }}>Option 2</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <svg width="32" height="38" viewBox="0 0 52 60" fill="none">
                  <path d="M26 2L50 14V34C50 46 38 54 26 58C14 54 2 46 2 34V14L26 2Z" fill="url(#g2)" />
                  <path d="M16 30L23 37L36 22" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-1px", color: "#16a34a" }}>GEM<span style={{ color: "#1a1a2e" }}>CHECK</span></div>
              </div>
            </div>
            {/* Option 4 light */}
            <div>
              <div style={{ fontSize: 10, color: "#999", marginBottom: 12 }}>Option 4</div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 0.9, color: "#16a34a" }}>GEM</div>
                <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 0.9, color: "#1a1a2e" }}>CHECK</div>
                <div style={{ width: "100%", height: 2, background: "linear-gradient(90deg, #16a34a, #2563eb)", borderRadius: 2, marginTop: 4 }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
