import React, { useRef } from 'react';
import { useScroll, useSpring, useMotionValueEvent } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { engineAudio } from '../utils/engineAudio';
import { useTheme } from '../context/ThemeContext';

interface TrackExperienceProps {
  onBookTrackSession: () => void;
  onViewCircuitMap?: () => void;
}

export const TrackExperience: React.FC<TrackExperienceProps> = ({
  onBookTrackSession,
  onViewCircuitMap,
}) => {
  const { isGarageLight } = useTheme();
  const stepsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stepsRef,
    offset: ['start 80%', 'center center'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  });

  // Dynamically modulate the circuit beat tempo & filter in the background as user scrolls
  useMotionValueEvent(smoothProgress, 'change', (latest) => {
    const calculatedRpm = Math.round(1800 + Math.min(1, Math.max(0, latest)) * 7400);
    engineAudio.updateRPM(calculatedRpm);
  });

  // 3 Exact Steps from Section 20
  const steps = [
    {
      num: '01',
      title: 'Arrive',
      desc: 'Private showroom welcome and hospitality suite.',
      tag: 'WELCOME & SEATING',
    },
    {
      num: '02',
      title: 'Prepare',
      desc: 'Driver briefing, track walk, and vehicle orientation.',
      tag: 'TECHNICAL BRIEFING',
    },
    {
      num: '03',
      title: 'Drive',
      desc: 'Experience the machine with dedicated telemetry debrief.',
      tag: 'CLOSED CIRCUIT RUNS',
    },
  ];

  return (
    <section
      id="track-experience-section"
      className={`w-full px-6 md:px-10 py-16 border-b transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#F6F7F5] border-black/[0.08]'
          : 'bg-[#0B0D0E] border-white/[0.08]'
      }`}
    >
      {/* Header: 03 / THE EXPERIENCE & YOUR TURN. */}
      <div
        className={`pb-6 mb-10 border-b transition-colors duration-300 ${
          isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.06]'
        }`}
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1.5 h-1.5 bg-[#D71920]" />
            <span
              className={`text-xs ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
              }`}
            >
              The experience
            </span>
          </div>

          <h2
            className={`font-heading text-3xl sm:text-5xl font-semibold uppercase mb-4 ${
              isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
            }`}
          >
            YOUR TURN.
          </h2>

          <p
            className={`text-sm font-light leading-relaxed ${
              isGarageLight ? 'text-[#2B3035]' : 'text-[#AEB4B5]'
            }`}
          >
            The showroom is only the beginning.
            <br />
            <span className={isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'}>
              Step onto the circuit and experience performance from the driver's seat.
            </span>
          </p>
        </div>
      </div>

      {/* 3 Steps: 01 — ARRIVE, 02 — PREPARE, 03 — DRIVE */}
      <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {steps.map((step, idx) => (
          <div
            key={step.num}
            className={`p-6 border transition-all duration-300 flex flex-col justify-between relative rounded-sm ${
              isGarageLight
                ? 'bg-white border-black/10 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] hover:border-black/25'
                : 'bg-[#111415] border-white/[0.08] hover:border-white/20'
            }`}
          >
            {/* Top red micro-tab for 03 step */}
            {idx === 2 && (
              <div className="absolute top-0 right-0 w-10 h-[2px] bg-[#D71920]" />
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`font-heading text-xs ${
                    isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                  }`}
                >
                  {step.num} — {step.title}
                </span>
                <span
                  className={`text-[11px] ${
                    isGarageLight ? 'text-[#8C9399]' : 'text-[#45494A]'
                  }`}
                >
                  {step.tag}
                </span>
              </div>

              <h3
                className={`font-heading text-xl font-medium mb-2 ${
                  isGarageLight ? 'text-[#111415]' : 'text-[#F4F3EF]'
                }`}
              >
                {step.title}
              </h3>

              <p
                className={`text-xs font-light leading-relaxed mb-6 ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#85898A]'
                }`}
              >
                {step.desc}
              </p>
            </div>

            <div
              className={`pt-3 border-t flex items-center justify-between text-xs ${
                isGarageLight
                  ? 'border-black/[0.06] text-[#8C9399]'
                  : 'border-white/[0.06] text-[#45494A]'
              }`}
            >
              <span>Protocol phase</span>
              <span className={`w-1.5 h-1.5 rounded-full ${idx === 2 ? 'bg-[#D71920]' : 'bg-[#C9B37E]'}`} />
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
