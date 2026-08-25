"use client";

import { useTranslation } from "react-i18next";
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
  CoverInitial,
  CoverMedia,
  CreatorBio,
  CreatorBioText,
  CreatorName,
  CreatorNameText,
  HeroWrapper,
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
    <HeroWrapper>
      <CoverFrame>
        <CoverMedia>
          {coverImageUrl ? (
            <CoverImage
              src={coverImageUrl}
              alt={t(CREATE_PROFILE_HOME.title)}
              fill
              sizes="100vw"
              priority
              unoptimized
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          ) : (
            <CoverInitial>{initial}</CoverInitial>
          )}
        </CoverMedia>
      </CoverFrame>

      <ContentInner>
        <ProfileSection>
          <AvatarWrap>
            <CreatorChannelAvatar
              avatarUrl={mobileCoverImageUrl || avatarUrl}
              initial={initial}
              alt={creatorName || t(CREATE_PROFILE_HOME.title)}
              sizes="152px"
              fit="contain"
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
              <MoreTextLabel onClick={openAbout}>
                {t(CREATE_PROFILE_HOME.more)}
              </MoreTextLabel>
            </CreatorBio>
          </ProfileMeta>
        </ProfileSection>

        <HeroTabs {...tabState} />
      </ContentInner>
    </HeroWrapper>
  );
}
