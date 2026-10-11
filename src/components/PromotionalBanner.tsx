import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PromotionalBannerProps {
  onOpenBookingModal: (pref?: string) => void;
}

export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  onOpenBookingModal,
}) => {
  const { isGarageLight } = useTheme();

  return (
    <section
      id="promotional-banner"
      className={`w-full px-6 md:px-10 py-16 border-b transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#F6F7F5] border-black/[0.08]'
          : 'bg-[#0B0D0E] border-white/[0.08]'
      }`}
    >
      <div
        className={`relative border p-6 sm:p-8 md:p-10 overflow-hidden rounded-sm transition-colors duration-300 ${
          isGarageLight
            ? 'bg-white border-black/10 shadow-[0_10px_30px_rgba(0,0,0,0.04)]'
            : 'bg-[#111415] border-white/[0.08]'
        }`}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: Text & CTA */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 bg-[#D71920]" />
              <span
                className={`text-xs ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                }`}
              >
                RouteOne performance series
              </span>
            </div>

            <h2
              className={`font-heading text-3xl sm:text-4xl lg:text-5xl font-semibold uppercase leading-tight mb-3 ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}
            >
              EXPERIENCE THE THRILL.
            </h2>

            <p
              className={`text-sm font-light leading-relaxed max-w-lg mb-8 ${
                isGarageLight ? 'text-[#3E4347]' : 'text-[#85898A]'
              }`}
            >
              Discover our latest F1-inspired performance concept and reserve your private RouteOne experience.
            </p>

            <div>
              <button
                id="banner-cta"
                onClick={() => onOpenBookingModal('RouteOne Performance Series')}
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 bg-[#D71920] text-white text-[11px] font-semibold hover:bg-[#b5141a] transition-all duration-200 cursor-pointer shadow-lg shadow-[#D71920]/20 rounded-sm"
              >
                <span>Get behind the wheel</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Right: Dramatic F1 Car Image */}
          <div className="lg:col-span-5 relative">
            <div
              className={`relative aspect-[16/10] overflow-hidden border bg-black rounded-sm ${
                isGarageLight ? 'border-black/10' : 'border-white/[0.08]'
              }`}
            >
              <img
                src="/images/cars/r1-concept.webp"
                alt="Dramatic F1 performance machine"
                className="w-full h-full object-cover object-center filter brightness-[0.88] contrast-[1.1]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

              <div
                className={`absolute bottom-2 right-2 px-2.5 py-1 text-[11px] border backdrop-blur-md rounded-sm ${
                  isGarageLight
                    ? 'bg-white/90 text-[#111415] border-black/10 font-medium'
                    : 'bg-[#0B0D0E]/90 text-[#AEB4B5] border-white/[0.08]'
                }`}
              >
                Series 01 · R1 concept
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
