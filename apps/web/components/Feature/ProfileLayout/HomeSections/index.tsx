"use client";

import AboutSection from "@/components/Feature/ProfileLayout/shared/AboutSection";
import LatestUpload from "@/components/Feature/ProfileLayout/shared/LatestUpload";
import { profileHomeConfigByVariant } from "@/components/Feature/ProfileLayout/config";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
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

  return (
    <>
      {sections.includes("latestUpload") ? latestUploadSection : null}
      {sections.includes("about") ? <AboutSection /> : null}
    </>
  );
}
