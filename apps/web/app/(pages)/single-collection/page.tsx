"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { PageContainer, Main, Section } from "../../styles";
import SingleCollectionHero from "@/components/Feature/SingleCollectionHero";

import GenericSpinner from "@/components/UI/GenericSpinner";
import Image from "@/components/UI/SafeImage";
import { useTranslation } from "react-i18next";
import CollectionContent from "@/components/Feature/SingleCollectionHero/CollectionContent";
import { getTutorialCollectionById } from "@/utils/tutorialCollections";
import { usePublicCollectionContent } from "@/hooks/usePublicCollectionContent";
import AccessGate from "@/components/Feature/AccessGate";
import { useCollectionAccessGate } from "@/hooks/useCollectionAccessGate";
import { VARIANT_CONTENT } from "@/utils/Constants";
import {
  HeroWrapper,
  TopBar,
  BackButtonWrapper,
} from "@/components/Feature/SingleCollectionHero/styles";
import GenericEmptyState from "@/components/UI/GenericEmptyState";
import { BackButtonIcon } from "@/assets/icons";

import logo from "@/assets/icons/Kiibee_logo_mark_black.svg";

function SingleCollectionContent() {
  const { t } = useTranslation();
  const router = useRouter();
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
    return <GenericSpinner isOverlay size={48} label={t("common.loading")} />;
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
      <HeroWrapper>
        <TopBar>
          <BackButtonWrapper onClick={() => router.back()}>
            <BackButtonIcon />
          </BackButtonWrapper>
        </TopBar>
        <GenericEmptyState
          title={t("singleCollection.noContent")}
          icon={
            <Image
              src={logo}
              alt="Kiibee Logo"
              width={30}
              height={30}
              priority
            />
          }
        />
      </HeroWrapper>
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
