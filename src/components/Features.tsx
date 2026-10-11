import React from 'react';
import { Gauge, Shield, Flag } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface FeaturesProps {
  onLearnMore?: () => void;
}

export const Features: React.FC<FeaturesProps> = ({ onLearnMore }) => {
  const { isGarageLight } = useTheme();

  const pillars = [
    {
      title: 'Curated machines',
      desc: 'A bespoke selection of exotic, track-honed, and performance-focused vehicles.',
      icon: Gauge,
      code: 'Curation',
    },
    {
      title: 'Private access',
      desc: 'Personalized appointments, discrete viewings, and VIP telemetry lounges.',
      icon: Shield,
      code: 'Exclusivity',
    },
    {
      title: 'Track experience',
      desc: 'Take performance beyond the showroom with real circuit shakedowns.',
      icon: Flag,
      code: 'On track',
    },
  ];

  return (
    <section
      id="why-routeone-section"
      className={`w-full px-6 md:px-10 py-16 border-b transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#F6F7F5] border-black/[0.08]'
          : 'bg-[#0B0D0E] border-white/[0.08]'
      }`}
    >
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-10 border-b gap-4 transition-colors duration-300 ${
          isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.06]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1.5 h-1.5 bg-[#D71920]" />
            <span
              className={`text-xs ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              Why RouteOne
            </span>
          </div>
          <h2
            className={`font-heading text-3xl sm:text-4xl font-semibold uppercase leading-tight ${
              isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
            }`}
          >
            BUILT AROUND
            <br />
            THE DRIVE.
          </h2>
        </div>

        <span
          className={`text-xs ${
            isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'
          }`}
        >
          The motorsport ethos
        </span>
      </div>

      {/* 3 Features with technical icons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              className={`p-6 border transition-all duration-300 ease-out flex flex-col justify-between group relative overflow-hidden rounded-sm ${
                isGarageLight
                  ? 'bg-white border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:border-[#D71920]/50 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1'
                  : 'bg-[#111415] border-white/[0.08] hover:border-[#D8B52A]/40 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.8),0_0_22px_rgba(216,181,42,0.18)] hover:-translate-y-1'
              }`}
            >
              {/* Dynamic Top Border Glow on Hover */}
              <div
                className={`absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10 ${
                  isGarageLight
                    ? 'bg-[#D71920]'
                    : 'bg-gradient-to-r from-transparent via-[#D8B52A] to-transparent'
                }`}
              />
              <div>
                <div className="flex items-center justify-between mb-4">
                  {/* Small technical icon */}
                  <div
                    className={`w-7 h-7 border flex items-center justify-center rounded-sm ${
                      isGarageLight
                        ? 'border-black/10 bg-[#F6F7F5] text-[#111415]'
                        : 'border-white/10 bg-black/40 text-[#AEB4B5]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-[11px] ${
                      isGarageLight ? 'text-[#8C9399]' : 'text-[#45494A]'
                    }`}
                  >
                    {pillar.code}
                  </span>
                </div>

                <h3
                  className={`font-heading text-lg font-medium mb-2 ${
                    isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                  }`}
                >
                  {pillar.title}
                </h3>

                <p
                  className={`text-xs font-light leading-relaxed mb-6 ${
                    isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                  }`}
                >
                  {pillar.desc}
                </p>
              </div>

              <div
                className={`pt-3 border-t flex items-center justify-between text-xs ${
                  isGarageLight
                    ? 'border-black/[0.06] text-[#8C9399]'
                    : 'border-white/[0.06] text-[#45494A]'
                }`}
              >
                <span>Benchmark</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D71920]" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
