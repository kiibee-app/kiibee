"use client";

import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import CenteredCoverSection from "@/components/Feature/ProfileLayout/Hero/Sections/CenteredCover";
import ProfileCoverSection from "@/components/Feature/ProfileLayout/Hero/Sections/ProfileCover";
import StorySection from "@/components/Feature/ProfileLayout/Hero/Sections/Story";

type ProfileHeroProps = {
  variant: ProfileLayoutVariant;
};

export default function ProfileHero({ variant }: ProfileHeroProps) {
  switch (variant) {
    case "2":
      return <StorySection />;
    case "3":
      return <CenteredCoverSection />;
    default:
      return <ProfileCoverSection />;
  }
}
