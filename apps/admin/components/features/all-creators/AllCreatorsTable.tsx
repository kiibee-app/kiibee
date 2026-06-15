"use client";

import { useState, useRef } from "react";
import type { CreatorRequest } from "../../../types/creator-request";
import {
  useCreatorRequests,
  useExistingCreators,
  useViewers,
} from "../../../hooks/api";
import { usePagination } from "../../../hooks/ui/use-pagination";
import {
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
  AllCreatorsTabButton,
  AllCreatorsTabs,
  SearchContainer,
  SearchIconWrapper,
  SearchInput,
  AllCreatorsHeader,
  SearchClearButton,
  SearchIcon,
  ClearIcon,
} from "./AllCreators.styles";
import { ExistingCreatorsTable } from "./ExistingCreatorsTable";
import { ViewersTable } from "./ViewersTable";
import { CreatorRequestsTable } from "./CreatorRequestsTable";
import { CreatorRequestsTableSkeleton } from "./CreatorRequestsTableSkeleton";
import { CreatorPagination } from "./CreatorPagination";
import { CreatorDetailsModal } from "./CreatorDetailsModal";
import { useCreatorRequestActions } from "./useCreatorRequestActions";
import { useCreatorRequestOverrides } from "./useCreatorRequestOverrides";
import {
  ALL_CREATORS_TAB,
  type AllCreatorsTab,
  STORAGE_KEYS,
  PLACEHOLDERS,
} from "@/utils/constants";
import { useDebounce } from "@/hooks/ui/use-debounce";

