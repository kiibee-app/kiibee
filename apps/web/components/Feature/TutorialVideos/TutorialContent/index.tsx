"use client";

import { LeftIcon } from "@/assets/icons";
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
import { MonoText } from "@/components/UI/Monotext";
import { useRouter } from "next/navigation";
import { tutorialCollections } from "@/utils/tutorialCollections";

export default function TutorialContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const openCollection = (id: string) =>
    router.push(`/single-collection?id=${id}`);

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
      {tutorialCollections.map((section) => (
        <section key={section.id}>
          <SectionHeader>
            <SectionLabel onClick={() => openCollection(section.id)}>
              <SectionTag>
                <MonoText $use="H4_Medium">{section.title}</MonoText>
              </SectionTag>
              <LeftIcon />
            </SectionLabel>
            <SectionLink onClick={() => openCollection(section.id)}>
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
