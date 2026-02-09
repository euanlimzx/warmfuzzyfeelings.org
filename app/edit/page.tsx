"use client"

import { useState } from "react"
import { ConfigForm } from "@/components/editor/config-form"
import { PreviewFrame } from "@/components/editor/preview-frame"
import { getDefaultConfig, SiteConfig } from "@/lib/config-context"

export default function EditPage() {
  const [config, setConfig] = useState<SiteConfig>(getDefaultConfig)

  return (
    <div className="h-screen flex bg-zinc-950">
      {/* Left Panel - Config Form */}
      <div className="w-[400px] flex-shrink-0 border-r border-zinc-800 bg-zinc-900">
        <div className="h-14 flex items-center px-6 border-b border-zinc-800">
          <h1 className="text-lg font-semibold text-foreground">
            Edit Configuration
          </h1>
        </div>
        <div className="h-[calc(100vh-56px)]">
          <ConfigForm config={config} onChange={setConfig} />
        </div>
      </div>

      {/* Right Panel - Preview */}
      <div className="flex-1 flex flex-col">
        <div className="h-14 flex items-center justify-between px-6 border-b border-zinc-800">
          <h2 className="text-sm font-medium text-foreground/70">Preview</h2>
          {/* Future: viewport toggle buttons will go here */}
        </div>
        <div className="flex-1 p-4">
          <PreviewFrame config={config} />
        </div>
      </div>
    </div>
  )
}
