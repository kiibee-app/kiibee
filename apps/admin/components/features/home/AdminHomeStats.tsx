"use client";

import type { LucideIcon } from "lucide-react";
import {
  Clock3,
  CreditCard,
  Eye,
  Gift,
  Layers,
  UserRound,
  Users,
} from "lucide-react";
import { useDashboardStats } from "../../../hooks/api/use-dashboard-stats";
import type { DashboardStats } from "../../../types/dashboard-stats";
import {
  DASHBOARD_STAT_KEY,
  STAT_ACCENT,
  type StatAccent,
} from "../../../utils/constants";
import {
  HomeStatsGrid,
  HomeStatsLayout,
  HomeStatsState,
  StatCard,
  StatCardTop,
  StatHint,
  StatIconWrap,
  StatLabel,
  StatSkeleton,
  StatValue,
} from "./AdminHomeStats.styles";

type StatCardConfig = {
  key: string;
  label: string;
  hint: string;
  accent: StatAccent;
  icon: LucideIcon;
  getValue: (stats: DashboardStats) => number;
};

const userStatCards: StatCardConfig[] = [
  {
    key: DASHBOARD_STAT_KEY.TOTAL_USERS,
    label: "Total Users",
    hint: "All registered platform users",
    accent: STAT_ACCENT.BLUE,
    icon: Users,
    getValue: (stats) => stats.totalUsers,
  },
  {
    key: DASHBOARD_STAT_KEY.CREATORS,
    label: "Creators",
    hint: "Active creator accounts",
    accent: STAT_ACCENT.GREEN,
    icon: UserRound,
    getValue: (stats) => stats.creators,
  },
  {
    key: DASHBOARD_STAT_KEY.VIEWERS,
    label: "Viewers",
    hint: "Registered viewer accounts",
    accent: STAT_ACCENT.TEAL,
    icon: Eye,
    getValue: (stats) => stats.viewers,
  },
  {
    key: DASHBOARD_STAT_KEY.PENDING_REQUESTS,
    label: "Pending Requests",
    hint: "Creator applications awaiting review",
    accent: STAT_ACCENT.ORANGE,
    icon: Clock3,
    getValue: (stats) => stats.pendingRequests,
  },
];

const contentStatCards: StatCardConfig[] = [
  {
    key: DASHBOARD_STAT_KEY.TOTAL_CONTENT,
    label: "Total Content",
    hint: "Media files and collections",
    accent: STAT_ACCENT.PURPLE,
    icon: Layers,
    getValue: (stats) => stats.totalContent,
  },
  {
    key: DASHBOARD_STAT_KEY.FREE_CONTENT,
    label: "Free Content",
    hint: "Content available for free access",
    accent: STAT_ACCENT.GREEN,
    icon: Gift,
    getValue: (stats) => stats.freeContent,
  },
  {
    key: DASHBOARD_STAT_KEY.PAID_CONTENT,
    label: "Paid Content",
    hint: "Content with paid access",
    accent: STAT_ACCENT.ORANGE,
    icon: CreditCard,
    getValue: (stats) => stats.paidContent,
  },
];

function renderStatCards(cards: StatCardConfig[], stats: DashboardStats) {
  return cards.map((card) => {
    const Icon = card.icon;

    return (
      <StatCard key={card.key} $accent={card.accent}>
        <StatCardTop>
          <div>
            <StatLabel>{card.label}</StatLabel>
            <StatValue>{card.getValue(stats).toLocaleString()}</StatValue>
          </div>
          <StatIconWrap $accent={card.accent}>
            <Icon size={22} strokeWidth={2.2} />
          </StatIconWrap>
        </StatCardTop>
        <StatHint>{card.hint}</StatHint>
      </StatCard>
    );
  });
}

function renderStatSkeletons(count: number) {
  return Array.from({ length: count }, (_, index) => (
    <StatSkeleton key={`stat-skeleton-${index}`} aria-hidden />
  ));
}

export function AdminHomeStats() {
  const statsQuery = useDashboardStats();

  if (statsQuery.isLoading) {
    return (
      <HomeStatsLayout>
        <HomeStatsGrid>
          {renderStatSkeletons(userStatCards.length)}
        </HomeStatsGrid>
        <HomeStatsGrid $columns={3}>
          {renderStatSkeletons(contentStatCards.length)}
        </HomeStatsGrid>
      </HomeStatsLayout>
    );
  }

  if (statsQuery.isError || !statsQuery.data) {
    return (
      <HomeStatsLayout>
        <HomeStatsState>
          {statsQuery.error?.message || "Failed to load dashboard stats."}
        </HomeStatsState>
      </HomeStatsLayout>
    );
  }

  return (
    <HomeStatsLayout>
      <HomeStatsGrid>
        {renderStatCards(userStatCards, statsQuery.data)}
      </HomeStatsGrid>
      <HomeStatsGrid $columns={3}>
        {renderStatCards(contentStatCards, statsQuery.data)}
      </HomeStatsGrid>
    </HomeStatsLayout>
  );
}
