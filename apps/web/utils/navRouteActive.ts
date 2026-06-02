export function normalizeNavPath(href: string): string {
  const pathOnly = href.split("?")[0].split("#")[0];
  if (pathOnly.startsWith("http://") || pathOnly.startsWith("https://")) {
    try {
      return new URL(pathOnly).pathname;
    } catch {
      return pathOnly;
    }
  }
  return pathOnly;
}

export function findActiveNavItemKey(
  pathname: string,
  items: ReadonlyArray<{ key: string; href?: string }>,
): string | null {
  const withHref = items
    .filter((item): item is { key: string; href: string } => Boolean(item.href))
    .map((item) => ({
      key: item.key,
      path: normalizeNavPath(item.href),
    }))
    .sort((a, b) => b.path.length - a.path.length);

  for (const { key, path } of withHref) {
    if (pathname === path || pathname.startsWith(`${path}/`)) {
      return key;
    }
  }

  return null;
}
