import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SpeedingCarLoaderProps {
  isLoading: boolean;
  onFinish?: () => void;
  /** Kept for compatibility; the intro has its own short, fixed timing. */
  minDurationMs?: number;
}

/**
 * Brand intro (about 1.3 s).
 * The RouteOne logo with five small start lights beneath it. The lights come on quickly and go out.
 * On a first visit to the home page, an "Enter" button then appears: browsers only allow sound after
 * the visitor taps once, so that tap lets the hero video start with its audio already on.
 * Otherwise (replay, other pages, or sound switched off) the screen simply lifts away.
 * Click, Enter or Space continues; Esc skips. Colours are inline so theme overrides never recolour it.
 */

/** Show the Enter step only when it unlocks sound for the hero video */
function needsSoundTap(): boolean {
  try {
    const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
    if (ua?.hasBeenActive) return false; // already tapped: sound is allowed
    if (localStorage.getItem('routeone_hero_audio') === 'off') return false; // visitor muted it before
    const route = window.location.hash.replace(/^#\/?/, '').split(/[?#]/)[0];
    return route === '' || route === 'home'; // the video with sound is on the home page
  } catch {
    return false;
  }
}
const FIRST_LIGHT_MS = 140;
const LIGHT_STEP_MS = 110;
const HOLD_MS = 200; // all five lit
const OUT_MS = 90; // short dark beat after lights out
const RED = '#E10600';

export const SpeedingCarLoader: React.FC<SpeedingCarLoaderProps> = ({ isLoading, onFinish }) => {
  const [lit, setLit] = useState(0);
  const [askEnter, setAskEnter] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finished = useRef(false);

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    clearTimers();
    onFinish?.();
  };

  useEffect(() => {
    if (!isLoading) return;
    finished.current = false;
    setLit(0);
    setAskEnter(false);
    for (let i = 1; i <= 5; i++) {
      timers.current.push(setTimeout(() => setLit(i), FIRST_LIGHT_MS + (i - 1) * LIGHT_STEP_MS));
    }
    const outAt = FIRST_LIGHT_MS + 4 * LIGHT_STEP_MS + HOLD_MS;
    timers.current.push(setTimeout(() => setLit(0), outAt));
    timers.current.push(
      setTimeout(() => {
        if (needsSoundTap()) setAskEnter(true);
        else finish();
      }, outAt + OUT_MS)
    );
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Skip with Esc or Space (never while typing)
  useEffect(() => {
    if (!isLoading) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && (['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) || el.isContentEditable)) return;
      if (e.code === 'Space' || e.key === 'Escape' || e.key === 'Enter') {
        e.preventDefault();
        finish();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // Devices set to reduce motion get a fade instead of the lift
  const reduceMotion =
    typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="brand-intro"
          id="race-start-intro"
          role="status"
          aria-live="polite"
          aria-label={askEnter ? "Welcome to RouteOne Auto Club" : "Loading RouteOne Auto Club"}
          onClick={finish}
          initial={{ y: 0, opacity: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0, transition: { duration: 0.25 } }
              : { y: '-100%', transition: { duration: 0.5, ease: [0.7, 0, 0.2, 1] } }
          }
          className="fixed inset-0 z-[99999] flex items-center justify-center select-none cursor-pointer"
          style={{ background: '#0B0C0E' }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            <img
              src="/images/brand/routeone-logo.png"
              alt=""
              width={485}
              height={246}
              draggable={false}
              style={{ height: 'clamp(40px, 6vw, 56px)', width: 'auto' }}
            />
            <div className="relative mt-6 h-12 flex items-start justify-center" style={{ minWidth: 220 }}>
              <AnimatePresence mode="wait" initial={false}>
                {!askEnter ? (
                  <motion.div
                    key="lights"
                    className="flex pt-0"
                    style={{ gap: 10 }}
                    aria-hidden="true"
                    exit={{ opacity: 0, transition: { duration: 0.12 } }}
                  >
                    {[1, 2, 3, 4, 5].map((n) => {
                      const on = lit >= n;
                      return (
                        <span
                          key={n}
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: 999,
                            background: on ? RED : '#24272B',
                            boxShadow: on ? '0 0 10px rgba(225,6,0,0.55)' : 'none',
                            transition: 'background 60ms linear, box-shadow 60ms linear',
                          }}
                        />
                      );
                    })}
                  </motion.div>
                ) : (
                  <motion.button
                    key="enter"
                    id="intro-enter-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      finish();
                    }}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="flex items-center justify-center h-11 min-w-[132px] px-8 rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                    style={{ background: RED, color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}
                  >
                    Enter
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpeedingCarLoader;
