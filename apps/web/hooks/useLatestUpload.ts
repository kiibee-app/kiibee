"use client";

import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import {
  CollectionContentsApiResponse,
  CollectionsApiResponse,
  getCollectionRows,
} from "@/hooks/contents/collectionApi";
import { QUERY_KEYS } from "@/utils/Constants";
import { CollectionContentRow } from "@/types/collectionsType";

export function useLatestUpload() {
  return useQuery({
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

      const allContents = contentsResponses
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

      return allContents[0] ?? null;
    },

    refetchOnWindowFocus: true,
  });
}
