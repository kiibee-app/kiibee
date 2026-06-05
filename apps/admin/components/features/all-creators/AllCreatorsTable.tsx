"use client";

import { useState } from "react";
import type { CreatorRequest } from "../../../types/creator-request";
import { useCreatorRequests } from "../../../hooks/api";
import { usePagination } from "../../../hooks/ui/use-pagination";
import { AllCreatorsPanel, AllCreatorsState } from "./AllCreators.styles";
import { CreatorRequestsTable } from "./CreatorRequestsTable";
import { CreatorRequestsTableSkeleton } from "./CreatorRequestsTableSkeleton";
import { CreatorPagination } from "./CreatorPagination";
import { CreatorDetailsModal } from "./CreatorDetailsModal";
import { useCreatorRequestActions } from "./useCreatorRequestActions";
import { useCreatorRequestOverrides } from "./useCreatorRequestOverrides";

export function AllCreatorsTable() {
  const [selectedCreator, setSelectedCreator] = useState<CreatorRequest | null>(
    null,
  );
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

  const totalItems = creators.length;
  const pagination = usePagination({
    data: creators,
    totalItems,
    initialPageSize: 10,
    storageKey: "kiibee.admin.allCreators.pageSize",
  });

  if (creatorRequestsQuery.isLoading) {
    return (
      <AllCreatorsPanel>
        <CreatorRequestsTableSkeleton />
      </AllCreatorsPanel>
    );
  }

  if (creatorRequestsQuery.isError) {
    return (
      <AllCreatorsPanel>
        <AllCreatorsState>
          {creatorRequestsQuery.error?.message ||
            "Failed to load creator requests."}
        </AllCreatorsState>
      </AllCreatorsPanel>
    );
  }

  if (!totalItems) {
    return (
      <AllCreatorsPanel>
        <AllCreatorsState>No creator requests found.</AllCreatorsState>
      </AllCreatorsPanel>
    );
  }

  return (
    <AllCreatorsPanel>
      <CreatorRequestsTable
        creators={pagination.paginatedData}
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
        startIndex={pagination.startIndex}
        endIndex={pagination.endIndex}
        totalItems={totalItems}
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        pageNumbers={pagination.pageNumbers}
        pageSize={pagination.pageSize}
        onPageChange={pagination.onPageChange}
        onPageSizeChange={pagination.onPageSizeChange}
      />

      <CreatorDetailsModal
        creator={selectedCreator}
        onClose={() => setSelectedCreator(null)}
      />
    </AllCreatorsPanel>
  );
}
