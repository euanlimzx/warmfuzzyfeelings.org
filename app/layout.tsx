import React from "react";
import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Toaster } from "sonner";

import "./globals.css";

export const metadata: Metadata = {
  title: "warmfuzzyfeelings.org",
  description: "warmfuzzyfeelings.org",
  openGraph: {
    title: "warmfuzzyfeelings.org",
    description: "warmfuzzyfeelings.org",
  },
  twitter: {
    title: "warmfuzzyfeelings.org",
    description: "warmfuzzyfeelings.org",
  },
};

export const viewport: Viewport = {
  themeColor: "#141414",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-background text-foreground overflow-x-hidden font-sans">
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
