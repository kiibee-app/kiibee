import type { Metadata } from "next";
import "./globals.css";
import { ThemeWrapper } from "./ThemeWrapper";
import { DashboardLayout } from "../layouts/dashboardLayout";

export const metadata: Metadata = {
  title: "Sequence Admin",
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
        <ThemeWrapper>
          <DashboardLayout>{children}</DashboardLayout>
        </ThemeWrapper>
      </body>
    </html>
  );
}
