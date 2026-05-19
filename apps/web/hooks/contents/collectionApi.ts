export type CollectionsApiItem = {
  id?: string | number;
  name?: string;
  contentsCount?: number;
  createdAt?: string;
};

export type CollectionsApiResponse =
  | CollectionsApiItem[]
  | {
      data?:
        | CollectionsApiItem[]
        | { items?: CollectionsApiItem[]; collections?: CollectionsApiItem[] };
      items?: CollectionsApiItem[];
      collections?: CollectionsApiItem[];
    };

export const getCollectionList = (
  response: CollectionsApiResponse,
): CollectionsApiItem[] => {
  const candidates = [
    response,
    (response as { items?: unknown })?.items,
    (response as { collections?: unknown })?.collections,
    (response as { data?: unknown })?.data,
    (response as { data?: { items?: unknown } })?.data?.items,
    (response as { data?: { collections?: unknown } })?.data?.collections,
  ];

  const list = candidates.find(Array.isArray);
  return (list as CollectionsApiItem[] | undefined) ?? [];
};
