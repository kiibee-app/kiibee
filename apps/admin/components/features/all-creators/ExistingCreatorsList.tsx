"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useExistingCreators } from "../../../hooks/api";
import { usePagination } from "../../../hooks/ui/use-pagination";
import { useDebounce } from "@/hooks/ui/use-debounce";
import {
  CREATOR_PLAN_FILTER_OPTIONS,
  PLACEHOLDERS,
  STORAGE_KEYS,
} from "@/utils/constants";
import { DEFAULT_PAGE_SIZE, getInitialPageSize } from "@/utils/pagination";
import {
  ALL_CREATORS_TABLIST_LABEL,
  ALL_CREATORS_TAB_KEYS,
  ALL_CREATORS_TABS,
  DEFAULT_ALL_CREATORS_TAB,
  type AllCreatorsTab,
} from "@/utils/allCreators";
import { ExistingCreatorsTable } from "./ExistingCreatorsTable";
import { CreatorPagination } from "./CreatorPagination";
import { CreatorRequestsTableSkeleton } from "./CreatorRequestsTableSkeleton";
import { CreatorSettings } from "./CreatorSettings";
import {
  AllCreatorsControlsHeader,
  AllCreatorsHeader,
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
  AllCreatorsTabButton,
  AllCreatorsTabs,
  ClearIcon,
  HeaderControls,
  PlanFilterSelect,
  SearchClearButton,
  SearchContainer,
  SearchIcon,
  SearchIconWrapper,
  SearchInput,
} from "./AllCreators.styles";

export function ExistingCreatorsList() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AllCreatorsTab>(
    DEFAULT_ALL_CREATORS_TAB,
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() =>
    getInitialPageSize(STORAGE_KEYS.PAGE_SIZE_ALL_CREATORS, DEFAULT_PAGE_SIZE),
  );
  const debouncedSearch = useDebounce(searchTerm);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const existingCreatorsQuery = useExistingCreators({
    search: debouncedSearch,
    plan: selectedPlan || undefined,
    page: currentPage,
    limit: pageSize,
  });

  const handleSearchClear = () => {
    setSearchTerm("");
    existingCreatorsPagination.onPageChange(1);
    searchInputRef.current?.focus();
  };

  const existingCreators = existingCreatorsQuery.data?.items ?? [];
  const pagination = existingCreatorsQuery.data?.pagination;
  const totalExistingCreators = pagination?.totalItems ?? 0;
  const existingCreatorsPagination = usePagination({
    data: existingCreators,
    totalItems: totalExistingCreators,
    initialPageSize: DEFAULT_PAGE_SIZE,
    storageKey: STORAGE_KEYS.PAGE_SIZE_ALL_CREATORS,
    mode: "server",
    currentPage: pagination?.page ?? currentPage,
    pageSize: pagination?.limit ?? pageSize,
    onPageChange: setCurrentPage,
    onPageSizeChange: setPageSize,
  });

  const handlePlanChange = (plan: string) => {
    setSelectedPlan(plan);
    existingCreatorsPagination.onPageChange(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    existingCreatorsPagination.onPageChange(1);
  };

  const renderContent = () => {
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
          onSelectCreator={(creator) =>
            router.push(`/all-creators/${creator.id}`)
          }
        />
        <CreatorPagination
          startIndex={existingCreatorsPagination.startIndex}
          endIndex={existingCreatorsPagination.endIndex}
          totalItems={totalExistingCreators}
          currentPage={existingCreatorsPagination.currentPage}
          totalPages={existingCreatorsPagination.totalPages}
          pageNumbers={existingCreatorsPagination.pageNumbers}
          pageSize={existingCreatorsPagination.pageSize}
          itemLabel="creators"
          onPageChange={existingCreatorsPagination.onPageChange}
          onPageSizeChange={existingCreatorsPagination.onPageSizeChange}
        />
      </>
    );
  };

  return (
    <AllCreatorsLayout>
      <AllCreatorsHeader>
        <AllCreatorsTabs role="tablist" aria-label={ALL_CREATORS_TABLIST_LABEL}>
          {ALL_CREATORS_TABS.map((tab) => (
            <AllCreatorsTabButton
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              $active={activeTab === tab.key}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </AllCreatorsTabButton>
          ))}
        </AllCreatorsTabs>
      </AllCreatorsHeader>

      {activeTab === ALL_CREATORS_TAB_KEYS.CREATORS ? (
        <>
          <AllCreatorsControlsHeader>
            <HeaderControls>
              <PlanFilterSelect
                aria-label="Filter creators by plan"
                value={selectedPlan}
                onChange={(event) => handlePlanChange(event.target.value)}
              >
                <option value="">All plans</option>
                {CREATOR_PLAN_FILTER_OPTIONS.map((plan) => (
                  <option key={plan} value={plan}>
                    {plan}
                  </option>
                ))}
              </PlanFilterSelect>

              <SearchContainer>
                <SearchIconWrapper>
                  <SearchIcon />
                </SearchIconWrapper>
                <SearchInput
                  ref={searchInputRef}
                  placeholder={PLACEHOLDERS.SEARCH_USERS}
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
            </HeaderControls>
          </AllCreatorsControlsHeader>

          <AllCreatorsPanel>{renderContent()}</AllCreatorsPanel>
        </>
      ) : (
        <CreatorSettings />
      )}
    </AllCreatorsLayout>
  );
}
