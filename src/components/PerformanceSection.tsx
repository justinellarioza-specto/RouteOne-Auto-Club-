import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const PerformanceSection: React.FC = () => {
  const { isGarageLight } = useTheme();

  return (
    <section
      id="performance-technical-section"
      className={`w-full px-6 md:px-10 py-16 border-b transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#FFFFFF] border-black/[0.08]'
          : 'bg-[#0B0D0E] border-white/[0.08]'
      }`}
    >
      {/* Section Header: 02 / PERFORMANCE */}
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
              Performance
            </span>
          </div>
          <h2
            className={`font-heading text-3xl sm:text-4xl font-semibold uppercase leading-tight ${
              isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
            }`}
          >
            ENGINEERED
            <br />
            FOR SPEED.
          </h2>
        </div>

        <div
          className={`text-xs flex items-center gap-3 ${
            isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
          }`}
        >
          <span>Motorsport discipline</span>
          <span className={`w-4 h-[1px] ${isGarageLight ? 'bg-black/20' : 'bg-white/20'}`} />
          <span className="text-[#D71920] font-semibold">F1 telemetry</span>
        </div>
      </div>

      {/* Grid: Large F1 Car Image + Beside it 3 Technical Pillars with Thin Technical Lines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Large F1 Car / Aerodynamic Chassis Image */}
        <div className="lg:col-span-7 relative">
          <div
            className={`relative border p-3 sm:p-4 rounded-sm transition-colors duration-300 ${
              isGarageLight
                ? 'bg-[#F6F7F5] border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.04)]'
                : 'bg-[#111415] border-white/[0.08]'
            }`}
          >
            {/* Corner brackets */}
            <div
              className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${
                isGarageLight ? 'border-black/40' : 'border-white/30'
              }`}
            />
            <div
              className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${
                isGarageLight ? 'border-black/40' : 'border-white/30'
              }`}
            />
            <div
              className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${
                isGarageLight ? 'border-black/40' : 'border-white/30'
              }`}
            />
            <div
              className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${
                isGarageLight ? 'border-black/40' : 'border-white/30'
              }`}
            />

            <div className="relative aspect-[16/10] overflow-hidden bg-black flex items-center justify-center rounded-sm">
              <img
                src="/images/f1/f1-performance.webp"
                alt="Modern Formula 1 single-seater aerodynamic downforce and ground effect engineering"
                className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.1]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />

              {/* In-image Technical Annotation */}
              <div
                className={`absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs px-3 py-1.5 border backdrop-blur-md ${
                  isGarageLight
                    ? 'bg-white/90 border-black/10 text-[#3E4347]'
                    : 'bg-[#0B0D0E]/90 border-white/[0.08] text-[#85898A]'
                }`}
              >
                <span className={isGarageLight ? 'text-[#111415] font-medium' : 'text-[#F4F3EF]'}>
                  Venturi tunnel downforce envelope
                </span>
                <span className="text-[#D71920] font-semibold">FIA homologated</span>
              </div>
            </div>

            <div
              className={`flex items-center justify-between mt-3 px-1 text-[11px] ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              <span>Tunnel-optimized diffuser flow</span>
              <span>Pressure delta: -420 mbar</span>
            </div>
          </div>
        </div>

        {/* Beside it: 3 Technical Breakdown Blocks with Thin Technical Lines */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          {/* Pillar 01: AERODYNAMICS */}
          <div
            className={`relative pl-6 border-l group hover:border-[#D71920] transition-colors ${
              isGarageLight ? 'border-black/15' : 'border-white/[0.12]'
            }`}
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <h3
                className={`font-heading text-xl font-medium ${
                  isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                }`}
              >
                Aerodynamics
              </h3>
              <span className="text-[12px] text-[#D71920] font-semibold">
                01
              </span>
            </div>
            <p
              className={`text-sm font-light leading-relaxed mb-1 ${
                isGarageLight ? 'text-[#2B3035]' : 'text-[#AEB4B5]'
              }`}
            >
              Precision airflow sculpting downforce.
            </p>
            <p
              className={`text-xs font-light leading-relaxed ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              Maximum cornering velocity without drag penalty.
            </p>
            {/* Thin technical line */}
            <div
              className={`w-full h-[1px] mt-4 ${
                isGarageLight ? 'bg-black/[0.08]' : 'bg-white/[0.06]'
              }`}
            />
          </div>

          {/* Pillar 02: ENGINEERING */}
          <div
            className={`relative pl-6 border-l group hover:border-[#D71920] transition-colors ${
              isGarageLight ? 'border-black/15' : 'border-white/[0.12]'
            }`}
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <h3
                className={`font-heading text-xl font-medium ${
                  isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                }`}
              >
                Engineering
              </h3>
              <span className="text-[12px] text-[#D71920] font-semibold">
                02
              </span>
            </div>
            <p
              className={`text-sm font-light leading-relaxed mb-1 ${
                isGarageLight ? 'text-[#2B3035]' : 'text-[#AEB4B5]'
              }`}
            >
              Every component machined to tolerance.
            </p>
            <p
              className={`text-xs font-light leading-relaxed ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              Carbon tub rigidity calibrated for pure feedback.
            </p>
            {/* Thin technical line */}
            <div
              className={`w-full h-[1px] mt-4 ${
                isGarageLight ? 'bg-black/[0.08]' : 'bg-white/[0.06]'
              }`}
            />
          </div>

          {/* Pillar 03: DRIVER */}
          <div
            className={`relative pl-6 border-l group hover:border-[#D71920] transition-colors ${
              isGarageLight ? 'border-black/15' : 'border-white/[0.12]'
            }`}
          >
            <div className="flex items-baseline justify-between mb-1.5">
              <h3
                className={`font-heading text-xl font-medium ${
                  isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                }`}
              >
                Driver
              </h3>
              <span className="text-[12px] text-[#D71920] font-semibold">
                03
              </span>
            </div>
            <p
              className={`text-sm font-light leading-relaxed mb-1 ${
                isGarageLight ? 'text-[#2B3035]' : 'text-[#AEB4B5]'
              }`}
            >
              Performance begins with poise and control.
            </p>
            <p
              className={`text-xs font-light leading-relaxed ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              Real-time telemetry overlay for driver development.
            </p>
            {/* Thin technical line */}
            <div
              className={`w-full h-[1px] mt-4 ${
                isGarageLight ? 'bg-black/[0.08]' : 'bg-white/[0.06]'
              }`}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
