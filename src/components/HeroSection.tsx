"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Config                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const FRAME_COUNT = 240;

/** Pad number to 5 digits: 0 → "00000" */
const pad = (n: number) => String(n).padStart(5, "0");

/** Public path to a frame (0-indexed) */
const frameSrc = (i: number) => `/frames/frame_${pad(i)}.jpg`;

const TITLES = [
  "Work with a Top Trucking Company",
  "Hotshot, LTL & Dry Van specialists",
  "Serving West Hartford, New Haven & Stamford",
  "Trusted since 2014.",
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Image Preloader Hook                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
function useFrames() {
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);

  useEffect(() => {
    const imgs: HTMLImageElement[] = [];
    let count = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = frameSrc(i);
      img.onload = img.onerror = () => {
        count++;
        setLoadedCount(count);
        if (count === FRAME_COUNT) setLoaded(true);
      };
      imgs.push(img);
    }

    imagesRef.current = imgs;
  }, []);

  return { imagesRef, loaded, loadedCount };
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Canvas Renderer Hook                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
function useCanvasRenderer(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  imagesRef: React.RefObject<HTMLImageElement[]>,
  frameIndex: number,
  loaded: boolean
) {
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const images = imagesRef.current;
    if (!canvas || !images.length || !loaded) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Enable best possible image quality
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const img = images[frameIndex];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    // "cover" fit — image always fills the full viewport, no black bars
    const scale = Math.max(cw / iw, ch / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }, [canvasRef, imagesRef, frameIndex, loaded]);

  useEffect(() => {
    draw();
  }, [draw]);
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main Hero Component                                                        */
/* ─────────────────────────────────────────────────────────────────────────── */
export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeTitleIdx, setActiveTitleIdx] = useState(0);
  const [revealedChars, setRevealedChars] = useState(0);

  const { imagesRef, loaded, loadedCount } = useFrames();

  // Map progress [0,1] → frame index [0, FRAME_COUNT-1]
  // Use round so the last frame is reachable before hitting absolute scroll bottom
  const frameIndex = Math.min(
    FRAME_COUNT - 1,
    Math.max(0, Math.round(scrollProgress * (FRAME_COUNT - 1)))
  );

  // Draw frame on canvas
  useCanvasRenderer(canvasRef, imagesRef, frameIndex, loaded);

  // Sync canvas size to element size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const sync = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = rect.height * (window.devicePixelRatio || 1);
    };

    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  // Scroll listener
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, -top / (height - vh)));
      setScrollProgress(progress);

      const segSize = 1 / TITLES.length;
      const idx = Math.min(TITLES.length - 1, Math.floor(progress / segSize));
      const segProgress = (progress - idx * segSize) / segSize;

      setActiveTitleIdx(idx);

      if (progress < 0.01) {
        setRevealedChars(0);
      } else {
        const chars = TITLES[idx].length;
        setRevealedChars(Math.min(chars, Math.floor(segProgress * chars * 1.5)));
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const duskOpacity = Math.max(0, 1 - scrollProgress / 0.25);

  return (
    <section ref={sectionRef} style={{ position: "relative", height: "350svh" }}>

      {/* ── Sticky viewport ── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100svh",
          overflow: "hidden",
          backgroundColor: "#000",
        }}
      >
        {/* ── Canvas (frame sequence) ── */}
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            zIndex: 0,
            display: "block",
          }}
        />

        {/* ── Gradient overlays ── */}

        {/* Dusk warm overlay — fades out as you scroll */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 120% 60% at 70% 45%, rgba(200,114,42,0.35) 0%, rgba(154,79,26,0.22) 25%, transparent 60%)",
            zIndex: 1,
            pointerEvents: "none",
            opacity: duskOpacity,
            transition: "opacity 0.6s ease",
          }}
        />

        {/* Top fade */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "15%",
            background: "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* Bottom fade */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "40%",
            background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* ── Title sequence ── */}
        {TITLES.map((title, idx) => {
          const isActive = idx === activeTitleIdx;
          return (
            <h2
              key={idx}
              aria-hidden={!isActive}
              style={{
                position: "absolute",
                bottom: "clamp(3.75rem, 8.4375vw, 8.4375rem)",
                left: "50%",
                transform: "translateX(-50%)",
                width: "min(90vw, 62.5vw)",
                maxWidth: "1000px",
                color: "#fff",
                textAlign: "center",
                fontSize: "clamp(1.75rem, 5.729vw, 5.5rem)",
                fontFamily: "var(--font-primary, 'Inter', sans-serif)",
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                margin: 0,
                opacity: isActive ? 1 : 0,
                transition: "opacity 0.25s ease",
                zIndex: 3,
                pointerEvents: "none",
              }}
            >
              {title.split("").map((char, ci) => {
                const revealed = isActive && ci < revealedChars;
                const isFlash = isActive && ci === revealedChars - 1;
                return (
                  <span
                    key={ci}
                    style={{
                      opacity: revealed ? 1 : 0,
                      transition: `opacity 0.09s ease ${ci * 0.012}s`,
                      display: "inline",
                      willChange: "opacity",
                      color: isFlash ? "#abff02" : "inherit",
                    }}
                  >
                    {char}
                  </span>
                );
              })}
            </h2>
          );
        })}

        {/* ── Frame counter (dev aid, remove if unwanted) ── */}
        {/* Uncomment to debug: */}
        {/* <div style={{ position:"absolute", top:10, right:10, color:"#abff02", fontFamily:"monospace", fontSize:"0.7rem", zIndex:99 }}>
          frame {frameIndex + 1}/{FRAME_COUNT} | {Math.round(scrollProgress * 100)}%
        </div> */}

        {/* ── Scroll indicator ── */}
        <div
          style={{
            position: "absolute",
            bottom: "1.25rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.375rem",
            opacity: activeTitleIdx === 0 ? 0.55 : 0,
            transition: "opacity 0.5s ease",
            zIndex: 4,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.5625rem",
              letterSpacing: "0.2em",
              color: "#fff",
              textTransform: "uppercase",
            }}
          >
            scroll
          </span>
          <div className="scroll-line" />
        </div>
      </div>

      <style>{`
        .scroll-line {
          width: 1px;
          height: 2rem;
          background: rgba(255,255,255,0.35);
          animation: scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.2; transform: scaleY(0.5); transform-origin: top; }
          50%       { opacity: 0.8; transform: scaleY(1);   transform-origin: top; }
        }
      `}</style>
    </section>
  );
}
