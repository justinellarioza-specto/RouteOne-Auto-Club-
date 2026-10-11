import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  Zap,
  Key,
  Calendar,
  Gauge,
  PhoneCall,
  Flame,
  CheckCircle2,
  Lock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Radio,
  Sliders,
  UserCheck,
  Sparkles,
} from 'lucide-react';
import { useMember } from '../context/MemberContext';
import { useTheme } from '../context/ThemeContext';

interface MemberPaddockSectionProps {
  onOpenBookingModal?: (experience?: string, vehicle?: string) => void;
  onNavigate?: (tab: string) => void;
}

export const MemberPaddockSection: React.FC<MemberPaddockSectionProps> = ({
  onOpenBookingModal = (_experience?: string, _vehicle?: string) => {},
  onNavigate = (_tab?: string) => {},
}) => {
  const { isMember, memberProfile, toggleMember, openLoginModal } = useMember();
  const { isGarageLight } = useTheme();
  const [selectedGarageIndex, setSelectedGarageIndex] = useState(0);
  const [reservedSuccess, setReservedSuccess] = useState(false);

  const handleInstantDispatch = (carName: string) => {
    setReservedSuccess(true);
    setTimeout(() => {
      setReservedSuccess(false);
      onOpenBookingModal('Track Experience', carName);
    }, 1200);
  };

  return (
    <section
      id="member-paddock-section"
      className={`w-full py-16 px-4 sm:px-6 md:px-10 border-b transition-colors duration-300 relative overflow-hidden ${
        isGarageLight
          ? isMember
            ? 'bg-[#F0F2EE] border-black/15'
            : 'bg-[#F9FAF8] border-black/10'
          : isMember
          ? 'bg-[#0E1012] border-[#D71920]/30 shadow-[inset_0_0_80px_rgba(215,25,32,0.05)]'
          : 'bg-[#090A0B] border-white/[0.06]'
      }`}
    >
      {/* Background Accent Grid / Glow with smooth transition */}
      <div
        className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl pointer-events-none transition-all duration-700 ${
          isMember
            ? 'bg-gradient-to-br from-[#D71920]/15 via-[#C9B37E]/10 to-transparent scale-110 opacity-100'
            : 'bg-[#D71920]/5 scale-95 opacity-50'
        }`}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-inherit">
          <div className="min-h-[110px]">
            <div className="flex items-center gap-2.5 mb-2.5">
              <AnimatePresence mode="wait">
                {isMember ? (
                  <motion.span
                    key="member-badge"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.3 }}
                    className="text-xs flex items-center gap-2 text-[#D71920] font-bold"
                  >
                    <span className="w-2 h-2 rounded-full bg-[#10B981] inline-block" />
                    Confidential · private paddock club active
                  </motion.span>
                ) : (
                  <motion.span
                    key="guest-badge"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    transition={{ duration: 0.3 }}
                    className={`text-xs flex items-center gap-2 ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                    }`}
                  >
                    <Lock className="w-3 h-3 text-[#D71920]" />
                    Member gateway · guest view
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.h2
                key={isMember ? 'member-title' : 'guest-title'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className={`font-heading text-3xl sm:text-5xl font-semibold uppercase ${
                  isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                }`}
              >
                {isMember ? 'PRIVATE MEMBER PADDOCK.' : 'CLUB SYNDICATE GATEWAY.'}
              </motion.h2>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={isMember ? 'member-desc' : 'guest-desc'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className={`text-sm font-light leading-relaxed mt-2 max-w-2xl ${
                  isGarageLight ? 'text-[#2B3035]' : 'text-[#AEB4B5]'
                }`}
              >
                {isMember
                  ? `Authenticated as ${memberProfile.name} (${memberProfile.tier}). Access your allocated garage slots, direct pit telematics, and priority track sessions with zero booking deposit.`
                  : 'Guest view active. RouteOne members unlock turn-key fleet allocations, telemetry engineer telemetry, and private pit boxes across Silverstone, Spa, and Monza.'}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Quick Toggle Action Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={toggleMember}
              className={`px-4 py-2.5 border rounded-xs text-[11px] font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 active:scale-95 ${
                isMember
                  ? isGarageLight
                    ? 'bg-white hover:bg-black/5 text-[#101214] border-black/20 shadow-sm'
                    : 'bg-[#151718] hover:bg-white/10 text-[#F4F3EF] border-white/15'
                  : 'bg-[#D71920] hover:bg-[#B5141A] text-white border-[#D71920] shadow-[0_0_18px_rgba(215,25,32,0.35)]'
              }`}
            >
              {isMember ? (
                <>
                  <Lock className="w-3.5 h-3.5 text-[#85898A]" />
                  <span>Switch to guest view</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-white" />
                  <span>Simulate member login</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Member View vs Guest Teaser View with Smooth AnimatePresence Transition */}
        <AnimatePresence mode="wait" initial={false}>
          {isMember ? (
            /* ========================================================================= */
            /* 1. PRIVATE MEMBER ACTIVE UI VIEW                                         */
            /* ========================================================================= */
            <motion.div
              key="member-view"
              initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-8"
            >
              {/* Exclusive Club Authentication Banner */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="p-3 bg-gradient-to-r from-[#D71920]/20 via-[#C9B37E]/12 to-transparent border border-[#D71920]/30 rounded-xs flex flex-wrap items-center justify-between gap-3 text-xs text-[#F4F3EF]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="font-bold text-[#D71920]">Clearance: {memberProfile.tier}</span>
                  <span className="text-white/40 hidden sm:inline">//</span>
                  <span className="text-[#C9B37E] font-semibold hidden sm:inline">
                    {memberProfile.name.toUpperCase()} [ID: {memberProfile.id}]
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={openLoginModal}
                    className="px-2 py-0.5 border border-[#C9B37E]/40 hover:border-[#C9B37E] text-[#C9B37E] hover:text-white bg-black/30 text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3 text-[#C9B37E]" />
                    <span>View dossier / switch</span>
                  </button>
                  <span className="text-[#85898A] text-[11px] hidden md:inline">
                    Exclusive club experience active
                  </span>
                </div>
              </motion.div>

              {/* Top Stat Ribbon for Member */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div
                  className={`p-4 border rounded-xs transition-colors duration-300 ${
                    isGarageLight ? 'bg-white border-black/10' : 'bg-[#131517] border-white/10'
                  }`}
                >
                  <div className="text-xs text-[#85898A] mb-1">
                    Member status
                  </div>
                  <div className="text-sm sm:text-base font-heading font-bold text-[#D71920] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#C9B37E]" />
                    {memberProfile.tier}
                  </div>
                  <div className="text-xs text-[#85898A] mt-1">ID: {memberProfile.id}</div>
                </div>

                <div
                  className={`p-4 border rounded-xs transition-colors duration-300 ${
                    isGarageLight ? 'bg-white border-black/10' : 'bg-[#131517] border-white/10'
                  }`}
                >
                  <div className="text-xs text-[#85898A] mb-1">
                    Track allocations
                  </div>
                  <div
                    className={`text-sm sm:text-base font-heading font-bold ${
                      isGarageLight ? 'text-[#101214]' : 'text-white'
                    }`}
                  >
                    {memberProfile.trackDaysRemaining} Sessions remaining
                  </div>
                  <div className="text-xs text-[#10B981] mt-1">Uncapped Mileage Included</div>
                </div>

                <div
                  className={`p-4 border rounded-xs transition-colors duration-300 ${
                    isGarageLight ? 'bg-white border-black/10' : 'bg-[#131517] border-white/10'
                  }`}
                >
                  <div className="text-xs text-[#85898A] mb-1">
                    Active garage slots
                  </div>
                  <div
                    className={`text-sm sm:text-base font-heading font-bold ${
                      isGarageLight ? 'text-[#101214]' : 'text-white'
                    }`}
                  >
                    {memberProfile.activeGarageSlots} Of {memberProfile.totalGarageSlots} Assigned
                  </div>
                  <div className="text-xs text-[#85898A] mt-1">1 Open Slot Available</div>
                </div>

                <div
                  className={`p-4 border rounded-xs transition-colors duration-300 ${
                    isGarageLight ? 'bg-white border-black/10' : 'bg-[#131517] border-white/10'
                  }`}
                >
                  <div className="text-xs text-[#85898A] mb-1">
                    Pit concierge hotline
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#C9B37E] truncate">
                    {memberProfile.conciergePhone}
                  </div>
                  <div className="text-xs text-[#85898A] mt-1">Code: {memberProfile.conciergeCode}</div>
                </div>
              </div>

              {/* Allocated Fleet & Live Paddock Telemetry Hub */}
              <div
                className={`p-6 border rounded-xs transition-colors duration-300 ${
                  isGarageLight ? 'bg-white border-black/10' : 'bg-[#111314] border-white/10'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-inherit">
                  <div>
                    <span className="text-xs text-[#D71920] block mb-1">
                      Live garage dispatch · tier 1 paddocks
                    </span>
                    <h3
                      className={`font-heading text-xl font-bold ${
                        isGarageLight ? 'text-[#101214]' : 'text-white'
                      }`}
                    >
                      Assigned Fleet Ready for Circuit Deployment
                    </h3>
                  </div>

                  <div className="text-[11px] text-[#85898A]">
                    FIA grade 1 access unlocked
                  </div>
                </div>

                {/* Vehicle selector buttons */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {memberProfile.allocatedCars.map((car, idx) => {
                    const isSelected = selectedGarageIndex === idx;
                    return (
                      <button
                        key={car.name}
                        onClick={() => setSelectedGarageIndex(idx)}
                        className={`text-left p-4 border rounded-xs transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? isGarageLight
                              ? 'bg-[#F2F4F0] border-[#D71920] shadow-sm'
                              : 'bg-[#181B1D] border-[#D71920] shadow-[0_0_15px_rgba(215,25,32,0.15)]'
                            : isGarageLight
                            ? 'bg-black/[0.02] border-black/10 hover:border-black/25'
                            : 'bg-white/[0.02] border-white/10 hover:border-white/20'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[11px] text-[#85898A]">
                            Slot 0{idx + 1}
                          </span>
                          <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded-xs bg-[#10B981]/15 text-[#10B981] font-bold">
                            <span className="w-1 h-1 rounded-full bg-[#10B981]" />
                            Ready
                          </span>
                        </div>
                        <h4
                          className={`font-heading text-sm font-bold mb-1 ${
                            isGarageLight ? 'text-[#101214]' : 'text-[#F4F3EF]'
                          }`}
                        >
                          {car.name}
                        </h4>
                        <p className="text-[11px] text-[#85898A]">{car.location}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Vehicle Telemetry & Quick Action Card */}
                {memberProfile.allocatedCars[selectedGarageIndex] && (
                  <div
                    className={`p-5 border rounded-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6 ${
                      isGarageLight ? 'bg-[#F8F9F7] border-black/10' : 'bg-[#0B0D0E] border-white/10'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-0.5 bg-[#D71920]/15 text-[#D71920] font-bold border border-[#D71920]/30 ">
                          Active allocation
                        </span>
                        <span className="text-[11px] text-[#85898A]">
                          Telemetry ID: {memberProfile.allocatedCars[selectedGarageIndex].telemetryId}
                        </span>
                      </div>

                      <h4
                        className={`font-heading text-xl font-bold ${
                          isGarageLight ? 'text-[#101214]' : 'text-white'
                        }`}
                      >
                        {memberProfile.allocatedCars[selectedGarageIndex].name}
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[11px] text-[#85898A] pt-2">
                        <div>
                          <span className="block text-[11px] uppercase text-white/40">Pit location</span>
                          <span className={isGarageLight ? 'text-black' : 'text-white'}>
                            {memberProfile.allocatedCars[selectedGarageIndex].location}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[11px] uppercase text-white/40">Tires mounted</span>
                          <span className={isGarageLight ? 'text-black' : 'text-white'}>
                            {memberProfile.allocatedCars[selectedGarageIndex].tires}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[11px] uppercase text-white/40">Fuel level</span>
                          <span className="text-[#10B981] font-bold">
                            {memberProfile.allocatedCars[selectedGarageIndex].fuel}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                      <button
                        onClick={() =>
                          handleInstantDispatch(memberProfile.allocatedCars[selectedGarageIndex].name)
                        }
                        disabled={reservedSuccess}
                        className="px-5 py-3 bg-[#D71920] hover:bg-[#B5141A] text-white text-[11px] font-bold rounded-xs transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(215,25,32,0.3)]"
                      >
                        {reservedSuccess ? (
                          <>
                            <CheckCircle2 className="w-4 h-4 text-white animate-bounce" />
                            <span>Dispatch verified · pit ready</span>
                          </>
                        ) : (
                          <>
                            <Zap className="w-4 h-4" />
                            <span>Claim zero-deposit track session</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => onNavigate('collection')}
                        className={`px-4 py-3 border text-[11px] rounded-xs transition-colors cursor-pointer text-center ${
                          isGarageLight
                            ? 'border-black/20 text-[#101214] hover:bg-black/5'
                            : 'border-white/20 text-white hover:bg-white/5'
                        }`}
                      >
                        View full fleet
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            /* ========================================================================= */
            /* 2. GUEST UI VIEW (Interactive Preview of Member Club with Simulation)    */
            /* ========================================================================= */
            <motion.div
              key="guest-view"
              initial={{ opacity: 0, y: 22, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -16, filter: 'blur(4px)' }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
              className={`p-8 sm:p-10 border rounded-xs relative overflow-hidden text-left ${
                isGarageLight
                  ? 'bg-white border-black/10 shadow-sm'
                  : 'bg-[#101214] border-white/10 shadow-2xl'
              }`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-xs bg-[#D71920]/10 border border-[#D71920]/30 text-[#D71920] text-xs font-bold">
                    <Lock className="w-3 h-3" />
                    Guest view · restricted access
                  </div>

                  <h3
                    className={`font-heading text-2xl sm:text-3xl font-bold ${
                      isGarageLight ? 'text-[#101214]' : 'text-[#F4F3EF]'
                    }`}
                  >
                    Experience the RouteOne Private Member Dossier
                  </h3>

                  <p
                    className={`text-sm font-light leading-relaxed ${
                      isGarageLight ? 'text-[#2B3035]' : 'text-[#AEB4B5]'
                    }`}
                  >
                    You are currently viewing RouteOne Auto Club as a <strong>Public Guest</strong>.
                    Toggle into the <strong>Private Member</strong> state to preview authenticated driver telemetry,
                    allocated garage slots at Silverstone and Spa, zero-deposit priority dispatch, and the concierge hotline.
                  </p>

                  <div className="pt-2 flex flex-wrap gap-4 text-xs ">
                    <div className="flex items-center gap-2 text-[#85898A]">
                      <CheckCircle2 className="w-4 h-4 text-[#D71920]" />
                      <span>3 Allocated Track Weapons</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#85898A]">
                      <CheckCircle2 className="w-4 h-4 text-[#D71920]" />
                      <span>14 Pre-Booked Track Sessions</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#85898A]">
                      <CheckCircle2 className="w-4 h-4 text-[#D71920]" />
                      <span>FIA Grade 1 Pit telemetry</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div
                    className={`p-5 border rounded-xs ${
                      isGarageLight ? 'bg-[#F6F7F5] border-black/10' : 'bg-[#151719] border-white/10'
                    }`}
                  >
                    <div className="text-xs text-[#85898A] mb-2">
                      Exclusive member authentication
                    </div>
                    <div className=" text-sm font-bold text-[#D71920] mb-1">
                      Member portal · private access
                    </div>
                    <div className="text-[11px] text-[#85898A] mb-4">
                      Access the member-exclusive paddock with temporary credentials (ID: <strong className="text-white">user</strong> • Password: <strong className="text-white">user</strong>).
                    </div>

                    <div className="space-y-2.5">
                      <button
                        id="member-open-login-modal-btn"
                        onClick={openLoginModal}
                        className="w-full py-3 bg-[#D71920] hover:bg-[#B5141A] text-white text-[11px] font-bold rounded-xs transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(215,25,32,0.3)] active:scale-95"
                      >
                        <Lock className="w-4 h-4" />
                        <span>Member login · ID: User</span>
                      </button>

                      <button
                        id="member-simulate-login-hero-btn"
                        onClick={toggleMember}
                        className={`w-full py-2.5 border text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                          isGarageLight
                            ? 'border-black/20 text-[#101214] hover:bg-black/5'
                            : 'border-white/20 text-white hover:bg-white/5'
                        }`}
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#C9B37E]" />
                        <span>Quick 1-CLICK demo access</span>
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-[#85898A] text-center">
                    Tip: Use the <strong>Member / guest</strong> button in the navigation header anytime to access the VIP portal.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
