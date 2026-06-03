"use client";

import { useTranslation } from "react-i18next";
import coverImage from "@/assets/images/creators/create_profile_hero1.png";
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

export default function ProfileCoverSection() {
  const { t } = useTranslation();
  const tabState = useTabbedHeroState();
  const { openAbout } = tabState;
  const { displayName, avatarUrl, initial, about } = useCreatorChannelProfile();
  const creatorName = displayName;
  const uploadsCount = about?.uploadCount ?? 0;
  const biography = about?.description || t(CREATE_PROFILE_HOME.description);

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
                {t(CREATE_PROFILE_HOME.uploads, { count: uploadsCount })}
              </UploadCountText>
            </UploadCount>
            <CreatorBio>
              <CreatorBioText>{biography}</CreatorBioText>
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
    </HeroWrapper>
  );
}
