"use client";

import { useRouter } from "next/navigation";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { PATHS } from "@/utils/path";
import {
  ACCESS_TYPE_FREE,
  ACCESS_KEYWORD_EN,
  ACCESS_KEYWORD_DA,
} from "@/utils/Constants";
import {
  SingleContentBody,
  SingleContentHero,
  SingleContentTopBar,
} from "./ContentSections";
import { Card, ContentLayout, Wrapper } from "./styles";
import type { SingleContentPageProps } from "@/types/contentTypes";
import { FORMAT_TYPE } from "@/utils/types";
import useShare from "@/hooks/useShare";

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
  const user = useStoredLoginUser();

  const handlePrimaryActionClick = () => {
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
      typeof accessMeta.value === "string" &&
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
    </Wrapper>
  );
}
