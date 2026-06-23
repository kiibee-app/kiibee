"use client";

import CollectionPreview from "@/components/Feature/ProfileLayout/shared/CollectionPreview";
import LatestUpload from "@/components/Feature/ProfileLayout/shared/LatestUpload";
import { profileHomeConfigByVariant } from "@/components/Feature/ProfileLayout/config";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { PROFILE_HOME_SECTION, VARIANT_PAGE } from "@/utils/Constants";
import {
  ContentAdjust,
  SectionWrapper,
} from "@/components/Feature/ProfileLayout/HomeSections/styles";
import { useLatestUpload } from "@/hooks/useLatestUpload";
import latestUploadImage from "@/assets/images/creators/recent_creator.webp";
import { normalizeContentTypeValue } from "@/utils/content";
import { FORMAT_TYPE } from "@/utils/types";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { matchesProfileSearch } from "@/utils/creatorChannel";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import AccessGate from "@/components/Feature/AccessGate";
import { useCreatorAccessGate } from "@/hooks/useCreatorAccessGate";

type ProfileHomeSectionsProps = {
  variant: ProfileLayoutVariant;
};

export default function ProfileHomeSections({
  variant,
}: ProfileHomeSectionsProps) {
  const { searchQuery, isCollectionsPage } = useCreatorProfileUi();
  const { isPublicView, publicCreatorId, displayName } =
    useCreatorChannelProfile();
  const { gateType } = useCreatorAccessGate();
  const {
    latestUpload: latestConfig,
    wrapLatestUpload,
    sections,
  } = profileHomeConfigByVariant[variant];

  const { data: latest } = useLatestUpload(
    isPublicView ? publicCreatorId : null,
  );

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
        image: latest.thumbnailImage ?? latestUploadImage,
        imageFallback: latest.thumbnailImageFallback ?? undefined,
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

  return (
    <>
      {sections.includes(PROFILE_HOME_SECTION.LATEST_UPLOAD) &&
        latestUploadSection}

      {sections.includes(PROFILE_HOME_SECTION.COLLECTIONS_PREVIEW) &&
        collectionPreviewSection}
    </>
  );
}
