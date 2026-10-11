import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gauge,
  Zap,
  Flag,
  RotateCcw,
  Volume2,
  Maximize2,
  Compass,
  ArrowRight,
  Info,
  ChevronRight,
  ChevronLeft,
  Crosshair,
} from 'lucide-react';
import { engineAudio } from '../utils/engineAudio';
import { useTheme } from '../context/ThemeContext';

export interface CircuitHotspot {
  id: string;
  number: string;
  name: string;
  type: 'corner' | 'straight' | 'chicane' | 'hairpin';
  sector: 1 | 2 | 3;
  x: number;
  y: number;
  tooltipX?: number;
  tooltipY?: number;
  speed: string;
  gear: string;
  gForce: string;
  brakingPoint: string;
  elevation: string;
  drsZone?: boolean;
  apexType?: string;
  driverTip: string;
  telemetryNote: string;
}

const CIRCUIT_HOTSPOTS: CircuitHotspot[] = [
  {
    id: 's1-main',
    number: 'S1',
    name: 'Pit Straight / DRS Zone 1',
    type: 'straight',
    sector: 1,
    x: 420,
    y: 420,
    tooltipX: 420,
    tooltipY: 375,
    speed: '342 km/h (DRS Open)',
    gear: '8th Gear',
    gForce: '1.2G Accel',
    brakingPoint: '100m Marker',
    elevation: '+0.5m flat',
    drsZone: true,
    driverTip: 'Hold DRS wide open past the start gantry. Keep left wheels touching the white line to maximize turn-in radius.',
    telemetryNote: 'FIA radar speed trap #1 located 60m before the 100m brake board.',
  },
  {
    id: 't1',
    number: 'T1',
    name: 'Variante Prima (Turn 1)',
    type: 'corner',
    sector: 1,
    x: 675,
    y: 418,
    tooltipX: 675,
    tooltipY: 370,
    speed: '148 km/h Apex',
    gear: '3rd Gear',
    gForce: '4.4G Lateral',
    brakingPoint: '110m Board',
    elevation: '-1.8m drop',
    apexType: 'Late Apex Right',
    driverTip: 'Hard initial brake application at 120 bar pressure. Bleed off steering angle early to prepare for Turn 2.',
    telemetryNote: 'High kerb strike tolerance required; damper high-speed rebound tested at 2,400 N.',
  },
  {
    id: 't2',
    number: 'T2',
    name: 'Ascari Sweeper (Turn 2)',
    type: 'corner',
    sector: 1,
    x: 755,
    y: 310,
    tooltipX: 690,
    tooltipY: 280,
    speed: '235 km/h Apex',
    gear: '5th Gear',
    gForce: '4.8G Lateral',
    brakingPoint: 'Lift & Coast',
    elevation: '+2.4m rise',
    apexType: 'Geometric Flat Apex',
    driverTip: 'High-downforce commitment corner. Aero balance shifts 2% forward as front wing loads up under 950 kg downforce.',
    telemetryNote: 'Full throttle commitment right at the apex marker; slip angle peaks at 5.2 degrees.',
  },
  {
    id: 't3',
    number: 'T3',
    name: 'Curva Grande Kink (Turn 3)',
    type: 'corner',
    sector: 1,
    x: 690,
    y: 195,
    tooltipX: 630,
    tooltipY: 180,
    speed: '288 km/h',
    gear: '7th Gear',
    gForce: '3.6G Lateral',
    brakingPoint: 'No Braking (Flat)',
    elevation: '+1.1m crest',
    apexType: 'Fast Right Arc',
    driverTip: 'Flat-out through the kink. Spot the DRS activation line located 50m past the exit kerb.',
    telemetryNote: 'DRS detection beacon #2 triggers at corner apex.',
  },
  {
    id: 's2-hangar',
    number: 'S2',
    name: 'Hangar Straight / DRS Zone 2',
    type: 'straight',
    sector: 2,
    x: 580,
    y: 125,
    tooltipX: 580,
    tooltipY: 80,
    speed: '335 km/h (DRS Open)',
    gear: '8th Gear',
    gForce: '1.1G Accel',
    brakingPoint: '140m Board',
    elevation: '-3.2m descent',
    drsZone: true,
    driverTip: 'Optimal overtaking corridor with dual slipstream lines. Brake in a straight line before turning in for The Esses.',
    telemetryNote: 'CAN-bus data registers 8,400 RPM in top gear with 720+ e-boost active.',
  },
  {
    id: 't4-5',
    number: 'T4–5',
    name: 'The Esses Chicane',
    type: 'chicane',
    sector: 2,
    x: 440,
    y: 85,
    tooltipX: 440,
    tooltipY: 45,
    speed: '175 km/h Transition',
    gear: '4th Gear',
    gForce: '3.9G Lateral Shift',
    brakingPoint: '80m Marker',
    elevation: '-0.8m dip',
    apexType: 'Left-Right Rapid Shift',
    driverTip: 'Quick steering flick with rapid weight transfer. Clip the inside rumble strip without unsettling the rear diffuser.',
    telemetryNote: 'Anti-roll bar stiffness absorbs 15mm kerb displacement without loss of ground effect suction.',
  },
  {
    id: 't6',
    number: 'T6',
    name: 'La Source Hairpin',
    type: 'hairpin',
    sector: 2,
    x: 235,
    y: 50,
    tooltipX: 250,
    tooltipY: 95,
    speed: '68 km/h Apex',
    gear: '2nd Gear',
    gForce: '5.2G Decel / 3.4G Lat',
    brakingPoint: '130m Heavy Brake',
    elevation: '+4.5m uphill',
    apexType: 'Ultra-Tight V-Shaped Apex',
    driverTip: 'Heaviest braking zone on the circuit. Decelerate from 315 km/h down to 68 km/h in 2.2 seconds. Square off the exit.',
    telemetryNote: 'Carbon-ceramic brake rotor temperature peaks at 820°C on initial bite.',
  },
  {
    id: 't7-8',
    number: 'T7–8',
    name: 'Rivazza Technical Complexes',
    type: 'corner',
    sector: 2,
    x: 245,
    y: 195,
    tooltipX: 295,
    tooltipY: 195,
    speed: '162 km/h Apex',
    gear: '3rd Gear',
    gForce: '3.8G Lateral',
    brakingPoint: '60m Trail-Brake',
    elevation: '-2.1m drop',
    apexType: 'Double-Apex Left',
    driverTip: 'Downhill entry creates front-end weight bias. Modulate throttle carefully on exit to prevent snap oversteer.',
    telemetryNote: 'Active differential tightens to 65% lock on corner exit for optimal traction.',
  },
  {
    id: 's3-back',
    number: 'S3',
    name: 'Intermediate Back Straight',
    type: 'straight',
    sector: 3,
    x: 160,
    y: 285,
    tooltipX: 190,
    tooltipY: 260,
    speed: '292 km/h',
    gear: '7th Gear',
    gForce: '1.3G Accel',
    brakingPoint: '90m Marker',
    elevation: '+1.4m rise',
    driverTip: 'Slight left arc into heavy deceleration. Sight the 100m Parabolica braking board early through the visor.',
    telemetryNote: 'Intermediate timing loop splits Sector 2 and Sector 3 benchmarks.',
  },
  {
    id: 't9',
    number: 'T9',
    name: 'Curva Parabolica Entry',
    type: 'corner',
    sector: 3,
    x: 75,
    y: 350,
    tooltipX: 135,
    tooltipY: 340,
    speed: '190 km/h Entry',
    gear: '4th Gear',
    gForce: '4.1G Lateral',
    brakingPoint: '95m Marker',
    elevation: '-1.2m descent',
    apexType: 'Progressive Radius Sweeper',
    driverTip: 'Progressive radius corner: keep tight in the first third, then let the car track out wide towards the painted kerb.',
    telemetryNote: 'Sustained lateral G requires continuous oil scavenging in dry-sump lubrication system.',
  },
  {
    id: 't10',
    number: 'T10',
    name: 'Parabolica Exit & Pit Entry',
    type: 'corner',
    sector: 3,
    x: 145,
    y: 435,
    tooltipX: 180,
    tooltipY: 460,
    speed: '255 km/h Exit',
    gear: '6th Gear',
    gForce: '3.7G Lateral',
    brakingPoint: 'Full Throttle',
    elevation: 'Level',
    apexType: 'Wide Accelerating Exit',
    driverTip: 'Floor the accelerator as soon as the nose straightens. Hug the left pit entry lane if coming in for fresh rubber.',
    telemetryNote: 'Pit limiter engages at 80 km/h at the yellow dashed line.',
  },
];

