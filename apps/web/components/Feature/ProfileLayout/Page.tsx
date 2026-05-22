"use client";

import CollectionList from "@/components/Feature/ProfileLayout/shared/CollectionList";
import ProfileHero from "@/components/Feature/ProfileLayout/Hero";
import ProfileHomeSections from "@/components/Feature/ProfileLayout/HomeSections";
import ProfileShell from "@/components/Feature/ProfileLayout/Shell";
import type { ProfileLayoutVariant } from "@/components/Feature/ProfileLayout/config";
import { PROFILE_LAYOUT_PAGE, ProfileLayoutPageKind } from "@/utils/Constants";

type ProfileLayoutPageProps = {
  variant: ProfileLayoutVariant;
  page: ProfileLayoutPageKind;
};

export default function ProfileLayoutPage({
  variant,
  page,
}: ProfileLayoutPageProps) {
  return (
    <ProfileShell variant={variant}>
      <ProfileHero variant={variant} />
      {page === PROFILE_LAYOUT_PAGE.HOME ? (
        <ProfileHomeSections variant={variant} />
      ) : (
        <CollectionList />
      )}
    </ProfileShell>
  );
}
