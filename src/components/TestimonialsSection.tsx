"use client";

import { BorderGlow } from "./BorderGlow";
import { DotField } from "./DotField";

const TESTIMONIALS = [
  {
    quote: "ETS replaced three carriers for us. Hotshot, LTL, warehousing — all handled from a single call.",
    name: "Nora Elkind",
    role: "Head of Operations, Tri-State Parts",
    initials: "NE",
    bg: "#ecebe6",
    avatarBg: "#8c7f6e",
  },
  {
    quote: "I coordinate our entire CT freight through ETS. From New Haven to Hartford, they never miss.",
    name: "Amira Benali",
    role: "Logistics Director, Paloma CT",
    initials: "AB",
    bg: "#e07254",
    avatarBg: "#6b3022",
  },
  {
    quote: "Our first hotshot load moved the same day we called. Onboarding took one afternoon.",
    name: "Priya Sharma",
    role: "VP Operations, NE Supply Co.",
    initials: "PS",
    bg: "#7cc2b6",
    avatarBg: "#2b6860",
  },
  {
    quote: "Clear rates, fast callbacks, no excuses. Finally a carrier that actually respects a deadline.",
    name: "Leo Hartmann",
    role: "Founder, Tynker Retail",
    initials: "LH",
    bg: "#c2aed8",
    avatarBg: "#5b4882",
  },
  {
    quote: "Moved all our dry van runs to ETS last year. On-time rate jumped. Haven't looked back once.",
    name: "Suki Tanaka",
    role: "Supply Chain Lead, CT Foods Co.",
    initials: "ST",
    bg: "#e8a275",
    avatarBg: "#824030",
  },
  {
    quote: "The only carrier our warehouse needs. Expedited, LTL, freight brokerage — all covered perfectly.",
    name: "James Wilson",
    role: "COO, Skybreak Logistics",
    initials: "JW",
    bg: "#f5d878",
    avatarBg: "#806022",
  },
];

/* resting fan: rotation + Y offset for each card */
const RESTING = [
  { rotate: -15, y: 26, z: 1 },
  { rotate: -9,  y: 11, z: 2 },
  { rotate: -3,  y: 2,  z: 3 },
  { rotate:  3,  y: 5,  z: 4 },
  { rotate:  8,  y: 15, z: 3 },
  { rotate: 14,  y: 26, z: 2 },
];

export function TestimonialsSection() {
  return (
    <section style={{
      position: "relative",
      minHeight: "100svh",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "5rem 0 6rem",
      overflow: "hidden",
    }}>
      {/* ── Dot-grid background — parent must be positioned with explicit size ── */}
      <div style={{ position: "absolute", inset: 0 }}>
        <DotField
          dotRadius={1.8}
          dotSpacing={18}
          bulgeStrength={60}
          glowRadius={0}
          gradientFrom="#9a9a9a"
          gradientTo="#b8b8b8"
          glowColor="#ffffff"
        />
      </div>

      {/* ── Content (above DotField) ── */}
      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Section header */}
        <div style={{ textAlign: "center", marginBottom: "5rem", padding: "0 1.5rem" }}>
          <p style={{
            fontFamily: "var(--font-primary, 'Inter', sans-serif)",
            fontSize: "0.65rem", fontWeight: 700,
            letterSpacing: "0.26em", textTransform: "uppercase",
            color: "rgba(0,0,0,0.38)", marginBottom: "0.85rem",
          }}>
            What clients say
          </p>
          <h2 style={{
            fontFamily: "var(--font-primary, 'Inter', sans-serif)",
            fontSize: "clamp(1.9rem, 3.2vw, 2.75rem)",
            fontWeight: 750, color: "#1a1814",
            letterSpacing: "-0.038em", lineHeight: 1.08,
          }}>
            Trusted by businesses<br />across Connecticut
          </h2>
        </div>

        {/* Fan stage — allow overflow so glow halos aren't clipped */}
        <div style={{ width: "100%", overflow: "visible" }}>
          <div style={{
            position: "relative",
            width: "980px",
            height: "500px",
            margin: "0 auto",
            overflow: "visible",
          }}>
            {TESTIMONIALS.map((t, idx) => {
              const r = RESTING[idx];
              return (
                <div
                  key={idx}
                  className="tes-card"
                  style={{
                    position: "absolute",
                    left: `${20 + idx * 138}px`,
                    top: "60px",
                    width: "252px",
                    height: "378px",
                    zIndex: r.z,
                    transform: `rotate(${r.rotate}deg) translateY(${r.y}px)`,
                  }}
                >
                  <BorderGlow
                    backgroundColor={t.bg}
                    glowColor="76 100 47"
                    colors={["#b6f000", "#cbff1a", "#d4ff4d"]}
                    borderRadius={22}
                    glowRadius={32}
                    glowIntensity={1.4}
                    edgeSensitivity={22}
                    coneSpread={28}
                    fillOpacity={0.35}
                  >
                    {/* Quote */}
                    <p style={{
                      flex: 1,
                      fontFamily: "var(--font-primary, 'Inter', sans-serif)",
                      fontSize: "1.08rem",
                      fontWeight: 700,
                      lineHeight: 1.46,
                      color: "#1c1a17",
                      letterSpacing: "-0.013em",
                      padding: "30px 26px 0",
                    }}>
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    {/* Author */}
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "18px 26px 24px",
                      borderTop: "1px solid rgba(0,0,0,0.09)",
                      marginTop: "auto",
                    }}>
                      <div style={{
                        width: "40px", height: "40px",
                        borderRadius: "50%", flexShrink: 0,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "0.68rem", fontWeight: 800,
                        letterSpacing: "0.04em",
                        color: "rgba(255,255,255,0.88)",
                        background: t.avatarBg,
                      }}>
                        {t.initials}
                      </div>
                      <div>
                        <div style={{
                          fontFamily: "var(--font-primary, 'Inter', sans-serif)",
                          fontSize: "0.78rem", fontWeight: 700,
                          color: "#1a1814", lineHeight: 1.2,
                        }}>
                          {t.name}
                        </div>
                        <div style={{
                          fontFamily: "var(--font-primary, 'Inter', sans-serif)",
                          fontSize: "0.68rem",
                          color: "rgba(0,0,0,0.46)",
                          lineHeight: 1.35, marginTop: "1px",
                        }}>
                          {t.role}
                        </div>
                      </div>
                    </div>
                  </BorderGlow>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .tes-card {
          filter: grayscale(1) brightness(0.88);
          transition:
            filter 0.38s ease,
            transform 0.44s cubic-bezier(0.34, 1.4, 0.64, 1);
          will-change: transform, filter;
        }
        .tes-card:hover {
          filter: grayscale(0) brightness(1) !important;
          transform: translateY(-50px) rotate(0deg) scale(1.045) !important;
          z-index: 30 !important;
        }
        @media (prefers-reduced-motion: reduce) {
          .tes-card { transition: none; }
        }
      `}</style>
    </section>
  );
}
