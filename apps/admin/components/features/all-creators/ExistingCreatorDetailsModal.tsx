"use client";

import { Drawer } from "../../common/Drawer";
import type { ExistingCreator } from "../../../types/existing-creator";
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
  DrawerIconWrapper,
  DrawerItemContent,
  DrawerItemLabel,
  DrawerItemValue,
  LinkText,
  CreatorAvatarImage,
} from "./AllCreators.styles";

export type ExistingCreatorDetailsModalProps = {
  creator: ExistingCreator | null;
  onClose: () => void;
};

export function ExistingCreatorDetailsModal({
  creator,
  onClose,
}: ExistingCreatorDetailsModalProps) {
  if (!creator) return null;

  const initials =
    (
      (creator.firstName?.[0] || "") + (creator.lastName?.[0] || "")
    ).toUpperCase() || "CR";

  return (
    <Drawer title="Creator Details" open={Boolean(creator)} onClose={onClose}>
      <DrawerHeaderCard>
        {creator.avatarUrl ? (
          <CreatorAvatarImage
            src={creator.avatarUrl}
            alt={creator.fullName || "Creator"}
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
              <DrawerItemValue>
                {creator.email}{" "}
                {creator.isEmailVerified ? "(Verified)" : "(Unverified)"}
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
                {creator.phone || "Not provided"}
              </DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <MapPin size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>City</DrawerItemLabel>
              <DrawerItemValue>
                {creator.city || "Not provided"}
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
              <Building2 size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Company Name</DrawerItemLabel>
              <DrawerItemValue>{creator.companyName || "N/A"}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
        </DrawerCardList>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <Globe size={14} /> Channel Details
        </DrawerSectionTitle>
        <DrawerCardList>
          <DrawerCardItem>
            <DrawerIconWrapper>
              <Globe size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Channel Name</DrawerItemLabel>
              <DrawerItemValue>{creator.channelName || "N/A"}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
          <DrawerCardItem>
            <DrawerIconWrapper>
              <LinkText href="#" as="span">
                @
              </LinkText>
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Channel Slug</DrawerItemLabel>
              <DrawerItemValue>
                {creator.channelSlug ? `/${creator.channelSlug}` : "N/A"}
              </DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
          <DrawerCardItem>
            <DrawerIconWrapper>
              <FileText size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Plan Name</DrawerItemLabel>
              <DrawerItemValue>{creator.planName || "N/A"}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
        </DrawerCardList>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <Video size={14} /> Content Statistics
        </DrawerSectionTitle>
        <DrawerCardList>
          <DrawerCardItem>
            <DrawerIconWrapper>
              <Video size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Uploads</DrawerItemLabel>
              <DrawerItemValue>{creator.uploadCount}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>
          <DrawerCardItem>
            <DrawerIconWrapper>
              <Users size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Subscribers</DrawerItemLabel>
              <DrawerItemValue>{creator.subscriberCount}</DrawerItemValue>
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
              <DrawerItemValue>{creator.id}</DrawerItemValue>
            </DrawerItemContent>
          </DrawerCardItem>

          <DrawerCardItem>
            <DrawerIconWrapper>
              <ShieldCheck size={16} />
            </DrawerIconWrapper>
            <DrawerItemContent>
              <DrawerItemLabel>Role</DrawerItemLabel>
              <DrawerItemValue>{creator.role}</DrawerItemValue>
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
        </DrawerCardList>
      </DrawerSection>
    </Drawer>
  );
}
