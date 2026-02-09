"use client"

import { Play, Info, Plus } from "lucide-react"
import Image from "next/image"
import { siteConfig } from "@/lib/config"

export function HeroSection() {
  const { desktop, mobile } = siteConfig.hero

  return (
    <>
      {/* Desktop Hero */}
      <section className="relative w-full h-[85vh] min-h-[500px] hidden md:block">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src={desktop.backgroundImage || "/placeholder.svg"}
            alt={desktop.backgroundAlt}
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-transparent" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-end h-full px-12 pb-40">
          <h1
            className="text-7xl lg:text-8xl font-bold text-foreground mb-4 max-w-2xl leading-tight tracking-tight"
            style={{ fontFamily: "'Georgia', serif", fontStyle: "italic" }}
          >
            <span
              className="block text-5xl lg:text-6xl font-light text-foreground/90 tracking-wide"
              style={{ fontStyle: "italic" }}
            >
              {desktop.titleLine1}
            </span>
            {desktop.titleLine2}
          </h1>

          <p className="text-base text-foreground/90 max-w-md leading-relaxed mb-6">
            {desktop.description}
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-8 py-2.5 bg-foreground text-background rounded font-semibold text-base hover:bg-foreground/80 transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              {desktop.playButtonLabel}
            </button>

            <button
              type="button"
              className="flex items-center gap-2 px-8 py-2.5 bg-foreground/30 text-foreground rounded font-semibold text-base hover:bg-foreground/20 transition-colors backdrop-blur-sm"
            >
              <Info className="w-5 h-5" />
              {desktop.moreInfoButtonLabel}
            </button>
          </div>
        </div>

        {/* Bottom-right maturity rating */}
        <div className="absolute bottom-40 right-12 z-10 flex items-center gap-2">
          <button
            type="button"
            className="w-9 h-9 rounded-full border-2 border-foreground/50 flex items-center justify-center text-foreground/70 hover:border-foreground transition-colors"
            aria-label="Replay"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.5 2v6h-6" />
              <path d="M21.34 15.57a10 10 0 1 1-.57-8.38" />
            </svg>
          </button>
          <div className="border-l-2 border-foreground/50 pl-3 py-0.5">
            <span className="text-sm text-foreground/80 font-medium">
              {desktop.maturityRating}
            </span>
          </div>
        </div>
      </section>

      {/* Mobile Hero */}
      <section className="relative w-full md:hidden pt-28 px-4 pb-4">
        {/* Background tint */}
        <div className="absolute inset-0 bg-background" />

        {/* Portrait poster card */}
        <div className="relative z-10">
          <div className="relative w-full aspect-[2/3] max-w-[85%] mx-auto rounded-lg overflow-hidden shadow-2xl shadow-black/40">
            <Image
              src={mobile.posterImage || "/placeholder.svg"}
              alt={mobile.posterAlt}
              fill
              className="object-cover"
              priority
            />

            {/* Bottom gradient for text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

            {/* Title and genre tags at the bottom of the poster */}
            <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
              <h1 className="text-6xl font-extrabold text-foreground tracking-widest mb-2 text-center">
                {mobile.title}
              </h1>
              <p className="text-sm text-foreground/70 tracking-wide">
                {mobile.genreTags.map((tag, i) => (
                  <span key={tag}>
                    {i > 0 && (
                      <span className="mx-2 text-netflix-red">{"•"}</span>
                    )}
                    {tag}
                  </span>
                ))}
              </p>
            </div>
          </div>

          {/* Action buttons below the poster */}
          <div className="flex items-center gap-3 mt-4 px-2">
            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-foreground text-background rounded font-semibold text-base"
            >
              <Play className="w-5 h-5 fill-current" />
              {mobile.playButtonLabel}
            </button>

            <button
              type="button"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#333333] text-foreground rounded font-semibold text-base"
            >
              <Plus className="w-5 h-5" />
              {mobile.myListButtonLabel}
            </button>
          </div>
        </div>
      </section>
    </>
  )
}
