"use client";

import { useTranslation } from "react-i18next";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";
import ProfileCoverImage from "@/components/Feature/ProfileLayout/Hero/ProfileCoverImage";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useTabbedHeroState } from "@/hooks/useTabbedHeroState";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import {
  HeroContent,
  HeroFrame,
  HeroGrid,
  HeroMedia,
  StoryDescription,
  StoryMeta,
  StoryPanel,
  StoryTitle,
  StoryUploadsText,
  StoryBioText,
  StoryMoreButton,
} from "@/components/Feature/ProfileLayout/Hero/styles";

export default function StorySection() {
  const { t } = useTranslation();
  const tabState = useTabbedHeroState();
  const { openAbout } = tabState;
  const { displayName, coverImageUrl, about } = useCreatorChannelProfile();
  const uploadsCount = about?.uploadCount ?? 0;
  const biography = about?.description ?? "";

  return (
    <HeroFrame>
      <HeroGrid>
        <HeroMedia $hasImage={Boolean(coverImageUrl)}>
          <ProfileCoverImage
            src={coverImageUrl}
            alt="Creator workspace"
            fill
            sizes="(max-width: 900px) 100vw, 70vw"
            priority
            unoptimized
          />
        </HeroMedia>

        <HeroContent>
          <StoryPanel data-creator-cover-text>
            <StoryMeta>
              <StoryUploadsText>
                <MonoText $use="Body_Medium" color={COLORS.primary.WHITE_90}>
                  {t(CREATE_PROFILE_HOME.uploads, { count: uploadsCount })}
                </MonoText>
              </StoryUploadsText>
            </StoryMeta>

            <StoryTitle>
              <MonoText $use="Heading2" color={COLORS.primary.WHITE}>
                {displayName}
              </MonoText>
            </StoryTitle>

            <StoryDescription>
              <StoryBioText>
                <MonoText $use="Body_Medium" color={COLORS.primary.WHITE_90}>
                  {biography}
                </MonoText>
              </StoryBioText>
              <StoryMoreButton onClick={openAbout}>
                {t(CREATE_PROFILE_HOME.more)}
              </StoryMoreButton>
            </StoryDescription>
          </StoryPanel>
        </HeroContent>
      </HeroGrid>
    </HeroFrame>
  );
}
