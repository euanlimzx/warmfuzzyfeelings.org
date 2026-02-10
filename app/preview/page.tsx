"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Navbar } from "@/components/netflix/navbar"
import { HeroSection } from "@/components/netflix/hero-section"
import { ContentRow } from "@/components/netflix/content-row"
import { BottomNav } from "@/components/netflix/bottom-nav"
import { ShowModal } from "@/components/netflix/show-modal"
import { NetflixIntro } from "@/components/netflix/netflix-intro"
import { ConfigProvider, getDefaultConfig, SiteConfig } from "@/lib/config-context"

type EditorViewport = "mobile" | "desktop" | null

export default function PreviewPage() {
  const [config, setConfig] = useState<SiteConfig>(getDefaultConfig)
  const [selectedShowId, setSelectedShowId] = useState<number | null>(null)
  const [editorViewport, setEditorViewport] = useState<EditorViewport>(null)

  // Derive show data from current config (updates when config changes)
  const selectedShow = selectedShowId
    ? config.shows.find((s) => s.id === selectedShowId) ?? null
    : null

  // Listen for config updates from parent window (editor)
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      const data = event.data
      if (data?.type === "CONFIG_UPDATE" && data?.config) {
        setConfig(data.config)
        if (data.viewport === "mobile" || data.viewport === "desktop") {
          setEditorViewport(data.viewport)
        } else {
          setEditorViewport(null)
        }
      }
    }

    window.addEventListener("message", handleMessage)

    // Notify parent that preview is ready
    window.parent.postMessage({ type: "PREVIEW_READY" }, "*")

    return () => window.removeEventListener("message", handleMessage)
  }, [])

  const handleCardClick = useCallback(
    (id: number) => {
      setSelectedShowId(id)
      if (editorViewport !== null) {
        const showIndex = config.shows.findIndex((s) => s.id === id)
        if (showIndex >= 0) {
          window.parent.postMessage(
            { type: "PREVIEW_CLICK", target: "show", showIndex },
            "*"
          )
        }
      }
    },
    [editorViewport, config.shows]
  )

  const handleEditorNavbarClick = useCallback(() => {
    window.parent.postMessage(
      { type: "PREVIEW_CLICK", target: "navbar" },
      "*"
    )
  }, [])

  const handleEditorHeroClick = useCallback(() => {
    window.parent.postMessage({ type: "PREVIEW_CLICK", target: "hero" }, "*")
  }, [])

  // Resolve show IDs to show data for each content row
  const resolvedRows = useMemo(() => {
    return config.contentRows.map((row) => ({
      title: row.title,
      items: row.showIds
        .map((id) => config.shows.find((s) => s.id === id))
        .filter((show): show is SiteConfig["shows"][0] => show !== undefined),
    }))
  }, [config.contentRows, config.shows])

  return (
    <ConfigProvider config={config}>
      <NetflixIntro />
      <main className="min-h-screen bg-background">
        <Navbar
          onEditorNavbarClick={
            editorViewport !== null ? handleEditorNavbarClick : undefined
          }
        />
        <HeroSection
          onEditorHeroClick={
            editorViewport !== null ? handleEditorHeroClick : undefined
          }
        />

        <div className="md:-mt-24 relative z-20 pt-4 md:pt-0">
          {resolvedRows.map((row) => (
            <ContentRow
              key={row.title}
              title={row.title}
              items={row.items}
              onCardClick={handleCardClick}
            />
          ))}
        </div>

        <div className="h-24 md:h-20" />
        <BottomNav />
        <ShowModal show={selectedShow} onClose={() => setSelectedShowId(null)} />
      </main>
    </ConfigProvider>
  )
}
