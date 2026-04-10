"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main, Section } from "../../styles";
import { tutorialVideoSections } from "@/utils/data";
import SingleCollectionHero from "@/components/Feature/SingleCollectionHero";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";

function SingleCollectionContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const section = tutorialVideoSections.find((s) => s.id === id);

  if (!section) {
    return (
      <MonoText $use="H5_Regular">{t("singleCollection.notFound")}</MonoText>
    );
  }

  return (
    <Section>
      <SingleCollectionHero title={section.title} />
    </Section>
  );
}

export default function SingleCollectionPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <Suspense>
          <SingleCollectionContent />
        </Suspense>
      </Main>
      <Footer />
    </PageContainer>
  );
}
