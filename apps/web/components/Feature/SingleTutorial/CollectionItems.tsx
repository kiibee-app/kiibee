"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { LeftIcon } from "@/assets/icons";
import PlayIcon from "@/assets/icons/PlayIcon";
import type { TutorialVideo } from "@/utils/types";
import { resolveImageUrl } from "@/utils/Constants";
import { pathPublishedContent } from "@/utils/path";
import {
  CollectionActions,
  CollectionAuthor,
  CollectionBadge,
  CollectionBadgeText,
  CollectionCard,
  CollectionCardBody,
  CollectionFreeButton,
  CollectionHeader,
  CollectionImageArea,
  CollectionLink,
  CollectionSection,
  CollectionSectionTitle,
  CollectionStrip,
  CollectionTime,
  CollectionTitle,
  CollectionTitleGroup,
  CollectionVideoIconBox,
  CollectionVideoLabelText,
  CollectionVideoPill,
} from "./styles";

type Props = {
  videos: TutorialVideo[];
  collectionId?: string;
  title?: string;
};

export default function CollectionItems({
  videos,
  collectionId,
  title,
}: Props) {
  const { t } = useTranslation();

  if (!videos.length) return null;

  const href = collectionId
    ? `/single-collection?id=${collectionId}`
    : "/tutorial-videos";

  return (
    <CollectionSection>
      <CollectionHeader>
        <CollectionTitleGroup as={Link} href={href}>
          <CollectionSectionTitle>
            {title ?? t("singleTutorial.otherItemsInCollection")}
          </CollectionSectionTitle>
          <LeftIcon width={14} height={14} />
        </CollectionTitleGroup>
        <CollectionLink
          as={Link}
          href={href}
          aria-label={t("tutorialVideos.sectionLink")}
        >
          <LeftIcon width={16} height={16} />
        </CollectionLink>
      </CollectionHeader>
      <CollectionStrip>
        {videos.map((video) => (
          <CollectionCard key={video.id}>
            <CollectionImageArea>
              <Image
                src={resolveImageUrl(video.image)}
                alt={video.title}
                fill
                sizes="250px"
              />
              {video.category?.trim() ? (
                <CollectionBadge>
                  <CollectionBadgeText>{video.category}</CollectionBadgeText>
                </CollectionBadge>
              ) : null}
            </CollectionImageArea>

            <CollectionCardBody>
              <CollectionTitle>{video.title}</CollectionTitle>
              <CollectionAuthor>{video.creator}</CollectionAuthor>
              <CollectionTime>{video.published}</CollectionTime>

              <CollectionActions>
                <CollectionVideoPill>
                  <CollectionVideoIconBox>
                    <PlayIcon width={10} height={10} />
                  </CollectionVideoIconBox>
                  <CollectionVideoLabelText>
                    {video.formatLabel}
                  </CollectionVideoLabelText>
                </CollectionVideoPill>

                <CollectionFreeButton
                  as={Link}
                  href={pathPublishedContent(video.id)}
                >
                  {video.buttons?.[0]?.label ??
                    t("tutorialVideos.buttonFreeLabel")}
                </CollectionFreeButton>
              </CollectionActions>
            </CollectionCardBody>
          </CollectionCard>
        ))}
      </CollectionStrip>
    </CollectionSection>
  );
}
