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
};

export function useScrollAnimation({
  cardsSelector = "article, [class*='Card']",
}: ScrollAnimationOptions = {}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context;
    let checkInterval: NodeJS.Timeout;
    let refreshTimeout: NodeJS.Timeout;

    const initGSAP = () => {
      ctx = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>(cardsSelector);
        if (cards.length === 0) return;
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
      refreshTimeout = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 600);
      const refreshOnScroll = () => {
        ScrollTrigger.refresh();
        window.removeEventListener("scroll", refreshOnScroll);
      };
      window.addEventListener("scroll", refreshOnScroll, { passive: true });

      return true;
    };

    const success = initGSAP();
    if (!success) {
      let attempts = 0;
      checkInterval = setInterval(() => {
        attempts++;
        if (initGSAP() || attempts > 60) {
          clearInterval(checkInterval);
        }
      }, 50);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (refreshTimeout) clearTimeout(refreshTimeout);
      if (ctx) ctx.revert();
    };
  }, [cardsSelector]);
}
