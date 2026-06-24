"use client";

import {
  ArrowLeft,
  FileText,
  Globe,
  Video,
  DollarSign,
  Clock,
  Layers,
  Calendar,
  Link as LinkIcon,
} from "lucide-react";
import type { UploadItem } from "../../../hooks/api";
import { InfoRow } from "../../common/Drawer";
import {
  ACCESS_TYPE,
  VISIBILITY,
  creatorUploadLabels,
  formatBytes,
  formatBuyPrice,
  formatDuration,
  formatRentDuration,
  formatRentPrice,
} from "../../../utils/creatorUploadsConfig";
import {
  BackButton,
  DetailContainer,
  DetailHeaderCard,
  DetailMediaWrapper,
  DetailThumbnail,
  DetailTitle,
  DetailDescription,
  UploadBadge,
  PlaceholderVideoIcon,
  BadgeContainer,
  AssetLink,
  PriceStack,
} from "./CreatorUploads.styles";
import {
  DrawerSection,
  DrawerSectionTitle,
  DrawerCardList,
  DrawerCardItem,
  DrawerIconWrapper,
  DrawerItemContent,
  DrawerItemLabel,
  DrawerItemValue,
} from "./AllCreators.styles";

export type CreatorUploadDetailProps = {
  upload: UploadItem;
  onBack: () => void;
};

export function CreatorUploadDetail({
  upload,
  onBack,
}: CreatorUploadDetailProps) {
  return (
    <DetailContainer>
      <BackButton onClick={onBack}>
        <ArrowLeft size={16} /> {creatorUploadLabels.backToUploads}
      </BackButton>

      <DetailHeaderCard>
        <DetailMediaWrapper>
          {upload.thumbnailLandscapeUrl || upload.thumbnailUrl ? (
            <DetailThumbnail
              src={
                upload.thumbnailLandscapeUrl || upload.thumbnailUrl || undefined
              }
              alt={upload.title}
            />
          ) : (
            <PlaceholderVideoIcon>
              <Video size={48} />
            </PlaceholderVideoIcon>
          )}
        </DetailMediaWrapper>
        <DetailTitle>{upload.title}</DetailTitle>
        <BadgeContainer>
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
          <UploadBadge>
            {upload.contentType || creatorUploadLabels.defaultContentType}
          </UploadBadge>
        </BadgeContainer>
      </DetailHeaderCard>

      {upload.description && (
        <DrawerSection>
          <DrawerSectionTitle>
            <FileText size={14} /> {creatorUploadLabels.description}
          </DrawerSectionTitle>
          <DetailDescription>{upload.description}</DetailDescription>
        </DrawerSection>
      )}

      <DrawerSection>
        <DrawerSectionTitle>
          <Layers size={14} /> {creatorUploadLabels.contentConfiguration}
        </DrawerSectionTitle>
        <DrawerCardList>
          {upload.accessType === ACCESS_TYPE.PAID && (
            <InfoRow
              icon={<DollarSign size={16} />}
              label={creatorUploadLabels.pricing}
              value={
                <PriceStack>
                  <span>{formatBuyPrice(upload.buyPrice)}</span>
                  <span>{formatRentPrice(upload.rentPrice)}</span>
                </PriceStack>
              }
            />
          )}
          {upload.accessType === ACCESS_TYPE.PAID &&
            upload.rentDurationHours && (
              <InfoRow
                icon={<Clock size={16} />}
                label={creatorUploadLabels.rentalDuration}
                value={formatRentDuration(upload.rentDurationHours)}
              />
            )}
          {upload.duration && (
            <InfoRow
              icon={<Clock size={16} />}
              label={creatorUploadLabels.duration}
              value={formatDuration(upload.duration)}
            />
          )}
          {upload.fileSize && (
            <InfoRow
              icon={<FileText size={16} />}
              label={creatorUploadLabels.fileSize}
              value={formatBytes(upload.fileSize)}
            />
          )}
        </DrawerCardList>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <LinkIcon size={14} /> {creatorUploadLabels.mediaAssets}
        </DrawerSectionTitle>
        <DrawerCardList>
          {upload.contentUrl && (
            <InfoRow
              icon={<Globe size={16} />}
              label={creatorUploadLabels.contentAccessUrl}
              value={
                <AssetLink
                  href={upload.contentUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {creatorUploadLabels.openMediaFile}
                </AssetLink>
              }
            />
          )}
          {upload.trailerUrl && (
            <InfoRow
              icon={<Video size={16} />}
              label={creatorUploadLabels.trailerUrl}
              value={
                <AssetLink
                  href={upload.trailerUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {creatorUploadLabels.openTrailerFile}
                </AssetLink>
              }
            />
          )}
        </DrawerCardList>
      </DrawerSection>

      <DrawerSection>
        <DrawerSectionTitle>
          <Calendar size={14} /> {creatorUploadLabels.timestamps}
        </DrawerSectionTitle>
        <DrawerCardList>
          {upload.createdAt && (
            <InfoRow
              icon={<Calendar size={16} />}
              label={creatorUploadLabels.uploadedAt}
              value={new Date(upload.createdAt).toLocaleString()}
            />
          )}
          {upload.publishedAt && (
            <InfoRow
              icon={<Calendar size={16} />}
              label={creatorUploadLabels.publishedAt}
              value={new Date(upload.publishedAt).toLocaleString()}
            />
          )}
        </DrawerCardList>
      </DrawerSection>
    </DetailContainer>
  );
}
