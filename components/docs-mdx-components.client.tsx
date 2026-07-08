"use client"

import * as React from "react"

import {
  getRegistryBaseName,
  getSelectedRegistryStyleName,
  resolveRegistryOptions,
} from "@/lib/docs-registry-options"
import { useConfig } from "@/hooks/use-config"
import { ComponentPreviewTabs } from "@/components/component-preview-tabs"
import {
  ComponentSourceClient,
  type ComponentSourceClientProps,
} from "@/components/component-source-client"
import { DocsComponentLivePreview } from "@/components/docs-component-live-preview"
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

function useResolvedRegistryOptions(
  initialStyleName: string,
  initialIconLibrary: IconLibraryName
) {
  const [config] = useConfig()
  const [hasStoredConfig, setHasStoredConfig] = React.useState(false)

  React.useEffect(() => {
    setHasStoredConfig(window.localStorage.getItem("config") !== null)
  }, [])

  const resolvedStyleName = React.useMemo(
    () =>
      hasStoredConfig
        ? getSelectedRegistryStyleName(config.base, config.style)
        : initialStyleName,
    [config.base, config.style, hasStoredConfig, initialStyleName]
  )

  const resolvedIconLibrary = React.useMemo(() => {
    if (!hasStoredConfig) {
      return initialIconLibrary
    }

    return resolveRegistryOptions({
      styleName: resolvedStyleName,
      iconLibrary: config.iconLibrary,
    }).iconLibrary
  }, [
    config.iconLibrary,
    hasStoredConfig,
    initialIconLibrary,
    resolvedStyleName,
  ])

  return { resolvedStyleName, resolvedIconLibrary }
}

export function DocsComponentSourceSwitch({
  children,
  initialStyleName,
  initialIconLibrary,
  src,
  ...props
}: React.ComponentProps<"div"> &
  ComponentSourceClientProps & {
    children: React.ReactNode
    initialStyleName: string
    initialIconLibrary: IconLibraryName
  }) {
  const { resolvedStyleName, resolvedIconLibrary } = useResolvedRegistryOptions(
    initialStyleName,
    initialIconLibrary
  )

  if (
    src ||
    (resolvedStyleName === initialStyleName &&
      resolvedIconLibrary === initialIconLibrary)
  ) {
    return <>{children}</>
  }

  return (
    <ComponentSourceClient
      {...props}
      src={src}
      styleName={resolvedStyleName}
      iconLibrary={resolvedIconLibrary}
    />
  )
}

export function DocsComponentPreviewSwitch({
  children,
  initialCategory,
  initialStyleName,
  initialIconLibrary,
  name,
  styleName: _styleName,
  iconLibrary: _iconLibrary,
  type: _type,
  description: _description,
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  code,
  ...props
}: DocsComponentPreviewProps & {
  children: React.ReactNode
  initialCategory?: string
  initialStyleName: string
  initialIconLibrary: IconLibraryName
}) {
  void _styleName
  void _iconLibrary
  void _type
  void _description

  const { resolvedStyleName, resolvedIconLibrary } = useResolvedRegistryOptions(
    initialStyleName,
    initialIconLibrary
  )

  if (
    resolvedStyleName === initialStyleName &&
    resolvedIconLibrary === initialIconLibrary
  ) {
    return <>{children}</>
  }

  if (!initialCategory) {
    return (
      <p className="text-site-muted-foreground mt-6 text-sm">
        Component{" "}
        <code className="bg-site-muted site-rounded-sm font-site-mono relative px-[0.3rem] py-[0.2rem] text-sm">
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
      component={
        <DocsComponentLivePreview
          name={name}
          base={getRegistryBaseName(resolvedStyleName)}
          category={initialCategory}
        />
      }
      source={
        <ComponentSourceClient
          name={name}
          collapsible={false}
          styleName={resolvedStyleName}
          iconLibrary={resolvedIconLibrary}
          code={code}
          showCopyButton
        />
      }
      chromeLessOnMobile={chromeLessOnMobile}
      {...props}
    />
  )
}
