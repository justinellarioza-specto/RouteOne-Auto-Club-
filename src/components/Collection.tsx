import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { Vehicle } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useMember } from '../context/MemberContext';

interface CollectionProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
  onExploreAll?: () => void;
}

export const Collection: React.FC<CollectionProps> = ({
  vehicles,
  onSelectVehicle,
  onExploreAll,
}) => {
  const { isGarageLight } = useTheme();
  const { isMember, memberProfile } = useMember();
  const [filter, setFilter] = useState<'ALL' | 'FORMULA 1' | 'SUPERCARS' | 'HYPERCARS' | 'TRACK CONCEPT'>('ALL');

  // Filter machines based on category or show top 3 featured
  const filteredVehicles = vehicles.filter((car) => {
    if (filter === 'ALL') return true;
    if (filter === 'FORMULA 1') return car.category === 'FORMULA 1' || car.category === 'F1 HERITAGE';
    if (filter === 'SUPERCARS') return car.category === 'SUPERCARS' || car.category === 'EXOTIC';
    if (filter === 'HYPERCARS') return car.category === 'HYPERCARS';
    if (filter === 'TRACK CONCEPT') return car.category.includes('CONCEPT') || car.marque === 'RouteOne';
    return true;
  });

  return (
    <section
      id="collection-section"
      className={`w-full px-6 md:px-10 py-16 border-b transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#F4F3EF] border-black/[0.08]'
          : 'bg-[#0B0D0E] border-white/[0.08]'
      }`}
    >
      {/* Section Header: 01 / THE COLLECTION */}
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
              The collection
            </span>
          </div>
          <h2
            className={`font-heading text-3xl sm:text-4xl font-semibold uppercase leading-tight ${
              isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
            }`}
          >
            MACHINES
            <br />
            WITHOUT COMPROMISE.
          </h2>
          <p
            className={`text-sm font-light leading-relaxed max-w-lg mt-3 ${
              isGarageLight ? 'text-[#3E4347]' : 'text-[#85898A]'
            }`}
          >
            A curated selection of machines chosen for performance, character, and presence.
          </p>
        </div>

        {/* Minimal Category Filter Pills */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-1 sm:pb-0">
          {(['ALL', 'FORMULA 1', 'SUPERCARS', 'HYPERCARS', 'TRACK CONCEPT'] as const).map((cat) => {
            const isActive = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-xs px-3 py-1.5 transition-all duration-200 cursor-pointer border rounded-sm ${
                  isActive
                    ? 'border-[#D71920] bg-[#D71920] text-white font-semibold shadow-sm'
                    : isGarageLight
                    ? 'border-black/10 text-[#565C62] hover:text-[#111415] hover:border-black/25 bg-white/60'
                    : 'border-white/10 text-[#85898A] hover:text-[#F4F3EF] hover:border-white/20 bg-[#111415]/60'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3 Vehicle Cards with subtle red line at bottom */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredVehicles.slice(0, 3).map((car, idx) => {
          const isConcept = car.category.includes('CONCEPT');

          return (
            <div
              key={car.id}
              onClick={() => onSelectVehicle(car)}
              className={`group cursor-pointer border transition-all duration-300 ease-out flex flex-col justify-between overflow-hidden relative border-b-2 border-b-[#D71920] rounded-sm ${
                isGarageLight
                  ? 'bg-white border-black/10 hover:border-black/30 hover:-translate-y-1.5 hover:shadow-[0_16px_32px_-6px_rgba(0,0,0,0.08),0_0_20px_rgba(215,25,32,0.12)]'
                  : 'bg-[#111415] border-white/[0.08] hover:border-white/30 hover:-translate-y-1.5 hover:shadow-[0_18px_36px_-8px_rgba(0,0,0,0.8),0_0_24px_rgba(215,25,32,0.22)]'
              }`}
            >
              {/* Dynamic Top Border Glow on Hover */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D71920] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

              {/* Car Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#060809]">
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/cars/r1-concept.webp';
                  }}
                />

                {/* Badge overlay */}
                <div
                  className="photo-chip absolute top-3 right-3 px-2 py-0.5 text-[11px] font-medium rounded-sm"
                >
                  {car.category}
                </div>
              </div>

              {/* Card Content Block */}
              <div className="p-6 flex flex-col justify-between flex-grow">
                <div>
                  {/* Number & Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`font-heading text-sm font-semibold ${
                        isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                      }`}
                    >
                      {car.name}
                    </span>
                    {isMember ? (
                      <span className="text-[11px] text-[#10B981] font-bold flex items-center gap-1 bg-[#10B981]/10 px-1.5 py-0.5 border border-[#10B981]/25">
                        <ShieldCheck className="w-3 h-3" />
                        Member unlocked · 0% deposit
                      </span>
                    ) : (
                      <span className="text-xs text-[#D71920] font-semibold">
                        Performance
                      </span>
                    )}
                  </div>

                  {/* Machine Title */}
                  <h3
                    className={`font-heading text-2xl font-semibold mb-3 transition-colors ${
                      isGarageLight
                        ? 'text-[#111415] group-hover:text-[#D71920]'
                        : 'text-[#F4F3EF] group-hover:text-white'
                    }`}
                  >
                    {car.marque === 'RouteOne' ? 'RouteOne R1' : car.marque.toUpperCase()}
                  </h3>

                  {/* Vehicle Description */}
                  <p
                    className={`text-xs font-light leading-relaxed mb-6 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                    }`}
                  >
                    {car.description}
                  </p>

                  {/* Concept / Machine Specs List */}
                  {isConcept ? (
                    <div
                      className={`mb-6 p-3 border rounded-sm ${
                        isGarageLight
                          ? 'bg-[#F6F7F5] border-black/[0.08]'
                          : 'bg-[#0B0D0E] border-white/[0.06]'
                      }`}
                    >
                      <div
                        className={`flex items-center justify-between text-[11px] mb-2 border-b pb-1 ${
                          isGarageLight
                            ? 'text-[#9C7D2B] border-black/[0.06]'
                            : 'text-[#C9B37E] border-white/[0.04]'
                        }`}
                      >
                        <span>Concept specifications</span>
                        <span>Simulated</span>
                      </div>
                      <div
                        className={`grid grid-cols-2 gap-2 text-xs ${
                          isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                        }`}
                      >
                        <div>
                          <span className={`block text-[11px] ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                            Output:
                          </span>
                          <span className="font-semibold text-[#D71920]">700+ HP</span>
                        </div>
                        <div>
                          <span className={`block text-[11px] ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                            0–100 KM/H:
                          </span>
                          <span className="font-semibold">3.0 sec</span>
                        </div>
                        <div>
                          <span className={`block text-[11px] ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                            V-max:
                          </span>
                          <span className="font-semibold">300+ KM/H</span>
                        </div>
                        <div>
                          <span className={`block text-[11px] ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                            Discipline:
                          </span>
                          <span className={`font-semibold ${isGarageLight ? 'text-[#3E4347]' : 'text-[#AEB4B5]'}`}>
                            Track focused
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`mb-6 grid grid-cols-2 gap-2 text-xs border-t pt-3 ${
                        isGarageLight
                          ? 'text-[#3E4347] border-black/[0.06]'
                          : 'text-[#AEB4B5] border-white/[0.04]'
                      }`}
                    >
                      <div>
                        <span className={`block text-[11px] uppercase ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                          Output
                        </span>
                        <span className="font-semibold">{car.power.split('@')[0].trim()}</span>
                      </div>
                      <div>
                        <span className={`block text-[11px] uppercase ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                          Accel
                        </span>
                        <span className="font-semibold">{car.acceleration}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Minimal CTA */}
                <div
                  className={`pt-4 border-t flex items-center justify-between text-[11px] transition-colors ${
                    isGarageLight
                      ? 'border-black/[0.06] text-[#111415] group-hover:text-[#D71920]'
                      : 'border-white/[0.06] text-[#F4F3EF] group-hover:text-[#D71920]'
                  }`}
                >
                  <span className="font-semibold">
                    {isMember ? 'Reserve track allocation' : 'Explore machine'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1.5 text-[#D71920]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore All Full Fleet Link */}
      {onExploreAll && (
        <div className="mt-10 text-center">
          <button
            onClick={onExploreAll}
            className={`text-[11px] transition-colors cursor-pointer py-2 inline-flex items-center gap-2 group ${
              isGarageLight
                ? 'text-[#565C62] hover:text-[#111415]'
                : 'text-[#85898A] hover:text-[#F4F3EF]'
            }`}
          >
            <span>View complete vehicle fleet & technical archive</span>
            <span className="text-[#D71920] transition-transform duration-200 group-hover:translate-x-1">→</span>
          </button>
        </div>
      )}
    </section>
  );
};
