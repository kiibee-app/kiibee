import {
  useExploreContent,
  EXPLORE_CONTENT_SORT,
} from "@/hooks/feed/useExploreContent";
import { useExploreCreators } from "@/hooks/creators/useExploreCreators";
import { pathPublishedContent } from "@/utils/path";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useDebounce } from "@/hooks/useDebounce";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import { DEFAULT_DEBOUNCE_DELAY } from "@/utils/Constants";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export type UseGlobalSearchProps = {
  searchQuery?: string;
  setSearchQuery?: (value: string) => void;
};

export const useGlobalSearch = ({
  searchQuery: externalSearchQuery,
  setSearchQuery: externalSetSearchQuery,
}: UseGlobalSearchProps) => {
  const router = useRouter();

  const [internalQuery, setInternalQuery] = useState("");
  const searchQuery =
    externalSearchQuery !== undefined ? externalSearchQuery : internalQuery;
  const setSearchQuery = externalSetSearchQuery || setInternalQuery;

  const debouncedQuery = useDebounce(searchQuery, DEFAULT_DEBOUNCE_DELAY);
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside({
    ref: containerRef as React.RefObject<HTMLElement>,
    handler: () => setIsOpen(false),
  });

  const { tutorials, isLoading: isContentLoading } = useExploreContent({
    search: debouncedQuery,
    sort: EXPLORE_CONTENT_SORT.NEW,
  });

  const { creators, isLoading: isCreatorsLoading } = useExploreCreators(
    undefined,
    debouncedQuery,
  );

  const [prevDebouncedQuery, setPrevDebouncedQuery] = useState(debouncedQuery);

  if (debouncedQuery !== prevDebouncedQuery) {
    setPrevDebouncedQuery(debouncedQuery);
    setIsOpen(debouncedQuery.trim().length > 0 ? true : false);
  }

  const isLoading = isContentLoading || isCreatorsLoading;

  const handleContentClick = (id: string) => () => {
    setIsOpen(false);
    router.push(pathPublishedContent(id));
  };

  const handleCreatorClick = (id: string) => () => {
    setIsOpen(false);
    router.push(getPublicCreatorProfilePath(id));
  };

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
