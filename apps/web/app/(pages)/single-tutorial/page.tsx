"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "../../styles";
import { tutorialVideos } from "@/utils/data";
import { MonoText } from "@/components/UI/Monotext";
import SingleTutorial from "@/components/Feature/SingleTutorial";

function SingleTutorialContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const tutorial =
    tutorialVideos.find((item) => item.id === id) ?? tutorialVideos[0];

  if (!tutorial) {
    return (
      <Section>
        <MonoText $use="H5_Regular">{t("singleTutorial.notFound")}</MonoText>
      </Section>
    );
  }

  return (
    <Section>
      <SingleTutorial tutorial={tutorial} />
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
