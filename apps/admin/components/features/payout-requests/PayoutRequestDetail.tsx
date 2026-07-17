"use client";

import { useRouter } from "next/navigation";
import { usePayoutRequest } from "../../../hooks/api";
import { usePayoutActions } from "./usePayoutActions";
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
import { toCreatorStatus } from "../../../utils/status";
import {
  BackButton,
  ActionRow,
  ButtonGroup,
  ApproveButton,
  RejectButton,
  ContentWrapper,
} from "./PayoutRequestDetail.styles";

export function PayoutRequestDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: request, isLoading, isError, error } = usePayoutRequest(id);
  const { handleApprove, handleReject, isApproving, isRejecting } =
    usePayoutActions(request);

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
              <ButtonGroup>
                <RejectButton
                  onClick={handleReject}
                  disabled={isApproving || isRejecting}
                >
                  {isRejecting ? "Rejecting..." : "Reject Request"}
                </RejectButton>
                <ApproveButton
                  onClick={handleApprove}
                  disabled={isApproving || isRejecting}
                >
                  {isApproving ? "Approving..." : "Approve Payout"}
                </ApproveButton>
              </ButtonGroup>
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
