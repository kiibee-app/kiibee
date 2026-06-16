import {
  AudioFileIcon,
  BookIcon,
  PdfIcon,
  VideoIcon,
  WebIcon,
} from "@/assets/icons";
import type { OverviewPerformanceIcon } from "@/utils/dummyData/overviewData";

export function mapContentTypeToOverviewIcon(
  contentType?: string | null,
): OverviewPerformanceIcon {
  const normalized = contentType?.trim().toLowerCase();

  switch (normalized) {
    case "audio":
      return "audio";
    case "video":
      return "video";
    case "epub":
      return "book";
    case "web":
      return "web";
    case "pdf":
    default:
      return "pdf";
  }
}

export function renderContentIcon(icon: OverviewPerformanceIcon) {
  switch (icon) {
    case "pdf":
      return <PdfIcon width={18} height={18} />;
    case "audio":
      return <AudioFileIcon width={18} height={18} />;
    case "video":
      return <VideoIcon width={18} height={18} />;
    case "book":
      return <BookIcon bg="currentColor" fg="#fff" />;
    case "web":
      return <WebIcon width={18} height={18} />;
    default:
      return null;
  }
}
