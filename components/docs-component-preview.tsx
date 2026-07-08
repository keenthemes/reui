import * as React from "react"

import { getComponentByNameServer } from "@/lib/components-browse.server"
import {
  DEFAULT_DOCS_STYLE_NAME,
  getRegistryBaseName,
  resolveRegistryIconLibrary,
  resolveRegistryStyleName,
} from "@/lib/docs-registry-options"
import { ComponentPreviewTabs } from "@/components/component-preview-tabs"
import { ComponentSource } from "@/components/component-source"
import { DocsComponentLivePreview } from "@/components/docs-component-live-preview"
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
  const initialCategory =
    getComponentByNameServer(props.name, initialBase)?.primaryCategory ??
    inferComponentCategoryFromName(props.name)

  const {
    name,
    className,
    previewClassName,
    align = "center",
    hideCode = false,
    chromeLessOnMobile = false,
    code,
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
    >
      <ComponentPreviewTabs
        align={align}
        hideCode={hideCode}
        className={className}
        previewClassName={previewClassName}
        chromeLessOnMobile={chromeLessOnMobile}
        component={
          <DocsComponentLivePreview
            name={name}
            base={initialBase}
            category={initialCategory}
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
