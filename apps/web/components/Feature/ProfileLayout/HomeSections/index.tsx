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

type ProfileHomeSectionsProps = {
  variant: ProfileLayoutVariant;
};

export default function ProfileHomeSections({
  variant,
}: ProfileHomeSectionsProps) {
  const { latestUpload, wrapLatestUpload, sections } =
    profileHomeConfigByVariant[variant];

  const latestUploadSection = wrapLatestUpload ? (
    <SectionWrapper>
      <ContentAdjust>
        <LatestUpload data={latestUpload} />
      </ContentAdjust>
    </SectionWrapper>
  ) : (
    <LatestUpload data={latestUpload} />
  );

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
      {sections.includes(PROFILE_HOME_SECTION.LATEST_UPLOAD)
        ? latestUploadSection
        : null}
      {sections.includes(PROFILE_HOME_SECTION.COLLECTIONS_PREVIEW)
        ? collectionPreviewSection
        : null}
      {sections.includes(PROFILE_HOME_SECTION.ABOUT) ? <AboutSection /> : null}
    </>
  );
}
