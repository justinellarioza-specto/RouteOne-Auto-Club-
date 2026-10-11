import React from 'react';

export const PerformanceStrip: React.FC = () => {
  const stats = [
    { label: 'Calculated output', value: '720+ HP', sub: 'Atmospheric Hybrid' },
    { label: 'Acceleration', value: '3.0 SEC', sub: '0–100 KM/H' },
    { label: 'Top velocity', value: '335+ KM/H', sub: 'Track Verified' },
    { label: 'Chassis weight', value: '1,180 KG', sub: 'Carbon Monocoque' },
    { label: 'Circuit program', value: '01 TRACK', sub: 'Silverstone Proving' },
  ];

  return (
    <div
      id="performance-strip"
      className="w-full bg-[#0E1011] border-b border-white/[0.08] px-6 md:px-10 py-6"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.08] gap-y-4 sm:gap-y-0">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`flex flex-col justify-center ${
              i === 0 ? 'sm:pr-4' : 'sm:px-4'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-[11px] text-[#8B8D8C]">
                {stat.label}
              </span>
            </div>
            <span className="font-heading text-2xl sm:text-3xl text-[#F4F4F1] font-semibold leading-none">
              {stat.value}
            </span>
            <span className="text-xs text-[#505251] mt-1 ">
              {stat.sub}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[11px] text-[#505251] ">
        <span>RouteOne concept specifications · simulated aerodynamic baseline</span>
        <span className="hidden sm:inline">Engineered for precision</span>
      </div>
    </div>
  );
};
