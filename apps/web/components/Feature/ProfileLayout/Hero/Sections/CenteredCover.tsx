"use client";

import { useTranslation } from "react-i18next";
import coverImage from "@/assets/images/creators/creator_profile_hero3.png";
import CreatorInfoModal from "@/components/Feature/ProfileLayout/shared/CreatorInfoModal";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import HeroTabs from "@/components/Feature/ProfileLayout/Hero/HeroTabs";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useTabbedHeroState } from "@/hooks/useTabbedHeroState";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import {
  AvatarWrapCentered,
  BioText,
  CoverFrameFull,
  CoverImage,
  HeroWrapperCentered,
  InfoSection,
  NameText,
  UploadsText,
} from "@/components/Feature/ProfileLayout/Hero/styles";

export default function CenteredCoverSection() {
  const { t } = useTranslation();
  const tabState = useTabbedHeroState();
  const { isAboutOpen, closeAbout } = tabState;
  const { displayName, avatarUrl, initial } = useCreatorChannelProfile();
  const creatorName = displayName;

  return (
    <HeroWrapperCentered>
      <CoverFrameFull>
        <CoverImage
          src={coverImage}
          alt={t(CREATE_PROFILE_HOME.title)}
          fill
          sizes="100vw"
          priority
        />
      </CoverFrameFull>

      <InfoSection>
        <AvatarWrapCentered>
          <CreatorChannelAvatar
            avatarUrl={avatarUrl}
            initial={initial}
            alt={creatorName || t(CREATE_PROFILE_HOME.title)}
            sizes="180px"
          />
        </AvatarWrapCentered>

        <NameText>{creatorName}</NameText>
        <UploadsText>
          {t(CREATE_PROFILE_HOME.uploads, { count: 76 })}
        </UploadsText>
        <BioText>{t(CREATE_PROFILE_HOME.description)}</BioText>

        <HeroTabs {...tabState} centered />
      </InfoSection>

      <CreatorInfoModal visible={isAboutOpen} onClose={closeAbout} />
    </HeroWrapperCentered>
  );
}
