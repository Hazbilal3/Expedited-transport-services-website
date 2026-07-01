"use client";

import React, { useRef, useEffect, useState, CSSProperties } from 'react';
import { gsap } from 'gsap';

interface PixelTransitionProps {
  firstContent: React.ReactNode;
  secondContent: React.ReactNode;
  gridSize?: number;
  pixelColor?: string;
  animationStepDuration?: number;
  once?: boolean;
  className?: string;
  style?: CSSProperties;
  aspectRatio?: string;
}

const PixelTransition: React.FC<PixelTransitionProps> = ({
  firstContent,
  secondContent,
  gridSize = 7,
  pixelColor = '#b6f000',
  animationStepDuration = 0.4,
  once = false,
  aspectRatio = '100%',
  className = '',
  style = {},
}) => {
  const pixelGridRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLDivElement>(null);
  const delayedCallRef = useRef<gsap.core.Tween | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      setIsTouchDevice(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    }, 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const grid = pixelGridRef.current;
    if (!grid) return;
    grid.innerHTML = '';
    const size = 100 / gridSize;
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const px = document.createElement('div');
        px.classList.add('_ptpx');
        px.style.cssText = `
          position:absolute;
          display:none;
          background:${pixelColor};
          width:${size}%;
          height:${size}%;
          left:${col * size}%;
          top:${row * size}%;
        `;
        grid.appendChild(px);
      }
    }
  }, [gridSize, pixelColor]);

  function animatePixels(activate: boolean) {
    setIsActive(activate);
    const grid = pixelGridRef.current;
    const active = activeRef.current;
    if (!grid || !active) return;
    const pixels = grid.querySelectorAll<HTMLDivElement>('._ptpx');
    if (!pixels.length) return;

    gsap.killTweensOf(pixels);
    delayedCallRef.current?.kill();
    gsap.set(pixels, { display: 'none' });

    const stagger = animationStepDuration / pixels.length;
    gsap.to(pixels, { display: 'block', duration: 0, stagger: { each: stagger, from: 'random' } });

    delayedCallRef.current = gsap.delayedCall(animationStepDuration, () => {
      active.style.display = activate ? 'block' : 'none';
    });

    gsap.to(pixels, {
      display: 'none', duration: 0, delay: animationStepDuration,
      stagger: { each: stagger, from: 'random' },
    });
  }

  const handleEnter = () => { if (!isActive) animatePixels(true); };
  const handleLeave = () => { if (isActive && !once) animatePixels(false); };
  const handleClick = () => { isActive && !once ? animatePixels(false) : animatePixels(true); };

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        backgroundColor: '#111',
        cursor: 'pointer',
        outline: 'none',
        ...style,
      }}
      onMouseEnter={!isTouchDevice ? handleEnter : undefined}
      onMouseLeave={!isTouchDevice ? handleLeave : undefined}
      onClick={isTouchDevice ? handleClick : undefined}
      tabIndex={0}
      onFocus={!isTouchDevice ? handleEnter : undefined}
      onBlur={!isTouchDevice ? handleLeave : undefined}
    >
      {/* Aspect-ratio spacer */}
      <div style={{ paddingTop: aspectRatio }} />

      {/* Front: person photo */}
      <div style={{ position: 'absolute', inset: 0 }} aria-hidden={isActive}>
        {firstContent}
      </div>

      {/* Back: testimonial text */}
      <div
        ref={activeRef}
        style={{ position: 'absolute', inset: 0, zIndex: 2, display: 'none', pointerEvents: 'none' }}
        aria-hidden={!isActive}
      >
        {secondContent}
      </div>

      {/* Pixel overlay */}
      <div ref={pixelGridRef} style={{ position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none' }} />
    </div>
  );
};

export default PixelTransition;
