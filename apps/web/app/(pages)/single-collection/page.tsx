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
import { usePublicCollectionContent } from "@/hooks/usePublicCollectionContent";
import AccessGate from "@/components/Feature/AccessGate";
import { useCollectionAccessGate } from "@/hooks/useCollectionAccessGate";
import { VARIANT_CONTENT } from "@/utils/Constants";

function SingleCollectionContent() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const staticSection = getTutorialCollectionById(id);
  const { gateType, isLoading: isGateLoading } = useCollectionAccessGate(
    !staticSection ? id : null,
  );

  const {
    data: dynamicSection,
    isLoading: isDynamicLoading,
    isError,
  } = usePublicCollectionContent(
    !staticSection && !gateType && !isGateLoading ? id : null,
  );

  if (staticSection) {
    return (
      <Section>
        <SingleCollectionHero
          title={staticSection.title}
          primaryContentId={staticSection.tutorials[0]?.id}
        />
        <CollectionContent
          videos={staticSection.tutorials}
          maxWidth={staticSection.gridMaxWidth}
        />
      </Section>
    );
  }

  if (isGateLoading || isDynamicLoading) {
    return (
      <Section>
        <MonoText $use="H5_Regular">{t("common.loading")}</MonoText>
      </Section>
    );
  }

  if (gateType) {
    return (
      <Section>
        <SingleCollectionHero
          title={dynamicSection?.name ?? ""}
          primaryContentId={dynamicSection?.videos?.[0]?.id}
        />
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
      </Section>
    );
  }

  if (isError || !dynamicSection) {
    return (
      <Section>
        <MonoText $use="H5_Regular">{t("singleCollection.notFound")}</MonoText>
      </Section>
    );
  }

  return (
    <Section>
      <SingleCollectionHero
        title={dynamicSection.name}
        primaryContentId={dynamicSection.videos[0]?.id}
      />
      <CollectionContent videos={dynamicSection.videos} />
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
