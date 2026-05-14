"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";
import COLORS from "@repo/ui/colors";
import { MonoText } from "@/components/UI/Monotext";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import heroImage from "@/assets/images/creators/creator_profile_hero.png";
import {
  HeroFrame,
  HeroGrid,
  HeroContent,
  HeroMedia,
  StoryDescription,
  StoryMeta,
  StoryPanel,
  StoryTitle,
  UploadsText,
} from "../CreateProfileHome/styles";

export default function CreateProfile2Hero() {
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
              <UploadsText>
                <MonoText $use="Body_Medium" color={COLORS.primary.WHITE_90}>
                  {t(CREATE_PROFILE_HOME.uploads, { count: 76 })}
                </MonoText>
              </UploadsText>
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
