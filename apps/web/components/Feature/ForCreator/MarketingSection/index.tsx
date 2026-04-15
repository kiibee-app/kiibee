"use client";

import { useTranslation } from "react-i18next";
import creatorsWorkingImage from "@/assets/images/we-help-you/marketing-tall.webp";
import instructorImage from "@/assets/images/we-help-you/marketing-top.webp";
import writingImage from "@/assets/images/we-help-you/marketing-bottom.webp";
import {
  Section,
  Container,
  TextColumn,
  Title,
  Description,
  ListIntro,
  BulletList,
  BulletItem,
  Summary,
  CtaButton,
  ImagesColumn,
  LeftImageWrap,
  RightImagesWrap,
  ImageCard,
  TallImage,
  CardImage,
  OverlayTall,
  OverlayCard,
  StatText,
  SupportText,
} from "./styles";

export default function MarketingSection() {
  const { t } = useTranslation();

  return (
    <Section>
      <Container>
        <TextColumn>
          <Title>{t("creators.marketing.title")}</Title>
          <Description>{t("creators.marketing.description")}</Description>

          <ListIntro>{t("creators.marketing.listIntro")}</ListIntro>
          <BulletList>
            {(
              t("creators.marketing.list", {
                returnObjects: true,
              }) as string[]
            ).map((item) => (
              <BulletItem key={item}>{item}</BulletItem>
            ))}
          </BulletList>

          <Summary>{t("creators.marketing.summary")}</Summary>
          <CtaButton type="button">{t("creators.marketing.cta")}</CtaButton>
        </TextColumn>

        <ImagesColumn>
          <LeftImageWrap>
            <ImageCard>
              <TallImage
                src={creatorsWorkingImage}
                alt={t("creators.marketing.images.creatorsAlt")}
                fill
              />
              <OverlayTall>
                <StatText>
                  {t("creators.marketing.stats.products.value")}
                </StatText>
                <SupportText>
                  {t("creators.marketing.stats.products.label")}
                </SupportText>
              </OverlayTall>
            </ImageCard>
          </LeftImageWrap>

          <RightImagesWrap>
            <ImageCard>
              <CardImage
                src={instructorImage}
                alt={t("creators.marketing.images.downloadsAlt")}
                fill
              />
              <OverlayCard>
                <SupportText>
                  {t("creators.marketing.stats.downloads.label")}
                </SupportText>
                <StatText>
                  {t("creators.marketing.stats.downloads.value")}
                </StatText>
              </OverlayCard>
            </ImageCard>

            <ImageCard>
              <CardImage
                src={writingImage}
                alt={t("creators.marketing.images.setupAlt")}
                fill
              />
              <OverlayCard>
                <SupportText>
                  {t("creators.marketing.stats.setup.label")}
                </SupportText>
                <StatText>{t("creators.marketing.stats.setup.value")}</StatText>
              </OverlayCard>
            </ImageCard>
          </RightImagesWrap>
        </ImagesColumn>
      </Container>
    </Section>
  );
}
