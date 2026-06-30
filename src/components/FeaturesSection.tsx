"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeftIcon, ArrowRightIcon } from "./icons";

const FEATURES = [
  {
    id: 1,
    text: "Hotshot Trucking Services.",
    desc: "Fast and reliable transportation service specializing in urgent, time-sensitive deliveries with dedicated trucks for smaller, high-priority loads.",
    video: "/videos/feature-1.mp4",
  },
  {
    id: 2,
    text: "LTL trucking.",
    desc: "Cost-effective freight transportation service that ships smaller loads by combining multiple shipments in one truck, ensuring efficient and reliable delivery.",
    video: "/videos/feature-2.mp4",
  },
  {
    id: 3,
    text: "Logistics Services.",
    desc: "Efficient management of transportation, storage, and delivery processes to ensure goods move smoothly from origin to destination on time.",
    video: "/videos/feature-3.mp4",
  },
  {
    id: 4,
    text: "Dry Van Trucking.",
    desc: "Reliable transportation service for non-temperature-sensitive goods, offering secure and protected shipping for a wide range of freight.",
    video: "/videos/feature-4.mp4",
  },
  {
    id: 5,
    text: "Expedited Trucking.",
    desc: "Fast and priority shipping service designed for time-sensitive deliveries, ensuring urgent freight reaches its destination quickly and safely.",
    video: "/videos/feature-5.mp4",
  },
  {
    id: 6,
    text: "Freight Shipping.",
    desc: "Reliable transportation service for moving goods of all sizes, ensuring safe, efficient, and timely delivery from one location to another.",
    video: "/videos/feature-6.mp4",
  },
];

const TOTAL = FEATURES.length; // 6

function OdometerDigit({ value }: { value: number }) {
  const H = 18;
  return (
    <div style={{ overflow: "hidden", height: H, width: 12, position: "relative" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          transform: `translateY(-${value * H}px)`,
          transition: "transform 0.4s cubic-bezier(0,0,0.58,1)",
          willChange: "transform",
        }}
      >
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            style={{
              height: H,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "0.875rem",
              fontWeight: 600,
              letterSpacing: "0.03em",
              lineHeight: 1,
              color: "var(--c-dark-green)",
              userSelect: "none",
            }}
          >
            {i}
          </span>
        ))}
      </div>
    </div>
  );
}

