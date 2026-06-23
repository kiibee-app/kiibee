"use client";

import { Video, ArrowLeft } from "lucide-react";
import { useCreatorUploads, type UploadItem } from "../../../hooks/api";
import { existingCreatorLabels } from "../../../utils/existingCreatorsConfig";
import {
  ACCESS_TYPE,
  VISIBILITY,
  creatorUploadLabels,
  formatPriceSummary,
} from "../../../utils/creatorUploadsConfig";
import {
  BackButton,
  UploadsListContainer,
  UploadCard,
  UploadThumbnail,
  UploadThumbnailPlaceholder,
  UploadInfo,
  UploadTitle,
  UploadMeta,
  UploadBadge,
  StatusMessage,
  ContentTypeLabel,
} from "./CreatorUploads.styles";

export type CreatorUploadsListProps = {
  creatorId: string;
  onBack?: () => void;
  onSelectUpload: (upload: UploadItem) => void;
  hideBackButton?: boolean;
};

export function CreatorUploadsList({
  creatorId,
  onBack,
  onSelectUpload,
  hideBackButton,
}: CreatorUploadsListProps) {
  const { data: uploads, isLoading, isError } = useCreatorUploads(creatorId);

  return (
    <>
      {!hideBackButton && onBack && (
        <BackButton onClick={onBack}>
          <ArrowLeft size={16} /> {existingCreatorLabels.backToDetails}
        </BackButton>
      )}

      {isLoading ? (
        <StatusMessage $variant="loading">
          {existingCreatorLabels.loadingUploads}
        </StatusMessage>
      ) : isError ? (
        <StatusMessage $variant="error">
          {existingCreatorLabels.failedToLoadUploads}
        </StatusMessage>
      ) : !uploads || uploads.length === 0 ? (
        <StatusMessage $variant="empty">
          {existingCreatorLabels.noUploadsFound}
        </StatusMessage>
      ) : (
        <UploadsListContainer>
          {uploads.map((upload) => (
            <UploadCard key={upload.id} onClick={() => onSelectUpload(upload)}>
              {upload.thumbnailUrl ? (
                <UploadThumbnail src={upload.thumbnailUrl} alt={upload.title} />
              ) : (
                <UploadThumbnailPlaceholder>
                  <Video size={20} />
                </UploadThumbnailPlaceholder>
              )}
              <UploadInfo>
                <UploadTitle>{upload.title}</UploadTitle>
                <UploadMeta>
                  <UploadBadge
                    $type={
                      upload.accessType === ACCESS_TYPE.FREE
                        ? ACCESS_TYPE.FREE
                        : ACCESS_TYPE.PAID
                    }
                  >
                    {upload.accessType}
                  </UploadBadge>
                  {upload.visibility && (
                    <UploadBadge
                      $type={
                        upload.visibility === VISIBILITY.PUBLIC
                          ? VISIBILITY.PUBLIC
                          : VISIBILITY.DRAFT
                      }
                    >
                      {upload.visibility}
                    </UploadBadge>
                  )}
                  <ContentTypeLabel>
                    {upload.contentType ||
                      creatorUploadLabels.defaultContentType}
                  </ContentTypeLabel>
                  {upload.accessType === ACCESS_TYPE.PAID && (
                    <span>
                      {formatPriceSummary(upload.buyPrice, upload.rentPrice)}
                    </span>
                  )}
                  {upload.createdAt && (
                    <span>
                      {new Date(upload.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </UploadMeta>
              </UploadInfo>
            </UploadCard>
          ))}
        </UploadsListContainer>
      )}
    </>
  );
}
