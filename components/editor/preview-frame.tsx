"use client";

import { useRef, useEffect, useCallback } from "react";
import type { Brand, BrandConfig } from "@/lib/brands";

type ViewportMode = "mobile" | "desktop";

interface PreviewFrameProps {
  config: BrandConfig;
  viewport: ViewportMode;
  brand: Brand;
  fullScreen?: boolean;
}

export function PreviewFrame({
  config,
  viewport,
  brand,
  fullScreen = false,
}: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const isReadyRef = useRef(false);

  // Send config to iframe when it changes
  const sendConfig = useCallback(() => {
    if (iframeRef.current?.contentWindow && isReadyRef.current) {
      iframeRef.current.contentWindow.postMessage(
        { type: "CONFIG_UPDATE", config, viewport },
        "*",
      );
    }
  }, [config, viewport]);

  // Listen for iframe ready signal
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "PREVIEW_READY") {
        isReadyRef.current = true;
        sendConfig();
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [sendConfig]);

  // Send config whenever it changes
  useEffect(() => {
    sendConfig();
  }, [sendConfig]);

  // Resend config when viewport changes (iframe size change may need refresh)
  useEffect(() => {
    // Small delay to let iframe resize before resending
    const timer = setTimeout(() => {
      sendConfig();
    }, 100);
    return () => clearTimeout(timer);
  }, [viewport, sendConfig]);

  if (fullScreen) {
    return (
      <div className="h-full w-full bg-white">
        <iframe
          ref={iframeRef}
          src={`/${brand}/preview`}
          className="h-full w-full border-0"
          title="Preview"
        />
      </div>
    );
  }

  const frameWidth =
    viewport === "desktop"
      ? "max-w-[1680px]"
      : "w-[min(390px,100%,calc((100vh-215px)*9/19.5))] max-w-full";

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className={`w-full ${frameWidth}`}>
        {viewport === "mobile" ? (
          <div className="relative mx-auto rounded-[2.5rem] bg-zinc-900 p-3 shadow-2xl">
            <div className="absolute left-1/2 top-0 z-10 h-6 w-24 -translate-x-1/2 rounded-b-2xl bg-zinc-900" />
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2rem] bg-black">
              <iframe
                ref={iframeRef}
                src={`/${brand}/preview`}
                className="h-full w-full border-0"
                title="Preview"
              />
            </div>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-zinc-800 shadow-2xl">
            <div className="flex items-center gap-2 border-b border-zinc-700 bg-zinc-700 px-4 py-2">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <div className="h-3 w-3 rounded-full bg-green-500" />
              </div>
              <div className="mx-4 flex-1">
                <div className="rounded-md border border-zinc-600 bg-zinc-800 px-3 py-1 text-xs text-zinc-300">
                  localhost:3000
                </div>
              </div>
            </div>
            <div className="aspect-[16/10.8] bg-black">
              <iframe
                ref={iframeRef}
                src={`/${brand}/preview`}
                className="h-full w-full border-0"
                title="Preview"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