export function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [currentItem, setCurrentItem] = useState(0);
  const [slotHeight, setSlotHeight] = useState(0);
  const [viewportH, setViewportH] = useState(600);
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Avoid hydration mismatch — detect mobile only on client
  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Track viewport height for dramatic bottom-entry offset
  useEffect(() => {
    const update = () => setViewportH(window.innerHeight);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Measure the text grid container height via ResizeObserver — fires after fonts load too
  useEffect(() => {
    const el = textContainerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const h = entries[0].contentRect.height;
      if (h > 0) setSlotHeight(h);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Desktop: scroll-driven item switching
  useEffect(() => {
    if (!mounted || isMobile) return;

    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Same formula as HeroSection: progress 0→1 through the sticky travel range
      const progress = Math.max(0, Math.min(1, -top / (height - vh)));
      setCurrentItem(Math.min(TOTAL - 1, Math.floor(progress * TOTAL)));
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [mounted, isMobile]);

  // Manage video playback: only active video plays
  useEffect(() => {
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      if (idx === currentItem) {
        v.play().catch(() => { });
      } else {
        v.pause();
      }
    });
  }, [currentItem]);

  const goTo = useCallback((idx: number) => {
    setCurrentItem(Math.max(0, Math.min(TOTAL - 1, idx)));
  }, []);

  const tens = Math.floor((currentItem + 1) / 10);
  const units = (currentItem + 1) % 10;

  return (
    <div>
      {/* ── Intro paragraph ── */}
      {/* <section
        style={{
          backgroundColor: "var(--c-white)",
          padding: "6.25rem var(--grid-margin)",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-primary)",
            fontSize: "clamp(1.5rem, 2.24vw, 3.583rem)",
            fontWeight: 450,
            lineHeight: 1.2,
            color: "var(--c-dark-green)",
            margin: 0,
            maxWidth: "860px",
          }}
        >
          Imagine the yard as an{" "}
          <strong style={{ fontWeight: 600 }}>intelligent bridge</strong>{" "}
          seamlessly connecting highway to warehouse.
        </h2>
      </section> */}

      {/*
       * ── Scroll driver ──
       * Height = (TOTAL + 1) * 100svh = 700svh, NO padding.
       * Sticky inner = 100svh → sticky travel = 700svh - 100svh = 600svh.
       * 6 features × 100svh each.
       *
       * On mobile: height:auto, no sticky.
       */}
      <section
        ref={sectionRef}
        className="features-scroll-driver"
        style={{ backgroundColor: "var(--c-white)", position: "relative" }}
      >
        {/* ── Desktop: sticky panel ── */}
        <div className="features-sticky-panel">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, 1fr)",
              columnGap: "min(1.042vw, 26.667px)",
              paddingLeft: "min(3.646vw, 93.333px)",
              paddingRight: "min(3.646vw, 93.333px)",
              height: "100%",
              alignItems: "center",
            }}
          >
            {/* LEFT: counter + text + progress */}
            <div
              style={{
                gridColumn: "1 / 6",
                display: "flex",
                flexDirection: "column",
                gap: "1.375rem",
                paddingTop: "3.75rem",
                paddingBottom: "3.75rem",
              }}
            >
              <h2
                style={{
                  fontFamily: "var(--font-primary)",
                  fontSize: "clamp(1.5rem, 4vw, 3rem)",
                  fontWeight: 450,
                  lineHeight: 1.2,
                  color: "var(--c-dark-green)",
                  marginBottom: "3rem",
                  maxWidth: "860px",
                }}
              >
                Our{" "}
                <strong style={{ fontWeight: 400, fontStyle: "italic", color: "#b6f000" }}>Services</strong>{" "}
              </h2>
              {/* Odometer */}
              <div style={{ display: "flex" }}>
                <OdometerDigit value={tens} />
                <OdometerDigit value={units} />
              </div>

              {/* Feature texts — CSS grid stack, each item occupies the same cell,
                  translateY by measured slot height drives the vertical slide */}
              <div
                ref={textContainerRef}
                style={{
                  display: "grid",
                  overflow: "hidden",
                }}
              >
                {FEATURES.map((feature, idx) => (
                  <p
                    key={idx}
                    style={{
                      gridRow: "1",
                      gridColumn: "1",
                      fontFamily: "var(--font-primary)",
                      fontSize: "clamp(1.5rem, 2.396vw, 3.833rem)",
                      fontWeight: 450,
                      lineHeight: 1.2,
                      letterSpacing: "min(-0.024vw, -0.613px)",
                      margin: 0,
                      color: "var(--c-dark-green)",
                      pointerEvents: "none",
                      /* Before measurement: hide non-active items to avoid flash */
                      opacity: slotHeight === 0 ? (idx === currentItem ? 1 : 0) : 1,
                      transform: `translateY(${slotHeight === 0
                        ? 0
                        : idx === currentItem
                          ? 0                           // active: resting position
                          : idx < currentItem
                            ? -(slotHeight + 24)          // exited: just above the window
                            : viewportH * 0.55            // entering: ~55vh below, dramatic rise
                        }px)`,
                      transition: slotHeight > 0
                        ? "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1)"
                        : "none",
                      willChange: "transform",
                    }}
                  >
                    {feature.text}
                  </p>
                ))}
              </div>

              {/* Feature descriptions — same grid-stack + translateY pattern as titles */}
              <div style={{ display: "grid", overflow: "hidden", marginTop: "0.75rem" }}>
                {FEATURES.map((feature, idx) => (
                  <p
                    key={idx}
                    style={{
                      gridRow: "1",
                      gridColumn: "1",
                      margin: 0,
                      fontFamily: "var(--font-primary)",
                      fontSize: "clamp(1rem, 1.25vw, 1.25rem)",
                      fontWeight: 400,
                      lineHeight: 1.6,
                      color: "var(--c-dark-green)",
                      maxWidth: "420px",
                      opacity: idx === currentItem ? 1 : 0,
                      transform: `translateY(${
                        idx === currentItem ? 0
                        : idx < currentItem ? -60
                        : viewportH * 0.3
                      }px)`,
                      transition: "transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease",
                      willChange: "transform",
                      pointerEvents: "none",
                    }}
                  >
                    {"desc" in feature ? feature.desc : ""}
                  </p>
                ))}
              </div>

              {/* Progress bar */}
              <div
                style={{
                  background: "var(--c-dirty-white)",
                  height: 2,
                  position: "relative",
                  marginTop: "0.75rem",
                }}
              >
                <div
                  style={{
                    background: "#b6f000",
                    height: "100%",
                    position: "absolute",
                    left: 0,
                    top: 0,
                    width: `${(100 / TOTAL).toFixed(4)}%`,
                    translate: `${currentItem * 100}% 0`,
                    transition: "translate 0.35s cubic-bezier(0,0,0.58,1)",
                  }}
                />
              </div>
            </div>

            {/* RIGHT: video panel */}
            <div
              style={{
                gridColumn: "7 / -1",
                height: "calc(100svh - 4.375rem)",
                position: "relative",
                overflow: "hidden",
                borderRadius: "0.625rem",
                alignSelf: "center",
              }}
            >
              {FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    inset: 0,
                    opacity: idx === currentItem ? 1 : 0,
                    transition: "opacity 0.5s cubic-bezier(0,0,0.58,1)",
                  }}
                >
                  <video
                    ref={(el) => { videoRefs.current[idx] = el; }}
                    src={feature.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Mobile: click-based layout ── */}
        <div className="features-mobile-panel">
          {/* Counter dots */}
          <div
            style={{
              display: "flex",
              gap: "1.125rem",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              letterSpacing: "0.15rem",
              marginBottom: "1.5rem",
              paddingLeft: "5vw",
              paddingRight: "5vw",
            }}
          >
            {FEATURES.map((f, idx) => (
              <span
                key={idx}
                style={{
                  color: idx === currentItem ? "#a9a9a9" : "#eaeaea",
                  transition: "color 0.5s",
                }}
              >
                {String(f.id).padStart(2, "0")}
              </span>
            ))}
          </div>

          {/* Feature text */}
          <p
            style={{
              fontFamily: "var(--font-primary)",
              fontSize: "1.375rem",
              fontWeight: 450,
              lineHeight: 1.2,
              margin: "0 0 1.5rem",
              color: "var(--c-dark-green)",
              paddingLeft: "5vw",
              paddingRight: "5vw",
              minHeight: "3em",
            }}
          >
            {FEATURES[currentItem].text}
          </p>

          {/* Video */}
          <div
            style={{
              marginLeft: "5vw",
              marginRight: "5vw",
              aspectRatio: "400/480",
              position: "relative",
              overflow: "hidden",
              borderRadius: "0.625rem",
            }}
          >
            {FEATURES.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  position: "absolute",
                  inset: 0,
                  opacity: idx === currentItem ? 1 : 0,
                  transition: "opacity 0.5s ease",
                }}
              >
                <video
                  src={feature.video}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            ))}

            {/* Prev / Next buttons */}
            <div
              style={{
                position: "absolute",
                bottom: "1.5rem",
                right: "1rem",
                display: "flex",
                gap: "0.5rem",
                zIndex: 2,
              }}
            >
              <button
                onClick={() => goTo(currentItem - 1)}
                disabled={currentItem === 0}
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  backgroundColor: "var(--c-white)",
                  borderRadius: "8px",
                  border: "none",
                  cursor: currentItem === 0 ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: currentItem === 0 ? 0.35 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <ArrowLeftIcon stroke="black" />
              </button>
              <button
                onClick={() => goTo(currentItem + 1)}
                disabled={currentItem === TOTAL - 1}
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  backgroundColor: "var(--c-white)",
                  borderRadius: "8px",
                  border: "none",
                  cursor: currentItem === TOTAL - 1 ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: currentItem === TOTAL - 1 ? 0.35 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                <ArrowRightIcon stroke="black" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Desktop: section = 700svh tall scroll driver */
        .features-scroll-driver {
          height: calc(${TOTAL + 1} * 100svh);
        }
        /* Sticky panel fills 100svh and pins while section scrolls */
        .features-sticky-panel {
          position: sticky;
          top: 0;
          height: 100svh;
          overflow: hidden;
          display: block;
        }
        /* Mobile panel is hidden on desktop */
        .features-mobile-panel {
          display: none;
          padding: 2rem 0 5rem;
        }

        @media (max-width: 1023px) {
          /* On mobile: section is auto height, no scroll driver */
          .features-scroll-driver {
            height: auto !important;
          }
          .features-sticky-panel {
            display: none !important;
          }
          .features-mobile-panel {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
