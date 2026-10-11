import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Gauge, Zap, Wind, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface FeaturedVehicleProps {
  onOpenBookingModal: (vehicleName?: string) => void;
  onExploreDetails?: () => void;
}

export const FeaturedVehicle: React.FC<FeaturedVehicleProps> = ({
  onOpenBookingModal,
}) => {
  const [activeTab, setActiveTab] = useState<'aero' | 'powertrain' | 'telemetry'>('aero');

  const specs = [
    { label: 'Engine', value: 'V10 PERFORMANCE', sub: 'Atmospheric 9,200 RPM', icon: Zap },
    { label: 'Power', value: '720+ HP', sub: 'Kinetic E-Boost System', icon: Gauge },
    { label: '0–100 KM/H', value: '3.0 SEC', sub: 'Full Launch Protocol', icon: Wind },
    { label: 'Top speed', value: '335+ KM/H', sub: 'Active DRS Low Drag', icon: ShieldCheck },
  ];

  return (
    <section id="featured-machine-section" className="py-24 md:py-32 bg-[#050505] relative overflow-hidden">
      {/* Subtle carbon background grid */}
      <div className="absolute inset-0 bg-subtle-grid opacity-30 pointer-events-none" />

      <div className="max-w-[1120px] mx-auto w-full px-6 md:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 pb-6 border-b border-[#202020] gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-1.5 h-1.5 bg-[#E10600]" />
              <span className="text-[11px] font-medium text-[#8A8A8A]">
                Featured machine / 01
              </span>
            </div>
            <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl text-white font-normal leading-tight">
              THE NEW ROUTEONE EXPERIENCE
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-[#101010] border border-[#202020] text-[#E10600] text-[11px] ">
              RouteOne concept
            </span>
            <span className="text-[11px] text-[#8A8A8A] ">
              Allocation: 2026/27
            </span>
          </div>
        </div>

        {/* Hero Machine Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Visual Image (Large cinematic) */}
          <div className="lg:col-span-7 relative group">
            <div className="relative overflow-hidden border border-[#202020] bg-[#101010]">
              <motion.img
                src="/images/cars/valkyrie-amr.webp"
                alt="RouteOne R1 Concept Track Supercar"
                className="w-full h-[380px] sm:h-[460px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-90 contrast-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />

              {/* In-image overlay details */}
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-xs text-[#E10600] block mb-1">
                    Project protocol / R1
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-editorial text-white">
                    RouteOne R1
                  </h3>
                  <p className="text-xs text-[#8A8A8A] max-w-sm mt-1">
                    Carbon monocoque architecture paired with active underbody venturi aerodynamics.
                  </p>
                </div>
                <span className="hidden sm:block text-xs text-white/60 bg-black/70 px-3 py-1.5 border border-[#202020]">
                  Silverstone spec
                </span>
              </div>
            </div>

            {/* Fictional Concept Disclaimer */}
            <p className="text-[11px] text-[#4A4A4A] mt-2 italic">
              * RouteOne Concept — Fictional automotive specification designed for RouteOne Auto Club academic showcase.
            </p>
          </div>

          {/* Machine Info Panel & Specifications */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-6">
            <div className="bg-[#0A0A0A] border border-[#202020] p-6 sm:p-8">
              <div className="flex items-center justify-between pb-4 border-b border-[#202020] mb-4">
                <span className="text-xs text-white font-semibold">
                  Aerodynamic & chassis matrix
                </span>
                <span className="w-2 h-2 rounded-full bg-[#E10600]" />
              </div>

              <p className="text-[#8A8A8A] text-sm leading-relaxed mb-6">
                An F1-inspired performance concept created around aerodynamic efficiency,
                driver engagement, and uncompromising design. Developed to bridge the raw sensory input
                of an open-wheel racing car with the endurance capability of a modern GT prototype.
              </p>

              {/* Feature Checkpoints */}
              <div className="space-y-2.5 mb-6 text-xs text-[#FFFFFF]">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E10600] shrink-0" />
                  <span>Full Pre-Preg Carbon Fiber Monocoque Chassis</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E10600] shrink-0" />
                  <span>Pushrod Inboard Kinematic Damping System</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E10600] shrink-0" />
                  <span>Dual Active DRS Wings with Automatic Braking Airflap</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#E10600] shrink-0" />
                  <span>Integrated Real-Time FIA Telemetry Recording Suite</span>
                </div>
              </div>

              {/* CTA Action */}
              <button
                id="discover-r1-cta"
                onClick={() => onOpenBookingModal('RouteOne R1 Concept')}
                className="w-full py-3.5 bg-[#E10600] hover:bg-[#b50500] text-white font-semibold text-xs transition-all flex items-center justify-center gap-3 cursor-pointer shadow-lg active:scale-98"
              >
                <span>Discover the R1 ↗</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Performance Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {specs.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="bg-[#0A0A0A] border border-[#202020] p-5 hover:border-[#E10600]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-[#8A8A8A] ">
                    {item.label}
                  </span>
                  <Icon className="w-4 h-4 text-[#E10600]" />
                </div>
                <p className="text-xl sm:text-2xl font-bold text-white font-sans-ui tracking-wide">
                  {item.value}
                </p>
                <span className="text-[11px] text-[#4A4A4A] block mt-1">
                  {item.sub}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
