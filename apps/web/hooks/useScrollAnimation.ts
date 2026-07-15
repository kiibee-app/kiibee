import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export type ScrollAnimationOptions = {
  sidebarSelector?: string;
  innerSelector?: string;
  cardsSelector?: string;
  startOffset?: string;
  unpinOffset?: number;
  minWidth?: string;
  trigger?: unknown;
};

const MAX_INIT_ATTEMPTS = 60;
const INIT_RETRY_INTERVAL_MS = 50;
const REFRESH_DELAY_MS = 600;

export function useScrollAnimation({
  cardsSelector = "article, [class*='Card']",
  trigger,
}: ScrollAnimationOptions = {}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | undefined;
    let checkInterval: ReturnType<typeof setInterval> | undefined;
    let refreshTimeout: ReturnType<typeof setTimeout> | undefined;
    let refreshOnScroll: () => void = () => {};

    const initGSAP = (): boolean => {
      let foundCards = false;

      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(cardsSelector);
        if (cards.length === 0) return;

        foundCards = true;

        cards.forEach((card) => {
          gsap.fromTo(
            card,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 90%",
                toggleActions: "play none none reverse",
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
      }, REFRESH_DELAY_MS);

      refreshOnScroll = () => {
        ScrollTrigger.refresh();
        window.removeEventListener("scroll", refreshOnScroll);
      };
      window.addEventListener("scroll", refreshOnScroll, { passive: true });

      return true;
    };

    if (!initGSAP()) {
      let attempts = 0;
      checkInterval = setInterval(() => {
        attempts++;
        if (initGSAP() || attempts >= MAX_INIT_ATTEMPTS) {
          clearInterval(checkInterval);
          checkInterval = undefined;
        }
      }, INIT_RETRY_INTERVAL_MS);
    }

    return () => {
      clearInterval(checkInterval);
      clearTimeout(refreshTimeout);
      ctx?.revert();
      window.removeEventListener("scroll", refreshOnScroll);
    };
  }, [cardsSelector, trigger]);
}
