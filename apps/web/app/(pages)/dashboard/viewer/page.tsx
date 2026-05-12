import type { Metadata } from "next";
import React, { Suspense } from "react";
import creatorDashboardImage from "@/assets/images/creator-dashboard.png";
import ClientDashboardViewer from "@/components/Feature/Dashboard/ClientDashboardViewer";
import { SmoothScrollProvider } from "@/providers/smoothScrollProvider";
import { LanguageProvider } from "@/providers/languageProvider";
import { ThemeProvider } from "@/providers/themeProvider";

const title = "Viewer dashboard";
const description =
  "Manage your viewer dashboard, purchased content, billing history, and account activity on Kiibee.";

export const metadata: Metadata = {
  title,
  description,
  alternates: {
    canonical: "/dashboard/viewer",
  },
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title,
    description,
    url: "/dashboard/viewer",
    type: "website",
    images: [
      {
        url: creatorDashboardImage.src,
        width: creatorDashboardImage.width,
        height: creatorDashboardImage.height,
        alt: "Kiibee viewer dashboard preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [creatorDashboardImage.src],
  },
};

export default function DashboardViewerPage() {
  return (
    <Suspense fallback={<div />}>
      <ClientDashboardViewer />
    </Suspense>
  );
}
