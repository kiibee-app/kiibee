"use client";

import { Modal } from "../../common/Modal";
import type {
  CreatorDetailFieldConfig,
  CreatorDetailsModalProps,
} from "../../../types/creator-details-modal";
import {
  DetailField,
  DetailFieldLabel,
  DetailFieldValue,
  DetailsGrid,
  LinkText,
} from "./AllCreators.styles";

const creatorDetailFields: CreatorDetailFieldConfig[] = [
  { key: "id", label: "ID", renderValue: (creator) => creator.id },
  {
    key: "fullName",
    label: "Full Name",
    renderValue: (creator) => creator.fullName,
  },
  {
    key: "firstName",
    label: "First Name",
    renderValue: (creator) => creator.firstName,
  },
  {
    key: "lastName",
    label: "Last Name",
    renderValue: (creator) => creator.lastName,
  },
  { key: "email", label: "Email", renderValue: (creator) => creator.email },
  { key: "phone", label: "Phone", renderValue: (creator) => creator.phone },
  { key: "cvr", label: "CVR", renderValue: (creator) => creator.cvr },
  { key: "status", label: "Status", renderValue: (creator) => creator.status },
  {
    key: "address",
    label: "Address",
    renderValue: (creator) => creator.address,
  },
  { key: "city", label: "City", renderValue: (creator) => creator.city },
  {
    key: "postalCode",
    label: "Postal Code",
    renderValue: (creator) => creator.postalCode,
  },
  {
    key: "exampleWorkLinkField",
    label: "Example Work Link",
    renderValue: (creator) => (
      <LinkText href={creator.exampleWorkLink} target="_blank" rel="noreferrer">
        {creator.exampleWorkLink}
      </LinkText>
    ),
  },
  {
    key: "approvedUserId",
    label: "Approved User ID",
    renderValue: (creator) => creator.approvedUserId ?? "null",
  },
  {
    key: "isDeleted",
    label: "Is Deleted",
    renderValue: (creator) => String(creator.isDeleted),
  },
  {
    key: "deletedAt",
    label: "Deleted At",
    renderValue: (creator) => creator.deletedAt ?? "null",
  },
  {
    key: "createdAt",
    label: "Created At",
    renderValue: (creator) => creator.createdAt,
  },
  {
    key: "updatedAt",
    label: "Updated At",
    renderValue: (creator) => creator.updatedAt,
  },
  {
    key: "contentDescription",
    label: "Content Description",
    renderValue: (creator) => creator.contentDescription,
  },
];

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
        <DetailsGrid>
          {creatorDetailFields.map((field) => (
            <DetailField key={field.key}>
              <DetailFieldLabel>{field.label}</DetailFieldLabel>
              <DetailFieldValue>{field.renderValue(creator)}</DetailFieldValue>
            </DetailField>
          ))}
        </DetailsGrid>
      ) : null}
    </Modal>
  );
}
