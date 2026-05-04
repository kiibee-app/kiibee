"use client";

import { useTranslation } from "react-i18next";
import type { PurchasedMediaItem } from "@/utils/dummyData/viewerPurchasedMockData";
import PurchasedMediaSection from "../PurchasedMediaSection";
import { DASHBOARD_VIEWER_PURCHASED } from "@/utils/translationKeys";

type Props = {
  items: PurchasedMediaItem[];
};

export default function AudiosSection({ items }: Props) {
  const { t } = useTranslation();

  return (
    <PurchasedMediaSection
      title={t(DASHBOARD_VIEWER_PURCHASED.sections.audios)}
      items={items}
      emptyHint={t(DASHBOARD_VIEWER_PURCHASED.emptyStates.media)}
    />
  );
}
