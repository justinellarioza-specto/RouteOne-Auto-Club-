import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Radio,
  Clock,
  Shield,
  Flag,
  Car,
  Calendar,
  Users,
  AlertTriangle,
  CheckCircle2,
  Volume2,
  Sliders,
  Send,
  Zap,
  Gauge,
  Fuel,
  Activity,
  LogOut,
  ChevronRight,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  MapPin,
  RefreshCw,
  Mail,
} from 'lucide-react';
import { useMember, TrackConditionType } from '../../context/MemberContext';
import { useTheme } from '../../context/ThemeContext';
import { FleetManager } from './FleetManager';
import { TrackBookingAnalytics } from './TrackBookingAnalytics';
import { InquiriesInbox } from './InquiriesInbox';

interface AdminDashboardProps {
  onNavigate?: (tab: string) => void;
}


/** Honest label for tabs that show sample data rather than the live API */
const DemoNotice: React.FC<{ text: string }> = ({ text }) => (
  <div className="mb-4 flex items-start gap-2 px-3.5 py-2.5 rounded-lg border border-amber-500/30 bg-amber-400/10 text-xs text-amber-800">
    <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
    <span>{text}</span>
  </div>
);

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const {
    memberProfile,
    logout,
    trackCondition,
    setTrackCondition,
    trackAnnouncement,
    setTrackAnnouncement,
    fleetVehicles,
    updateVehicleStatus,
    trackBookings,
    allProfiles,
    updateMemberTrackDays,
  } = useMember();
  const { isGarageLight } = useTheme();

  // Active Admin Sub-tab: 'dispatch' | 'inventory' | 'bookings' | 'members'
  const [adminTab, setAdminTab] = useState<'inquiries' | 'dispatch' | 'inventory' | 'bookings' | 'members'>('inquiries');

  // Live Silverstone Race Clock
  const [timeString, setTimeString] = useState<string>('');
  const [newAnnouncementText, setNewAnnouncementText] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Europe/London',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAnnouncementText.trim()) {
      setTrackAnnouncement(`CIRCUIT BROADCAST // ${newAnnouncementText.trim().toUpperCase()}`);
      setNewAnnouncementText('');
    }
  };

  const getConditionColor = (cond: TrackConditionType) => {
    switch (cond) {
      case 'GREEN':
        return {
          bg: 'bg-[#10B981]',
          border: 'border-[#10B981]',
          text: 'text-[#10B981]',
          lightBg: 'bg-[#10B981]/15',
          label: 'Green flag • circuit open',
        };
      case 'YELLOW':
        return {
          bg: 'bg-[#F59E0B]',
          border: 'border-[#F59E0B]',
          text: 'text-[#F59E0B]',
          lightBg: 'bg-[#F59E0B]/15',
          label: 'Yellow flag • paddock caution',
        };
      case 'RED':
        return {
          bg: 'bg-[#D71920]',
          border: 'border-[#D71920]',
          text: 'text-[#D71920]',
          lightBg: 'bg-[#D71920]/15',
          label: 'Red flag • sessions halted',
        };
      case 'CHECKERED':
        return {
          bg: 'bg-white',
          border: 'border-white',
          text: 'text-white',
          lightBg: 'bg-white/15',
          label: 'Checkered flag • in-lap active',
        };
      case 'WET':
        return {
          bg: 'bg-[#3B82F6]',
          border: 'border-[#3B82F6]',
          text: 'text-[#3B82F6]',
          lightBg: 'bg-[#3B82F6]/15',
          label: 'Wet track • inters / rain tires',
        };
    }
  };

  const currentConditionMeta = getConditionColor(trackCondition);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="admin-dashboard-root">
      {/* Top Race Director Status Ribbon */}
      <div
        className={`border rounded-xs p-4 sm:p-5 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 shadow-lg transition-colors ${
          isGarageLight
            ? 'bg-white border-black/10'
            : 'bg-[#101214] border-[#D71920]/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)]'
        }`}
      >
        {/* Left: Director Identity & Live Time */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xs bg-[#D71920] flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(215,25,32,0.4)]">
            Rc
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading text-lg sm:text-xl font-bold text-foreground dark:text-white">
                RACE CONTROL // PADDOCK DIRECTOR
              </h1>
              <span className="text-xs px-2 py-0.5 bg-[#D71920]/15 border border-[#D71920]/40 text-[#D71920] font-bold rounded-xs ">
                Admin access
              </span>
            </div>
            <p className="text-xs text-[#85898A] mt-0.5 flex items-center gap-3">
              <span>Director: <strong>{memberProfile.name}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#10B981]">
                <Radio className="w-3 h-3 animate-pulse" /> FIA MoTeC Link Online
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-foreground dark:text-white font-bold">
                <Clock className="w-3 h-3 text-[#D71920]" /> {timeString || '14:22:08'} Silverstone GMT
              </span>
            </p>
          </div>
        </div>

        {/* Right: Flag Status Quick Toggle & Sign Out */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-[#85898A] mr-1 hidden sm:inline">
            Circuit Flag:
          </span>
          {(['GREEN', 'YELLOW', 'RED', 'CHECKERED', 'WET'] as TrackConditionType[]).map((cond) => {
            const isSelected = trackCondition === cond;
            return (
              <button
                key={cond}
                onClick={() => setTrackCondition(cond)}
                className={`px-2.5 py-1 text-xs font-bold rounded-xs border transition-all cursor-pointer ${
                  isSelected
                    ? `${getConditionColor(cond).lightBg} ${getConditionColor(cond).border} ${
                        getConditionColor(cond).text
                      } ring-1 ring-offset-1`
                    : 'bg-black/20 border-white/10 text-[#85898A] hover:text-white'
                }`}
              >
                {cond}
              </button>
            );
          })}

          <button
            onClick={logout}
            title="Sign out of Race Control"
            className="ml-2 px-2.5 py-1 border border-white/20 hover:border-[#D71920] hover:text-[#D71920] text-xs rounded-xs transition-colors cursor-pointer flex items-center gap-1 text-[#85898A]"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>

      {/* Broadcast Announcement Bar */}
      <div
        className={`border rounded-xs p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs ${
          isGarageLight ? 'bg-black/[0.02] border-black/10' : 'bg-black/30 border-white/10'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 w-full sm:w-auto">
          <span
            className={`px-2 py-0.5 rounded-xs font-bold text-xs flex items-center gap-1.5 ${currentConditionMeta.lightBg} ${currentConditionMeta.text} ${currentConditionMeta.border} border`}
          >
            <Flag className="w-3 h-3" />
            {currentConditionMeta.label}
          </span>
          <span className="text-[#AEB4B5] truncate text-[11px]">{trackAnnouncement}</span>
        </div>

        <form onSubmit={handleBroadcastAnnouncement} className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <input
            type="text"
            placeholder="Broadcast announcement..."
            value={newAnnouncementText}
            onChange={(e) => setNewAnnouncementText(e.target.value)}
            className={`px-3 py-1.5 text-xs rounded-xs border outline-none ${
              isGarageLight
                ? 'bg-white border-black/20 focus:border-[#D71920] text-[#101214]'
                : 'bg-black/40 border-white/20 focus:border-[#D71920] text-white'
            }`}
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#D71920] hover:bg-[#B5141A] text-white font-bold rounded-xs transition-colors cursor-pointer flex items-center gap-1"
          >
            <Send className="w-3 h-3" />
            <span className="hidden sm:inline">Broadcast</span>
          </button>
        </form>
      </div>

      {/* Admin Sub-Tabs Navigation */}
      <div
        className={`border-b flex items-center gap-2 sm:gap-6 text-xs overflow-x-auto ${
          isGarageLight ? 'border-black/10' : 'border-white/10'
        }`}
      >
        <button
          onClick={() => setAdminTab('inquiries')}
          className={`pb-3 pt-1 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            adminTab === 'inquiries'
              ? 'border-[#D71920] text-[#D71920]'
              : 'border-transparent text-[#85898A] hover:text-foreground dark:hover:text-white'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Inquiries</span>
        </button>

        <button
          onClick={() => setAdminTab('dispatch')}
          className={`pb-3 pt-1 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            adminTab === 'dispatch'
              ? 'border-[#D71920] text-[#D71920]'
              : 'border-transparent text-[#85898A] hover:text-foreground dark:hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Pit lane</span>
        </button>

        <button
          onClick={() => setAdminTab('inventory')}
          className={`pb-3 pt-1 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            adminTab === 'inventory'
              ? 'border-[#D71920] text-[#D71920]'
              : 'border-transparent text-[#85898A] hover:text-foreground dark:hover:text-white'
          }`}
        >
          <Car className="w-4 h-4" />
          <span>Fleet</span>
        </button>

        <button
          onClick={() => setAdminTab('bookings')}
          className={`pb-3 pt-1 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            adminTab === 'bookings'
              ? 'border-[#D71920] text-[#D71920]'
              : 'border-transparent text-[#85898A] hover:text-foreground dark:hover:text-white'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Track bookings</span>
          <span className="px-1.5 py-0.2 bg-[#D71920]/20 text-[#D71920] text-[11px] rounded-xs">
            {trackBookings.length}
          </span>
        </button>

        <button
          onClick={() => setAdminTab('members')}
          className={`pb-3 pt-1 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
            adminTab === 'members'
              ? 'border-[#D71920] text-[#D71920]'
              : 'border-transparent text-[#85898A] hover:text-foreground dark:hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Members</span>
          <span className="px-1.5 py-0.2 bg-[#D71920]/20 text-[#D71920] text-[11px] rounded-xs">
            {allProfiles.length}
          </span>
        </button>
      </div>

      {/* TAB CONTENT AREA */}
      <AnimatePresence mode="wait">
        {adminTab === 'inquiries' && (
          <motion.div
            key="inquiries"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <InquiriesInbox />
          </motion.div>
        )}

        {/* =========================================================================
            TAB 1: PADDOCK & PIT LANE DISPATCH
            ========================================================================= */}
        {adminTab === 'dispatch' && (
          <motion.div
            key="dispatch"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <DemoNotice text="Demo screen: pit boxes, radio calls and flags are sample data to show what live race control could look like. They are not connected to the API." />
            {/* Live Pit Box Matrix */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="font-heading text-lg font-bold text-foreground dark:text-white">
                    Silverstone Grand Prix Pit Lane Matrix
                  </h2>
                  <p className="text-xs text-[#85898A]">
                    Live telemetry link to all 8 RouteOne dedicated pit garages.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" /> All Bays Powered
                </span>
              </div>

              {/* 8 Pit Bays Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    box: 'Pit Box 01',
                    car: 'RouteOne R1 Concept #001',
                    driver: 'Sir Alexander Vance',
                    status: 'Hot Lapping (Turn 7)',
                    tire: 'Michelin Pilot Sport Cup 2R (85°C)',
                    fuel: '92%',
                    delta: '-0.342s (Personal Best)',
                    badgeColor: 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]',
                  },
                  {
                    box: 'Pit Box 02',
                    car: 'McLaren Senna GTR',
                    driver: 'Marcus Vance (Steward)',
                    status: 'Blankets Pre-Warm (100°C)',
                    tire: 'Pirelli P Zero Trofeo RS (98°C)',
                    fuel: '100%',
                    delta: 'Telemetry Calibrated',
                    badgeColor: 'bg-[#3B82F6]/20 border-[#3B82F6]/50 text-[#60A5FA]',
                  },
                  {
                    box: 'Pit Box 03',
                    car: 'Aston Martin Valkyrie AMR Pro',
                    driver: 'Elena Rostova',
                    status: 'Hot Lapping (Stowe Corner)',
                    tire: 'Michelin Pilot Sport Cup 2R (91°C)',
                    fuel: '64%',
                    delta: '+0.118s (Sector 2)',
                    badgeColor: 'bg-[#10B981]/20 border-[#10B981]/50 text-[#10B981]',
                  },
                  {
                    box: 'Pit Box 04',
                    car: 'Porsche 911 GT3 RS',
                    driver: 'Daisuke Takahashi',
                    status: 'Fueling Octane 102',
                    tire: 'Goodyear Eagle F1 SuperSport RS',
                    fuel: '40% -> 100%',
                    delta: 'Session Slot 2 Confirmed',
                    badgeColor: 'bg-[#8B5CF6]/20 border-[#8B5CF6]/50 text-[#A78BFA]',
                  },
                  {
                    box: 'Pit Box 05',
                    car: 'Ferrari SF90 XX Stradale',
                    driver: 'Matteo Rossi',
                    status: 'Brake Pad Cooling',
                    tire: 'Brembo Carbon-Ceramic 580°C',
                    fuel: '78%',
                    delta: 'Cool-down lap complete',
                    badgeColor: 'bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]',
                  },
                  {
                    box: 'Pit Box 06',
                    car: 'Bugatti Bolide #004',
                    driver: 'Reserved Member',
                    status: 'Aero Downforce Setup',
                    tire: 'Michelin Custom Slick',
                    fuel: '100%',
                    delta: 'Awaiting Scrutineering',
                    badgeColor: 'bg-[#F59E0B]/20 border-[#F59E0B]/50 text-[#F59E0B]',
                  },
                  {
                    box: 'Pit Box 07',
                    car: 'Mercedes-AMG ONE',
                    driver: 'Private Member (VIP)',
                    status: 'F1 Hybrid Battery Cycling',
                    tire: 'Michelin Pilot Sport Cup 2R',
                    fuel: '85%',
                    delta: 'KERS System Primed',
                    badgeColor: 'bg-[#3B82F6]/20 border-[#3B82F6]/50 text-[#60A5FA]',
                  },
                  {
                    box: 'Pit Box 08',
                    car: 'Lamborghini Revuelto',
                    driver: 'Guest VIP Driver',
                    status: 'Briefing with J. Palmer',
                    tire: 'Bridgestone Potenza Sport',
                    fuel: '95%',
                    delta: 'In-cockpit radio check',
                    badgeColor: 'bg-white/10 border-white/20 text-[#85898A]',
                  },
                ].map((bay, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border rounded-xs text-xs flex flex-col justify-between transition-colors ${
                      isGarageLight
                        ? 'bg-white border-black/10 shadow-xs'
                        : 'bg-[#121517] border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[#D71920] font-bold ">
                          {bay.box}
                        </span>
                        <span
                          className={`text-[11px] px-1.5 py-0.5 rounded-xs font-bold border ${bay.badgeColor}`}
                        >
                          {bay.status}
                        </span>
                      </div>

                      <h4 className="font-heading text-sm font-bold text-foreground dark:text-white truncate">
                        {bay.car}
                      </h4>
                      <p className="text-[11px] text-[#85898A] mt-0.5">{bay.driver}</p>

                      <div className="mt-3 pt-3 border-t border-white/5 space-y-1 text-xs text-[#85898A]">
                        <div className="flex justify-between">
                          <span>Telemetry:</span>
                          <span className="text-foreground dark:text-white font-semibold">{bay.delta}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fuel Level:</span>
                          <span className="text-[#10B981] font-semibold">{bay.fuel}</span>
                        </div>
                        <div className="flex justify-between truncate">
                          <span>Tires:</span>
                          <span className="text-[#AEB4B5] truncate ml-1">{bay.tire}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between gap-1 text-xs">
                      <button
                        onClick={() =>
                          setTrackAnnouncement(
                            `RACE CONTROL NOTICE // ${bay.box.toUpperCase()} CALLED IN FOR TELEMETRY REVIEW`
                          )
                        }
                        className="text-[#85898A] hover:text-[#D71920] transition-colors cursor-pointer"
                      >
                        Radio Call
                      </button>
                      <button
                        onClick={() =>
                          setTrackAnnouncement(
                            `DISPATCH // ${bay.car.toUpperCase()} CLEARED FOR HOT TRACK RUN`
                          )
                        }
                        className="text-[#10B981] font-bold hover:underline cursor-pointer"
                      >
                        Clear to Track →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Circuit Health Banner */}
            <div
              className={`p-5 border rounded-xs flex flex-col md:flex-row items-center justify-between gap-4 ${
                isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#D71920] flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" />
                  Emergency race control halt
                </span>
                <p className="text-xs text-[#85898A]">
                  Trigger an immediate circuit-wide Red Flag. All marshals wave red; vehicles slow to 60 km/h and enter
                  pit lane.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => {
                    setTrackCondition('RED');
                    setTrackAnnouncement('EMERGENCY RED FLAG // ALL SESSIONS SUSPENDED • PROCEED SAFELY TO PIT LANE');
                  }}
                  className="px-4 py-2.5 bg-[#D71920] hover:bg-[#B5141A] text-white text-xs font-bold rounded-xs transition-colors cursor-pointer shadow-[0_0_15px_rgba(215,25,32,0.4)]"
                >
                  Halt all sessions (red flag)
                </button>
                <button
                  onClick={() => {
                    setTrackCondition('GREEN');
                    setTrackAnnouncement('CIRCUIT RESUMED // TRACK GREEN • RE-JOINING PIT LANE SESSIONS');
                  }}
                  className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-white text-xs font-bold rounded-xs transition-colors cursor-pointer"
                >
                  Resume green
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* =========================================================================
            TAB 2: INVENTORY MANAGEMENT UI
            ========================================================================= */}
        {adminTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <FleetManager />
          </motion.div>
        )}

        {/* =========================================================================
            TAB 3: TRACK BOOKING ANALYTICS
            ========================================================================= */}
        {adminTab === 'bookings' && (
          <motion.div
            key="bookings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <DemoNotice text="Sample data: these track sessions are examples stored in the browser. Real customer requests are in the Inquiries tab." />
            <TrackBookingAnalytics />
          </motion.div>
        )}

        {/* =========================================================================
            TAB 4: MEMBER REGISTRY & CLEARANCES
            ========================================================================= */}
        {adminTab === 'members' && (
          <motion.div
            key="members"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <DemoNotice text="Sample data: these member profiles are examples. Real accounts are created through Sign up and stored on the server." />
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-lg font-bold text-foreground dark:text-white">
                  Member Registry & Track Days Allocations
                </h2>
                <p className="text-xs text-[#85898A]">
                  Adjust annual track day balances, manage VIP paddock clearances, and inspect supercar assignments.
                </p>
              </div>
              <span className="text-xs font-bold text-[#D71920]">
                {allProfiles.length} Members in Database
              </span>
            </div>

            {/* Members Roster Table */}
            <div
              className={`border rounded-xs overflow-x-auto ${
                isGarageLight ? 'bg-white border-black/10' : 'bg-[#121517] border-white/10'
              }`}
            >
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-[#85898A] bg-black/20">
                    <th className="py-3 px-4">Member Name & ID</th>
                    <th className="py-3 px-4">Role / Title</th>
                    <th className="py-3 px-4">Membership Tier</th>
                    <th className="py-3 px-4">Allocated Fleet</th>
                    <th className="py-3 px-4">Track Days Balance</th>
                    <th className="py-3 px-4 text-right">Adjust Allocations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {allProfiles.map((p) => (
                    <tr
                      key={p.id}
                      className={`transition-colors ${
                        isGarageLight ? 'hover:bg-black/[0.02]' : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className="font-bold text-foreground dark:text-white block">{p.name}</span>
                        <span className="text-xs text-[#85898A] uppercase">ID: {p.id}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-foreground dark:text-white">{p.role}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 text-xs font-bold border rounded-xs uppercase ${
                            p.id.toLowerCase() === 'admin'
                              ? 'bg-[#D71920]/20 border-[#D71920]/50 text-[#D71920]'
                              : 'bg-[#C9B37E]/20 border-[#C9B37E]/50 text-[#C9B37E]'
                          }`}
                        >
                          {p.tier}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-[#85898A]">
                        {p.allocatedCars.length > 0 ? (
                          <span className="text-foreground dark:text-white font-semibold">
                            {p.allocatedCars.join(', ')}
                          </span>
                        ) : (
                          <span>Standard Fleet Pool</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-[#D71920] text-sm">
                          {p.trackDaysRemaining} Days
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => updateMemberTrackDays(p.id, 1)}
                            className="px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xs font-bold transition-colors cursor-pointer"
                          >
                            +1 Day
                          </button>
                          <button
                            onClick={() => updateMemberTrackDays(p.id, 5)}
                            className="px-2 py-1 bg-[#D71920]/20 hover:bg-[#D71920]/30 border border-[#D71920]/50 text-[#D71920] rounded-xs font-bold transition-colors cursor-pointer"
                          >
                            +5 VIP Days
                          </button>
                          <button
                            onClick={() => updateMemberTrackDays(p.id, -1)}
                            disabled={p.trackDaysRemaining <= 0}
                            className="px-2 py-1 bg-black/20 hover:bg-black/30 border border-white/10 text-[#85898A] rounded-xs font-bold transition-colors cursor-pointer disabled:opacity-40"
                          >
                            -1
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
