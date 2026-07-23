"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import ProfileFooter from "@/components/Feature/ProfileLayout/shared/Footer";
import { Main, PageContainer, Section } from "../../../styles";
import { MonoText } from "@/components/UI/Monotext";
import GenericSpinner from "@/components/UI/GenericSpinner";
import LazySection from "@/components/UI/LazySection";
import { ErrorBoundary } from "react-error-boundary";
import PublishedContentDetail from "@/components/Feature/SingleContentPage/PublishedContentDetail";
import { CONTENT_TRANSLATION_KEYS } from "@/utils/contentApi";
import { ErrorFallbackContent } from "@/components/Feature/ExploreCreators/Creators/styles";

function PublishedContentDetailFromRoute() {
  const params = useParams();
  const raw = params?.contentKey;
  const contentKey = Array.isArray(raw) ? raw[0] : raw;

  if (!contentKey) {
    return null;
  }

  return <PublishedContentDetail contentKey={contentKey} />;
}

function PublishedContentLoading() {
  const { t } = useTranslation();

  return (
    <GenericSpinner
      isOverlay
      size={48}
      label={t(CONTENT_TRANSLATION_KEYS.loading)}
    />
  );
}

function ErrorFallback() {
  const { t } = useTranslation();

  return (
    <Section>
      <ErrorFallbackContent>
        <MonoText $use="H5_Regular">
          {t(CONTENT_TRANSLATION_KEYS.loading)}
        </MonoText>
      </ErrorFallbackContent>
    </Section>
  );
}

export default function PublishedContentPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<PublishedContentLoading />}>
            <LazySection minHeight={480} rootMargin="0px">
              <PublishedContentDetailFromRoute />
            </LazySection>
          </Suspense>
        </ErrorBoundary>
      </Main>
      <ProfileFooter />
      <Footer />
    </PageContainer>
  );
}
