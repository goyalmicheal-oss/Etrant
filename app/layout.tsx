import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { PostHogProvider } from "@/components/providers/PostHogProvider";
import { siteConfig } from "@/lib/config/site";
import { UserProvider } from "@/components/providers/UserProvider";
import Head from "next/head";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap', // Optimize font loading
  preload: true,
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    site: "@akhil_web",
    description: siteConfig.description,
    images: [
      "https://raw.githubusercontent.com/akhil683/Etrant/refs/heads/main/public/og-image.png",
    ],
    creator: "@akkhil_dev",
  },
  icons: siteConfig.icons,
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <Head>
        <meta
          name="google-site-verification"
          content="EwF6VPOPDKObEf3SzaXf1GkyPmCdDiofW9MqDonM03w"
        />
      </Head>
      <PostHogProvider>
        <SessionProvider>
          <UserProvider>
            <ThemeProvider>
              <body className={`${inter.className} overflow-x-hidden`}>
                {children}
                <Script
                  src="https://checkout.razorpay.com/v1/checkout.js"
                  strategy="afterInteractive"
                />
                <Toaster />
              </body>
            </ThemeProvider>
          </UserProvider>
        </SessionProvider>
      </PostHogProvider>
    </html>
  );
}
