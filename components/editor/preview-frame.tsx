"use client"

import { useRef, useEffect, useCallback } from "react"
import { SiteConfig } from "@/lib/config-context"

interface PreviewFrameProps {
  config: SiteConfig
}

export function PreviewFrame({ config }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const isReadyRef = useRef(false)

  // Send config to iframe when it changes
  const sendConfig = useCallback(() => {
    if (iframeRef.current?.contentWindow && isReadyRef.current) {
      iframeRef.current.contentWindow.postMessage(
        { type: "CONFIG_UPDATE", config },
        "*"
      )
    }
  }, [config])

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

  return (
    <div className="relative w-full h-full bg-zinc-900 rounded-lg overflow-hidden">
      {/* Phone frame styling */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[390px] h-full max-h-[844px] bg-black rounded-[40px] p-2 shadow-2xl">
          {/* Phone notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-10" />

          {/* Screen */}
          <div className="w-full h-full bg-black rounded-[32px] overflow-hidden">
            <iframe
              ref={iframeRef}
              src="/preview"
              className="w-full h-full border-0"
              title="Preview"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