interface CircuitMapProps {
  onBookSession?: () => void;
}

export const CircuitMap: React.FC<CircuitMapProps> = ({ onBookSession }) => {
  const { isGarageLight } = useTheme();
  const [activeHotspotId, setActiveHotspotId] = useState<string>('s1-main');
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [sectorFilter, setSectorFilter] = useState<'ALL' | 1 | 2 | 3>('ALL');
  const [showDrsZones, setShowDrsZones] = useState<boolean>(true);
  const [showRacingLine, setShowRacingLine] = useState<boolean>(true);
  const [isPlayingSound, setIsPlayingSound] = useState<boolean>(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const activeHotspot =
    CIRCUIT_HOTSPOTS.find((h) => h.id === (hoveredHotspotId || activeHotspotId)) ||
    CIRCUIT_HOTSPOTS[0];

  const handleSelectHotspot = (hotspot: CircuitHotspot) => {
    setActiveHotspotId(hotspot.id);
  };

  const handleTriggerApexAudio = () => {
    setIsPlayingSound(true);
    engineAudio.triggerThrottleBlip();
    setTimeout(() => setIsPlayingSound(false), 900);
  };

  const handleNextCorner = () => {
    const currentIndex = CIRCUIT_HOTSPOTS.findIndex((h) => h.id === activeHotspotId);
    const nextIndex = (currentIndex + 1) % CIRCUIT_HOTSPOTS.length;
    setActiveHotspotId(CIRCUIT_HOTSPOTS[nextIndex].id);
  };

  const handlePrevCorner = () => {
    const currentIndex = CIRCUIT_HOTSPOTS.findIndex((h) => h.id === activeHotspotId);
    const prevIndex = (currentIndex - 1 + CIRCUIT_HOTSPOTS.length) % CIRCUIT_HOTSPOTS.length;
    setActiveHotspotId(CIRCUIT_HOTSPOTS[prevIndex].id);
  };

  // Main closed F1 circuit path coordinates (viewBox 0 0 880 500)
  const trackPath =
    'M 220 420 L 620 420 C 680 420, 730 400, 750 360 C 770 320, 760 260, 720 220 C 700 200, 680 180, 650 160 L 520 90 C 490 75, 460 70, 430 85 C 400 100, 390 120, 370 120 C 340 120, 310 90, 310 60 C 310 30, 260 25, 230 45 C 200 65, 200 95, 220 125 C 235 145, 250 170, 245 200 C 240 230, 220 250, 190 265 L 120 300 C 80 320, 60 360, 75 400 C 90 435, 140 445, 180 430 C 195 425, 205 420, 220 420 Z';

  // Pit lane path
  const pitLanePath =
    'M 170 430 C 190 455, 220 458, 250 458 L 470 458 C 500 458, 540 445, 560 420';

  // DRS Zone 1 (Main Straight)
  const drsZone1Path = 'M 250 420 L 580 420';

  // DRS Zone 2 (Hangar Straight)
  const drsZone2Path = 'M 650 160 L 530 95';

  return (
    <div
      id="circuit-map-container"
      className="w-full bg-[#111415] border border-white/[0.08] transition-all duration-300 overflow-hidden mb-12"
    >
      {/* Circuit Header & Global Telemetry Bar */}
      <div className="p-6 md:p-8 border-b border-white/[0.08] bg-[#0E1011] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="w-1.5 h-1.5 bg-[#D71920] inline-block" />
            <span className="text-xs text-[#85898A]">
              FIA grade 1 specification
            </span>
            <span className="w-4 h-[1px] bg-white/10" />
            <span className="text-[11px] text-[#C9B37E]">
              Silverstone / Monza architecture
            </span>
          </div>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-[#F4F3EF] font-semibold uppercase ">
            AUTODROMO GRAND PRIX CIRCUIT
          </h2>
          <p className="text-xs sm:text-sm text-[#85898A] font-light mt-1 max-w-2xl">
            Interactive telemetry map with calibrated apex velocities, braking markers, G-load zones, and dual DRS overtaking corridors.
          </p>
        </div>

        {/* Quick Circuit Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
          <div className="p-3 bg-[#151718] border border-white/[0.06]">
            <div className="text-[11px] text-[#85898A] ">Lap length</div>
            <div className="text-sm font-bold text-[#F4F3EF]">5.421 KM</div>
          </div>
          <div className="p-3 bg-[#151718] border border-white/[0.06]">
            <div className="text-[11px] text-[#85898A] ">Turns / apexes</div>
            <div className="text-sm font-bold text-[#D71920]">10 hotspots</div>
          </div>
          <div className="p-3 bg-[#151718] border border-white/[0.06]">
            <div className="text-[11px] text-[#85898A] ">DRS zones</div>
            <div className="text-sm font-bold text-emerald-400">2 active</div>
          </div>
          <div className="p-3 bg-[#151718] border border-white/[0.06]">
            <div className="text-[11px] text-[#85898A] ">Lap benchmark</div>
            <div className="text-sm font-bold text-[#C9B37E]">1:18.420</div>
          </div>
        </div>
      </div>

      {/* Map Controls Toolbar */}
      <div className="px-6 md:px-8 py-3 bg-[#151718] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
        {/* Sector Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs text-[#85898A] mr-2 hidden sm:inline-block">
            Filter sector:
          </span>
          {(['ALL', 1, 2, 3] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => setSectorFilter(sec)}
              className={`px-2.5 py-1 text-xs border transition-all cursor-pointer ${
                sectorFilter === sec
                  ? 'bg-[#D71920] text-white border-[#D71920] font-semibold'
                  : 'bg-[#111415] text-[#85898A] border-white/10 hover:text-[#F4F3EF] hover:border-white/20'
              }`}
            >
              {sec === 'ALL' ? 'All sectors' : `SECTOR ${sec}`}
            </button>
          ))}
        </div>

        {/* Display Layer Toggles */}
        <div className="flex items-center gap-2 sm:gap-4 text-[11px] ">
          <button
            onClick={() => setShowDrsZones(!showDrsZones)}
            className={`flex items-center gap-1.5 px-2.5 py-1 border transition-colors cursor-pointer ${
              showDrsZones
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-[#111415] border-white/10 text-[#85898A]'
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>DRS zones</span>
          </button>

          <button
            onClick={() => setShowRacingLine(!showRacingLine)}
            className={`flex items-center gap-1.5 px-2.5 py-1 border transition-colors cursor-pointer ${
              showRacingLine
                ? 'bg-[#D71920]/10 border-[#D71920]/30 text-[#D71920]'
                : 'bg-[#111415] border-white/10 text-[#85898A]'
            }`}
          >
            <Crosshair className="w-3 h-3" />
            <span>Racing line</span>
          </button>

          <button
            onClick={handleTriggerApexAudio}
            disabled={isPlayingSound}
            title="Play engine throttle blip audio"
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111415] hover:bg-white/[0.06] border border-white/10 text-[#AEB4B5] hover:text-[#F4F3EF] transition-colors cursor-pointer"
          >
            <Volume2 className={`w-3 h-3 ${isPlayingSound ? 'text-[#D71920] animate-bounce' : ''}`} />
            <span className="hidden sm:inline">Apex audio</span>
          </button>
        </div>
      </div>

      {/* Main Grid: SVG Circuit Canvas & Telemetry Inspection HUD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
        {/* Left / Center: Interactive SVG Circuit Viewport */}
        <div className="lg:col-span-8 p-4 sm:p-8 bg-[#0B0D0E] relative flex flex-col items-center justify-center min-h-[460px] overflow-hidden select-none">
          {/* Subtle Circuit Blueprint Grid Background */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, rgba(215, 25, 32, 0.08) 0, transparent 70%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 30px 30px, 30px 30px',
            }}
          />

          {/* Compass Rose */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 text-xs text-[#85898A] bg-[#111415]/80 px-2 py-1 border border-white/10">
            <Compass className="w-3 h-3 text-[#C9B37E]" />
            <span>N 52°04'18" w 01°01'03"</span>
          </div>

          {/* Interactive Hint */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 text-xs text-[#AEB4B5] bg-[#111415]/80 px-2.5 py-1 border border-white/10">
            <Info className="w-3 h-3 text-[#D71920]" />
            <span>Hover corners for telemetry</span>
          </div>

          {/* SVG Map */}
          <div className="w-full max-w-[840px] relative">
            <svg
              ref={svgRef}
              viewBox="0 0 880 500"
              className="w-full h-auto filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)]"
            >
              <defs>
                {/* FIA Kerb Pattern Red/White */}
                <pattern
                  id="f1-kerb"
                  width="16"
                  height="8"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect width="8" height="8" fill="#D71920" />
                  <rect x="8" width="8" height="8" fill="#F4F3EF" />
                </pattern>

                {/* DRS Zone Neon Gradient */}
                <linearGradient id="drs-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00E599" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#00FFAA" stopOpacity="1" />
                  <stop offset="100%" stopColor="#00E599" stopOpacity="0.8" />
                </linearGradient>

                {/* Track Radial Glow */}
                <filter id="track-shadow" x="-10%" y="-10%" width="120%" height="120%">
                  <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Gravel Run-Off / Safety Zones */}
              <path
                d="M 600 440 C 700 445, 780 410, 800 350 C 820 290, 800 230, 750 190 L 730 180"
                fill="none"
                stroke={isGarageLight ? '#D5D8D0' : '#1C1F20'}
                strokeWidth="48"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
              />
              <path
                d="M 280 40 C 230 20, 180 40, 170 80 C 160 120, 180 150, 200 170"
                fill="none"
                stroke={isGarageLight ? '#D5D8D0' : '#1C1F20'}
                strokeWidth="44"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
              />
              <path
                d="M 60 300 C 40 350, 40 410, 80 450 C 120 480, 170 470, 200 450"
                fill="none"
                stroke={isGarageLight ? '#D5D8D0' : '#1C1F20'}
                strokeWidth="46"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.4"
              />

              {/* Outer Run-off Tarmac & Kerb Boundaries */}
              <path
                d={trackPath}
                fill="none"
                stroke="url(#f1-kerb)"
                strokeWidth="24"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.85"
              />

              {/* Main Asphalt Circuit Surface */}
              <path
                d={trackPath}
                fill="none"
                stroke={isGarageLight ? '#2B3035' : '#151819'}
                strokeWidth="16"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#track-shadow)"
              />

              {/* Inner Track Dark Asphalt Core */}
              <path
                d={trackPath}
                fill="none"
                stroke={isGarageLight ? '#1B1E22' : '#090A0B'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Pit Lane Parallel Track */}
              <path
                d={pitLanePath}
                fill="none"
                stroke={isGarageLight ? '#8C9399' : '#2A2E30'}
                strokeWidth="6"
                strokeDasharray="4 2"
                strokeLinecap="round"
              />

              {/* Pit Building Graphic */}
              <rect
                x="280"
                y="468"
                width="160"
                height="8"
                fill={isGarageLight ? '#565C62' : '#222628'}
                stroke={isGarageLight ? '#2B3035' : '#333739'}
                strokeWidth="1"
              />
              <text
                x="360"
                y="484"
                textAnchor="middle"
                fontSize="8"
                fontFamily="monospace"
                fill="#85898A"
                letterSpacing="2"
              >
                Paddock &amp; team garages
              </text>

              {/* DRS Zones (When Enabled) */}
              {showDrsZones && (
                <>
                  <path
                    d={drsZone1Path}
                    fill="none"
                    stroke="url(#drs-glow)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  <path
                    d={drsZone2Path}
                    fill="none"
                    stroke="url(#drs-glow)"
                    strokeWidth="5"
                    strokeLinecap="round"
                    className="animate-pulse"
                  />
                  {/* DRS Zone Badges */}
                  <g transform="translate(420, 404)">
                    <rect x="-24" y="-7" width="48" height="14" fill="#00E599" rx="2" />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill="#050607"
                    >
                      DRS zone 1
                    </text>
                  </g>
                  <g transform="translate(595, 96)">
                    <rect x="-24" y="-7" width="48" height="14" fill="#00E599" rx="2" />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill="#050607"
                    >
                      DRS zone 2
                    </text>
                  </g>
                </>
              )}

              {/* Racing Line (When Enabled) */}
              {showRacingLine && (
                <path
                  d={trackPath}
                  fill="none"
                  stroke="#D71920"
                  strokeWidth="2"
                  strokeDasharray="6 8"
                  opacity="0.9"
                  strokeLinecap="round"
                />
              )}

              {/* Start / Finish Gantry Line at (340, 420) */}
              <g transform="translate(340, 405)">
                <line x1="0" y1="0" x2="0" y2="30" stroke="#F4F3EF" strokeWidth="4" strokeDasharray="3 3" />
                <rect x="-16" y="-14" width="32" height="12" fill="#D71920" rx="1" />
                <text
                  x="0"
                  y="-5.5"
                  textAnchor="middle"
                  fontSize="7"
                  fontWeight="bold"
                  fontFamily="monospace"
                  fill="#FFFFFF"
                >
                  Start/finish
                </text>
              </g>

              {/* Speed Trap Radar Checkpoint */}
              <g transform="translate(610, 405)">
                <circle cx="0" cy="0" r="4" fill="#C9B37E" />
                <text x="0" y="-8" textAnchor="middle" fontSize="6.5" fontFamily="monospace" fill="#C9B37E">
                  Radar 340+
                </text>
              </g>

              {/* Sector Divider Labels */}
              <g transform="translate(730, 245)">
                <text x="0" y="0" fontSize="8" fontFamily="monospace" fill="#85898A" fontWeight="bold">
                  S1 / S2 split
                </text>
              </g>
              <g transform="translate(140, 260)">
                <text x="0" y="0" fontSize="8" fontFamily="monospace" fill="#85898A" fontWeight="bold">
                  S2 / S3 split
                </text>
              </g>

              {/* Interactive Hotspot Nodes */}
              {CIRCUIT_HOTSPOTS.map((hotspot) => {
                const isFiltered =
                  sectorFilter !== 'ALL' && hotspot.sector !== sectorFilter;
                const isSelected = activeHotspotId === hotspot.id;
                const isHovered = hoveredHotspotId === hotspot.id;
                const isActive = isSelected || isHovered;

                if (isFiltered) return null;

                return (
                  <g
                    key={hotspot.id}
                    id={`circuit-node-${hotspot.id}`}
                    transform={`translate(${hotspot.x}, ${hotspot.y})`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredHotspotId(hotspot.id)}
                    onMouseLeave={() => setHoveredHotspotId(null)}
                    onClick={() => handleSelectHotspot(hotspot)}
                  >
                    {/* Pulsing ring on active */}
                    {isActive && (
                      <circle
                        cx="0"
                        cy="0"
                        r="18"
                        fill="none"
                        stroke="#D71920"
                        strokeWidth="1.5"
                        className="animate-ping"
                        opacity="0.6"
                      />
                    )}

                    {/* Outer circle halo */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isActive ? 13 : 9}
                      fill={isActive ? '#D71920' : '#111415'}
                      stroke={isActive ? '#FFFFFF' : '#85898A'}
                      strokeWidth={isActive ? 2 : 1.2}
                      className="transition-all duration-200"
                    />

                    {/* Text Number inside node */}
                    <text
                      x="0"
                      y={isActive ? 3.5 : 3}
                      textAnchor="middle"
                      fontSize={isActive ? 8 : 7}
                      fontWeight="bold"
                      fontFamily="monospace"
                      fill={isActive ? '#FFFFFF' : '#F4F3EF'}
                    >
                      {hotspot.number}
                    </text>
                  </g>
                );
              })}

              {/* Interactive Floating SVG Tooltip Anchor */}
              {activeHotspot && (
                <g
                  transform={`translate(${activeHotspot.tooltipX ?? activeHotspot.x}, ${
                    activeHotspot.tooltipY ?? activeHotspot.y - 35
                  })`}
                  className="pointer-events-none transition-all duration-200"
                >
                  <rect
                    x="-65"
                    y="-22"
                    width="130"
                    height="26"
                    fill="#050607"
                    stroke="#D71920"
                    strokeWidth="1"
                    rx="2"
                    filter="url(#track-shadow)"
                  />
                  <text
                    x="0"
                    y="-9"
                    textAnchor="middle"
                    fontSize="7"
                    fontWeight="bold"
                    fontFamily="monospace"
                    fill="#C9B37E"
                    letterSpacing="0.5"
                  >
                    {activeHotspot.name.toUpperCase()}
                  </text>
                  <text
                    x="0"
                    y="-0.5"
                    textAnchor="middle"
                    fontSize="7"
                    fontFamily="monospace"
                    fill="#F4F3EF"
                  >
                    {activeHotspot.speed} // {activeHotspot.gear}
                  </text>
                  {/* Arrow pin pointing to hotspot */}
                  <polygon points="-4,4 4,4 0,8" fill="#D71920" />
                </g>
              )}
            </svg>
          </div>

          {/* Stepper Controls at bottom of map */}
          <div className="w-full mt-4 flex items-center justify-between text-xs text-[#85898A] border-t border-white/[0.08] pt-3">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrevCorner}
                className="p-1.5 bg-[#151718] hover:bg-white/10 border border-white/10 hover:text-white transition-colors cursor-pointer"
                title="Previous Corner"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextCorner}
                className="p-1.5 bg-[#151718] hover:bg-white/10 border border-white/10 hover:text-white transition-colors cursor-pointer"
                title="Next Corner"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-[#AEB4B5] pl-1">
                Cycle corners ({CIRCUIT_HOTSPOTS.findIndex((h) => h.id === activeHotspot.id) + 1}/{CIRCUIT_HOTSPOTS.length})
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#00E599]" />
              <span>DRS speedways</span>
              <span className="w-2 h-2 rounded-full bg-[#D71920] ml-2" />
              <span>Apex braking</span>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Telemetry & Corner Inspection HUD */}
        <div className="lg:col-span-4 p-6 sm:p-8 bg-[#151718] border-t lg:border-t-0 lg:border-l border-white/[0.08] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHotspot.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              {/* Header Badge */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#D71920] text-white text-xs font-bold ">
                    {activeHotspot.number}
                  </span>
                  <span className="text-xs text-[#C9B37E]">
                    Sector {activeHotspot.sector}
                  </span>
                </div>
                <span className="text-xs text-[#85898A]">
                  {activeHotspot.type.toUpperCase()}
                </span>
              </div>

              {/* Corner Title */}
              <div>
                <h3 className="font-heading text-2xl text-[#F4F3EF] font-semibold ">
                  {activeHotspot.name}
                </h3>
                {activeHotspot.apexType && (
                  <div className="text-[11px] text-[#AEB4B5] mt-0.5">
                    Type: {activeHotspot.apexType}
                  </div>
                )}
              </div>

              {/* Real-Time Telemetry Grid */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 bg-[#111415] border border-white/[0.06]">
                  <div className="text-[11px] text-[#85898A] ">Velocity</div>
                  <div className="text-sm font-bold text-[#F4F3EF] flex items-center gap-1.5 mt-0.5">
                    <Gauge className="w-3.5 h-3.5 text-[#D71920]" />
                    <span>{activeHotspot.speed}</span>
                  </div>
                </div>

                <div className="p-3 bg-[#111415] border border-white/[0.06]">
                  <div className="text-[11px] text-[#85898A] ">Transmission</div>
                  <div className="text-sm font-bold text-[#F4F3EF] mt-0.5">
                    {activeHotspot.gear}
                  </div>
                </div>

                <div className="p-3 bg-[#111415] border border-white/[0.06]">
                  <div className="text-[11px] text-[#85898A] ">G-load peak</div>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {activeHotspot.gForce}
                  </div>
                </div>

                <div className="p-3 bg-[#111415] border border-white/[0.06]">
                  <div className="text-[11px] text-[#85898A] ">Brake marker</div>
                  <div className="text-sm font-bold text-[#F4F3EF] mt-0.5 truncate" title={activeHotspot.brakingPoint}>
                    {activeHotspot.brakingPoint}
                  </div>
                </div>
              </div>

              {/* Driver Technical Line Guidance */}
              <div className="p-4 bg-[#111415] border border-white/[0.08] relative">
                <div className="flex items-center gap-2 text-xs text-[#C9B37E] mb-1.5">
                  <Flag className="w-3 h-3 text-[#D71920]" />
                  <span>Pro driver briefing</span>
                </div>
                <p className="text-xs text-[#AEB4B5] font-light leading-relaxed">
                  "{activeHotspot.driverTip}"
                </p>
              </div>

              {/* Telemetry Sensor Notes */}
              <div className="text-[11px] text-[#85898A] flex items-start gap-2 pt-1 border-t border-white/[0.06]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                <span>{activeHotspot.telemetryNote}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Action Footer: Book Session or Test Lap */}
          <div className="pt-6 mt-6 border-t border-white/[0.08] space-y-3">
            <button
              onClick={() => onBookSession?.()}
              className="w-full py-3 bg-[#D71920] hover:bg-[#b5141a] text-white text-xs font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#D71920]/20"
            >
              <span>Book session on this circuit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleTriggerApexAudio}
              className="w-full py-2 bg-[#111415] hover:bg-white/[0.06] border border-white/10 text-[#AEB4B5] hover:text-[#F4F3EF] text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-3 h-3 text-[#C9B37E]" />
              <span>Simulate apex throttle sound</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
