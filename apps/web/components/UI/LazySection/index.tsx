"use client";

import { t } from "i18next";
import GenericLoader from "@/components/UI/GenericLoader";
import { type LazySectionProps } from "@/types/lazySection";
import { LOADER_SIZE, LOADER_VARIANT } from "@/utils/ui";
import { LazySectionRoot } from "./styles";
import { useLazySectionRender } from "./useLazySectionRender";

export default function LazySection({
  children,
  minHeight = 320,
  rootMargin = "120px 0px",
}: LazySectionProps) {
  const { sectionRef, shouldRender } = useLazySectionRender(rootMargin);

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
