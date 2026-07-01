"use client";

import { useEffect, useState } from "react";
import { CircularGallery } from "./CircularGallery";
import { DotField } from "./DotField";

const TESTIMONIALS = [
  {
    quote: "Deliveries always on time. Expedited Transport never lets us down — our supply chain depends on them.",
    name: "Nora Elkind", company: "Tri-State Parts", bg: "#0d1f14",
  },
  {
    quote: "We moved our entire Connecticut distribution through them. Flawless execution every single time.",
    name: "Amira Benali", company: "Paloma CT", bg: "#111827",
  },
  {
    quote: "Our perishables reach customers fresh because these drivers understand what urgency actually means.",
    name: "Priya Sharma", company: "NE Supply Co.", bg: "#1f1108",
  },
  {
    quote: "Best freight partner we've had in 15 years of retail operations. Wouldn't consider switching.",
    name: "Leo Hartmann", company: "Tynker Retail", bg: "#0b1528",
  },
  {
    quote: "Real-time tracking and zero damage claims across three years of heavy shipping partnership.",
    name: "Suki Tanaka", company: "CT Foods Co.", bg: "#180b28",
  },
  {
    quote: "They handle our most time-critical shipments with an impressive reliability record.",
    name: "James Wilson", company: "Skybreak Logistics", bg: "#102010",
  },
];

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function makeCard(quote: string, name: string, company: string, bg: string): string {
  const W = 800, H = 1100;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  const grad = ctx.createLinearGradient(0, 0, W, H);
  grad.addColorStop(0, "rgba(182,240,0,0.07)");
  grad.addColorStop(1, "rgba(0,0,0,0.35)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = "#b6f000";
  ctx.font = "bold 160px Georgia, serif";
  ctx.textBaseline = "top";
  ctx.fillText("“", 52, 30);

  const MARGIN = 64, LINE_H = 60, MAX_W = W - MARGIN * 2;
  ctx.fillStyle = "#f0f0f0";
  ctx.font = "400 38px Helvetica, Arial, sans-serif";
  ctx.textBaseline = "top";
  const lines = wrapText(ctx, quote, MAX_W);
  let y = 250;
  for (const ln of lines) { ctx.fillText(ln, MARGIN, y); y += LINE_H; }

  y += 68;
  ctx.strokeStyle = "#b6f000";
  ctx.lineWidth = 2.5;
  ctx.beginPath(); ctx.moveTo(MARGIN, y); ctx.lineTo(MARGIN + 72, y); ctx.stroke();

  y += 48;
  ctx.fillStyle = "#b6f000";
  ctx.font = "bold 34px Helvetica, Arial, sans-serif";
  ctx.fillText(name, MARGIN, y);

  y += 52;
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.font = "400 28px Helvetica, Arial, sans-serif";
  ctx.fillText(company, MARGIN, y);

  return canvas.toDataURL("image/png");
}

export function TestimonialsSection() {
  const [items, setItems] = useState<{ image: string; text: string }[] | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setItems(
        TESTIMONIALS.map(t => ({
          image: makeCard(t.quote, t.name, t.company, t.bg),
          text: `${t.name} — ${t.company}`,
        }))
      );
    }, 0);
    return () => clearTimeout(id);
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
        {/* Header */}
        <div style={{ textAlign: "center", padding: "3rem 1.5rem 1.5rem", flexShrink: 0 }}>
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

        {/* Gallery — flex:1 with minHeight:0 so percentage height resolves correctly */}
        <div style={{ flex: 1, position: "relative", minHeight: 0 }}>
          {items && (
            <CircularGallery
              items={items}
              bend={3}
              textColor="#b6f000"
              borderRadius={0.04}
              scrollEase={0.05}
              font="bold 22px Inter"
              scrollSpeed={2}
            />
          )}
        </div>
      </div>
    </section>
  );
}
