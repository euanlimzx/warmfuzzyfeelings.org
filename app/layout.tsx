import React from "react"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Netflix",
  description: "Watch TV shows and movies online. Stream smart on any device.",
}

export const viewport: Viewport = {
  themeColor: "#141414",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
