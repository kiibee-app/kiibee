import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { LanguageProvider } from "../providers/languageProvider";
import { ThemeProvider } from "../providers/themeProvider";
import { SmoothScrollProvider } from "../providers/smoothScrollProvider";
import StyledComponentsRegistry from "@/lib/registry";
import { QueryProvider } from "@/providers/queryProvider";
import { ToastProvider } from "@/providers/toastProvider";
import {
  OPEN_GRAPH_LOCALE_EN_US,
  TWITTER_CARD_SUMMARY_LARGE_IMAGE,
  WEBSITE,
} from "@/utils/Constants";
import { STORAGE_KEY } from "@/utils/common";
import { normalizeAppLanguage } from "@/utils/language";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Kiibee - Discover Unique Digital Content",
    template: "%s | Kiibee",
  },
  description:
    "Discover and enjoy unique digital content from your favorite creators. Watch, listen, and learn directly from independent creators. Rent or buy exclusive content in just a few clicks.",
  openGraph: {
    siteName: "Kiibee",
    locale: OPEN_GRAPH_LOCALE_EN_US,
    type: WEBSITE,
  },
  twitter: {
    card: TWITTER_CARD_SUMMARY_LARGE_IMAGE,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialLang = normalizeAppLanguage(cookieStore.get(STORAGE_KEY)?.value);

  return (
    <html
      lang={initialLang}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <ThemeProvider>
          <QueryProvider>
            <LanguageProvider initialLang={initialLang}>
              <SmoothScrollProvider>
                <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
                <ToastProvider />
              </SmoothScrollProvider>
            </LanguageProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
