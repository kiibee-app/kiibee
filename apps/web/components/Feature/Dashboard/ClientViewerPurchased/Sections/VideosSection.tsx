"use client";

import type { PurchasedMediaItem } from "@/utils/dummyData/viewerPurchasedMockData";
import PurchasedMediaSection from "../PurchasedMediaSection";

type Props = {
  items: PurchasedMediaItem[];
};

export default function VideosSection({ items }: Props) {
  return <PurchasedMediaSection title="Videos" items={items} />;
}
