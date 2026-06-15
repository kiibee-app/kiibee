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
import AccessGate from "@/components/Feature/AccessGate";
import { useCollectionAccessGate } from "@/hooks/useCollectionAccessGate";
import { VARIANT_CONTENT } from "@/utils/Constants";

function SingleCollectionContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const section = getTutorialCollectionById(id);
  const { gateType } = useCollectionAccessGate();

  if (!section) {
    return (
      <MonoText $use="H5_Regular">{t("singleCollection.notFound")}</MonoText>
    );
  }

  return (
    <Section>
      <SingleCollectionHero
        title={section.title}
        primaryContentId={section.tutorials[0]?.id}
      />
      {gateType ? (
        <AccessGate
          type={gateType}
          variant={VARIANT_CONTENT}
          onSuccess={() => {
            if (id) {
              window.localStorage.setItem(
                `kiibee:gate:unlocked:collection:${id}`,
                "true",
              );
              window.location.reload();
            }
          }}
        />
      ) : (
        <CollectionContent
          videos={section.tutorials}
          maxWidth={section.gridMaxWidth}
        />
      )}
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
