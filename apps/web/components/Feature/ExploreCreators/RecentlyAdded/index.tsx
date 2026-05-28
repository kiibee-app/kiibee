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
import { recentlyAddedVideos } from "@/utils/data";
import { useRouter } from "next/navigation";
import { PATHS } from "@/utils/path";

export default function RecentlyAdded() {
  const { t } = useTranslation();
  const router = useRouter();

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
        <SectionLink onClick={() => router.push(PATHS.TUTORIAL_VIDEOS)}>
          <LeftIcon />
        </SectionLink>
      </SectionHeader>
      <Grid>
        {recentlyAddedVideos.map((tutorial) => (
          <TutorialCard key={tutorial.id} tutorial={tutorial} />
        ))}
      </Grid>
    </Section>
  );
}
