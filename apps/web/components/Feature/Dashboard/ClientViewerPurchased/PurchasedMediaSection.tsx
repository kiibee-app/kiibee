"use client";

import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import type { PurchasedMediaItem } from "@/utils/dummyData/viewerPurchasedMockData";
import { VIEWER_PURCHASED_PLACEHOLDERS } from "@/utils/dummyData/viewerPurchasedMockData";
import { purchasedMediaToTutorial } from "@/utils/purchasedMediaToTutorial";
import {
  EmptyHint,
  MediaRow,
  MediaRowSlot,
  SectionBlock,
  SectionHeaderRow,
  SectionTitle,
} from "./styles";
import LeftIcon from "@/assets/icons/LeftIcon";

type Props = {
  title: string;
  items: PurchasedMediaItem[];
  emptyHint?: string;
};

export default function PurchasedMediaSection({
  title,
  items,
  emptyHint = VIEWER_PURCHASED_PLACEHOLDERS.emptyMedia,
}: Props) {
  return (
    <SectionBlock>
      <SectionHeaderRow>
        <SectionTitle>{title}</SectionTitle>
        <LeftIcon />
      </SectionHeaderRow>
      {items.length === 0 ? (
        <EmptyHint>{emptyHint}</EmptyHint>
      ) : (
        <MediaRow>
          {items.map((item) => (
            <MediaRowSlot key={item.id}>
              <TutorialCard tutorial={purchasedMediaToTutorial(item)} />
            </MediaRowSlot>
          ))}
        </MediaRow>
      )}
    </SectionBlock>
  );
}
