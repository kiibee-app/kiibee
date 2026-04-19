"use client";

import LeftIcon from "@/assets/images/icons/left";
import {
  Content,
  HeroBlock,
  HeroSubtitle,
  SectionHeader,
  SectionLabel,
  SectionLink,
  SectionTag,
} from "./styles";
import TutorialsShowcase from "../TutorialsShowcase";
import { useTranslation } from "react-i18next";
import { tutorialVideoSections, tutorialVideos } from "@/utils/data";
import type { TutorialVideo } from "@/utils/types";
import { MonoText } from "@/components/UI/Monotext";
import { useRouter } from "next/navigation";

type SectionWithTutorials = (typeof tutorialVideoSections)[number] & {
  tutorials: TutorialVideo[];
};

export default function TutorialContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const sections: SectionWithTutorials[] = tutorialVideoSections.map(
    (section) => ({
      ...section,
      tutorials: section.videoIds
        .map((videoId) =>
          tutorialVideos.find((tutorial) => tutorial.id === videoId),
        )
        .filter((tutorial): tutorial is TutorialVideo => Boolean(tutorial)),
    }),
  );
  const handleClick = (id: string) => {
    router.push(`/single-collection?id=${id}`);
  };
  return (
    <Content>
      <HeroBlock>
        <MonoText $use="Heading1">{t("tutorialVideos.heroTitle")}</MonoText>
        <HeroSubtitle>
          <MonoText $use="H4_Medium">
            {t("tutorialVideos.heroSubtitle")}
          </MonoText>
        </HeroSubtitle>
      </HeroBlock>
      {sections.map((section) => (
        <section key={section.id}>
          <SectionHeader>
            <SectionLabel>
              <SectionTag>
                <MonoText $use="H4_Medium">{section.title}</MonoText>
              </SectionTag>
              <LeftIcon />
            </SectionLabel>
            <SectionLink onClick={() => handleClick(section.id)}>
              <LeftIcon />
            </SectionLink>
          </SectionHeader>
          <TutorialsShowcase
            videos={section.tutorials}
            maxWidth={section.gridMaxWidth}
          />
        </section>
      ))}
    </Content>
  );
}
