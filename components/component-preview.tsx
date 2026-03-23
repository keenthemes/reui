import * as React from "react"
import Image from "next/image"

import { getRegistryComponent } from "@/lib/registry"
import { ComponentClient } from "@/components/component-client"
import { ComponentPreviewTabs } from "@/components/component-preview-tabs"
import { ComponentSource } from "@/components/component-source"
import type { IconLibraryName } from "@/registry/config"

// Default styleName - matches the API default
const DEFAULT_STYLE_NAME = "radix-nova"

export function ComponentPreview({
  name,
  type,
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  styleName = DEFAULT_STYLE_NAME,
  iconLibrary,
  code,
  ...props
}: React.ComponentProps<"div"> & {
  name: string
  styleName?: string
  iconLibrary?: IconLibraryName
  align?: "center" | "start" | "end"
  description?: string
  hideCode?: boolean
  type?: "block" | "component" | "example"
  chromeLessOnMobile?: boolean
  previewClassName?: string
  code?: string
}) {
  const Component = getRegistryComponent(name, styleName)

  if (!Component) {
    return (
      <p className="text-site-muted-foreground mt-6 text-sm">
        Component{" "}
        <code className="bg-site-muted site-rounded-sm relative px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {name}
        </code>{" "}
        not found in registry.
      </p>
    )
  }

  return (
    <ComponentPreviewTabs
      className={className}
      previewClassName={previewClassName}
      align={align}
      hideCode={hideCode}
      component={<ComponentClient name={name} styleName={styleName} />}
      source={
        <ComponentSource
          name={name}
          collapsible={false}
          styleName={styleName}
          iconLibrary={iconLibrary}
          code={code}
          showCopyButton
        />
      }
      sourcePreview={
        <ComponentSource
          name={name}
          collapsible={false}
          styleName={styleName}
          iconLibrary={iconLibrary}
          maxLines={3}
          code={code}
          showCopyButton={false}
        />
      }
      chromeLessOnMobile={chromeLessOnMobile}
      {...props}
    />
  )
}
