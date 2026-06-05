"use client";

import { useRouter } from "next/navigation";
import {
  SingleContentBody,
  SingleContentHero,
  SingleContentTopBar,
} from "./ContentSections";
import { Card, ContentLayout, Wrapper } from "./styles";
import type { SingleContentPageProps } from "@/types/contentTypes";
import { FORMAT_TYPE } from "@/utils/types";

export type {
  SingleContentHeroProps,
  SingleContentMetaItem,
  SingleContentPageProps,
} from "@/types/contentTypes";

export default function SingleContentPage({
  title,
  descriptions = [],
  tags = [],
  statusLabel,
  expiry,
  creator,
  hero,
  primaryAction,
  metaItems = [],
  shareLabel = "Share",
  showShare = true,
  showBack = true,
  onBack,
  onShare,
  children,
}: SingleContentPageProps) {
  const router = useRouter();
  const isPdfLayout =
    hero?.media?.type === FORMAT_TYPE.PDF ||
    hero?.media?.type === FORMAT_TYPE.EPUB;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <Wrapper>
      <SingleContentTopBar
        showBack={showBack}
        showShare={showShare}
        shareLabel={shareLabel}
        onBackClick={handleBack}
        onShare={onShare}
      />

      <Card>
        <ContentLayout $isPdf={isPdfLayout}>
          <SingleContentHero hero={hero} isPdfLayout={isPdfLayout} />

          <SingleContentBody
            creator={creator}
            statusLabel={statusLabel}
            title={title}
            descriptions={descriptions}
            tags={tags}
            primaryAction={primaryAction}
            expiry={expiry}
            metaItems={metaItems}
          />
        </ContentLayout>
      </Card>

      {children}
    </Wrapper>
  );
}
