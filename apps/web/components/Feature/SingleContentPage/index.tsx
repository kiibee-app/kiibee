"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { PATHS } from "@/utils/path";
import {
  ACCESS_TYPE_FREE,
  ACCESS_KEYWORD_EN,
  ACCESS_KEYWORD_DA,
  STRING,
} from "@/utils/Constants";
import {
  SingleContentBody,
  SingleContentHero,
  SingleContentTopBar,
} from "./ContentSections";
import { Card, ContentLayout, Wrapper } from "./styles";
import type {
  SingleContentPageProps,
  SingleContentAction,
} from "@/types/contentTypes";
import { FORMAT_TYPE } from "@/utils/types";
import useShare from "@/hooks/useShare";
import ContentPreviewModal from "./ContentPreviewModal";

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
  primaryActions,
  metaItems = [],
  shareLabel = "Share",
  showShare = true,
  showBack = true,
  onBack,
  onShare,
  children,
}: SingleContentPageProps) {
  const router = useRouter();
  const user = useStoredLoginUser();
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const isPreviewableType =
    hero?.contentType === FORMAT_TYPE.PDF ||
    hero?.contentType === FORMAT_TYPE.WEB ||
    hero?.contentType === FORMAT_TYPE.EPUB ||
    hero?.contentType === FORMAT_TYPE.VIDEO ||
    hero?.contentType === FORMAT_TYPE.AUDIO;

  const isWebType = hero?.contentType === FORMAT_TYPE.WEB;

  const canPreview =
    isPreviewableType && Boolean(hero?.media?.src || hero?.contentUrl);

  const handlePrimaryActionClick = () => {
    if (isWebType && hero?.media?.src) {
      window.open(hero.media.src, "_blank", "noopener,noreferrer");
      return;
    }

    if (canPreview) {
      setShowPreviewModal(true);
      return;
    }

    if (primaryAction?.onClick) {
      primaryAction.onClick();
      return;
    }

    const accessMeta = metaItems.find(
      (item) =>
        item.label.toLowerCase().includes(ACCESS_KEYWORD_EN) ||
        item.label.toLowerCase().includes(ACCESS_KEYWORD_DA),
    );
    const isPaid =
      accessMeta &&
      typeof accessMeta.value === STRING &&
      accessMeta.value !== ACCESS_TYPE_FREE;
    const isLoggedIn = Boolean(user && user.id);

    if (isPaid && !isLoggedIn) {
      router.push(PATHS.AUTH_LOGIN);
    }
  };

  const modifiedPrimaryAction = primaryAction
    ? {
        ...primaryAction,
        onClick: handlePrimaryActionClick,
      }
    : undefined;

  const modifiedPrimaryActions: SingleContentAction[] | undefined =
    primaryActions?.map((action) => ({
      ...action,
      onClick: handlePrimaryActionClick,
    }));

  const { share } = useShare();
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
        onShare={onShare ?? share}
      />
      <Card>
        <ContentLayout $isPdf={isPdfLayout}>
          <SingleContentHero hero={hero} isPdfLayout={isPdfLayout} />

          <SingleContentBody
            creator={creator}
            primaryActions={modifiedPrimaryActions}
            statusLabel={statusLabel}
            title={title}
            descriptions={descriptions}
            tags={tags}
            primaryAction={modifiedPrimaryAction}
            expiry={expiry}
            metaItems={metaItems}
          />
        </ContentLayout>
      </Card>

      {children}
      {canPreview && (
        <ContentPreviewModal
          visible={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          src={hero.contentUrl || hero.media?.src || ""}
          type={hero.contentType || hero.media?.type || FORMAT_TYPE.VIDEO}
          title={title}
        />
      )}
    </Wrapper>
  );
}
