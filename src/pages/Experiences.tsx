import React, { useState, useEffect } from 'react';
import { ArrowRight, Check, Clock, MapPin } from 'lucide-react';
import { ExperienceService } from '../types';
import { fetchExperiences } from '../services/api';
import { CircuitMap } from '../components/CircuitMap';

interface ExperiencesPageProps {
  onOpenBookingModal: (serviceName: string) => void;
}

export const ExperiencesPage: React.FC<ExperiencesPageProps> = ({
  onOpenBookingModal,
}) => {
  const [experiences, setExperiences] = useState<ExperienceService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExperiences()
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching experiences:', err);
        setLoading(false);
      });
  }, []);

  return (
    <div id="experiences-services-page" className="w-full px-6 md:px-10 py-16 bg-[#111314]">
      {/* Page Header */}
      <div className="pb-8 mb-10 border-b border-white/[0.06]">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 bg-[#D8B52A]" />
          <span className="text-xs text-[#8B8D8C]">
            Circuit sessions & services
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-[#F4F4F1] font-semibold uppercase mb-4">
          CIRCUIT & PADDOCK EXPERIENCES
        </h1>

        <p className="text-sm text-[#8B8D8C] font-light leading-relaxed max-w-xl">
          High-performance track programs, private showroom walkthroughs, and bespoke acquisition advisory tailored for discerning drivers.
        </p>
      </div>

      {/* Interactive F1-Inspired Circuit Map & Telemetry HUD */}
      <CircuitMap onBookSession={() => onOpenBookingModal('Track Experience')} />

      {/* Section Header for Available Driving Packages */}
      <div className="flex items-center justify-between gap-4 pb-4 mb-8 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 bg-[#D71920]" />
            <span className="text-xs text-[#8B8D8C]">
              Available packages
            </span>
          </div>
          <h2 className="font-heading text-2xl text-[#F4F4F1] ">
            Curated driving programs
          </h2>
        </div>
        <span className="text-xs text-[#8B8D8C]">
          {experiences.length} Programs available
        </span>
      </div>

      {/* Services List */}
      <div className="space-y-8">
        {experiences.map((service, idx) => (
          <div
            key={service.id}
            className="bg-[#151718] border border-white/[0.08] hover:border-[#D8B52A]/40 hover:shadow-[0_18px_36px_-8px_rgba(0,0,0,0.8),0_0_24px_rgba(216,181,42,0.18)] hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 group relative"
          >
            {/* Dynamic Top Border Glow on Hover */}
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#D8B52A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />
            {/* Image Side */}
            <div className="lg:col-span-5 relative h-64 lg:h-auto min-h-[260px] bg-black overflow-hidden">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover filter brightness-[0.88] contrast-[1.05] transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151718] via-transparent to-transparent lg:hidden" />
              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 bg-[#111415]/90 border border-white/[0.08] text-[11px] text-[#D8B52A]">
                  {service.category || service.availability || 'EXPERIENCE'}
                </span>
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span className="text-xs text-[#505251] ">
                    Module 0{idx + 1} • {service.availability || 'AVAILABLE'}
                  </span>
                  <span className="text-sm text-[#F4F4F1] font-medium">
                    {service.price || (service as any).pricing || 'Contact Concierge'}
                  </span>
                </div>

                <h2 className="font-heading text-2xl text-[#F4F4F1] font-medium mb-3">
                  {service.name}
                </h2>

                <p className="text-xs sm:text-sm text-[#8B8D8C] font-light leading-relaxed mb-6">
                  {service.description}
                </p>

                {/* Meta details */}
                <div className="flex flex-wrap gap-4 text-xs text-[#8B8D8C] mb-6 pb-6 border-b border-white/[0.06]">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D8B52A]" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D8B52A]" />
                    <span>{service.location || (service as any).circuitTrack || 'RouteOne Proving Grounds'}</span>
                  </div>
                </div>

                {/* Inclusions list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                  {(service.inclusions || (service as any).features || []).map((feat: string, fIdx: number) => (
                    <div key={fIdx} className="flex items-center gap-2 text-xs text-[#8B8D8C]">
                      <span className="w-1 h-1 bg-[#D8B52A]" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Book Button */}
              <div className="pt-4 flex items-center justify-between border-t border-white/[0.06]">
                <span className="text-xs text-[#505251] ">
                  Advance reservation required
                </span>
                <button
                  onClick={() => onOpenBookingModal(service.name)}
                  className="group inline-flex items-center gap-2 px-5 py-2.5 bg-[#F4F4F1] text-[#111314] text-xs font-semibold hover:bg-[#D8B52A] transition-colors cursor-pointer"
                >
                  <span>Reserve session</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
