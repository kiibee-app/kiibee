import React, { Suspense } from "react";
import { ThemeProvider } from "@/providers/themeProvider";
import { LanguageProvider } from "@/providers/languageProvider";
import { SmoothScrollProvider } from "@/providers/smoothScrollProvider";
import ClientDashboardViewer from "@/components/Feature/Dashboard/ClientDashboardViewer";

export default function DashboardViewerPage() {
  return (
    <Suspense fallback={<div />}>
      <ThemeProvider>
        <LanguageProvider>
          <SmoothScrollProvider>
            <ClientDashboardViewer />
          </SmoothScrollProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Suspense>
  );
}
