"use client";

import { useState, type ReactNode } from "react";
import { Drawer } from "../../common/Drawer";
import type { ExistingCreator } from "../../../types/existing-creator";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Layers,
  Database,
  Building2,
  Globe,
  FileText,
  ShieldCheck,
  Video,
  Users,
} from "lucide-react";
import {
  DrawerHeaderCard,
  AvatarCircle,
  DrawerHeaderName,
  DrawerHeaderEmail,
  DrawerSection,
  DrawerSectionTitle,
  DrawerCardList,
  DrawerCardItem,
  InteractiveDrawerCardItem,
  DrawerIconWrapper,
  DrawerItemContent,
  DrawerItemLabel,
  DrawerItemValue,
  LinkText,
  DrawerAvatarImage,
  AccountStatusBadge,
} from "./AllCreators.styles";
import { CreatorUploadsList } from "./CreatorUploadsList";
import { CreatorUploadDetail } from "./CreatorUploadDetail";
import type { UploadItem } from "../../../hooks/api";
import {
  existingCreatorLabels,
  formatCreatorUploadsTitle,
} from "../../../utils/existingCreatorsConfig";

export type ExistingCreatorDetailsModalProps = {
  creator: ExistingCreator | null;
  onClose: () => void;
};

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <DrawerCardItem>
      <DrawerIconWrapper>{icon}</DrawerIconWrapper>
      <DrawerItemContent>
        <DrawerItemLabel>{label}</DrawerItemLabel>
        <DrawerItemValue>{value}</DrawerItemValue>
      </DrawerItemContent>
    </DrawerCardItem>
  );
}

export function ExistingCreatorDetailsModal({
  creator,
  onClose,
}: ExistingCreatorDetailsModalProps) {
  if (!creator) return null;

  const initials =
    (
      (creator.firstName?.[0] || "") + (creator.lastName?.[0] || "")
    ).toUpperCase() || "CR";

  const drawerTitle = existingCreatorLabels.creatorDetailsTitle;

  return (
    <Drawer title={drawerTitle} open={Boolean(creator)} onClose={onClose}>
      <DrawerHeaderCard>
        {creator.avatarUrl ? (
          <DrawerAvatarImage
            src={creator.avatarUrl}
            alt={creator.fullName ?? undefined}
          />
        ) : (
          <AvatarCircle>{initials}</AvatarCircle>
        )}
        <DrawerHeaderName>{creator.fullName}</DrawerHeaderName>
        <DrawerHeaderEmail>{creator.email}</DrawerHeaderEmail>
        <AccountStatusBadge $status={creator.status}>
          {creator.status}
        </AccountStatusBadge>
      </DrawerHeaderCard>

      <DrawerSection>
        <DrawerSectionTitle>
          <User size={14} /> Contact Information
        </DrawerSectionTitle>
        <DrawerCardList>
          <InfoRow
            icon={<Mail size={16} />}
            label="Email Address"
            value={`${creator.email} ${creator.isEmailVerified ? "(Verified)" : "(Unverified)"}`}
          />
          <InfoRow
            icon={<Phone size={16} />}
            label="Phone Number"
            value={creator.phone || "Not provided"}
          />
          <InfoRow
            icon={<MapPin size={16} />}
            label="City"
            value={creator.city || "Not provided"}
          />
        </DrawerCardList>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <Building2 size={14} /> Professional Details
        </DrawerSectionTitle>
        <DrawerCardList>
          <InfoRow
            icon={<Layers size={16} />}
            label="CVR / Business ID"
            value={creator.cvr}
          />
          <InfoRow
            icon={<Building2 size={16} />}
            label="Company Name"
            value={creator.companyName}
          />
        </DrawerCardList>
      </DrawerSection>

      {/* Channel */}
      <DrawerSection>
        <DrawerSectionTitle>
          <Globe size={14} /> Channel Details
        </DrawerSectionTitle>
        <DrawerCardList>
          <InfoRow
            icon={<Globe size={16} />}
            label="Channel Name"
            value={creator.channelName || "N/A"}
          />
          <InfoRow
            icon={
              <LinkText href="#" as="span">
                @
              </LinkText>
            }
            label="Channel Slug"
            value={creator.channelSlug ? `/${creator.channelSlug}` : "N/A"}
          />
          <InfoRow
            icon={<FileText size={16} />}
            label="Plan Name"
            value={creator.planName || "N/A"}
          />
        </DrawerCardList>
      </DrawerSection>

      {/* Content Stats */}
      <DrawerSection>
        <DrawerSectionTitle>
          <Video size={14} /> Content Statistics
        </DrawerSectionTitle>
        <DrawerCardList>
          <InfoRow
            icon={<Video size={16} />}
            label="Uploads"
            value={creator.uploadCount}
          />
          <InfoRow
            icon={<Users size={16} />}
            label="Subscribers"
            value={creator.subscriberCount}
          />
        </DrawerCardList>
      </DrawerSection>

      {/* System Info */}
      <DrawerSection>
        <DrawerSectionTitle>
          <Database size={14} /> System Info &amp; Status
        </DrawerSectionTitle>
        <DrawerCardList>
          <InfoRow
            icon={<Database size={16} />}
            label="Account ID"
            value={creator.id}
          />
          <InfoRow
            icon={<ShieldCheck size={16} />}
            label="Role"
            value={creator.role}
          />
          <InfoRow
            icon={<Calendar size={16} />}
            label="Timeline"
            value={
              <>
                Created: {new Date(creator.createdAt).toLocaleString()}
                <br />
                Updated: {new Date(creator.updatedAt).toLocaleString()}
              </>
            }
          />
        </DrawerCardList>
      </DrawerSection>
    </Drawer>
  );
}
