import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AboutProps {
  onLearnMore?: () => void;
  onOpenBookingModal: () => void;
}

export const About: React.FC<AboutProps> = ({ onOpenBookingModal }) => {
  const { isGarageLight } = useTheme();

  const pillars = [
    {
      index: '01',
      label: 'Our mission',
      body: 'To emancipate exotic machinery from static museum pedestals into kinetic adrenaline on FIA-grade asphalt.',
    },
    {
      index: '02',
      label: 'What we offer',
      body: 'Curated hypercar acquisitions, private showroom viewings, bespoke circuit track stints, and discrete syndicate allocations.',
    },
    {
      index: '03',
      label: 'Racecraft heritage',
      body: 'Every drive is backed by factory-trained pit technicians, live CAN-bus telemetry debriefs, and 1-on-1 pro driver instruction.',
    },
  ];

  return (
    <section
      id="about-section"
      className={`py-24 md:py-32 border-y transition-colors duration-300 relative ${
        isGarageLight
          ? 'bg-[#FBFBFA] border-black/[0.06] text-[#101214]'
          : 'bg-[#0B0D0E] border-white/[0.06] text-[#F4F4F1]'
      }`}
    >
      <div className="max-w-[1280px] mx-auto w-full px-6 sm:px-10 lg:px-12">
        {/* Minimal Editorial Eyebrow */}
        <div className="flex items-center gap-3 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D71920]" />
          <span
            className={`text-xs ${
              isGarageLight ? 'text-[#7A8086]' : 'text-[#8A8F93]'
            }`}
          >
            About RouteOne
          </span>
        </div>

        {/* Main 2-Column Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Left Column: Typography & Narrative */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className={`font-heading text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-medium uppercase leading-[1.02] ${
                  isGarageLight ? 'text-[#101214]' : 'text-[#F4F4F1]'
                }`}
              >
                PERFORMANCE IS MORE <br />
                THAN A NUMBER.
              </motion.h2>

              <p
                className={`mt-6 text-sm sm:text-base leading-relaxed font-light max-w-xl ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'
                }`}
              >
                <strong className={`font-medium ${isGarageLight ? 'text-[#101214]' : 'text-white'}`}>
                  RouteOne Motorsport &amp; Auto Club
                </strong>{' '}
                bridges the discipline of professional motorsport with private automotive curation. Situated on the proving perimeter of Silverstone Circuit, we connect motorsport purists with uncompromising hypercar machinery and real Grand Prix tarmac.
              </p>
            </div>

            {/* 3 Clean Minimal Pillars (Hairline Separators, No Heavy Card Boxes) */}
            <div className="mt-10 sm:mt-12 pt-8 border-t border-black/[0.08] dark:border-white/[0.08] space-y-6">
              {pillars.map((item) => (
                <div
                  key={item.index}
                  className="grid grid-cols-12 gap-4 items-baseline group"
                >
                  <div className="col-span-3 sm:col-span-2">
                    <span className="block w-6 h-[2px] mt-2 bg-[#D71920] rounded-full" aria-hidden="true" />
                  </div>
                  <div className="col-span-9 sm:col-span-10">
                    <h3
                      className={`text-xs mb-1.5 font-semibold ${
                        isGarageLight ? 'text-[#101214]' : 'text-[#F4F4F1]'
                      }`}
                    >
                      {item.label}
                    </h3>
                    <p
                      className={`text-xs sm:text-[13px] leading-relaxed font-light ${
                        isGarageLight ? 'text-[#5E646A]' : 'text-[#9CA1A5]'
                      }`}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Understated Text Action */}
            <div className="mt-8 pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
              <button
                onClick={onOpenBookingModal}
                className="group inline-flex items-center gap-2.5 text-xs font-semibold text-[#D71920] hover:text-[#b5141a] transition-colors cursor-pointer"
              >
                <span>Inquire private showroom viewing</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </div>
          </div>

          {/* Right Column: Architectural Photography & Restrained Metrics */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Gallery Frame */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xs border border-black/[0.08] dark:border-white/[0.08] group select-none">
              <img
                src="/images/f1/f1-pit-lane-garage.webp"
                alt="RouteOne Private Paddock & Pit Lane at Silverstone"
                className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-700 ease-out"
                loading="lazy"
              />

              {/* Minimal Vignette Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Top Minimal Coordinates */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-[11px] text-[#AEB4B5] ">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>Silverstone proving ground</span>
                </span>
                <span>52.0733° n, 1.0147° w</span>
              </div>

              {/* Bottom Minimal Caption */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="text-[11px] text-[#D8B52A] block font-medium">
                    FIA grade 1 tarmac
                  </span>
                  <span className="text-base sm:text-lg font-heading text-white block font-light">
                    The Private Circuit Sanctuary
                  </span>
                </div>
                <button
                  onClick={onOpenBookingModal}
                  className="px-3.5 py-1.5 bg-white text-black hover:bg-[#D71920] hover:text-white transition-colors duration-200 text-[11px] font-semibold cursor-pointer shadow-sm"
                >
                  Schedule
                </button>
              </div>
            </div>

            {/* Three Minimalist Data Pillars */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="border-t border-black/[0.08] dark:border-white/[0.08] pt-3">
                <span className="font-heading text-2xl sm:text-3xl font-light text-[#D71920] block">
                  3.66<span className="text-xs ml-1 text-[#8B8D8C]">Mi</span>
                </span>
                <span className="text-[11px] text-[#7A8086] block mt-1">
                  Circuit tarmac
                </span>
              </div>

              <div className="border-t border-black/[0.08] dark:border-white/[0.08] pt-3">
                <span className="font-heading text-2xl sm:text-3xl font-light text-[#D8B52A] block">
                  64<span className="text-xs ml-1 text-[#8B8D8C]">Ch</span>
                </span>
                <span className="text-[11px] text-[#7A8086] block mt-1">
                  Can-bus telemetry
                </span>
              </div>

              <div className="border-t border-black/[0.08] dark:border-white/[0.08] pt-3">
                <span className="font-heading text-2xl sm:text-3xl font-light text-emerald-500 block">
                  1:1<span className="text-xs ml-1 text-[#8B8D8C]">Ratio</span>
                </span>
                <span className="text-[11px] text-[#7A8086] block mt-1">
                  Pro coaching
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
