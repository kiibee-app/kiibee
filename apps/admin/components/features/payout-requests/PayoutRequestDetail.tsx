"use client";

import { useRouter } from "next/navigation";
import { usePayoutRequest, useCreatePayout } from "../../../hooks/api";
import toast from "react-hot-toast";
import {
  AllCreatorsLayout,
  AllCreatorsPanel,
  AllCreatorsState,
  DrawerHeaderCard,
  AvatarCircle,
  DrawerHeaderName,
  DrawerHeaderEmail,
  DrawerSection,
  DrawerSectionTitle,
  DetailsGrid,
  DetailField,
  DetailFieldLabel,
  DetailFieldValue,
  StatusBadge,
} from "../all-creators/AllCreators.styles";
import { ArrowLeft } from "lucide-react";
import styled from "styled-components";
import type { CreatorStatus } from "../../../types/creator-request";

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.secondary.main};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 16px;
  padding: 0;

  &:hover {
    color: ${({ theme }) => theme.colors.primary.GREEN};
  }
`;

const ActionRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 24px;
`;

const ApproveButton = styled.button`
  background: ${({ theme }) => theme.colors.primary.GREEN};
  color: ${({ theme }) => theme.colors.neutral.WHITE};
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover:not(:disabled) {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ContentWrapper = styled.div`
  padding: 24px;
`;

const toCreatorStatus = (status: string): CreatorStatus => {
  if (status === "approved" || status === "rejected") {
    return status;
  }

  return "pending";
};

export function PayoutRequestDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: request, isLoading, isError, error } = usePayoutRequest(id);
  const { mutate: createPayout, isPending: isApproving } = useCreatePayout();

  const handleApprove = () => {
    if (!request) return;

    createPayout(
      {
        creatorId: request.creatorId,
        amount: request.rawAmount,
        payoutId: request.payoutId,
        paymentMethodId: request.paymentMethodId,
      },
      {
        onSuccess: () => {
          toast.success("Payout successfully created and approved.");
        },
        onError: (err) => {
          toast.error(err.message || "Failed to approve payout.");
        },
      },
    );
  };

  if (isLoading) {
    return (
      <AllCreatorsLayout>
        <AllCreatorsPanel>
          <AllCreatorsState>Loading payout request details...</AllCreatorsState>
        </AllCreatorsPanel>
      </AllCreatorsLayout>
    );
  }

  if (isError || !request) {
    return (
      <AllCreatorsLayout>
        <AllCreatorsPanel>
          <AllCreatorsState>
            {error?.message || "Failed to load payout request details."}
          </AllCreatorsState>
        </AllCreatorsPanel>
      </AllCreatorsLayout>
    );
  }

  const initials = request.fullName
    ? request.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase()
    : "?";

  return (
    <AllCreatorsLayout>
      <BackButton onClick={() => router.back()}>
        <ArrowLeft size={16} /> Back to Payout Requests
      </BackButton>

      <AllCreatorsPanel>
        <ContentWrapper>
          {request.status === "pending" && (
            <ActionRow>
              <ApproveButton onClick={handleApprove} disabled={isApproving}>
                {isApproving ? "Approving..." : "Approve Payout"}
              </ApproveButton>
            </ActionRow>
          )}

          <DrawerHeaderCard>
            <AvatarCircle>{initials}</AvatarCircle>
            <DrawerHeaderName>
              {request.fullName || "Unknown Creator"}
            </DrawerHeaderName>
            <DrawerHeaderEmail>{request.email || "No email"}</DrawerHeaderEmail>
            <StatusBadge $status={toCreatorStatus(request.status)}>
              {request.status}
            </StatusBadge>
          </DrawerHeaderCard>

          <DrawerSection>
            <DrawerSectionTitle>Request Information</DrawerSectionTitle>
            <DetailsGrid>
              <DetailField>
                <DetailFieldLabel>Date Requested</DetailFieldLabel>
                <DetailFieldValue>
                  {request.createdAt
                    ? new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      }).format(new Date(request.createdAt))
                    : "N/A"}
                </DetailFieldValue>
              </DetailField>
              <DetailField>
                <DetailFieldLabel>Request ID</DetailFieldLabel>
                <DetailFieldValue>{request.id}</DetailFieldValue>
              </DetailField>
              <DetailField>
                <DetailFieldLabel>Payout ID</DetailFieldLabel>
                <DetailFieldValue>{request.payoutId}</DetailFieldValue>
              </DetailField>
              <DetailField>
                <DetailFieldLabel>Payment Method ID</DetailFieldLabel>
                <DetailFieldValue>{request.paymentMethodId}</DetailFieldValue>
              </DetailField>
            </DetailsGrid>
          </DrawerSection>

          <DrawerSection>
            <DrawerSectionTitle>Financial Details</DrawerSectionTitle>
            <DetailsGrid>
              <DetailField>
                <DetailFieldLabel>Requested Amount</DetailFieldLabel>
                <DetailFieldValue>
                  {request.rawAmount} {request.currency}
                </DetailFieldValue>
              </DetailField>
              <DetailField>
                <DetailFieldLabel>Platform Fee</DetailFieldLabel>
                <DetailFieldValue>
                  {request.platformFee} {request.currency}
                </DetailFieldValue>
              </DetailField>
              <DetailField>
                <DetailFieldLabel>Processing Fee</DetailFieldLabel>
                <DetailFieldValue>
                  {request.processingFee} {request.currency}
                </DetailFieldValue>
              </DetailField>
              <DetailField>
                <DetailFieldLabel>Net Payable Amount</DetailFieldLabel>
                <DetailFieldValue style={{ fontWeight: 700, color: "#10B981" }}>
                  {request.payableAmount} {request.currency}
                </DetailFieldValue>
              </DetailField>
            </DetailsGrid>
          </DrawerSection>

          <DrawerSection>
            <DrawerSectionTitle>Creator Wallet Balance</DrawerSectionTitle>
            <DetailsGrid>
              <DetailField>
                <DetailFieldLabel>Current Balance</DetailFieldLabel>
                <DetailFieldValue>
                  {request.walletBalance !== null
                    ? `${request.walletBalance} ${request.walletCurrency}`
                    : "N/A"}
                </DetailFieldValue>
              </DetailField>
            </DetailsGrid>
          </DrawerSection>
        </ContentWrapper>
      </AllCreatorsPanel>
    </AllCreatorsLayout>
  );
}
