"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type ImageRevealProps,
  type ImageRevealVariant,
} from "@/types/imageReveal";
import { IMAGE_REVEAL_DEFAULTS } from "@/utils/imageReveal";
import { getImageRevealContainerStyle } from "./styles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export default function ImageReveal({
  children,
  variant = IMAGE_REVEAL_DEFAULTS.variant as ImageRevealVariant,
  delay = IMAGE_REVEAL_DEFAULTS.delay,
  duration = IMAGE_REVEAL_DEFAULTS.duration,
  start = IMAGE_REVEAL_DEFAULTS.start,
  className = "",
  style,
  noClip = false,
  ...props
}: ImageRevealProps) {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!container.current) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(container.current, { clearProps: "all" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        if (!container.current) return;

        const trigger: ScrollTrigger.Vars = {
          trigger: container.current,
          start,
          toggleActions: IMAGE_REVEAL_DEFAULTS.toggleActions,
          invalidateOnRefresh: true,
        };

        if (variant === "ken-burns") {
          // Subtle zoom-out while fading in — overflow must be clipped by parent
          gsap.fromTo(
            container.current,
            { autoAlpha: 0, scale: IMAGE_REVEAL_DEFAULTS.kenBurnsScaleFrom },
            {
              autoAlpha: 1,
              scale: 1,
              duration,
              delay,
              ease: "power2.out",
              scrollTrigger: trigger,
            },
          );
        } else if (variant === "clip-reveal") {
          // Curtain wipe: clips from top revealing downward — premium hero effect
          gsap.fromTo(
            container.current,
            { clipPath: "inset(0 0 100% 0)", autoAlpha: 1 },
            {
              clipPath: "inset(0 0 0% 0)",
              autoAlpha: 1,
              duration,
              delay,
              ease: "power3.inOut",
              scrollTrigger: trigger,
            },
          );
        } else if (variant === "slide-left") {
          // Translate inside container — overflow: hidden on wrapper clips it
          gsap.fromTo(
            container.current,
            { autoAlpha: 0, xPercent: -8 },
            {
              autoAlpha: 1,
              xPercent: 0,
              duration,
              delay,
              ease: "power3.out",
              scrollTrigger: trigger,
            },
          );
        } else if (variant === "slide-right") {
          gsap.fromTo(
            container.current,
            { autoAlpha: 0, xPercent: 8 },
            {
              autoAlpha: 1,
              xPercent: 0,
              duration,
              delay,
              ease: "power3.out",
              scrollTrigger: trigger,
            },
          );
        } else if (variant === "slide-up") {
          gsap.fromTo(
            container.current,
            { autoAlpha: 0, yPercent: 6, scale: 0.97 },
            {
              autoAlpha: 1,
              yPercent: 0,
              scale: 1,
              duration,
              delay,
              ease: "power3.out",
              scrollTrigger: trigger,
            },
          );
        } else {
          // fade-scale (default)
          gsap.fromTo(
            container.current,
            { autoAlpha: 0, scale: IMAGE_REVEAL_DEFAULTS.scaleDefaultFrom },
            {
              autoAlpha: 1,
              scale: 1,
              duration,
              delay,
              ease: "power2.out",
              scrollTrigger: trigger,
            },
          );
        }
      });
    },
    { scope: container, dependencies: [variant, delay, duration, start] },
  );

  return (
    <div
      ref={container}
      className={className}
      style={getImageRevealContainerStyle(noClip, variant, style)}
      {...props}
    >
      {children}
    </div>
  );
}
