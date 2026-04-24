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
      lerp: 0.08,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 5),
      overscroll: false,
    });

    let rafId: number;
    let resizeRafId: number | null = null;

    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    const scheduleResize = () => {
      if (resizeRafId !== null) return;

      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        lenis.resize();
      });
    };

    rafId = requestAnimationFrame(raf);
    scheduleResize();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        lenis.stop();
      } else {
        lenis.start();
        scheduleResize();
      }
    };

    const handleWindowResize = () => {
      scheduleResize();
    };

    const observer = new MutationObserver(() => {
      scheduleResize();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("load", handleWindowResize);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      cancelAnimationFrame(rafId);
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("load", handleWindowResize);
      window.removeEventListener("resize", handleWindowResize);
      lenis.destroy();
    };
  }, []);

  return children;
}
