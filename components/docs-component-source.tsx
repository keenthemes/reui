import * as React from "react"

import {
  resolveRegistryIconLibrary,
  resolveRegistryStyleName,
} from "@/lib/docs-registry-options"
import { ComponentSource } from "@/components/component-source"

import { DocsComponentSourceSwitch } from "./docs-mdx-components.client"

export function DocsComponentSource(
  props: React.ComponentProps<typeof ComponentSource>
) {
  const initialStyleName = resolveRegistryStyleName(props.styleName)
  const initialIconLibrary = resolveRegistryIconLibrary(
    props.iconLibrary,
    initialStyleName
  )

  return (
    <DocsComponentSourceSwitch
      {...props}
      initialStyleName={initialStyleName}
      initialIconLibrary={initialIconLibrary}
    >
      <ComponentSource
        {...props}
        styleName={initialStyleName}
        iconLibrary={initialIconLibrary}
      />
    </DocsComponentSourceSwitch>
  )
}
