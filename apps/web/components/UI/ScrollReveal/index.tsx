"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ScrollRevealProps } from "@/utils/landingShared";
import { LANDING_MOTION, SCROLL_REVEAL } from "@/utils/landingUtils";
import { getScrollRevealContainerStyle } from "./styles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ScrollReveal({
  children,
  delay = SCROLL_REVEAL.delay,
  once = false,
  sequence = true,
  withBlur = true,
  className = "",
  style,
  ...props
}: ScrollRevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const element = container.current;
      if (!element) return;

      const media = gsap.matchMedia();

      const getSequenceDelay = () => {
        const parentSection = element.closest(LANDING_MOTION.sectionSelector);
        if (!parentSection) return 0;

        const revealElements = Array.from(
          parentSection.querySelectorAll<HTMLElement>(
            LANDING_MOTION.scrollRevealSelector,
          ),
        );

        const revealIndex = Math.max(0, revealElements.indexOf(element));

        parentSection.dataset[LANDING_MOTION.sectionFadeInitializedKey] =
          "true";

        return revealIndex * SCROLL_REVEAL.sequenceDelayStep;
      };

      media.add(LANDING_MOTION.reducedMotionQuery, () => {
        gsap.set(element, {
          clearProps: LANDING_MOTION.clearPropsAll,
          opacity: LANDING_MOTION.visibleAlpha,
          visibility: LANDING_MOTION.visibilityInherit,
        });
      });

      media.add(LANDING_MOTION.noReducedMotionQuery, () => {
        const sequenceDelay = sequence ? getSequenceDelay() : 0;
        const fromVars = {
          autoAlpha: LANDING_MOTION.hiddenAlpha,
          y: SCROLL_REVEAL.yFrom,
          ...(withBlur ? { filter: SCROLL_REVEAL.blurFrom } : {}),
        };
        const toVars = {
          autoAlpha: LANDING_MOTION.visibleAlpha,
          y: LANDING_MOTION.defaultPositionTo,
          ...(withBlur ? { filter: SCROLL_REVEAL.blurTo } : {}),
          duration: SCROLL_REVEAL.duration,
          delay: delay + sequenceDelay,
          ease: LANDING_MOTION.easePower2Out,
          scrollTrigger: {
            trigger: element,
            start: SCROLL_REVEAL.start,
            toggleActions: once
              ? SCROLL_REVEAL.onceToggleActions
              : SCROLL_REVEAL.toggleActions,
            once,
            invalidateOnRefresh: true,
          },
        };

        gsap.fromTo(element, fromVars, toVars);
      });
    }, container);

    return () => ctx.revert();
  }, [delay, once, sequence, withBlur]);

  return (
    <div
      ref={container}
      data-scroll-reveal
      className={className}
      style={getScrollRevealContainerStyle(style, withBlur)}
      {...props}
    >
      {children}
    </div>
  );
}
