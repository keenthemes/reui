import * as React from "react"

import {
  resolveRegistryIconLibrary,
  resolveRegistryStyleName,
} from "@/lib/docs-registry-options"
import { ComponentSource } from "@/components/component-source"
import { type ComponentSourceClientProps } from "@/components/component-source-client"
import { DocsComponentSourceSwitch } from "@/components/docs-mdx-components.client"
import type { IconLibraryName } from "@/registry/config"

type DocsComponentSourceProps = React.ComponentProps<"div"> &
  ComponentSourceClientProps & {
    iconLibrary?: IconLibraryName
  }

export function DocsComponentSource(props: DocsComponentSourceProps) {
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
