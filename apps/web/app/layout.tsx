import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import { LanguageProvider } from "../providers/languageProvider";
import { ThemeProvider } from "../providers/themeProvider";
import { SmoothScrollProvider } from "../providers/smoothScrollProvider";
import StyledComponentsRegistry from "@/lib/registry";
import { QueryProvider } from "@/providers/queryProvider";
import { ToastProvider } from "@/providers/toastProvider";
import { cookies } from "next/headers";
import {
  OPEN_GRAPH_LOCALE_DA_DK,
  SITE_URL,
  TWITTER_CARD_SUMMARY_LARGE_IMAGE,
  WEBSITE,
} from "@/utils/Constants";
import { STORAGE_KEY } from "@/utils/common";
import { normalizeAppLanguage } from "@/utils/language";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  ...(SITE_URL && { metadataBase: new URL(SITE_URL) }),
  title: {
    default: "Kiibee - Discover Unique Digital Content",
    template: "%s | Kiibee",
  },
  description:
    "Discover and enjoy unique digital content from your favorite creators. Watch, listen, and learn directly from independent creators. Rent or buy exclusive content in just a few clicks.",
  openGraph: {
    siteName: "Kiibee",
    locale: OPEN_GRAPH_LOCALE_DA_DK,
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
  const cookieLang = cookieStore.get(STORAGE_KEY)?.value;
  const initialLang = normalizeAppLanguage(cookieLang);

  return (
    <html
      lang={initialLang}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <QueryProvider>
              <LanguageProvider initialLang={initialLang}>
                <SmoothScrollProvider>
                  {children}
                  <ToastProvider />
                </SmoothScrollProvider>
              </LanguageProvider>
            </QueryProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
