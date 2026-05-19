"use client";

import { useRouter } from "next/navigation";
import {
  SingleContentBody,
  SingleContentHero,
  SingleContentTopBar,
} from "./ContentSections";
import { Card, Wrapper } from "./styles";
import type { SingleContentPageProps } from "@/types/contentTypes";
import { useTranslation } from "react-i18next";

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
  shareLabel,
  showShare = true,
  showBack = true,
  onBack,
  onShare,
  children,
}: SingleContentPageProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const resolvedShareLabel = shareLabel ?? t("common.share");

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    router.back();
  };

  return (
    <Wrapper>
      <Card>
        <SingleContentTopBar
          showBack={showBack}
          showShare={showShare}
          shareLabel={resolvedShareLabel}
          backAriaLabel={t("singleContent.navigation.goBack")}
          onBackClick={handleBack}
          onShare={onShare}
        />

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
