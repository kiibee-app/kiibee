"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useViewers } from "../../../hooks/api";
import { usePagination } from "../../../hooks/ui/use-pagination";
import { useDebounce } from "@/hooks/ui/use-debounce";
import { PLACEHOLDERS, STORAGE_KEYS } from "@/utils/constants";
import { ViewersTable } from "../all-creators/ViewersTable";
import { CreatorPagination } from "../all-creators/CreatorPagination";
import { CreatorRequestsTableSkeleton } from "../all-creators/CreatorRequestsTableSkeleton";
import {
  SearchContainer,
  SearchIconWrapper,
  SearchInput,
  SearchClearButton,
  SearchIcon,
  ClearIcon,
} from "../all-creators/AllCreators.styles";
import {
  ViewersHeader,
  ViewersLayout,
  ViewersPanel,
  ViewersState,
} from "./Viewers.styles";

export function ViewersList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const viewersQuery = useViewers();

  const handleSearchClear = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  const debouncedSearchLower = debouncedSearch.toLowerCase().trim();
  const viewers = viewersQuery.data ?? [];

  const filteredViewers = viewers.filter((viewer) => {
    if (!debouncedSearchLower) return true;
    return (
      viewer.fullName?.toLowerCase().includes(debouncedSearchLower) ||
      viewer.firstName?.toLowerCase().includes(debouncedSearchLower) ||
      viewer.lastName?.toLowerCase().includes(debouncedSearchLower) ||
      viewer.email.toLowerCase().includes(debouncedSearchLower)
    );
  });

  const totalViewers = filteredViewers.length;
  const viewersPagination = usePagination({
    data: filteredViewers,
    totalItems: totalViewers,
    initialPageSize: 10,
    storageKey: STORAGE_KEYS.PAGE_SIZE_VIEWERS,
  });

  const renderContent = () => {
    if (viewersQuery.isLoading) {
      return <CreatorRequestsTableSkeleton />;
    }

    if (viewersQuery.isError) {
      return (
        <ViewersState>
          {viewersQuery.error?.message || "Failed to load viewers."}
        </ViewersState>
      );
    }

    if (!totalViewers) {
      return <ViewersState>No viewers found.</ViewersState>;
    }

    return (
      <>
        <ViewersTable
          viewers={viewersPagination.paginatedData}
          onSelectViewer={(viewer) => router.push(`/viewers/${viewer.id}`)}
        />
        <CreatorPagination
          startIndex={viewersPagination.startIndex}
          endIndex={viewersPagination.endIndex}
          totalItems={totalViewers}
          currentPage={viewersPagination.currentPage}
          totalPages={viewersPagination.totalPages}
          pageNumbers={viewersPagination.pageNumbers}
          pageSize={viewersPagination.pageSize}
          itemLabel="viewers"
          onPageChange={viewersPagination.onPageChange}
          onPageSizeChange={viewersPagination.onPageSizeChange}
        />
      </>
    );
  };

  return (
    <ViewersLayout>
      <ViewersHeader>
        <SearchContainer>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <SearchInput
            ref={searchInputRef}
            placeholder={PLACEHOLDERS.SEARCH_VIEWERS}
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          {searchTerm ? (
            <SearchClearButton
              type="button"
              onClick={handleSearchClear}
              aria-label="Clear search"
            >
              <ClearIcon />
            </SearchClearButton>
          ) : null}
        </SearchContainer>
      </ViewersHeader>

      <ViewersPanel>{renderContent()}</ViewersPanel>
    </ViewersLayout>
  );
}
