import { useCallback, useState } from "react";
import { useIsMobile } from "@/utils/useIsMobile";

export function useSidebarExpanded(breakpoint = 768) {
  const isMobile = useIsMobile(breakpoint);
  const [expandedOverride, setExpandedOverride] = useState<boolean | undefined>(
    undefined,
  );

  const sidebarExpanded = expandedOverride ?? !isMobile;

  const toggleSidebar = useCallback(() => {
    setExpandedOverride((prev) => !(prev ?? !isMobile));
  }, [isMobile]);

  const collapseSidebar = useCallback(() => {
    if (isMobile) {
      setExpandedOverride(false);
    }
  }, [isMobile]);

  return { isMobile, sidebarExpanded, toggleSidebar, collapseSidebar };
}
