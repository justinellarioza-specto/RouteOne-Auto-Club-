import React, { CSSProperties } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number; // Delay in ms
  duration?: number; // Transition duration in ms (default 700ms)
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number; // Slide distance in px (default 32px)
  threshold?: number; // IntersectionObserver threshold (0 to 1)
  rootMargin?: string; // IntersectionObserver rootMargin
  triggerOnce?: boolean;
  id?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 700,
  direction = 'up',
  distance = 32,
  threshold = 0.08,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  id,
}) => {
  const { ref, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold,
    rootMargin,
    triggerOnce,
  });

  const getInitialTransform = (): string => {
    switch (direction) {
      case 'up':
        return `translate3d(0, ${distance}px, 0)`;
      case 'down':
        return `translate3d(0, -${distance}px, 0)`;
      case 'left':
        return `translate3d(${distance}px, 0, 0)`;
      case 'right':
        return `translate3d(-${distance}px, 0, 0)`;
      case 'none':
      default:
        return 'translate3d(0, 0, 0)';
    }
  };

  const style: CSSProperties = {
    opacity: isIntersecting ? 1 : 0,
    transform: isIntersecting ? 'translate3d(0, 0, 0)' : getInitialTransform(),
    transition: `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`,
    transitionDelay: `${delay}ms`,
    willChange: isIntersecting ? 'auto' : 'opacity, transform',
  };

  return (
    <div
      ref={ref}
      id={id}
      style={style}
      className={`w-full ${className}`}
    >
      {children}
    </div>
  );
};
