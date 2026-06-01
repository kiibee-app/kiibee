"use client";

import AboutSection from "@/components/Feature/ProfileLayout/shared/AboutSection";
import CollectionPreview from "@/components/Feature/ProfileLayout/shared/CollectionPreview";
import LatestUpload from "@/components/Feature/ProfileLayout/shared/LatestUpload";
import { profileHomeConfigByVariant } from "@/components/Feature/ProfileLayout/config";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { PROFILE_HOME_SECTION } from "@/utils/Constants";
import {
  ContentAdjust,
  SectionWrapper,
} from "@/components/Feature/ProfileLayout/HomeSections/styles";
import { useLatestUpload } from "@/hooks/useLatestUpload";
import latestUploadImage from "@/assets/images/creators/recent_creator.webp";
import { normalizeContentTypeValue } from "@/utils/content";
import { FORMAT_TYPE } from "@/utils/types";

type ProfileHomeSectionsProps = {
  variant: ProfileLayoutVariant;
};

export default function ProfileHomeSections({
  variant,
}: ProfileHomeSectionsProps) {
  const {
    latestUpload: latestConfig,
    wrapLatestUpload,
    sections,
  } = profileHomeConfigByVariant[variant];

  const { data: latest } = useLatestUpload();

  const normalizedLatestContentType = latest
    ? normalizeContentTypeValue(
        String((latest as { contentType?: unknown }).contentType ?? ""),
      )
    : null;

  const latestUploadData = latest
    ? {
        id: String(latest.id),
        sectionTitle: latestConfig.sectionTitle,
        badge:
          (latest as { category?: string | null }).category ??
          latestConfig.badge ??
          "",
        image: latestUploadImage,
        contentType: normalizedLatestContentType || FORMAT_TYPE.VIDEO,
        imageAlt: latest.title || "",
        title: latest.title || "",
        year: new Date(latest.createdAt).getFullYear().toString(),
        description: latest.description ?? "",
        actions: latestConfig.actions,
        imageStyle: latestConfig.imageStyle,
        containerStyle: latestConfig.containerStyle,
      }
    : null;

  const latestUploadSection = latestUploadData ? (
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

  const collectionPreviewSection = wrapLatestUpload ? (
    <SectionWrapper>
      <ContentAdjust>
        <CollectionPreview />
      </ContentAdjust>
    </SectionWrapper>
  ) : (
    <CollectionPreview />
  );

  return (
    <>
      {sections.includes(PROFILE_HOME_SECTION.LATEST_UPLOAD) &&
        latestUploadSection}

      {sections.includes(PROFILE_HOME_SECTION.COLLECTIONS_PREVIEW) &&
        collectionPreviewSection}

      {sections.includes(PROFILE_HOME_SECTION.ABOUT) && <AboutSection />}
    </>
  );
}