export function AllCreatorsTable() {
  const [activeTab, setActiveTab] = useState<AllCreatorsTab>(
    ALL_CREATORS_TAB.CREATORS,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm);

  const [selectedCreator, setSelectedCreator] = useState<CreatorRequest | null>(
    null,
  );
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchClear = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };
  const existingCreatorsQuery = useExistingCreators(debouncedSearch);
  const creatorRequestsQuery = useCreatorRequests();
  const viewersQuery = useViewers();
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

  const existingCreators = existingCreatorsQuery.data ?? [];
  const totalExistingCreators = existingCreators.length;
  const existingCreatorsPagination = usePagination({
    data: existingCreators,
    totalItems: totalExistingCreators,
    initialPageSize: 10,
    storageKey: STORAGE_KEYS.PAGE_SIZE_ALL_CREATORS,
  });

  const debouncedSearchLower = debouncedSearch.toLowerCase().trim();

  const matchUser = (user: {
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    email: string;
  }) => {
    if (!debouncedSearchLower) return true;
    return (
      user.fullName?.toLowerCase().includes(debouncedSearchLower) ||
      user.firstName?.toLowerCase().includes(debouncedSearchLower) ||
      user.lastName?.toLowerCase().includes(debouncedSearchLower) ||
      user.email.toLowerCase().includes(debouncedSearchLower)
    );
  };

  const filteredRequests = creators.filter(matchUser);

  const totalRequests = filteredRequests.length;
  const requestsPagination = usePagination({
    data: filteredRequests,
    totalItems: totalRequests,
    initialPageSize: 10,
    storageKey: STORAGE_KEYS.PAGE_SIZE_CREATOR_REQUESTS,
  });

  const viewers = viewersQuery.data ?? [];
  const filteredViewers = viewers.filter(matchUser);

  const totalViewers = filteredViewers.length;
  const viewersPagination = usePagination({
    data: filteredViewers,
    totalItems: totalViewers,
    initialPageSize: 10,
    storageKey: STORAGE_KEYS.PAGE_SIZE_VIEWERS,
  });

  const renderExistingCreators = () => {
    if (existingCreatorsQuery.isLoading) {
      return <CreatorRequestsTableSkeleton />;
    }

    if (existingCreatorsQuery.isError) {
      return (
        <AllCreatorsState>
          {existingCreatorsQuery.error?.message || "Failed to load creators."}
        </AllCreatorsState>
      );
    }

    if (!totalExistingCreators) {
      return <AllCreatorsState>No existing creators found.</AllCreatorsState>;
    }

    return (
      <>
        <ExistingCreatorsTable
          creators={existingCreatorsPagination.paginatedData}
        />

        <CreatorPagination
          startIndex={existingCreatorsPagination.startIndex}
          endIndex={existingCreatorsPagination.endIndex}
          totalItems={totalExistingCreators}
          currentPage={existingCreatorsPagination.currentPage}
          totalPages={existingCreatorsPagination.totalPages}
          pageNumbers={existingCreatorsPagination.pageNumbers}
          pageSize={existingCreatorsPagination.pageSize}
          itemLabel={ALL_CREATORS_TAB.CREATORS}
          onPageChange={existingCreatorsPagination.onPageChange}
          onPageSizeChange={existingCreatorsPagination.onPageSizeChange}
        />
      </>
    );
  };

  const renderCreatorRequests = () => {
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
          itemLabel={ALL_CREATORS_TAB.REQUESTS}
          onPageChange={requestsPagination.onPageChange}
          onPageSizeChange={requestsPagination.onPageSizeChange}
        />
      </>
    );
  };

  const renderViewers = () => {
    if (viewersQuery.isLoading) {
      return <CreatorRequestsTableSkeleton />;
    }

    if (viewersQuery.isError) {
      return (
        <AllCreatorsState>
          {viewersQuery.error?.message || "Failed to load viewers."}
        </AllCreatorsState>
      );
    }

    if (!totalViewers) {
      return <AllCreatorsState>No viewers found.</AllCreatorsState>;
    }

    return (
      <>
        <ViewersTable viewers={viewersPagination.paginatedData} />

        <CreatorPagination
          startIndex={viewersPagination.startIndex}
          endIndex={viewersPagination.endIndex}
          totalItems={totalViewers}
          currentPage={viewersPagination.currentPage}
          totalPages={viewersPagination.totalPages}
          pageNumbers={viewersPagination.pageNumbers}
          pageSize={viewersPagination.pageSize}
          itemLabel={ALL_CREATORS_TAB.VIEWERS}
          onPageChange={viewersPagination.onPageChange}
          onPageSizeChange={viewersPagination.onPageSizeChange}
        />
      </>
    );
  };

  return (
    <AllCreatorsLayout>
      <AllCreatorsHeader>
        <AllCreatorsTabs aria-label="Creator list views">
          <AllCreatorsTabButton
            type="button"
            $active={activeTab === ALL_CREATORS_TAB.CREATORS}
            onClick={() => setActiveTab(ALL_CREATORS_TAB.CREATORS)}
          >
            Existing Creators ({totalExistingCreators})
          </AllCreatorsTabButton>
          <AllCreatorsTabButton
            type="button"
            $active={activeTab === ALL_CREATORS_TAB.VIEWERS}
            onClick={() => setActiveTab(ALL_CREATORS_TAB.VIEWERS)}
          >
            Viewers ({totalViewers})
          </AllCreatorsTabButton>
          <AllCreatorsTabButton
            type="button"
            $active={activeTab === ALL_CREATORS_TAB.REQUESTS}
            onClick={() => setActiveTab(ALL_CREATORS_TAB.REQUESTS)}
          >
            Pending Requests ({totalRequests})
          </AllCreatorsTabButton>
        </AllCreatorsTabs>

        <SearchContainer>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <SearchInput
            ref={searchInputRef}
            placeholder={PLACEHOLDERS.SEARCH_USERS}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      </AllCreatorsHeader>

      <AllCreatorsPanel>
        {activeTab === ALL_CREATORS_TAB.CREATORS
          ? renderExistingCreators()
          : activeTab === ALL_CREATORS_TAB.VIEWERS
            ? renderViewers()
            : renderCreatorRequests()}
      </AllCreatorsPanel>

      <CreatorDetailsModal
        creator={selectedCreator}
        onClose={() => setSelectedCreator(null)}
      />
    </AllCreatorsLayout>
  );
}
