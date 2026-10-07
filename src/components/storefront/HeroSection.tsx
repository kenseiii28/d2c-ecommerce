'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { DualSpotlightSystem } from './DualSpotlightSystem';
import styles from './HeroSection.module.css';

// Piecewise linear interpolation matching the CSS keyframes
function interpolate(val: number, stops: Array<[number, number]>): number {
  if (val <= stops[0][0]) return stops[0][1];
  if (val >= stops[stops.length - 1][0]) return stops[stops.length - 1][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [s0, v0] = stops[i];
    const [s1, v1] = stops[i + 1];
    if (val >= s0 && val <= s1) {
      const frac = (val - s0) / (s1 - s0);
      return v0 + frac * (v1 - v0);
    }
  }
  return stops[stops.length - 1][1];
}

export default function HeroSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const charDRef = useRef<HTMLSpanElement>(null);
  const charTRef = useRef<HTMLSpanElement>(null);
  const charWRef = useRef<HTMLSpanElement>(null);
  const charNRef = useRef<HTMLSpanElement>(null);
  const charStarRef = useRef<HTMLSpanElement>(null);

  const [isEntered, setIsEntered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitioningRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    // Subtle entrance animation trigger
    const timer = setTimeout(() => setIsEntered(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const clearInlineStyles = useCallback(() => {
    if (artworkRef.current) {
      artworkRef.current.style.transform = '';
      artworkRef.current.style.opacity = '';
      artworkRef.current.style.pointerEvents = '';
    }
    if (contentRef.current) {
      contentRef.current.style.transform = '';
      contentRef.current.style.opacity = '';
      contentRef.current.style.pointerEvents = '';
    }
    if (logoContainerRef.current) {
      logoContainerRef.current.style.opacity = '';
      logoContainerRef.current.style.visibility = '';
    }
    const chars = [charDRef, charTRef, charWRef, charNRef, charStarRef];
    chars.forEach((ref) => {
      if (ref.current) {
        ref.current.style.transform = '';
        ref.current.style.opacity = '';
        ref.current.style.filter = '';
      }
    });
  }, []);

  const updateScrollProgress = useCallback(() => {
    if (isTransitioningRef.current) return;
    if (!trackRef.current || !heroRef.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      clearInlineStyles();
      return;
    }

    const track = trackRef.current;
    const hero = heroRef.current;
    const rect = track.getBoundingClientRect();
    const headerHeight = 72;
    const scrolled = headerHeight - rect.top;
    const maxScroll = track.offsetHeight - hero.offsetHeight;

    if (maxScroll <= 0) {
      clearInlineStyles();
      return;
    }

    const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1);

    if (progress <= 0.001) {
      clearInlineStyles();
      return;
    }

    // Normalized timeline matching existing 2.85s transition
    const t = progress * 2.85;

    // 1. Artwork exit (0s to 2.1s)
    const uArt = Math.min(t / 2.1, 1);
    const artX = interpolate(uArt, [[0, 0], [0.35, -50], [0.55, -90], [0.75, -135], [1, -180]]);
    const artScale = interpolate(uArt, [[0, 1], [0.35, 0.89], [0.55, 0.80], [0.75, 0.73], [1, 0.65]]);
    const artOpacity = interpolate(uArt, [[0, 0.96], [0.35, 0.55], [0.55, 0.18], [0.75, 0.04], [1, 0]]);

    if (artworkRef.current) {
      artworkRef.current.style.transform = `translateX(${artX}px) scale(${artScale})`;
      artworkRef.current.style.opacity = `${artOpacity}`;
      artworkRef.current.style.pointerEvents = artOpacity < 0.05 ? 'none' : 'auto';
    }

    // 2. Content exit (0s to 2.1s)
    const contentX = interpolate(uArt, [[0, 0], [0.35, 45], [0.55, 80], [0.75, 125], [1, 170]]);
    const contentOpacity = interpolate(uArt, [[0, 1], [0.35, 0.55], [0.55, 0.18], [0.75, 0.04], [1, 0]]);

    if (contentRef.current) {
      contentRef.current.style.transform = `translateX(${contentX}px)`;
      contentRef.current.style.opacity = `${contentOpacity}`;
      contentRef.current.style.pointerEvents = contentOpacity < 0.05 ? 'none' : 'auto';
    }

    // 3. Center DTWN Logo container visibility & fade
    if (logoContainerRef.current) {
      if (t < 0.95) {
        logoContainerRef.current.style.opacity = '0';
        logoContainerRef.current.style.visibility = 'hidden';
      } else {
        logoContainerRef.current.style.visibility = 'visible';
        let logoOp = 1;
        if (t < 1.15) {
          logoOp = (t - 0.95) / 0.20;
        } else if (t > 2.70) {
          logoOp = Math.max(0, 1 - (t - 2.70) / 0.15);
        }
        logoContainerRef.current.style.opacity = `${logoOp}`;
      }
    }

    // 4. Letters D, T, W, N
    const applyLetter = (ref: React.RefObject<HTMLSpanElement | null>, start: number) => {
      if (!ref.current) return;
      if (t < start) {
        ref.current.style.opacity = '0';
        ref.current.style.transform = 'translateY(14px) scale(0.92)';
      } else {
        const u = Math.min((t - start) / 0.32, 1);
        const op = interpolate(u, [[0, 0], [0.65, 1], [1, 1]]);
        const y = interpolate(u, [[0, 14], [0.65, -2], [1, 0]]);
        const sc = interpolate(u, [[0, 0.92], [0.65, 1.02], [1, 1]]);
        ref.current.style.opacity = `${op}`;
        ref.current.style.transform = `translateY(${y}px) scale(${sc})`;
      }
    };

    applyLetter(charDRef, 1.15);
    applyLetter(charTRef, 1.38);
    applyLetter(charWRef, 1.61);
    applyLetter(charNRef, 1.84);

    // 5. Star
    if (charStarRef.current) {
      const starStart = 2.15;
      const starDur = 0.55;
      if (t < starStart) {
        charStarRef.current.style.opacity = '0';
        charStarRef.current.style.transform = 'scale(0.2) rotate(-45deg)';
        charStarRef.current.style.filter = 'drop-shadow(0 0 0px rgba(255, 255, 255, 0))';
      } else {
        const u = Math.min((t - starStart) / starDur, 1);
        const op = interpolate(u, [[0, 0], [0.6, 1], [1, 1]]);
        const sc = interpolate(u, [[0, 0.2], [0.6, 1.22], [1, 1]]);
        const rot = interpolate(u, [[0, -45], [0.6, 6], [1, 0]]);
        const blur = interpolate(u, [[0, 0], [0.6, 22], [1, 8]]);
        const alpha = interpolate(u, [[0, 0], [0.6, 0.85], [1, 0.3]]);
        charStarRef.current.style.opacity = `${op}`;
        charStarRef.current.style.transform = `scale(${sc}) rotate(${rot}deg)`;
        charStarRef.current.style.filter = `drop-shadow(0 0 ${blur}px rgba(255, 255, 255, ${alpha}))`;
      }
    }
  }, [clearInlineStyles]);

  useEffect(() => {
    const onScroll = () => {
      if (isTransitioningRef.current) return;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updateScrollProgress);
    };

    const onResize = () => {
      if (isTransitioningRef.current) return;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(updateScrollProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    // Initial calculation on mount
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [updateScrollProgress]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isTransitioning) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const catalogueEl = document.getElementById('catalogue');
      if (catalogueEl) {
        catalogueEl.scrollIntoView({ behavior: 'auto' });
      }
      return;
    }

    setIsTransitioning(true);
    isTransitioningRef.current = true;
    clearInlineStyles();

    // Sequence:
    // OLD HERO fades + moves
    // -> D (1.15s)
    // -> T (1.38s)
    // -> W (1.61s)
    // -> N (1.84s)
    // -> STAR (2.15s - 2.70s)
    // -> catalogue (smooth scroll triggered once star completes animation)
    setTimeout(() => {
      const catalogueEl = document.getElementById('catalogue');
      if (catalogueEl) {
        catalogueEl.scrollIntoView({ behavior: 'smooth' });
      }
    }, 2850);

    setTimeout(() => {
      setIsTransitioning(false);
      isTransitioningRef.current = false;
      updateScrollProgress();
    }, 3800);
  };

  return (
    <div ref={trackRef} className={styles.heroTrack}>
      <section ref={heroRef} className={styles.hero}>
        {/* Background: deep dark canvas */}
        <div className={styles.heroBg} />

        {/* Atmospheric dark gradient */}
        <div className={styles.atmosphericOverlay} />

        {/* Physical Two-Spotlight Stage Beam System */}
        <DualSpotlightSystem heroRef={heroRef} />

        {/* Cinematic Center DTWN★ Logo Reveal */}
        <div
          ref={logoContainerRef}
          className={`${styles.logoRevealContainer} ${
            isTransitioning ? styles.logoRevealActive : ''
          }`}
          aria-hidden="true"
        >
          <div className={styles.logoRevealInner}>
            <span ref={charDRef} className={`${styles.revealChar} ${styles.charD}`}>
              <Image
                src="/images/dtwn-white-d.png"
                alt="D"
                width={80}
                height={100}
                priority
                className={styles.revealImg}
              />
            </span>
            <span ref={charTRef} className={`${styles.revealChar} ${styles.charT}`}>
              <Image
                src="/images/dtwn-white-t.png"
                alt="T"
                width={42}
                height={100}
                priority
                className={styles.revealImg}
              />
            </span>
            <span ref={charWRef} className={`${styles.revealChar} ${styles.charW}`}>
              <Image
                src="/images/dtwn-white-w.png"
                alt="W"
                width={101}
                height={100}
                priority
                className={styles.revealImg}
              />
            </span>
            <span ref={charNRef} className={`${styles.revealChar} ${styles.charN}`}>
              <Image
                src="/images/dtwn-white-n.png"
                alt="N"
                width={71}
                height={100}
                priority
                className={styles.revealImg}
              />
            </span>
            <span ref={charStarRef} className={`${styles.revealChar} ${styles.charStar}`}>
              <Image
                src="/images/dtwn-white-star.png"
                alt="★"
                width={96}
                height={100}
                priority
                className={styles.revealImg}
              />
            </span>
          </div>
        </div>

        {/* Main Hero Container framing both artwork and typography */}
        <div
          className={`container ${styles.heroContainer} ${
            isEntered ? styles.heroVisible : ''
          } ${isTransitioning ? styles.isTransitioning : ''}`}
        >
          {/* The isolated MEET DIRTTOWN artwork (no black box, background & beams show through) */}
          <div ref={artworkRef} className={styles.artworkFrame}>
            <Image
              src="/images/meet-dirttown-isolated.webp"
              alt="Meet Dirttown"
              fill
              priority
              className={styles.artworkImage}
              sizes="(max-width: 900px) 90vw, 50vw"
            />
          </div>

          {/* Foreground Content with refined white typography & single CTA */}
          <div ref={contentRef} className={styles.heroContent}>
            <div className={styles.headlineGroup}>
              <h1 className={styles.mainHeadline}>
                THE TOWN<br />IS YOURS
              </h1>
              <p className={styles.subline}>YOU MADE IT, YOU ARE ONE OF US</p>
            </div>

            {/* Single minimal CTA */}
            <Link href="#catalogue" onClick={handleCtaClick} className={styles.heroCta}>
              <span>EXPLORE OUR COLLECTION</span>
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* Campaign line: MATCH THE FREAK WITH DENIM */}
            <p className={styles.campaignLine}>MATCH THE FREAK WITH DENIM</p>
          </div>
        </div>
      </section>
    </div>
  );
}
