import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Compass,
  MapPin,
  Clock,
  Mail,
  ArrowRight,
  Gauge,
  Zap,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Navigation,
  Radio,
  ExternalLink,
  ShieldCheck,
  Eye,
  RotateCcw,
  Maximize2,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { engineAudio } from '../utils/engineAudio';

export interface ProvingGroundZone {
  id: string;
  code: string;
  name: string;
  sector: 'Sector 1' | 'Sector 2' | 'Paddock & Lounge' | 'Testing Facility';
  x: number;
  y: number;
  tooltipX: number;
  tooltipY: number;
  coordinates: string;
  speed: string;
  gear: string;
  elevation: string;
  accessTier: string;
  description: string;
  memberPrivilege: string;
  telemetryMetric: string;
}

const PROVING_GROUND_ZONES: ProvingGroundZone[] = [
  {
    id: 'paddock-01',
    code: 'P01',
    name: 'Paddock 01 • Private Showroom & Member Lounge',
    sector: 'Paddock & Lounge',
    x: 275,
    y: 200,
    tooltipX: 275,
    tooltipY: 155,
    coordinates: "52°04'21.8\"N 1°01'02.4\"W",
    speed: 'Discreet Ingress',
    gear: 'Neutral / Staging',
    elevation: '+152m ASL (Controlled)',
    accessTier: 'Members & Reserved Appointments',
    description:
      'The primary sanctuary of RouteOne. A climate-controlled private collection gallery, champagne hospitality bar, bespoke vehicle configuration suite, and direct glass view into the active telemetry dyno cell.',
    memberPrivilege: 'Biometric keypad access, private lockbox allocation, complimentary private sommelier on track days.',
    telemetryMetric: 'Interior Temp: 20.5°C • Humidity: 45% (Optimal Conservation)',
  },
  {
    id: 'sector-1-straight',
    code: 'S01',
    name: 'Sector 1 • Start/Finish Straight & Speed Trap',
    sector: 'Sector 1',
    x: 240,
    y: 40,
    tooltipX: 240,
    tooltipY: 85,
    coordinates: "52°04'26.4\"N 1°01'08.2\"W",
    speed: '342 km/h Top Velocity',
    gear: '8th Gear (DRS Open)',
    elevation: '+0.5m High-Speed Grade',
    accessTier: 'Circuit Proving Session Required',
    description:
      'High-speed straightaway spanning 880 meters with laser-calibrated FIA timing beacons, radar speed traps, and an acoustic sound-baffle wall designed to capture the unfiltered V10 and hybrid turbo scream.',
    memberPrivilege: 'Full-throttle launch control testing with real-time laser speed trap readouts sent to your mobile app.',
    telemetryMetric: 'Speed Trap Baseline: 342 km/h • 0-200 km/h: 6.2s telemetry record',
  },
  {
    id: 'proving-skidpan',
    code: 'D01',
    name: 'Turn 3–4 • Dynamic Proving Skidpan',
    sector: 'Sector 2',
    x: 440,
    y: 140,
    tooltipX: 430,
    tooltipY: 95,
    coordinates: "52°04'18.9\"N 1°00'55.7\"W",
    speed: '85 km/h Controlled Drift',
    gear: '2nd / 3rd Gear',
    elevation: '-1.2m Drainage Basin',
    accessTier: 'Chassis Tuning & Drift Clinics',
    description:
      'A 120-meter basalt wet-handling skidpan with computer-controlled hydro-jets and dual friction zones for exploring high-speed counter-steering, torque-vectoring differentials, and active aero balance.',
    memberPrivilege: 'Exclusive skidpan access with professional British GT instructors and tire wear telemetry logs.',
    telemetryMetric: 'Surface Friction Coefficient: µ 0.32 (Polished Basalt Wet)',
  },
  {
    id: 'engineering-bay',
    code: 'E01',
    name: 'The Hangar • Engineering Bay & Dyno Cell',
    sector: 'Testing Facility',
    x: 370,
    y: 120,
    tooltipX: 370,
    tooltipY: 75,
    coordinates: "52°04'23.1\"N 1°01'00.3\"W",
    speed: 'Diagnostic Staging',
    gear: 'All-Wheel Dyno',
    elevation: '+153m ASL',
    accessTier: 'Master Technicians & VIP Owners',
    description:
      'FIA-certified workshop equipped with 4-wheel independent hub dyno, Pirelli tire warming ovens, ultrasonic crack inspection rigs, and live CAN-bus telemetry link into our engineering server.',
    memberPrivilege: 'Pre-track 42-point safety scrutineering and bespoke damper compression tuning before session green flag.',
    telemetryMetric: 'Dyno Capacity: Up to 1,600 BHP • Tire Warmers: 90°C Pre-Heat',
  },
  {
    id: 'vip-helipad',
    code: 'H01',
    name: 'VIP Helipad & Private Rotary Ingress',
    sector: 'Paddock & Lounge',
    x: 110,
    y: 220,
    tooltipX: 130,
    tooltipY: 175,
    coordinates: "52°04'15.2\"N 1°01'12.8\"W",
    speed: 'Rotary Approach',
    gear: 'Helicopter Touchdown',
    elevation: '+155m ASL Pad',
    accessTier: 'Air Charter & VIP Members',
    description:
      'Dedicated twin-engine helipad with FAA/CAA approved night-landing lighting array. Direct tarmac connection with private golf cart chauffeur transfer directly to the Paddock 01 entrance in under 90 seconds.',
    memberPrivilege: 'Complimentary air-traffic clearance coordination with Silverstone Tower and executive baggage dispatch.',
    telemetryMetric: 'London Battersea Transit: 22 minutes flight time door-to-pad',
  },
  {
    id: 'north-chicane',
    code: 'C01',
    name: 'North Loop Runoff & Technical Complex',
    sector: 'Sector 2',
    x: 280,
    y: 260,
    tooltipX: 280,
    tooltipY: 215,
    coordinates: "52°04'12.0\"N 1°01'04.5\"W",
    speed: '145 km/h Trail-Braking',
    gear: '3rd Gear',
    elevation: '+2.1m Incline',
    accessTier: 'Track Certified Members',
    description:
      'Dual-apex technical chicane flanked by FIA Grade 1 high-grip kerbing and gravel runoff traps. Tests suspension rebound compliance, trail-braking stability, and rapid weight transfer balance.',
    memberPrivilege: 'On-board telemetry comparison against RouteOne factory driver baseline lap data.',
    telemetryMetric: 'Apex Lateral G: 3.4G • Deceleration: -2.8G in 45 meters',
  },
];

