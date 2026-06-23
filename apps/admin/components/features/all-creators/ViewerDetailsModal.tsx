"use client";

import { useState } from "react";

import { Drawer } from "../../common/Drawer";
import type { Viewer } from "../../../types/viewer";
import { formatViewerStatus } from "../../../utils/viewersConfig";
import { useViewerSales } from "../../../hooks/api";
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
  Receipt,
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
  AccountStatusBadge,
  DrawerSectionActionRow,
  DrawerSectionActionButton,
} from "./AllCreators.styles";
import { ViewerSalesHistoryList } from "./ViewerSalesHistoryList";
import { INITIAL_SALES_HISTORY_COUNT } from "./viewerSalesHistory";

export type ViewerDetailsModalProps = {
  viewer: Viewer | null;
  onClose: () => void;
};

export function ViewerDetailsModal({
  viewer,
  onClose,
}: ViewerDetailsModalProps) {
  const salesQuery = useViewerSales(viewer?.id ?? null);
  const [expandedViewerId, setExpandedViewerId] = useState<string | null>(null);

  if (!viewer) return null;

  const initials =
    (
      (viewer.firstName?.[0] || "") + (viewer.lastName?.[0] || "")
    ).toUpperCase() || "VW";

  const sales = salesQuery.data ?? [];
  const showAllSales = expandedViewerId === viewer.id;
  const visibleSales = showAllSales
    ? sales
    : sales.slice(0, INITIAL_SALES_HISTORY_COUNT);
  const hasMoreSales = sales.length > INITIAL_SALES_HISTORY_COUNT;

  const handleClose = () => {
    setExpandedViewerId(null);
    onClose();
  };

  return (
    <Drawer title="Viewer Details" open={Boolean(viewer)} onClose={handleClose}>
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
        <AccountStatusBadge $status={viewer.status}>
          {formatViewerStatus(viewer.status)}
        </AccountStatusBadge>
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
          <Receipt size={14} /> Sales History
        </DrawerSectionTitle>
        <ViewerSalesHistoryList
          isLoading={salesQuery.isLoading}
          isError={salesQuery.isError}
          errorMessage={salesQuery.error?.message}
          sales={visibleSales}
        />
        {!salesQuery.isLoading &&
        !salesQuery.isError &&
        hasMoreSales &&
        !showAllSales ? (
          <DrawerSectionActionRow>
            <DrawerSectionActionButton
              type="button"
              onClick={() => setExpandedViewerId(viewer.id)}
            >
              See all
            </DrawerSectionActionButton>
          </DrawerSectionActionRow>
        ) : null}
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
