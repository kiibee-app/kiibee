"use client";

import { useTranslation } from "react-i18next";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import { Section, SectionTag } from "./styles";
import {
  SectionHeader,
  SectionLabel,
  SectionLink,
} from "../../TutorialVideos/TutorialContent/styles";
import { MonoText } from "@/components/UI/Monotext";
import { LeftIcon } from "@/assets/icons";
import { Grid } from "../../TutorialVideos/TutorialsShowcase/styles";
import { useRecentContent } from "@/hooks/feed/useRecentContent";
import { useRouter } from "next/navigation";
import { recentlyAddedVideos } from "@/utils/data";
import { PATHS } from "@/utils/path";

export default function RecentlyAdded() {
  const { t } = useTranslation();
  const router = useRouter();
  const { tutorials, isLoading } = useRecentContent();

  if (!isLoading && tutorials.length === 0) {
    return null;
  }

  return (
    <Section>
      <SectionHeader>
        <SectionLabel>
          <SectionTag>
            <MonoText $use="H4_Medium">
              {t("creators.recentlyAdded.tag")}
            </MonoText>
          </SectionTag>
        </SectionLabel>
        <SectionLink href={PATHS.TUTORIAL_VIDEOS}>
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
