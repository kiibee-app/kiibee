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
  sidebarSelector = "[data-sidebar]",
  innerSelector = "[data-sidebar] > div",
  cardsSelector = "article, [class*='Card']",
  startOffset = "top 120px",
  unpinOffset = 120,
  minWidth = "(min-width: 768px)",
}: ScrollAnimationOptions = {}) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context;
    let checkInterval: NodeJS.Timeout;
    let refreshTimeout: NodeJS.Timeout;

    const initGSAP = () => {
      const filterSidebar = document.querySelector(sidebarSelector);
      const innerContent = document.querySelector(innerSelector);
      if (!filterSidebar || !innerContent) return false;

      const sidebarParent = filterSidebar.parentElement;
      if (sidebarParent) {
        sidebarParent.style.alignItems = "flex-start";
      }

      ctx = gsap.context(() => {
        const mm = gsap.matchMedia();
        mm.add(minWidth, () => {
          ScrollTrigger.create({
            trigger: innerContent,
            start: startOffset,
            endTrigger: sidebarParent || undefined,
            end: () =>
              `bottom ${unpinOffset + (innerContent as HTMLElement).offsetHeight}px`,
            pin: true,
            pinSpacing: false,
            invalidateOnRefresh: true,
          });
        });
        const cards = gsap.utils.toArray<HTMLElement>(cardsSelector);
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
  }, [
    sidebarSelector,
    innerSelector,
    cardsSelector,
    startOffset,
    unpinOffset,
    minWidth,
  ]);
}
