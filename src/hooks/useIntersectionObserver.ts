import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  triggerOnce?: boolean;
  skip?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px 0px -40px 0px',
    triggerOnce = true,
    skip = false,
  } = options;

  const targetRef = useRef<T | null>(null);
  const [isIntersecting, setIsIntersecting] = useState<boolean>(false);
  const [hasIntersected, setHasIntersected] = useState<boolean>(false);

  useEffect(() => {
    if (skip) return;

    // Check if user prefers reduced motion; if so, reveal immediately
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setIsIntersecting(true);
        setHasIntersected(true);
        return;
      }
    }

    // Fallback if browser doesn't support IntersectionObserver
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      setHasIntersected(true);
      return;
    }

    const node = targetRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementVisible = entry.isIntersecting;
        setIsIntersecting(isElementVisible);

        if (isElementVisible) {
          setHasIntersected(true);
          if (triggerOnce) {
            observer.unobserve(node);
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setHasIntersected(false);
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, root, rootMargin, triggerOnce, skip]);

  return {
    ref: targetRef,
    isIntersecting: triggerOnce ? hasIntersected : isIntersecting,
    hasIntersected,
  };
}
