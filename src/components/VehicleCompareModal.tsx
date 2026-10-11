import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeftRight,
  Gauge,
  Zap,
  Wind,
  ShieldCheck,
  ArrowUpRight,
  CheckCircle2,
  Trophy,
  Scale,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Vehicle } from '../types';

interface VehicleCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicleA: Vehicle | null;
  vehicleB: Vehicle | null;
  allVehicles: Vehicle[];
  onSelectVehicleA: (vehicle: Vehicle) => void;
  onSelectVehicleB: (vehicle: Vehicle) => void;
  onViewDossier: (vehicle: Vehicle) => void;
  onBookVehicle: (vehicleName: string) => void;
}

// Helper to extract raw numbers for comparison
function parseAcceleration(acc: string): number {
  const match = acc.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 999;
}

function parseTopSpeed(speed: string): number {
  const match = speed.match(/[\d]+/);
  return match ? parseInt(match[0], 10) : 0;
}

function parsePower(power: string): number {
  const match = power.match(/[\d]+/);
  return match ? parseInt(match[0], 10) : 0;
}

function parseWeight(weight: string): number {
  const cleaned = weight.replace(/,/g, '');
  const match = cleaned.match(/[\d]+/);
  return match ? parseInt(match[0], 10) : 9999;
}

export const VehicleCompareModal: React.FC<VehicleCompareModalProps> = ({
  isOpen,
  onClose,
  vehicleA,
  vehicleB,
  allVehicles,
  onSelectVehicleA,
  onSelectVehicleB,
  onViewDossier,
  onBookVehicle,
}) => {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Fallback defaults if one is missing
  const carA = vehicleA || allVehicles[0] || null;
  const carB =
    vehicleB || (allVehicles.length > 1 ? allVehicles[1] : allVehicles[0]) || null;

  // Swap positions handler
  const handleSwap = () => {
    if (carA && carB) {
      const tempA = carA;
      onSelectVehicleA(carB);
      onSelectVehicleB(tempA);
    }
  };

  // Comparative calculations
  const comparison = useMemo(() => {
    if (!carA || !carB) return null;

    const accA = parseAcceleration(carA.acceleration);
    const accB = parseAcceleration(carB.acceleration);
    const speedA = parseTopSpeed(carA.topSpeed);
    const speedB = parseTopSpeed(carB.topSpeed);
    const pwrA = parsePower(carA.power);
    const pwrB = parsePower(carB.power);
    const wtA = parseWeight(carA.weight);
    const wtB = parseWeight(carB.weight);

    // Power to weight ratio: HP per tonne
    const p2wA = wtA > 0 ? Math.round((pwrA / (wtA / 1000)) * 10) / 10 : 0;
    const p2wB = wtB > 0 ? Math.round((pwrB / (wtB / 1000)) * 10) / 10 : 0;

    return {
      accWinner: accA < accB ? 'A' : accA > accB ? 'B' : 'TIE',
      accDelta: Math.abs(accA - accB).toFixed(1),
      speedWinner: speedA > speedB ? 'A' : speedA < speedB ? 'B' : 'TIE',
      speedDelta: Math.abs(speedA - speedB),
      powerWinner: pwrA > pwrB ? 'A' : pwrA < pwrB ? 'B' : 'TIE',
      powerDelta: Math.abs(pwrA - pwrB),
      weightWinner: wtA < wtB ? 'A' : wtA > wtB ? 'B' : 'TIE',
      weightDelta: Math.abs(wtA - wtB),
      p2wWinner: p2wA > p2wB ? 'A' : p2wA < p2wB ? 'B' : 'TIE',
      p2wA,
      p2wB,
      p2wDelta: Math.abs(p2wA - p2wB).toFixed(1),
    };
  }, [carA, carB]);

  if (!isOpen || !carA || !carB) return null;

  return (
    <div
      id="vehicle-compare-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Vehicle Technical Specification Comparison"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="relative w-full max-w-5xl bg-[#0B0D0E] border border-white/[0.12] shadow-[0_25px_60px_rgba(0,0,0,0.9)] overflow-hidden my-6 max-h-[92vh] flex flex-col"
      >
        {/* Top Sticky Header */}
        <div className="p-4 sm:p-5 bg-[#111415] border-b border-white/[0.08] flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#0B0D0E] border border-white/[0.10] text-[#D71920]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#D71920] inline-block" />
                <span className="text-xs text-[#85898A]">
                  RouteOne telemetry lab
                </span>
              </div>
              <h2 className="text-[#F4F3EF] text-base sm:text-lg font-heading ">
                Side-by-side technical specification benchmark
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwap}
              className="px-3 py-1.5 bg-[#0B0D0E] hover:bg-white/[0.06] border border-white/[0.12] text-xs text-[#AEB4B5] hover:text-[#F4F3EF] flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Swap positions of the two machines"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#D71920]" />
              <span className="hidden sm:inline">Swap Machines</span>
            </button>

            <button
              id="compare-modal-close-btn"
              onClick={onClose}
              className="p-2 text-[#85898A] hover:text-[#F4F3EF] bg-[#0B0D0E] hover:bg-white/[0.06] border border-white/[0.12] transition-colors cursor-pointer"
              aria-label="Close comparison modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Benchmark Presets Bar */}
        <div className="px-4 sm:px-6 py-2.5 bg-[#070809] border-b border-white/[0.06] flex items-center gap-2 overflow-x-auto text-xs shrink-0">
          <span className="text-[#85898A] whitespace-nowrap flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#C9B37E]" />
            Quick presets:
          </span>
          {allVehicles.length >= 2 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const r1 = allVehicles.find((v) => v.id.includes('r1')) || allVehicles[0];
                  const mcl = allVehicles.find((v) => v.id.includes('mclaren')) || allVehicles[1];
                  onSelectVehicleA(r1);
                  onSelectVehicleB(mcl);
                }}
                className={`px-2.5 py-1 border transition-colors whitespace-nowrap cursor-pointer uppercase ${
                  carA.id.includes('r1') && carB.id.includes('mclaren')
                    ? 'border-[#D71920] text-[#F4F3EF] bg-[#180E10]'
                    : 'border-white/[0.08] text-[#85898A] hover:text-[#F4F3EF]'
                }`}
              >
                R1 Concept vs 750S Track Pack
              </button>

              <button
                onClick={() => {
                  const r1 = allVehicles.find((v) => v.id.includes('r1')) || allVehicles[0];
                  const lambo = allVehicles.find((v) => v.id.includes('lamborghini')) || allVehicles[1];
                  onSelectVehicleA(r1);
                  onSelectVehicleB(lambo);
                }}
                className={`px-2.5 py-1 border transition-colors whitespace-nowrap cursor-pointer uppercase ${
                  carA.id.includes('r1') && carB.id.includes('lamborghini')
                    ? 'border-[#D71920] text-[#F4F3EF] bg-[#180E10]'
                    : 'border-white/[0.08] text-[#85898A] hover:text-[#F4F3EF]'
                }`}
              >
                R1 Concept vs Aventador SVJ
              </button>

              <button
                onClick={() => {
                  const lambo = allVehicles.find((v) => v.id.includes('lamborghini')) || allVehicles[1];
                  const porsche = allVehicles.find((v) => v.id.includes('porsche')) || allVehicles[0];
                  onSelectVehicleA(lambo);
                  onSelectVehicleB(porsche);
                }}
                className={`px-2.5 py-1 border transition-colors whitespace-nowrap cursor-pointer uppercase ${
                  carA.id.includes('lamborghini') && carB.id.includes('porsche')
                    ? 'border-[#D71920] text-[#F4F3EF] bg-[#180E10]'
                    : 'border-white/[0.08] text-[#85898A] hover:text-[#F4F3EF]'
                }`}
              >
                Aventador SVJ vs GT3 RS
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Comparison Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-[#202020]">
          {/* Machine Header Cards with Interactive Dropdown Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Machine A */}
            <div className="bg-[#111415] border border-white/[0.10] p-4 sm:p-5 flex flex-col justify-between relative group">
              <div>
                {/* Vehicle Selector Dropdown */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-xs text-[#D71920] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#D71920]" />
                    Benchmark machine · 01
                  </span>
                  <div className="relative">
                    <select
                      value={carA.id}
                      onChange={(e) => {
                        const found = allVehicles.find((v) => v.id === e.target.value);
                        if (found) onSelectVehicleA(found);
                      }}
                      className="bg-[#0B0D0E] text-[#F4F3EF] text-xs px-3 py-1.5 pr-7 border border-white/[0.14] rounded-none focus:outline-none focus:border-[#D71920] appearance-none cursor-pointer"
                    >
                      {allVehicles.map((v) => (
                        <option key={v.id} value={v.id} className="bg-[#0B0D0E] text-[#F4F3EF]">
                          {v.marque} — {v.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#85898A] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black border border-white/[0.08] mb-4">
                  <img
 loading="lazy"
 decoding="async"
                    src={carA.image}
                    alt={carA.name}
                    className="w-full h-full object-cover filter brightness-[0.90] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 bg-[#D71920] text-white text-[11px] font-semibold">
                      {carA.badge || carA.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-[#F4F3EF]">
                    <span className="text-[#AEB4B5]">{carA.availability}</span>
                    <span className="text-[#C9B37E] font-medium">{carA.price || 'Allocation'}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="text-xs text-[#85898A]">
                    {carA.marque}
                  </span>
                  <span className="text-xs text-[#85898A] ">
                    {carA.category}
                  </span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl text-[#F4F3EF] mb-2">
                  {carA.name}
                </h3>
                <p className="text-xs text-[#85898A] font-light line-clamp-2 mb-4 leading-relaxed">
                  {carA.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  onClick={() => onViewDossier(carA)}
                  className="flex-1 py-2 px-3 bg-[#0B0D0E] hover:bg-white/[0.06] border border-white/[0.12] text-[#AEB4B5] hover:text-[#F4F3EF] text-xs text-center transition-colors cursor-pointer"
                >
                  Full Dossier
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onBookVehicle(carA.name);
                  }}
                  className="flex-1 py-2 px-3 bg-[#D71920] hover:bg-[#B51218] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                >
                  <span>Book Session</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Machine B */}
            <div className="bg-[#111415] border border-white/[0.10] p-4 sm:p-5 flex flex-col justify-between relative group">
              <div>
                {/* Vehicle Selector Dropdown */}
                <div className="flex items-center justify-between mb-3 gap-2">
                  <span className="text-xs text-[#D71920] font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#D71920]" />
                    Benchmark machine · 02
                  </span>
                  <div className="relative">
                    <select
                      value={carB.id}
                      onChange={(e) => {
                        const found = allVehicles.find((v) => v.id === e.target.value);
                        if (found) onSelectVehicleB(found);
                      }}
                      className="bg-[#0B0D0E] text-[#F4F3EF] text-xs px-3 py-1.5 pr-7 border border-white/[0.14] rounded-none focus:outline-none focus:border-[#D71920] appearance-none cursor-pointer"
                    >
                      {allVehicles.map((v) => (
                        <option key={v.id} value={v.id} className="bg-[#0B0D0E] text-[#F4F3EF]">
                          {v.marque} — {v.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-[#85898A] absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-black border border-white/[0.08] mb-4">
                  <img
 loading="lazy"
 decoding="async"
                    src={carB.image}
                    alt={carB.name}
                    className="w-full h-full object-cover filter brightness-[0.90] contrast-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/20" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 bg-[#D71920] text-white text-[11px] font-semibold">
                      {carB.badge || carB.category}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs text-[#F4F3EF]">
                    <span className="text-[#AEB4B5]">{carB.availability}</span>
                    <span className="text-[#C9B37E] font-medium">{carB.price || 'Allocation'}</span>
                  </div>
                </div>

                <div className="flex items-baseline justify-between gap-2 mb-1">
                  <span className="text-xs text-[#85898A]">
                    {carB.marque}
                  </span>
                  <span className="text-xs text-[#85898A] ">
                    {carB.category}
                  </span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl text-[#F4F3EF] mb-2">
                  {carB.name}
                </h3>
                <p className="text-xs text-[#85898A] font-light line-clamp-2 mb-4 leading-relaxed">
                  {carB.description}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.08]">
                <button
                  onClick={() => onViewDossier(carB)}
                  className="flex-1 py-2 px-3 bg-[#0B0D0E] hover:bg-white/[0.06] border border-white/[0.12] text-[#AEB4B5] hover:text-[#F4F3EF] text-xs text-center transition-colors cursor-pointer"
                >
                  Full Dossier
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onBookVehicle(carB.name);
                  }}
                  className="flex-1 py-2 px-3 bg-[#D71920] hover:bg-[#B51218] text-white text-xs font-semibold text-center transition-all flex items-center justify-center gap-1 cursor-pointer shadow-sm"
                >
                  <span>Book Session</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* High-Impact Head-to-Head Telemetry Dashboard */}
          {comparison && (
            <div className="bg-[#070809] border border-white/[0.10] p-4 sm:p-6">
              <div className="flex items-center justify-between gap-4 mb-5 border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-[#D71920]" />
                  <span className="text-xs text-[#F4F3EF] font-semibold">
                    Head-to-head performance metrics
                  </span>
                </div>
                <span className="text-xs text-[#85898A] hidden sm:inline">
                  Red highlight indicates telemetry advantage
                </span>
              </div>

              <div className="space-y-4">
                {/* 1. 0-100 km/h Sprint */}
                <div className="p-3.5 bg-[#111415] border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span
                      className={`font-bold ${
                        comparison.accWinner === 'A' ? 'text-[#D71920]' : 'text-[#F4F3EF]'
                      }`}
                    >
                      {carA.acceleration}
                      {comparison.accWinner === 'A' && (
                        <span className="text-xs ml-1.5 px-1.5 py-0.5 bg-[#D71920]/20 text-[#D71920] border border-[#D71920]/30 uppercase">
                          + {comparison.accDelta}s Faster
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-[#AEB4B5] font-semibold">
                      0–100 Km/h sprint
                    </span>
                    <span
                      className={`font-bold ${
                        comparison.accWinner === 'B' ? 'text-[#D71920]' : 'text-[#F4F3EF]'
                      }`}
                    >
                      {comparison.accWinner === 'B' && (
                        <span className="text-xs mr-1.5 px-1.5 py-0.5 bg-[#D71920]/20 text-[#D71920] border border-[#D71920]/30 uppercase">
                          + {comparison.accDelta}s Faster
                        </span>
                      )}
                      {carB.acceleration}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-1.5 bg-[#181B1C] overflow-hidden flex justify-end">
                      <div
                        className={`h-full ${
                          comparison.accWinner === 'A' ? 'bg-[#D71920]' : 'bg-[#45494A]'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(30, (3.5 / parseAcceleration(carA.acceleration)) * 75)
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="h-1.5 bg-[#181B1C] overflow-hidden">
                      <div
                        className={`h-full ${
                          comparison.accWinner === 'B' ? 'bg-[#D71920]' : 'bg-[#45494A]'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(30, (3.5 / parseAcceleration(carB.acceleration)) * 75)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Top Speed */}
                <div className="p-3.5 bg-[#111415] border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span
                      className={`font-bold ${
                        comparison.speedWinner === 'A' ? 'text-[#D71920]' : 'text-[#F4F3EF]'
                      }`}
                    >
                      {carA.topSpeed}
                      {comparison.speedWinner === 'A' && (
                        <span className="text-xs ml-1.5 px-1.5 py-0.5 bg-[#D71920]/20 text-[#D71920] border border-[#D71920]/30 uppercase">
                          + {comparison.speedDelta} km/h
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-[#AEB4B5] font-semibold">
                      Max velocity
                    </span>
                    <span
                      className={`font-bold ${
                        comparison.speedWinner === 'B' ? 'text-[#D71920]' : 'text-[#F4F3EF]'
                      }`}
                    >
                      {comparison.speedWinner === 'B' && (
                        <span className="text-xs mr-1.5 px-1.5 py-0.5 bg-[#D71920]/20 text-[#D71920] border border-[#D71920]/30 uppercase">
                          + {comparison.speedDelta} km/h
                        </span>
                      )}
                      {carB.topSpeed}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-1.5 bg-[#181B1C] overflow-hidden flex justify-end">
                      <div
                        className={`h-full ${
                          comparison.speedWinner === 'A' ? 'bg-[#D71920]' : 'bg-[#45494A]'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(30, (parseTopSpeed(carA.topSpeed) / 360) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="h-1.5 bg-[#181B1C] overflow-hidden">
                      <div
                        className={`h-full ${
                          comparison.speedWinner === 'B' ? 'bg-[#D71920]' : 'bg-[#45494A]'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(30, (parseTopSpeed(carB.topSpeed) / 360) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Output Horsepower */}
                <div className="p-3.5 bg-[#111415] border border-white/[0.06]">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span
                      className={`font-bold ${
                        comparison.powerWinner === 'A' ? 'text-[#D71920]' : 'text-[#F4F3EF]'
                      }`}
                    >
                      {carA.power.split('@')[0]}
                      {comparison.powerWinner === 'A' && (
                        <span className="text-xs ml-1.5 px-1.5 py-0.5 bg-[#D71920]/20 text-[#D71920] border border-[#D71920]/30 uppercase">
                          + {comparison.powerDelta} HP
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-[#AEB4B5] font-semibold">
                      Engine output
                    </span>
                    <span
                      className={`font-bold ${
                        comparison.powerWinner === 'B' ? 'text-[#D71920]' : 'text-[#F4F3EF]'
                      }`}
                    >
                      {comparison.powerWinner === 'B' && (
                        <span className="text-xs mr-1.5 px-1.5 py-0.5 bg-[#D71920]/20 text-[#D71920] border border-[#D71920]/30 uppercase">
                          + {comparison.powerDelta} HP
                        </span>
                      )}
                      {carB.power.split('@')[0]}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-1.5 bg-[#181B1C] overflow-hidden flex justify-end">
                      <div
                        className={`h-full ${
                          comparison.powerWinner === 'A' ? 'bg-[#D71920]' : 'bg-[#45494A]'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(30, (parsePower(carA.power) / 800) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                    <div className="h-1.5 bg-[#181B1C] overflow-hidden">
                      <div
                        className={`h-full ${
                          comparison.powerWinner === 'B' ? 'bg-[#D71920]' : 'bg-[#45494A]'
                        }`}
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(30, (parsePower(carB.power) / 800) * 100)
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Dry Weight & Power-to-Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-[#111415] border border-white/[0.06]">
                    <span className="text-xs text-[#85898A] block mb-1">
                      Dry weight (lower is better)
                    </span>
                    <div className="flex items-center justify-between text-xs ">
                      <span
                        className={comparison.weightWinner === 'A' ? 'text-[#D71920] font-bold' : 'text-[#F4F3EF]'}
                      >
                        {carA.weight}
                      </span>
                      <span className="text-xs text-[#85898A]">vs</span>
                      <span
                        className={comparison.weightWinner === 'B' ? 'text-[#D71920] font-bold' : 'text-[#F4F3EF]'}
                      >
                        {carB.weight}
                      </span>
                    </div>
                    <div className="text-xs text-[#AEB4B5] mt-1 text-center">
                      Advantage: {comparison.weightWinner === 'A' ? carA.marque : carB.marque} (-{comparison.weightDelta} KG)
                    </div>
                  </div>

                  <div className="p-3 bg-[#111415] border border-white/[0.06]">
                    <span className="text-xs text-[#85898A] block mb-1">
                      Power-to-weight estimate
                    </span>
                    <div className="flex items-center justify-between text-xs ">
                      <span
                        className={comparison.p2wWinner === 'A' ? 'text-[#D71920] font-bold' : 'text-[#F4F3EF]'}
                      >
                        {comparison.p2wA} HP / ton
                      </span>
                      <span className="text-xs text-[#85898A]">vs</span>
                      <span
                        className={comparison.p2wWinner === 'B' ? 'text-[#D71920] font-bold' : 'text-[#F4F3EF]'}
                      >
                        {comparison.p2wB} HP / ton
                      </span>
                    </div>
                    <div className="text-xs text-[#AEB4B5] mt-1 text-center">
                      Advantage: {comparison.p2wWinner === 'A' ? carA.marque : carB.marque} (+{comparison.p2wDelta} HP/t)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Engineering Specification Matrix Table */}
          <div className="bg-[#0B0D0E] border border-white/[0.10] overflow-hidden">
            <div className="p-4 bg-[#111415] border-b border-white/[0.08] flex items-center justify-between">
              <h4 className="text-xs text-[#F4F3EF] font-semibold">
                Detailed architectural matrix
              </h4>
              <span className="text-xs text-[#85898A]">
                Technical lab comparison
              </span>
            </div>

            <div className="divide-y divide-white/[0.06] text-xs ">
              {/* Row 1: Engine Architecture */}
              <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 bg-[#111415]/60 hover:bg-white/[0.02] transition-colors">
                <div className="md:col-span-4 text-[#85898A] flex items-center gap-2 mb-1 md:mb-0">
                  <Zap className="w-3.5 h-3.5 text-[#D71920]" />
                  <span>Engine architecture</span>
                </div>
                <div className="md:col-span-4 text-[#F4F3EF] font-medium pr-2">
                  {carA.engine}
                </div>
                <div className="md:col-span-4 text-[#F4F3EF] font-medium">
                  {carB.engine}
                </div>
              </div>

              {/* Row 2: Transmission */}
              <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 bg-[#0B0D0E] hover:bg-white/[0.02] transition-colors">
                <div className="md:col-span-4 text-[#85898A] flex items-center gap-2 mb-1 md:mb-0">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D71920]" />
                  <span>Transmission & shift</span>
                </div>
                <div className="md:col-span-4 text-[#F4F3EF] pr-2">
                  {carA.transmission}
                </div>
                <div className="md:col-span-4 text-[#F4F3EF]">
                  {carB.transmission}
                </div>
              </div>

              {/* Row 3: Aerodynamic / Downforce Intent */}
              <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 bg-[#111415]/60 hover:bg-white/[0.02] transition-colors">
                <div className="md:col-span-4 text-[#85898A] flex items-center gap-2 mb-1 md:mb-0">
                  <Wind className="w-3.5 h-3.5 text-[#D71920]" />
                  <span>Aerodynamic focus</span>
                </div>
                <div className="md:col-span-4 text-[#F4F3EF] pr-2">
                  {carA.features[0] || 'Active DRS & Ground Effect'}
                </div>
                <div className="md:col-span-4 text-[#F4F3EF]">
                  {carB.features[0] || 'Active Downforce Manipulation'}
                </div>
              </div>

              {/* Row 4: Category & Track Intent */}
              <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 bg-[#0B0D0E] hover:bg-white/[0.02] transition-colors">
                <div className="md:col-span-4 text-[#85898A] flex items-center gap-2 mb-1 md:mb-0">
                  <Trophy className="w-3.5 h-3.5 text-[#D71920]" />
                  <span>Category & mission</span>
                </div>
                <div className="md:col-span-4 text-[#F4F3EF] pr-2">
                  <span className="px-2 py-0.5 bg-[#181B1C] border border-white/[0.10] text-xs">
                    {carA.category}
                  </span>
                </div>
                <div className="md:col-span-4 text-[#F4F3EF]">
                  <span className="px-2 py-0.5 bg-[#181B1C] border border-white/[0.10] text-xs">
                    {carB.category}
                  </span>
                </div>
              </div>

              {/* Row 5: Allocation / Tier */}
              <div className="grid grid-cols-1 md:grid-cols-12 p-3.5 bg-[#111415]/60 hover:bg-white/[0.02] transition-colors">
                <div className="md:col-span-4 text-[#85898A] flex items-center gap-2 mb-1 md:mb-0">
                  <Scale className="w-3.5 h-3.5 text-[#D71920]" />
                  <span>Access status</span>
                </div>
                <div className="md:col-span-4 text-[#AEB4B5] pr-2">
                  {carA.availability} — {carA.price || 'Allocation'}
                </div>
                <div className="md:col-span-4 text-[#AEB4B5]">
                  {carB.availability} — {carB.price || 'Allocation'}
                </div>
              </div>
            </div>
          </div>

          {/* Side-by-Side Distinctive Engineering Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 bg-[#111415] border border-white/[0.10]">
              <h5 className="text-xs text-[#AEB4B5] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#D71920]" />
                {carA.name} Key attributes
              </h5>
              <div className="space-y-2">
                {carA.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-[#AEB4B5] bg-[#0B0D0E] p-2.5 border border-white/[0.06]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D71920] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#111415] border border-white/[0.10]">
              <h5 className="text-xs text-[#AEB4B5] mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#D71920]" />
                {carB.name} Key attributes
              </h5>
              <div className="space-y-2">
                {carB.features.map((feat, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-xs text-[#AEB4B5] bg-[#0B0D0E] p-2.5 border border-white/[0.06]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D71920] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-[#111415] border-t border-white/[0.10] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="text-xs text-[#85898A] ">
            Comparing <span className="text-[#F4F3EF] font-bold">{carA.name}</span> vs{' '}
            <span className="text-[#F4F3EF] font-bold">{carB.name}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2.5 bg-[#0B0D0E] hover:bg-white/[0.06] border border-white/[0.12] text-xs text-[#AEB4B5] hover:text-[#F4F3EF] transition-colors cursor-pointer"
            >
              Exit Benchmark
            </button>
            <button
              onClick={() => {
                onClose();
                onBookVehicle(carA.name);
              }}
              className="flex-1 sm:flex-none px-5 py-2.5 bg-[#D71920] hover:bg-[#B51218] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-md"
            >
              <span>Book Session ({carA.marque})</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
