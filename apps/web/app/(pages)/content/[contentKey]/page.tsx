"use client";

import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import NavBar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { Main, PageContainer, Section } from "../../../styles";
import { MonoText } from "@/components/UI/Monotext";
import SingleContentPage from "@/components/Feature/SingleContentPage";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import { authStorage } from "@/lib/auth/authStorage";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { resolveContentViewerId } from "@/utils/path";
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
} from "@/utils/contentApi";
import { FORMAT_TYPE } from "@/utils/types";
import { tutorialVideos } from "@/utils/data";
import SingleTutorial from "@/components/Feature/SingleTutorial";
import { getTutorialCollectionByVideoId } from "@/utils/tutorialCollections";
import { useRelatedCollectionContent } from "@/hooks/useRelatedCollectionContent";
import CollectionItems from "@/components/Feature/SingleTutorial/CollectionItems";

function PublishedContentDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const user = useStoredLoginUser();
  const raw = params?.contentKey;
  const contentKey = Array.isArray(raw) ? raw[0] : raw;
  const normalizedContentKey = contentKey?.replaceAll(":", "-");
  const viewerId = resolveContentViewerId(user?.id);
  const contentViewRoute = normalizedContentKey
    ? API.content.view(normalizedContentKey, viewerId)
    : API.content.create;
  const tutorialFallback = tutorialVideos.find(
    (video) => video.id === normalizedContentKey,
  );
  const tutorialCollection =
    getTutorialCollectionByVideoId(normalizedContentKey);
  const relatedTutorials = (tutorialCollection?.tutorials ?? []).filter(
    (video) => video.id !== normalizedContentKey,
  );
  const { data, isLoading, isError } = useGetAPI<ContentDetailResponse>(
    contentViewRoute,
    undefined,
    {
      enabled: Boolean(normalizedContentKey) && !tutorialFallback,
    },
  );
  const content = getContentDetail(data);
  const contentType = getContentType(content);
  const mediaKey = getContentMediaKey(content);
  const contentUrl = getContentUrl(content);
  const relatedCollectionQuery = useRelatedCollectionContent(
    normalizedContentKey,
    {
      enabled: !tutorialFallback && authStorage.hasSession(),
    },
  );
  const mediaEndpoint =
    contentType === FORMAT_TYPE.VIDEO
      ? API.media.videoStream
      : API.media.fileSignedUrl;
  const shouldFetchSignedMediaUrl =
    Boolean(mediaKey) && contentType !== FORMAT_TYPE.WEB;
  const { data: mediaResponse } = useGetAPI<ContentMediaUrlResponse>(
    mediaEndpoint,
    { [CONTENT_MEDIA_QUERY_KEYS.KEY]: mediaKey },
    {
      enabled: shouldFetchSignedMediaUrl,
    },
  );
  const mediaUrl =
    contentType === FORMAT_TYPE.WEB
      ? contentUrl
      : (mediaResponse?.[CONTENT_MEDIA_RESPONSE_KEYS.URL] ?? "");

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
    if (tutorialFallback) {
      return (
        <Section>
          <SingleTutorial
            tutorial={tutorialFallback}
            relatedVideos={relatedTutorials}
            collectionId={tutorialCollection?.id}
          />
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
    <Section>
      <SingleContentPage {...getSingleContentProps(content, t, mediaUrl)}>
        {relatedCollectionQuery.data?.videos?.length ? (
          <CollectionItems
            videos={relatedCollectionQuery.data.videos}
            collectionId={relatedCollectionQuery.data.collectionId}
          />
        ) : null}
      </SingleContentPage>
    </Section>
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
