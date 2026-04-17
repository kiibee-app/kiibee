"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import type { TutorialVideo } from "@/utils/types";
import BackButtonIcon from "@/assets/icons/BackButtonIcon";
import { ShareIcon } from "@/assets/icons/shareIcon";
import logo from "@/assets/images/logo.png";
import contentImage from "@/assets/images/single-tutorial/Content image.png";
import playIcon from "@/assets/images/single-tutorial/Play.svg";
import playCircleIcon from "@/assets/images/single-tutorial/solar_play-circle-bold.svg";
import COLORS from "@repo/ui/colors";
import {
  BackButton,
  BrandLogo,
  BrandRow,
  BrandText,
  Card,
  ContentShell,
  DescriptionText,
  BodyTextWrap,
  HeadingBlock,
  MainTitle,
  Hero,
  HeroTag,
  HeroVideoTag,
  InfoTag,
  MainAction,
  MetaKey,
  MetaRow,
  MetaSection,
  Preview,
  ShareButton,
  TagRow,
  TopBar,
  TrailerButton,
  Wrapper,
} from "./styles";

type Props = {
  tutorial: TutorialVideo;
};

export default function SingleTutorial({ tutorial }: Props) {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Card>
        <TopBar>
          <BackButton onClick={() => router.back()} aria-label="Go back">
            <BackButtonIcon />
          </BackButton>

          <ShareButton>
            <ShareIcon width={16} height={16} />
            <MonoText $use="Body_Medium">{t("common.share")}</MonoText>
          </ShareButton>
        </TopBar>

        <Hero>
          <Preview>
            <Image src={contentImage} alt={tutorial.title} fill priority />
          </Preview>

          <HeroTag>
            <MonoText $use="Body_Bold">{tutorial.category}</MonoText>
          </HeroTag>

          <HeroVideoTag>
            <Image
              src={playCircleIcon}
              alt="Play circle"
              width={16}
              height={16}
            />
            <MonoText $use="Body_Bold">{tutorial.formatLabel}</MonoText>
          </HeroVideoTag>

          <TrailerButton>
            <Image src={playIcon} alt="Play" width={15} height={15} />
            <MonoText $use="Body_Medium" color={COLORS.neutral.WHITE}>
              {t("singleTutorial.playTrailer")}
            </MonoText>
          </TrailerButton>
        </Hero>

        <ContentShell>
          <BrandRow>
            <BrandLogo>
              <Image src={logo} alt="Kiibee" fill />
            </BrandLogo>
            <BrandText>Kiibee</BrandText>
          </BrandRow>

          <HeadingBlock>
            <MainTitle>{t("singleTutorial.title")}</MainTitle>

            <BodyTextWrap>
              <DescriptionText>
                {t("singleTutorial.descriptionPrimary")}
              </DescriptionText>
              <DescriptionText>
                {t("singleTutorial.descriptionSecondary")}
              </DescriptionText>
            </BodyTextWrap>
          </HeadingBlock>

          <TagRow>
            <InfoTag>
              <MonoText $use="Body_Medium">
                {t("singleTutorial.tags.guide")}
              </MonoText>
            </InfoTag>
            <InfoTag>
              <MonoText $use="Body_Medium">
                {t("singleTutorial.tags.tutorials")}
              </MonoText>
            </InfoTag>
          </TagRow>

          <MainAction>
            <MonoText $use="Body_Bold" color={COLORS.neutral.WHITE}>
              {t("singleTutorial.seeContent")}
            </MonoText>
          </MainAction>

          <MetaSection>
            <MetaRow>
              <MetaKey>
                <MonoText $use="Body_Regular" color={COLORS.neutral.GRAY_700}>
                  {t("singleTutorial.meta.publishedLabel")}
                </MonoText>
              </MetaKey>
              <MonoText $use="Body_Bold">{tutorial.published}</MonoText>
            </MetaRow>

            <MetaRow>
              <MetaKey>
                <MonoText $use="Body_Regular" color={COLORS.neutral.GRAY_700}>
                  {t("singleTutorial.meta.publishedByLabel")}
                </MonoText>
              </MetaKey>
              <MonoText $use="Body_Bold">{tutorial.creator}</MonoText>
            </MetaRow>

            <MetaRow>
              <MetaKey>
                <MonoText $use="Body_Regular" color={COLORS.neutral.GRAY_700}>
                  {t("singleTutorial.meta.durationLabel")}
                </MonoText>
              </MetaKey>
              <MonoText $use="Body_Bold">
                {t("singleTutorial.meta.durationValue")}
              </MonoText>
            </MetaRow>
          </MetaSection>
        </ContentShell>
      </Card>
    </Wrapper>
  );
}
