import { LayoutDashboard, Users, Eye, Clock3 } from "lucide-react";
import type { SidebarItem } from "../components/sidebar/Sidebar";

export const sidebarItems: SidebarItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Pending Requests", href: "/pending-requests", icon: Clock3 },
  { label: "All Creators", href: "/all-creators", icon: Users },
  { label: "All Viewers", href: "/viewers", icon: Eye },
];
