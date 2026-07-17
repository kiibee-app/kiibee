"use client";

import type { LucideIcon } from "lucide-react";
import { X } from "lucide-react";
import { ROUTES } from "../../utils/constants";
import { useDashboardStats } from "../../hooks/api/use-dashboard-stats";
import { usePayoutRequests } from "../../hooks/api/use-payout-requests";
import {
  BrandText,
  CloseButton,
  IconWrap,
  MenuItem,
  MenuList,
  NotificationBadge,
  SidebarRoot,
  SidebarTop,
} from "./Sidebar.styles";

export interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarProps {
  items: SidebarItem[];
  pathname: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ items, pathname, isOpen, onClose }: SidebarProps) {
  const statsQuery = useDashboardStats();
  const payoutRequestsQuery = usePayoutRequests();
  const pendingCount = statsQuery.data?.pendingRequests ?? 0;
  const pendingPayoutCount = payoutRequestsQuery.data?.length ?? 0;

  return (
    <SidebarRoot $isOpen={isOpen}>
      <SidebarTop>
        <BrandText>Kiibee</BrandText>
        <CloseButton type="button" onClick={onClose} aria-label="Close sidebar">
          <X size={18} />
        </CloseButton>
      </SidebarTop>
      <MenuList>
        {items.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          const Icon = item.icon;
          const badgeCount =
            item.href === ROUTES.PENDING_REQUESTS
              ? pendingCount
              : item.href === ROUTES.PAYOUT_REQUESTS
                ? pendingPayoutCount
                : 0;
          const showBadge = badgeCount > 0;

          return (
            <MenuItem
              key={item.href}
              href={item.href}
              $active={isActive}
              aria-current={isActive ? "page" : undefined}
              onClick={onClose}
            >
              <IconWrap>
                <Icon size={16} />
              </IconWrap>
              <span>{item.label}</span>
              {showBadge && <NotificationBadge>{badgeCount}</NotificationBadge>}
            </MenuItem>
          );
        })}
      </MenuList>
    </SidebarRoot>
  );
}
