"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { LeftIcon } from "@/assets/icons";
import TutorialCard from "@/components/Feature/TutorialVideos/TutorialCard";
import {
  SectionHeader,
  SectionLabel,
  SectionLink,
} from "@/components/Feature/TutorialVideos/TutorialContent/styles";
import { MonoText } from "@/components/UI/Monotext";
import {
  CollectionContentsApiResponse,
  CollectionsApiResponse,
  getCollectionContentRows,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { usePublicCreatorContent } from "@/hooks/creators/usePublicCreatorContent";
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { getContentTypeLabel } from "@/utils/content";
import { tutorialVideos } from "@/utils/data";
import { type TutorialVideo } from "@/utils/types";
import { QUERY_KEYS } from "@/utils/Constants";
import { useRouter } from "next/navigation";
import { authStorage } from "@/lib/auth/authStorage";
import { PATHS } from "@/utils/path";
import {
  CollectionSection,
  CollectionSectionTag,
  FourColumnGrid,
} from "./styles";

type CollectionWithCards = {
  id: string;
  name: string;
  cards: TutorialVideo[];
};

export default function CollectionPreview() {
  const { t } = useTranslation();
  const router = useRouter();
  const { displayName, isPublicView, publicCreatorId } =
    useCreatorChannelProfile();
  const hasSession = authStorage.hasSession();
  const { tutorials: publicTutorials, isLoading: isLoadingPublic } =
    usePublicCreatorContent(isPublicView ? publicCreatorId : null);

  const handleCollectionClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!hasSession) {
      e.preventDefault();
      const nextUrl = window.location.pathname + window.location.search;
      router.push(`${PATHS.AUTH_LOGIN}?next=${encodeURIComponent(nextUrl)}`);
    }
  };

  const { data: sections = [], isLoading: isLoadingPrivate } = useQuery<
    CollectionWithCards[]
  >({
    queryKey: [QUERY_KEYS.PROFILE_HOME_COLLECTIONS_PREVIEW],
    queryFn: async () => {
      const collectionsResponse = await axiosClient.get<CollectionsApiResponse>(
        API.collection.getAll,
      );
      const collections = getCollectionRows(collectionsResponse.data);
      if (!collections.length) return [];

      const contentsResponses = await Promise.all(
        collections.map((item) =>
          axiosClient.get<CollectionContentsApiResponse>(
            API.content.collection(item.id),
          ),
        ),
      );

      return collections
        .map((collection, collectionIndex) => {
          const contentRows = getCollectionContentRows(
            contentsResponses[collectionIndex]?.data,
          );
          const cards = contentRows.map((content, contentIndex) => {
            const fallbackTemplate =
              tutorialVideos[
                (collectionIndex + contentIndex) % tutorialVideos.length
              ];
            return {
              ...fallbackTemplate,
              id: content.id,
              title: content.name,
              creator: displayName || fallbackTemplate.creator,
              published: content.createdAt,
              formatType: content.contentType,
              formatLabel: getContentTypeLabel(content.contentType),
              buttons: [
                {
                  label: t("createProfileAbout.buyCollection"),
                  variant: "secondary",
                },
              ],
            } as TutorialVideo;
          });
          return { id: collection.id, name: collection.name, cards };
        })
        .filter((section) => section.cards.length > 0);
    },
    enabled: hasSession && !isPublicView,
    refetchOnWindowFocus: false,
  });

  const publicSections = useMemo<CollectionWithCards[]>(() => {
    if (!isPublicView || publicTutorials.length === 0) return [];
    return [
      {
        id: "public-content",
        name: t("nav.profile.collections"),
        cards: publicTutorials,
      },
    ];
  }, [isPublicView, publicTutorials, t]);

  const visibleSections = useMemo(() => {
    const source = isPublicView ? publicSections : sections;
    return source.slice(0, 4);
  }, [isPublicView, publicSections, sections]);

  const isLoading = isPublicView ? isLoadingPublic : isLoadingPrivate;
  if (!isLoading && visibleSections.length === 0) return null;

  return (
    <>
      {visibleSections.map((collection) => (
        <CollectionSection key={collection.id}>
          <SectionHeader>
            <SectionLabel>
              <CollectionSectionTag>
                <MonoText $use="H4_Medium">{collection.name}</MonoText>
              </CollectionSectionTag>
            </SectionLabel>
            {!isPublicView ? (
              <SectionLink
                href={`/single-collection?id=${collection.id}`}
                onClick={handleCollectionClick}
              >
                <LeftIcon />
              </SectionLink>
            ) : null}
          </SectionHeader>
          <FourColumnGrid>
            {collection.cards.map((tutorial) => (
              <TutorialCard key={tutorial.id} tutorial={tutorial} />
            ))}
          </FourColumnGrid>
        </CollectionSection>
      ))}
    </>
  );
}
