"use client";

import React from "react";
import { LayoutWrapper, MainWrapper, ContentWrapper } from "./styles";

type DashboardLayoutProps = {
  header?: React.ReactNode;
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  contentPadding?: string;
  sidebarExpanded?: boolean;
};

const DashboardLayout = ({
  header,
  children,
  sidebar,
  contentPadding,
  sidebarExpanded = true,
}: DashboardLayoutProps) => {
  return (
    <LayoutWrapper>
      {sidebar}
      <MainWrapper $sidebarExpanded={sidebarExpanded}>
        {header}
        {children && (
          <ContentWrapper
            $contentPadding={contentPadding}
            data-lenis-prevent=""
          >
            {children}
          </ContentWrapper>
        )}
      </MainWrapper>
    </LayoutWrapper>
  );
};

export default DashboardLayout;
