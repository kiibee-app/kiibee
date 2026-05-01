"use client";

import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import type { CreatorRequest } from "../../../types/creator-request";
import {
  useApproveCreator,
  useCreatorRequests,
  useRejectCreator,
} from "../../../hooks/api";
import { usePagination } from "../../../hooks/ui/use-pagination";
import { AllCreatorsPanel, AllCreatorsState } from "./AllCreators.styles";
import { CreatorRequestsTable } from "./CreatorRequestsTable";
import { CreatorPagination } from "./CreatorPagination";
import { CreatorDetailsModal } from "./CreatorDetailsModal";

const CREATOR_REQUEST_OVERRIDES_STORAGE_KEY = "admin-creator-request-overrides";

function loadCreatorOverrides(): CreatorRequest[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(
      CREATOR_REQUEST_OVERRIDES_STORAGE_KEY,
    );

    if (!rawValue) {
      return [];
    }

    const parsedValue = JSON.parse(rawValue) as CreatorRequest[];
    return Array.isArray(parsedValue) ? parsedValue : [];
  } catch {
    return [];
  }
}

export function AllCreatorsTable() {
  const [selectedCreator, setSelectedCreator] = useState<CreatorRequest | null>(
    null,
  );
  const [creatorOverrides, setCreatorOverrides] = useState<CreatorRequest[]>(
    () => loadCreatorOverrides(),
  );
  const creatorRequestsQuery = useCreatorRequests();
  const approveCreatorMutation = useApproveCreator();
  const rejectCreatorMutation = useRejectCreator();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      CREATOR_REQUEST_OVERRIDES_STORAGE_KEY,
      JSON.stringify(creatorOverrides),
    );
  }, [creatorOverrides]);

  const creators = useMemo(() => {
    const serverCreators = creatorRequestsQuery.data ?? [];
    const creatorMap = new Map<string, CreatorRequest>();

    for (const creator of serverCreators) {
      creatorMap.set(creator.id, creator);
    }

    for (const creator of creatorOverrides) {
      creatorMap.set(creator.id, creator);
    }

    return Array.from(creatorMap.values()).sort(
      (firstCreator, secondCreator) =>
        new Date(secondCreator.createdAt).getTime() -
        new Date(firstCreator.createdAt).getTime(),
    );
  }, [creatorOverrides, creatorRequestsQuery.data]);

  const totalItems = creators.length;
  const pagination = usePagination({
    data: creators,
    totalItems,
    initialPageSize: 10,
  });

  const activeAction = approveCreatorMutation.isPending
    ? "approve"
    : rejectCreatorMutation.isPending
      ? "reject"
      : null;

  const activeRequestId =
    approveCreatorMutation.variables?.requestId ??
    rejectCreatorMutation.variables?.requestId ??
    null;

  const handleApproveCreator = (creator: CreatorRequest) => {
    approveCreatorMutation.mutate(
      { requestId: creator.id },
      {
        onSuccess: () => {
          const updatedCreator: CreatorRequest = {
            ...creator,
            status: "approved",
            updatedAt: new Date().toISOString(),
          };

          setCreatorOverrides((currentOverrides) => {
            const nextOverrides = currentOverrides.filter(
              (currentCreator) => currentCreator.id !== creator.id,
            );

            return [...nextOverrides, updatedCreator];
          });

          if (selectedCreator?.id === creator.id) {
            setSelectedCreator(updatedCreator);
          }

          toast.success("Creator approved successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to approve creator");
        },
      },
    );
  };

  const handleRejectCreator = (creator: CreatorRequest) => {
    rejectCreatorMutation.mutate(
      { requestId: creator.id },
      {
        onSuccess: () => {
          const updatedCreator: CreatorRequest = {
            ...creator,
            status: "rejected",
            updatedAt: new Date().toISOString(),
          };

          setCreatorOverrides((currentOverrides) => {
            const nextOverrides = currentOverrides.filter(
              (currentCreator) => currentCreator.id !== creator.id,
            );

            return [...nextOverrides, updatedCreator];
          });

          if (selectedCreator?.id === creator.id) {
            setSelectedCreator(updatedCreator);
          }

          toast.success("Creator rejected successfully");
        },
        onError: (error) => {
          toast.error(error.message || "Failed to reject creator");
        },
      },
    );
  };

  if (creatorRequestsQuery.isLoading) {
    return (
      <AllCreatorsPanel>
        <AllCreatorsState>Loading creator requests...</AllCreatorsState>
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
        onApproveCreator={handleApproveCreator}
        onRejectCreator={handleRejectCreator}
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
