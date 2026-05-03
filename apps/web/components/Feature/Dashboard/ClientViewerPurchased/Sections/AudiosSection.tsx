"use client";

import type { PurchasedMediaItem } from "@/utils/dummyData/viewerPurchasedMockData";
import PurchasedMediaSection from "../PurchasedMediaSection";

type Props = {
  items: PurchasedMediaItem[];
};

export default function AudiosSection({ items }: Props) {
  return <PurchasedMediaSection title="Audios" items={items} />;
}
