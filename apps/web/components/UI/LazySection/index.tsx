"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import GenericLoader from "@/components/UI/GenericLoader";
import {
  BROWSER_API,
  INTERSECTION_OBSERVER_FALLBACK_DELAY_MS,
  LOADER_SIZE,
  LOADER_VARIANT,
} from "@/utils/ui";
import { LazySectionRoot } from "./styles";
import { t } from "i18next";

type LazySectionProps = {
  children: ReactNode;
  minHeight?: number;
  rootMargin?: string;
};

export default function LazySection({
  children,
  minHeight = 320,
  rootMargin = "250px",
}: LazySectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || shouldRender) return;

    if (!(BROWSER_API.INTERSECTION_OBSERVER in window)) {
      const fallbackTimer = setTimeout(() => {
        setShouldRender(true);
      }, INTERSECTION_OBSERVER_FALLBACK_DELAY_MS);

      return () => {
        clearTimeout(fallbackTimer);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldRender(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, shouldRender]);

  return (
    <LazySectionRoot ref={sectionRef} $minHeight={minHeight}>
      {shouldRender ? (
        children
      ) : (
        <GenericLoader
          variant={LOADER_VARIANT.INLINE}
          size={LOADER_SIZE.SM}
          label={t("common.loading")}
        />
      )}
    </LazySectionRoot>
  );
}
