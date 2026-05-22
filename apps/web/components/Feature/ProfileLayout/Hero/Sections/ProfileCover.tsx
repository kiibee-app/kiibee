"use client";

import { useTranslation } from "react-i18next";
import coverImage from "@/assets/images/creators/create_profile_hero1.png";
import CreatorInfoModal from "@/components/Feature/ProfileLayout/shared/CreatorInfoModal";
import CreatorChannelAvatar from "@/components/Feature/ProfileLayout/shared/CreatorChannelAvatar";
import HeroTabs from "@/components/Feature/ProfileLayout/Hero/HeroTabs";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useTabbedHeroState } from "@/hooks/useTabbedHeroState";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import {
  AvatarWrap,
  ContentInner,
  CoverFrame,
  CoverImage,
  CreatorBio,
  CreatorBioText,
  CreatorName,
  CreatorNameText,
  HeroWrapper,
  MoreText,
  MoreTextLabel,
  ProfileMeta,
  ProfileSection,
  UploadCount,
  UploadCountText,
} from "@/components/Feature/ProfileLayout/Hero/styles";

/** Layout 1: rounded cover, avatar beside bio, “more” opens about modal */
export default function ProfileCoverSection() {
  const { t } = useTranslation();
  const tabState = useTabbedHeroState();
  const { isAboutOpen, openAbout, closeAbout } = tabState;
  const { displayName, avatarUrl, initial } = useCreatorChannelProfile();
  const creatorName = displayName;

  return (
    <HeroWrapper>
      <CoverFrame>
        <CoverImage
          src={coverImage}
          alt={t(CREATE_PROFILE_HOME.title)}
          fill
          sizes="(max-width: 900px) 100vw, 1300px"
          priority
        />
      </CoverFrame>

      <ContentInner>
        <ProfileSection>
          <AvatarWrap>
            <CreatorChannelAvatar
              avatarUrl={avatarUrl}
              initial={initial}
              alt={creatorName || t(CREATE_PROFILE_HOME.title)}
              sizes="152px"
            />
          </AvatarWrap>

          <ProfileMeta>
            <CreatorName>
              <CreatorNameText>{creatorName}</CreatorNameText>
            </CreatorName>
            <UploadCount>
              <UploadCountText>
                {t(CREATE_PROFILE_HOME.uploads, { count: 42 })}
              </UploadCountText>
            </UploadCount>
            <CreatorBio>
              <CreatorBioText>
                {t(CREATE_PROFILE_HOME.description)}
              </CreatorBioText>
              <MoreText>
                <MoreTextLabel onClick={openAbout}>
                  {t(CREATE_PROFILE_HOME.more)}
                </MoreTextLabel>
              </MoreText>
            </CreatorBio>
          </ProfileMeta>
        </ProfileSection>

        <HeroTabs {...tabState} />
      </ContentInner>

      <CreatorInfoModal visible={isAboutOpen} onClose={closeAbout} />
    </HeroWrapper>
  );
}
