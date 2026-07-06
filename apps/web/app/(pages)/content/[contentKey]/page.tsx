"use client";

import { Suspense, useState } from "react";
import { useParams } from "next/navigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "../../../styles";
import { MonoText } from "@/components/UI/Monotext";
import GenericSpinner from "@/components/UI/GenericSpinner";
import LazySection from "@/components/UI/LazySection";
import { ErrorBoundary } from "react-error-boundary";
import { GenericModal } from "@/components/UI/Modals";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { MODAL_ALIGN } from "@/utils/ui";
import SingleContentPage from "@/components/Feature/SingleContentPage";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { readStoredLoginUser } from "@/hooks/auth/useLogin";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { resolveContentViewerId } from "@/utils/path";

import {
  CONTENT_TRANSLATION_KEYS,
  type ContentDetailResponse,
  getContentDetail,
  getSingleContentProps,
} from "@/utils/contentApi";
import SingleTutorial from "@/components/Feature/SingleTutorial";
import SingleDiscoverContent from "@/components/Feature/SingleDiscoverContent";
import { useTutorialVideoLookup } from "@/hooks/useTutorialVideos";
import { usePublicRelatedCollectionContent } from "@/hooks/usePublicRelatedCollectionContent";
import { useCreatorPublicProfile } from "@/hooks/creators/useExploreCreators";
import CollectionItems from "@/components/Feature/SingleTutorial/CollectionItems";
import {
  resolvePublishedContentByKey,
  CONTENT_KIND,
} from "@/utils/resolvePublishedContentByKey";
import {
  PAYMENT_QUERY_KEY,
  STATUS_TONE,
  STRING_EMPTY,
  VARIANT_CONTENT,
} from "@/utils/Constants";
import { ErrorFallbackContent } from "@/components/Feature/ExploreCreators/Creators/styles";
import AccessGate from "@/components/Feature/AccessGate";
import { useContentAccessGate } from "@/hooks/useContentAccessGate";
import { resolvePublicMediaUrl } from "@/utils/media";

function PublishedContentDetail() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const user = useStoredLoginUser();
  const resolvedUserId = user?.id ?? readStoredLoginUser()?.id;
  const raw = params?.contentKey;
  const contentKey = Array.isArray(raw) ? raw[0] : raw;
  const paymentStatus = searchParams?.get(PAYMENT_QUERY_KEY);
  const isPaymentSuccess = paymentStatus === STATUS_TONE.SUCCESS;
  const [dismissedPaymentSuccess, setDismissedPaymentSuccess] = useState(false);
  const normalizedContentKey = contentKey?.replaceAll(":", "-");
  const viewerId = resolveContentViewerId(resolvedUserId);
  const contentViewRoute = normalizedContentKey
    ? API.content.view(normalizedContentKey, viewerId)
    : API.content.create;
  const discoverFallback = resolvePublishedContentByKey(normalizedContentKey);
  const {
    tutorial,
    relatedVideos,
    collection: tutorialCollection,
    isLoading: isTutorialLoading,
  } = useTutorialVideoLookup(normalizedContentKey);
  const { data, isLoading, isError } = useGetAPI<ContentDetailResponse>(
    contentViewRoute,
    undefined,
    {
      enabled:
        Boolean(normalizedContentKey) &&
        !discoverFallback &&
        !tutorial &&
        !isTutorialLoading,
      refetchInterval: isPaymentSuccess ? 1500 : false,
      placeholderData: (previousData) => previousData,
    },
  );
  const content = getContentDetail(data);
  const { creator: publicCreator } = useCreatorPublicProfile(
    content?.creatorId ?? null,
  );
  const relatedCollectionQuery = usePublicRelatedCollectionContent(
    normalizedContentKey,
    {
      enabled: Boolean(normalizedContentKey) && !discoverFallback && !tutorial,
    },
  );
  const {
    gateType: activeGateType,
    isLoading: gateLoading,
    handleSuccess: handleGateSuccess,
  } = useContentAccessGate(content, relatedCollectionQuery.data?.collectionId);

  const hasUnlockedContent = Boolean(content?.accessInfo);
  const showPaymentSuccessModal =
    isPaymentSuccess && hasUnlockedContent && !dismissedPaymentSuccess;

  const handlePaymentSuccessClose = () => {
    setDismissedPaymentSuccess(true);
    const nextParams = new URLSearchParams(
      searchParams?.toString() || STRING_EMPTY,
    );
    nextParams.delete(PAYMENT_QUERY_KEY);
    const next = nextParams.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const paymentSuccessModal = (
    <GenericModal
      visible={showPaymentSuccessModal}
      icon={<SuccessModalIcon />}
      iconMargin="0 auto 8px"
      textAlign={MODAL_ALIGN.CENTER}
      title="Payment successful!"
      message="Your content is now unlocked. You can start enjoying it right away."
      confirmLabel="Start watching"
      onClose={handlePaymentSuccessClose}
      onConfirm={handlePaymentSuccessClose}
      size="sm"
      showCloseButton={false}
    />
  );

  if (
    (isTutorialLoading && !discoverFallback) ||
    (isLoading && !data && !discoverFallback && !tutorial) ||
    gateLoading
  ) {
    return (
      <GenericSpinner
        isOverlay
        size={48}
        label={t(CONTENT_TRANSLATION_KEYS.loading)}
      />
    );
  }

  if (tutorial) {
    return (
      <Section>
        <SingleTutorial
          tutorial={tutorial}
          relatedVideos={relatedVideos}
          collectionId={tutorialCollection?.id}
        />
      </Section>
    );
  }

  if (isError || !content) {
    if (discoverFallback?.kind === CONTENT_KIND.DISCOVER) {
      return (
        <Section>
          <SingleDiscoverContent item={discoverFallback.item} />
        </Section>
      );
    }

    return (
      <Section>
        <MonoText $use="H5_Regular">
          {t(CONTENT_TRANSLATION_KEYS.notFound)}
        </MonoText>
      </Section>
    );
  }

  return (
    <>
      {paymentSuccessModal}
      <Section>
        <SingleContentPage
          {...getSingleContentProps(content, t, {
            inCollection: Boolean(relatedCollectionQuery.data?.collectionId),
            viewerId: resolvedUserId,
          })}
          content={content}
          creator={
            publicCreator
              ? {
                  id: publicCreator.id,
                  name: publicCreator.name,
                  avatar:
                    resolvePublicMediaUrl(
                      publicCreator.profileImageUrl ??
                        publicCreator.coverImageUrl,
                    ) ?? undefined,
                  avatarAlt: publicCreator.name,
                }
              : undefined
          }
          accessGate={
            activeGateType ? (
              <AccessGate
                type={activeGateType}
                variant={VARIANT_CONTENT}
                onSuccess={handleGateSuccess}
              />
            ) : undefined
          }
        >
          {relatedCollectionQuery.data?.videos?.length ? (
            <CollectionItems
              videos={relatedCollectionQuery.data.videos}
              collectionId={relatedCollectionQuery.data.collectionId}
            />
          ) : null}
        </SingleContentPage>
      </Section>
    </>
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
    <PageContainer>
      <NavBar />
      <Main>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Suspense fallback={<PublishedContentLoading />}>
            <LazySection minHeight={480} rootMargin="0px">
              <PublishedContentDetail />
            </LazySection>
          </Suspense>
        </ErrorBoundary>
      </Main>
      <Footer />
    </PageContainer>
  );
}
