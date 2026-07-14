"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useViewers } from "../../../hooks/api";
import { usePagination } from "../../../hooks/ui/use-pagination";
import { useDebounce } from "@/hooks/ui/use-debounce";
import { PLACEHOLDERS, STORAGE_KEYS } from "@/utils/constants";
import { DEFAULT_PAGE_SIZE, getInitialPageSize } from "@/utils/pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() =>
    getInitialPageSize(STORAGE_KEYS.PAGE_SIZE_VIEWERS, DEFAULT_PAGE_SIZE),
  );
  const debouncedSearch = useDebounce(searchTerm);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const viewersQuery = useViewers({
    search: debouncedSearch,
    page: currentPage,
    limit: pageSize,
  });

  const viewers = viewersQuery.data?.items ?? [];
  const pagination = viewersQuery.data?.pagination;
  const totalViewers = pagination?.totalItems ?? 0;
  const viewersPagination = usePagination({
    data: viewers,
    totalItems: totalViewers,
    initialPageSize: DEFAULT_PAGE_SIZE,
    storageKey: STORAGE_KEYS.PAGE_SIZE_VIEWERS,
    mode: "server",
    currentPage: pagination?.page ?? currentPage,
    pageSize: pagination?.limit ?? pageSize,
    onPageChange: setCurrentPage,
    onPageSizeChange: setPageSize,
  });

  const handleSearchClear = () => {
    setSearchTerm("");
    viewersPagination.onPageChange(1);
    searchInputRef.current?.focus();
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    viewersPagination.onPageChange(1);
  };

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
            onChange={(event) => handleSearchChange(event.target.value)}
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
