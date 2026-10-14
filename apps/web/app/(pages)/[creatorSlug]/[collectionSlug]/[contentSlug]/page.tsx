"use client";

import { Suspense } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Main, Section } from "@/app/styles";
import { MonoText } from "@/components/UI/Monotext";
import GenericSpinner from "@/components/UI/GenericSpinner";
import LazySection from "@/components/UI/LazySection";
import { ErrorBoundary } from "react-error-boundary";
import PublishedContentDetail from "@/components/Feature/SingleContentPage/PublishedContentDetail";
import { CONTENT_TRANSLATION_KEYS } from "@/utils/contentApi";
import { ErrorFallbackContent } from "@/components/Feature/ExploreCreators/Creators/styles";
import DynamicProfileShell from "@/components/Feature/ProfileLayout/DynamicProfileShell";

function PublishedContentDetailFromRoute() {
  const params = useParams();
  const rawCreator = params?.creatorSlug;
  const rawCollection = params?.collectionSlug;
  const raw = params?.contentSlug;
  const creatorSlug = Array.isArray(rawCreator) ? rawCreator[0] : rawCreator;
  const collectionSlug = Array.isArray(rawCollection)
    ? rawCollection[0]
    : rawCollection;
  const contentKey = Array.isArray(raw) ? raw[0] : raw;

  if (!contentKey) {
    return null;
  }

  return (
    <PublishedContentDetail
      key={`${creatorSlug || ""}:${collectionSlug || ""}:${contentKey}`}
      contentKey={contentKey}
    />
  );
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
