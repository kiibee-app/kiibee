"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  useViewer,
  useViewerExpiredRentedData,
  useViewerPurchasedData,
  useViewerRentedData,
  useViewerSales,
} from "../../../hooks/api";
import { formatRequestedAt } from "../../../utils/date";
import {
  formatViewerStatus,
  getViewerDisplayName,
  getViewerInitials,
  viewerLabels,
} from "../../../utils/viewersConfig";
import { AccountStatusBadge } from "../all-creators/AllCreators.styles";
import { ViewerSalesHistoryList } from "../all-creators/ViewerSalesHistoryList";
import { ViewerContentGrid, getViewerContentCount } from "./ViewerContentGrid";
import {
  BackLink,
  DetailsLayout,
  DetailsSection,
  DetailsSectionBody,
  DetailsSectionHeader,
  DetailsSectionTitle,
  DetailsTabButton,
  DetailsTabs,
  InfoGrid,
  InfoItem,
  InfoLabel,
  InfoValue,
  LoadingState,
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
  ProfileEmail,
  ProfileHero,
  ProfileInfo,
  ProfileMeta,
  ProfileName,
  StatCard,
  StatLabel,
  StatValue,
  StatsRow,
  SubsectionBlock,
  SubsectionTitle,
  ViewersState,
} from "./Viewers.styles";

const DETAILS_TAB = {
  PROFILE: "profile",
  BILLING: "billing",
  PURCHASES: "purchases",
  RENTALS: "rentals",
} as const;

type DetailsTab = (typeof DETAILS_TAB)[keyof typeof DETAILS_TAB];

type ViewerDetailsProps = {
  viewerId: string;
};

function formatValue(value: string | null | undefined) {
  return value?.trim() || viewerLabels.notProvided;
}

