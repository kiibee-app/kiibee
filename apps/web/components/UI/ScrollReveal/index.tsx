"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
}

export default function ScrollReveal({
  children,
  delay = 0,
}: ScrollRevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(container.current, { clearProps: "all", opacity: 1 });
        return;
      }

      const parentSection = container.current.closest("section");
      if (
        parentSection &&
        !parentSection.hasAttribute("data-section-fade-initialized")
      ) {
        parentSection.setAttribute("data-section-fade-initialized", "true");

        gsap.fromTo(
          parentSection,
          {
            autoAlpha: 0,
            y: 24,
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: parentSection,
              start: "top 88%",
              once: true,
            },
          },
        );
      }

      gsap.fromTo(
        container.current,
        {
          autoAlpha: 0,
          y: 30,
          filter: "blur(10px)",
        },
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          delay: delay,
          ease: "expo.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 88%",
            once: true,
          },
        },
      );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      style={{ opacity: 0, willChange: "opacity, transform, filter" }}
    >
      {children}
    </div>
  );
}
