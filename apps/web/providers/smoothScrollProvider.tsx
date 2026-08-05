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

/** Same allow-list as before: Lenis only outside app/grid routes. */
function shouldUseSmoothScroll(pathname: string) {
  return !(
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/creator/") ||
    pathname.startsWith("/creators") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/explore") ||
    pathname.startsWith("/formats") ||
    pathname.startsWith("/content/") ||
    pathname.startsWith("/subscription") ||
    pathname.startsWith("/payment")
  );
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldUseSmoothScroll(pathname)) return;

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
    let destroyed = false;
    const fontAbortController = new AbortController();

    const removeLenisScrollHandler = lenis.on("scroll", ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * SMOOTH_SCROLL.gsapTimeMultiplier);
    };
    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    let refreshCall: gsap.core.Tween | null = null;
    const scheduleRefresh = () => {
      if (refreshCall) refreshCall.kill();
      refreshCall = gsap.delayedCall(SMOOTH_SCROLL.refreshDelay, () => {
        if (!destroyed) {
          ScrollTrigger.refresh();
        }
      });
    };

    const scheduleResize = () => {
      if (resizeRafId !== null) return;

      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        if (destroyed) return;
        lenis.resize();
        scheduleRefresh();
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

    document.addEventListener(
      SMOOTH_SCROLL_EVENTS.visibilitychange,
      handleVisibilityChange,
    );
    window.addEventListener(SMOOTH_SCROLL_EVENTS.load, scheduleResize);
    window.addEventListener(SMOOTH_SCROLL_EVENTS.pageshow, scheduleResize);
    window.addEventListener(
      SMOOTH_SCROLL_EVENTS.orientationchange,
      scheduleResize,
    );
    window.addEventListener(SMOOTH_SCROLL_EVENTS.resize, scheduleResize);
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
      if (refreshCall) {
        refreshCall.kill();
      }
      document.removeEventListener(
        SMOOTH_SCROLL_EVENTS.visibilitychange,
        handleVisibilityChange,
      );
      window.removeEventListener(SMOOTH_SCROLL_EVENTS.load, scheduleResize);
      window.removeEventListener(SMOOTH_SCROLL_EVENTS.pageshow, scheduleResize);
      window.removeEventListener(
        SMOOTH_SCROLL_EVENTS.orientationchange,
        scheduleResize,
      );
      window.removeEventListener(SMOOTH_SCROLL_EVENTS.resize, scheduleResize);
      removeLenisScrollHandler();
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
    };
  }, [pathname]);

  return children;
}
