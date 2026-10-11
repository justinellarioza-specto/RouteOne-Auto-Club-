import React, { useState, useEffect } from 'react';

interface ScrollProgressBarProps {
  currentTab?: string;
}

export const ScrollProgressBar: React.FC<ScrollProgressBarProps> = ({ currentTab }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollTop =
          window.scrollY ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0;
        const scrollHeight =
          Math.max(
            document.documentElement.scrollHeight,
            document.body.scrollHeight,
            document.documentElement.offsetHeight,
            document.body.offsetHeight
          ) - window.innerHeight;

        if (scrollHeight > 0) {
          const progress = (scrollTop / scrollHeight) * 100;
          setScrollProgress(Math.min(100, Math.max(0, progress)));
        } else {
          setScrollProgress(0);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check and delayed check after layout settle
    handleScroll();
    const timeoutId = setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [currentTab]);

  return (
    <div
      id="scroll-progress-bar-container"
      className="fixed top-0 left-0 right-0 h-[2.5px] z-[60] pointer-events-none bg-transparent"
      role="progressbar"
      aria-valuenow={Math.round(scrollProgress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Page scroll progress"
    >
      <div
        id="scroll-progress-bar-indicator"
        className="h-full bg-[#D71920] shadow-[0_0_8px_rgba(215,25,32,0.6)] transition-[width] duration-75 ease-out will-change-[width]"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};
