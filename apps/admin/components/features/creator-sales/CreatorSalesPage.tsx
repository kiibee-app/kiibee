"use client";

import { useState, useRef } from "react";
import { useExistingCreators } from "../../../hooks/api";
import { usePagination } from "../../../hooks/ui/use-pagination";
import { useDebounce } from "../../../hooks/ui/use-debounce";
import {
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
  AllCreatorsHeader,
  SearchContainer,
  SearchIconWrapper,
  SearchInput,
  SearchClearButton,
  SearchIcon,
  ClearIcon,
  HeaderControls,
  PlanFilterSelect,
} from "../all-creators/AllCreators.styles";
import { CreatorSalesTable } from "../all-creators/CreatorSalesTable";
import { CreatorSalesDetailsView } from "./CreatorSalesDetailsView";
import { CreatorPagination } from "../all-creators/CreatorPagination";
import type { ExistingCreator } from "../../../types/existing-creator";
import {
  STORAGE_KEYS,
  PLACEHOLDERS,
  CREATOR_PLAN_FILTER_OPTIONS,
} from "../../../utils/constants";

export function CreatorSalesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("");
  const debouncedSearch = useDebounce(searchTerm);

  const [selectedSalesCreator, setSelectedSalesCreator] =
    useState<ExistingCreator | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearchClear = () => {
    setSearchTerm("");
    searchInputRef.current?.focus();
  };

  const existingCreatorsQuery = useExistingCreators(
    debouncedSearch,
    selectedPlan || undefined,
  );

  const existingCreators = existingCreatorsQuery.data ?? [];
  const totalExistingCreators = existingCreators.length;

  const salesPagination = usePagination({
    data: existingCreators,
    totalItems: totalExistingCreators,
    initialPageSize: 10,
    storageKey: STORAGE_KEYS.PAGE_SIZE_CREATOR_SALES,
  });

  const renderSalesCreators = () => {
    if (existingCreatorsQuery.isLoading) {
      return <AllCreatorsState>Loading...</AllCreatorsState>;
    }

    if (existingCreatorsQuery.isError) {
      return (
        <AllCreatorsState>
          {existingCreatorsQuery.error?.message || "Failed to load creators."}
        </AllCreatorsState>
      );
    }

    if (!totalExistingCreators) {
      return <AllCreatorsState>No creators found.</AllCreatorsState>;
    }

    return (
      <>
        <CreatorSalesTable
          creators={salesPagination.paginatedData}
          onSelectCreator={(creator) => setSelectedSalesCreator(creator)}
        />

        <CreatorPagination
          startIndex={salesPagination.startIndex}
          endIndex={salesPagination.endIndex}
          totalItems={totalExistingCreators}
          currentPage={salesPagination.currentPage}
          totalPages={salesPagination.totalPages}
          pageNumbers={salesPagination.pageNumbers}
          pageSize={salesPagination.pageSize}
          itemLabel="sales"
          onPageChange={salesPagination.onPageChange}
          onPageSizeChange={salesPagination.onPageSizeChange}
        />
      </>
    );
  };

  return (
    <AllCreatorsLayout>
      {selectedSalesCreator ? null : (
        <AllCreatorsHeader>
          {/* We keep the layout similar but without the tabs since this page is dedicated to sales */}
          <h2
            style={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text-primary, #1A1A1A)",
              margin: 0,
              padding: "12px 16px",
            }}
          >
            Creator Sales
          </h2>

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
          </HeaderControls>
        </AllCreatorsHeader>
      )}

      <AllCreatorsPanel>
        {selectedSalesCreator ? (
          <CreatorSalesDetailsView
            creator={selectedSalesCreator}
            onBack={() => setSelectedSalesCreator(null)}
          />
        ) : (
          renderSalesCreators()
        )}
      </AllCreatorsPanel>
    </AllCreatorsLayout>
  );
}
