"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import COLORS from "@repo/ui/colors";
import heroImage from "@/assets/images/creators/creator_profile_hero.png";
import { MonoText } from "@/components/UI/Monotext";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
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
} from "@/components/Feature/ProfileLayout/Hero/styles";

export default function StorySection() {
  const { t } = useTranslation();
  const { displayName, avatarUrl, about } = useCreatorChannelProfile();
  const uploadsCount = about?.uploadCount ?? 0;
  const biography = about?.description || t(CREATE_PROFILE_HOME.description);

  return (
    <HeroFrame>
      <HeroGrid>
        <HeroMedia>
          <Image
            src={avatarUrl || heroImage}
            alt="Creator workspace"
            fill
            sizes="(max-width: 900px) 100vw, 70vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
            priority
          />
        </HeroMedia>

        <HeroContent>
          <StoryPanel>
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
              <MonoText $use="Body_Medium" color={COLORS.primary.WHITE_90}>
                {biography}
              </MonoText>
            </StoryDescription>
          </StoryPanel>
        </HeroContent>
      </HeroGrid>
    </HeroFrame>
  );
}
