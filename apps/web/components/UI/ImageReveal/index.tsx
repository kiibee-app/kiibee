"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  type ImageRevealProps,
  type ImageRevealVariant,
} from "@/utils/landingShared";
import { IMAGE_REVEAL_DEFAULTS } from "@/utils/landingShared";
import { LANDING_MOTION } from "@/utils/landingUtils";
import { getImageRevealContainerStyle } from "./styles";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const element = container.current;
      if (!element) return;

      const media = gsap.matchMedia();

      const scrollTrigger: ScrollTrigger.Vars = {
        trigger: element,
        start,
        toggleActions: IMAGE_REVEAL_DEFAULTS.toggleActions,
        invalidateOnRefresh: true,
      };

      const animate = (fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => {
        gsap.fromTo(element, fromVars, {
          duration,
          delay,
          scrollTrigger,
          ...toVars,
        });
      };

      media.add(LANDING_MOTION.reducedMotionQuery, () => {
        gsap.set(element, { clearProps: LANDING_MOTION.clearPropsAll });
      });

      media.add(LANDING_MOTION.noReducedMotionQuery, () => {
        switch (variant) {
          case LANDING_MOTION.variantKenBurns:
            animate(
              {
                autoAlpha: LANDING_MOTION.hiddenAlpha,
                scale: IMAGE_REVEAL_DEFAULTS.kenBurnsScaleFrom,
              },
              {
                autoAlpha: LANDING_MOTION.visibleAlpha,
                scale: LANDING_MOTION.defaultScaleTo,
                ease: LANDING_MOTION.easePower2Out,
              },
            );
            break;

          case LANDING_MOTION.variantClipReveal:
            animate(
              {
                clipPath: LANDING_MOTION.clipPathHidden,
                autoAlpha: LANDING_MOTION.visibleAlpha,
              },
              {
                clipPath: LANDING_MOTION.clipPathVisible,
                autoAlpha: LANDING_MOTION.visibleAlpha,
                ease: LANDING_MOTION.easePower3InOut,
              },
            );
            break;

          case LANDING_MOTION.variantSlideLeft:
            animate(
              {
                autoAlpha: LANDING_MOTION.hiddenAlpha,
                xPercent: LANDING_MOTION.slideLeftFrom,
              },
              {
                autoAlpha: LANDING_MOTION.visibleAlpha,
                xPercent: LANDING_MOTION.defaultPositionTo,
                ease: LANDING_MOTION.easePower3Out,
              },
            );
            break;

          case LANDING_MOTION.variantSlideRight:
            animate(
              {
                autoAlpha: LANDING_MOTION.hiddenAlpha,
                xPercent: LANDING_MOTION.slideRightFrom,
              },
              {
                autoAlpha: LANDING_MOTION.visibleAlpha,
                xPercent: LANDING_MOTION.defaultPositionTo,
                ease: LANDING_MOTION.easePower3Out,
              },
            );
            break;

          case LANDING_MOTION.variantSlideUp:
            animate(
              {
                autoAlpha: LANDING_MOTION.hiddenAlpha,
                yPercent: LANDING_MOTION.slideUpFrom,
                scale: LANDING_MOTION.slideUpScaleFrom,
              },
              {
                autoAlpha: LANDING_MOTION.visibleAlpha,
                yPercent: LANDING_MOTION.defaultPositionTo,
                scale: LANDING_MOTION.defaultScaleTo,
                ease: LANDING_MOTION.easePower3Out,
              },
            );
            break;

          default:
            animate(
              {
                autoAlpha: LANDING_MOTION.hiddenAlpha,
                scale: IMAGE_REVEAL_DEFAULTS.scaleDefaultFrom,
              },
              {
                autoAlpha: LANDING_MOTION.visibleAlpha,
                scale: LANDING_MOTION.defaultScaleTo,
                ease: LANDING_MOTION.easePower2Out,
              },
            );
        }
      });
    }, container);

    return () => ctx.revert();
  }, [container, start, duration, delay, variant]);

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
