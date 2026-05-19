"use client";

import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { latestReleaseVideos } from "@/utils/data";
import { PATHS } from "@/utils/path";
import { MonoText } from "@/components/UI/Monotext";
import { LeftIcon } from "@/assets/icons";
import {
  SectionHeader,
  SectionLabel,
  SectionLink,
} from "../../TutorialVideos/TutorialContent/styles";
import { Grid } from "../../TutorialVideos/TutorialsShowcase/styles";
import { Section } from "./styles";
import { useTranslation } from "react-i18next";

export default function LatestRelease() {
  const { t } = useTranslation();

  return (
    <Section>
      <SectionHeader>
        <SectionLabel>
          <MonoText $use="H4_Medium">
            {t("exploreCreatorsPage.latestRelease.title")}
          </MonoText>
        </SectionLabel>
        <SectionLink href={PATHS.EXPLORE_CREATORS}>
          <LeftIcon />
        </SectionLink>
      </SectionHeader>

      <Grid>
        {latestReleaseVideos.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </Grid>
    </Section>
  );
}
