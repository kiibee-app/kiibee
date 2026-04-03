"use client";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/Layout/Navbar";
import TutorialsShowcase from "./components/TutorialsShowcase";
import { PageContainer } from "../styles";
import {
  Content,
  HeroBlock,
  HeroTitle,
  HeroSubtitle,
  SectionHeader,
  SectionLabel,
  SectionTag,
  SectionLink,
} from "./styles";

export default function TutorialVideosPage() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <NavBar />
      <Content>
        <HeroBlock>
          <HeroTitle>{t("tutorialVideos.heroTitle")}</HeroTitle>
          <HeroSubtitle>{t("tutorialVideos.heroSubtitle")}</HeroSubtitle>
        </HeroBlock>
        <SectionHeader>
          <SectionLabel>
            <SectionTag>{t("tutorialVideos.sectionTag")}</SectionTag>
            <span>{t("tutorialVideos.sectionLabel")}</span>
          </SectionLabel>
          <SectionLink href="#">
            {t("tutorialVideos.sectionLink")}
            <span aria-hidden="true">→</span>
          </SectionLink>
        </SectionHeader>
        <TutorialsShowcase />
      </Content>
    </PageContainer>
  );
}
