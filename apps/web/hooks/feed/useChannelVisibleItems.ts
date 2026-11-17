"use client";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { useGetAPI } from "@/lib/http/api/getApi";
import { axiosClient } from "@/lib/http/axiosClient";
import { API } from "@/lib/http/api/endpoints";
import { useStoredLoginUser } from "@/hooks/auth/useStoredLoginUser";

const EMPTY: never[] = [];
const CODE_EMAIL_CHANNEL_LOCKS = [
  "set_password",
  "password",
  "request_email",
  "email_gated",
];
type Creator = { id: string; accessType?: string | null };
type Entitlement = { required: boolean; hasAccess: boolean };

// Fail closed while resolving channel locks, including for cached feed responses.
export function useChannelVisibleItems<T extends { creatorId?: string }>(
  input?: T[] | null,
) {
  const items = input ?? EMPTY;
  const user = useStoredLoginUser();
  const { data, isLoading: creatorsLoading } = useGetAPI<{ data?: Creator[] }>(
    API.creators.list,
    undefined,
    { enabled: items.length > 0 },
  );
  const creators = useMemo(
    () => new Map((data?.data ?? []).map((creator) => [creator.id, creator])),
    [data],
  );
  const checks = useMemo(
    () =>
      [
        ...new Set(
          items
            .map((item) => item.creatorId)
            .filter((id): id is string => Boolean(id)),
        ),
      ].filter((id) => {
        if (id === user?.id) return false;
        const creator = creators.get(id);
        return (
          !creator ||
          (Boolean(user?.id) &&
            ["payment", "paid"].includes(creator.accessType ?? ""))
        );
      }),
    [items, creators, user?.id],
  );
  const visibility = useQueries({
    queries: checks.map((id) => ({
      queryKey: ["profile-payment", id, user?.id],
      enabled: Boolean(data),
      staleTime: 30000,
      queryFn: async () =>
        (
          await axiosClient.get(
            `/content/${user?.id ? "profile-entitlement" : "profile-payment"}/${encodeURIComponent(id)}`,
          )
        ).data.data as Entitlement,
    })),
    combine: (results) => ({
      allowed: checks.filter((_id, index) => {
        const state = results[index]?.data;
        return Boolean(state && (!state.required || state.hasAccess));
      }),
      loading: results.some((result) => result.isLoading),
    }),
  });
  const visibleItems = useMemo(() => {
    if (!data) return EMPTY as T[];
    const allowed = new Set(visibility.allowed);
    return items.filter((item) => {
      const id = item.creatorId;
      if (!id) return false;
      if (id === user?.id) return true;
      const creator = creators.get(id);
      if (
        creator &&
        CODE_EMAIL_CHANNEL_LOCKS.includes(creator.accessType ?? "")
      )
        return false;
      if (creator && !["payment", "paid"].includes(creator.accessType ?? ""))
        return true;
      return allowed.has(id);
    });
  }, [items, data, creators, user?.id, visibility.allowed]);
  return {
    items: visibleItems,
    isLoading: creatorsLoading || visibility.loading,
  };
}
