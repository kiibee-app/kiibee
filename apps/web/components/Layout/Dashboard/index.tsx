"use client";

import React from "react";
import { LayoutWrapper, MainWrapper, ContentWrapper } from "./styles";

type DashboardLayoutProps = {
  header?: React.ReactNode;
  children?: React.ReactNode;
  sidebar?: React.ReactNode;
  contentPadding?: string;
};

const DashboardLayout = ({
  header,
  children,
  sidebar,
  contentPadding,
}: DashboardLayoutProps) => {
  return (
    <LayoutWrapper>
      {sidebar}
      <MainWrapper>
        {header}
        {children && (
          <ContentWrapper $contentPadding={contentPadding}>
            {children}
          </ContentWrapper>
        )}
      </MainWrapper>
    </LayoutWrapper>
  );
};

export default DashboardLayout;
