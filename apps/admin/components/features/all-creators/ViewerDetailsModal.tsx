"use client";

import { Drawer } from "../../common/Drawer";
import type { Viewer } from "../../../types/viewer";
import { StatusBadge } from "./AllCreators.styles";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Database,
  ShieldCheck,
  CreditCard,
  Video,
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
  DrawerIconWrapper,
  DrawerItemContent,
  DrawerItemLabel,
  DrawerItemValue,
  CreatorAvatarImage,
} from "./AllCreators.styles";

export type ViewerDetailsModalProps = {
  viewer: Viewer | null;
  onClose: () => void;
};

export function ViewerDetailsModal({
  viewer,
  onClose,
}: ViewerDetailsModalProps) {
  if (!viewer) return null;

  const initials =
    (
      (viewer.firstName?.[0] || "") + (viewer.lastName?.[0] || "")
    ).toUpperCase() || "VW";

  return (
    <Drawer title="Viewer Details" open={Boolean(viewer)} onClose={onClose}>
      <DrawerHeaderCard>
        {viewer.avatarUrl ? (
          <CreatorAvatarImage
            src={viewer.avatarUrl}
            alt={viewer.fullName || "Viewer"}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              marginBottom: 12,
            }}
          />
        ) : (
          <AvatarCircle>{initials}</AvatarCircle>
        )}
        <DrawerHeaderName>{viewer.fullName}</DrawerHeaderName>
        <DrawerHeaderEmail>{viewer.email}</DrawerHeaderEmail>
        <StatusBadge $status={viewer.status}>{viewer.status}</StatusBadge>
      </DrawerHeaderCard>

      <DrawerSection>
        <DrawerSectionTitle>
          <User size={14} /> Contact Information
        </DrawerSectionTitle>
        <DrawerCardList>
          <DrawerCardItem>
            <DrawerIconWrapper>
              <Mail size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Email Address</DrawerItemLabel>
              <DrawerItemValue>
                {viewer.email}{" "}
                {viewer.isEmailVerified ? "(Verified)" : "(Unverified)"}
              </DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <Phone size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Phone Number</DrawerItemLabel>
              <DrawerItemValue>
                {viewer.phone || "Not provided"}
              </DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <MapPin size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>City</DrawerItemLabel>
              <DrawerItemValue>{viewer.city || "Not provided"}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
        </DrawerCardList>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <CreditCard size={14} /> Activity Statistics
        </DrawerSectionTitle>
        <DrawerCardList>
          <DrawerCardItem>
            <DrawerIconWrapper>
              <CreditCard size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Purchases</DrawerItemLabel>
              <DrawerItemValue>{viewer.purchaseCount}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
          <DrawerCardItem>
            <DrawerIconWrapper>
              <Video size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Rentals</DrawerItemLabel>
              <DrawerItemValue>{viewer.rentalCount}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
        </DrawerCardList>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <Database size={14} /> System Info & Status
        </DrawerSectionTitle>
        <DrawerCardList>
          <DrawerCardItem>
            <DrawerIconWrapper>
              <Database size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Account ID</DrawerItemLabel>
              <DrawerItemValue>{viewer.id}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <ShieldCheck size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Role</DrawerItemLabel>
              <DrawerItemValue>{viewer.role}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <Calendar size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Timeline</DrawerItemLabel>
              <DrawerItemValue>
                Created: {new Date(viewer.createdAt).toLocaleString()}
                <br />
                Updated: {new Date(viewer.updatedAt).toLocaleString()}
              </DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
        </DrawerCardList>
      </DrawerSection>
    </Drawer>
  );
}
