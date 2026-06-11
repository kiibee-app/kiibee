"use client";

import { Clock3, Eye, UserRound, Users } from "lucide-react";
import { useDashboardStats } from "../../../hooks/api/use-dashboard-stats";
import { STAT_ACCENT, type StatAccent } from "../../../utils/constants";
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
  icon: typeof Users;
  getValue: (stats: {
    totalUsers: number;
    creators: number;
    viewers: number;
    pendingRequests: number;
  }) => number;
};

const statCards: StatCardConfig[] = [
  {
    key: "total-users",
    label: "Total Users",
    hint: "All registered platform users",
    accent: STAT_ACCENT.BLUE,
    icon: Users,
    getValue: (stats) => stats.totalUsers,
  },
  {
    key: "creators",
    label: "Creators",
    hint: "Active creator accounts",
    accent: STAT_ACCENT.GREEN,
    icon: UserRound,
    getValue: (stats) => stats.creators,
  },
  {
    key: "viewers",
    label: "Viewers",
    hint: "Registered viewer accounts",
    accent: STAT_ACCENT.TEAL,
    icon: Eye,
    getValue: (stats) => stats.viewers,
  },
  {
    key: "pending-requests",
    label: "Pending Requests",
    hint: "Creator applications awaiting review",
    accent: STAT_ACCENT.ORANGE,
    icon: Clock3,
    getValue: (stats) => stats.pendingRequests,
  },
];

export function AdminHomeStats() {
  const statsQuery = useDashboardStats();

  if (statsQuery.isLoading) {
    return (
      <HomeStatsLayout>
        <HomeStatsGrid>
          {statCards.map((card) => (
            <StatSkeleton key={card.key} aria-hidden />
          ))}
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
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <StatCard key={card.key} $accent={card.accent}>
              <StatCardTop>
                <div>
                  <StatLabel>{card.label}</StatLabel>
                  <StatValue>
                    {card.getValue(statsQuery.data).toLocaleString()}
                  </StatValue>
                </div>
                <StatIconWrap $accent={card.accent}>
                  <Icon size={22} strokeWidth={2.2} />
                </StatIconWrap>
              </StatCardTop>
              <StatHint>{card.hint}</StatHint>
            </StatCard>
          );
        })}
      </HomeStatsGrid>
    </HomeStatsLayout>
  );
}
