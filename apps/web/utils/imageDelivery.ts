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
