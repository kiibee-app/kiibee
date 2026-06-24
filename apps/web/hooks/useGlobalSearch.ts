import {
  useExploreContent,
  EXPLORE_CONTENT_SORT,
} from "@/hooks/feed/useExploreContent";
import { useExploreCreators } from "@/hooks/creators/useExploreCreators";
import { pathPublishedContent } from "@/utils/path";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDebounce } from "@/hooks/useDebounce";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import type { CreatorLayoutKey } from "@/utils/creatorChannel";
import { DEFAULT_DEBOUNCE_DELAY } from "@/utils/Constants";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export type UseGlobalSearchProps = {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
};

export const useGlobalSearch = ({
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
}: UseGlobalSearchProps = {}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const searchQuery = externalSearchQuery ?? internalQuery;
  const setSearchQuery = externalSetSearchQuery ?? setInternalQuery;
  const debouncedQuery = useDebounce(searchQuery, DEFAULT_DEBOUNCE_DELAY);
  const closeSearch = useCallback(() => setIsOpen(false), []);

  useClickOutside({
    ref: containerRef,
    handler: closeSearch,
  });

  useEffect(() => {
    setIsOpen(Boolean(debouncedQuery.trim()));
  }, [debouncedQuery]);

  const { tutorials, isLoading: isContentLoading } = useExploreContent({
    search: debouncedQuery,
    sort: EXPLORE_CONTENT_SORT.NEW,
  });

  const { creators, isLoading: isCreatorsLoading } = useExploreCreators(
    undefined,
    debouncedQuery,
  );

  const isLoading = isContentLoading || isCreatorsLoading;

  const handleContentClick = useCallback(
    (id: string) => () => {
      closeSearch();
      router.push(pathPublishedContent(id));
    },
    [closeSearch, router],
  );

  const handleCreatorClick = useCallback(
    (id: string, layout?: CreatorLayoutKey | null) => () => {
      closeSearch();
      router.push(getPublicCreatorProfilePath(id, layout));
    },
    [closeSearch, router],
  );

  const hasResults =
    (tutorials?.length ?? 0) > 0 || (creators?.length ?? 0) > 0;

  return {
    searchQuery,
    setSearchQuery,
    isOpen,
    containerRef,
    isLoading,
    creators,
    tutorials,
    hasResults,
    handleContentClick,
    handleCreatorClick,
  };
};
