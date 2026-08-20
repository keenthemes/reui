import * as React from "react"

import { resolveDocsPreviewClassName } from "@/lib/component-preview-frame"
import { getComponentByNameServer } from "@/lib/components-browse.server"
import {
  DEFAULT_DOCS_STYLE_NAME,
  getRegistryBaseName,
  resolveRegistryIconLibrary,
  resolveRegistryStyleName,
} from "@/lib/docs-registry-options"
import { ComponentPreviewTabs } from "@/components/component-preview-tabs"
import { ComponentSource } from "@/components/component-source"
import { DocsComponentPreviewSlot } from "@/components/docs-component-preview-slot"
import { DocsComponentPreviewSwitch } from "@/components/docs-mdx-components.client"
import type { IconLibraryName } from "@/registry/config"

type DocsComponentPreviewProps = React.ComponentProps<"div"> & {
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
  /**
   * Frame height in px for iframe-backed previews, authored per instance in
   * MDX. Takes precedence over the example's `previewHeight` meta. Ignored by
   * categories that still render inline.
   */
  previewHeight?: string | number
}

function inferComponentCategoryFromName(name: string) {
  const normalizedName = name.trim().toLowerCase()

  if (!normalizedName) {
    return undefined
  }

  return normalizedName.replace(/^c-/, "").replace(/-\d+$/, "") || undefined
}

export function DocsComponentPreview(props: DocsComponentPreviewProps) {
  const initialStyleName = resolveRegistryStyleName(props.styleName)
  const initialBase = getRegistryBaseName(initialStyleName)
  const initialIconLibrary = resolveRegistryIconLibrary(
    props.iconLibrary,
    initialStyleName
  )
  const registryComponent = getComponentByNameServer(props.name, initialBase)
  const initialCategory =
    registryComponent?.primaryCategory ??
    inferComponentCategoryFromName(props.name)
  // Fallback height for framed previews when the MDX tag does not author one.
  // Same manifest field the catalog cards read, so a height set once in the
  // category's meta.json applies on both surfaces.
  const initialPreviewHeight = registryComponent?.meta?.previewHeight

  const {
    name,
    className,
    previewClassName,
    align = "center",
    hideCode = false,
    chromeLessOnMobile = false,
    code,
    previewHeight,
    styleName: _styleName = DEFAULT_DOCS_STYLE_NAME,
    iconLibrary: _iconLibrary,
    type: _type,
    description: _description,
    ...rest
  } = props

  void _styleName
  void _iconLibrary
  void _type
  void _description

  return (
    <DocsComponentPreviewSwitch
      {...props}
      initialCategory={initialCategory}
      initialStyleName={initialStyleName}
      initialIconLibrary={initialIconLibrary}
      initialPreviewHeight={initialPreviewHeight}
    >
      <ComponentPreviewTabs
        align={align}
        hideCode={hideCode}
        className={className}
        previewClassName={resolveDocsPreviewClassName(
          initialCategory,
          previewClassName
        )}
        chromeLessOnMobile={chromeLessOnMobile}
        component={
          <DocsComponentPreviewSlot
            name={name}
            base={initialBase}
            category={initialCategory}
            title={props.description || name}
            previewHeight={previewHeight}
            metaPreviewHeight={initialPreviewHeight}
          />
        }
        source={
          <ComponentSource
            name={name}
            collapsible={false}
            styleName={initialStyleName}
            iconLibrary={initialIconLibrary}
            code={code}
            showCopyButton
          />
        }
        {...rest}
      />
    </DocsComponentPreviewSwitch>
  )
}
