"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import GenericCard from "@/components/UI/GenericCard";
import GenericButton from "@/components/UI/GenericButton";
import { useTranslation } from "react-i18next";
import { getContentTypeLabel } from "@/utils/content";
import { VideoIcon, WebIcon, EpubIcon } from "@/assets/icons";
import AudioFileIcon from "@/assets/icons/AudioFileIcon";
import PdfFileIcon from "@/assets/icons/PdfFileIcon";
import COLORS from "@repo/ui/colors";
import {
  CardTitle,
  CardCreator,
} from "@/components/Feature/TutorialVideos/TutorialCard/styles";
import { GENERIC_CARD_LAYOUT } from "@/utils/ui";
import { useGetAPI } from "@/lib/http/api/getApi";
import { API } from "@/lib/http/api/endpoints";
import {
  getContentType,
  getContentDetail,
  type ContentDetailResponse,
} from "@/utils/contentApi";
import { resolveContentThumbnailCandidates } from "@/utils/media";
import type { RecentlyViewedItem } from "@/utils/recentlyViewed";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";
import { readRecentlyViewed } from "@/utils/recentlyViewed";
import { DashboardPageWrapper } from "@/components/Layout/Dashboard/styles";
import { MonoText } from "@/components/UI/Monotext";
import {
  PageHeader,
  MediaGrid,
  MediaTypePill,
  ViewerEmptyStateBox,
  ViewerEmptyStateTitle,
  ViewerEmptyStateDescription,
} from "./styles";

const subscribe = () => () => {};

export default function RecentlyViewed() {
  const { t } = useTranslation();
  const user = useStoredLoginUser();
  const hydrated = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const items = hydrated && user?.id ? readRecentlyViewed(user.id) : [];

  return (
    <DashboardPageWrapper>
      <PageHeader>
        <MonoText $use="H4_SemiBold">{t("sidebar.recentlyViewed")}</MonoText>
      </PageHeader>
      {items.length ? (
        <MediaGrid>
          {items.map((item) => (
            <RecentlyViewedCard key={item.id} item={item} />
          ))}
        </MediaGrid>
      ) : (
        <ViewerEmptyStateBox>
          <ViewerEmptyStateTitle>
            {t("viewerRecent.emptyTitle")}
          </ViewerEmptyStateTitle>
          <ViewerEmptyStateDescription>
            {t("viewerRecent.emptyDescription")}
          </ViewerEmptyStateDescription>
        </ViewerEmptyStateBox>
      )}
    </DashboardPageWrapper>
  );
}

function RecentlyViewedCard({ item }: { item: RecentlyViewedItem }) {
  const { t } = useTranslation();
  const router = useRouter();
  const user = useStoredLoginUser();
  const { data } = useGetAPI<ContentDetailResponse>(
    API.content.view(item.id, user?.id ?? "guest"),
    undefined,
    {
      enabled: Boolean(user?.id),
      retry: false,
      refetchOnWindowFocus: false,
    },
  );
  const content = getContentDetail(data);
  const images = resolveContentThumbnailCandidates(
    content?.thumbnailUrl,
    content?.thumbnailLandscapeUrl,
    { preferLandscape: true },
  );
  const contentType = getContentType(content);
  const TypeIcon = {
    video: VideoIcon,
    audio: AudioFileIcon,
    pdf: PdfFileIcon,
    epub: EpubIcon,
    web: WebIcon,
  }[contentType];
  const openContent = () => router.push(item.href);
  return (
    <GenericCard
      title={
        <CardTitle $use="H5_Medium">{content?.title || item.title}</CardTitle>
      }
      subtitle={
        item.creatorName ? (
          <CardCreator $use="Body_SemiMedium">{item.creatorName}</CardCreator>
        ) : undefined
      }
      image={images[0] || item.thumbnailUrl}
      imageFallback={images[1]}
      imageInitials={item.title.slice(0, 1).toUpperCase()}
      imageAspectRatio={GENERIC_CARD_LAYOUT.IMAGE_ASPECT_RATIO}
      alt={item.title}
      coverImage
      meta={
        <MonoText $use="Body_Medium" color={COLORS.neutral.GRAY_400}>
          {new Date(item.viewedAt).toLocaleDateString()}
        </MonoText>
      }
      onClick={openContent}
      footer={
        <GenericButton
          fullWidth
          onClick={(event) => {
            event.stopPropagation();
            openContent();
          }}
        >
          {t("viewerRecent.viewContent")}
        </GenericButton>
      }
    >
      {content?.contentType && (
        <MediaTypePill>
          <TypeIcon width={20} height={20} color={COLORS.neutral.BLACK} />
          <MonoText $use="Body_Bold">
            {getContentTypeLabel(contentType)}
          </MonoText>
        </MediaTypePill>
      )}
    </GenericCard>
  );
}
