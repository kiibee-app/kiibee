"use client";

import { useTranslation } from "react-i18next";
import coverImage from "@/assets/images/creators/creator_profile_hero3.png";
import avatarImage from "@/assets/images/creators/profile_pic3.png";
import CreatorInfoModal from "@/components/Feature/ProfileLayout/shared/CreatorInfoModal";
import HeroTabs from "@/components/Feature/ProfileLayout/Hero/HeroTabs";
import { useTabbedHeroState } from "@/hooks/useTabbedHeroState";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import {
  AvatarImage,
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
          <AvatarImage
            src={avatarImage}
            alt={t(CREATE_PROFILE_HOME.title)}
            fill
            sizes="180px"
          />
        </AvatarWrapCentered>

        <NameText>{t(CREATE_PROFILE_HOME.title)}</NameText>
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
