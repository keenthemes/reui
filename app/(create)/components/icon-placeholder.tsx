"use client"

import * as React from "react"
import { lazy, Suspense } from "react"
import { SquareIcon } from "lucide-react"
import type { IconLibraryName } from "shadcn/icons"

import { useIconLibrary } from "@/lib/icon-library-store"

/**
 * IconPlaceholder — renders an icon from whatever library the user has
 * selected, with the name resolved per library via the props.
 *
 * Previously read state from `nuqs` + `DesignSystemContext` + jotai's
 * `useConfig`. That made the component impossible to bundle into a
 * workspace package — each package would carry its own copy of nuqs,
 * its own React Context, its own jotai store, and none of them would
 * see apps/web's runtime state.
 *
 * Now it reads only from `useIconLibrary`, which goes straight to
 * `window.localStorage` and listens for changes via a same-tab custom
 * event + the standard cross-tab `storage` event. No Context, no nuqs,
 * no jotai → safe to ship inside esbuild-bundled packages without any
 * multi-instance gotchas.
 */
const IconLucide = lazy(() =>
  import("@/registry/icons/icon-lucide").then((mod) => ({
    default: mod.IconLucide,
  }))
)

const IconTabler = lazy(() =>
  import("@/registry/icons/icon-tabler").then((mod) => ({
    default: mod.IconTabler,
  }))
)

const IconHugeicons = lazy(() =>
  import("@/registry/icons/icon-hugeicons").then((mod) => ({
    default: mod.IconHugeicons,
  }))
)

const IconPhosphor = lazy(() =>
  import("@/registry/icons/icon-phosphor").then((mod) => ({
    default: mod.IconPhosphor,
  }))
)

const IconRemixicon = lazy(() =>
  import("@/registry/icons/icon-remixicon").then((mod) => ({
    default: mod.IconRemixicon,
  }))
)

export function IconPlaceholder({
  ...props
}: {
  [K in IconLibraryName]: string
} & React.ComponentProps<"svg">) {
  const [mounted, setMounted] = React.useState(false)
  const iconLibraryValue = useIconLibrary()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const iconName = props[iconLibraryValue]

  if (!iconName || !mounted) {
    return null
  }

  return (
    <Suspense
      key={`${iconLibraryValue}-${iconName}`}
      fallback={<SquareIcon {...props} />}
    >
      {iconLibraryValue === "lucide" && (
        <IconLucide name={iconName} {...props} />
      )}
      {iconLibraryValue === "tabler" && (
        <IconTabler name={iconName} {...props} />
      )}
      {iconLibraryValue === "hugeicons" && (
        <IconHugeicons name={iconName} {...props} />
      )}
      {iconLibraryValue === "phosphor" && (
        <IconPhosphor name={iconName} {...props} />
      )}
      {iconLibraryValue === "remixicon" && (
        <IconRemixicon name={iconName} {...props} />
      )}
    </Suspense>
  )
}
