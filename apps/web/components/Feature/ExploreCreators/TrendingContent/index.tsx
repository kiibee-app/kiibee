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
import { useRouter } from "next/navigation";
import { PATHS } from "@/utils/path";

export default function TrendingContent() {
  const { t } = useTranslation();
  const router = useRouter();

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
        <SectionLink onClick={() => router.push(PATHS.TUTORIAL_VIDEOS)}>
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
