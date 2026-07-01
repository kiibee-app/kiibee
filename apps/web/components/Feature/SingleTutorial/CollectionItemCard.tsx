"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import Link from "next/link";
import recentCreator from "@/assets/images/creators/recent_creator.webp";
import { EpubIcon, VideoIcon, WebIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import GenericButton from "@/components/UI/GenericButton";
import { VARIANT, type ImageSource } from "@/utils/Constants";
import { resolveImageUrl, resolvePublicMediaUrl } from "@/utils/media";
import { pathPublishedContent, PATHS } from "@/utils/path";
import { getPublicCreatorProfilePath } from "@/utils/creatorChannel";
import {
  FORMAT_TYPE,
  type FormatType,
  type TutorialVideo,
} from "@/utils/types";
import { useProtectedContentNavigation } from "@/hooks/useProtectedContentNavigation";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { LoginRequiredModal } from "@/components/UI/Modals";
import {
  CollectionActionRow,
  CollectionAuthor,
  CollectionBadge,
  CollectionBadgeText,
  CollectionCard,
  CollectionCardBody,
  CollectionCoverImage,
  CollectionImageArea,
  CollectionTime,
  CollectionTitle,
  CollectionVideoIconBox,
  CollectionVideoLabelText,
  CollectionVideoPill,
} from "./styles";

type IconComponent = ComponentType<{
  width?: number;
  height?: number;
  color?: string;
  className?: string;
}>;

const formatIconMap: Record<FormatType, IconComponent> = {
  video: VideoIcon,
  audio: AudioFileIcon,
  pdf: PdfFileIcon,
  epub: EpubIcon,
  web: WebIcon,
};

const FALLBACK_THUMBNAIL_SRC = resolveImageUrl(recentCreator);

function resolveThumbnailSrc(image: ImageSource): string {
  if (typeof image === "string") {
    return resolvePublicMediaUrl(image) ?? image;
  }

  return resolveImageUrl(image);
}

function CollectionThumbnail({
  image,
  alt,
}: {
  image: ImageSource;
  alt: string;
}) {
  const initialSrc = useMemo(() => resolveThumbnailSrc(image), [image]);
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    setSrc(initialSrc);
  }, [initialSrc]);

  return (
    <CollectionCoverImage
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => {
        if (src !== FALLBACK_THUMBNAIL_SRC) {
          setSrc(FALLBACK_THUMBNAIL_SRC);
        }
      }}
    />
  );
}

type Props = {
  video: TutorialVideo;
};

export default function CollectionItemCard({ video }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useStoredLoginUser();
  const { navigateToContent } = useProtectedContentNavigation();
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState("");

  const handleShowLoginModal = (url: string) => {
    setPendingRedirectUrl(url);
    setLoginModalVisible(true);
  };
  const handleCloseLoginModal = () => setLoginModalVisible(false);

  const FormatIcon =
    formatIconMap[video.formatType ?? FORMAT_TYPE.VIDEO] ?? VideoIcon;
  const contentHref = pathPublishedContent(video.id);
  const buttons = video.buttons?.length ? video.buttons : [];

  return (
    <CollectionCard>
      <CollectionImageArea
        as={Link}
        href={contentHref}
        tabIndex={-1}
        aria-hidden="true"
      >
        <CollectionThumbnail image={video.image} alt={video.title} />
        {video.category?.trim() ? (
          <CollectionBadge>
            <CollectionBadgeText>{video.category}</CollectionBadgeText>
          </CollectionBadge>
        ) : null}
      </CollectionImageArea>

      <CollectionCardBody>
        <CollectionTitle as={Link} href={contentHref}>
          {video.title}
        </CollectionTitle>
        {video.creatorId ? (
          <CollectionAuthor
            as={Link}
            href={getPublicCreatorProfilePath(video.creatorId)}
          >
            {video.creator}
          </CollectionAuthor>
        ) : (
          <CollectionAuthor>{video.creator}</CollectionAuthor>
        )}
        <CollectionTime>{video.published}</CollectionTime>

        <CollectionVideoPill>
          <CollectionVideoIconBox>
            <FormatIcon width={10} height={10} />
          </CollectionVideoIconBox>
          <CollectionVideoLabelText>
            {video.formatLabel}
          </CollectionVideoLabelText>
        </CollectionVideoPill>

        {buttons.length ? (
          <CollectionActionRow>
            {buttons.map((button, index) => (
              <GenericButton
                key={`${button.label}-${index}`}
                type="button"
                variant={button.variant ?? VARIANT.SOFT_OUTLINE}
                fullWidth
                size="sm"
                onClick={() => {
                  if (button.onClick) {
                    button.onClick();
                    return;
                  }

                  const isLoggedIn = Boolean(user && user.id);
                  const targetHref = button.href ?? contentHref;

                  if (button.requiresAuth && !isLoggedIn) {
                    handleShowLoginModal(targetHref);
                    return;
                  }

                  navigateToContent(targetHref, button.requiresAuth);
                }}
              >
                {button.label}
              </GenericButton>
            ))}
          </CollectionActionRow>
        ) : null}
      </CollectionCardBody>
      <LoginRequiredModal
        visible={isLoginModalVisible}
        onClose={handleCloseLoginModal}
        onSuccess={() => {
          if (pendingRedirectUrl) {
            navigateToContent(pendingRedirectUrl, true);
            setPendingRedirectUrl("");
          }
        }}
      />
    </CollectionCard>
  );
}
