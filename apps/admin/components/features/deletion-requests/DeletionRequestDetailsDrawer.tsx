"use client";

import type { CreatorDeletionRequest } from "../../../types/creator-deletion-request";
import { Drawer, InfoRow } from "../../common/Drawer";
import {
  AvatarCircle,
  DrawerCardList,
  DrawerHeaderCard,
  DrawerHeaderEmail,
  DrawerHeaderName,
  DrawerSection,
  DrawerSectionTitle,
  DescriptionBlock,
  StatusBadge,
} from "../all-creators/AllCreators.styles";
import { User, Mail, Calendar, FileText, MessageSquare } from "lucide-react";
import { CreatorDeletionRequestActions } from "./CreatorDeletionRequestActions";
import type { CreatorDeletionRequestActionConfig } from "../../../types/deletion-requests-table";

type DeletionRequestDetailsDrawerProps = {
  request: CreatorDeletionRequest | null;
  onClose: () => void;
  actions?: CreatorDeletionRequestActionConfig;
};

export function DeletionRequestDetailsDrawer({
  request,
  onClose,
  actions,
}: DeletionRequestDetailsDrawerProps) {
  if (!request) return null;

  const initials = (
    (request.user.firstName?.[0] || "") + (request.user.lastName?.[0] || "")
  ).toUpperCase();

  return (
    <Drawer
      title="Deletion Request Details"
      open={Boolean(request)}
      onClose={onClose}
    >
      <DrawerHeaderCard>
        <AvatarCircle>{initials}</AvatarCircle>
        <DrawerHeaderName>{request.user.fullName}</DrawerHeaderName>
        <DrawerHeaderEmail>{request.user.email}</DrawerHeaderEmail>
        <StatusBadge $status={request.status}>{request.status}</StatusBadge>
      </DrawerHeaderCard>

      <DrawerSection>
        <DrawerSectionTitle>
          <User size={14} /> Contact Information
        </DrawerSectionTitle>
        <DrawerCardList>
          <InfoRow
            icon={<Mail size={16} />}
            label="Email Address"
            value={request.user.email}
          />
          <InfoRow
            icon={<User size={16} />}
            label="Full Name"
            value={request.user.fullName}
          />
          <InfoRow
            icon={<User size={16} />}
            label="Role"
            value={request.user.role}
          />
        </DrawerCardList>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <MessageSquare size={14} /> Reason for Deletion
        </DrawerSectionTitle>
        <DescriptionBlock>
          {request.reason || "No reason provided."}
        </DescriptionBlock>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <FileText size={14} /> Request Info
        </DrawerSectionTitle>
        <DrawerCardList>
          <InfoRow
            icon={<Calendar size={16} />}
            label="Requested At"
            value={new Date(request.createdAt).toLocaleString()}
          />
          <InfoRow
            icon={<Calendar size={16} />}
            label="Last Updated"
            value={new Date(request.updatedAt).toLocaleString()}
          />
        </DrawerCardList>
      </DrawerSection>

      {actions && (
        <DrawerSection>
          <CreatorDeletionRequestActions request={request} actions={actions} />
        </DrawerSection>
      )}
    </Drawer>
  );
}
