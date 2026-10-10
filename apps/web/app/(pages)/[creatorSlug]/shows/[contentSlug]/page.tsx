"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Main, Section } from "../../../../styles";
import { MonoText } from "@/components/UI/Monotext";
import GenericSpinner from "@/components/UI/GenericSpinner";
import LazySection from "@/components/UI/LazySection";
import { ErrorBoundary } from "react-error-boundary";
import PublishedContentDetail from "@/components/Feature/SingleContentPage/PublishedContentDetail";
import { CONTENT_TRANSLATION_KEYS } from "@/utils/contentApi";
import { ErrorFallbackContent } from "@/components/Feature/ExploreCreators/Creators/styles";

function PublishedContentDetailFromRoute() {
  const params = useParams();
  const raw = params?.contentSlug;
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

import DynamicProfileShell from "@/components/Feature/ProfileLayout/DynamicProfileShell";

export default function PublishedContentPage() {
  return (
    <DynamicProfileShell hideHero={true}>
      <Main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<PublishedContentLoading />}>
            <LazySection minHeight={480} rootMargin="0px">
              <PublishedContentDetailFromRoute />
            </LazySection>
          </Suspense>
        </ErrorBoundary>
      </Main>
    </DynamicProfileShell>
  );
}
