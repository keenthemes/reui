import { Suspense } from "react"

import { DarkModeScript } from "@/components/mode-switcher"
import { DesignSystemProvider } from "@/app/(create)/components/design-system-provider"
import { ItemPickerScript } from "@/app/(create)/components/item-picker"
import { PreviewStyle } from "@/app/(create)/components/preview-style"
import { RandomizeScript } from "@/app/(create)/components/random-button"
import { CustomizerSidebarScript } from "@/app/(create)/patterns/components/customizer-sidebar-script"
import { PatternsSidebarScript } from "@/app/(create)/patterns/components/patterns-sidebar-script"

export default function PatternsPreviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen" data-slot="patterns-preview">
      <PreviewStyle />
      <ItemPickerScript />
      <RandomizeScript />
      <DarkModeScript />
      <CustomizerSidebarScript />
      <PatternsSidebarScript />
      <Suspense fallback={null}>
        <DesignSystemProvider>{children}</DesignSystemProvider>
      </Suspense>
    </div>
  )
}
