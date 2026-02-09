"use client"

import { createContext, useContext, ReactNode } from "react"
import { siteConfig } from "./config"

// Mutable version of the config type for editing
export type SiteConfig = {
  navbar: {
    logo: string
    profileColor: string
    navLinks: Array<{ label: string; active: boolean }>
  }
  hero: {
    image: string
    imageAlt: string
    title: string
    description: string
    genreTags: string[]
    maturityRating: string
    playButtonLabel: string
    moreInfoButtonLabel: string
    myListButtonLabel: string
  }
  bottomNav: typeof siteConfig.bottomNav
  contentRows: typeof siteConfig.contentRows
  modal: typeof siteConfig.modal
  shows: typeof siteConfig.shows
}

// Create a mutable copy of the default config for use as initial editor state
export function getDefaultConfig(): SiteConfig {
  return {
    navbar: {
      logo: siteConfig.navbar.logo,
      profileColor: siteConfig.navbar.profileColor,
      navLinks: siteConfig.navbar.navLinks.map((link) => ({ ...link })),
    },
    hero: {
      image: siteConfig.hero.image,
      imageAlt: siteConfig.hero.imageAlt,
      title: siteConfig.hero.title,
      description: siteConfig.hero.description,
      genreTags: [...siteConfig.hero.genreTags],
      maturityRating: siteConfig.hero.maturityRating,
      playButtonLabel: siteConfig.hero.playButtonLabel,
      moreInfoButtonLabel: siteConfig.hero.moreInfoButtonLabel,
      myListButtonLabel: siteConfig.hero.myListButtonLabel,
    },
    bottomNav: siteConfig.bottomNav,
    contentRows: siteConfig.contentRows,
    modal: siteConfig.modal,
    shows: siteConfig.shows,
  }
}

// Context for providing config to components
const ConfigContext = createContext<SiteConfig | null>(null)

// Hook to get config - falls back to siteConfig if no context provided
export function useConfig(): SiteConfig {
  const context = useContext(ConfigContext)
  return context ?? (siteConfig as unknown as SiteConfig)
}

// Provider component for wrapping preview with custom config
export function ConfigProvider({
  config,
  children,
}: {
  config: SiteConfig
  children: ReactNode
}) {
  return (
    <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>
  )
}
