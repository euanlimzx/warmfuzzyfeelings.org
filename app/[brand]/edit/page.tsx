"use client"

import { useState, useEffect } from "react"
import { Monitor, Smartphone } from "lucide-react"
import { ConfigForm } from "@/components/editor/config-form"
import { PreviewFrame } from "@/components/editor/preview-frame"
import { CreateButton } from "@/components/editor/create-button"
import { ShareDialog } from "@/components/editor/share-dialog"
import { getDefaultConfig } from "@/lib/brands"
import { useBrand } from "@/lib/brand-context"
import { useIsMobile } from "@/hooks/use-mobile"
import type { BrandConfig } from "@/lib/brands"

type ViewportMode = "mobile" | "desktop"
type MobileView = "editor" | "preview"

export default function EditPage() {
  const brand = useBrand()
  const [config, setConfig] = useState<BrandConfig>(() => getDefaultConfig(brand))
  const [viewport, setViewport] = useState<ViewportMode>("mobile")
  const [shareUuid, setShareUuid] = useState<string | null>(null)
  const [sidebarOpenKey, setSidebarOpenKey] = useState<string | null>("hero")
  const [mobileView, setMobileView] = useState<MobileView>("editor")
  const isBrowserMobile = useIsMobile()

  // When browser is desktop (not mobile): listen for preview clicks and open the matching sidebar section
  useEffect(() => {
    if (isBrowserMobile) return
    function handleMessage(event: MessageEvent) {
      const data = event.data
      if (data?.type !== "PREVIEW_CLICK") return
      if (data.target === "navbar") {
        setSidebarOpenKey("navbar")
      } else if (data.target === "hero") {
        setSidebarOpenKey("hero")
      } else if (data.target === "show" && typeof data.showIndex === "number") {
        if (data.showIndex >= 0) {
          setSidebarOpenKey(`show-${data.showIndex}`)
        }
      }
    }
    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [isBrowserMobile])

  // Desktop layout: current two-panel editor + preview
  if (!isBrowserMobile) {
    return (
      <div className="h-screen flex bg-gray-50 text-gray-900 font-sans">
        {/* Left Panel - Config Form (Light Mode) */}
        <div className="w-[400px] flex-shrink-0 border-r border-gray-200 bg-white flex flex-col">
          <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200">
            <h1 className="text-lg font-semibold text-gray-900">
              Edit Configuration
            </h1>
            <CreateButton config={config} brand={brand} onSuccess={setShareUuid} />
          </div>
          <div className="flex-1 overflow-hidden">
            <ConfigForm
              config={config}
              onChange={setConfig}
              openSectionKey={sidebarOpenKey}
              onOpenSectionKeyChange={setSidebarOpenKey}
            />
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col bg-gray-50">
          <div className="h-14 flex items-center justify-between px-6 border-b border-gray-200 bg-white">
            <h2 className="text-sm font-semibold text-gray-700">Preview</h2>

            {/* Viewport Toggle */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewport === "mobile"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Smartphone className="w-4 h-4" />
                Mobile
              </button>
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewport === "desktop"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Monitor className="w-4 h-4" />
                Desktop
              </button>
            </div>
          </div>
          <div className="flex-1 p-4 bg-gray-50">
            <PreviewFrame config={config} viewport={viewport} brand={brand} />
          </div>
        </div>

        {/* Share Dialog */}
        <ShareDialog
          uuid={shareUuid || ""}
          brand={brand}
          open={shareUuid !== null}
          onClose={() => setShareUuid(null)}
        />
      </div>
    )
  }

  // Mobile layout: single full-screen view (editor or preview) with floating toggle button
  return (
    <div className="relative h-screen bg-gray-50 text-gray-900 font-sans">
      {mobileView === "editor" ? (
        <div className="flex h-full flex-col bg-white">
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
            <h1 className="text-base font-semibold text-gray-900">
              Edit Configuration
            </h1>
            <CreateButton config={config} brand={brand} onSuccess={setShareUuid} />
          </div>
          <div className="flex-1 overflow-auto px-4 py-4">
            <ConfigForm
              config={config}
              onChange={setConfig}
              openSectionKey={sidebarOpenKey}
              onOpenSectionKeyChange={setSidebarOpenKey}
            />
          </div>
        </div>
      ) : (
        <div className="flex h-full flex-col bg-gray-50">
          <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200 bg-white">
            <h2 className="text-sm font-semibold text-gray-700">Preview</h2>
            {/* Viewport Toggle (same behavior as desktop) */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 border border-gray-200 rounded-lg">
              <button
                type="button"
                onClick={() => setViewport("mobile")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewport === "mobile"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Smartphone className="w-3 h-3" />
                Mobile
              </button>
              <button
                type="button"
                onClick={() => setViewport("desktop")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  viewport === "desktop"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Monitor className="w-3 h-3" />
                Desktop
              </button>
            </div>
          </div>
          <div className="flex-1 p-3 bg-gray-50">
            {viewport === "desktop" ? (
              <div className="flex h-full items-center justify-center rounded-lg border border-gray-200 bg-white px-4 text-center text-sm text-gray-600">
                Landscape previews are not supported on mobile. Please switch
                back to the Mobile view.
              </div>
            ) : (
              <PreviewFrame config={config} viewport={viewport} brand={brand} />
            )}
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <div className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
        <button
          type="button"
          className="pointer-events-auto w-full max-w-md rounded-full bg-netflix-red px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-black/50"
          onClick={() =>
            setMobileView((prev) => (prev === "editor" ? "preview" : "editor"))
          }
        >
          {mobileView === "editor"
            ? "Show preview"
            : "Return back to editing"}
        </button>
      </div>

      {/* Share Dialog */}
      <ShareDialog
        uuid={shareUuid || ""}
        brand={brand}
        open={shareUuid !== null}
        onClose={() => setShareUuid(null)}
      />
    </div>
  )
}
