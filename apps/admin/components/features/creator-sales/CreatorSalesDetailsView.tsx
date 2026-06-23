import { useState } from "react";
import type { ExistingCreator } from "../../../types/existing-creator";
import { Layers, Database, FileText, Video, ArrowLeft } from "lucide-react";
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
} from "../all-creators/AllCreators.styles";
import { CreatorUploadsList } from "../all-creators/CreatorUploadsList";
import { CreatorUploadDetail } from "../all-creators/CreatorUploadDetail";
import type { UploadItem } from "../../../hooks/api";
import styled from "styled-components";

export type CreatorSalesDetailsViewProps = {
  creator: ExistingCreator;
  onBack: () => void;
};

type View = "uploads" | "upload-detail";

const ViewContainer = styled.div`
  padding: 24px;
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.secondary.muted};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 24px;
  padding: 0;
  transition: color ${({ theme }) => theme.animations.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.secondary.main};
  }
`;

export function CreatorSalesDetailsView({
  creator,
  onBack,
}: CreatorSalesDetailsViewProps) {
  const [view, setView] = useState<View>("uploads");
  const [selectedUpload, setSelectedUpload] = useState<UploadItem | null>(null);

  const initials =
    (
      (creator.firstName?.[0] || "") + (creator.lastName?.[0] || "")
    ).toUpperCase() || "CR";

  return (
    <ViewContainer>
      <BackButton
        onClick={view === "upload-detail" ? () => setView("uploads") : onBack}
      >
        <ArrowLeft size={16} />
        {view === "upload-detail"
          ? "Back to Creator Sales"
          : "Back to Creator List"}
      </BackButton>

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
                  <DrawerItemValue>{creator.totalSold}</DrawerItemValue>
                </DrawerItemContent>
              </DrawerCardItem>
              <DrawerCardItem>
                <DrawerIconWrapper>
                  <Database size={16} />
                </DrawerIconWrapper>
                <DrawerItemContent>
                  <DrawerItemLabel>Total Earned</DrawerItemLabel>
                  <DrawerItemValue>{creator.totalEarned} DKK</DrawerItemValue>
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
    </ViewContainer>
  );
}
