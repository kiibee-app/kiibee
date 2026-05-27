"use client";

import { useRouter } from "next/navigation";
import {
  SingleContentBody,
  SingleContentHero,
  SingleContentTopBar,
} from "./ContentSections";
import { Card, Wrapper } from "./styles";
import type { SingleContentPageProps } from "@/types/contentTypes";

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
        <SingleContentHero hero={hero} />

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
      </Card>

      {children}
    </Wrapper>
  );
}
