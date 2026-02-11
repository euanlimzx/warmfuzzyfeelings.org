"use client"

import { useRef, useEffect, useCallback } from "react"
import type { Brand, BrandConfig } from "@/lib/brands"

type ViewportMode = "mobile" | "desktop"

interface PreviewFrameProps {
  config: BrandConfig
  viewport: ViewportMode
  brand: Brand
  fullScreen?: boolean
}

export function PreviewFrame({
  config,
  viewport,
  brand,
  fullScreen = false,
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isReadyRef = useRef(false)

  // Send config to iframe when it changes
  const sendConfig = useCallback(() => {
    if (iframeRef.current?.contentWindow && isReadyRef.current) {
      iframeRef.current.contentWindow.postMessage(
        { type: "CONFIG_UPDATE", config, viewport },
        "*"
      )
    }
  }, [config, viewport])

  // Listen for iframe ready signal
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "PREVIEW_READY") {
        isReadyRef.current = true
        sendConfig()
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [sendConfig])

  // Send config whenever it changes
  useEffect(() => {
    sendConfig()
  }, [sendConfig])

  // Resend config when viewport changes (iframe size change may need refresh)
  useEffect(() => {
    // Small delay to let iframe resize before resending
    const timer = setTimeout(() => {
      sendConfig()
    }, 100)
    return () => clearTimeout(timer)
  }, [viewport, sendConfig])

  const frameClasses = fullScreen
    ? "w-full h-full bg-white"
    : viewport === "desktop"
      ? "w-full h-full max-w-[1200px] rounded-xl border border-gray-200 bg-white shadow-lg"
      : "w-full max-w-[390px] h-full max-h-[844px] rounded-[40px] border border-gray-200 bg-white p-3 shadow-lg"

  return (
    <div className="relative w-full h-full min-h-[200px] rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center p-4 transition-all duration-300">
        {/* Frame container - changes style based on viewport */}
        <div
          className={`relative flex flex-col overflow-hidden shadow-2xl transition-all duration-300 ${frameClasses}`}
        >
          {/* Desktop browser chrome - only shown in desktop mode and non-fullscreen */}
          {!fullScreen && viewport === "desktop" && (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b border-gray-200">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 mx-4">
                <div className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs text-gray-500">
                  localhost:3000
                </div>
              </div>
            </div>
          )}

          {/* Screen/Content area */}
          <div
            className={`flex-1 overflow-hidden ${
              !fullScreen && viewport === "mobile" ? "bg-white rounded-[32px]" : ""
            }`}
          >
            <iframe
              ref={iframeRef}
              src={`/${brand}/preview`}
              className="w-full h-full border-0"
              title="Preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
