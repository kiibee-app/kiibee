import { useEffect, useRef, useState } from "react";
import type {
  NavTextTone,
  UseExploreNavToneResult,
} from "@/types/exploreNavTone";
import { NAV_TONE as NAV_TEXT_TONE } from "@/types/exploreNavTone";

export function useExploreNavTone(
  headerTriggerY = 108,
): UseExploreNavToneResult {
  const heroRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const [navTextTone, setNavTextTone] = useState<NavTextTone>(
    NAV_TEXT_TONE.LIGHT,
  );

  useEffect(() => {
    const updateNavTone = () => {
      const heroBottom =
        heroRef.current?.getBoundingClientRect().bottom ?? Number.NEGATIVE_INFINITY;
      const trendingTop =
        trendingRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;

      const isOverHero = heroBottom > headerTriggerY;
      const isOverTrending = trendingTop <= headerTriggerY;

      if (isOverHero) {
        setNavTextTone(NAV_TEXT_TONE.LIGHT);
        return;
      }

      if (isOverTrending) {
        setNavTextTone(NAV_TEXT_TONE.DARK);
        return;
      }

      setNavTextTone(NAV_TEXT_TONE.DARK);
    };

    updateNavTone();
    window.addEventListener("scroll", updateNavTone, { passive: true });
    window.addEventListener("resize", updateNavTone);

    return () => {
      window.removeEventListener("scroll", updateNavTone);
      window.removeEventListener("resize", updateNavTone);
    };
  }, [headerTriggerY]);

  return {
    heroRef,
    trendingRef,
    navTextTone,
  };
}
