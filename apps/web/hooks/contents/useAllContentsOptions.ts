import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import { CollectionRow } from "@/types/collectionsType";
import {
  CollectionContentsApiResponse,
  getCollectionContentRows,
} from "@/hooks/contents/collectionApi";

type ContentOption = {
  value: string;
  label: string;
};

export const useAllContentsOptions = (
  collections: CollectionRow[],
  enabled = true,
) => {
  const collectionIds = collections.map((item) => item.id);

  return useQuery<ContentOption[]>({
    queryKey: ["all-contents-options", ...collectionIds],
    enabled: enabled && collectionIds.length > 0,
    queryFn: async () => {
      const responses = await Promise.all(
        collectionIds.map((id) => axiosClient.get(API.content.collection(id))),
      );

      const uniqueOptions = new Map<string, ContentOption>();

      responses.forEach((response) => {
        const rows = getCollectionContentRows(
          (response.data ?? []) as CollectionContentsApiResponse,
        );
        rows.forEach((row) => {
          if (!uniqueOptions.has(row.id)) {
            uniqueOptions.set(row.id, { value: row.id, label: row.name });
          }
        });
      });

      return Array.from(uniqueOptions.values());
    },
    placeholderData: [],
  });
};
