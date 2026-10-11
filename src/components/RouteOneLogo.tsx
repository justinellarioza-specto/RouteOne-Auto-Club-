import React from 'react';
import { useTheme } from '../context/ThemeContext';

export interface RouteOneLogoProps {
  /** Force a specific theme colorway, or default to auto-detecting active theme */
  mode?: 'auto' | 'light' | 'dark';
  /** 'emblem' renders just the aerodynamic R mark; 'full' includes ROUTEONE AUTO CLUB typography */
  variant?: 'emblem' | 'full';
  /** Custom sizing classes for the emblem SVG (e.g. h-7 w-auto, h-8 w-auto) */
  className?: string;
  /** Custom class for the outer container */
  containerClassName?: string;
  /** Whether clicking the logo is interactive or static */
  onClick?: () => void;
}

/**
 * RouteOne Auto Club Signature Emblem
 * Exact reproduction of the official brand mark:
 * - Pure 2.07:1 aspect ratio matching the master design (viewBox 0 0 500 242)
 * - Forward-raked 42° intake stem with flat horizontal baseline
 * - Aerodynamic top wing with rounded foil endcap
 * - Negative space high-speed arrow/dart notch pointing up-right
 * - 3D folded curved ribbon diffuser leg with authentic deep fold shadow
 * 
 * Tuned colorways:
 * - Garage Light Mode: Deep luxury racing crimson (#88080E -> #C0121A -> #480003)
 * - Circuit Dark Mode: Radiant luminous racing scarlet (#BD0E15 -> #FF202A -> #580004)
 */
