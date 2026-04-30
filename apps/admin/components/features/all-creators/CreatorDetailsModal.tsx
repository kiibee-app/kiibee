"use client";

import { Modal } from "../../common/Modal";
import type { CreatorDetailsModalProps } from "../../../types/creator-details-modal";
import { creatorDetailFields } from "../../../utils/allCreatorsConfig";
import {
  DetailField,
  DetailFieldLabel,
  DetailFieldValue,
  DetailsGrid,
} from "./AllCreators.styles";

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
