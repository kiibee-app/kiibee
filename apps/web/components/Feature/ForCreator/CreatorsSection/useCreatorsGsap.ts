import { useEffect, RefObject, MutableRefObject } from "react";
import gsap from "gsap";
import {
  getCardDimensions,
  getCardAnimation,
  HERO_MOTION,
} from "@/utils/creatorAnimations";
import { LANDING_MOTION } from "@/utils/landingUtils";

export const getLiveCards = (cards: Array<HTMLDivElement | null>) =>
  cards.filter((card): card is HTMLDivElement => Boolean(card));

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia(LANDING_MOTION.reducedMotionQuery).matches;

interface UseCreatorsGsapProps {
  sectionRef: RefObject<HTMLElement | null>;
  cardRefs: MutableRefObject<Array<HTMLDivElement | null>>;
  activeCardIndex: number;
  isMobile: boolean;
}

export function useCreatorsGsap({
  sectionRef,
  cardRefs,
  activeCardIndex,
  isMobile,
}: UseCreatorsGsapProps) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const headingLines = Array.from(
        section.querySelectorAll<HTMLElement>("[data-creator-hero-line]"),
      );
      const heroItems = Array.from(
        section.querySelectorAll<HTMLElement>("[data-creator-hero-animate]"),
      );
      const cardElements = getLiveCards(cardRefs.current);
      const revealTargets = [...headingLines, ...heroItems, ...cardElements];

      if (prefersReducedMotion()) {
        gsap.set(revealTargets, {
          autoAlpha: LANDING_MOTION.visibleAlpha,
          clearProps: "transform,filter",
        });
        return;
      }

      gsap.set(cardElements, {
        transformOrigin: "50% 100%",
        willChange: "opacity, transform, filter, width, padding",
      });

      gsap
        .timeline({
          defaults: {
            ease: LANDING_MOTION.easePower3Out,
          },
        })
        .fromTo(
          headingLines,
          {
            autoAlpha: LANDING_MOTION.hiddenAlpha,
            filter: HERO_MOTION.blurFrom,
            yPercent: 58,
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
            y: 58,
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

  useEffect(() => {
    const shouldReduceMotion = prefersReducedMotion();
    const cardDimensions = getCardDimensions(isMobile);

    getLiveCards(cardRefs.current).forEach((card, index) => {
      const cardAnimation = getCardAnimation(
        activeCardIndex === index,
        cardDimensions,
      );
      const target = {
        paddingBottom: cardAnimation.paddingBottom,
        paddingLeft: cardAnimation.paddingLeft,
        paddingRight: cardAnimation.paddingRight,
        paddingTop: cardAnimation.paddingTop,
        width: cardAnimation.width,
      };

      if (shouldReduceMotion) {
        gsap.set(card, target);
        return;
      }

      gsap.to(card, {
        ...target,
        duration: HERO_MOTION.cardResizeDuration,
        ease: HERO_MOTION.easeExpoOut,
        overwrite: "auto",
      });
    });
  }, [activeCardIndex, isMobile, cardRefs]);

  const animateCardLift = (hoveredIndex: number | null) => {
    if (isMobile || prefersReducedMotion()) return;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      gsap.to(card, {
        duration: HERO_MOTION.hoverDuration,
        ease: LANDING_MOTION.easePower3Out,
        overwrite: "auto",
        y: hoveredIndex === index ? HERO_MOTION.hoverLift : 0,
      });
    });
  };

  return { animateCardLift };
}
