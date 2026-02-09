"use client"

import { SiteConfig } from "@/lib/config-context"

interface ConfigFormProps {
  config: SiteConfig
  onChange: (config: SiteConfig) => void
}

export function ConfigForm({ config, onChange }: ConfigFormProps) {
  const updateNavbar = (key: keyof SiteConfig["navbar"], value: string) => {
    onChange({
      ...config,
      navbar: { ...config.navbar, [key]: value },
    })
  }

  const updateHero = (
    key: keyof SiteConfig["hero"],
    value: string | string[]
  ) => {
    onChange({
      ...config,
      hero: { ...config.hero, [key]: value },
    })
  }

  return (
    <div className="h-full overflow-y-auto p-6 space-y-8">
      {/* Navbar Section */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">Navbar</h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="logo"
              className="block text-sm font-medium text-foreground/70 mb-1.5"
            >
              Logo Text
            </label>
            <input
              id="logo"
              type="text"
              value={config.navbar.logo}
              onChange={(e) => updateNavbar("logo", e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="profileColor"
              className="block text-sm font-medium text-foreground/70 mb-1.5"
            >
              Profile Color
            </label>
            <div className="flex items-center gap-3">
              <input
                id="profileColor"
                type="color"
                value={config.navbar.profileColor}
                onChange={(e) => updateNavbar("profileColor", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent"
              />
              <input
                type="text"
                value={config.navbar.profileColor}
                onChange={(e) => updateNavbar("profileColor", e.target.value)}
                className="flex-1 px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Hero Section
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="heroImage"
              className="block text-sm font-medium text-foreground/70 mb-1.5"
            >
              Image URL
            </label>
            <input
              id="heroImage"
              type="text"
              value={config.hero.image}
              onChange={(e) => updateHero("image", e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
              placeholder="/images/hero-bg.jpg"
            />
          </div>

          <div>
            <label
              htmlFor="heroTitle"
              className="block text-sm font-medium text-foreground/70 mb-1.5"
            >
              Title
            </label>
            <input
              id="heroTitle"
              type="text"
              value={config.hero.title}
              onChange={(e) => updateHero("title", e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="heroDescription"
              className="block text-sm font-medium text-foreground/70 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="heroDescription"
              value={config.hero.description}
              onChange={(e) => updateHero("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label
              htmlFor="genreTags"
              className="block text-sm font-medium text-foreground/70 mb-1.5"
            >
              Genre Tags{" "}
              <span className="text-foreground/40">(comma-separated)</span>
            </label>
            <input
              id="genreTags"
              type="text"
              value={config.hero.genreTags.join(", ")}
              onChange={(e) =>
                updateHero(
                  "genreTags",
                  e.target.value.split(",").map((s) => s.trim())
                )
              }
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
              placeholder="Comedy, Drama, Action"
            />
          </div>

          <div>
            <label
              htmlFor="maturityRating"
              className="block text-sm font-medium text-foreground/70 mb-1.5"
            >
              Maturity Rating
            </label>
            <input
              id="maturityRating"
              type="text"
              value={config.hero.maturityRating}
              onChange={(e) => updateHero("maturityRating", e.target.value)}
              className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-foreground placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-netflix-red focus:border-transparent"
              placeholder="TV-PG"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
