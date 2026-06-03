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
import { API } from "@/lib/http/api/endpoints";
import { axiosClient } from "@/lib/http/axiosClient";
import { useCreatorChannelProfile } from "@/hooks/useCreatorChannelProfile";
import { useCreatorProfileUi } from "@/hooks/useCreatorChannelLayout";
import { matchesProfileSearch } from "@/utils/creatorChannel";
import { getContentTypeLabel } from "@/utils/content";
import {
  getContentDetail,
  type ContentDetailResponse,
} from "@/utils/contentApi";
import { tutorialVideos } from "@/utils/data";
import { type TutorialVideo } from "@/utils/types";
import { QUERY_KEYS } from "@/utils/Constants";
import {
  CollectionSection,
  CollectionSectionTag,
  FourColumnGrid,
} from "./styles";
import { ProfileLayoutVariant } from "../../config";

type CollectionWithCards = {
  id: string;
  name: string;
  cards: TutorialVideo[];
};

type Props = {
  variant: ProfileLayoutVariant;
};

export default function CollectionPreview({ variant }: Props) {
  const { t } = useTranslation();
  const { searchQuery } = useCreatorProfileUi();
  const { displayName } = useCreatorChannelProfile();

  const { data: sections = [] } = useQuery<CollectionWithCards[]>({
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

      const collectionSections = await Promise.all(
        collections.map(async (collection, collectionIndex) => {
          const contentRows = getCollectionContentRows(
            contentsResponses[collectionIndex]?.data,
          );

          const cards = await Promise.all(
            contentRows.map(async (content, contentIndex) => {
              const fallbackTemplate =
                tutorialVideos[
                  (collectionIndex + contentIndex) % tutorialVideos.length
                ];
              const contentResponse =
                await axiosClient.get<ContentDetailResponse>(
                  API.content.get(content.id),
                );
              const contentDetail = getContentDetail(contentResponse.data);

              return {
                ...fallbackTemplate,
                id: content.id,
                title: content.name,
                creator: displayName || fallbackTemplate.creator,
                published: content.createdAt,
                formatType: content.contentType,
                formatLabel: getContentTypeLabel(content.contentType),
                image: contentDetail?.thumbnailUrl ?? fallbackTemplate.image,
                buttons: [
                  {
                    label: t("createProfileAbout.buyCollection"),
                    variant: "secondary",
                  },
                ],
              } as TutorialVideo;
            }),
          );

          return {
            id: collection.id,
            name: collection.name,
            cards,
          };
        }),
      );

      return collectionSections.filter((section) => section.cards.length > 0);
    },
    refetchOnWindowFocus: false,
  });

  const visibleSections = useMemo(() => {
    const limited = sections.slice(0, 4);
    if (!searchQuery.trim()) return limited;

    return limited
      .map((section) => ({
        ...section,
        cards: section.cards.filter((card) =>
          matchesProfileSearch(searchQuery, card.title),
        ),
      }))
      .filter((section) => section.cards.length > 0);
  }, [searchQuery, sections]);

  if (!visibleSections.length) return null;

  return (
    <>
      {visibleSections.map((collection) => (
        <CollectionSection key={collection.id} $variant={variant}>
          <SectionHeader>
            <SectionLabel>
              <CollectionSectionTag>
                <MonoText $use="H4_Medium">{collection.name}</MonoText>
              </CollectionSectionTag>
            </SectionLabel>
            <SectionLink href={`/single-collection?id=${collection.id}`}>
              <LeftIcon />
            </SectionLink>
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
