import React, { useState } from 'react';
import { Gauge, Flag, Shield, Cpu, ArrowRight } from 'lucide-react';

interface FeaturesPageProps {
  onOpenBookingModal: (preference?: string) => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onOpenBookingModal }) => {
  const [circuitSpeed, setCircuitSpeed] = useState<number>(240);
  const [drsActive, setDrsActive] = useState<boolean>(false);

  const downforceKg = drsActive ? Math.round((circuitSpeed / 300) * 380) : Math.round((circuitSpeed / 300) * 820);
  const dragCoeff = drsActive ? 0.31 : 0.44;
  const lateralGForce = (1.4 + (circuitSpeed / 300) * 1.6).toFixed(2);

  const pillars = [
    {
      id: 'curated',
      icon: Gauge,
      title: 'Curated machines',
      tagline: 'A carefully selected collection of performance-focused vehicles.',
      desc: 'Our fleet is chosen strictly from machines utilizing carbon monocoques, dry-sump lubrication, pushrod inboard geometry, and high-revving naturally aspirated or twin-turbocharged architectures.',
      metrics: [
        { label: 'Average power', value: '720+ HP' },
        { label: 'Power-to-weight', value: '610 HP/T' },
        { label: '0–200 KM/H', value: '7.8 SEC' },
      ],
    },
    {
      id: 'private-access',
      icon: Shield,
      title: 'Private access',
      tagline: 'Personalized appointments designed around the individual client.',
      desc: 'Discreet member allocations, private lounges, and closed-circuit test sessions. Showroom viewings are private by default, granting uninterrupted access to inspect vehicle chassis and discuss provenance.',
      metrics: [
        { label: 'Max cars on tarmac', value: '6 PER STINT' },
        { label: 'Client ratio', value: 'One-on-one' },
        { label: 'Members lounge', value: 'VIP PADDOCK' },
      ],
    },
    {
      id: 'track-experience',
      icon: Flag,
      title: 'Track experience',
      tagline: 'Experience performance beyond the showroom.',
      desc: 'Before rolling out of pit lane, drivers participate in telemetry debriefs analyzing brake pressure traces, apex clipping points, and trail-braking transition zones on FIA-grade circuit tarmac.',
      metrics: [
        { label: 'Cornering force', value: 'Up to 2.4G' },
        { label: 'Telemetry channels', value: '64 SENSORS' },
        { label: 'Instructor ratio', value: 'One-on-one' },
      ],
    },
    {
      id: 'telemetry-tech',
      icon: Cpu,
      title: 'Aerodynamic telemetry',
      tagline: 'Live CAN-bus data logging, active aerodynamic models, and digital twins.',
      desc: 'Every stint is recorded via dual HD cockpit cameras synced with throttle position, brake pressure, and steering angle overlays. Review lap deltas in the paddock lounge with your coach.',
      metrics: [
        { label: 'Logging frequency', value: '100 HZ' },
        { label: 'Video resolution', value: '4K 60FPS' },
        { label: 'Data delta accuracy', value: '0.001 SEC' },
      ],
    },
  ];

  return (
    <div id="features-page" className="w-full px-6 md:px-10 py-16 bg-[#111314]">
      {/* Page Header */}
      <div className="pb-8 mb-12 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 bg-[#D8B52A]" />
          <span className="text-xs text-[#8B8D8C]">
            Motorsport ethos
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-[#F4F4F1] font-semibold uppercase mb-4">
          WHY ROUTEONE
        </h1>

        <p className="text-sm text-[#8B8D8C] font-light leading-relaxed max-w-xl">
          Engineered around the visceral sensation of motorsport. Curated exotic machinery, private paddock hospitality, and circuit telemetry precision.
        </p>
      </div>

      {/* 4 Feature Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.id}
              className="bg-[#151718] border border-white/[0.08] hover:border-[#D8B52A]/40 hover:shadow-[0_18px_36px_-8px_rgba(0,0,0,0.8),0_0_24px_rgba(216,181,42,0.18)] hover:-translate-y-1.5 p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ease-out group relative overflow-hidden"
            >
              {/* Dynamic Top Border Glow on Hover */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D8B52A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-[#8B8D8C] group-hover:text-[#D8B52A] group-hover:border-[#D8B52A]/40 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h2 className="font-heading text-xl text-[#F4F4F1] font-medium mb-2 group-hover:text-white transition-colors">
                  {pillar.title}
                </h2>

                <p className="text-xs text-[#D8B52A] mb-4 ">
                  {pillar.tagline}
                </p>

                <p className="text-xs sm:text-sm text-[#8B8D8C] font-light leading-relaxed mb-6">
                  {pillar.desc}
                </p>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/[0.06]">
                {pillar.metrics.map((m, idx) => (
                  <div key={idx} className="p-2.5 bg-[#111314] border border-white/[0.06] hover:border-white/20 hover:bg-[#131516] transition-all duration-200">
                    <span className="text-[11px] text-[#505251] block ">
                      {m.label}
                    </span>
                    <span className="font-heading text-xs text-[#F4F4F1] font-medium">
                      {m.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Telemetry Bench */}
      <div className="bg-[#151718] border border-white/[0.08] hover:border-[#D8B52A]/30 hover:shadow-[0_16px_36px_-8px_rgba(0,0,0,0.8),0_0_20px_rgba(216,181,42,0.12)] hover:-translate-y-1 p-6 sm:p-8 transition-all duration-300 ease-out group relative overflow-hidden">
        {/* Dynamic Top Border Glow on Hover */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D8B52A]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-6 border-b border-white/[0.06] gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 bg-[#D8B52A]" />
              <span className="text-xs text-[#8B8D8C]">
                Simulation bench
              </span>
            </div>
            <h3 className="font-heading text-xl text-[#F4F4F1] ">
              R1 aerodynamic downforce simulator
            </h3>
          </div>

          <button
            onClick={() => setDrsActive(!drsActive)}
            className={`px-3 py-1.5 text-xs border transition-colors cursor-pointer ${
              drsActive
                ? 'bg-[#D8B52A] text-black font-semibold border-[#D8B52A]'
                : 'bg-[#111314] text-[#8B8D8C] border-white/10 hover:text-white'
            }`}
          >
            DRS: {drsActive ? 'Active (low drag)' : 'High downforce'}
          </button>
        </div>

        {/* Speed Slider */}
        <div className="mb-8">
          <div className="flex justify-between text-xs text-[#8B8D8C] mb-2">
            <span>Velocity: {circuitSpeed} KM/H</span>
            <span>Top: 355 km/h</span>
          </div>
          <input
            type="range"
            min={100}
            max={355}
            value={circuitSpeed}
            onChange={(e) => setCircuitSpeed(parseInt(e.target.value))}
            className="w-full h-1 bg-[#111314] rounded-none appearance-none cursor-pointer accent-[#D8B52A]"
          />
        </div>

        {/* Telemetry Output Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#111314] border border-white/[0.06]">
            <span className="text-xs text-[#505251] block mb-1">
              Downforce generation
            </span>
            <span className="font-heading text-2xl text-[#F4F4F1]">
              {downforceKg} KG
            </span>
          </div>

          <div className="p-4 bg-[#111314] border border-white/[0.06]">
            <span className="text-xs text-[#505251] block mb-1">
              Drag coefficient (cd)
            </span>
            <span className="font-heading text-2xl text-[#F4F4F1]">
              {dragCoeff}
            </span>
          </div>

          <div className="p-4 bg-[#111314] border border-white/[0.06]">
            <span className="text-xs text-[#505251] block mb-1">
              Estimated lateral grip
            </span>
            <span className="font-heading text-2xl text-[#D8B52A]">
              {lateralGForce} G
            </span>
          </div>
        </div>

        <div className="pt-6 mt-6 border-t border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-[#505251] ">
            Can-bus telemetry engine
          </span>
          <button
            onClick={() => onOpenBookingModal('Track Experience')}
            className="inline-flex items-center gap-2 text-xs text-[#F4F4F1] hover:text-[#D8B52A] transition-colors cursor-pointer"
          >
            <span>Experience on circuit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
