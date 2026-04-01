export type PageMeta = {
  title: string;
  description: string;
};

const pageMeta: Record<string, PageMeta> = {
  "/": {
    title: "Dashboard",
    description: "Overview of your content and recent activity.",
  },
  "/posts": {
    title: "Posts / Articles",
    description: "Create, edit, and organize your blog posts and articles.",
  },
  "/pages": {
    title: "Pages",
    description: "Manage static pages like About, Contact, and Landing pages.",
  },
  "/media-library": {
    title: "Media Library",
    description: "Browse and manage all uploaded images, videos, and files.",
  },
  "/categories": {
    title: "Categories",
    description: "Group content into categories for better site structure.",
  },
  "/tags": {
    title: "Tags",
    description: "Create and maintain tags to improve content discovery.",
  },
  "/comments": {
    title: "Comments",
    description: "Review, approve, and moderate comments from readers.",
  },
};

export function getPageMeta(pathname: string): PageMeta {
  const normalized =
    pathname !== "/" && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;

  return pageMeta[normalized] ?? pageMeta["/"];
}
