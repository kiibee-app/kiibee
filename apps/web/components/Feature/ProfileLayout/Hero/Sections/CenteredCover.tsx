"use client";

import { useTranslation } from "react-i18next";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import HeroTabs from "@/components/Feature/ProfileLayout/Hero/HeroTabs";
import ProfileCoverImage from "@/components/Feature/ProfileLayout/Hero/ProfileCoverImage";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useTabbedHeroState } from "@/hooks/useTabbedHeroState";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import {
  AvatarWrapCentered,
  BioText,
  BioMoreButton,
  CoverFrameFull,
  HeroWrapperCentered,
  InfoSection,
  NameText,
  UploadsText,
} from "@/components/Feature/ProfileLayout/Hero/styles";

export default function CenteredCoverSection() {
  const { t } = useTranslation();
  const tabState = useTabbedHeroState();
  const { openAbout } = tabState;
  const {
    displayName,
    avatarUrl,
    coverImageUrl,
    mobileCoverImageUrl,
    initial,
    about,
  } = useCreatorChannelProfile();
  const creatorName = displayName;
  const uploadsCount = about?.uploadCount ?? 0;
  const biography = about?.description ?? "";

  return (
    <HeroWrapperCentered>
      <CoverFrameFull>
        <ProfileCoverImage
          src={coverImageUrl}
          alt={t(CREATE_PROFILE_HOME.title)}
          fill
          sizes="100vw"
          priority
          unoptimized
        />
      </CoverFrameFull>

      <InfoSection>
        <AvatarWrapCentered>
          <CreatorChannelAvatar
            avatarUrl={avatarUrl || mobileCoverImageUrl}
            initial={initial}
            alt={creatorName || t(CREATE_PROFILE_HOME.title)}
            sizes="180px"
            fit="contain"
          />
        </AvatarWrapCentered>

        <NameText>{creatorName}</NameText>
        <UploadsText>
          {t(CREATE_PROFILE_HOME.uploads, { count: uploadsCount })}
        </UploadsText>
        <BioText>{biography}</BioText>
        <BioMoreButton onClick={openAbout}>
          {t(CREATE_PROFILE_HOME.more)}
        </BioMoreButton>

        <HeroTabs {...tabState} centered />
      </InfoSection>
    </HeroWrapperCentered>
  );
}