export const RouteOneLogo: React.FC<RouteOneLogoProps> = ({
  mode = 'auto',
  variant = 'emblem',
  className = 'h-7 sm:h-8 w-auto',
  containerClassName = '',
  onClick,
}) => {
  const { isGarageLight } = useTheme();
  const isDark = mode === 'dark' ? true : mode === 'light' ? false : !isGarageLight;
  const idPrefix = isDark ? 'ro-dark' : 'ro-light';
  const [imgError, setImgError] = React.useState(false);

  // Official brand mark (same file in both themes). Never force width AND height, so it can't stretch.
  const logoSrc = '/images/brand/routeone-logo.png';
  // Size by ONE dimension; the other is always auto so the mark keeps its proportions.
  const hasW = /(^|\s)(\w+:)?w-(?!auto)/.test(className);
  const hasH = /(^|\s)(\w+:)?h-(?!auto)/.test(className);
  const sizeClass = hasW && !hasH
    ? `${className} h-auto`
    : hasH && !hasW
    ? `${className} w-auto`
    : hasW && hasH
    ? `${className} object-contain`
    : `${className} h-8 w-auto`;

  const emblemSvg = (
    <svg
      viewBox="0 0 600 260"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
      style={{ aspectRatio: '600 / 260' }}
      className={`object-contain shrink-0 select-none ${className}`}
      aria-label="RouteOne Emblem"
    >
      <defs>
        {/* Dynamic Gradients for Wing and Left Stem */}
        <linearGradient
          id={`${idPrefix}-wing-grad`}
          x1="0%"
          y1="75%"
          x2="98%"
          y2="20%"
        >
          {isDark ? (
            <>
              <stop offset="0%" stopColor="#B20E16" />
              <stop offset="22%" stopColor="#E0141D" />
              <stop offset="48%" stopColor="#FF222B" />
              <stop offset="72%" stopColor="#C81018" />
              <stop offset="100%" stopColor="#6A0006" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#8A0B11" />
              <stop offset="22%" stopColor="#B51018" />
              <stop offset="48%" stopColor="#DB1620" />
              <stop offset="72%" stopColor="#A20C13" />
              <stop offset="100%" stopColor="#4E0105" />
            </>
          )}
        </linearGradient>

        {/* Dynamic Gradients for 3D Ribbon Leg */}
        <linearGradient
          id={`${idPrefix}-ribbon-grad`}
          x1="15%"
          y1="10%"
          x2="85%"
          y2="90%"
        >
          {isDark ? (
            <>
              <stop offset="0%" stopColor="#D8121B" />
              <stop offset="30%" stopColor="#FF2832" />
              <stop offset="65%" stopColor="#D00F17" />
              <stop offset="100%" stopColor="#880209" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#C01018" />
              <stop offset="30%" stopColor="#E81822" />
              <stop offset="65%" stopColor="#B80D15" />
              <stop offset="100%" stopColor="#700308" />
            </>
          )}
        </linearGradient>

        {/* 3D Fold Crease Shadow */}
        <linearGradient
          id={`${idPrefix}-shadow-grad`}
          x1="0%"
          y1="15%"
          x2="90%"
          y2="85%"
        >
          {isDark ? (
            <>
              <stop offset="0%" stopColor="#100002" stopOpacity="0.98" />
              <stop offset="45%" stopColor="#300004" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#550007" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#600008" stopOpacity="0.0" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#180002" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#3A0005" stopOpacity="0.75" />
              <stop offset="85%" stopColor="#650108" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#70020A" stopOpacity="0.0" />
            </>
          )}
        </linearGradient>
      </defs>

      {/* 1. Master Continuous Silhouette (Left Stem, Top Canopy Wing, Outer Loop & Right Foot) */}
      <path
        d="M 30 240
           L 195 75
           C 210 45, 235 25, 260 22
           C 340 18, 440 22, 545 30
           C 560 33, 568 40, 565 48
           C 562 56, 552 64, 540 68
           C 485 85, 445 108, 435 135
           C 425 160, 420 185, 425 205
           C 430 225, 415 240, 390 240
           L 260 240
           C 252 225, 250 200, 262 180
           C 285 152, 330 125, 385 102
           C 320 122, 250 145, 195 165
           L 225 165
           L 145 240
           L 30 240
           Z"
        fill={`url(#${idPrefix}-wing-grad)`}
      />

      {/* 2. Right 3D Ribbon Leg Front Face Overlay */}
      <path
        d="M 385 102
           C 425 95, 480 82, 540 68
           C 485 85, 445 108, 435 135
           C 425 160, 420 185, 425 205
           C 430 225, 415 240, 390 240
           L 260 240
           C 252 225, 250 200, 262 180
           C 285 152, 330 125, 385 102
           Z"
        fill={`url(#${idPrefix}-ribbon-grad)`}
      />

      {/* 3. 3D Under-Fold Shadow Overlay (Crease beneath the arrow) */}
      <path
        d="M 385 102
           C 330 125, 285 152, 262 180
           C 252 225, 250 200, 260 240
           C 275 220, 305 180, 345 145
           C 365 125, 378 112, 385 102
           Z"
        fill={`url(#${idPrefix}-shadow-grad)`}
      />
    </svg>
  );

  // Icon image with non-stretching wrapper div
  const iconElement = (
    <div className="logo-wrapper shrink-0 inline-flex items-center">
      {!imgError ? (
        <img
          src={logoSrc}
          alt="RouteOne Logo"
          width={485}
          height={246}
          style={{ aspectRatio: '485 / 246', objectFit: 'contain' }}
          className={`block select-none max-w-none ${sizeClass}`}
          onError={() => setImgError(true)}
          loading="eager"
          decoding="async"
          draggable={false}
        />
      ) : (
        emblemSvg
      )}
    </div>
  );

  if (variant === 'emblem') {
    return (
      <div
        className={`inline-flex flex-row items-center justify-center shrink-0 ${containerClassName}`}
        onClick={onClick}
      >
        {iconElement}
      </div>
    );
  }

  return (
    <div
      className={`inline-flex flex-row items-center gap-3 select-none shrink-0 ${containerClassName}`}
      onClick={onClick}
    >
      {iconElement}

      {/* Horizontally aligned text block */}
      <div className="flex flex-col text-left justify-center shrink-0">
        <span
          className={`font-heading text-sm sm:text-base font-medium leading-none transition-colors ${
            isDark ? 'text-[#F4F3EF]' : 'text-[#101214]'
          }`}
        >
          RouteOne
        </span>
        <span
          className={`text-[11px] sm:text-[11px] leading-none mt-1 transition-colors ${
            isDark ? 'text-[#85898A]' : 'text-[#565C62]'
          }`}
        >
          Auto Club
        </span>
      </div>
    </div>
  );
};

export default RouteOneLogo;
