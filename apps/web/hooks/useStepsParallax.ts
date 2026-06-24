import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { LANDING_MOTION } from "@/utils/landingUtils";
import { breakpoints } from "@repo/ui/breakpoints";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useStepsParallax(
  sectionRef: RefObject<HTMLElement | null>,
  cardCount: number,
) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-step-parallax]");
      if (cards.length === 0) return;

      const media = gsap.matchMedia();

      media.add(LANDING_MOTION.reducedMotionQuery, () => {
        gsap.set(cards, { clearProps: "all" });
      });

      media.add(`(max-width: ${breakpoints.tablet})`, () => {
        gsap.set(cards, { clearProps: "all" });
      });

      const minWidthVal = parseInt(breakpoints.tablet) + 1;
      media.add(
        `(min-width: ${minWidthVal}px) and (prefers-reduced-motion: no-preference)`,
        () => {
          cards.forEach((card, index) => {
            const startY = 40 + index * 30;

            gsap.fromTo(
              card,
              {
                x: 0,
                y: startY,
                z: 0,
                scaleX: 1,
                scaleY: 1,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                skewX: 0,
                skewY: 0,
                force3D: true,
                willChange: "transform",
              },
              {
                x: 0,
                y: 0,
                z: 0,
                scaleX: 1,
                scaleY: 1,
                rotationX: 0,
                rotationY: 0,
                rotationZ: 0,
                skewX: 0,
                skewY: 0,
                transformStyle: "preserve-3d",
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.6,
                  invalidateOnRefresh: true,
                },
              },
            );
          });
        },
      );
    }, section);

    return () => ctx.revert();
  }, [sectionRef, cardCount]);
}
