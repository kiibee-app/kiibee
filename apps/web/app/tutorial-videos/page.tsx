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
import LeftIcon from "@/assets/images/icons/left";

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
            <LeftIcon />
          </SectionLabel>
          <SectionLink>
            <LeftIcon />
          </SectionLink>
        </SectionHeader>
        <TutorialsShowcase />
      </Content>
    </PageContainer>
  );
}
