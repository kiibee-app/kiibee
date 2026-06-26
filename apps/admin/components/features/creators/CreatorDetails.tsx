"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useCreator, useCreatorContents } from "../../../hooks/api";
import {
  existingCreatorLabels,
  formatExistingCreatorStatus,
  getExistingCreatorDisplayName,
  getExistingCreatorInitials,
} from "../../../utils/existingCreatorsConfig";
import { formatRequestedAt } from "../../../utils/date";
import { AccountStatusBadge } from "../all-creators/AllCreators.styles";
import { CreatorContentGrid } from "./CreatorContentGrid";
import {
  BackLink,
  DetailsLayout,
  DetailsSection,
  DetailsSectionBody,
  DetailsSectionHeader,
  DetailsSectionTitle,
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
  ViewersState,
} from "../viewers/Viewers.styles";

type CreatorDetailsProps = {
  creatorId: string;
};

function formatValue(value: string | null | undefined) {
  return value?.trim() || existingCreatorLabels.notProvided;
}

export function CreatorDetails({ creatorId }: CreatorDetailsProps) {
  const router = useRouter();
  const creatorQuery = useCreator(creatorId);
  const contentsQuery = useCreatorContents(creatorId);

  if (creatorQuery.isLoading) {
    return <LoadingState>Loading creator details…</LoadingState>;
  }

  if (creatorQuery.isError || !creatorQuery.data) {
    return (
      <ViewersState>
        {creatorQuery.error?.message || "Failed to load creator details."}
      </ViewersState>
    );
  }

  const creator = creatorQuery.data;
  const displayName = getExistingCreatorDisplayName(creator);
  const contents = contentsQuery.data ?? [];
  const totalPurchases = contents.reduce(
    (sum, item) => sum + item.purchaseCount,
    0,
  );
  const totalRentals = contents.reduce(
    (sum, item) => sum + item.rentalCount,
    0,
  );
  const totalDownloads = contents.reduce(
    (sum, item) => sum + item.downloadCount,
    0,
  );

  return (
    <DetailsLayout>
      <BackLink href="/all-creators">
        <ArrowLeft size={16} />
        Back to creators
      </BackLink>

      <ProfileHero>
        <ProfileAvatar>
          {creator.avatarUrl ? (
            <ProfileAvatarImage src={creator.avatarUrl} alt={displayName} />
          ) : (
            <ProfileAvatarFallback>
              {getExistingCreatorInitials(displayName)}
            </ProfileAvatarFallback>
          )}
        </ProfileAvatar>
        <ProfileInfo>
          <ProfileName>{displayName}</ProfileName>
          <ProfileEmail>{creator.email}</ProfileEmail>
          <ProfileMeta>
            <AccountStatusBadge $status={creator.status}>
              {formatExistingCreatorStatus(creator.status)}
            </AccountStatusBadge>
          </ProfileMeta>
        </ProfileInfo>
      </ProfileHero>

      <StatsRow>
        <StatCard>
          <StatLabel>Uploads</StatLabel>
          <StatValue>{creator.uploadCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Subscribers</StatLabel>
          <StatValue>{creator.subscriberCount}</StatValue>
        </StatCard>
        <StatCard>
          <StatLabel>Total Sales</StatLabel>
          <StatValue>{totalPurchases + totalRentals}</StatValue>
        </StatCard>
      </StatsRow>

      <DetailsSection>
        <DetailsSectionHeader>
          <DetailsSectionTitle>Profile Details</DetailsSectionTitle>
        </DetailsSectionHeader>
        <DetailsSectionBody>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Email</InfoLabel>
              <InfoValue>
                {creator.email}{" "}
                {creator.isEmailVerified ? "(Verified)" : "(Unverified)"}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Phone</InfoLabel>
              <InfoValue>{formatValue(creator.phone)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>City</InfoLabel>
              <InfoValue>{formatValue(creator.city)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Company</InfoLabel>
              <InfoValue>{formatValue(creator.companyName)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>CVR</InfoLabel>
              <InfoValue>{formatValue(creator.cvr)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Channel</InfoLabel>
              <InfoValue>
                {creator.channelName || existingCreatorLabels.noChannel}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Plan</InfoLabel>
              <InfoValue>
                {creator.planName || existingCreatorLabels.noPlan}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Joined</InfoLabel>
              <InfoValue>{formatRequestedAt(creator.createdAt)}</InfoValue>
            </InfoItem>
          </InfoGrid>
        </DetailsSectionBody>
      </DetailsSection>

      <DetailsSection>
        <DetailsSectionHeader>
          <DetailsSectionTitle>
            Content ({contents.length}) · {totalPurchases} bought ·{" "}
            {totalRentals} rented · {totalDownloads} downloads
          </DetailsSectionTitle>
        </DetailsSectionHeader>
        <DetailsSectionBody>
          {contentsQuery.isLoading ? (
            <LoadingState>Loading content…</LoadingState>
          ) : contentsQuery.isError ? (
            <ViewersState>
              {contentsQuery.error?.message || "Failed to load content."}
            </ViewersState>
          ) : (
            <CreatorContentGrid
              contents={contents}
              onSelectContent={(content) =>
                router.push(`/all-creators/${creatorId}/content/${content.id}`)
              }
              emptyMessage="No content uploaded yet."
            />
          )}
        </DetailsSectionBody>
      </DetailsSection>
    </DetailsLayout>
  );
}
