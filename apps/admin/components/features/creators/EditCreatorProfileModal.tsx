"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Save } from "lucide-react";
import { Modal } from "../../common/Modal";
import { MODAL_SIZE } from "../../../utils/constants";
import type { ExistingCreator } from "../../../types/existing-creator";
import { useUpdateCreatorProfile } from "../../../hooks/api";
import { getExistingCreatorDisplayName } from "../../../utils/existingCreatorsConfig";
import {
  CancelButton,
  FormGroup,
  FormGroupFull,
  FormGrid,
  FormHint,
  FormInput,
  FormLabel,
  ModalActions,
  ModalForm,
  RequiredBadge,
  SubmitButton,
} from "./EditCreatorProfileModal.styles";

type EditCreatorProfileModalProps = {
  creator: ExistingCreator | null;
  open: boolean;
  onClose: () => void;
};

type EditCreatorProfileFormProps = {
  creator: ExistingCreator;
  onClose: () => void;
};

function EditCreatorProfileForm({
  creator,
  onClose,
}: EditCreatorProfileFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateCreatorProfile();

  const [ownerName, setOwnerName] = useState(
    () => getExistingCreatorDisplayName(creator) || "",
  );
  const [companyName, setCompanyName] = useState(
    () => creator.companyName || "",
  );
  const [channelName, setChannelName] = useState(
    () => creator.channelName || "",
  );
  const [email, setEmail] = useState(() => creator.email || "");
  const [phone, setPhone] = useState(() => creator.phone || "");
  const [city, setCity] = useState(() => creator.city || "");
  const [address, setAddress] = useState(() => creator.address || "");
  const [postalCode, setPostalCode] = useState(() => creator.postalCode || "");
  const [cvr, setCvr] = useState(() => creator.cvr || "");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    updateProfile(
      {
        creatorId: creator.id,
        ownerName: ownerName.trim(),
        companyName: companyName.trim(),
        channelName: channelName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        city: city.trim(),
        address: address.trim(),
        postalCode: postalCode.trim(),
        cvr: cvr.trim(),
      },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  return (
    <ModalForm onSubmit={handleSubmit}>
      <FormGrid>
        <FormGroupFull>
          <FormLabel htmlFor="edit-owner-name">
            Owner Name <RequiredBadge>*</RequiredBadge>
          </FormLabel>
          <FormInput
            id="edit-owner-name"
            type="text"
            required
            placeholder="e.g. Peter Alan Wheatley"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
            disabled={isPending}
          />
          <FormHint>
            The real owner name of the creator account. This is prioritized in
            the Owner column and profile details across Kiibee.
          </FormHint>
        </FormGroupFull>

        <FormGroup>
          <FormLabel htmlFor="edit-company-name">Company Name</FormLabel>
          <FormInput
            id="edit-company-name"
            type="text"
            placeholder="e.g. FBI Productions ApS"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            disabled={isPending}
          />
          <FormHint>Business or corporate entity name (optional)</FormHint>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="edit-channel-name">Channel Name</FormLabel>
          <FormInput
            id="edit-channel-name"
            type="text"
            placeholder="e.g. FBI.DK"
            value={channelName}
            onChange={(e) => setChannelName(e.target.value)}
            disabled={isPending}
          />
          <FormHint>Public brand / channel display name</FormHint>
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="edit-email">
            Email Address <RequiredBadge>*</RequiredBadge>
          </FormLabel>
          <FormInput
            id="edit-email"
            type="email"
            required
            placeholder="e.g. creator@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="edit-phone">Phone Number</FormLabel>
          <FormInput
            id="edit-phone"
            type="tel"
            placeholder="e.g. +45 12 34 56 78"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={isPending}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="edit-cvr">CVR Number</FormLabel>
          <FormInput
            id="edit-cvr"
            type="text"
            placeholder="e.g. 12345678"
            value={cvr}
            onChange={(e) => setCvr(e.target.value)}
            disabled={isPending}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="edit-city">City</FormLabel>
          <FormInput
            id="edit-city"
            type="text"
            placeholder="e.g. Copenhagen"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={isPending}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="edit-postal">Postal Code</FormLabel>
          <FormInput
            id="edit-postal"
            type="text"
            placeholder="e.g. 2100"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            disabled={isPending}
          />
        </FormGroup>

        <FormGroup>
          <FormLabel htmlFor="edit-address">Address</FormLabel>
          <FormInput
            id="edit-address"
            type="text"
            placeholder="e.g. Strandvejen 10"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            disabled={isPending}
          />
        </FormGroup>
      </FormGrid>

      <ModalActions>
        <CancelButton type="button" onClick={onClose} disabled={isPending}>
          Cancel
        </CancelButton>
        <SubmitButton type="submit" disabled={isPending || !ownerName.trim()}>
          {isPending ? (
            <>
              <Loader2 size={16} />
              Saving…
            </>
          ) : (
            <>
              <Save size={16} />
              Save Changes
            </>
          )}
        </SubmitButton>
      </ModalActions>
    </ModalForm>
  );
}

export function EditCreatorProfileModal({
  creator,
  open,
  onClose,
}: EditCreatorProfileModalProps) {
  if (!open || !creator) {
    return null;
  }

  return (
    <Modal
      title="Edit Creator Profile"
      open={open}
      onClose={onClose}
      size={MODAL_SIZE.LG}
    >
      <EditCreatorProfileForm
        key={`${creator.id}-${creator.updatedAt || ""}`}
        creator={creator}
        onClose={onClose}
      />
    </Modal>
  );
}
