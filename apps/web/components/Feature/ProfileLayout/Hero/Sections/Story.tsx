"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import COLORS from "@repo/ui/colors";
import heroImage from "@/assets/images/creators/creator_profile_hero.png";
import { MonoText } from "@/components/UI/Monotext";
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

  return (
    <HeroFrame>
      <HeroGrid>
        <HeroMedia>
          <Image
            src={heroImage}
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
                  {t(CREATE_PROFILE_HOME.uploads, { count: 76 })}
                </MonoText>
              </StoryUploadsText>
            </StoryMeta>

            <StoryTitle>
              <MonoText $use="Heading2" color={COLORS.primary.WHITE}>
                {t(CREATE_PROFILE_HOME.title)}
              </MonoText>
            </StoryTitle>

            <StoryDescription>
              <MonoText $use="Body_Medium" color={COLORS.primary.WHITE_90}>
                {t(CREATE_PROFILE_HOME.description)}
              </MonoText>
            </StoryDescription>
          </StoryPanel>
        </HeroContent>
      </HeroGrid>
    </HeroFrame>
  );
}
