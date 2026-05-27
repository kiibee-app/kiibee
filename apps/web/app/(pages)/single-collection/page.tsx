"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main, Section } from "../../styles";
import SingleCollectionHero from "@/components/Feature/SingleCollectionHero";
import { MonoText } from "@/components/UI/Monotext";
import { useTranslation } from "react-i18next";
import CollectionContent from "@/components/Feature/SingleCollectionHero/CollectionContent";
import { getTutorialCollectionById } from "@/utils/tutorialCollections";

function SingleCollectionContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const section = getTutorialCollectionById(id);

  if (!section) {
    return (
      <MonoText $use="H5_Regular">{t("singleCollection.notFound")}</MonoText>
    );
  }

  return (
    <Section>
      <SingleCollectionHero title={section.title} />
      <CollectionContent
        videos={section.tutorials}
        maxWidth={section.gridMaxWidth}
      />
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
