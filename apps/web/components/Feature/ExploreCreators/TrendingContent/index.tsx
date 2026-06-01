"use client";

import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { LeftIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import { useTrendingContent } from "@/hooks/feed/useTrendingContent";
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
  const { tutorials, isLoading } = useTrendingContent();

  if (!isLoading && tutorials.length === 0) {
    return null;
  }

  return (
    <Section>
      <SectionHeader>
        <SectionLabel>
          <SectionTag>
            <MonoText $use="H4_Medium">
              {t("creators.trendingContent")}
            </MonoText>
          </SectionTag>
        </SectionLabel>
        <SectionLink href="/tutorial-videos">
          <LeftIcon />
        </SectionLink>
      </SectionHeader>
      <Grid $columnMax="300px">
        {tutorials.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </Grid>
    </Section>
  );
}
