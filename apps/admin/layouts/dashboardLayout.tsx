"use client";

import { usePathname } from "next/navigation";
import styled from "styled-components";
import { Header } from "../components/header/Header";
import { Sidebar } from "../components/sidebar/Sidebar";
import { sidebarItems } from "../register/sidebar";
import { getPageMeta } from "../seo/metadata";

const AppContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.neutral.GRAY_100};
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
`;

const Main = styled.main`
  flex: 1;
  margin-left: 240px;
  min-height: 100vh;
`;

const Content = styled.div`
  padding: 16px 20px;
`;

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginRoute = pathname === "/login";
  const meta = getPageMeta(pathname);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  return (
    <AppContainer>
      <Sidebar items={sidebarItems} pathname={pathname} />
      <Main>
        <Header title={meta.title} description={meta.description} />
        <Content>{children}</Content>
      </Main>
    </AppContainer>
  );
}
