import { LayoutDashboard, Users, TrendingUp } from "lucide-react";
import type { SidebarItem } from "../components/sidebar/Sidebar";

export const sidebarItems: SidebarItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "All Creators", href: "/all-creators", icon: Users },
  { label: "Creator Sales", href: "/creator-sales", icon: TrendingUp },
];
