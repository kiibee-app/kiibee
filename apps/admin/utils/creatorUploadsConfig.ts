export const ACCESS_TYPE = {
  FREE: "free",
  PAID: "paid",
} as const;

export const VISIBILITY = {
  PUBLIC: "public",
  DRAFT: "draft",
} as const;

export const creatorUploadLabels = {
  backToUploads: "Back to Uploads",
  defaultContentType: "video",
  notAvailable: "N/A",
  description: "Description",
  contentConfiguration: "Content Configuration",
  pricing: "Pricing",
  buyNotAvailable: "Buy: Not available",
  rentNotAvailable: "Rent: Not available",
  rentalDuration: "Rental Duration",
  hoursSuffix: "Hours",
  duration: "Duration",
  fileSize: "File Size",
  mediaAssets: "Media Assets",
  contentAccessUrl: "Content Access URL",
  openMediaFile: "Open Media File",
  trailerUrl: "Trailer URL",
  openTrailerFile: "Open Trailer File",
  timestamps: "Timestamps",
  uploadedAt: "Uploaded At",
  publishedAt: "Published At",
  zeroBytes: "0 Bytes",
  byteSizes: ["Bytes", "KB", "MB", "GB"],
} as const;

export function formatBuyPrice(price?: string | number | null) {
  return price ? `Buy: DKK ${price}` : creatorUploadLabels.buyNotAvailable;
}

export function formatRentPrice(price?: string | number | null) {
  return price ? `Rent: DKK ${price}` : creatorUploadLabels.rentNotAvailable;
}

export function formatRentDuration(hours: number) {
  return `${hours} ${creatorUploadLabels.hoursSuffix}`;
}

export function formatPriceSummary(
  buyPrice?: string | number | null,
  rentPrice?: string | number | null,
) {
  const parts = [
    buyPrice ? `Buy: DKK ${buyPrice}` : "",
    rentPrice ? `Rent: DKK ${rentPrice}` : "",
  ].filter(Boolean);
  return parts.join(" | ");
}

export function formatBytes(bytes?: number | null) {
  if (bytes === null || bytes === undefined)
    return creatorUploadLabels.notAvailable;
  if (bytes === 0) return creatorUploadLabels.zeroBytes;
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(2)) +
    " " +
    creatorUploadLabels.byteSizes[i]
  );
}

export function formatDuration(seconds?: number | null) {
  if (seconds === null || seconds === undefined)
    return creatorUploadLabels.notAvailable;
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const formattedMins = mins.toString().padStart(2, "0");
  const formattedSecs = secs.toString().padStart(2, "0");

  if (hrs > 0) {
    return `${hrs}:${formattedMins}:${formattedSecs}`;
  }
  return `${mins}:${formattedSecs}`;
}
