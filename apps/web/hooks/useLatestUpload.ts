"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import {
  CollectionContentsApiResponse,
  CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { usePublicCreatorContent } from "@/hooks/creators/usePublicCreatorContent";
import { QUERY_KEYS, VISIBILITY_PUBLIC_UPPER } from "@/utils/Constants";
import { CollectionContentRow } from "@/types/collectionsType";
import { CREATOR_ID_PARAM } from "@/utils/creatorChannel";
import { normalizeContentTypeValue } from "@/utils/content";
import { FORMAT_TYPE, type TutorialVideo } from "@/utils/types";
import { authStorage } from "@/lib/auth/authStorage";

type LatestUploadItem = Omit<CollectionContentRow, "createdAt"> & {
  createdAt: number;
  category?: string | null;
};

function mapPublicTutorialToLatestUpload(
  tutorial: TutorialVideo,
): LatestUploadItem {
  return {
    id: tutorial.id,
    name: tutorial.title,
    title: tutorial.title,
    description: tutorial.focus ?? "",
    visibility: VISIBILITY_PUBLIC_UPPER,
    createdAt: Date.now(),
    contentType: normalizeContentTypeValue(
      String(tutorial.formatType ?? FORMAT_TYPE.VIDEO),
    ),
    actions: "",
    category: tutorial.category ?? null,
  };
}

export function useLatestUpload() {
  const searchParams = useSearchParams();
  const creatorId = searchParams.get(CREATOR_ID_PARAM);
  const isPublicView = Boolean(creatorId);
  const hasSession = authStorage.hasSession();
  const publicContent = usePublicCreatorContent(
    isPublicView ? creatorId : null,
  );

  const privateQuery = useQuery({
    queryKey: [QUERY_KEYS.PROFILE_LATEST_UPLOAD],
    queryFn: async () => {
      const collectionsResponse = await axiosClient.get<CollectionsApiResponse>(
        API.collection.getAll,
      );
      const collections = getCollectionRows(collectionsResponse.data);
      if (!collections.length) return null;

      const contentsResponses = await Promise.all(
        collections.map((item) =>
          axiosClient.get<CollectionContentsApiResponse>(
            API.content.collection(item.id),
          ),
        ),
      );

      const allContents: LatestUploadItem[] = contentsResponses
        .flatMap((res) => {
          const data = res.data as
            | CollectionContentRow[]
            | { data: CollectionContentRow[] };
          return Array.isArray(data) ? data : (data?.data ?? []);
        })
        .map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt).getTime(),
        }))
        .filter((i) => !isNaN(i.createdAt));

      allContents.sort((a, b) => b.createdAt - a.createdAt);
      const latest = allContents[0];
      if (!latest) return null;

      try {
        const res = await axiosClient.get(API.content.get(String(latest.id)));
        const category = (
          res as { data?: { data?: { categories?: { id?: string }[] } } }
        )?.data?.data?.categories?.[0]?.id;
        return { ...latest, category: category ?? null };
      } catch {
        return { ...latest, category: null };
      }
    },
    enabled: hasSession && !isPublicView,
    refetchOnWindowFocus: true,
  });

  if (isPublicView) {
    const latestTutorial = publicContent.tutorials[0];
    return {
      data: latestTutorial
        ? mapPublicTutorialToLatestUpload(latestTutorial)
        : null,
      isLoading: publicContent.isLoading,
      isError: publicContent.isError,
    };
  }

  return privateQuery;
}
