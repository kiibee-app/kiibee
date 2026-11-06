const LEGACY_IMAGE_DERIVATIVES: Record<string, string> = {
  "/4954/lange_halvvejs_04-2024-some4.jpg":
    "/media-optimized/lange-halvvejs-04-2024-v1.webp",
  "/1696/instachamp_cover_650x1030.jpg":
    "/media-optimized/uffe-instachamp-v1.webp",
};

/** Legacy originals exceeding the hosted optimizer's input limit.
 * Keep the source intact; serve a bounded local derivative until media is migrated.
 */
export function getImageDeliverySource(src: string): string {
  try {
    const url = new URL(src);
    if (
      !url.search &&
      [
        "kiibee-bucket.lon1.digitaloceanspaces.com",
        "kiibee-bucket.lon1.cdn.digitaloceanspaces.com",
        "kiibee.dk",
        "www.kiibee.dk",
      ].includes(url.hostname)
    ) {
      return (
        LEGACY_IMAGE_DERIVATIVES[url.pathname.replace(/^\/media\//, "/")] ?? src
      );
    }
  } catch {
    // Local and data URLs are already usable by next/image.
  }
  return src;
}

// Keep the optimizer allow-list and the component decision in sync.
export const IMAGE_REMOTE_PATTERNS = [
  "avatars.githubusercontent.com",
  "images.unsplash.com",
  "placehold.co",
  "**.digitaloceanspaces.com",
  "kiibee.dk",
  "www.kiibee.dk",
  "videodelivery.net",
  "**.videodelivery.net",
  "cloudflarestream.com",
  "**.cloudflarestream.com",
  "img.youtube.com",
  "i.ytimg.com",
].map((hostname) => ({ protocol: "https" as const, hostname }));

export function canOptimizeRemoteImage(src: string): boolean {
  try {
    const url = new URL(src);
    // Short-lived private URLs must go directly to their origin.
    if (url.searchParams.has("X-Amz-Signature") || url.searchParams.has("sig"))
      return false;
    return IMAGE_REMOTE_PATTERNS.some(
      ({ hostname, protocol }) =>
        url.protocol === `${protocol}:` &&
        (hostname.startsWith("**.")
          ? url.hostname.endsWith(`.${hostname.slice(3)}`)
          : url.hostname === hostname),
    );
  } catch {
    return false;
  }
}
