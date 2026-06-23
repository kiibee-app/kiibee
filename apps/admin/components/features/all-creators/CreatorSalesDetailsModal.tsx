"use client";

import { useState } from "react";
import { Drawer } from "../../common/Drawer";
import type { ExistingCreator } from "../../../types/existing-creator";
import { Layers, Database, FileText, Video } from "lucide-react";
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
  DrawerAvatarImage,
} from "./AllCreators.styles";
import { CreatorUploadsList } from "./CreatorUploadsList";
import { CreatorUploadDetail } from "./CreatorUploadDetail";
import type { UploadItem } from "../../../hooks/api";

export type CreatorSalesDetailsModalProps = {
  creator: ExistingCreator | null;
  onClose: () => void;
};

type View = "uploads" | "upload-detail";

export function CreatorSalesDetailsModal({
  creator,
  onClose,
}: CreatorSalesDetailsModalProps) {
  const [view, setView] = useState<View>("uploads");
  const [selectedUpload, setSelectedUpload] = useState<UploadItem | null>(null);
  const [lastCreatorId, setLastCreatorId] = useState(creator?.id);

  if (creator?.id !== lastCreatorId) {
    setLastCreatorId(creator?.id);
    setView("uploads");
    setSelectedUpload(null);
  }

  if (!creator) return null;

  const initials =
    (
      (creator.firstName?.[0] || "") + (creator.lastName?.[0] || "")
    ).toUpperCase() || "CR";

  const drawerTitle =
    view === "upload-detail" && selectedUpload
      ? selectedUpload.title
      : `${creator.fullName || "Creator"} - Sales & Content`;

  return (
    <Drawer title={drawerTitle} open={Boolean(creator)} onClose={onClose}>
      {view === "upload-detail" && selectedUpload ? (
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
          </DrawerHeaderCard>

          <DrawerSection>
            <DrawerSectionTitle>
              <FileText size={14} /> Sales Summary
            </DrawerSectionTitle>
            <DrawerCardList>
              <DrawerCardItem>
                <DrawerIconWrapper>
                  <Video size={16} />
                </DrawerIconWrapper>
                <DrawerItemContent>
                  <DrawerItemLabel>Total Content</DrawerItemLabel>
                  <DrawerItemValue>{creator.uploadCount}</DrawerItemValue>
                </DrawerItemContent>
              </DrawerCardItem>
              <DrawerCardItem>
                <DrawerIconWrapper>
                  <Layers size={16} />
                </DrawerIconWrapper>
                <DrawerItemContent>
                  <DrawerItemLabel>Total Sold</DrawerItemLabel>
                  <DrawerItemValue>0</DrawerItemValue>
                </DrawerItemContent>
              </DrawerCardItem>
              <DrawerCardItem>
                <DrawerIconWrapper>
                  <Database size={16} />
                </DrawerIconWrapper>
                <DrawerItemContent>
                  <DrawerItemLabel>Total Earned</DrawerItemLabel>
                  <DrawerItemValue>0 DKK</DrawerItemValue>
                </DrawerItemContent>
              </DrawerCardItem>
            </DrawerCardList>
          </DrawerSection>

          <DrawerSection>
            <DrawerSectionTitle>
              <Video size={14} /> Content Details
            </DrawerSectionTitle>
            <CreatorUploadsList
              creatorId={creator.id}
              hideBackButton={true}
              onSelectUpload={(upload) => {
                setSelectedUpload(upload);
                setView("upload-detail");
              }}
            />
          </DrawerSection>
        </>
      )}
    </Drawer>
  );
}
