"use client";

import { useEffect } from "react";
import { LeftIcon } from "@/assets/icons";
import {
  Content,
  HeroBlock,
  HeroSubtitle,
  SectionHeader,
  SectionLabel,
  SectionLink,
  SectionTag,
  TutorialSection,
} from "./styles";
import TutorialsShowcase from "../TutorialsShowcase";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import { useRouter } from "next/navigation";
import { tutorialCollections } from "@/utils/tutorialCollections";
import { SCROLL_TO_START_OPTIONS } from "@/utils/Constants";

function scrollToSectionHash() {
  const id = window.location.hash.slice(1);
  if (!id) return;
  document.getElementById(id)?.scrollIntoView(SCROLL_TO_START_OPTIONS);
}

export default function TutorialContent() {
  const { t } = useTranslation();
  const router = useRouter();
  const openCollection = (id: string) =>
    router.push(`/single-collection?id=${id}`);

  useEffect(() => {
    scrollToSectionHash();
    const retry = window.setTimeout(scrollToSectionHash, 100);
    window.addEventListener("hashchange", scrollToSectionHash);
    return () => {
      window.clearTimeout(retry);
      window.removeEventListener("hashchange", scrollToSectionHash);
    };
  }, []);

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
        <TutorialSection key={section.id} id={section.id}>
          <SectionHeader>
            <SectionLabel onClick={() => openCollection(section.id)}>
              <SectionTag>
                <MonoText $use="H4_Medium">{section.title}</MonoText>
              </SectionTag>
              <LeftIcon />
            </SectionLabel>
            <SectionLink href={`/single-collection?id=${section.id}`}>
              <LeftIcon />
            </SectionLink>
          </SectionHeader>
          <TutorialsShowcase
            videos={section.tutorials}
            maxWidth={section.gridMaxWidth}
          />
        </TutorialSection>
      ))}
    </Content>
  );
}
