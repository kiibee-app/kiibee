"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import type { TutorialVideo } from "@/utils/types";
import BackButtonIcon from "@/assets/icons/BackButtonIcon";
import { ShareIcon } from "@/assets/icons/shareIcon";
import logo from "@/assets/images/logo.png";
import contentImage from "@/assets/images/single-tutorial/Content image.png";
import playIcon from "@/assets/images/single-tutorial/Play.svg";
import playCircleIcon from "@/assets/images/single-tutorial/solar_play-circle-bold.svg";
import CollectionItems from "./CollectionItems";
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
  HeroTagText,
  HeroVideoTag,
  HeroVideoText,
  InfoTag,
  InfoTagText,
  MainAction,
  MainActionText,
  MetaKey,
  MetaLabelText,
  MetaRow,
  MetaSection,
  MetaValueText,
  Preview,
  ShareButton,
  ShareText,
  TagRow,
  TopBar,
  TrailerButton,
  TrailerText,
  Wrapper,
} from "./styles";

type Props = {
  tutorial: TutorialVideo;
  relatedVideos?: TutorialVideo[];
  collectionId?: string;
};

export default function SingleTutorial({
  tutorial,
  relatedVideos = [],
  collectionId,
}: Props) {
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
            <ShareText>{t("common.share")}</ShareText>
          </ShareButton>
        </TopBar>

        <Hero>
          <Preview>
            <Image src={contentImage} alt={tutorial.title} fill priority />
          </Preview>

          <HeroTag>
            <HeroTagText>{tutorial.category}</HeroTagText>
          </HeroTag>

          <HeroVideoTag>
            <Image
              src={playCircleIcon}
              alt="Play circle"
              width={16}
              height={16}
              priority
            />
            <HeroVideoText>{tutorial.formatLabel}</HeroVideoText>
          </HeroVideoTag>

          <TrailerButton>
            <Image src={playIcon} alt="Play" width={15} height={15} priority />
            <TrailerText>{t("singleTutorial.playTrailer")}</TrailerText>
          </TrailerButton>
        </Hero>

        <ContentShell>
          <BrandRow>
            <BrandLogo>
              <Image src={logo} alt="Kiibee" fill priority />
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
              <InfoTagText>{t("singleTutorial.tags.guide")}</InfoTagText>
            </InfoTag>
            <InfoTag>
              <InfoTagText>{t("singleTutorial.tags.tutorials")}</InfoTagText>
            </InfoTag>
          </TagRow>

          <MainAction>
            <MainActionText>{t("singleTutorial.seeContent")}</MainActionText>
          </MainAction>

          <MetaSection>
            <MetaRow>
              <MetaKey>
                <MetaLabelText>
                  {t("singleTutorial.meta.publishedLabel")}
                </MetaLabelText>
              </MetaKey>
              <MetaValueText>{tutorial.published}</MetaValueText>
            </MetaRow>

            <MetaRow>
              <MetaKey>
                <MetaLabelText>
                  {t("singleTutorial.meta.publishedByLabel")}
                </MetaLabelText>
              </MetaKey>
              <MetaValueText>{tutorial.creator}</MetaValueText>
            </MetaRow>

            <MetaRow>
              <MetaKey>
                <MetaLabelText>
                  {t("singleTutorial.meta.durationLabel")}
                </MetaLabelText>
              </MetaKey>
              <MetaValueText>
                {t("singleTutorial.meta.durationValue")}
              </MetaValueText>
            </MetaRow>
          </MetaSection>
        </ContentShell>
      </Card>

      <CollectionItems videos={relatedVideos} collectionId={collectionId} />
    </Wrapper>
  );
}
