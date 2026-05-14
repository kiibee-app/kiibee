"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { LeftIcon } from "@/assets/icons";
import { MonoText } from "@/components/UI/Monotext";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import {
  SectionHeader,
  SectionLabel,
  SectionLink,
} from "@/components/Feature/TutorialVideos/TutorialContent/styles";
import { Grid } from "@/components/Feature/TutorialVideos/TutorialsShowcase/styles";
import {
  Section,
  SectionTag,
} from "@/components/Feature/ExploreCreators/RecentlyAdded/styles";
import { VARIANT } from "@/utils/Constants";
import { tutorialVideos } from "@/utils/data";
import { FORMAT_TYPE, type TutorialVideo } from "@/utils/types";
import {
  ABOUT_VIDEO_OVERRIDES,
  CLOTHES_DATA,
} from "@/utils/dummyData/collectionData";
import { CREATE_PROFILE_ROUTES } from "@/utils/translationKeys";

export default function CreateProfile2AboutSection() {
  const { t } = useTranslation();

  const clothesVideos = useMemo<TutorialVideo[]>(
    () =>
      CLOTHES_DATA.map(
        (item, index) =>
          ({
            ...tutorialVideos[index],
            ...item,
          }) as unknown as TutorialVideo,
      ),
    [],
  );

  const aboutVideos = useMemo<TutorialVideo[]>(
    () =>
      ABOUT_VIDEO_OVERRIDES.map((item, index) => ({
        ...tutorialVideos[index],
        ...item,
        formatLabel: t("createProfileHome.latestUpload.video"),
        formatType: FORMAT_TYPE.VIDEO,
        buttons: [
          {
            label: t(CREATE_PROFILE_ROUTES.about.buyCollection),
            variant: VARIANT.SECONDARY,
          },
        ],
      })),
    [t],
  );

  return (
    <>
      <Section>
        <SectionHeader>
          <SectionLabel>
            <SectionTag>
              <MonoText $use="H4_Medium">
                {t(CREATE_PROFILE_ROUTES.about.sectionTitleClothes)}
              </MonoText>
            </SectionTag>
          </SectionLabel>
          <SectionLink href="/single-collection?id=clothes">
            <LeftIcon />
          </SectionLink>
        </SectionHeader>
        <Grid>
          {clothesVideos.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </Grid>
      </Section>
      <Section>
        <SectionHeader>
          <SectionLabel>
            <SectionTag>
              <MonoText $use="H4_Medium">
                {t(CREATE_PROFILE_ROUTES.about.sectionTitle)}
              </MonoText>
            </SectionTag>
          </SectionLabel>
          <SectionLink href="/single-collection?id=plants-and-animals">
            <LeftIcon />
          </SectionLink>
        </SectionHeader>
        <Grid>
          {aboutVideos.map((tutorial) => (
            <TutorialCard key={tutorial.id} tutorial={tutorial} />
          ))}
        </Grid>
      </Section>
    </>
  );
}
