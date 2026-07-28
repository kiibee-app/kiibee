"use client";

import { useMemo } from "react";
import CollectionPreview from "@/components/Feature/ProfileLayout/shared/CollectionPreview";
import LatestUpload from "@/components/Feature/ProfileLayout/shared/LatestUpload";
import { profileHomeConfigByVariant } from "@/components/Feature/ProfileLayout/config";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import GenericButton from "@/components/UI/GenericButton";
import PlusIcon from "@/assets/icons/PlusIcon";
import COLORS from "@repo/ui/colors";
import { PROFILE_HOME_SECTION, VARIANT, VARIANT_PAGE } from "@/utils/Constants";
import {
  ContentAdjust,
  SectionWrapper,
} from "@/components/Feature/ProfileLayout/HomeSections/styles";
import { useTranslation } from "react-i18next";
import { useLatestUpload } from "@/hooks/useLatestUpload";
import latestUploadImage from "@/assets/images/creators/recent_creator.webp";
import { normalizeContentTypeValue } from "@/utils/content";
import { FORMAT_TYPE } from "@/utils/types";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { matchesProfileSearch } from "@/utils/creatorChannel";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import AccessGate from "@/components/Feature/AccessGate";
import { useCreatorAccessGate } from "@/hooks/useCreatorAccessGate";
import ProfileEmptyState from "@/components/Feature/ProfileLayout/shared/ProfileEmptyState";
import { usePublicCreatorContent } from "@/hooks/creators/usePublicCreatorContent";
import { useProfileHomeCollections } from "@/hooks/useProfileHomeCollections";
import {
  resolveContentThumbnailCandidates,
  resolveImageUrl,
} from "@/utils/media";

type ProfileHomeSectionsProps = {
  variant: ProfileLayoutVariant;
};

