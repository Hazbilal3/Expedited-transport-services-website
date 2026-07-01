"use client";

import { useEffect, useRef } from "react";
import PixelTransition from "./PixelTransition";
import { DotField } from "./DotField";

const CARD_W = 310;        // card width in px
const ASPECT = "148%";     // height = 310 * 1.48 ≈ 459 px  (portrait)
const GAP = 22;            // gap between cards
const SPEED = 0.55;        // px per rAF frame ≈ 33px/s

const TESTIMONIALS = [
  {
    quote: "Deliveries always on time. Expedited Transport never lets us down — our entire supply chain depends on them.",
    name: "Nora Elkind",
    company: "Tri-State Parts",
    bg: "#0d1f14",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "We moved our entire Connecticut distribution through them. Flawless execution every single time.",
    name: "Amira Benali",
    company: "Paloma CT",
    bg: "#111827",
    photo: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    quote: "Our perishables reach customers fresh because these drivers understand what urgency actually means.",
    name: "Priya Sharma",
    company: "NE Supply Co.",
    bg: "#1f1108",
    photo: "https://randomuser.me/api/portraits/women/21.jpg",
  },
  {
    quote: "Best freight partner we've had in 15 years of retail operations. Wouldn't consider switching.",
    name: "Leo Hartmann",
    company: "Tynker Retail",
    bg: "#0b1528",
    photo: "https://randomuser.me/api/portraits/men/46.jpg",
  },
  {
    quote: "Real-time tracking and zero damage claims across three years of heavy shipping partnership.",
    name: "Suki Tanaka",
    company: "CT Foods Co.",
    bg: "#180b28",
    photo: "https://randomuser.me/api/portraits/women/9.jpg",
  },
  {
    quote: "They handle our most time-critical shipments with an impressive reliability record.",
    name: "James Wilson",
    company: "Skybreak Logistics",
    bg: "#102010",
    photo: "https://randomuser.me/api/portraits/men/77.jpg",
  },
];

function TestimonialBack({
  quote, name, company, bg,
}: { quote: string; name: string; company: string; bg: string }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      background: bg,
      display: "flex", flexDirection: "column", justifyContent: "center",
      padding: "1.75rem 1.5rem",
      boxSizing: "border-box",
    }}>
      <span style={{
        color: "#b6f000",
        fontSize: "3.5rem",
        fontFamily: "Georgia, serif",
        lineHeight: 0.7,
        display: "block",
      }}>&ldquo;</span>

      <p style={{
        color: "#f0f0f0",
        fontSize: "0.93rem",
        lineHeight: 1.62,
        marginTop: "0.85rem",
        fontFamily: "var(--font-primary, 'Inter', sans-serif)",
        fontWeight: 400,
        margin: "0.85rem 0 0",
      }}>
        {quote}
      </p>

      <div style={{ marginTop: "1.6rem" }}>
        <div style={{ width: 44, height: 2, background: "#b6f000", marginBottom: "0.9rem" }} />
        <p style={{
          color: "#b6f000",
          fontWeight: 700,
          fontSize: "0.9rem",
          fontFamily: "var(--font-primary, 'Inter', sans-serif)",
          margin: 0,
        }}>{name}</p>
        <p style={{
          color: "rgba(255,255,255,0.46)",
          fontSize: "0.78rem",
          fontFamily: "var(--font-primary, 'Inter', sans-serif)",
          margin: "0.28rem 0 0",
        }}>{company}</p>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  const rowRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const setWidth = TESTIMONIALS.length * (CARD_W + GAP);

    function tick() {
      if (!isPausedRef.current) {
        posRef.current += SPEED;
        if (posRef.current >= setWidth) posRef.current -= setWidth;
        row!.style.transform = `translateX(-${posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <section style={{
      position: "relative",
      height: "100svh",
      background: "#fff",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    }}>
      {/* Dot-grid background */}
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

      {/* Content */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexDirection: "column",
        height: "100%",
      }}>
        {/* Section heading */}
        <div style={{ textAlign: "center", padding: "3rem 1.5rem 2rem", flexShrink: 0 }}>
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
            margin: 0,
          }}>
            Trusted by businesses<br />across Connecticut
          </h2>
        </div>

        {/* Marquee gallery */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", overflow: "hidden" }}>
          <div
            ref={rowRef}
            style={{
              display: "flex",
              gap: GAP,
              willChange: "transform",
              paddingLeft: GAP,
            }}
          >
            {/* Duplicate set for seamless infinite loop */}
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                style={{ flexShrink: 0 }}
                onMouseEnter={() => { isPausedRef.current = true; }}
                onMouseLeave={() => { isPausedRef.current = false; }}
              >
                <PixelTransition
                  firstContent={
                    <img
                      src={t.photo}
                      alt={t.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
                    />
                  }
                  secondContent={
                    <TestimonialBack
                      quote={t.quote}
                      name={t.name}
                      company={t.company}
                      bg={t.bg}
                    />
                  }
                  gridSize={8}
                  pixelColor="#b6f000"
                  once={false}
                  animationStepDuration={0.4}
                  style={{ width: CARD_W }}
                  aspectRatio={ASPECT}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
