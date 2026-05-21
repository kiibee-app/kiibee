"use client";

import { Drawer } from "../../common/Drawer";
import type { CreatorDetailsModalProps } from "../../../types/creator-details-modal";
import { StatusBadge } from "./AllCreators.styles";
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
  Trash2,
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
  DescriptionBlock,
  LinkText,
} from "./AllCreators.styles";

export function CreatorDetailsModal({
  creator,
  onClose,
}: CreatorDetailsModalProps) {
  if (!creator) return null;

  const initials =
    (
      (creator.firstName?.[0] || "") + (creator.lastName?.[0] || "")
    ).toUpperCase() || "CR";

  return (
    <Drawer
      title="Creator Request Details"
      open={Boolean(creator)}
      onClose={onClose}
    >
      <DrawerHeaderCard>
        <AvatarCircle>{initials}</AvatarCircle>
        <DrawerHeaderName>{creator.fullName}</DrawerHeaderName>
        <DrawerHeaderEmail>{creator.email}</DrawerHeaderEmail>
        <StatusBadge $status={creator.status}>{creator.status}</StatusBadge>
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
              <DrawerItemValue>{creator.email}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <Phone size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Phone Number</DrawerItemLabel>
              <DrawerItemValue>
                {creator.phone || "Not provided"}
              </DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <MapPin size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Address</DrawerItemLabel>
              <DrawerItemValue>
                {creator.address ? (
                  <>
                    {creator.address}
                    <br />
                    {creator.postalCode} {creator.city}
                  </>
                ) : (
                  "Not provided"
                )}
              </DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
        </DrawerCardList>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <Building2 size={14} /> Professional Details
        </DrawerSectionTitle>
        <DrawerCardList>
          <DrawerCardItem>
            <DrawerIconWrapper>
              <Layers size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>CVR / Business ID</DrawerItemLabel>
              <DrawerItemValue>{creator.cvr || "N/A"}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <Globe size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Example Work Link</DrawerItemLabel>
              <DrawerItemValue>
                {creator.exampleWorkLink ? (
                  <LinkText
                    href={creator.exampleWorkLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {creator.exampleWorkLink}
                  </LinkText>
                ) : (
                  "No link provided"
                )}
              </DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
        </DrawerCardList>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <FileText size={14} /> Content Description
        </DrawerSectionTitle>
        <DescriptionBlock>
          {creator.contentDescription ||
            "No content pitch or description provided."}
        </DescriptionBlock>
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
              <DrawerItemLabel>Application ID</DrawerItemLabel>
              <DrawerItemValue>{creator.id}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <ShieldCheck size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Approved User ID</DrawerItemLabel>
              <DrawerItemValue>
                {creator.approvedUserId || "Not approved yet"}
              </DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <Calendar size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Timeline</DrawerItemLabel>
              <DrawerItemValue>
                Created: {new Date(creator.createdAt).toLocaleString()}
                <br />
                Updated: {new Date(creator.updatedAt).toLocaleString()}
              </DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          {creator.isDeleted && (
            <DrawerCardItem>
              <DrawerIconWrapper>
                <Trash2 size={16} style={{ color: "red" }} />
              </DrawerIconWrapper>
              <DrawerItemContent>
                <DrawerItemLabel style={{ color: "red" }}>
                  Deleted State
                </DrawerItemLabel>
                <DrawerItemValue style={{ color: "red" }}>
                  Deleted At:{" "}
                  {creator.deletedAt
                    ? new Date(creator.deletedAt).toLocaleString()
                    : "Yes"}
                </DrawerItemValue>
              </DrawerItemContent>
            </DrawerCardItem>
          )}
        </DrawerCardList>
      </DrawerSection>
    </Drawer>
  );
}
