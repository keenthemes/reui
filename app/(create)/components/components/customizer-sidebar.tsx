"use client"

import * as React from "react"
import dynamic from "next/dynamic"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

import { CustomizerSidebarHeader } from "./customizer-sidebar-header"
import { useCustomizer } from "./components-provider"

/** Client-only: nuqs + jotai + theme pickers diverge from SSR; avoids hydration errors. */
const CustomizerSidebarContent = dynamic(
  () =>
    import("./customizer-sidebar-content").then(
      (m) => m.CustomizerSidebarContent
    ),
  {
    ssr: false,
    loading: () => (
      <div className="max-h-[calc(100svh-240px)] flex-1" aria-hidden />
    ),
  }
)

export function CustomizerSidebar() {
  const { customizerOpen } = useCustomizer()
  const isMobile = useIsMobile()
  const anchorRef = React.useRef<HTMLDivElement | null>(null)

  if (isMobile) {
    return null
  }

  return (
    <aside
      ref={anchorRef}
      className={cn(
        "bg-site-background border-site-border/80 sticky top-(--header-height) hidden h-[calc(100svh-var(--header-height))] w-60 shrink-0 flex-col overflow-hidden border-l transition-[width,transform] duration-300 ease-in-out lg:flex",
        !customizerOpen && "w-0 border-l-0"
      )}
    >
      <div className="flex h-full w-60 flex-col">
        <CustomizerSidebarHeader />
        <CustomizerSidebarContent isMobile={isMobile} anchorRef={anchorRef} />
      </div>
    </aside>
  )
}
