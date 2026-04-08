import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../providers/languageProvider";
import { ThemeProvider } from "../providers/themeProvider";
import StyledComponentsRegistry from "@/lib/registry";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kiibee - Discover Unique Digital Content",
  description:
    "Discover and enjoy unique digital content from your favorite creators. Watch, listen, and learn directly from independent creators. Rent or buy exclusive content in just a few clicks.",
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
          <LanguageProvider>
            <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
