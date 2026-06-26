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
import { ExistingCreatorsTable } from "./ExistingCreatorsTable";
import { CreatorPagination } from "./CreatorPagination";
import { CreatorRequestsTableSkeleton } from "./CreatorRequestsTableSkeleton";
import {
  AllCreatorsHeader,
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const debouncedSearch = useDebounce(searchTerm);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const existingCreatorsQuery = useExistingCreators(
    debouncedSearch,
    selectedPlan || undefined,
  );

  const handleSearchClear = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  const existingCreators = existingCreatorsQuery.data ?? [];
  const totalExistingCreators = existingCreators.length;
  const existingCreatorsPagination = usePagination({
    data: existingCreators,
    totalItems: totalExistingCreators,
    initialPageSize: 10,
    storageKey: STORAGE_KEYS.PAGE_SIZE_ALL_CREATORS,
  });

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
      <AllCreatorsHeader style={{ justifyContent: "flex-end" }}>
        <HeaderControls>
          <PlanFilterSelect
            aria-label="Filter creators by plan"
            value={selectedPlan}
            onChange={(event) => setSelectedPlan(event.target.value)}
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
    </AllCreatorsLayout>
  );
}
