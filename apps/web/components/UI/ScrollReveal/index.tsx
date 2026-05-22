"use client";

import { useRef, HTMLAttributes } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface ScrollRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  delay?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
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
          sequenceDelay = revealIndex * 0.12;

          if (!parentSection.dataset.sectionFadeInitialized) {
            parentSection.dataset.sectionFadeInitialized = "true";
          }
        }

        gsap.fromTo(
          container.current,
          {
            autoAlpha: 0,
            y: 30,
            filter: "blur(12px)",
          },
          {
            autoAlpha: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1.2,
            delay: delay + sequenceDelay,
            ease: "power2.out",
            scrollTrigger: {
              trigger: container.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
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
      style={{
        visibility: "hidden",
        opacity: 0,
        willChange: "opacity, transform, filter",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
