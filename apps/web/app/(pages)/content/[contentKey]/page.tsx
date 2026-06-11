"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "../../../styles";
import { MonoText } from "@/components/UI/Monotext";
import { GenericModal } from "@/components/UI/Modals";
import SuccessModalIcon from "@/components/UI/Modals/SuccessModalIcon";
import { MODAL_ALIGN } from "@/utils/ui";
import SingleContentPage from "@/components/Feature/SingleContentPage";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { resolveContentViewerId } from "@/utils/path";
import { resolveCloudflareStreamPlaybackUrl } from "@/utils/media";
import {
  CONTENT_MEDIA_QUERY_KEYS,
  CONTENT_MEDIA_RESPONSE_KEYS,
  CONTENT_TRANSLATION_KEYS,
  type ContentMediaUrlResponse,
  type ContentDetailResponse,
  getContentMediaKey,
  getContentType,
  getContentUrl,
  getContentDetail,
  getSingleContentProps,
  hasDirectPlaybackUrl,
  resolveContentPlaybackUrl,
} from "@/utils/contentApi";
import { FORMAT_TYPE } from "@/utils/types";
import SingleTutorial from "@/components/Feature/SingleTutorial";
import SingleDiscoverContent from "@/components/Feature/SingleDiscoverContent";
import { getTutorialCollectionByVideoId } from "@/utils/tutorialCollections";
import { usePublicRelatedCollectionContent } from "@/hooks/usePublicRelatedCollectionContent";
import CollectionItems from "@/components/Feature/SingleTutorial/CollectionItems";
import {
  resolvePublishedContentByKey,
  CONTENT_KIND,
} from "@/utils/resolvePublishedContentByKey";
import { PAYMENT_QUERY_KEY, STATUS_TONE } from "@/utils/Constants";

function PublishedContentDetail() {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const user = useStoredLoginUser();
  const raw = params?.contentKey;
  const contentKey = Array.isArray(raw) ? raw[0] : raw;
  const paymentStatus = searchParams.get(PAYMENT_QUERY_KEY);
  const [dismissedPaymentSuccess, setDismissedPaymentSuccess] = useState(false);
  const normalizedContentKey = contentKey?.replaceAll(":", "-");
  const viewerId = resolveContentViewerId(user?.id);
  const contentViewRoute = normalizedContentKey
    ? API.content.view(normalizedContentKey, viewerId)
    : API.content.create;
  const fallback = resolvePublishedContentByKey(normalizedContentKey);
  const tutorialCollection =
    getTutorialCollectionByVideoId(normalizedContentKey);
  const relatedTutorials = (tutorialCollection?.tutorials ?? []).filter(
    (video) => video.id !== normalizedContentKey,
  );
  const { data, isLoading, isError } = useGetAPI<ContentDetailResponse>(
    contentViewRoute,
    undefined,
    {
      enabled: Boolean(normalizedContentKey) && !fallback,
      refetchInterval: paymentStatus === STATUS_TONE.SUCCESS ? 1500 : false,
    },
  );
  const content = getContentDetail(data);
  const contentType = getContentType(content);
  const mediaKey = getContentMediaKey(content);
  const contentUrl = getContentUrl(content);
  const cloudflareEmbedUrl = resolveCloudflareStreamPlaybackUrl(
    mediaKey,
    contentUrl,
  );
  const directPlaybackUrl =
    cloudflareEmbedUrl ||
    (hasDirectPlaybackUrl(contentUrl) ? contentUrl : null);
  const relatedCollectionQuery = usePublicRelatedCollectionContent(
    normalizedContentKey,
    {
      enabled: Boolean(normalizedContentKey) && !fallback,
    },
  );
  const mediaEndpoint =
    contentType === FORMAT_TYPE.VIDEO
      ? API.media.videoStream
      : API.media.fileSignedUrl;
  const shouldFetchSignedMediaUrl =
    Boolean(mediaKey) && contentType !== FORMAT_TYPE.WEB && !directPlaybackUrl;
  const { data: mediaResponse } = useGetAPI<ContentMediaUrlResponse>(
    mediaEndpoint,
    { [CONTENT_MEDIA_QUERY_KEYS.KEY]: mediaKey },
    {
      enabled: shouldFetchSignedMediaUrl,
    },
  );
  const mediaUrl = resolveContentPlaybackUrl(
    content,
    mediaResponse?.[CONTENT_MEDIA_RESPONSE_KEYS.URL],
  );
  const showPaymentSuccessModal =
    paymentStatus === STATUS_TONE.SUCCESS &&
    Boolean(content?.accessInfo) &&
    !dismissedPaymentSuccess;

  const handlePaymentSuccessClose = () => {
    setDismissedPaymentSuccess(true);
    const nextParams = new URLSearchParams(searchParams.toString());
    nextParams.delete(PAYMENT_QUERY_KEY);
    const next = nextParams.toString();
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  if (isLoading) {
    return (
      <Section>
        <MonoText $use="H5_Regular">
          {t(CONTENT_TRANSLATION_KEYS.loading)}
        </MonoText>
      </Section>
    );
  }

  if (isError || !content) {
    if (fallback) {
      if (fallback.kind === CONTENT_KIND.TUTORIAL) {
        return (
          <Section>
            <SingleTutorial
              tutorial={fallback.tutorial}
              relatedVideos={relatedTutorials}
              collectionId={tutorialCollection?.id}
            />
          </Section>
        );
      } else if (fallback.kind === CONTENT_KIND.DISCOVER) {
        return (
          <Section>
            <SingleDiscoverContent item={fallback.item} />
          </Section>
        );
      }
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

    <Section>
      <SingleContentPage
        {...getSingleContentProps(content, t, mediaUrl, {
          inCollection: Boolean(relatedCollectionQuery.data?.collectionId),
          viewerId: user?.id,
        })}
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

export default function PublishedContentPage() {
  return (
    <PageContainer>
      <NavBar />
      <Main>
        <PublishedContentDetail />
      </Main>
      <Footer />
    </PageContainer>
  );
}
