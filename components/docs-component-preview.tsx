import * as React from "react"

import {
  resolveRegistryIconLibrary,
  resolveRegistryStyleName,
} from "@/lib/docs-registry-options"
import { ComponentPreview } from "@/components/component-preview"

import { DocsComponentPreviewSwitch } from "./docs-mdx-components.client"

export function DocsComponentPreview(
  props: React.ComponentProps<typeof ComponentPreview>
) {
  const initialStyleName = resolveRegistryStyleName(props.styleName)
  const initialIconLibrary = resolveRegistryIconLibrary(
    props.iconLibrary,
    initialStyleName
  )

  return (
    <DocsComponentPreviewSwitch
      {...props}
      initialStyleName={initialStyleName}
      initialIconLibrary={initialIconLibrary}
    >
      <ComponentPreview
        {...props}
        styleName={initialStyleName}
        iconLibrary={initialIconLibrary}
      />
    </DocsComponentPreviewSwitch>
  )
}
