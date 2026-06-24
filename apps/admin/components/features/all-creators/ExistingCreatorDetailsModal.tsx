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

type View = "details" | "uploads" | "upload-detail";

export function ExistingCreatorDetailsModal({
  creator,
  onClose,
}: ExistingCreatorDetailsModalProps) {
  const [view, setView] = useState<View>("details");
  const [selectedUpload, setSelectedUpload] = useState<UploadItem | null>(null);
  const [lastCreatorId, setLastCreatorId] = useState(creator?.id);

  if (creator?.id !== lastCreatorId) {
    setLastCreatorId(creator?.id);
    setView("details");
    setSelectedUpload(null);
  }

  if (!creator) return null;

  const initials =
    (
      (creator.firstName?.[0] || "") + (creator.lastName?.[0] || "")
    ).toUpperCase() || "CR";

  const drawerTitle =
    view === "uploads"
      ? formatCreatorUploadsTitle(creator.fullName)
      : view === "upload-detail" && selectedUpload
        ? selectedUpload.title
        : existingCreatorLabels.creatorDetailsTitle;

  return (
    <Drawer title={drawerTitle} open={Boolean(creator)} onClose={onClose}>
      {view === "uploads" ? (
        <CreatorUploadsList
          creatorId={creator.id}
          onBack={() => setView("details")}
          onSelectUpload={(upload) => {
            setSelectedUpload(upload);
            setView("upload-detail");
          }}
        />
      ) : view === "upload-detail" && selectedUpload ? (
        <CreatorUploadDetail
          upload={selectedUpload}
          onBack={() => setView("uploads")}
        />
      ) : (
        <>
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
              <InteractiveDrawerCardItem onClick={() => setView("uploads")}>
                <DrawerIconWrapper>
                  <Video size={16} />
                </DrawerIconWrapper>
                <DrawerItemContent
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <DrawerItemLabel>Uploads</DrawerItemLabel>
                    <DrawerItemValue style={{ display: "block" }}>
                      {creator.uploadCount}
                    </DrawerItemValue>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--primary-green, #00A651)",
                      fontWeight: 600,
                    }}
                  >
                    View All →
                  </span>
                </DrawerItemContent>
              </InteractiveDrawerCardItem>
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
        </>
      )}
    </Drawer>
  );
}