interface LocationProps {
  onScheduleVisit?: () => void;
  onExploreTrack?: () => void;
}

export const Location: React.FC<LocationProps> = ({
  onScheduleVisit = () => {},
  onExploreTrack,
}) => {
  const { isGarageLight } = useTheme();

  // Active Selected Zone
  const [selectedZoneId, setSelectedZoneId] = useState<string>('paddock-01');
  const [hoveredZoneId, setHoveredZoneId] = useState<string | null>(null);

  // View Mode: 'schematic' | 'telemetry' | 'logistics'
  const [viewMode, setViewMode] = useState<'schematic' | 'telemetry' | 'logistics'>('schematic');

  // Interactive Live Tracking Sim
  const [isSimActive, setIsSimActive] = useState<boolean>(true);
  const [simLapTime, setSimLapTime] = useState<string>('01:14.82');
  const [simSpeed, setSimSpeed] = useState<number>(288);
  const [simProgress, setSimProgress] = useState<number>(0);

  // Audio feedback
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);

  // Copy GPS state
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  // Active Zone Object
  const activeZone =
    PROVING_GROUND_ZONES.find((z) => z.id === (hoveredZoneId || selectedZoneId)) ||
    PROVING_GROUND_ZONES[0];

  // Animated vehicle progress along track
  useEffect(() => {
    if (!isSimActive) return;

    const interval = setInterval(() => {
      setSimProgress((prev) => {
        const next = (prev + 0.005) % 1;
        // Calculate dynamic speed based on position on the oval circuit
        let speed = 240;
        if (next < 0.25) {
          // Sector 1 Straight
          speed = Math.floor(310 + Math.sin(next * Math.PI * 4) * 32);
        } else if (next < 0.5) {
          // Turn 1-2
          speed = Math.floor(135 + Math.cos(next * Math.PI * 4) * 20);
        } else if (next < 0.75) {
          // Back straight & dyno sector
          speed = Math.floor(290 + Math.sin(next * Math.PI * 4) * 25);
        } else {
          // Technical Chicane
          speed = Math.floor(115 + Math.sin(next * Math.PI * 4) * 18);
        }
        setSimSpeed(speed);
        return next;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [isSimActive]);

  // Handle Zone Selection
  const handleSelectZone = (zone: ProvingGroundZone) => {
    setSelectedZoneId(zone.id);
    if (soundEnabled) {
      try {
        engineAudio.triggerThrottleBlip();
      } catch {
        // Safe fallback
      }
    }
  };

  // Copy GPS Coordinates
  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(activeZone.coordinates);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  };

  // Calculate live car coordinate on the track oval
  // Path equation: M 60,180 C 60,80 120,40 240,40 C 340,40 430,70 440,140 C 450,210 390,260 280,260 C 170,260 140,220 110,220 C 80,220 60,200 60,180 Z
  // Parametric approximation for the animated dot
  const getCarCoordinates = (t: number) => {
    // 0 -> 1 around circuit
    const angle = t * Math.PI * 2;
    // Base oval center (250, 150), radii rx = 190, ry = 110
    // Modified with subtle curves
    const cx = 250;
    const cy = 150;
    const rx = 185;
    const ry = 105;

    const x = cx + Math.cos(angle - Math.PI / 2) * rx;
    const y = cy + Math.sin(angle - Math.PI / 2) * ry * (1 + 0.15 * Math.sin(angle));
    return { x, y };
  };

  const carPos = getCarCoordinates(simProgress);

  return (
    <section
      id="location-section"
      className={`w-full px-4 sm:px-6 md:px-10 py-16 sm:py-20 border-b transition-colors duration-200 ${
        isGarageLight
          ? 'bg-[#F6F7F5] border-black/[0.08] text-[#101214]'
          : 'bg-[#111314] border-white/[0.08] text-[#F4F4F1]'
      }`}
    >
      {/* Section Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b gap-4 ${
          isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.06]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 bg-[#D8B52A]" />
            <span
              className={`text-xs font-semibold ${
                isGarageLight ? 'text-[#8C6D23]' : 'text-[#D8B52A]'
              }`}
            >
              Headquarters
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-semibold uppercase ">
            WHERE CAN YOU FIND ROUTEONE?
          </h2>
          <p
            className={`text-xs sm:text-sm font-light leading-relaxed max-w-2xl mt-1 ${
              isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
            }`}
          >
            Situated on the perimeter proving grounds of Silverstone Circuit, our private sanctuary combines an FIA-grade testing track with high-security private showrooms.
          </p>
        </div>

        {/* Live Track Status & Interactive Mode Switcher */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Sound FX Toggle */}
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) engineAudio.triggerThrottleBlip();
            }}
            className={`px-2.5 py-1.5 border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-[#D71920] border-[#D71920] text-white'
                : isGarageLight
                ? 'bg-white border-black/15 text-[#565C62] hover:text-[#101214]'
                : 'bg-[#151718] border-white/10 text-[#8B8D8C] hover:text-[#F4F4F1]'
            }`}
            title="Toggle interactive track audio effects"
          >
            {soundEnabled ? (
              <Volume2 className="w-3 h-3 animate-pulse" />
            ) : (
              <VolumeX className="w-3 h-3" />
            )}
            <span>{soundEnabled ? 'Audio on' : 'Audio off'}</span>
          </button>

          {/* Circuit Status Pill */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 border text-xs ${
              isGarageLight
                ? 'bg-white border-black/10 text-[#101214]'
                : 'bg-[#151718] border-white/08 text-[#8B8D8C]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="font-semibold text-emerald-500">Circuit status:</span>
            <span>Green track</span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Interactive Circuit & Proving Ground Map (7 cols) */}
        <div
          className={`lg:col-span-7 border p-5 sm:p-6 flex flex-col justify-between transition-colors shadow-xs ${
            isGarageLight
              ? 'bg-white border-black/[0.08]'
              : 'bg-[#151718] border-white/[0.08]'
          }`}
        >
          {/* Proving Ground Header with GPS and View Mode Buttons */}
          <div>
            <div
              className={`flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b mb-4 gap-3 ${
                isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.06]'
              }`}
            >
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#D8B52A]" />
                <span className="text-[11px] font-semibold">
                  Proving ground sector coordinates
                </span>
              </div>

              {/* GPS Coordinate Pill with Copy Button */}
              <button
                onClick={handleCopyCoordinates}
                className={`inline-flex items-center gap-2 px-2.5 py-1 border text-xs transition-colors cursor-pointer group ${
                  copiedCoords
                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                    : isGarageLight
                    ? 'bg-black/[0.03] hover:bg-black/[0.06] border-black/10 text-[#101214]'
                    : 'bg-[#0E1011] hover:bg-white/[0.06] border-white/10 text-[#AEB4B5]'
                }`}
                title="Click to copy exact GPS coordinates"
              >
                <span>{activeZone.coordinates}</span>
                {copiedCoords ? (
                  <Check className="w-3 h-3 text-emerald-500" />
                ) : (
                  <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            </div>

            {/* Interactive View Mode Tabs */}
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              <button
                onClick={() => setViewMode('schematic')}
                className={`px-3 py-1 text-xs transition-colors cursor-pointer border whitespace-nowrap ${
                  viewMode === 'schematic'
                    ? isGarageLight
                      ? 'bg-[#101214] border-[#101214] text-white font-semibold'
                      : 'bg-[#F4F4F1] border-[#F4F4F1] text-[#111314] font-semibold'
                    : isGarageLight
                    ? 'bg-black/[0.03] border-black/10 text-[#565C62] hover:text-[#101214]'
                    : 'bg-[#111314] border-white/08 text-[#8B8D8C] hover:text-[#F4F4F1]'
                }`}
              >
                1. Sectors & hotspots
              </button>

              <button
                onClick={() => setViewMode('telemetry')}
                className={`px-3 py-1 text-xs transition-colors cursor-pointer border whitespace-nowrap flex items-center gap-1.5 ${
                  viewMode === 'telemetry'
                    ? isGarageLight
                      ? 'bg-[#101214] border-[#101214] text-white font-semibold'
                      : 'bg-[#F4F4F1] border-[#F4F4F1] text-[#111314] font-semibold'
                    : isGarageLight
                    ? 'bg-black/[0.03] border-black/10 text-[#565C62] hover:text-[#101214]'
                    : 'bg-[#111314] border-white/08 text-[#8B8D8C] hover:text-[#F4F4F1]'
                }`}
              >
                <Gauge className="w-3 h-3 text-[#D71920]" />
                <span>2. Live telemetry hud</span>
              </button>

              <button
                onClick={() => setViewMode('logistics')}
                className={`px-3 py-1 text-xs transition-colors cursor-pointer border whitespace-nowrap flex items-center gap-1.5 ${
                  viewMode === 'logistics'
                    ? isGarageLight
                      ? 'bg-[#101214] border-[#101214] text-white font-semibold'
                      : 'bg-[#F4F4F1] border-[#F4F4F1] text-[#111314] font-semibold'
                    : isGarageLight
                    ? 'bg-black/[0.03] border-black/10 text-[#565C62] hover:text-[#101214]'
                    : 'bg-[#111314] border-white/08 text-[#8B8D8C] hover:text-[#F4F4F1]'
                }`}
              >
                <Navigation className="w-3 h-3 text-[#D8B52A]" />
                <span>3. Access & logistics</span>
              </button>
            </div>
          </div>

          {/* Interactive Schematic SVG Display Canvas */}
          <div
            className={`relative w-full aspect-[16/10] sm:aspect-[16/9] border flex items-center justify-center p-2 sm:p-4 overflow-hidden select-none transition-colors ${
              isGarageLight
                ? 'bg-[#EAECE9] border-black/[0.1]'
                : 'bg-[#0E1011] border-white/[0.06]'
            }`}
          >
            {/* Background Grid Pattern */}
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: isGarageLight
                  ? 'radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)'
                  : 'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
              }}
            />

            {/* Circuit SVG Graphic */}
            <svg
              viewBox="0 0 500 300"
              className="w-full h-full max-w-lg z-10"
              style={{ overflow: 'visible' }}
            >
              <defs>
                {/* Sector Glow Filter */}
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Proving Ground Outer Boundary / Runoff outline */}
              <path
                d="M 50,180 C 50,70 110,30 240,30 C 350,30 440,60 455,140 C 465,220 400,270 280,270 C 160,270 130,230 100,230 C 70,230 50,210 50,180 Z"
                className={isGarageLight ? 'stroke-black/10' : 'stroke-white/10'}
                strokeWidth="18"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Secondary Service Road / Pit Access Lane */}
              <path
                d="M 240,40 L 290,120 L 370,120 L 385,150 L 280,200 L 275,200"
                strokeDasharray="4 4"
                className={isGarageLight ? 'stroke-black/25' : 'stroke-white/20'}
                strokeWidth="1.5"
                fill="none"
              />

              {/* Skidpan Circle Graphic */}
              <circle
                cx="440"
                cy="140"
                r="24"
                className={isGarageLight ? 'stroke-amber-600/30' : 'stroke-[#D8B52A]/30'}
                strokeWidth="1.5"
                strokeDasharray="3 3"
                fill="none"
              />

              {/* Main FIA Circuit Racing Line */}
              <path
                d="M 60,180 C 60,80 120,40 240,40 C 340,40 430,70 440,140 C 450,210 390,260 280,260 C 170,260 140,220 110,220 C 80,220 60,200 60,180 Z"
                className={isGarageLight ? 'stroke-black/70' : 'stroke-white/70'}
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* DRS Zone Highlight (Sector 1 Wellington Straight) */}
              <path
                d="M 120,40 C 160,40 200,40 240,40 C 280,40 320,40 350,45"
                stroke="#D71920"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                className="opacity-90"
              />

              {/* Paddock 01 Building Footprint Graphic */}
              <g transform="translate(250, 185)">
                <rect
                  x="-20"
                  y="-12"
                  width="40"
                  height="24"
                  className={
                    activeZone.id === 'paddock-01'
                      ? isGarageLight
                        ? 'fill-[#D8B52A]/30 stroke-[#9C7D2B]'
                        : 'fill-[#D8B52A]/20 stroke-[#D8B52A]'
                      : isGarageLight
                      ? 'fill-black/5 stroke-black/30'
                      : 'fill-white/5 stroke-white/20'
                  }
                  strokeWidth="1.5"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  className={`text-[11px] font-bold ${
                    isGarageLight ? 'fill-black' : 'fill-white'
                  }`}
                >
                  P01
                </text>
              </g>

              {/* Animated Live Race Car Blip */}
              {isSimActive && (
                <g transform={`translate(${carPos.x}, ${carPos.y})`}>
                  {/* Car Halo Pulse */}
                  <circle r="10" className="fill-[#D71920]/20 animate-ping" />
                  <circle r="5" className="fill-[#D71920] stroke-white" strokeWidth="1.5" />
                  <text
                    x="8"
                    y="3"
                    className="text-[11px] font-bold fill-[#D71920]"
                  >
                    R1
                  </text>
                </g>
              )}

              {/* Interactive Zone Hotspots */}
              {PROVING_GROUND_ZONES.map((zone) => {
                const isSelected = selectedZoneId === zone.id;
                const isHovered = hoveredZoneId === zone.id;
                const isPaddock = zone.id === 'paddock-01';

                return (
                  <g
                    key={zone.id}
                    className="cursor-pointer group"
                    onClick={() => handleSelectZone(zone)}
                    onMouseEnter={() => setHoveredZoneId(zone.id)}
                    onMouseLeave={() => setHoveredZoneId(null)}
                  >
                    {/* Pulsing Outer Hit Target */}
                    <circle
                      cx={zone.x}
                      cy={zone.y}
                      r="16"
                      fill="transparent"
                      className="cursor-pointer"
                    />

                    {/* Outer Radar Ring */}
                    <circle
                      cx={zone.x}
                      cy={zone.y}
                      r={isSelected || isHovered ? '10' : '7'}
                      className={`transition-all duration-200 ${
                        isSelected
                          ? isPaddock
                            ? 'stroke-[#D8B52A] fill-[#D8B52A]/30'
                            : 'stroke-[#D71920] fill-[#D71920]/30'
                          : isPaddock
                          ? 'stroke-[#D8B52A] fill-transparent'
                          : isGarageLight
                          ? 'stroke-black/40 fill-white/80'
                          : 'stroke-white/40 fill-black/60'
                      }`}
                      strokeWidth="1.5"
                    />

                    {/* Center Core Dot */}
                    <circle
                      cx={zone.x}
                      cy={zone.y}
                      r={isSelected ? '4.5' : '3'}
                      className={`transition-all duration-200 ${
                        isPaddock
                          ? 'fill-[#D8B52A]'
                          : isSelected
                          ? 'fill-[#D71920]'
                          : isGarageLight
                          ? 'fill-black'
                          : 'fill-white'
                      }`}
                    />

                    {/* Code Label beside Node */}
                    <text
                      cx={zone.x}
                      cy={zone.y}
                      x={zone.x + 8}
                      y={zone.y - 6}
                      className={`text-[11px] font-bold select-none ${
                        isSelected
                          ? isPaddock
                            ? 'fill-[#D8B52A]'
                            : 'fill-[#D71920]'
                          : isGarageLight
                          ? 'fill-black/60'
                          : 'fill-white/60'
                      }`}
                    >
                      {zone.code}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Corner Badges matching original UI */}
            <div
              className={`absolute top-3 left-3 px-2.5 py-1 border text-[11px] transition-colors shadow-xs ${
                isGarageLight
                  ? 'bg-white/95 border-black/15 text-[#101214]'
                  : 'bg-[#111314]/90 border-white/[0.08] text-[#8B8D8C]'
              }`}
            >
              Sector 1 • start/finish straight
            </div>

            <div
              className={`absolute bottom-3 right-3 px-2.5 py-1 border text-[11px] transition-colors shadow-xs ${
                isGarageLight
                  ? 'bg-white/95 border-[#D8B52A]/60 text-[#8C6D23] font-semibold'
                  : 'bg-[#111314]/90 border-white/[0.08] text-[#D8B52A]'
              }`}
            >
              Paddock 01 • private showroom
            </div>

            {/* Real-time Telemetry Sim Overlay HUD */}
            {viewMode === 'telemetry' && (
              <div
                className={`absolute top-3 right-3 p-2.5 border text-left z-20 backdrop-blur-xs ${
                  isGarageLight
                    ? 'bg-white/95 border-black/15 text-[#101214]'
                    : 'bg-[#0B0D0E]/90 border-white/10 text-[#F4F4F1]'
                }`}
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-[11px] text-[#8B8D8C] uppercase">Chassis R1-PROTOTYPE</span>
                  <span className="text-[11px] text-emerald-500 font-bold">Live telemetry</span>
                </div>
                <div className="text-sm font-bold text-[#D71920] flex items-baseline gap-1">
                  <span>{simSpeed}</span>
                  <span className="text-[11px] text-[#8B8D8C] font-normal">KM/H</span>
                </div>
                <div className="text-[11px] text-[#8B8D8C] mt-0.5">
                  Lap: <span className={isGarageLight ? 'text-black font-semibold' : 'text-white'}>{simLapTime}</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Hotspot Jump Pills Row */}
          <div className="mt-3.5 pt-3 border-t border-black/5 dark:border-white/5">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span
                className={`text-[11px] ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                }`}
              >
                Select proving ground location:
              </span>
              <span
                className={`text-[11px] ${
                  isGarageLight ? 'text-[#8C6D23]' : 'text-[#D8B52A]'
                }`}
              >
                {PROVING_GROUND_ZONES.length} Verified access hubs
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {PROVING_GROUND_ZONES.map((zone) => {
                const isSelected = selectedZoneId === zone.id;
                return (
                  <button
                    key={zone.id}
                    onClick={() => handleSelectZone(zone)}
                    className={`px-2.5 py-1 text-[11px] border transition-all cursor-pointer ${
                      isSelected
                        ? isGarageLight
                          ? 'bg-[#101214] border-[#101214] text-white font-semibold'
                          : 'bg-[#D71920] border-[#D71920] text-white font-semibold'
                        : isGarageLight
                        ? 'bg-black/[0.03] hover:bg-black/[0.08] border-black/10 text-[#101214]'
                        : 'bg-[#111314] hover:bg-white/[0.06] border-white/08 text-[#AEB4B5]'
                    }`}
                  >
                    {zone.code} • {zone.name.split('•')[0].trim()}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Hotspot Telemetry Detail Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeZone.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className={`mt-4 p-3.5 sm:p-4 border text-left ${
                isGarageLight
                  ? 'bg-black/[0.02] border-black/10'
                  : 'bg-[#111314] border-white/08'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 mb-2 border-b border-black/5 dark:border-white/5 gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D71920]" />
                  <span className="font-heading text-xs sm:text-sm font-semibold text-[#D8B52A]">
                    {activeZone.name}
                  </span>
                </div>
                <span
                  className={`text-[11px] px-2 py-0.5 border ${
                    isGarageLight
                      ? 'bg-white border-black/10 text-[#565C62]'
                      : 'bg-white/5 border-white/10 text-[#8B8D8C]'
                  }`}
                >
                  {activeZone.sector}
                </span>
              </div>

              <p
                className={`text-[11px] font-light leading-relaxed mb-3 ${
                  isGarageLight ? 'text-[#3E4246]' : 'text-[#AEB4B5]'
                }`}
              >
                {activeZone.description}
              </p>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-black/5 dark:border-white/5 text-[11px]">
                <div>
                  <span
                    className={`block uppercase ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                    }`}
                  >
                    Velocity spec
                  </span>
                  <span className="font-bold text-[#D71920]">{activeZone.speed}</span>
                </div>
                <div>
                  <span
                    className={`block uppercase ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                    }`}
                  >
                    Surface / elev
                  </span>
                  <span className="font-medium">{activeZone.elevation}</span>
                </div>
                <div>
                  <span
                    className={`block uppercase ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                    }`}
                  >
                    Access protocol
                  </span>
                  <span className="font-medium text-emerald-500">{activeZone.accessTier}</span>
                </div>
                <div>
                  <span
                    className={`block uppercase ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                    }`}
                  >
                    Telemetry link
                  </span>
                  <span
                    className={`truncate block ${
                      isGarageLight ? 'text-[#101214]' : 'text-[#F4F4F1]'
                    }`}
                  >
                    {activeZone.telemetryMetric.split('•')[0]}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Card Footer matching screenshot */}
          <div
            className={`pt-4 mt-4 border-t flex items-center justify-between text-xs ${
              isGarageLight
                ? 'border-black/[0.08] text-[#565C62]'
                : 'border-white/[0.06] text-[#505251]'
            }`}
          >
            <span>FIA grade 1 runoff zones</span>
            <span>Silverstone proving ground</span>
          </div>
        </div>

        {/* Right Column: Operational Details, Logistics & Appointment Booking (5 cols) */}
        <div
          className={`lg:col-span-5 border p-5 sm:p-6 flex flex-col justify-between transition-colors shadow-xs ${
            isGarageLight
              ? 'bg-white border-black/[0.08]'
              : 'bg-[#151718] border-white/[0.08]'
          }`}
        >
          <div>
            <span
              className={`text-xs block mb-2 font-semibold ${
                isGarageLight ? 'text-[#8C6D23]' : 'text-[#8B8D8C]'
              }`}
            >
              Discreet access
            </span>
            <h3 className="font-heading text-xl sm:text-2xl font-medium mb-3">
              Visitation by appointment only
            </h3>

            <p
              className={`text-xs font-light leading-relaxed mb-6 ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
              }`}
            >
              To preserve privacy, personalized vehicle walkthroughs and track briefings are hosted exclusively by advance reservation.
            </p>

            {/* Core Address & Contact Logistics */}
            <div
              className={`space-y-4 border-t pt-4 text-xs ${
                isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.06]'
              }`}
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D8B52A] shrink-0 mt-0.5" />
                <div>
                  <span
                    className={`block font-medium ${
                      isGarageLight ? 'text-[#101214]' : 'text-[#F4F4F1]'
                    }`}
                  >
                    Paddock Lane, Circuit Proving Ground
                  </span>
                  <span className={isGarageLight ? 'text-[#565C62]' : 'text-[#505251]'}>
                    Silverstone, Northamptonshire NN12 8TN, UK
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#D8B52A] shrink-0 mt-0.5" />
                <div>
                  <span
                    className={`block font-medium ${
                      isGarageLight ? 'text-[#101214]' : 'text-[#F4F4F1]'
                    }`}
                  >
                    Tuesday – Saturday: 09:00 – 19:00
                  </span>
                  <span className={isGarageLight ? 'text-[#565C62]' : 'text-[#505251]'}>
                    Sunday Circuit Days: 08:00 – 17:00
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#D8B52A] shrink-0 mt-0.5" />
                <div>
                  <span
                    className={`block font-medium ${
                      isGarageLight ? 'text-[#101214]' : 'text-[#F4F4F1]'
                    }`}
                  >
                    concierge@routeoneautoclub.com
                  </span>
                  <span className={isGarageLight ? 'text-[#565C62]' : 'text-[#505251]'}>
                    Direct allocation & member dispatch
                  </span>
                </div>
              </div>
            </div>

            {/* Transit Times & Aviation Logistics Box */}
            <div
              className={`mt-6 p-3.5 border text-xs space-y-2 ${
                isGarageLight
                  ? 'bg-black/[0.02] border-black/10'
                  : 'bg-[#0E1011] border-white/06'
              }`}
            >
              <div className="flex items-center justify-between text-[#D8B52A] font-semibold">
                <span className=" ">Charter & road transit</span>
                <span className="text-[11px]">Direct corridor</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'}>
                  Rotary Transit (London Battersea):
                </span>
                <span className="font-bold">22 mins flight</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'}>
                  Executive Chauffeur (Central London):
                </span>
                <span className="font-bold">75 mins via M40/A43</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'}>
                  Private Aircraft (Cranfield EGTC):
                </span>
                <span className="font-bold">18 mins dispatch</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div
            className={`pt-6 mt-6 border-t space-y-2.5 ${
              isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.06]'
            }`}
          >
            <button
              id="location-schedule-visit-btn"
              onClick={onScheduleVisit}
              className={`w-full group inline-flex items-center justify-between px-4 py-3 text-xs font-semibold transition-all cursor-pointer ${
                isGarageLight
                  ? 'bg-[#101214] text-white hover:bg-[#D71920]'
                  : 'bg-[#F4F4F1] text-[#111314] hover:bg-[#D8B52A]'
              }`}
            >
              <span>Schedule private viewing</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </button>

            {onExploreTrack && (
              <button
                id="location-explore-track-btn"
                onClick={onExploreTrack}
                className={`w-full group inline-flex items-center justify-between px-4 py-2.5 border text-xs transition-colors cursor-pointer ${
                  isGarageLight
                    ? 'border-black/15 bg-white text-[#101214] hover:border-black/40'
                    : 'border-white/15 bg-transparent text-[#AEB4B5] hover:text-[#F4F4F1] hover:border-white/30'
                }`}
              >
                <span>Explore track telemetry</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#D8B52A]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
