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

      gsap.fromTo(
        container.current,
        {
          opacity: 0,
          y: 40,
          filter: "blur(12px)", // Re-added the beautiful blur!
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2, // Slightly longer duration for a more premium feel
          delay: delay,
          ease: "expo.out", // Expo out gives that very fast start and silky smooth finish
          scrollTrigger: {
            trigger: container.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: container },
  );

  return (
    <div
      ref={container}
      // Set initial opacity to 0 here to prevent any ugly flashing before GSAP takes over
      style={{ opacity: 0, willChange: "opacity, transform, filter" }}
    >
      {children}
    </div>
  );
}
