"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ScrollRevealProps } from "@/utils/landingShared";
import { LANDING_MOTION, SCROLL_REVEAL } from "@/utils/landingUtils";
import { getScrollRevealContainerStyle } from "./styles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });
}

const sectionIndexCache = new WeakMap<Element, Map<HTMLElement, number>>();

function getSequenceIndex(element: HTMLElement): number {
  const section = element.closest(LANDING_MOTION.sectionSelector);
  if (!section) return 0;

  let map = sectionIndexCache.get(section);
  if (!map) {
    map = new Map();
    section
      .querySelectorAll<HTMLElement>(LANDING_MOTION.scrollRevealSelector)
      .forEach((el, i) => map!.set(el, i));
    sectionIndexCache.set(section, map);
    (section as HTMLElement).dataset[LANDING_MOTION.sectionFadeInitializedKey] =
      "true";
  }
  return map.get(element) ?? 0;
}

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia(LANDING_MOTION.reducedMotionQuery).matches;

export default function ScrollReveal({
  children,
  delay = SCROLL_REVEAL.delay,
  once = false,
  sequence = true,
  className = "",
  style,
  ...props
}: ScrollRevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = container.current;
    if (!element) return;

    if (prefersReducedMotion()) {
      gsap.set(element, {
        opacity: LANDING_MOTION.visibleAlpha,
        visibility: LANDING_MOTION.visibilityInherit,
        clearProps: "transform",
      });
      return;
    }

    const sequenceDelay = sequence
      ? getSequenceIndex(element) * SCROLL_REVEAL.sequenceDelayStep
      : 0;

    const tween = gsap.fromTo(
      element,
      {
        autoAlpha: LANDING_MOTION.hiddenAlpha,
        y: SCROLL_REVEAL.yFrom,
      },
      {
        autoAlpha: LANDING_MOTION.visibleAlpha,
        y: LANDING_MOTION.defaultPositionTo,
        duration: SCROLL_REVEAL.duration,
        delay: delay + sequenceDelay,
        ease: LANDING_MOTION.easePower2Out,
        force3D: true,
        onStart: () => {
          element.style.willChange = "opacity, transform";
        },
        onComplete: () => {
          element.style.willChange = "auto";
        },
        scrollTrigger: {
          trigger: element,
          start: SCROLL_REVEAL.start,
          toggleActions: once
            ? SCROLL_REVEAL.onceToggleActions
            : SCROLL_REVEAL.toggleActions,
          once,
          fastScrollEnd: true,
        },
      },
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      element.style.willChange = "auto";
    };
  }, [delay, once, sequence]);

  return (
    <div
      ref={container}
      data-scroll-reveal
      className={className}
      style={getScrollRevealContainerStyle(style)}
      {...props}
    >
      {children}
    </div>
  );
}
