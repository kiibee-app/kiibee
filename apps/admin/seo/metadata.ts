export type PageMeta = {
  title: string;
  description: string;
};

const pageMeta: Record<string, PageMeta> = {
  "/all-creators": {
    title: "All Creators",
    description: "Review creator requests and manage approval status.",
  },
  "/profile": {
    title: "Profile",
    description: "View full authenticated admin account details and tokens.",
  },
};

export function getPageMeta(pathname: string): PageMeta {
  const normalized =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return pageMeta[normalized] ?? pageMeta["/all-creators"];
}
