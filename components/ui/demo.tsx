"use client"

import * as React from "react"
import GlassFolder, { FolderFile } from "@/components/ui/glass-folder-cards"

/**
 * Verified Unsplash stock images for cards, artwork, and project sheets
 */
const DEMO_IMAGES = {
  // Abstract fluid art for folder backdrop
  abstractFluid: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  // Architectural design sheet
  architecture: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
  // Minimalist creative photography
  minimalStudio: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
  // Modern graphic artwork
  modernArt: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80",
}

/**
 * Three folders on a dotted desk: milk glass over a long-exposure print with a
 * key that adds files, a plain archive with a menu, and smoked glass over red
 * ink. Hover one to lean its glass toward you, click it to open it.
 */
export default function GlassFolderCardsDemo() {
  const archiveFiles: FolderFile[] = [
    { name: "Lookbook 2024", meta: "38 images", art: "dusk", image: DEMO_IMAGES.modernArt },
    { name: "Invoices", meta: "12 PDFs" },
    { name: "Shoot — Lisbon", meta: "RAW · 2.1 GB", art: "ember", image: DEMO_IMAGES.minimalStudio },
    { name: "Contract.pdf", meta: "PDF · 320 KB" },
  ]

  const darkFolderFiles: FolderFile[] = [
    { name: "Stills", meta: "64 images", art: "verdant", image: DEMO_IMAGES.architecture },
    { name: "Edit notes", meta: "TXT · 4 KB" },
    { name: "Grade v3", meta: "DRX · 18 MB", art: "aurora" },
  ]

  return (
    <div
      className="relative flex w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-16"
      style={{ minHeight: "100svh" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 text-foreground opacity-[0.13]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1.1px, transparent 1.4px)",
          backgroundSize: "22px 22px",
        }}
      />
      <div className="relative grid max-w-[1180px] grid-cols-1 items-end justify-items-center gap-x-14 gap-y-10 md:grid-cols-2 xl:grid-cols-3">
        <GlassFolder
          label="My Files"
          art="aurora"
          seed={3}
          appearDelay={0}
        />
        <GlassFolder
          label="Archives"
          art="none"
          action="more"
          labelPlacement="top-left"
          appearDelay={140}
          files={archiveFiles}
          menu={[{ label: "Rename" }, { label: "Share…" }, { label: "Move to Trash", danger: true }]}
        />
        <GlassFolder
          label="My Files"
          meta="Wed 19 Aug"
          tone="dark"
          art="ember"
          seed={11}
          action="none"
          labelPlacement="top-right"
          appearDelay={280}
          files={darkFolderFiles}
        />
      </div>
      <p className="relative mt-14 font-mono text-[11px] tracking-[0.18em] text-muted-foreground uppercase">
        Hover to lean · Click to open · + to add
      </p>
    </div>
  )
}
