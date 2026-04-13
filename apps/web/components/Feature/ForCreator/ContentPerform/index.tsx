"use client";

import { useTranslation } from "react-i18next";
import creatorDashboardImage from "@/assets/images/creators/creator_dashboard.png";
import {
  Section,
  ContentWrapper,
  ImageColumn,
  ImageFrame,
  DashboardImage,
  TextColumn,
  Title,
  Intro,
  ListIntro,
  PointsList,
  PointItem,
  Outro,
} from "./style";

export default function ContentPerform() {
  const { t } = useTranslation();
  const points = t("creators.contentPerform.points", {
    returnObjects: true,
  }) as string[];

  return (
    <Section>
      <ContentWrapper>
        <ImageColumn>
          <ImageFrame>
            <DashboardImage
              src={creatorDashboardImage.src}
              alt={t("creators.contentPerform.imageAlt")}
            />
          </ImageFrame>
        </ImageColumn>

        <TextColumn>
          <Title as="h2">{t("creators.contentPerform.title")}</Title>
          <Intro as="p">{t("creators.contentPerform.intro")}</Intro>
          <ListIntro as="p">{t("creators.contentPerform.listIntro")}</ListIntro>

          <PointsList>
            {points.map((point) => (
              <PointItem key={point}>{point}</PointItem>
            ))}
          </PointsList>

          <Outro as="p">{t("creators.contentPerform.outro")}</Outro>
        </TextColumn>
      </ContentWrapper>
    </Section>
  );
}
