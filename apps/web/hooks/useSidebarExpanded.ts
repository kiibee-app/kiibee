import { useCallback, useState } from "react";
import { useIsMobile } from "@/utils/useIsMobile";

export function useSidebarExpanded(breakpoint = 768) {
  const isMobile = useIsMobile(breakpoint);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const desktopExpanded = true;

  const sidebarExpanded = isMobile ? mobileExpanded : desktopExpanded;

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setMobileExpanded((prev) => !prev);
    }
  }, [isMobile]);

  const collapseSidebar = useCallback(() => {
    if (isMobile) {
      setMobileExpanded(false);
    }
  }, [isMobile]);

  return { isMobile, sidebarExpanded, toggleSidebar, collapseSidebar };
}
