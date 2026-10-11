import React, { useState } from 'react';
import { useEscapeKey } from '../hooks/useEscapeKey';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowRight,
  Zap,
  ShieldCheck,
  Trophy,
  Flag,
  Clock,
  ArrowLeft,
  Gauge,
  Activity,
  Flame,
  Scale,
  Compass,
  Sliders,
  Cpu,
} from 'lucide-react';
import { Vehicle } from '../types';
import { useTheme } from '../context/ThemeContext';

interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onBookVehicle: (vehicleName: string) => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  vehicle,
  onClose,
  onBookVehicle,
}) => {
  useEscapeKey(!!vehicle, onClose);
  const { isGarageLight } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'specs'>('overview');

  if (!vehicle) return null;

  const keyFeatures = vehicle.features || (vehicle as unknown as { highlights?: string[] }).highlights || [];
  const displayPrice = vehicle.price || vehicle.availability || 'Private Allocation';

  const categoryColorMap: Record<string, string> = {
    'SUPERCARS': '#C9B37E', // Champagne
    'HYPERCARS': '#AEB4B5', // Silver
    'SPORTS CARS': '#F4F3EF', // White
    'FAST CARS': '#D71920', // Red
    'TRACK': '#9E1217', // Dark Red
    'FORMULA 1': '#D71920', // Racing Red
    'F1 HERITAGE': '#D4AF37', // Champagne Gold
    'GRAND TOURERS': '#AEB4B5', // Silver
    'ELECTRIC': '#94A3B8', // Cool Silver
  };

  const accentColor = categoryColorMap[(vehicle.category || '').toUpperCase()] || '#D71920';
  const isFormula1 = vehicle.category === 'FORMULA 1' || vehicle.category === 'F1 HERITAGE';

  // Extract dynamic numeric specs for telemetry displays (pure derived values)
  const powerHp = (() => {
    if (!vehicle.power) return null;
    const match = vehicle.power.replace(/,/g, '').match(/(\d{3,4})/);
    return match ? parseInt(match[1], 10) : null;
  })();

  const accelerationData = (() => {
    if (!vehicle.acceleration) {
      return { raw: 'N/A', kmhTime: 'N/A', zeroToSixtyMph: 'N/A', sec: null, zeroToSixtySec: null };
    }
    const match = vehicle.acceleration.match(/(\d+\.?\d*)/);
    if (!match) {
      return { raw: vehicle.acceleration, kmhTime: vehicle.acceleration, zeroToSixtyMph: 'N/A', sec: null, zeroToSixtySec: null };
    }
    const sec = parseFloat(match[1]);
    // 0-100 km/h is 62.14 mph; 0-60 mph takes ~94% of the time on high-traction tarmac
    const zeroToSixtySec = Math.max(1.3, Number((sec * 0.94).toFixed(2)));
    return {
      raw: vehicle.acceleration,
      kmhTime: `${sec}s (0–100 km/h)`,
      zeroToSixtyMph: `${zeroToSixtySec}s`,
      sec,
      zeroToSixtySec,
    };
  })();

  const topSpeedData = (() => {
    if (!vehicle.topSpeed) return { raw: 'N/A', kmh: null, mph: null };
    const match = vehicle.topSpeed.replace(/,/g, '').match(/(\d{3})/);
    if (!match) return { raw: vehicle.topSpeed, kmh: null, mph: null };
    const kmh = parseInt(match[1], 10);
    const mph = Math.round(kmh * 0.621371);
    return {
      raw: vehicle.topSpeed,
      kmh,
      mph,
    };
  })();

  const weightAndRatio = (() => {
    if (!vehicle.weight) return { weightKg: null, hpPerTon: null };
    const match = vehicle.weight.replace(/,/g, '').match(/(\d{3,4})/);
    if (!match) return { weightKg: null, hpPerTon: null };
    const weightKg = parseInt(match[1], 10);
    const hpPerTon = powerHp && weightKg > 0 ? Math.round((powerHp / weightKg) * 1000) : null;
    return { weightKg, hpPerTon };
  })();

  // Normalized percentages for graphical telemetry scales
  const powerGaugePercent = powerHp ? Math.min(100, Math.max(20, Math.round((powerHp / 2000) * 100))) : 50;
  const speedGaugePercent = topSpeedData.kmh ? Math.min(100, Math.max(25, Math.round((topSpeedData.kmh / 500) * 100))) : 65;
  const accelGaugePercent = accelerationData.zeroToSixtySec
    ? Math.min(100, Math.max(20, Math.round(((4.2 - accelerationData.zeroToSixtySec) / (4.2 - 1.5)) * 100)))
    : 70;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 12 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className={`relative w-full max-w-3xl border shadow-2xl overflow-hidden my-6 transition-colors duration-200 rounded-sm ${
          isGarageLight
            ? 'bg-white border-black/15 shadow-[0_30px_70px_rgba(0,0,0,0.18)]'
            : 'bg-[#0B0D0E] border-white/[0.14] shadow-[0_30px_70px_rgba(0,0,0,0.95)]'
        }`}
      >
        {/* Close Button */}
        <button
          id="vehicle-modal-close-btn"
          onClick={onClose}
          className={`absolute top-4 right-4 z-20 p-2 border transition-colors cursor-pointer rounded-sm ${
            isGarageLight
              ? 'text-[#565C62] hover:text-[#111415] bg-white/90 border-black/15'
              : 'text-[#85898A] hover:text-[#F4F3EF] bg-[#0B0D0E]/85 border-white/[0.12]'
          }`}
          aria-label="Close vehicle details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Large Car Image Hero */}
        <div className="relative h-64 sm:h-84 overflow-hidden bg-[#060809]">
          <img
 loading="lazy"
 decoding="async"
            src={vehicle.image}
            alt={vehicle.name}
            className="w-full h-full object-cover filter brightness-[0.92] contrast-[1.06]"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/images/cars/r1-concept.webp';
            }}
          />
          {/* Studio Vignette & Floor Lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(255,255,255,0.12)_0%,transparent_70%)] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Top category pill & era */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span
              className="px-2.5 py-1 bg-[#0B0D0E]/90 border text-[11px] font-semibold flex items-center gap-1.5 rounded-sm"
              style={{ borderColor: `${accentColor}55`, color: accentColor }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: accentColor }} />
              {vehicle.category}
            </span>

            {vehicle.experience && (
              <span className="px-2.5 py-1 bg-[#0B0D0E]/90 border border-white/[0.10] text-[11px] text-[#AEB4B5] rounded-sm">
                {vehicle.experience}
              </span>
            )}
          </div>

          {/* Bottom Title overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-[11px] text-[#AEB4B5] block mb-1">
                {vehicle.marque || vehicle.brand} {vehicle.subcategory ? `// ${vehicle.subcategory}` : ''}
              </span>
              <h2 className="font-heading text-2xl sm:text-4xl text-white uppercase font-medium">
                {vehicle.name}
              </h2>
            </div>
            {vehicle.era && (
              <div className="text-left sm:text-right">
                <span className="text-[11px] text-[#AEB4B5] block ">Championship / era</span>
                <span className="text-xs text-[#C9B37E]">{vehicle.era}</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation Selector */}
        <div
          className={`flex items-center border-y px-4 sm:px-6 transition-colors duration-200 ${
            isGarageLight
              ? 'bg-[#F6F7F5] border-black/10'
              : 'bg-[#0E1012] border-white/[0.12]'
          }`}
        >
          <button
            id="vehicle-modal-tab-overview"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 sm:px-5 text-xs transition-colors relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'overview'
                ? isGarageLight
                  ? 'text-[#111415] font-semibold'
                  : 'text-[#F4F3EF] font-semibold'
                : isGarageLight
                ? 'text-[#565C62] hover:text-[#111415]'
                : 'text-[#85898A] hover:text-[#AEB4B5]'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Overview & dossier</span>
            {activeTab === 'overview' && (
              <motion.div
                layoutId="modal-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D71920]"
              />
            )}
          </button>

          <button
            id="vehicle-modal-tab-specs"
            onClick={() => setActiveTab('specs')}
            className={`py-3 px-3 sm:px-5 text-xs transition-colors relative flex items-center gap-2 cursor-pointer ${
              activeTab === 'specs'
                ? isGarageLight
                  ? 'text-[#111415] font-semibold'
                  : 'text-[#F4F3EF] font-semibold'
                : isGarageLight
                ? 'text-[#565C62] hover:text-[#111415]'
                : 'text-[#85898A] hover:text-[#AEB4B5]'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-[#D71920]" />
            <span>Technical specifications</span>
            <span className="text-[11px] px-1.5 py-0.5 bg-[#D71920]/20 text-[#D71920] border border-[#D71920]/40 font-semibold hidden sm:inline rounded-sm">
              Live telemetry
            </span>
            {activeTab === 'specs' && (
              <motion.div
                layoutId="modal-tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D71920]"
              />
            )}
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {activeTab === 'overview' ? (
            /* TAB 1: OVERVIEW & HERITAGE */
            <motion.div
              key="tab-overview"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              {/* F1 Heritage Context banner if applicable */}
              {isFormula1 && (
                <div
                  className={`p-3 border-l-2 border-[#D71920] border-y border-r flex items-center justify-between gap-4 text-xs rounded-sm ${
                    isGarageLight
                      ? 'bg-[#F6F7F5] border-black/10'
                      : 'bg-[#111415] border-white/[0.08]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4 text-[#D71920] shrink-0" />
                    <div>
                      <span className={`text-[11px] uppercase block ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                        Motorsport showcase
                      </span>
                      <span className={isGarageLight ? 'text-[#111415] font-semibold' : 'text-[#F4F3EF]'}>
                        {vehicle.team ? `${vehicle.team} • ` : ''}
                        {vehicle.season || vehicle.era || 'Formula 1 Racing Machine'}
                      </span>
                    </div>
                  </div>
                  {vehicle.driver && (
                    <div className="hidden sm:block text-right">
                      <span className={`text-[11px] uppercase block ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                        Pilot designation
                      </span>
                      <span className="text-[#C9B37E] font-semibold">{vehicle.driver}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Quick High-Level Spec Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  className={`p-3 border rounded-sm ${
                    isGarageLight
                      ? 'bg-[#F6F7F5] border-black/10'
                      : 'bg-[#111415] border-white/[0.08]'
                  }`}
                >
                  <span className={`text-[11px] block mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                    Power output
                  </span>
                  <span className={`font-heading text-lg font-semibold ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                    {vehicle.power || 'N/A'}
                  </span>
                </div>
                <div
                  className={`p-3 border rounded-sm ${
                    isGarageLight
                      ? 'bg-[#F6F7F5] border-black/10'
                      : 'bg-[#111415] border-white/[0.08]'
                  }`}
                >
                  <span className={`text-[11px] block mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                    0–60 Mph time
                  </span>
                  <span className={`font-heading text-lg font-semibold ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                    {accelerationData.zeroToSixtyMph}
                  </span>
                </div>
                <div
                  className={`p-3 border rounded-sm ${
                    isGarageLight
                      ? 'bg-[#F6F7F5] border-black/10'
                      : 'bg-[#111415] border-white/[0.08]'
                  }`}
                >
                  <span className={`text-[11px] block mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                    Max velocity
                  </span>
                  <span className={`font-heading text-lg font-semibold ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                    {vehicle.topSpeed || 'N/A'}
                  </span>
                </div>
                <div
                  className={`p-3 border rounded-sm ${
                    isGarageLight
                      ? 'bg-[#F6F7F5] border-black/10'
                      : 'bg-[#111415] border-white/[0.08]'
                  }`}
                >
                  <span className={`text-[11px] block mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                    Chassis weight
                  </span>
                  <span className={`font-heading text-lg font-semibold ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                    {vehicle.weight || 'Carbon Monocoque'}
                  </span>
                </div>
              </div>

              {/* Switch to Specs Tab Direct Callout */}
              <div
                className={`flex items-center justify-between p-3 border rounded-sm ${
                  isGarageLight
                    ? 'bg-[#F6F7F5] border-black/10'
                    : 'bg-[#111415] border-white/[0.08]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#D71920]" />
                  <span className={`text-xs ${isGarageLight ? 'text-[#3E4347]' : 'text-[#AEB4B5]'}`}>
                    Explore full dynamic telemetry, 0-60 curves & velocity metrics
                  </span>
                </div>
                <button
                  id="overview-switch-to-specs-btn"
                  onClick={() => setActiveTab('specs')}
                  className={`px-2.5 py-1 text-xs transition-colors cursor-pointer border rounded-sm ${
                    isGarageLight
                      ? 'bg-white hover:bg-[#D71920] hover:text-white border-black/15 text-[#111415]'
                      : 'bg-white/[0.05] hover:bg-[#D71920]/20 border-white/[0.12] hover:border-[#D71920] text-[#F4F3EF]'
                  }`}
                >
                  View technical specs →
                </button>
              </div>

              {/* Description */}
              <div>
                <h3 className={`text-xs mb-2 flex items-center gap-1.5 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                  <span className="w-1.5 h-1.5 bg-[#D71920]" />
                  Curated dossier & heritage
                </h3>
                <p className={`text-xs sm:text-sm leading-relaxed font-light ${isGarageLight ? 'text-[#3E4347]' : 'text-[#AEB4B5]'}`}>
                  {vehicle.description}
                </p>
              </div>

              {/* Key Features / Engineering Highlights */}
              {keyFeatures.length > 0 && (
                <div>
                  <h3 className={`text-xs mb-3 flex items-center gap-1.5 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                    <Trophy className="w-3.5 h-3.5 text-[#D71920]" />
                    Technical attributes & aerodynamics
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {keyFeatures.map((feat, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-2 text-xs p-2.5 border rounded-sm ${
                          isGarageLight
                            ? 'bg-[#F6F7F5] border-black/10 text-[#3E4347]'
                            : 'bg-[#111415] border-white/[0.06] text-[#AEB4B5]'
                        }`}
                      >
                        <span className="w-1 h-1 bg-[#D71920] shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Editorial Disclaimer */}
              {vehicle.fictionalDisclaimer && (
                <div
                  className={`p-3 border text-xs leading-relaxed rounded-sm ${
                    isGarageLight
                      ? 'bg-black/[0.03] border-black/10 text-[#565C62]'
                      : 'bg-[#070809] border-white/[0.06] text-[#85898A]'
                  }`}
                >
                  {vehicle.fictionalDisclaimer}
                </div>
              )}
            </motion.div>
          ) : (
            /* TAB 2: TECHNICAL SPECIFICATIONS (DYNAMIC TELEMETRY) */
            <motion.div
              key="tab-specs"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              {/* Telemetry Header Badge Strip */}
              <div
                className={`p-3 border flex flex-wrap items-center justify-between gap-3 text-xs rounded-sm ${
                  isGarageLight
                    ? 'bg-[#F6F7F5] border-black/10'
                    : 'bg-[#111415] border-white/[0.10]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#D71920]" />
                  <span className={`text-xs ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                    Performance benchmark
                  </span>
                  <span className={`font-semibold ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                    {vehicle.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className={`px-2 py-0.5 uppercase border rounded-sm ${
                    isGarageLight ? 'bg-white border-black/15 text-[#565C62]' : 'bg-white/[0.06] border-white/[0.12] text-[#AEB4B5]'
                  }`}>
                    Class: {vehicle.category}
                  </span>
                  <span className="px-2 py-0.5 bg-[#D71920]/20 border border-[#D71920]/40 text-[#D71920] uppercase font-semibold rounded-sm">
                    Benchmarked
                  </span>
                </div>
              </div>

              {/* TRIAD OF PRIMARY PERFORMANCE SPECIFICATIONS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. ENGINE OUTPUT CARD */}
                <div
                  id="spec-engine-output-card"
                  className={`p-4 border relative overflow-hidden flex flex-col justify-between rounded-sm ${
                    isGarageLight
                      ? 'bg-[#F6F7F5] border-black/10'
                      : 'bg-[#111415] border-white/[0.12]'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D71920]/5 rounded-bl-full pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs flex items-center gap-1.5 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                        <Flame className="w-3.5 h-3.5 text-[#D71920]" />
                        Engine output
                      </span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-sm ${isGarageLight ? 'bg-black/5 text-[#565C62]' : 'bg-white/[0.06] text-[#AEB4B5]'}`}>
                        Dynometer
                      </span>
                    </div>

                    {/* Big Numeric Output */}
                    <div className="my-2">
                      <div className={`font-heading text-2xl sm:text-3xl font-bold ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                        {powerHp ? `${powerHp.toLocaleString()} HP` : vehicle.power}
                      </div>
                      <div className={`text-xs mt-0.5 line-clamp-2 ${isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'}`}>
                        {vehicle.power}
                      </div>
                    </div>
                  </div>

                  {/* Relative Power Scale */}
                  <div className={`mt-4 pt-3 border-t ${isGarageLight ? 'border-black/10' : 'border-white/[0.06]'}`}>
                    <div className={`flex items-center justify-between text-[11px] mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                      <span>Power density scale</span>
                      <span className={isGarageLight ? 'text-[#111415] font-semibold' : 'text-[#F4F3EF]'}>
                        {powerHp ? `${powerHp} / 2,000 HP` : '100%'}
                      </span>
                    </div>
                    <div className={`w-full h-1.5 overflow-hidden rounded-full ${isGarageLight ? 'bg-black/10' : 'bg-[#1B1F22]'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-[#85898A] via-[#D71920] to-[#E63946] transition-all duration-500"
                        style={{ width: `${powerGaugePercent}%` }}
                      />
                    </div>
                    <div className={`text-[11px] mt-2 flex items-center justify-between ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                      <span>Architecture:</span>
                      <span className={`truncate max-w-[140px] font-semibold ${isGarageLight ? 'text-[#9C7D2B]' : 'text-[#C9B37E]'}`} title={vehicle.engine}>
                        {vehicle.engine}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. 0-60 TIMES & ACCELERATION CARD */}
                <div
                  id="spec-acceleration-card"
                  className={`p-4 border relative overflow-hidden flex flex-col justify-between rounded-sm ${
                    isGarageLight
                      ? 'bg-[#F6F7F5] border-black/10'
                      : 'bg-[#111415] border-white/[0.12]'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D71920]/5 rounded-bl-full pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs flex items-center gap-1.5 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                        <Clock className="w-3.5 h-3.5 text-[#D71920]" />
                        0–60 Sprint time
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 bg-[#D71920]/20 text-[#D71920] border border-[#D71920]/40 font-semibold rounded-sm">
                        0–60 Mph
                      </span>
                    </div>

                    {/* Big 0-60 readout */}
                    <div className="my-2">
                      <div className={`font-heading text-2xl sm:text-3xl font-bold ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                        {accelerationData.zeroToSixtyMph}
                      </div>
                      <div className={`text-xs mt-0.5 ${isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'}`}>
                        FIA 0–100 km/h: <strong className={isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}>{accelerationData.raw}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Sprint Response Bar */}
                  <div className={`mt-4 pt-3 border-t ${isGarageLight ? 'border-black/10' : 'border-white/[0.06]'}`}>
                    <div className={`flex items-center justify-between text-[11px] mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                      <span>Launch traction velocity</span>
                      <span className={isGarageLight ? 'text-[#111415] font-semibold' : 'text-[#F4F3EF]'}>
                        {accelerationData.zeroToSixtySec && accelerationData.zeroToSixtySec < 2.3
                          ? 'Hyper-tier launch'
                          : 'Track launch control'}
                      </span>
                    </div>
                    <div className={`w-full h-1.5 overflow-hidden rounded-full ${isGarageLight ? 'bg-black/10' : 'bg-[#1B1F22]'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-[#D71920] via-[#E63946] to-emerald-500 transition-all duration-500"
                        style={{ width: `${accelGaugePercent}%` }}
                      />
                    </div>
                    <div className={`text-[11px] mt-2 flex items-center justify-between ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                      <span>Traction class:</span>
                      <span className={`font-semibold ${isGarageLight ? 'text-[#9C7D2B]' : 'text-[#C9B37E]'}`}>
                        {isFormula1 ? 'Slick Tires / Active ERS' : 'AWD / Dual-Clutch'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. TOP SPEED / MAXIMUM VELOCITY CARD */}
                <div
                  id="spec-top-speed-card"
                  className={`p-4 border relative overflow-hidden flex flex-col justify-between rounded-sm ${
                    isGarageLight
                      ? 'bg-[#F6F7F5] border-black/10'
                      : 'bg-[#111415] border-white/[0.12]'
                  }`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#D71920]/5 rounded-bl-full pointer-events-none" />
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-xs flex items-center gap-1.5 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                        <Gauge className="w-3.5 h-3.5 text-[#D71920]" />
                        Top speed (v-max)
                      </span>
                      <span className={`text-[11px] px-1.5 py-0.5 rounded-sm ${isGarageLight ? 'bg-black/5 text-[#565C62]' : 'bg-white/[0.06] text-[#AEB4B5]'}`}>
                        Terminal
                      </span>
                    </div>

                    {/* Big Top Speed Readout */}
                    <div className="my-2">
                      <div className={`font-heading text-2xl sm:text-3xl font-bold ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                        {vehicle.topSpeed}
                      </div>
                      <div className={`text-xs mt-0.5 ${isGarageLight ? 'text-[#565C62]' : 'text-[#AEB4B5]'}`}>
                        {topSpeedData.mph ? (
                          <>
                            Imperial conversion: <strong className={isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}>{topSpeedData.mph} Mph</strong>
                          </>
                        ) : (
                          'AERO TERMINAL VELOCITY'
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Velocity Scale */}
                  <div className={`mt-4 pt-3 border-t ${isGarageLight ? 'border-black/10' : 'border-white/[0.06]'}`}>
                    <div className={`flex items-center justify-between text-[11px] mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                      <span>V-max bracket (500 km/h max)</span>
                      <span className={isGarageLight ? 'text-[#111415] font-semibold' : 'text-[#F4F3EF]'}>
                        {topSpeedData.kmh ? `${topSpeedData.kmh} KM/H` : '350+ KM/H'}
                      </span>
                    </div>
                    <div className={`w-full h-1.5 overflow-hidden rounded-full ${isGarageLight ? 'bg-black/10' : 'bg-[#1B1F22]'}`}>
                      <div
                        className="h-full bg-gradient-to-r from-[#85898A] via-[#D71920] to-[#FFD700] transition-all duration-500"
                        style={{ width: `${speedGaugePercent}%` }}
                      />
                    </div>
                    <div className={`text-[11px] mt-2 flex items-center justify-between ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                      <span>Aero drag regime:</span>
                      <span className={`font-semibold ${isGarageLight ? 'text-[#9C7D2B]' : 'text-[#C9B37E]'}`}>
                        {topSpeedData.kmh && topSpeedData.kmh >= 400
                          ? 'Hyper-Aero V-Max Class'
                          : 'Circuit Downforce Trim'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* DETAILED POWERTRAIN & CHASSIS MATRIX */}
              <div
                className={`border p-4 sm:p-5 rounded-sm ${
                  isGarageLight
                    ? 'bg-[#F6F7F5] border-black/10'
                    : 'bg-[#111415] border-white/[0.08]'
                }`}
              >
                <h4 className={`text-xs mb-4 flex items-center gap-2 ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                  <Sliders className="w-3.5 h-3.5 text-[#D71920]" />
                  Powertrain, drivetrain & mass matrix
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs ">
                  {/* Engine Architecture */}
                  <div
                    className={`p-3 border rounded-sm ${
                      isGarageLight ? 'bg-white border-black/10' : 'bg-[#0B0D0E] border-white/[0.06]'
                    }`}
                  >
                    <span className={`text-[11px] uppercase block mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                      Engine architecture
                    </span>
                    <span className={`font-medium leading-tight block ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                      {vehicle.engine || 'Bespoke High-Output Powertrain'}
                    </span>
                  </div>

                  {/* Transmission */}
                  <div
                    className={`p-3 border rounded-sm ${
                      isGarageLight ? 'bg-white border-black/10' : 'bg-[#0B0D0E] border-white/[0.06]'
                    }`}
                  >
                    <span className={`text-[11px] uppercase block mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                      Transmission
                    </span>
                    <span className={`font-medium leading-tight block ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                      {vehicle.transmission || 'Sequential Dual-Clutch'}
                    </span>
                  </div>

                  {/* Curb / Monocoque Weight */}
                  <div
                    className={`p-3 border rounded-sm ${
                      isGarageLight ? 'bg-white border-black/10' : 'bg-[#0B0D0E] border-white/[0.06]'
                    }`}
                  >
                    <span className={`text-[11px] uppercase block mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                      Chassis / curb weight
                    </span>
                    <span className={`font-medium leading-tight block ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                      {vehicle.weight || 'Carbon-Fiber Monocoque'}
                    </span>
                  </div>

                  {/* Calculated Power to Weight Ratio */}
                  <div
                    className={`p-3 border rounded-sm ${
                      isGarageLight ? 'bg-white border-black/10' : 'bg-[#0B0D0E] border-white/[0.06]'
                    }`}
                  >
                    <span className={`text-[11px] uppercase block mb-1 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                      Power-to-weight ratio
                    </span>
                    <span className={`font-medium leading-tight block font-semibold ${isGarageLight ? 'text-[#9C7D2B]' : 'text-[#C9B37E]'}`}>
                      {weightAndRatio.hpPerTon
                        ? `${weightAndRatio.hpPerTon.toLocaleString()} HP / TON`
                        : 'Bespoke Homologation'}
                    </span>
                  </div>
                </div>
              </div>

              {/* ENGINEERING & TELEMETRY HIGHLIGHTS */}
              {keyFeatures.length > 0 && (
                <div>
                  <h4 className={`text-xs mb-3 flex items-center gap-1.5 ${isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}`}>
                    <Trophy className="w-3.5 h-3.5 text-[#D71920]" />
                    Active aerodynamics & telemetry subsystems
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {keyFeatures.map((feat, i) => (
                      <div
                        key={i}
                        className={`flex items-start gap-2.5 text-xs p-3 border rounded-sm ${
                          isGarageLight
                            ? 'bg-[#F6F7F5] border-black/10 text-[#3E4347]'
                            : 'bg-[#111415] border-white/[0.06] text-[#AEB4B5]'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 bg-[#D71920] shrink-0 mt-1" />
                        <div>
                          <span className={`block leading-snug font-medium ${isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'}`}>
                            {feat}
                          </span>
                          <span className={`text-[11px] block mt-0.5 ${isGarageLight ? 'text-[#8C9399]' : 'text-[#85898A]'}`}>
                            Subsystem Verified • Telemetry Calibrated
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Action Row */}
          <div className={`pt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${isGarageLight ? 'border-black/10' : 'border-white/[0.08]'}`}>
            <button
              id="vehicle-modal-back-btn"
              onClick={onClose}
              className={`inline-flex items-center gap-2 text-xs transition-colors cursor-pointer ${
                isGarageLight ? 'text-[#565C62] hover:text-[#111415]' : 'text-[#AEB4B5] hover:text-[#F4F3EF]'
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to collection</span>
            </button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                id="vehicle-modal-get-behind-wheel-cta"
                onClick={() => {
                  onBookVehicle(vehicle.name);
                  onClose();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#D71920] hover:bg-[#B51218] text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm rounded-sm"
              >
                <span>Get behind the wheel</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

