import { createPortal } from 'react-dom';
import React, { useState } from 'react';
import { Play, X, Film, ExternalLink, Sparkles } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// "Eyes on Me" by Ken Tiosejo, played with Google Drive's player (the file is shared with anyone who has the link)
const FILM_ID = '1p_8ybBOsUEG8Mv59QSbjsDqgQTxcKOcG';
const FILM_EMBED = `https://drive.google.com/file/d/${FILM_ID}/preview`;
const FILM_URL = `https://drive.google.com/file/d/${FILM_ID}/view`;

export const Showreel: React.FC = () => {
  const { isGarageLight } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      id="showreel-section"
      className={`w-full px-6 md:px-10 py-16 sm:py-24 border-b transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#FFFFFF] border-black/[0.08]'
          : 'bg-[#0B0D0E] border-white/[0.08]'
      }`}
    >
      {/* Editorial Hairline Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between pb-5 mb-8 sm:mb-10 border-b transition-colors duration-300 gap-3 ${
          isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.08]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#D71920]" />
            <span
              className={`text-xs ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              Showreel
            </span>
          </div>
          <h2
            className={`font-heading text-2xl sm:text-3xl lg:text-4xl uppercase font-semibold ${
              isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
            }`}
          >
            CIRCUIT CINEMATOGRAPHY
          </h2>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <span className="text-xs px-2.5 py-1 bg-[#D71920]/10 text-[#D71920] border border-[#D71920]/30 font-semibold">
            Original film
          </span>
          <span
            className={`text-xs ${
              isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
            }`}
          >
            Edited by Ken Tiosejo
          </span>
        </div>
      </div>

      {/* Cinematic Showcase Frame */}
      <div
        className={`relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden border group cursor-pointer transition-all duration-500 showreel-frame dark-media-canvas ${
          isGarageLight
            ? 'border-black/10 bg-[#0E1012] hover:border-black/30 shadow-lg'
            : 'border-white/10 bg-[#0E1012] hover:border-white/25 shadow-2xl'
        }`}
        onClick={() => setIsOpen(true)}
      >
        {/* Crisp Local High-Resolution F1 Track Visual */}
        <img
          src="/images/f1/f1-racing-dna.webp"
          alt="Eyes on Me, a RouteOne film"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          loading="lazy"
        />

        {/* Multi-layered Contrast Scrim for Maximum Text Visibility on Race Car Imagery */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/60 pointer-events-none" />
        <div className="absolute inset-0 bg-black/30 pointer-events-none" />

        {/* Corner Telemetry Tags */}
        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 pointer-events-none z-10">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D71920] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D71920]"></span>
          </span>
          <span
            className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 border border-white/20 shadow-md showreel-badge"
            style={{ color: '#FFFFFF', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          >
            RouteOne original
          </span>
        </div>

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 pointer-events-none hidden sm:block z-10">
          <span
            className="text-[11px] font-semibold px-2.5 py-1 border border-[#FCD34D]/40 shadow-md showreel-gold"
            style={{ color: '#FCD34D', backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
          >
            Edited by Ken Tiosejo
          </span>
        </div>

        {/* Center: Play Trigger & Cinematic Copy with Guaranteed High-Contrast Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center select-none z-10">
          <button
            id="play-showreel-button"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-white/40 bg-[#D71920] hover:bg-[#b5141a] text-white flex items-center justify-center transition-all duration-300 cursor-pointer mb-3 sm:mb-5 shadow-[0_0_35px_rgba(215,25,32,0.65)] group-hover:scale-110 active:scale-95"
            aria-label="Play Eyes on Me, a RouteOne film"
          >
            <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-white ml-1 transition-transform group-hover:scale-105" />
          </button>

          {/* Primary Title with High-Contrast Text-Shadow */}
          <h3
            className="font-heading text-2xl sm:text-4xl md:text-5xl font-bold uppercase mb-2 showreel-title drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)]"
            style={{
              color: '#FFFFFF',
              textShadow: '0 2px 14px rgba(0,0,0,0.95), 0 4px 30px rgba(0,0,0,0.95)',
            }}
          >
            EYES ON ME
          </h3>

          {/* Subtitle with High-Contrast Text-Shadow */}
          <p
            className="text-xs sm:text-sm max-w-xl mb-5 showreel-subtitle drop-shadow-[0_1px_8px_rgba(0,0,0,0.95)]"
            style={{
              color: '#E2E8F0',
              textShadow: '0 1px 8px rgba(0,0,0,0.95)',
            }}
          >
            A RouteOne Auto Club film · edited by Ken Tiosejo
          </p>

          {/* Call-to-Action Pill Badge */}
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 group-hover:border-white/60 text-xs sm:text-xs transition-all shadow-lg group-hover:scale-105 showreel-badge"
            style={{
              color: '#FFFFFF',
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D71920]" />
            <span className="font-semibold">Watch the film</span>
          </span>
        </div>
      </div>

      {/* Understated Performance Data Strip with Hairline Dividers */}
      <div
        className={`mt-6 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-6 text-xs transition-colors duration-300 ${
          isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.08]'
        }`}
      >
        <div>
          <span
            className={`text-[11px] block mb-1 font-semibold ${
              isGarageLight ? 'text-[#85898A]' : 'text-[#85898A]'
            }`}
          >
            Title
          </span>
          <span
            className={`text-xs sm:text-sm font-semibold tracking-wider ${
              isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
            }`}
          >
            Eyes on Me
          </span>
        </div>

        <div>
          <span
            className={`text-[11px] block mb-1 font-semibold ${
              isGarageLight ? 'text-[#85898A]' : 'text-[#85898A]'
            }`}
          >
            Edited by
          </span>
          <span
            className={`text-xs sm:text-sm font-semibold tracking-wider ${
              isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
            }`}
          >
            Ken Tiosejo
          </span>
        </div>

        <div>
          <span
            className={`text-[11px] block mb-1 font-semibold ${
              isGarageLight ? 'text-[#85898A]' : 'text-[#85898A]'
            }`}
          >
            Produced for
          </span>
          <span
            className={`text-xs sm:text-sm font-semibold tracking-wider ${
              isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
            }`}
          >
            RouteOne Auto Club
          </span>
        </div>

        <div>
          <span
            className={`text-[11px] block mb-1 font-semibold ${
              isGarageLight ? 'text-[#85898A]' : 'text-[#85898A]'
            }`}
          >
            Format
          </span>
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#D71920]">
            Video · sound on
          </span>
        </div>
      </div>

      {/* Film player (Google Drive) */}
      {isOpen && createPortal(
        <div
          id="showreel-modal"
          className="fixed inset-0 z-[80] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl bg-[#0B0D0E] border border-white/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-3.5 sm:p-4 border-b border-white/[0.12] bg-[#0E1012]">
              <div className="flex items-center gap-2.5">
                <span className="w-1.5 h-1.5 bg-[#D71920]" />
                <span
                  className="text-[11px] font-semibold modal-title"
                  style={{ color: '#FFFFFF' }}
                >
                  Eyes on Me · a RouteOne film
                </span>
              </div>
              <button
                id="showreel-close-button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-[#D71920] hover:bg-white/[0.08] transition-colors cursor-pointer rounded"
                style={{ color: '#D1D5DB' }}
                aria-label="Close video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                title="Eyes on Me, edited by Ken Tiosejo"
                src={FILM_EMBED}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* In-Modal Metadata Strip */}
            <div className="p-3.5 sm:p-4 bg-[#111415] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3 text-xs ">
              <div className="flex items-center gap-2" style={{ color: '#E2E8F0' }}>
                <Film className="w-3.5 h-3.5 text-[#D71920]" />
                <span>Edited by Ken Tiosejo</span>
              </div>
              <a
                href={FILM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-[#D71920] transition-colors font-semibold"
                style={{ color: '#FFFFFF' }}
              >
                <span>Open in Google Drive</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};
