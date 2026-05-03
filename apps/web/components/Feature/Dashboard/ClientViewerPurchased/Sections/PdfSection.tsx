"use client";

import type { PurchasedMediaItem } from "@/utils/dummyData/viewerPurchasedMockData";
import PurchasedMediaSection from "../PurchasedMediaSection";

type Props = {
  items: PurchasedMediaItem[];
};

export default function PdfSection({ items }: Props) {
  return <PurchasedMediaSection title="PDF" items={items} />;
}
