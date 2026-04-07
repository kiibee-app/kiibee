import LeftIcon from "@/assets/images/icons/left";
import {
  Content,
  HeroBlock,
  HeroSubtitle,
  HeroTitle,
  SectionHeader,
  SectionLabel,
  SectionLink,
  SectionTag,
} from "./styles";
import TutorialsShowcase from "../TutorialsShowcase";
import { useTranslation } from "react-i18next";

export default function TutorialContent() {
  const { t } = useTranslation();

  return (
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
  );
}
