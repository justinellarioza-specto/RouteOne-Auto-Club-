import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const PitLaneSection: React.FC = () => {
  const { isGarageLight } = useTheme();

  return (
    <section
      id="pit-lane-section"
      className={`w-full px-6 md:px-10 py-16 border-b relative overflow-hidden transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#FFFFFF] border-black/[0.08]'
          : 'bg-[#0B0D0E] border-white/[0.08]'
      }`}
    >
      {/* Background Graphic Grid / Paddock Depth */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left: Heading with subtle red vertical line & Text */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-1.5 bg-[#D71920]" />
            <span
              className={`text-xs ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              Paddock & pit lane
            </span>
          </div>

          {/* Heading with subtle red vertical line */}
          <div className="pl-5 border-l-2 border-[#D71920] mb-6">
            <h2
              className={`font-heading text-4xl sm:text-5xl lg:text-6xl font-semibold uppercase leading-[0.95] ${
                isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
              }`}
            >
              BEHIND
              <br />
              THE MACHINE.
            </h2>
          </div>

          <p
            className={`text-sm md:text-base font-light leading-relaxed max-w-md mb-8 ${
              isGarageLight ? 'text-[#2B3035]' : 'text-[#AEB4B5]'
            }`}
          >
            Performance is built long before the lights go out.
          </p>

          {/* Pit Lane Technical Details */}
          <div
            className={`space-y-4 text-xs border-t pt-6 transition-colors duration-300 ${
              isGarageLight
                ? 'border-black/[0.08] text-[#565C62]'
                : 'border-white/[0.06] text-[#85898A]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={isGarageLight ? 'text-[#111415] font-medium' : 'text-[#F4F3EF]'}>
                Carbon monocoque tub
              </span>
              <span className="text-[#D71920] font-semibold">Pre-preg T1000G</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isGarageLight ? 'text-[#111415] font-medium' : 'text-[#F4F3EF]'}>
                Pneumatic wheel guns
              </span>
              <span className={isGarageLight ? 'text-[#3E4347]' : 'text-[#AEB4B5]'}>
                30 bar / 1.9S stops
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className={isGarageLight ? 'text-[#111415] font-medium' : 'text-[#F4F3EF]'}>
                Telemetry bus
              </span>
              <span className={isGarageLight ? 'text-[#3E4347]' : 'text-[#AEB4B5]'}>
                120 sensors real-time
              </span>
            </div>
          </div>
        </div>

        {/* Right: Visual collage inspired by an F1 pit garage */}
        <div className="lg:col-span-7">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Garage Race Car & Pit Lane Silhouette */}
            <div
              className={`col-span-2 relative aspect-[21/9] overflow-hidden border bg-black rounded-sm ${
                isGarageLight ? 'border-black/10 shadow-sm' : 'border-white/[0.08]'
              }`}
            >
              <img
                src="/images/f1/f1-pit-lane-garage.webp"
                alt="Formula 1 paddock garage and single-seater race car on display"
                className="w-full h-full object-cover filter brightness-[0.85] contrast-[1.1]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-3 text-[11px] text-[#AEB4B5]">
                Garage bay 01 · pit wall active
              </div>
            </div>

            {/* Steering Wheel & Controls */}
            <div
              className={`relative aspect-[4/3] overflow-hidden border bg-black rounded-sm ${
                isGarageLight ? 'border-black/10 shadow-sm' : 'border-white/[0.08]'
              }`}
            >
              <img
                src="/images/cars/haas-vf24.webp"
                alt="Motorsport steering wheel and telemetry cockpit"
                className="w-full h-full object-cover filter brightness-[0.78] contrast-[1.1]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 text-[11px] sm:text-[11px] text-[#AEB4B5]">
                Cockpit · DRS interface
              </div>
            </div>

            {/* Racing Tires / Aerodynamic Carbon Wing */}
            <div
              className={`relative aspect-[4/3] overflow-hidden border bg-black rounded-sm ${
                isGarageLight ? 'border-black/10 shadow-sm' : 'border-white/[0.08]'
              }`}
            >
              <img
                src="/images/cars/sauber-c44.webp"
                alt="Race tires and carbon fiber aero details"
                className="w-full h-full object-cover filter brightness-[0.78] contrast-[1.1]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 text-[11px] sm:text-[11px] text-[#AEB4B5]">
                Tire warmers · hard compound
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
