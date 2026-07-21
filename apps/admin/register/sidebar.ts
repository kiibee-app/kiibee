import {
  LayoutDashboard,
  Users,
  Eye,
  Clock3,
  Trash2,
  Banknote,
} from "lucide-react";
import type { SidebarItem } from "../components/sidebar/Sidebar";
import { ROUTES } from "../utils/constants";

export const sidebarItems: SidebarItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Pending Requests", href: ROUTES.PENDING_REQUESTS, icon: Clock3 },
  { label: "Deletion Requests", href: ROUTES.DELETION_REQUESTS, icon: Trash2 },
  { label: "All Creators", href: "/all-creators", icon: Users },
  { label: "All Viewers", href: "/viewers", icon: Eye },
  { label: "Payout", href: ROUTES.PAYOUT, icon: Banknote },
];
