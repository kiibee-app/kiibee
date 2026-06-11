"use client";

import { useState } from "react";
import type { CreatorRequest } from "../../../types/creator-request";
import { useCreatorRequests, useExistingCreators } from "../../../hooks/api";
import { usePagination } from "../../../hooks/ui/use-pagination";
import {
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
  AllCreatorsTabButton,
  AllCreatorsTabs,
} from "./AllCreators.styles";
import { ExistingCreatorsTable } from "./ExistingCreatorsTable";
import { CreatorRequestsTable } from "./CreatorRequestsTable";
import { CreatorRequestsTableSkeleton } from "./CreatorRequestsTableSkeleton";
import { CreatorPagination } from "./CreatorPagination";
import { CreatorDetailsModal } from "./CreatorDetailsModal";
import { useCreatorRequestActions } from "./useCreatorRequestActions";
import { useCreatorRequestOverrides } from "./useCreatorRequestOverrides";
import { STORAGE_KEYS } from "@/utils/constants";

type AllCreatorsTab = "creators" | "requests";

export function AllCreatorsTable() {
  const [activeTab, setActiveTab] = useState<AllCreatorsTab>("creators");
  const [selectedCreator, setSelectedCreator] = useState<CreatorRequest | null>(
    null,
  );
  const existingCreatorsQuery = useExistingCreators();
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

  const existingCreators = existingCreatorsQuery.data ?? [];
  const totalExistingCreators = existingCreators.length;
  const existingCreatorsPagination = usePagination({
    data: existingCreators,
    totalItems: totalExistingCreators,
    initialPageSize: 10,
    storageKey: STORAGE_KEYS.PAGE_SIZE_ALL_CREATORS,
  });

  const totalRequests = creators.length;
  const requestsPagination = usePagination({
    data: creators,
    totalItems: totalRequests,
    initialPageSize: 10,
    storageKey: STORAGE_KEYS.PAGE_SIZE_CREATOR_REQUESTS,
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
          itemLabel="creators"
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
          itemLabel="requests"
          onPageChange={requestsPagination.onPageChange}
          onPageSizeChange={requestsPagination.onPageSizeChange}
        />
      </>
    );
  };

  return (
    <AllCreatorsLayout>
      <AllCreatorsTabs aria-label="Creator list views">
        <AllCreatorsTabButton
          type="button"
          $active={activeTab === "creators"}
          onClick={() => setActiveTab("creators")}
        >
          Existing Creators ({totalExistingCreators})
        </AllCreatorsTabButton>
        <AllCreatorsTabButton
          type="button"
          $active={activeTab === "requests"}
          onClick={() => setActiveTab("requests")}
        >
          Pending Requests ({totalRequests})
        </AllCreatorsTabButton>
      </AllCreatorsTabs>

      <AllCreatorsPanel>
        {activeTab === "creators"
          ? renderExistingCreators()
          : renderCreatorRequests()}
      </AllCreatorsPanel>

      <CreatorDetailsModal
        creator={selectedCreator}
        onClose={() => setSelectedCreator(null)}
      />
    </AllCreatorsLayout>
  );
}
