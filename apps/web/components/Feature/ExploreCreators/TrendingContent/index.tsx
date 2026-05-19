"use client";

import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { LeftIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import { trendingContentVideos } from "@/utils/data";
import { Section, SectionTag } from "../RecentlyAdded/styles";
import {
  SectionHeader,
  SectionLabel,
  SectionLink,
} from "../../TutorialVideos/TutorialContent/styles";
import { Grid } from "../../TutorialVideos/TutorialsShowcase/styles";
import { useTranslation } from "react-i18next";

export default function TrendingContent() {
  const { t } = useTranslation();

  return (
    <Section>
      <SectionHeader>
        <SectionLabel>
          <SectionTag>
            <MonoText $use="H4_Medium">
              {t("exploreCreatorsPage.trendingContent.title")}
            </MonoText>
          </SectionTag>
        </SectionLabel>
        <SectionLink href="/tutorial-videos">
          <LeftIcon />
        </SectionLink>
      </SectionHeader>
      <Grid>
        {trendingContentVideos.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </Grid>
    </Section>
  );
}
