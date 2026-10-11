import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { RouteOneLogo } from './RouteOneLogo';

interface FooterProps {
  onNavigate: (tab: string) => void;
  onOpenBookingModal: () => void;
  onReplayLoading?: () => void;
  onOpenBrandModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenBookingModal,
  onReplayLoading,
  onOpenBrandModal,
}) => {
  const { isGarageLight } = useTheme();

  return (
    <footer
      id="main-footer"
      className={`w-full px-6 md:px-10 py-16 border-t transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#F6F7F5] border-black/[0.08] text-[#565C62]'
          : 'bg-[#0B0D0E] border-white/[0.08] text-[#85898A]'
      }`}
    >
      {/* 3 Minimalist Columns */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 pb-12">
        {/* Left: ROUTEONE AUTO CLUB / PERFORMANCE. PRECISION. EXPERIENCE. */}
        <div className="md:col-span-5 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex flex-row items-center">
              <RouteOneLogo variant="full" className="h-8 w-auto object-contain" />
            </div>

            <p
              className={`font-heading text-xl sm:text-2xl leading-snug mb-3 ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}
            >
              Performance.
              <br />
              Precision.
              <br />
              Experience.
            </p>

            <p
              className={`text-xs font-light leading-relaxed max-w-sm ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              F1-inspired exotic car showroom and high-performance circuit driving hub bridging motorsport discipline with private curation.
            </p>
          </div>
        </div>

        {/* Center: COLLECTION / EXPERIENCE / PERFORMANCE / JOURNAL / CONTACT */}
        <div className="md:col-span-4">
          <span
            className={`text-xs block mb-4 ${
              isGarageLight ? 'text-[#111415] font-semibold' : 'text-[#F4F3EF]'
            }`}
          >
            Navigation
          </span>
          <ul className="space-y-2.5 text-xs ">
            <li>
              <button
                onClick={() => onNavigate('collection')}
                className="hover:text-[#D71920] transition-colors cursor-pointer text-left"
              >
                Collection
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('experience')}
                className="hover:text-[#D71920] transition-colors cursor-pointer text-left"
              >
                Experience
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('performance')}
                className="hover:text-[#D71920] transition-colors cursor-pointer text-left"
              >
                Performance
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('contact')}
                className="hover:text-[#D71920] transition-colors cursor-pointer text-left"
              >
                Contact
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('services')}
                className={`hover:text-[#D71920] transition-colors cursor-pointer text-left ${
                  isGarageLight ? 'text-[#3E4347]' : 'text-[#AEB4B5]'
                }`}
              >
                Services &amp; programs
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate('api-data')}
                className="hover:text-[#D71920] transition-colors cursor-pointer text-left"
              >
                Live API data
              </button>
            </li>
            {onReplayLoading && (
              <li className={`pt-2 border-t ${isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.08]'}`}>
                <button
                  id="footer-replay-speeding-car-btn"
                  onClick={onReplayLoading}
                  className={`hover:text-[#D71920] transition-colors cursor-pointer text-left flex items-center gap-1.5 ${
                    isGarageLight ? 'text-[#3E4347]' : 'text-[#AEB4B5]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 bg-[#D71920] inline-block" />
                  <span>Replay intro</span>
                </button>
              </li>
            )}
            {onOpenBrandModal && (
              <li>
                <button
                  id="footer-brand-dossier-btn"
                  onClick={onOpenBrandModal}
                  className={`hover:text-[#D71920] transition-colors cursor-pointer text-left flex items-center gap-1.5 ${
                    isGarageLight ? 'text-[#3E4347]' : 'text-[#AEB4B5]'
                  }`}
                >
                  <span className="w-1.5 h-1.5 bg-[#D71920] inline-block" />
                  <span>Brand dossier (light/dark logo)</span>
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Right: INSTAGRAM / FACEBOOK / TIKTOK / YOUTUBE */}
        <div className="md:col-span-3">
          <span
            className={`text-xs block mb-4 ${
              isGarageLight ? 'text-[#111415] font-semibold' : 'text-[#F4F3EF]'
            }`}
          >
            Social
          </span>
          <ul className="space-y-2.5 text-xs ">
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D71920] transition-colors"
              >
                Instagram
              </a>
            </li>
            <li>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D71920] transition-colors"
              >
                Facebook
              </a>
            </li>
            <li>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D71920] transition-colors"
              >
                TikTok
              </a>
            </li>
            <li>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#D71920] transition-colors"
              >
                YouTube
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar from Section 32 */}
      <div
        className={`pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs transition-colors duration-300 ${
          isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.08]'
        }`}
      >
        <div className={isGarageLight ? 'text-[#3E4347]' : 'text-[#AEB4B5]'}>
          RouteOne Auto Club © 2026
        </div>
        <div className={isGarageLight ? 'text-[#8C9399]' : 'text-[#85898A]'}>
          Motorsport concierge &amp; proving grounds
        </div>
      </div>
    </footer>
  );
};
