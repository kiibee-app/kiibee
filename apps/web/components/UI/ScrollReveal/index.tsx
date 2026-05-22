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

      const revealElementsInSection = Array.from(
        container.current
          .closest("section")
          ?.querySelectorAll<HTMLElement>("[data-scroll-reveal]") ?? [],
      );
      const revealIndex = Math.max(
        0,
        revealElementsInSection.indexOf(container.current),
      );
      const sequenceDelay = revealIndex * 0.12;

      const parentSection = container.current.closest("section");
      if (
        parentSection &&
        !parentSection.hasAttribute("data-section-fade-initialized")
      ) {
        parentSection.setAttribute("data-section-fade-initialized", "true");
        // We only mark it as initialized, but do NOT animate the section itself.
        // Animating the section causes the white gap issue because the next section's
        // background is invisible until triggered.
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
          duration: 1.2,
          delay: delay + sequenceDelay,
          ease: "power2.out",
          scrollTrigger: {
            trigger: container.current,
            start: "top 86%",
            toggleActions: "play none none reverse",
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      data-scroll-reveal
      style={{ opacity: 0, willChange: "opacity, transform, filter" }}
    >
      {children}
    </div>
  );
}
