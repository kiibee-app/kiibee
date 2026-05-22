"use client";

import { useRef, HTMLAttributes } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger);
}

export type ImageRevealVariant =
  | "fade-scale"
  | "slide-left"
  | "slide-right"
  | "slide-up"
  | "ken-burns"
  | "clip-reveal";

interface ImageRevealProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: ImageRevealVariant;
  delay?: number;
  duration?: number;
  /** ScrollTrigger start offset, e.g. "top 90%" */
  start?: string;
  /** Disable the built-in overflow: hidden (e.g. when parent already clips) */
  noClip?: boolean;
}

export default function ImageReveal({
  children,
  variant = "fade-scale",
  delay = 0,
  duration = 1.4,
  start = "top 88%",
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
          toggleActions: "play none none reverse",
          invalidateOnRefresh: true,
        };

        if (variant === "ken-burns") {
          // Subtle zoom-out while fading in — overflow must be clipped by parent
          gsap.fromTo(
            container.current,
            { autoAlpha: 0, scale: 1.06 },
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
            { autoAlpha: 0, scale: 0.96 },
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
      style={{
        visibility: variant === "clip-reveal" ? "visible" : "hidden",
        opacity: variant === "clip-reveal" ? 1 : 0,
        willChange: "opacity, transform, clip-path",
        // Always clip to prevent translate/scale from causing scrollbar
        overflow: noClip ? undefined : "hidden",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
