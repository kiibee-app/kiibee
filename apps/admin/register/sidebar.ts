import {
  LayoutDashboard,
  Newspaper,
  Files,
  Image,
  FolderTree,
  Tags,
  MessageSquare,
} from "lucide-react";
import type { SidebarItem } from "../components/sidebar/Sidebar";

export const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Posts / Articles", href: "/posts", icon: Newspaper },
  { label: "Pages", href: "/pages", icon: Files },
  { label: "Media Library", href: "/media-library", icon: Image },
  { label: "Categories", href: "/categories", icon: FolderTree },
  { label: "Tags", href: "/tags", icon: Tags },
  { label: "Comments", href: "/comments", icon: MessageSquare },
];
