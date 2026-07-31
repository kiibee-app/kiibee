import { useEffect, RefObject, MutableRefObject } from "react";
import gsap from "gsap";
import { HERO_MOTION } from "@/utils/creatorAnimations";
import { LANDING_MOTION } from "@/utils/landingUtils";

export const getLiveCards = (cards: Array<HTMLDivElement | null>) =>
  cards.filter((card): card is HTMLDivElement => Boolean(card));

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia(LANDING_MOTION.reducedMotionQuery).matches;

interface UseCreatorsGsapProps {
  sectionRef: RefObject<HTMLElement | null>;
  cardRefs: MutableRefObject<Array<HTMLDivElement | null>>;
}

export function useCreatorsGsap({
  sectionRef,
  cardRefs,
}: UseCreatorsGsapProps) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const heading = section.querySelectorAll<HTMLElement>(
        "[data-creator-hero-line]",
      );
      const heroItems = Array.from(
        section.querySelectorAll<HTMLElement>("[data-creator-hero-animate]"),
      );
      const cardElements = getLiveCards(cardRefs.current);
      const revealTargets = [...heading, ...heroItems, ...cardElements];

      if (prefersReducedMotion()) {
        gsap.set(revealTargets, {
          autoAlpha: LANDING_MOTION.visibleAlpha,
          clearProps: "transform,filter",
        });
        return;
      }

      gsap.set(cardElements, {
        transformOrigin: "50% 100%",
      });

      gsap
        .timeline({
          defaults: {
            ease: LANDING_MOTION.easePower3Out,
          },
        })
        .fromTo(
          heading,
          {
            autoAlpha: LANDING_MOTION.hiddenAlpha,
            filter: HERO_MOTION.blurFrom,
            yPercent: 40,
          },
          {
            autoAlpha: LANDING_MOTION.visibleAlpha,
            clearProps: "filter,transform",
            duration: HERO_MOTION.textDuration,
            filter: HERO_MOTION.blurTo,
            stagger: HERO_MOTION.textStagger,
            yPercent: LANDING_MOTION.defaultPositionTo,
          },
        )
        .fromTo(
          "[data-creator-hero-cta]",
          {
            autoAlpha: LANDING_MOTION.hiddenAlpha,
            scale: 0.95,
            y: 18,
          },
          {
            autoAlpha: LANDING_MOTION.visibleAlpha,
            clearProps: "transform",
            duration: HERO_MOTION.ctaDuration,
            ease: HERO_MOTION.easeBackOut,
            scale: LANDING_MOTION.defaultScaleTo,
            y: LANDING_MOTION.defaultPositionTo,
          },
          "-=0.36",
        )
        .fromTo(
          cardElements,
          {
            autoAlpha: LANDING_MOTION.hiddenAlpha,
            filter: HERO_MOTION.blurFrom,
            scale: 0.96,
            y: 40,
          },
          {
            autoAlpha: LANDING_MOTION.visibleAlpha,
            clearProps: "filter,transform",
            duration: HERO_MOTION.cardEntranceDuration,
            filter: HERO_MOTION.blurTo,
            scale: LANDING_MOTION.defaultScaleTo,
            stagger: HERO_MOTION.cardEntranceStagger,
            y: LANDING_MOTION.defaultPositionTo,
          },
          "-=0.48",
        );
    }, section);

    return () => ctx.revert();
  }, [sectionRef, cardRefs]);
}
