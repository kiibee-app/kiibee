export type PageMeta = {
  title: string;
  description: string;
};

const pageMeta: Record<string, PageMeta> = {
  "/": {
    title: "Admin Home",
    description:
      "Welcome to the Kiibee admin dashboard. Manage creators, review requests, and oversee platform activity.",
  },
  "/all-creators": {
    title: "All Creators",
    description: "Browse and manage existing creator accounts.",
  },
  "/pending-requests": {
    title: "Pending Requests",
    description: "Review and approve new creator applications.",
  },
  "/viewers": {
    title: "All Viewers",
    description: "Browse viewer accounts, billing history, and content access.",
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

  if (normalized.startsWith("/viewers/") && normalized !== "/viewers") {
    return {
      title: "Viewer Details",
      description: "View profile, billing history, purchases, and rentals.",
    };
  }

  if (
    normalized.startsWith("/all-creators/") &&
    normalized.includes("/content/")
  ) {
    return {
      title: "Content Engagement",
      description: "View purchases, rentals, and downloads for this content.",
    };
  }

  if (
    normalized.startsWith("/all-creators/") &&
    normalized !== "/all-creators"
  ) {
    return {
      title: "Creator Details",
      description: "View creator profile and content performance.",
    };
  }

  return pageMeta[normalized] ?? pageMeta["/all-creators"];
}
