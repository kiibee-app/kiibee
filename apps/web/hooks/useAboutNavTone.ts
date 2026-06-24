import { useEffect, useRef, useState } from "react";
import type { NavTextTone } from "@/types/exploreNavTone";
import { NAV_TONE as NAV_TEXT_TONE } from "@/types/exploreNavTone";

export type UseAboutNavToneResult = {
  darkSectionRef: React.RefObject<HTMLDivElement | null>;
  navTextTone: NavTextTone;
};

export function useAboutNavTone(headerTriggerY = 108): UseAboutNavToneResult {
  const darkSectionRef = useRef<HTMLDivElement>(null);
  const [navTextTone, setNavTextTone] = useState<NavTextTone>(
    NAV_TEXT_TONE.DARK,
  );

  useEffect(() => {
    const updateNavTone = () => {
      const darkSectionTop =
        darkSectionRef.current?.getBoundingClientRect().top ??
        Number.POSITIVE_INFINITY;

      setNavTextTone(
        darkSectionTop <= headerTriggerY
          ? NAV_TEXT_TONE.LIGHT
          : NAV_TEXT_TONE.DARK,
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

  return { darkSectionRef, navTextTone };
}
