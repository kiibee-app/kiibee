"use client";

import { useMemo } from "react";
import CollectionPreview from "@/components/Feature/ProfileLayout/shared/CollectionPreview";
import LatestUpload from "@/components/Feature/ProfileLayout/shared/LatestUpload";
import { profileHomeConfigByVariant } from "@/components/Feature/ProfileLayout/config";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { PROFILE_HOME_SECTION, VARIANT_PAGE } from "@/utils/Constants";
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
import AccessGate from "@/components/Feature/AccessGate";
import { useCreatorAccessGate } from "@/hooks/useCreatorAccessGate";
import ProfileEmptyState from "@/components/Feature/ProfileLayout/shared/ProfileEmptyState";
import { usePublicCreatorContent } from "@/hooks/creators/usePublicCreatorContent";
import { useProfileHomeCollections } from "@/hooks/useProfileHomeCollections";

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
  const { gateType } = useCreatorAccessGate();
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
    ? {
        sectionTitle: latestConfig.sectionTitle,
        badge:
          (latest as { category?: string | null }).category ??
          latestConfig.badge ??
          "",
        image: latest.thumbnailLandscapeUrl ?? latestUploadImage,
        contentType: normalizedLatestContentType || FORMAT_TYPE.VIDEO,
        imageAlt: latest.title || "",
        title: latest.title || "",
        year: new Date(latest.createdAt).getFullYear().toString(),
        description: latest.description ?? "",
        actions: latestConfig.actions,
        contentId: latest.id,
        accessType:
          (latest as { accessType?: string | null }).accessType ?? null,
        buyPrice:
          (latest as { buyPrice?: string | number | null }).buyPrice ?? null,
        rentPrice:
          (latest as { rentPrice?: string | number | null }).rentPrice ?? null,
        rentDurationHours:
          (latest as { rentDurationHours?: string | number | null })
            .rentDurationHours ?? null,
        imageStyle: latestConfig.imageStyle,
        containerStyle: latestConfig.containerStyle,
      }
    : null;

  const showLatestUpload =
    !isCollectionsPage &&
    latestUploadData &&
    matchesProfileSearch(searchQuery, latestUploadData.title);

  const hasNoContent = useMemo(() => {
    if (isPublicView) {
      const matched = searchQuery.trim()
        ? publicTutorials.filter((t) =>
            matchesProfileSearch(searchQuery, t.title),
          )
        : publicTutorials;
      return matched.length === 0;
    } else {
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
    }
  }, [isPublicView, publicTutorials, privateSections, searchQuery]);

  if (gateType) {
    return (
      <AccessGate
        type={gateType}
        variant={VARIANT_PAGE}
        creatorName={displayName ?? undefined}
        onSuccess={() => {
          if (publicCreatorId) {
            window.localStorage.setItem(
              `kiibee:gate:unlocked:creator:${publicCreatorId}`,
              "true",
            );
            window.location.reload();
          }
        }}
      />
    );
  }

  const latestUploadSection = showLatestUpload ? (
    wrapLatestUpload ? (
      <SectionWrapper>
        <ContentAdjust>
          <LatestUpload data={latestUploadData} />
        </ContentAdjust>
      </SectionWrapper>
    ) : (
      <LatestUpload data={latestUploadData} />
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
    return (
      <ProfileEmptyState
        title={
          isSearching
            ? t("createProfileHome.noSearchResultsTitle")
            : t("createProfileHome.noContentTitle")
        }
        description={
          isSearching
            ? t("createProfileHome.noSearchResultsDescription")
            : t("createProfileHome.noContentDescription")
        }
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
