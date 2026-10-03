"use client";

import { useState, useEffect } from "react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useTranslation } from "react-i18next";
import { MonoText } from "@/components/UI/Monotext";
import GenericSpinner from "@/components/UI/GenericSpinner";
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
import AccessGate from "@/components/Feature/AccessGate";
import { useContentAccessGate } from "@/hooks/useContentAccessGate";
import { resolvePublicMediaUrl } from "@/utils/media";
import { Section } from "@/app/styles";
import { pathPublishedContent } from "@/utils/path";

type Props = {
  contentKey: string;
  onBack?: () => void;
  showBack?: boolean;
  showShare?: boolean;
  embedded?: boolean;
};

export default function PublishedContentDetail({
  contentKey,
  onBack,
  showBack = true,
  showShare = true,
  embedded = false,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const user = useStoredLoginUser();
  const resolvedUserId = user?.id ?? readStoredLoginUser()?.id;
  const paymentStatus = searchParams?.get(PAYMENT_QUERY_KEY);
  const isPaymentSuccess = paymentStatus === STATUS_TONE.SUCCESS;
  const [dismissedPaymentSuccess, setDismissedPaymentSuccess] = useState(false);
  const normalizedContentKey = contentKey.replaceAll(":", "-");
  const rawCreatorSlug = params?.creatorSlug;
  const creatorSlug = Array.isArray(rawCreatorSlug)
    ? rawCreatorSlug[0]
    : rawCreatorSlug;
  const viewerId = resolveContentViewerId(resolvedUserId);

  useEffect(() => {
    if (!embedded) {
      window.scrollTo(0, 0);
    }
  }, [normalizedContentKey, embedded]);

  const contentViewRoute = normalizedContentKey
    ? API.content.view(normalizedContentKey, viewerId, creatorSlug)
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
      enabled: Boolean(normalizedContentKey) && !discoverFallback && !tutorial,
      refetchInterval: isPaymentSuccess ? 1500 : false,
      placeholderData: (previousData) => previousData,
    },
  );
  const content = getContentDetail(data);
  const { creator: publicCreator } = useCreatorPublicProfile(
    content?.creatorId ?? null,
  );
  const relatedCollectionQuery = usePublicRelatedCollectionContent(
    content?.id,
    {
      enabled: Boolean(content?.id) && !discoverFallback && !tutorial,
    },
  );
  const resolvedContentSlug = tutorial?.title || content?.title;
  const resolvedCreatorSlug = tutorial?.creatorSlug || content?.creatorSlug;

  useEffect(() => {
    if (embedded || !resolvedContentSlug || !resolvedCreatorSlug) return;

    const canonicalPath = pathPublishedContent(
      content?.slug || tutorial?.slug || resolvedContentSlug,
      resolvedCreatorSlug,
      resolvedContentSlug,
    );
    if (pathname === canonicalPath) return;

    const search = searchParams.toString();
    router.replace(`${canonicalPath}${search ? `?${search}` : ""}`, {
      scroll: false,
    });
  }, [
    pathname,
    embedded,
    content?.slug,
    resolvedContentSlug,
    resolvedCreatorSlug,
    tutorial?.slug,
    router,
    searchParams,
  ]);
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
      <Section $embedded={embedded}>
        <SingleContentPage
          {...getSingleContentProps(content, t, {
            viewerId: resolvedUserId,
            creatorName: publicCreator?.name,
          })}
          content={content}
          collectionId={relatedCollectionQuery.data?.collectionId}
          showBack={showBack}
          showShare={showShare}
          onBack={onBack}
          embedded={embedded}
          creator={
            publicCreator
              ? {
                  id: publicCreator.id,
                  slug: publicCreator.slug,
                  name: publicCreator.name,
                  avatar:
                    resolvePublicMediaUrl(publicCreator.profileImageUrl) ??
                    resolvePublicMediaUrl(publicCreator.mobileCoverImageUrl) ??
                    undefined,
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
          {!embedded && relatedCollectionQuery.data?.videos?.length ? (
            <CollectionItems
              videos={relatedCollectionQuery.data.videos}
              collectionId={relatedCollectionQuery.data.collectionId}
              collectionSlug={relatedCollectionQuery.data.collectionSlug}
              ownerCreatorId={content.creatorId}
              ownerCreatorSlug={content.creatorSlug}
            />
          ) : null}
        </SingleContentPage>
      </Section>
    </>
  );
}
