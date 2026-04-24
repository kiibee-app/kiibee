import React, { Suspense } from "react";
import ClientDashboardCreators from "@/components/Feature/Dashboard/ClientDashboardCreators";
import { ThemeProvider } from "@/providers/themeProvider";
import { LanguageProvider } from "@/providers/languageProvider";
import { SmoothScrollProvider } from "@/providers/smoothScrollProvider";

export default function DashboardCreatorsPage() {
  return (
    <Suspense fallback={<div />}>
      <ThemeProvider>
        <LanguageProvider>
          <SmoothScrollProvider>
            <ClientDashboardCreators />
          </SmoothScrollProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Suspense>
  );
}
