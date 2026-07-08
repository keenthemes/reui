import { Suspense } from "react"
import type { Metadata } from "next"

import { cn } from "@/lib/utils"
import { DesignSystemProvider } from "@/app/(create)/design-system/design-system-provider"
import { LocksProvider } from "@/app/(create)/hooks/use-locks"
import { createFontVariables } from "@/app/(create)/lib/fonts"

// Bare iframe render targets, not standalone pages; keep them out of
// the index. See the note in preview/[base]/[block]/layout.tsx.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function ComponentsPreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        createFontVariables,
        "bg-site-background font-site-sans min-h-screen"
      )}
      data-slot="components-preview"
    >
      <Suspense fallback={null}>
        <LocksProvider>
          <DesignSystemProvider>{children}</DesignSystemProvider>
        </LocksProvider>
      </Suspense>
    </div>
  )
}
