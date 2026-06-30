"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Config                                                                     */
/* ─────────────────────────────────────────────────────────────────────────── */
const FRAME_COUNT = 240;

/** Pad number to 5 digits: 0 → "00000" */
const pad = (n: number) => String(n).padStart(5, "0");

/** Public path to a frame (0-indexed) from the new frames2 folder */
const frameSrc = (i: number) => `/frames2/frame_${pad(i)}.jpg`;

/* Text overlays that appear at scroll milestones */
const CAPTIONS = [
  {
    heading: "Precision in Motion",
    body: "Every mile is planned. Every load is secured.",
  },
  {
    heading: "Built for the Long Haul",
    body: "Our fleet is engineered for reliability across any terrain.",
  },
  {
    heading: "On Time, Every Time",
    body: "We don't just promise delivery — we guarantee it.",
  },
  {
    heading: "Your Cargo, Our Priority",
    body: "Transparent pricing. Zero hidden fees. Unlimited trust.",
  },
];

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Image Preloader Hook                                                       */
/* ─────────────────────────────────────────────────────────────────────────── */
function useFrames2() {
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
function useCanvasRenderer2(
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
/*  Main Component                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
export function ScrollFrameSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeCaptionIdx, setActiveCaptionIdx] = useState(0);
  const [captionVisible, setCaptionVisible] = useState(false);

  const { imagesRef, loaded, loadedCount } = useFrames2();

  // Map progress [0,1] → frame index [0, FRAME_COUNT-1]
  const frameIndex = Math.min(
    FRAME_COUNT - 1,
    Math.max(0, Math.round(scrollProgress * (FRAME_COUNT - 1)))
  );

  useCanvasRenderer2(canvasRef, imagesRef, frameIndex, loaded);

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

  // Scroll listener — drives frame index and caption switching
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, -top / (height - vh)));
      setScrollProgress(progress);

      // Show captions after scroll starts
      setCaptionVisible(progress > 0.03);

      // Divide into N caption segments
      const segSize = 1 / CAPTIONS.length;
      const idx = Math.min(CAPTIONS.length - 1, Math.floor(progress / segSize));
      setActiveCaptionIdx(idx);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const pct = Math.round(loadedCount / FRAME_COUNT * 100);

  return (
    <section
      ref={sectionRef}
      style={{ position: "relative", height: "400svh" }}
    >
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
        {/* ── Canvas ── */}
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

        {/* ── Section label — always pinned above progress bar ── */}
        <div
          style={{
            position: "absolute",
            bottom: "3.25rem",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            zIndex: 6,
            pointerEvents: "none",
          }}
        >
          <div style={{ width: "2rem", height: "1px", background: "rgba(182,240,0,0.6)" }} />
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.8rem",
              fontWeight: 600,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(182,240,0,0.9)",
              whiteSpace: "nowrap",
            }}
          >
            About Us
          </span>
          <div style={{ width: "2rem", height: "1px", background: "rgba(182,240,0,0.6)" }} />
        </div>

        {/* ── Gradient overlays ── */}
        {/* Top fade */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "18%",
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)",
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
            height: "45%",
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Side vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        {/* ── Caption overlays — corner positions ── */}
        {CAPTIONS.map((caption, idx) => {
          const isActive = idx === activeCaptionIdx;
          const show = captionVisible && isActive;

          // Corner layout: 0=top-left, 1=top-right, 2=bottom-left, 3=bottom-right
          const isTop    = idx < 2;
          const isRight  = idx % 2 === 1;
          const edge     = "clamp(4.5rem, 7vw, 7rem)";
          const side     = "clamp(2rem, 4vw, 4rem)";
          const enterY   = isTop ? "-18px" : "18px";

          const posStyle: React.CSSProperties = {
            position: "absolute",
            zIndex: 5,
            pointerEvents: "none",
            maxWidth: "340px",
            textAlign: isRight ? "right" : "left",
            ...(isTop    ? { top:    edge } : { bottom: edge }),
            ...(isRight  ? { right:  side } : { left:   side }),
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0px)" : `translateY(${enterY})`,
            transition: "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
          };

          return (
            <div key={idx} style={posStyle}>
              {/* Counter */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.625rem",
                  justifyContent: isRight ? "flex-end" : "flex-start",
                }}
              >
                <div style={{ width: "1.75rem", height: "1px", background: "rgba(182,240,0,0.7)" }} />
                <span
                  style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.6rem",
                    letterSpacing: "0.22em",
                    color: "rgba(182,240,0,0.85)",
                    textTransform: "uppercase",
                  }}
                >
                  {String(idx + 1).padStart(2, "0")} / {String(CAPTIONS.length).padStart(2, "0")}
                </span>
                <div style={{ width: "1.75rem", height: "1px", background: "rgba(182,240,0,0.7)" }} />
              </div>

              <h2
                style={{
                  color: "#fff",
                  fontSize: "clamp(1.1rem, 2vw, 1.75rem)",
                  fontFamily: "var(--font-primary, 'Inter', sans-serif)",
                  fontWeight: 500,
                  lineHeight: 1.15,
                  letterSpacing: "-0.02em",
                  margin: "0 0 0.5rem",
                }}
              >
                {caption.heading}
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "clamp(0.75rem, 1vw, 0.9rem)",
                  fontFamily: "var(--font-primary, 'Inter', sans-serif)",
                  fontWeight: 400,
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {caption.body}
              </p>
            </div>
          );
        })}

        {/* ── Progress scrubber (bottom strip) ── */}
        <div
          style={{
            position: "absolute",
            bottom: "1.5rem",
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(90vw, 28rem)",
            height: "2px",
            background: "rgba(255,255,255,0.15)",
            borderRadius: "9999px",
            zIndex: 6,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${scrollProgress * 100}%`,
              background: "linear-gradient(90deg, #abff02, #6bde00)",
              borderRadius: "9999px",
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>

      <style>{`
        .sfs-loading-ring {
          width: 3rem;
          height: 3rem;
          border: 2px solid rgba(255,255,255,0.1);
          border-top-color: #abff02;
          border-radius: 50%;
          animation: sfs-spin 0.9s linear infinite;
        }
        @keyframes sfs-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
