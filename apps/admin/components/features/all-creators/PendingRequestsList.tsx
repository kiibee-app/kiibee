"use client";

import { useRef, useState } from "react";
import type { CreatorRequest } from "../../../types/creator-request";
import { useCreatorRequests } from "../../../hooks/api";
import { usePagination } from "../../../hooks/ui/use-pagination";
import { useDebounce } from "@/hooks/ui/use-debounce";
import { PLACEHOLDERS, STORAGE_KEYS } from "@/utils/constants";
import { CreatorRequestsTable } from "./CreatorRequestsTable";
import { CreatorDetailsModal } from "./CreatorDetailsModal";
import { CreatorPagination } from "./CreatorPagination";
import { CreatorRequestsTableSkeleton } from "./CreatorRequestsTableSkeleton";
import { useCreatorRequestActions } from "./useCreatorRequestActions";
import { useCreatorRequestOverrides } from "./useCreatorRequestOverrides";
import {
  AllCreatorsHeader,
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
  ClearIcon,
  HeaderControls,
  SearchClearButton,
  SearchContainer,
  SearchIcon,
  SearchIconWrapper,
  SearchInput,
} from "./AllCreators.styles";

export function PendingRequestsList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<CreatorRequest | null>(
    null,
  );
  const debouncedSearch = useDebounce(searchTerm);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const creatorRequestsQuery = useCreatorRequests();
  const { creators, updateCreatorStatus } = useCreatorRequestOverrides(
    creatorRequestsQuery.data ?? [],
  );
  const {
    activeAction,
    activeRequestId,
    handleApproveCreator,
    handleRejectCreator,
  } = useCreatorRequestActions({
    onCreatorUpdated: (creator) => updateCreatorStatus(creator, creator.status),
  });

  const handleSearchClear = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  const debouncedSearchLower = debouncedSearch.toLowerCase().trim();
  const filteredRequests = creators.filter((creator) => {
    if (!debouncedSearchLower) return true;
    return (
      creator.fullName?.toLowerCase().includes(debouncedSearchLower) ||
      creator.firstName?.toLowerCase().includes(debouncedSearchLower) ||
      creator.lastName?.toLowerCase().includes(debouncedSearchLower) ||
      creator.email.toLowerCase().includes(debouncedSearchLower)
    );
  });

  const totalRequests = filteredRequests.length;
  const requestsPagination = usePagination({
    data: filteredRequests,
    totalItems: totalRequests,
    initialPageSize: 10,
    storageKey: STORAGE_KEYS.PAGE_SIZE_CREATOR_REQUESTS,
  });

  const renderContent = () => {
    if (creatorRequestsQuery.isLoading) {
      return <CreatorRequestsTableSkeleton />;
    }

    if (creatorRequestsQuery.isError) {
      return (
        <AllCreatorsState>
          {creatorRequestsQuery.error?.message ||
            "Failed to load creator requests."}
        </AllCreatorsState>
      );
    }

    if (!totalRequests) {
      return (
        <AllCreatorsState>No pending creator requests found.</AllCreatorsState>
      );
    }

    return (
      <>
        <CreatorRequestsTable
          creators={requestsPagination.paginatedData}
          onSelectCreator={(creator) => setSelectedCreator(creator)}
          onApproveCreator={(creator) =>
            handleApproveCreator(creator, (updatedCreator) => {
              if (selectedCreator?.id === creator.id) {
                setSelectedCreator(updatedCreator);
              }
            })
          }
          onRejectCreator={(creator) =>
            handleRejectCreator(creator, (updatedCreator) => {
              if (selectedCreator?.id === creator.id) {
                setSelectedCreator(updatedCreator);
              }
            })
          }
          activeAction={activeAction}
          activeRequestId={activeRequestId}
        />
        <CreatorPagination
          startIndex={requestsPagination.startIndex}
          endIndex={requestsPagination.endIndex}
          totalItems={totalRequests}
          currentPage={requestsPagination.currentPage}
          totalPages={requestsPagination.totalPages}
          pageNumbers={requestsPagination.pageNumbers}
          pageSize={requestsPagination.pageSize}
          itemLabel="requests"
          onPageChange={requestsPagination.onPageChange}
          onPageSizeChange={requestsPagination.onPageSizeChange}
        />
      </>
    );
  };

  return (
    <AllCreatorsLayout>
      <AllCreatorsHeader style={{ justifyContent: "flex-end" }}>
        <HeaderControls>
          <SearchContainer>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <SearchInput
              ref={searchInputRef}
              placeholder={PLACEHOLDERS.SEARCH_USERS}
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
        </HeaderControls>
      </AllCreatorsHeader>

      <AllCreatorsPanel>{renderContent()}</AllCreatorsPanel>

      <CreatorDetailsModal
        creator={selectedCreator}
        onClose={() => setSelectedCreator(null)}
      />
    </AllCreatorsLayout>
  );
}
