"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type SmoothScrollProviderProps } from "@/utils/landingShared";
import { SMOOTH_SCROLL, SMOOTH_SCROLL_EVENTS } from "@/utils/landingUtils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
      syncTouch: false,
      lerp: SMOOTH_SCROLL.lerp,
      wheelMultiplier: SMOOTH_SCROLL.wheelMultiplier,
      touchMultiplier: SMOOTH_SCROLL.touchMultiplier,
      easing: (t: number) => 1 - Math.pow(1 - t, SMOOTH_SCROLL.easingPower),
      overscroll: false,
    });

    let resizeRafId: number | null = null;
    let refreshRafId: number | null = null;
    let destroyed = false;
    let bodyResizeObserver: ResizeObserver | null = null;
    const removeLenisScrollHandler = lenis.on("scroll", ScrollTrigger.update);
    const handleScrollTriggerRefresh = () => {
      lenis.resize();
    };
    ScrollTrigger.addEventListener("refresh", handleScrollTriggerRefresh);

    const updateLenis = (time: number) => {
      lenis.raf(time * SMOOTH_SCROLL.gsapTimeMultiplier);
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
    scheduleRefresh();

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
      scheduleResize();
    };
    const handlePageShow = () => {
      scheduleResize();
    };
    const handleOrientationChange = () => {
      scheduleResize();
    };

    if (typeof ResizeObserver !== "undefined") {
      bodyResizeObserver = new ResizeObserver(scheduleResize);
      bodyResizeObserver.observe(document.body);
    }

    document.addEventListener(
      SMOOTH_SCROLL_EVENTS.visibilitychange,
      handleVisibilityChange,
    );
    window.addEventListener(SMOOTH_SCROLL_EVENTS.load, handleWindowLoad);
    window.addEventListener(SMOOTH_SCROLL_EVENTS.pageshow, handlePageShow);
    window.addEventListener(
      SMOOTH_SCROLL_EVENTS.orientationchange,
      handleOrientationChange,
    );
    window.addEventListener(SMOOTH_SCROLL_EVENTS.resize, handleWindowResize);
    document.fonts?.ready.then(() => {
      if (!destroyed) {
        scheduleResize();
      }
    });

    return () => {
      destroyed = true;
      if (resizeRafId !== null) {
        cancelAnimationFrame(resizeRafId);
      }
      if (refreshRafId !== null) {
        cancelAnimationFrame(refreshRafId);
      }
      bodyResizeObserver?.disconnect();
      document.removeEventListener(
        SMOOTH_SCROLL_EVENTS.visibilitychange,
        handleVisibilityChange,
      );
      window.removeEventListener(SMOOTH_SCROLL_EVENTS.load, handleWindowLoad);
      window.removeEventListener(SMOOTH_SCROLL_EVENTS.pageshow, handlePageShow);
      window.removeEventListener(
        SMOOTH_SCROLL_EVENTS.orientationchange,
        handleOrientationChange,
      );
      window.removeEventListener(
        SMOOTH_SCROLL_EVENTS.resize,
        handleWindowResize,
      );
      ScrollTrigger.removeEventListener("refresh", handleScrollTriggerRefresh);
      removeLenisScrollHandler();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [pathname]);

  return children;
}
