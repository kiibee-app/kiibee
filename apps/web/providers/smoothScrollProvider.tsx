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
    let refreshRafId: number | null = null;
    lenis.on("scroll", ScrollTrigger.update);
    const handleScrollTriggerRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", handleScrollTriggerRefresh);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    const scheduleRefresh = () => {
      if (refreshRafId !== null) return;
      refreshRafId = requestAnimationFrame(() => {
        refreshRafId = null;
        ScrollTrigger.refresh();
      });
    };

    const scheduleResize = () => {
      if (resizeRafId !== null) return;

      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        lenis.resize();
        scheduleRefresh();
      });
    };

    scheduleResize();
    const initialRefreshRaf = requestAnimationFrame(scheduleRefresh);

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
    const handleWindowLoad = () => {
      scheduleRefresh();
    };
    const handlePageShow = () => {
      scheduleRefresh();
    };
    const handleOrientationChange = () => {
      scheduleResize();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("load", handleWindowLoad);
    window.addEventListener("pageshow", handlePageShow);
    window.addEventListener("orientationchange", handleOrientationChange);
    window.addEventListener("load", handleWindowResize);
    window.addEventListener("resize", handleWindowResize);
    document.fonts?.ready.then(() => {
      scheduleRefresh();
    });

    return () => {
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }
      if (refreshRafId !== null) {
        cancelAnimationFrame(refreshRafId);
      }
      cancelAnimationFrame(initialRefreshRaf);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("load", handleWindowLoad);
      window.removeEventListener("pageshow", handlePageShow);
      window.removeEventListener("orientationchange", handleOrientationChange);
      window.removeEventListener("load", handleWindowResize);
      window.removeEventListener("resize", handleWindowResize);
      ScrollTrigger.removeEventListener("refresh", handleScrollTriggerRefresh);
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, []);

  return children;
}
