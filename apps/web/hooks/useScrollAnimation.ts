import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  SCROLL_ANIMATION_CONFIG,
  SCROLL_ANIMATION_SELECTORS,
} from "@/utils/Constants";

export type ScrollAnimationOptions = {
  sidebarSelector?: string;
  innerSelector?: string;
  cardsSelector?: string;
  startOffset?: string;
  unpinOffset?: number;
  minWidth?: string;
  trigger?: unknown;
};

export function useScrollAnimation({
  cardsSelector = SCROLL_ANIMATION_SELECTORS.DEFAULT_CARDS,
  trigger,
}: ScrollAnimationOptions = {}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | undefined;
    let checkInterval: ReturnType<typeof setInterval> | undefined;
    let refreshTimeout: ReturnType<typeof setTimeout> | undefined;

    const initGSAP = (): boolean => {
      let foundCards = false;

      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(cardsSelector);
        if (cards.length === 0) return;

        foundCards = true;

        cards.forEach((card) => {
          gsap.fromTo(
            card,
            {
              opacity: SCROLL_ANIMATION_CONFIG.ANIMATION_OPACITY_START,
              y: SCROLL_ANIMATION_CONFIG.ANIMATION_Y_OFFSET,
            },
            {
              opacity: SCROLL_ANIMATION_CONFIG.ANIMATION_OPACITY_END,
              y: SCROLL_ANIMATION_CONFIG.ANIMATION_Y_END,
              duration: SCROLL_ANIMATION_CONFIG.ANIMATION_DURATION,
              ease: SCROLL_ANIMATION_CONFIG.ANIMATION_EASE,
              scrollTrigger: {
                trigger: card,
                start: SCROLL_ANIMATION_CONFIG.TRIGGER_START,
                toggleActions: SCROLL_ANIMATION_CONFIG.TOGGLE_ACTIONS,
                invalidateOnRefresh: false,
              },
            },
          );
        });
      });

      if (!foundCards) {
        ctx.revert();
        ctx = undefined;
        return false;
      }

      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, SCROLL_ANIMATION_CONFIG.REFRESH_DELAY_MS);

      return true;
    };

    if (!initGSAP()) {
      let attempts = 0;
      checkInterval = setInterval(() => {
        attempts++;
        if (
          initGSAP() ||
          attempts >= SCROLL_ANIMATION_CONFIG.MAX_INIT_ATTEMPTS
        ) {
          clearInterval(checkInterval);
          checkInterval = undefined;
        }
      }, SCROLL_ANIMATION_CONFIG.INIT_RETRY_INTERVAL_MS);
    }

    return () => {
      clearInterval(checkInterval);
      clearTimeout(refreshTimeout);
      ctx?.revert();
    };
  }, [cardsSelector, trigger]);
}
