"use client";

import Lenis from "lenis";
import { useEffect } from "react";

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: true,
      // Lower lerp = more inertia/float, higher = snappier. 0.08 is the sweet spot.
      lerp: 0.08,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      // Expo ease-out: fast start, ultra-smooth deceleration tail
      easing: (t: number) => 1 - Math.pow(1 - t, 5),
      // Prevents janky scroll on overscroll-behavior
      overscroll: false,
    });

    let rafId: number;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    // Pause Lenis when tab is hidden to save CPU
    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      lenis.destroy();
    };
  }, []);

  return children;
}
