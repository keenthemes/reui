"use client"

import * as React from "react"
import { lazy, Suspense } from "react"
import { SquareIcon } from "lucide-react"
import type { IconLibraryName } from "shadcn/icons"

import { useConfig } from "@/hooks/use-config"
import { DesignSystemContext } from "@/app/(create)/components/design-system-provider"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

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
  const context = React.useContext(DesignSystemContext)
  const [params] = useDesignSystemSearchParams()
  const [config] = useConfig()

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Priority: Context (includes overrides) > URL Params > LocalStorage Config
  const iconLibraryValue =
    context?.iconLibrary ?? params.iconLibrary ?? config.iconLibrary
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