export function ViewerDetails({ viewerId }: ViewerDetailsProps) {
  const [activeTab, setActiveTab] = useState<DetailsTab>(DETAILS_TAB.PROFILE);
  const viewerQuery = useViewer(viewerId);
  const salesQuery = useViewerSales(viewerId);
  const purchasedQuery = useViewerPurchasedData(viewerId);
  const rentedQuery = useViewerRentedData(viewerId);
  const expiredRentedQuery = useViewerExpiredRentedData(viewerId);

  if (viewerQuery.isLoading) {
    return <LoadingState>Loading viewer details…</LoadingState>;
  }

  if (viewerQuery.isError || !viewerQuery.data) {
    return (
      <ViewersState>
        {viewerQuery.error?.message || "Failed to load viewer details."}
      </ViewersState>
    );
  }

  const viewer = viewerQuery.data;
  const displayName = getViewerDisplayName(viewer);
  const sales = salesQuery.data ?? [];
  const purchasedCount = purchasedQuery.data
    ? getViewerContentCount(purchasedQuery.data)
    : viewer.purchaseCount;
  const activeRentalCount = rentedQuery.data
    ? getViewerContentCount(rentedQuery.data)
    : viewer.rentalCount;
  const expiredRentalCount = expiredRentedQuery.data
    ? getViewerContentCount(expiredRentedQuery.data)
    : 0;

  return (
    <DetailsLayout>
      <BackLink href="/viewers">
        <ArrowLeft size={16} />
        Back to viewers
      </BackLink>

      <ProfileHero>
        <ProfileAvatar>
          {viewer.avatarUrl ? (
            <ProfileAvatarImage src={viewer.avatarUrl} alt={displayName} />
          ) : (
            <ProfileAvatarFallback>
              {getViewerInitials(displayName)}
            </ProfileAvatarFallback>
          )}
        </ProfileAvatar>
        <ProfileInfo>
          <ProfileName>{displayName}</ProfileName>
          <ProfileEmail>{viewer.email}</ProfileEmail>
          <ProfileMeta>
            <AccountStatusBadge $status={viewer.status}>
              {formatViewerStatus(viewer.status)}
            </AccountStatusBadge>
          </ProfileMeta>
        </ProfileInfo>
      </ProfileHero>

      <StatsRow>
        <StatCard>
          <StatLabel>Purchased</StatLabel>
          <StatValue>{purchasedCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Active Rentals</StatLabel>
          <StatValue>{activeRentalCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Previously Rented</StatLabel>
          <StatValue>{expiredRentalCount}</StatValue>
        </StatCard>
      </StatsRow>

      <DetailsTabs aria-label="Viewer detail sections">
        <DetailsTabButton
          type="button"
          $active={activeTab === DETAILS_TAB.PROFILE}
          onClick={() => setActiveTab(DETAILS_TAB.PROFILE)}
        >
          Profile
        </DetailsTabButton>
        <DetailsTabButton
          type="button"
          $active={activeTab === DETAILS_TAB.BILLING}
          onClick={() => setActiveTab(DETAILS_TAB.BILLING)}
        >
          Billing History ({sales.length})
        </DetailsTabButton>
        <DetailsTabButton
          type="button"
          $active={activeTab === DETAILS_TAB.PURCHASES}
          onClick={() => setActiveTab(DETAILS_TAB.PURCHASES)}
        >
          Purchased ({purchasedCount})
        </DetailsTabButton>
        <DetailsTabButton
          type="button"
          $active={activeTab === DETAILS_TAB.RENTALS}
          onClick={() => setActiveTab(DETAILS_TAB.RENTALS)}
        >
          Rentals ({activeRentalCount + expiredRentalCount})
        </DetailsTabButton>
      </DetailsTabs>

      {activeTab === DETAILS_TAB.PROFILE ? (
        <DetailsSection>
          <DetailsSectionHeader>
            <DetailsSectionTitle>Profile Details</DetailsSectionTitle>
          </DetailsSectionHeader>
          <DetailsSectionBody>
            <InfoGrid>
              <InfoItem>
                <InfoLabel>First Name</InfoLabel>
                <InfoValue>{formatValue(viewer.firstName)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Last Name</InfoLabel>
                <InfoValue>{formatValue(viewer.lastName)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Email</InfoLabel>
                <InfoValue>
                  {viewer.email}{" "}
                  {viewer.isEmailVerified ? "(Verified)" : "(Unverified)"}
                </InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Phone</InfoLabel>
                <InfoValue>{formatValue(viewer.phone)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Address</InfoLabel>
                <InfoValue>{formatValue(viewer.address)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>City</InfoLabel>
                <InfoValue>{formatValue(viewer.city)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Postal Code</InfoLabel>
                <InfoValue>{formatValue(viewer.postalCode)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>CVR</InfoLabel>
                <InfoValue>{formatValue(viewer.cvr)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Account ID</InfoLabel>
                <InfoValue>{viewer.id}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Role</InfoLabel>
                <InfoValue>{viewer.role}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Joined</InfoLabel>
                <InfoValue>{formatRequestedAt(viewer.createdAt)}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Last Updated</InfoLabel>
                <InfoValue>{formatRequestedAt(viewer.updatedAt)}</InfoValue>
              </InfoItem>
            </InfoGrid>
          </DetailsSectionBody>
        </DetailsSection>
      ) : null}

      {activeTab === DETAILS_TAB.BILLING ? (
        <DetailsSection>
          <DetailsSectionHeader>
            <DetailsSectionTitle>Billing History</DetailsSectionTitle>
          </DetailsSectionHeader>
          <DetailsSectionBody>
            <ViewerSalesHistoryList
              isLoading={salesQuery.isLoading}
              isError={salesQuery.isError}
              errorMessage={salesQuery.error?.message}
              sales={sales}
            />
          </DetailsSectionBody>
        </DetailsSection>
      ) : null}

      {activeTab === DETAILS_TAB.PURCHASES ? (
        <DetailsSection>
          <DetailsSectionHeader>
            <DetailsSectionTitle>All Purchased Content</DetailsSectionTitle>
          </DetailsSectionHeader>
          <DetailsSectionBody>
            {purchasedQuery.isLoading ? (
              <LoadingState>Loading purchased content…</LoadingState>
            ) : purchasedQuery.isError ? (
              <ViewersState>
                {purchasedQuery.error?.message ||
                  "Failed to load purchased content."}
              </ViewersState>
            ) : (
              <ViewerContentGrid
                data={purchasedQuery.data!}
                emptyMessage="No purchased content yet."
              />
            )}
          </DetailsSectionBody>
        </DetailsSection>
      ) : null}

      {activeTab === DETAILS_TAB.RENTALS ? (
        <DetailsSection>
          <DetailsSectionHeader>
            <DetailsSectionTitle>Rental History</DetailsSectionTitle>
          </DetailsSectionHeader>
          <DetailsSectionBody>
            <SubsectionBlock>
              <SubsectionTitle>
                Active Rentals ({activeRentalCount})
              </SubsectionTitle>
              {rentedQuery.isLoading ? (
                <LoadingState>Loading active rentals…</LoadingState>
              ) : rentedQuery.isError ? (
                <ViewersState>
                  {rentedQuery.error?.message ||
                    "Failed to load active rentals."}
                </ViewersState>
              ) : (
                <ViewerContentGrid
                  data={rentedQuery.data!}
                  rentalMode="active"
                  emptyMessage="No active rentals."
                />
              )}
            </SubsectionBlock>

            <SubsectionBlock>
              <SubsectionTitle>
                Previously Rented ({expiredRentalCount})
              </SubsectionTitle>
              {expiredRentedQuery.isLoading ? (
                <LoadingState>Loading rental history…</LoadingState>
              ) : expiredRentedQuery.isError ? (
                <ViewersState>
                  {expiredRentedQuery.error?.message ||
                    "Failed to load previously rented content."}
                </ViewersState>
              ) : (
                <ViewerContentGrid
                  data={expiredRentedQuery.data!}
                  rentalMode="expired"
                  emptyMessage="No previously rented content."
                />
              )}
            </SubsectionBlock>
          </DetailsSectionBody>
        </DetailsSection>
      ) : null}
    </DetailsLayout>
  );
}
