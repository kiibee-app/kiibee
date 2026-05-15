import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeWrapper } from "./ThemeWrapper";
import { DashboardLayout } from "../layouts/dashboardLayout";
import StyledComponentsRegistry from "./StyledComponentsRegistry";
import QueryProvider from "../providers/query-provider";

export const metadata: Metadata = {
  title: "Kiibee - Admin",
  description: "Admin dashboard for Sequence",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <StyledComponentsRegistry>
          <QueryProvider>
            <ThemeWrapper>
              <DashboardLayout>{children}</DashboardLayout>
              <Toaster position="top-right" />
            </ThemeWrapper>
          </QueryProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
