import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowDown, Volume2, VolumeX } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const AUDIO_PREF_KEY = 'routeone_hero_audio';
function readAudioPref(): string | null {
  try {
    return localStorage.getItem(AUDIO_PREF_KEY);
  } catch {
    return null;
  }
}
function saveAudioPref(v: 'on' | 'off') {
  try {
    localStorage.setItem(AUDIO_PREF_KEY, v);
  } catch {
    /* ignore */
  }
}
/** True once the visitor has tapped, clicked or pressed a key on the page (browsers then allow sound) */
function hasUserActivation(): boolean {
  if (typeof navigator === 'undefined') return false;
  const ua = (navigator as Navigator & { userActivation?: { hasBeenActive: boolean } }).userActivation;
  return ua ? ua.hasBeenActive : false;
}

interface HeroProps {
  onOpenBookingModal: () => void;
  onExploreCollection: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenBookingModal,
  onExploreCollection,
}) => {
  const { isGarageLight } = useTheme();
  const [isVideoReady, setIsVideoReady] = useState(false);

  // Sound is ON by default and stays on unless the visitor turns it off (remembered on this device).
  // Browsers only allow sound after the visitor's first tap, click or key press on the page,
  // so until then the video plays silently and the sound starts on that first interaction.
  const [wantsSound, setWantsSound] = useState<boolean>(() => readAudioPref() !== 'off');
  const [soundUnlocked, setSoundUnlocked] = useState<boolean>(() => hasUserActivation());
  const wantsSoundRef = useRef(wantsSound);
  const soundUnlockedRef = useRef(soundUnlocked);
  const isMuted = !wantsSound || !soundUnlocked;
  const isMutedRef = useRef(isMuted);
  isMutedRef.current = !wantsSoundRef.current || !soundUnlockedRef.current;

  // Phones and tablets: the video fills the whole hero, behind the headline
  const [isCompact, setIsCompact] = useState<boolean>(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  );
  // Light colours only on desktop in the light theme; phones/tablets always show text over the video
  const light = isGarageLight && !isCompact;
  const [coverSize, setCoverSize] = useState<{ w: number; h: number } | null>(null);

  const heroSectionRef = useRef<HTMLElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const rafIdRef = useRef<number | null>(null);
  const lastVolumeRef = useRef<number>(-1);
  const durationRef = useRef<number>(33.0);
  const lastLoopTimeRef = useRef<number>(Date.now());

  // Helper to safely dispatch commands to YouTube IFrame API
  const sendCommand = useCallback((func: string, args: unknown[] = []) => {
    if (iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({ event: 'command', func, args }),
        '*'
      );
    }
  }, []);

  // Check if hero is currently visible in viewport
  const isHeroVisible = useCallback(() => {
    if (!heroSectionRef.current) return false;
    const rect = heroSectionRef.current.getBoundingClientRect();
    const heroHeight = rect.height || window.innerHeight;
    const fadeEnd = heroHeight * 0.1;
    return rect.bottom > fadeEnd;
  }, []);

  // Smooth scroll volume fade
  const updateVolumeForScroll = useCallback(() => {
    if (isMutedRef.current) {
      sendCommand('mute');
      sendCommand('setVolume', [0]);
      lastVolumeRef.current = 0;
      return;
    }

    if (!heroSectionRef.current) return;
    const rect = heroSectionRef.current.getBoundingClientRect();
    const heroHeight = rect.height || window.innerHeight;

    const fadeStart = heroHeight * 0.75;
    const fadeEnd = heroHeight * 0.15;

    let ratio = 1;
    if (rect.bottom <= fadeEnd) {
      ratio = 0;
    } else if (rect.bottom >= fadeStart) {
      ratio = 1;
    } else {
      ratio = (rect.bottom - fadeEnd) / (fadeStart - fadeEnd);
    }

    const clampedRatio = Math.max(0, Math.min(1, ratio));
    const targetVolume = Math.round(clampedRatio * 85);

    if (targetVolume <= 2) {
      sendCommand('setVolume', [0]);
      sendCommand('mute');
      lastVolumeRef.current = 0;
    } else {
      sendCommand('unMute');
      sendCommand('setVolume', [targetVolume]);
      lastVolumeRef.current = targetVolume;
    }
  }, [sendCommand]);

  // Seamless auto-loop: rewind to 0 before the video ends
  const loopVideoToStart = useCallback(() => {
    lastLoopTimeRef.current = Date.now();
    sendCommand('seekTo', [0, true]);
    sendCommand('playVideo', []);
    if (!isMutedRef.current && isHeroVisible()) {
      updateVolumeForScroll();
    } else {
      sendCommand('setVolume', [0]);
      sendCommand('mute');
      lastVolumeRef.current = 0;
    }
  }, [sendCommand, isHeroVisible, updateVolumeForScroll]);

  // RequestAnimationFrame throttled scroll handler
  const handleScroll = useCallback(() => {
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
    }
    rafIdRef.current = requestAnimationFrame(() => {
      updateVolumeForScroll();
      sendCommand('playVideo', []);
    });
  }, [updateVolumeForScroll, sendCommand]);

  const startSound = useCallback(() => {
    sendCommand('playVideo', []);
    if (isHeroVisible()) {
      sendCommand('unMute', []);
      sendCommand('setVolume', [85]);
      lastVolumeRef.current = 85;
      updateVolumeForScroll();
    }
  }, [sendCommand, isHeroVisible, updateVolumeForScroll]);

  // Audio button: turns sound off, or back on (the click itself lets the browser play sound)
  const toggleMute = useCallback(() => {
    const turningOff = wantsSoundRef.current && soundUnlockedRef.current;
    if (turningOff) {
      wantsSoundRef.current = false;
      isMutedRef.current = true;
      setWantsSound(false);
      saveAudioPref('off');
      sendCommand('mute');
      sendCommand('setVolume', [0]);
      lastVolumeRef.current = 0;
    } else {
      wantsSoundRef.current = true;
      soundUnlockedRef.current = true;
      isMutedRef.current = false;
      setWantsSound(true);
      setSoundUnlocked(true);
      saveAudioPref('on');
      startSound();
    }
  }, [sendCommand, startSound]);

  // First tap / click / key press anywhere on the page switches the sound on
  useEffect(() => {
    if (soundUnlocked) return;
    const events = ['pointerup', 'click', 'keydown', 'touchend'] as const;
    const unlock = () => {
      soundUnlockedRef.current = true;
      setSoundUnlocked(true);
      if (wantsSoundRef.current) {
        isMutedRef.current = false;
        startSound();
      }
      events.forEach((ev) => window.removeEventListener(ev, unlock, true));
    };
    events.forEach((ev) => window.addEventListener(ev, unlock, { capture: true, passive: true }));
    return () => events.forEach((ev) => window.removeEventListener(ev, unlock, true));
  }, [soundUnlocked, startSound]);

  // Track phone/tablet vs desktop, and size the video to cover the hero on small screens
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const onChange = () => setIsCompact(mq.matches);
    mq.addEventListener('change', onChange);
    const section = heroSectionRef.current;
    const ro =
      section && 'ResizeObserver' in window
        ? new ResizeObserver(() => {
            // Full size of the hero including its padding
            const W = section.offsetWidth;
            const H = section.offsetHeight;
            // The film is shot wide (about 2.4:1) inside a 16:9 frame with black bars above and below.
            // Size the player so the picture itself (not the bars) covers the whole hero.
            const PICTURE_RATIO = 2.4;
            const w = Math.max(W, H * PICTURE_RATIO);
            setCoverSize({ w: Math.ceil(w), h: Math.ceil((w * 9) / 16) });
          })
        : null;
    if (section && ro) ro.observe(section);
    return () => {
      mq.removeEventListener('change', onChange);
      ro?.disconnect();
    };
  }, []);

  // Setup YouTube message listener and auto-looping for the Max Verstappen DNA edit
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        if (typeof e.data === 'string') {
          const data = JSON.parse(e.data);

          if (data.event === 'onReady') {
            setIsVideoReady(true);
            sendCommand('setPlaybackQuality', ['hd1080']);
            sendCommand('playVideo', []);
            if (!isMutedRef.current && isHeroVisible()) {
              sendCommand('unMute', []);
              sendCommand('setVolume', [85]);
              updateVolumeForScroll();
            } else if (isMutedRef.current) {
              sendCommand('mute', []);
              sendCommand('setVolume', [0]);
            }
          }

          if (data.event === 'infoDelivery' && data.info) {
            if (typeof data.info.duration === 'number' && data.info.duration > 0) {
              durationRef.current = data.info.duration;
            }
            if (typeof data.info.currentTime === 'number') {
              const dur = durationRef.current || 33.0;
              if (dur > 2 && data.info.currentTime >= dur - 0.5) {
                loopVideoToStart();
              }
            }
            if (data.info.playerState === 2) {
              sendCommand('playVideo', []);
            } else if (data.info.playerState === 0) {
              loopVideoToStart();
            }
          }

          if (data.event === 'onStateChange') {
            if (data.info === 1) {
              setIsVideoReady(true);
              if (!isMutedRef.current && isHeroVisible()) {
                sendCommand('unMute', []);
                updateVolumeForScroll();
              } else if (isMutedRef.current) {
                sendCommand('mute', []);
                sendCommand('setVolume', [0]);
              }
            } else if (data.info === 0) {
              loopVideoToStart();
            } else if (data.info === 2) {
              sendCommand('playVideo', []);
            }
          }
        }
      } catch {
        // Ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);

    // Immediate unmuted kickstart sequence on page load to ensure video audio starts promptly
    const kickstartTimers = [150, 450, 1000, 1800].map((delay) =>
      setTimeout(() => {
        if (!isMutedRef.current && isHeroVisible()) {
          sendCommand('unMute', []);
          sendCommand('setVolume', [85]);
          sendCommand('playVideo', []);
        }
      }, delay)
    );

    // Continuous loop interval
    const loopInterval = setInterval(() => {
      sendCommand('getCurrentTime', []);
      sendCommand('getDuration', []);
      sendCommand('playVideo', []);

      const now = Date.now();
      const elapsed = (now - lastLoopTimeRef.current) / 1000;
      const targetDuration = durationRef.current || 33.0;
      if (elapsed >= targetDuration - 0.5) {
        loopVideoToStart();
      }
    }, 250);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        sendCommand('playVideo', []);
        if (!isMutedRef.current && isHeroVisible()) {
          sendCommand('unMute', []);
          updateVolumeForScroll();
        } else {
          sendCommand('setVolume', [0]);
          sendCommand('mute', []);
        }
      }
    };

    const handleWindowFocus = () => {
      sendCommand('playVideo', []);
      if (!isMutedRef.current && isHeroVisible()) {
        sendCommand('unMute', []);
        updateVolumeForScroll();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleWindowFocus);

    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleWindowFocus);
      kickstartTimers.forEach(clearTimeout);
      clearInterval(loopInterval);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [handleScroll, isHeroVisible, loopVideoToStart, sendCommand, updateVolumeForScroll]);

  return (
    <section
      ref={heroSectionRef}
      id="hero-section"
      className={`relative w-full min-h-[92svh] sm:min-h-[86vh] lg:min-h-[90vh] overflow-hidden flex flex-col justify-between pt-8 sm:pt-12 md:pt-16 pb-6 md:pb-8 px-4 sm:px-6 md:px-10 border-b transition-colors duration-300 ${
        isCompact
          ? 'bg-[#0A0C0D] border-[#ffffff14]'
          : isGarageLight
          ? 'bg-[#F4F3EF] border-black/[0.08]'
          : 'bg-[#0B0D0E] border-white/[0.08]'
      }`}
    >
      {/* Hero video audio button: Audio on / Tap for sound / Muted */}
      <div className="absolute top-3 sm:top-6 right-4 sm:right-6 md:right-10 z-30 pointer-events-auto flex items-center">
        <button
          id="hero-video-mute-btn"
          type="button"
          onClick={toggleMute}
          aria-label={isMuted ? 'Turn hero video sound on' : 'Turn hero video sound off'}
          aria-pressed={!isMuted}
          className={`group flex items-center gap-2 h-9 px-3.5 border rounded-full backdrop-blur-md transition-colors duration-200 cursor-pointer select-none shadow-lg active:scale-95 ${
            !isMuted
              ? 'bg-[#D71920] hover:bg-[#b5141a] border-[#D71920]'
              : 'bg-[#000000a6] hover:bg-[#000000d9] border-[#ffffff33]'
          }`}
          style={{ color: '#FFFFFF' }}
          title={!isMuted ? 'Turn sound off' : wantsSound ? 'Tap to play the sound' : 'Turn sound on'}
        >
          {!isMuted ? (
            <Volume2 className="w-4 h-4 shrink-0" style={{ color: '#FFFFFF' }} />
          ) : (
            <VolumeX className="w-4 h-4 shrink-0" style={{ color: wantsSound ? '#FFFFFF' : '#FF4D52' }} />
          )}
          <span className="text-xs font-semibold" style={{ color: '#FFFFFF' }}>
            {!isMuted ? 'Audio on' : wantsSound ? 'Tap for sound' : 'Muted'}
          </span>
          {!isMuted ? (
            <span className="flex items-end gap-[2px] h-3" aria-hidden="true">
              <span className="w-[2px] h-2 animate-[pulse_0.6s_ease-in-out_infinite]" style={{ background: '#FFFFFF' }} />
              <span className="w-[2px] h-3 animate-[pulse_0.8s_ease-in-out_infinite]" style={{ background: '#FFFFFF' }} />
              <span className="w-[2px] h-1.5 animate-[pulse_0.5s_ease-in-out_infinite]" style={{ background: '#FFFFFF' }} />
            </span>
          ) : wantsSound ? (
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#FF4D52' }} aria-hidden="true" />
          ) : null}
        </button>
      </div>

      {/* Background Video Layer */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {/* Instant Fallback Poster Image (Guarantees instant paint with zero layout shift) */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <img
            src="/images/f1/hero-f1.webp"
            alt="Formula 1 Racing Background Poster"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-[62%_center] lg:object-center"
          />
        </div>

        {/* Continuous Looping Max Verstappen x Kendrick Lamar DNA Edit Video */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110vw] h-[61.875vw] min-h-[120%] min-w-[195vh] lg:left-[54%] pointer-events-none scale-[1.38] transform-gpu"
            style={
              isCompact && coverSize
                ? // Exact 16:9 "cover" box; a small zoom hides YouTube's edges
                  { width: coverSize.w, height: coverSize.h, minWidth: 0, minHeight: 0, scale: '1.04' }
                : undefined
            }
          >
            <iframe
              ref={iframeRef}
              title="Max Verstappen x Kendrick Lamar - DNA (Béla Films)"
              src="https://www.youtube-nocookie.com/embed/o4QXiKLv9yo?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&modestbranding=1&enablejsapi=1&iv_load_policy=3&disablekb=1&fs=0&loop=1&playlist=o4QXiKLv9yo&showinfo=0"
              tabIndex={-1}
              aria-hidden="true"
              onLoad={() => {
                setIsVideoReady(true);
                if (isMutedRef.current) {
                  sendCommand('mute', []);
                } else {
                  sendCommand('unMute', []);
                  sendCommand('setVolume', [85]);
                }
                sendCommand('playVideo', []);
                if (iframeRef.current?.contentWindow) {
                  iframeRef.current.contentWindow.postMessage(
                    JSON.stringify({ event: 'listening' }),
                    '*'
                  );
                }
              }}
              className={`w-full h-full border-0 pointer-events-none select-none object-cover transition-opacity duration-1000 ${
                isVideoReady ? 'opacity-100' : 'opacity-0'
              }`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              style={{ pointerEvents: 'none', userSelect: 'none' }}
            />
          </div>
        </div>

        {/* Cinematic Scrim:
            - Portrait/Mobile: Vertical gradient keeping text completely legible at top and mid
            - Landscape/Desktop: Refined horizontal left fade keeping text sharp, transitioning smoothly into video on the right */}
        <div
          className={`absolute inset-0 pointer-events-none transition-colors duration-500 z-[1] ${
            isCompact
              ? '[background:linear-gradient(180deg,rgba(10,12,13,0.55)_0%,rgba(10,12,13,0.5)_35%,rgba(10,12,13,0.66)_62%,rgba(10,12,13,0.92)_100%)]'
              : isGarageLight
                ? '[background:linear-gradient(90deg,#F4F3EF_0%,#F4F3EF_35%,rgba(244,243,239,0.96)_44%,rgba(244,243,239,0.70)_56%,rgba(244,243,239,0.20)_68%,transparent_78%)]'
                : '[background:linear-gradient(90deg,#0B0D0E_0%,#0B0D0E_35%,rgba(11,13,14,0.96)_44%,rgba(11,13,14,0.70)_56%,rgba(11,13,14,0.20)_68%,transparent_78%)]'
          }`}
        />

        {/* Solid bottom gradient grounding the performance data strip */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-44 pointer-events-none transition-colors duration-500 z-[2] ${
            isCompact
              ? 'bg-gradient-to-t from-[#0A0C0D] via-[#0A0C0D]/80 via-40% to-transparent'
              : isGarageLight
              ? 'bg-gradient-to-t from-[#F4F3EF] via-[#F4F3EF]/95 via-50% to-transparent'
              : 'bg-gradient-to-t from-[#0B0D0E] via-[#0B0D0E]/95 via-50% to-transparent'
          }`}
        />
      </div>

      {/* Video Pointer-Events Shield: Intercepts all clicks/touches on background so video controls never trigger on click */}
      <div
        className="absolute inset-0 z-[5] pointer-events-auto select-none cursor-default"
        style={{ touchAction: 'pan-y' }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDoubleClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onTouchStart={(e) => {
          e.stopPropagation();
        }}
        aria-hidden="true"
      />

      {/* Foreground Content: Editorial Grid */}
      <div className="relative z-10 w-full flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center my-auto py-4 sm:py-6">
          {/* Left Column: Heading, Precision Copy, CTAs, Brand Statement */}
          <div className="lg:col-span-7 xl:col-span-6 flex flex-col justify-center">
            {/* Small Label */}
            <div className="flex items-center gap-2.5 mb-3 sm:mb-5">
              <span className="w-1.5 h-1.5 bg-[#D71920] inline-block shrink-0" />
              <span
                className={`text-xs md:text-[11px] ${
                  light ? 'text-[#565C62]' : 'text-[#A3A8AA]'
                }`}
              >
                RouteOne Auto Club
              </span>
              <span
                className={`w-6 h-[1px] hidden sm:inline-block ${
                  light ? 'bg-black/15' : 'bg-[#ffffff26]'
                }`}
              />
              <span
                className={`text-[11px] hidden sm:inline-block ${
                  light ? 'text-[#8C6D23]' : 'text-[#D6C08A]'
                }`}
              >
                F1 specification
              </span>
            </div>

            {/* Main Heading: DRIVE THE EXTRAORDINARY. */}
            <h1
              id="hero-heading"
              style={light ? undefined : { textShadow: '0 2px 24px rgba(0,0,0,0.35)' }}
              className={`font-heading hero-display text-[2.15rem] sm:text-5xl md:text-6xl xl:text-[4.25rem] font-extrabold leading-[0.95] uppercase mb-4 sm:mb-6 transition-colors duration-200 ${
                light ? 'text-[#111415]' : 'text-[#F7F6F2]'
              }`}
            >
              DRIVE THE
              <br />
              EXTRAORDINARY.
            </h1>

            {/* Supporting Text */}
            <p
              className={`text-sm md:text-base lg:text-lg leading-relaxed max-w-xl mb-6 sm:mb-8 font-light transition-colors duration-200 ${
                light ? 'text-[#3E4347]' : 'text-[#D2D6D7]'
              }`}
            >
              A private automotive destination built around performance, precision, and the art of driving.
            </p>

            {/* CTAs (Touch-optimized with 44px+ targets and tactile states) */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-1 mb-6 sm:mb-8">
              {/* Primary CTA */}
              <button
                id="hero-primary-cta"
                onClick={onOpenBookingModal}
                className="group min-h-[46px] inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#D71920] text-white text-[11px] font-semibold hover:bg-[#b5141a] transition-all duration-200 cursor-pointer shadow-lg shadow-[#D71920]/25 active:scale-[0.98] w-full sm:w-auto"
              >
                <span>Get behind the wheel</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              {/* Secondary CTA */}
              <button
                id="hero-secondary-cta"
                onClick={onExploreCollection}
                className={`group min-h-[46px] inline-flex items-center justify-center gap-2 text-[11px] font-medium px-5 py-3 transition-colors duration-200 cursor-pointer border w-full sm:w-auto ${
                  light
                    ? 'border-black/15 text-[#111415] hover:bg-black/5'
                    : 'border-[#ffffff4d] text-[#F7F6F2] bg-[#00000033] backdrop-blur-sm hover:bg-[#ffffff14]'
                }`}
              >
                <span>Explore collection</span>
                <ArrowDown className="w-3.5 h-3.5 text-[#AEB4B5] group-hover:text-[#D71920] transition-colors" />
              </button>
            </div>

            {/* Micro Brand Statement */}
            <div
              className={`flex items-center gap-4 text-[11px] sm:text-xs pt-3 sm:pt-4 border-t max-w-md ${
                light
                  ? 'border-black/[0.1] text-[#565C62]'
                  : 'border-[#ffffff26] text-[#C4C9CA]'
              }`}
            >
              <span>Precision</span>
              <span className={light ? 'text-black/20' : 'text-[#ffffff4d]'}>•</span>
              <span>Performance</span>
              <span className={light ? 'text-black/20' : 'text-[#ffffff4d]'}>•</span>
              <span>Experience</span>
            </div>
          </div>

          {/* Right Column: Clean, Unobstructed Canvas */}
          <div className="lg:col-span-5 xl:col-span-6 pointer-events-none min-h-[40px] sm:min-h-[100px] lg:min-h-[420px]" />
        </div>
      </div>

      {/* Section 13: Hero Performance Data Strip */}
      <div
        className={`relative z-10 mt-6 sm:mt-8 lg:mt-10 pt-4 sm:pt-6 pb-2 px-4 sm:px-6 md:px-8 border-t backdrop-blur-xl rounded-sm transition-colors duration-300 ${
          isCompact
            ? 'border-[#ffffff1a] bg-[#0A0C0D]/70'
            : isGarageLight
            ? 'border-black/[0.08] bg-[#F4F3EF]/95 shadow-[0_-8px_24px_rgba(244,243,239,0.9)]'
            : 'border-white/[0.08] bg-[#0B0D0E]/95 shadow-[0_-8px_24px_rgba(11,13,14,0.9)]'
        }`}
      >
        {/* Mobile & Tablet: Clean 2x2 Telemetry Cards */}
        <div className="lg:hidden space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-[#ffffff14]">
            <span className="text-[11px] text-[#D71920] font-semibold">
              Why RouteOne
            </span>
            <span className={`text-[11px] ${light ? 'text-[#565C62]' : 'text-[#A3A8AA]'}`}>
              Live metrics
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className={`p-2.5 border rounded-sm ${light ? 'border-black/10 bg-white/50' : 'border-[#ffffff1f] bg-[#ffffff0d]'}`}>
                            <span className={`font-heading text-sm block ${light ? 'text-[#111415]' : 'text-[#F7F6F2]'}`}>
                Aerodynamics
              </span>
              <span className={`text-[11px] block mt-0.5 ${light ? 'text-[#565C62]' : 'text-[#A3A8AA]'}`}>
                Venturi ground effect
              </span>
            </div>
            <div className={`p-2.5 border rounded-sm ${light ? 'border-black/10 bg-white/50' : 'border-[#ffffff1f] bg-[#ffffff0d]'}`}>
                            <span className={`font-heading text-sm block ${light ? 'text-[#111415]' : 'text-[#F7F6F2]'}`}>
                Precision
              </span>
              <span className={`text-[11px] block mt-0.5 ${light ? 'text-[#565C62]' : 'text-[#A3A8AA]'}`}>
                100 Hz telemetry
              </span>
            </div>
            <div className={`p-2.5 border rounded-sm ${light ? 'border-black/10 bg-white/50' : 'border-[#ffffff1f] bg-[#ffffff0d]'}`}>
                            <span className={`font-heading text-sm block ${light ? 'text-[#111415]' : 'text-[#F7F6F2]'}`}>
                Track
              </span>
              <span className={`text-[11px] block mt-0.5 ${light ? 'text-[#565C62]' : 'text-[#A3A8AA]'}`}>
                Silverstone circuit
              </span>
            </div>
            <div className={`p-2.5 border rounded-sm ${light ? 'border-black/10 bg-white/50' : 'border-[#ffffff1f] bg-[#ffffff0d]'}`}>
                            <span className={`font-heading text-sm block ${light ? 'text-[#111415]' : 'text-[#F7F6F2]'}`}>
                Experience
              </span>
              <span className={`text-[11px] block mt-0.5 ${light ? 'text-[#565C62]' : 'text-[#A3A8AA]'}`}>
                One-on-one coaching
              </span>
            </div>
          </div>
        </div>

        {/* Desktop: Sleek 5-Column Divided Strip */}
        <div
          className={`hidden lg:grid grid-cols-5 divide-x items-center ${
            isGarageLight ? 'divide-black/[0.08]' : 'divide-white/[0.08]'
          }`}
        >
          {/* Header column */}
          <div className="pr-4">
            <span className="text-[11px] text-[#D71920] block font-semibold mb-0.5">
              Why RouteOne
            </span>
            <span
              className={`font-heading text-lg ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}
            >
              Performance
            </span>
          </div>

          {/* 01 AERODYNAMICS */}
          <div className="px-6">
            <span
              className={`font-heading text-base block ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}
            >
              Aerodynamics
            </span>
            <span
              className={`text-[11px] block mt-0.5 ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              Active venturi ground effect
            </span>
          </div>

          {/* 02 PRECISION */}
          <div className="px-6">
            <span
              className={`font-heading text-base block ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}
            >
              Precision
            </span>
            <span
              className={`text-[11px] block mt-0.5 ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              100 Hz live telemetry
            </span>
          </div>

          {/* 03 TRACK */}
          <div className="px-6">
            <span
              className={`font-heading text-base block ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}
            >
              Track
            </span>
            <span
              className={`text-[11px] block mt-0.5 ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              Silverstone proving ground
            </span>
          </div>

          {/* 04 EXPERIENCE */}
          <div className="pl-6">
            <span
              className={`font-heading text-base block ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}
            >
              Experience
            </span>
            <span
              className={`text-[11px] block mt-0.5 ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              One-on-one coaching
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
