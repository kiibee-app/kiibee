"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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

    let resizeRafId: number | null = null;
    lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const scheduleResize = () => {
      if (resizeRafId !== null) return;

      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        lenis.resize();
      });
    };

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

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("load", handleWindowResize);
    window.addEventListener("resize", handleWindowResize);

    return () => {
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("load", handleWindowResize);
      window.removeEventListener("resize", handleWindowResize);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return children;
}
