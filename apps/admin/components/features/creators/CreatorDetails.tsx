"use client";

import toast from "react-hot-toast";
import { useCloseCreator } from "../../../hooks/api/use-close-creator";
import { CloseCreatorModal } from "./CloseCreatorModal";
import {
  CreatorProfileHero,
  CloseAccountButton,
} from "./CreatorDetails.styles";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil } from "lucide-react";
import { useCreator, useCreatorContents } from "../../../hooks/api";
import {
  existingCreatorLabels,
  formatExistingCreatorStatus,
  getExistingCreatorDisplayName,
  getExistingCreatorInitials,
} from "../../../utils/existingCreatorsConfig";
import { creatorContentGridLabels } from "../../../utils/contentConfig";
import { formatRequestedAt } from "../../../utils/date";
import { AccountStatusBadge } from "../all-creators/AllCreators.styles";
import { CreatorContentGrid } from "./CreatorContentGrid";
import { ChannelLink } from "../../common/ChannelLink";
import { EditCreatorProfileModal } from "./EditCreatorProfileModal";
import {
  BackLink,
  DetailsLayout,
  DetailsSection,
  DetailsSectionAction,
  DetailsSectionButton,
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const closeCreator = useCloseCreator();
  const handleCloseAccount = async () => {
    try {
      await closeCreator.mutateAsync(creatorId);
      toast.success("Creator account closed. Notification email queued.");
      router.replace("/all-creators?tab=closed");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not close account. Please try again.",
      );
    }
  };
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
  const totalBought = contents.reduce(
    (sum, item) => sum + (item.purchaseCount ?? 0),
    0,
  );
  const totalEmailRegistered = contents.reduce(
    (sum, item) => sum + (item.emailRegisteredCount ?? 0),
    0,
  );

  const totalPurchases = totalBought + totalEmailRegistered;
  const totalRentals = contents.reduce(
    (sum, item) => sum + item.rentalCount,
    0,
  );
  const totalDownloads = contents.reduce(
    (sum, item) => sum + item.downloadCount,
    0,
  );

  const stats = [
    { count: totalBought, label: creatorContentGridLabels.boughtSuffix },
    {
      count: totalEmailRegistered,
      label: creatorContentGridLabels.emailRegisteredSuffix,
    },
    { count: totalRentals, label: creatorContentGridLabels.rentedSuffix },
    { count: totalDownloads, label: creatorContentGridLabels.downloadsSuffix },
  ];

  const summaryParts = [
    `Content (${contents.length})`,
    ...stats.filter((s) => s.count > 0).map((s) => `${s.count} ${s.label}`),
  ];

  return (
    <DetailsLayout>
      <BackLink href="/all-creators">
        <ArrowLeft size={16} />
        Back to creators
      </BackLink>

      <CreatorProfileHero>
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
        <CloseAccountButton
          type="button"
          disabled={closeCreator.isPending}
          onClick={() => {
            closeCreator.reset();
            setIsCloseModalOpen(true);
          }}
        >
          Close account
        </CloseAccountButton>
      </CreatorProfileHero>

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
          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <DetailsSectionButton
              type="button"
              onClick={() => setIsEditModalOpen(true)}
            >
              <Pencil size={14} />
              Edit Profile
            </DetailsSectionButton>
            <DetailsSectionAction
              href={`/all-creators/${creatorId}/subscription`}
            >
              Manage Subscription
            </DetailsSectionAction>
            <DetailsSectionAction
              href={`/all-creators/${creatorId}/billing-history`}
            >
              Billing History
            </DetailsSectionAction>
            <DetailsSectionAction
              href={`/all-creators/${creatorId}/appearance`}
            >
              Update creator setting
            </DetailsSectionAction>
          </div>
        </DetailsSectionHeader>
        <DetailsSectionBody>
          <InfoGrid>
            <InfoItem>
              <InfoLabel>Owner</InfoLabel>
              <InfoValue>{displayName}</InfoValue>
            </InfoItem>
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
              <InfoValue>
                {formatValue(creator.companyName || displayName)}
              </InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>CVR</InfoLabel>
              <InfoValue>{formatValue(creator.cvr)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Address</InfoLabel>
              <InfoValue>{formatValue(creator.address)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Postal Code</InfoLabel>
              <InfoValue>{formatValue(creator.postalCode)}</InfoValue>
            </InfoItem>
            <InfoItem>
              <InfoLabel>Channel</InfoLabel>
              <InfoValue>
                <ChannelLink
                  creatorId={creator.id}
                  channelName={creator.channelName || displayName}
                  companyName={creator.companyName || displayName}
                  layout={creator.layout}
                  channelSlug={creator.channelSlug}
                  fallbackLabel={existingCreatorLabels.noChannel}
                />
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
          <DetailsSectionTitle>{summaryParts.join(" · ")}</DetailsSectionTitle>
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

      <CloseCreatorModal
        open={isCloseModalOpen}
        email={creator.email}
        isSubmitting={closeCreator.isPending}
        error={closeCreator.error?.message}
        onClose={() => setIsCloseModalOpen(false)}
        onConfirm={handleCloseAccount}
      />

      <EditCreatorProfileModal
        creator={creator}
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </DetailsLayout>
  );
}
