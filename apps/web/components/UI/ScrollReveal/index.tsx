"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ScrollRevealProps } from "@/types/scrollReveal";
import { SCROLL_REVEAL } from "@/utils/scrollReveal";
import { getScrollRevealContainerStyle } from "./styles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function ScrollReveal({
  children,
  delay = SCROLL_REVEAL.delay,
  className = "",
  style,
  ...props
}: ScrollRevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(container.current, {
          clearProps: "all",
          opacity: 1,
          visibility: "inherit",
        });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!container.current) return;

        const parentSection = container.current.closest("section");
        let sequenceDelay = 0;

        if (parentSection) {
          const siblings = Array.from(
            parentSection.querySelectorAll<HTMLElement>("[data-scroll-reveal]"),
          );
          const revealIndex = Math.max(0, siblings.indexOf(container.current));
          sequenceDelay = revealIndex * SCROLL_REVEAL.sequenceDelayStep;

          if (!parentSection.dataset.sectionFadeInitialized) {
            parentSection.dataset.sectionFadeInitialized = "true";
          }
        }

        gsap.fromTo(
          container.current,
          {
            autoAlpha: 0,
            y: SCROLL_REVEAL.yFrom,
            filter: SCROLL_REVEAL.blurFrom,
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: SCROLL_REVEAL.blurTo,
            duration: SCROLL_REVEAL.duration,
            delay: delay + sequenceDelay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container.current,
              start: SCROLL_REVEAL.start,
              toggleActions: SCROLL_REVEAL.toggleActions,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    },
    { scope: container, dependencies: [delay] },
  );

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
