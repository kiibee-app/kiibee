"use client";

import { useTranslation } from "react-i18next";
import coverImage from "@/assets/images/creators/creator_profile_hero3.png";
import avatarImage from "@/assets/images/creators/profile_pic3.png";
import { CREATE_PROFILE_HOME } from "@/utils/translationKeys";
import {
  AvatarImage,
  AvatarWrap,
  BioText,
  CoverFrame,
  CoverImage,
  HeroWrapper,
  InfoSection,
  NameText,
  UploadsText,
} from "./styles";

export default function CreateProfile3Hero() {
  const { t } = useTranslation();

  return (
    <HeroWrapper>
      <CoverFrame>
        <CoverImage
          src={coverImage}
          alt={t(CREATE_PROFILE_HOME.title)}
          fill
          sizes="100vw"
          priority
        />
      </CoverFrame>

      <InfoSection>
        <AvatarWrap>
          <AvatarImage
            src={avatarImage}
            alt={t(CREATE_PROFILE_HOME.title)}
            fill
            sizes="180px"
          />
        </AvatarWrap>

        <NameText>{t(CREATE_PROFILE_HOME.title)}</NameText>
        <UploadsText>
          {t(CREATE_PROFILE_HOME.uploads, { count: 76 })}
        </UploadsText>
        <BioText>{t(CREATE_PROFILE_HOME.description)}</BioText>
      </InfoSection>
    </HeroWrapper>
  );
}
