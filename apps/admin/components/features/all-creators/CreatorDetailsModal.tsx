"use client";

import { Modal } from "../../common/Modal";
import type { CreatorRequest } from "../../../types/creator-request";
import {
  DetailGrid,
  DetailItem,
  DetailLabel,
  DetailValue,
  LinkText,
} from "./AllCreators.styles";

interface CreatorDetailsModalProps {
  creator: CreatorRequest | null;
  onClose: () => void;
}

export function CreatorDetailsModal({
  creator,
  onClose,
}: CreatorDetailsModalProps) {
  return (
    <Modal
      title={creator ? `${creator.fullName} Details` : "Creator Details"}
      open={Boolean(creator)}
      onClose={onClose}
    >
      {creator ? (
        <DetailGrid>
          <DetailItem>
            <DetailLabel>ID</DetailLabel>
            <DetailValue>{creator.id}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Full Name</DetailLabel>
            <DetailValue>{creator.fullName}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>First Name</DetailLabel>
            <DetailValue>{creator.firstName}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Last Name</DetailLabel>
            <DetailValue>{creator.lastName}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Email</DetailLabel>
            <DetailValue>{creator.email}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Phone</DetailLabel>
            <DetailValue>{creator.phone}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>CVR</DetailLabel>
            <DetailValue>{creator.cvr}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Status</DetailLabel>
            <DetailValue>{creator.status}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Address</DetailLabel>
            <DetailValue>{creator.address}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>City</DetailLabel>
            <DetailValue>{creator.city}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Postal Code</DetailLabel>
            <DetailValue>{creator.postalCode}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Example Work Link</DetailLabel>
            <DetailValue>
              <LinkText
                href={creator.exampleWorkLink}
                target="_blank"
                rel="noreferrer"
              >
                {creator.exampleWorkLink}
              </LinkText>
            </DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Approved User ID</DetailLabel>
            <DetailValue>{creator.approvedUserId ?? "null"}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Is Deleted</DetailLabel>
            <DetailValue>{String(creator.isDeleted)}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Deleted At</DetailLabel>
            <DetailValue>{creator.deletedAt ?? "null"}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Created At</DetailLabel>
            <DetailValue>{creator.createdAt}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Updated At</DetailLabel>
            <DetailValue>{creator.updatedAt}</DetailValue>
          </DetailItem>
          <DetailItem>
            <DetailLabel>Content Description</DetailLabel>
            <DetailValue>{creator.contentDescription}</DetailValue>
          </DetailItem>
        </DetailGrid>
      ) : null}
    </Modal>
  );
}
