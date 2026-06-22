import { useEffect, useRef, useState } from "react";
import type { NavTextTone } from "@/types/exploreNavTone";
import { NAV_TONE as NAV_TEXT_TONE } from "@/types/exploreNavTone";

type UsePricingNavToneResult = {
  heroRef: React.RefObject<HTMLElement | null>;
  navTextTone: NavTextTone;
};

export function usePricingNavTone(
  headerTriggerY = 108,
): UsePricingNavToneResult {
  const heroRef = useRef<HTMLElement>(null);
  const [navTextTone, setNavTextTone] = useState<NavTextTone>(
    NAV_TEXT_TONE.LIGHT,
  );

  useEffect(() => {
    const updateNavTone = () => {
      const heroBottom =
        heroRef.current?.getBoundingClientRect().bottom ??
        Number.NEGATIVE_INFINITY;

      setNavTextTone(
        heroBottom > headerTriggerY ? NAV_TEXT_TONE.LIGHT : NAV_TEXT_TONE.DARK,
      );
    };

    updateNavTone();
    window.addEventListener("scroll", updateNavTone, { passive: true });
    window.addEventListener("resize", updateNavTone);

    return () => {
      window.removeEventListener("scroll", updateNavTone);
      window.removeEventListener("resize", updateNavTone);
    };
  }, [headerTriggerY]);

  return { heroRef, navTextTone };
}
