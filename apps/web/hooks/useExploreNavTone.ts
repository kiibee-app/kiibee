import { useEffect, useRef, useState } from "react";
import type {
  NavTextTone,
  UseExploreNavToneResult,
} from "@/types/exploreNavTone";

export function useExploreNavTone(
  headerTriggerY = 108,
): UseExploreNavToneResult {
  const heroRef = useRef<HTMLDivElement>(null);
  const trendingRef = useRef<HTMLDivElement>(null);
  const [navTextTone, setNavTextTone] = useState<NavTextTone>("light");

  useEffect(() => {
    const updateNavTone = () => {
      const heroBottom = heroRef.current?.getBoundingClientRect().bottom;
      const trendingTop = trendingRef.current?.getBoundingClientRect().top;

      const isOverHero =
        typeof heroBottom === "number" && heroBottom > headerTriggerY;
      const isOverTrending =
        typeof trendingTop === "number" && trendingTop <= headerTriggerY;

      if (isOverHero) {
        setNavTextTone("light");
        return;
      }

      if (isOverTrending) {
        setNavTextTone("dark");
        return;
      }

      setNavTextTone("dark");
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
