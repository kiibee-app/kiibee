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
    default: "Kiibee",
    template: "%s | Kiibee",
  },
  description:
    "Discover and enjoy unique digital content from your favorite creators. Watch, listen, and learn directly from independent creators. Rent or buy exclusive content in just a few clicks.",
  openGraph: {
    siteName: "Kiibee",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <ThemeProvider>
          <QueryProvider>
            <LanguageProvider>
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
