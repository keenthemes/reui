"use client"

import * as React from "react"
import { Code2Icon, EyeIcon } from "lucide-react"

import { DEFAULT_CONFIG } from "@/lib/preferences"
import { useConfig } from "@/hooks/use-config"
import { Spinner } from "@/components/ui/spinner"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlockCommand } from "@/components/code-block-command"
import { ComponentLivePreviewRuntime } from "@/app/(create)/components/components/component-live-preview-runtime"
import { ComponentSourceSheetCode } from "@/app/(create)/components/components/component-source-sheet-code"
import type { Component } from "@/app/(create)/components/types"

type ComponentWorkbenchMode = "preview" | "code"

interface ComponentWorkbenchPanelProps {
  component: Component
  base: string
  initialMode: ComponentWorkbenchMode
}

export function ComponentWorkbenchPanel({
  component,
  base,
  initialMode,
}: ComponentWorkbenchPanelProps) {
  const [config] = useConfig()
  const [mode, setMode] = React.useState<ComponentWorkbenchMode>(initialMode)
  const style = config.style || DEFAULT_CONFIG.style
  const styleName = `${base}-${style}`

  React.useEffect(() => {
    setMode(initialMode)
  }, [component.name, initialMode])

  return (
    <div className="flex min-h-screen w-full flex-col px-6 py-6 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4">
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">
            {component.title || component.name}
          </h1>
          <p className="text-site-muted-foreground text-sm">
            Live preview and installation code for {component.name}.
          </p>
        </div>
        <Tabs
          value={mode}
          onValueChange={(value) => setMode(value as ComponentWorkbenchMode)}
          className="min-h-0 flex-1 gap-4"
        >
          <TabsList>
            <TabsTrigger value="preview">
              <EyeIcon className="size-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code2Icon className="size-4" />
              Code
            </TabsTrigger>
          </TabsList>
          <TabsContent value="preview" className="min-h-0 flex-1">
            <div className="bg-site-muted/30 border-site-border site-rounded-2xl flex min-h-[32rem] flex-1 items-center justify-center border p-6">
              <div className="bg-site-background site-rounded-2xl border-site-border flex min-h-[24rem] w-full items-center justify-center border p-6">
                <React.Suspense
                  fallback={<Spinner className="size-4 opacity-60" />}
                >
                  <ComponentLivePreviewRuntime
                    name={component.name}
                    base={base}
                    category={component.primaryCategory}
                  />
                </React.Suspense>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="code" className="min-h-0 flex-1">
            <div className="space-y-4">
              <div className="border-site-border site-rounded-lg border">
                <CodeBlockCommand
                  __bun__={`bunx --bun shadcn@latest add @reui/${component.name}`}
                  __npm__={`npx shadcn@latest add @reui/${component.name}`}
                  __pnpm__={`pnpm dlx shadcn@latest add @reui/${component.name}`}
                  __yarn__={`yarn dlx shadcn@latest add @reui/${component.name}`}
                />
              </div>
              <div className="bg-site-code border-site-border site-rounded-lg relative min-h-[28rem] overflow-hidden border">
                <ComponentSourceSheetCode
                  className="*:data-rehype-pretty-code-figure:no-scrollbar no-scrollbar h-full overflow-auto *:data-rehype-pretty-code-figure:mt-0 *:data-rehype-pretty-code-figure:max-h-full *:data-rehype-pretty-code-figure:overflow-y-auto"
                  styleName={styleName}
                  iconLibrary={config.iconLibrary}
                  name={component.name}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