export default function ProfileHomeSections({
  variant,
}: ProfileHomeSectionsProps) {
  const { t } = useTranslation();
  const { searchQuery, isCollectionsPage } = useCreatorProfileUi();
  const { isPublicView, publicCreatorId, displayName } =
    useCreatorChannelProfile();
  const storedUser = useStoredLoginUser();
  const isOwner =
    !isPublicView ||
    (Boolean(publicCreatorId) && storedUser?.id === publicCreatorId);
  const { gateType, handleSuccess } = useCreatorAccessGate();
  const {
    latestUpload: latestConfig,
    wrapLatestUpload,
    sections,
  } = profileHomeConfigByVariant[variant];

  const { data: latest, isLoading: isLatestLoading } = useLatestUpload(
    isPublicView ? publicCreatorId : null,
  );

  const { tutorials: publicTutorials, isLoading: isPublicLoading } =
    usePublicCreatorContent(isPublicView ? publicCreatorId : null);

  const { data: privateSections = [], isLoading: isPrivateLoading } =
    useProfileHomeCollections(displayName || "", !isPublicView);

  const normalizedLatestContentType = latest
    ? normalizeContentTypeValue(
        String((latest as { contentType?: unknown }).contentType ?? ""),
      )
    : null;

  const latestUploadData = latest
    ? (() => {
        const thumbnailCandidates = resolveContentThumbnailCandidates(
          (latest as { thumbnailUrl?: string | null }).thumbnailUrl,
          typeof latest.thumbnailLandscapeUrl === "string"
            ? latest.thumbnailLandscapeUrl
            : null,
          { preferLandscape: true },
        );
        const staticFallback = resolveImageUrl(latestUploadImage);
        const imageFallbacks = [
          ...thumbnailCandidates.slice(1),
          ...(thumbnailCandidates[0] &&
          thumbnailCandidates[0] !== staticFallback
            ? [staticFallback]
            : []),
        ];

        return {
          sectionTitle: latestConfig.sectionTitle,
          badge:
            (latest as { category?: string | null }).category ??
            latestConfig.badge ??
            "",
          image: thumbnailCandidates[0] ?? latestUploadImage,
          imageFallbacks:
            imageFallbacks.length > 0 ? imageFallbacks : undefined,
          contentType: normalizedLatestContentType || FORMAT_TYPE.VIDEO,
          imageAlt: latest.title || "",
          title: latest.title || "",
          year: new Date(latest.createdAt).getFullYear().toString(),
          description: latest.description ?? "",
          actions: latestConfig.actions,
          contentId: latest.id,
          trailerUrl:
            (latest as { trailerUrl?: string | null }).trailerUrl ?? null,
          accessType:
            (latest as { accessType?: string | null }).accessType ?? null,
          buyPrice:
            (latest as { buyPrice?: string | number | null }).buyPrice ?? null,
          rentPrice:
            (latest as { rentPrice?: string | number | null }).rentPrice ??
            null,
          rentDurationHours:
            (latest as { rentDurationHours?: string | number | null })
              .rentDurationHours ?? null,
        };
      })()
    : null;

  const showLatestUpload =
    !isCollectionsPage &&
    latestUploadData &&
    matchesProfileSearch(searchQuery, latestUploadData.title);

  const hasNoPublicContent = useMemo(() => {
    const matched = searchQuery.trim()
      ? publicTutorials.filter((t) =>
          matchesProfileSearch(searchQuery, t.title),
        )
      : publicTutorials;
    return matched.length === 0;
  }, [publicTutorials, searchQuery]);

  const hasNoPrivateContent = useMemo(() => {
    const matched = searchQuery.trim()
      ? privateSections
          .map((section) => ({
            ...section,
            cards: section.cards.filter((card) =>
              matchesProfileSearch(searchQuery, card.title),
            ),
          }))
          .filter((section) => section.cards.length > 0)
      : privateSections;
    return matched.length === 0;
  }, [privateSections, searchQuery]);

  const hasNoContent = isPublicView ? hasNoPublicContent : hasNoPrivateContent;

  if (gateType) {
    return (
      <AccessGate
        type={gateType}
        variant={VARIANT_PAGE}
        creatorName={displayName ?? undefined}
        onSuccess={handleSuccess}
      />
    );
  }

  const latestUploadSection = showLatestUpload ? (
    wrapLatestUpload ? (
      <SectionWrapper>
        <ContentAdjust>
          <LatestUpload
            data={latestUploadData}
            isOwner={isOwner}
            variant={variant}
          />
        </ContentAdjust>
      </SectionWrapper>
    ) : (
      <LatestUpload
        data={latestUploadData}
        isOwner={isOwner}
        variant={variant}
      />
    )
  ) : null;

  const collectionPreviewSection =
    !isCollectionsPage && wrapLatestUpload ? (
      <SectionWrapper>
        <ContentAdjust>
          <CollectionPreview variant={variant} />
        </ContentAdjust>
      </SectionWrapper>
    ) : !isCollectionsPage ? (
      <CollectionPreview variant={variant} />
    ) : null;

  const isLoading =
    isLatestLoading || (isPublicView ? isPublicLoading : isPrivateLoading);

  if (hasNoContent && !isLoading) {
    const isSearching = searchQuery.trim() !== "";
    let emptyTitle = isSearching
      ? t("createProfileHome.noSearchResultsTitle")
      : t("createProfileHome.noContentTitle");
    let emptyDescription = isSearching
      ? t("createProfileHome.noSearchResultsDescription")
      : t("createProfileHome.noContentDescription");
    let emptyAction: React.ReactNode = undefined;

    if (!isSearching && isOwner) {
      emptyTitle = t("createProfileHome.ownerNoContentTitle");
      emptyDescription = t("createProfileHome.ownerNoContentDescription");
      emptyAction = (
        <GenericButton
          variant={VARIANT.PRIMARY}
          href="/dashboard/creators?view=Contents"
          style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
        >
          <PlusIcon width={16} height={16} color={COLORS.primary.WHITE} />
          {t("contents.actions.createCollection")}
        </GenericButton>
      );
    }

    return (
      <ProfileEmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <>
      {sections.includes(PROFILE_HOME_SECTION.LATEST_UPLOAD) &&
        latestUploadSection}

      {sections.includes(PROFILE_HOME_SECTION.COLLECTIONS_PREVIEW) &&
        collectionPreviewSection}
    </>
  );
}
