"use client"

import * as React from "react"
import Link from "next/link"

import { useConfig } from "@/hooks/use-config"
import { Button } from "@/components/ui/button"
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { CodeBlockCommand } from "@/components/code-block-command"
import { ComponentSourceClient } from "@/components/component-source-client"
import { Icons } from "@/components/icons"
import {
  serializeDesignSystemSearchParams,
  useDesignSystemSearchParams,
} from "@/app/(create)/lib/search-params"

interface PatternSourceSheetContentProps {
  name: string
  base: string
}

export function PatternSourceSheetContent({
  name,
  base,
}: PatternSourceSheetContentProps) {
  const [config] = useConfig()
  const [params] = useDesignSystemSearchParams()

  const styleName = `${config.base || "base"}-${config.style || "vega"}`

  const v0Url = React.useMemo(() => {
    const registryUrl = `https://reui.io/r/styles/${styleName}/${name}.json`
    const paramsString = serializeDesignSystemSearchParams("", params)
    return `https://v0.dev/chat/api/open?url=${encodeURIComponent(registryUrl + paramsString)}`
  }, [styleName, name, params])

  return (
    <SheetContent
      overlay={false}
      className="bg-sidebar flex flex-col gap-0 duration-200 data-ending-style:translate-x-8 data-ending-style:opacity-0 data-starting-style:translate-x-8 data-starting-style:opacity-0 sm:max-w-2xl [&_button.ring-offset-background]:hidden"
    >
      <SheetHeader className="p-6">
        <SheetTitle>Installation</SheetTitle>
      </SheetHeader>
      <div className="flex flex-1 flex-col overflow-hidden px-6 pb-6">
        <div className="border-border relative rounded-lg border">
          <CodeBlockCommand
            __bun__={`bunx --bun shadcn@latest add @reui/${name}`}
            __npm__={`npx shadcn@latest add @reui/${name}`}
            __pnpm__={`pnpm dlx shadcn@latest add @reui/${name}`}
            __yarn__={`yarn dlx shadcn@latest add @reui/${name}`}
          />
        </div>
        <div className="flex h-full flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-2">
            <h2 className="mt-6 mb-4 text-base font-semibold">Code</h2>
            <Button asChild variant="outline" size="sm">
              <Link href={v0Url} rel="noopener noreferrer" target="_blank">
                Open in<span className="sr-only">v0</span>
                <Icons.v0 className="ml-1 size-4" />
              </Link>
            </Button>
          </div>
          <div className="bg-code relative flex-1 grow overflow-hidden rounded-md border">
            <ComponentSourceClient
              className="*:data-rehype-pretty-code-figure:no-scrollbar no-scrollbar h-full overflow-auto *:data-rehype-pretty-code-figure:mt-0 *:data-rehype-pretty-code-figure:max-h-full *:data-rehype-pretty-code-figure:overflow-y-auto"
              collapsible={false}
              styleName={styleName}
              iconLibrary={config.iconLibrary}
              name={name}
              eventName="copy_pattern_code"
            />
          </div>
        </div>
      </div>
    </SheetContent>
  )
}
