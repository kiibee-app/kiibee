"use client";

import { usePathname } from "next/navigation";

/** Public channel pages use viewer gates, including when visited by their creator. */
export function useChannelOwnerAccess(isOwner: boolean) {
  const pathname = usePathname();
  return (
    isOwner && (pathname === "/dashboard" || pathname.startsWith("/dashboard/"))
  );
}
