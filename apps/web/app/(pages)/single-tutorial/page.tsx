"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "../../styles";
import { tutorialVideoSections, tutorialVideos } from "@/utils/data";
import { MonoText } from "@/components/UI/Monotext";
import SingleTutorial from "@/components/Feature/SingleTutorial";
import { TutorialVideo } from "@/utils/types";

function SingleTutorialContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const tutorial =
    tutorialVideos.find((item) => item.id === id) ?? tutorialVideos[0];
  const collection = tutorialVideoSections.find((section) =>
    section.videoIds.includes(tutorial?.id ?? ""),
  );

  const relatedVideos = (collection?.videoIds ?? [])
    .map((videoId) => tutorialVideos.find((video) => video.id === videoId))
    .filter((video): video is TutorialVideo => Boolean(video))
    .slice(0, 4);

  if (!tutorial) {
    return (
      <Section>
        <MonoText $use="H5_Regular">{t("singleTutorial.notFound")}</MonoText>
      </Section>
    );
  }

  return (
    <Section>
      <SingleTutorial
        tutorial={tutorial}
        relatedVideos={relatedVideos}
        collectionId={collection?.id}
      />
    </Section>
  );
}

export default function SingleTutorialPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Suspense>
          <SingleTutorialContent />
        </Suspense>
      </Main>
      <Footer />
    </PageContainer>
  );
}
