"use client";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  FileText,
  ReceiptText,
  ShoppingBag,
  Wallet,
  X,
} from "lucide-react";
import { usePayoutRequest } from "../../../hooks/api";
import { usePayoutActions } from "./usePayoutActions";
import {
  AllCreatorsPanel,
  AllCreatorsState,
  StatusBadge,
} from "../all-creators/AllCreators.styles";
import { toCreatorStatus } from "../../../utils/status";
import { payoutTabHref } from "../../../utils/payout";
import {
  Page,
  BackButton,
  Card,
  CreatorHeader,
  CreatorIdentity,
  Avatar,
  CreatorText,
  NameRow,
  ButtonGroup,
  ApproveButton,
  RejectButton,
  SummaryGrid,
  SummaryCard,
  SummaryLabel,
  SummaryValue,
  Caption,
  DetailColumns,
  SectionHeader,
  FeeRows,
  FeeRow,
  FeeNote,
  NetRow,
  Metadata,
  WalletRow,
  FeeError,
} from "./PayoutRequestDetail.styles";

function money(
  value: string | number | null | undefined,
  currency: string | null,
) {
  if (value == null || value === "" || !Number.isFinite(Number(value)))
    return "N/A";
  return `${new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(value))}${currency ? ` ${currency}` : ""}`;
}

function percent(ratio: number) {
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  }).format(ratio);
}

export function PayoutRequestDetail({ id }: { id: string }) {
  const router = useRouter();
  const { data: request, isLoading, isError, error } = usePayoutRequest(id);
  const { handleApprove, handleReject, isApproving, isRejecting } =
    usePayoutActions(request);

  if (isLoading || isError || !request) {
    return (
      <Page>
        <AllCreatorsPanel>
          <AllCreatorsState>
            {isLoading
              ? "Loading payout request details..."
              : error?.message || "Failed to load payout request details."}
          </AllCreatorsState>
        </AllCreatorsPanel>
      </Page>
    );
  }

  const initials =
    request.fullName
      ?.trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((name) => name[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";
  const breakdown = request.feeBreakdown;
  const hasFeeError = !!request.feeCalculationError;
  const netAmount = hasFeeError
    ? "N/A"
    : money(request.payableAmount, request.currency);
  const deduction = (value: string) => {
    const amount = hasFeeError ? "N/A" : money(value, request.currency);
    return amount === "N/A" ? amount : `−${amount}`;
  };
  const requestedAt =
    request.createdAt && Number.isFinite(new Date(request.createdAt).getTime())
      ? new Intl.DateTimeFormat("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }).format(new Date(request.createdAt))
      : "N/A";

  return (
    <Page>
      <BackButton onClick={() => router.push(payoutTabHref("requests"))}>
        <ArrowLeft size={15} aria-hidden="true" /> Back to Payout Requests
      </BackButton>

      <CreatorHeader>
        <CreatorIdentity>
          <Avatar aria-hidden="true">{initials}</Avatar>
          <CreatorText>
            <NameRow>
              <h2>{request.fullName || "Unknown Creator"}</h2>
              <StatusBadge $status={toCreatorStatus(request.status)}>
                {request.status}
              </StatusBadge>
            </NameRow>
            <p>{request.email || "No email"}</p>
          </CreatorText>
        </CreatorIdentity>
        {request.status === "pending" && (
          <ButtonGroup>
            <RejectButton
              onClick={handleReject}
              disabled={isApproving || isRejecting}
            >
              <X size={15} aria-hidden="true" />{" "}
              {isRejecting ? "Rejecting..." : "Reject Request"}
            </RejectButton>
            <ApproveButton
              onClick={handleApprove}
              disabled={isApproving || isRejecting || hasFeeError}
            >
              <Check size={16} aria-hidden="true" />{" "}
              {isApproving ? "Approving..." : "Approve Payout"}
            </ApproveButton>
          </ButtonGroup>
        )}
      </CreatorHeader>

      <SummaryGrid>
        <SummaryCard>
          <SummaryLabel>
            <Wallet size={15} aria-hidden="true" /> Gross Amount
          </SummaryLabel>
          <SummaryValue>
            {money(request.rawAmount, request.currency)}
          </SummaryValue>
          <Caption>Requested amount before fees</Caption>
        </SummaryCard>
        <SummaryCard>
          <SummaryLabel>
            <ShoppingBag size={15} aria-hidden="true" /> Total Sales
          </SummaryLabel>
          <SummaryValue>
            {breakdown?.saleCount != null
              ? new Intl.NumberFormat("en-US").format(breakdown.saleCount)
              : "N/A"}
          </SummaryValue>
          <Caption>Included in this payout</Caption>
        </SummaryCard>
        <SummaryCard $accent>
          <SummaryLabel>
            <ArrowUpRight size={15} aria-hidden="true" /> Net Payable Amount
          </SummaryLabel>
          <SummaryValue>{netAmount}</SummaryValue>
          <Caption>After Kiibee and acquirer fees</Caption>
        </SummaryCard>
      </SummaryGrid>

      <DetailColumns>
        <Card>
          <SectionHeader>
            <ReceiptText size={18} aria-hidden="true" />
            <h3>Payout breakdown</h3>
          </SectionHeader>
          {hasFeeError && (
            <FeeError role="alert">{request.feeCalculationError}</FeeError>
          )}
          <FeeRows>
            <FeeRow>
              <dt>
                Gross sales<FeeNote>Total amount before deductions</FeeNote>
              </dt>
              <dd>{money(request.rawAmount, request.currency)}</dd>
            </FeeRow>
            <FeeRow>
              <dt>
                Kiibee fee
                {breakdown && (
                  <FeeNote>
                    {breakdown.fixedPlatformFee != null
                      ? `${breakdown.saleCount != null ? `${breakdown.saleCount} sales × ` : "Per sale: "}${money(breakdown.fixedPlatformFee, request.currency)}`
                      : `${percent(breakdown.platformFeePercentage)} of gross sales`}
                  </FeeNote>
                )}
              </dt>
              <dd>{deduction(request.platformFee)}</dd>
            </FeeRow>
            <FeeRow>
              <dt>
                Acquirer fee
                {breakdown && (
                  <FeeNote>
                    {percent(breakdown.processingFeePercentage)} of gross sales
                  </FeeNote>
                )}
              </dt>
              <dd>{deduction(request.processingFee)}</dd>
            </FeeRow>
          </FeeRows>
          <NetRow>
            <span>Net payout</span>
            <strong>{netAmount}</strong>
          </NetRow>
        </Card>
        <Card>
          <SectionHeader>
            <FileText size={18} aria-hidden="true" />
            <h3>Request information</h3>
          </SectionHeader>
          <Metadata>
            <div>
              <dt>Date requested</dt>
              <dd>{requestedAt}</dd>
            </div>
            <div>
              <dt>Request ID</dt>
              <dd data-id>{request.id}</dd>
            </div>
            <div>
              <dt>Payout ID</dt>
              <dd data-id>{request.payoutId}</dd>
            </div>
            <div>
              <dt>Payment method ID</dt>
              <dd data-id>{request.paymentMethodId || "N/A"}</dd>
            </div>
          </Metadata>
          <WalletRow>
            <span>
              <Wallet size={16} aria-hidden="true" /> Current wallet balance
            </span>
            <strong>
              {money(request.walletBalance, request.walletCurrency)}
            </strong>
          </WalletRow>
        </Card>
      </DetailColumns>
    </Page>
  );
}
