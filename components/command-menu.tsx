"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { type DialogProps } from "@radix-ui/react-dialog"
import { IconArrowRight } from "@tabler/icons-react"
import { Component, CornerDownLeftIcon, SearchIcon } from "lucide-react"

import type { ComponentCategoryInfo } from "@/lib/component-stats"
import { cn, normalizeSlug } from "@/lib/utils"
import { useMutationObserver } from "@/hooks/use-mutation-observer"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function CommandMenu({
  navItems,
  componentCategories = [],
  ...props
}: DialogProps & {
  navItems?: { href: string; label: string; soon?: boolean }[]
  componentCategories?: ComponentCategoryInfo[]
}) {
  const router = useRouter()
  const [open, setOpen] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState<
    "page" | "component" | null
  >(null)

  const handleComponentHighlight = React.useCallback(() => {
    setSelectedType("component")
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return
        }

        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Search"
          className="size-8"
          onClick={() => setOpen(true)}
          {...props}
        >
          <SearchIcon className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="site-theme-container site-rounded-xl border-site-border/70 bg-site-popover text-site-popover-foreground ring-site-border/40 bg-clip-padding p-2 pb-11 shadow-2xl ring-1 sm:max-w-[560px]"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search</DialogTitle>
          <DialogDescription>Search components and docs</DialogDescription>
        </DialogHeader>
        <Command
          className="**:data-[slot=command-input-wrapper]:bg-site-input/50 **:data-[slot=command-input-wrapper]:border-site-input site-rounded-none **:data-[slot=command-input-wrapper]:site-rounded-lg bg-transparent **:data-[slot=command-input]:h-9! **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input-wrapper]:border"
          filter={(value, search, keywords) => {
            const extendValue = value + " " + (keywords?.join(" ") || "")
            if (extendValue.toLowerCase().includes(search.toLowerCase())) {
              return 1
            }
            return 0
          }}
        >
          <CommandInput placeholder="Search components and docs" />
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="text-site-muted-foreground py-12 text-center text-sm">
              No results found.
            </CommandEmpty>

            {/* Pages */}
            {navItems && navItems.length > 0 && (
              <CommandGroup
                heading="Pages"
                className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
              >
                {navItems.map((item) => (
                  <CommandMenuItem
                    key={item.href}
                    value={`Navigation ${item.label}`}
                    keywords={["nav", "navigation", item.label.toLowerCase()]}
                    disabled={item.soon}
                    onHighlight={() => {
                      setSelectedType("page")
                    }}
                    onSelect={() => {
                      if (!item.soon) {
                        runCommand(() => router.push(item.href))
                      }
                    }}
                  >
                    <IconArrowRight />
                    <span className={cn(item.soon && "opacity-50")}>
                      {item.label}
                    </span>
                    {item.soon && (
                      <span className="bg-site-muted text-site-muted-foreground site-rounded-sm ml-auto px-1.5 py-0.5 text-[10px] leading-none font-medium">
                        Soon
                      </span>
                    )}
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}

            {componentCategories.length > 0 && (
              <CommandGroup
                heading="Components"
                className="p-0! **:[[cmdk-group-heading]]:p-3!"
              >
                {componentCategories.map((category) => (
                  <CommandMenuItem
                    key={`component-cat-${category.slug}`}
                    value={`Component ${category.label}`}
                    onHighlight={handleComponentHighlight}
                    keywords={[
                      "component",
                      "components",
                      category.slug,
                      category.label.toLowerCase(),
                    ]}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/components/${normalizeSlug(category.slug)}`
                        )
                      )
                    }}
                  >
                    <Component />
                    <span className="flex-1 truncate">{category.label}</span>
                    <span className="text-site-muted-foreground ml-auto shrink-0 text-xs tabular-nums">
                      {category.count}
                    </span>
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        <div className="text-site-muted-foreground site-rounded-b-lg border-site-border bg-site-surface absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 border-t px-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>{" "}
            {selectedType === "page" ? "Go to Page" : null}
            {selectedType === "component" ? "Browse Component" : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CommandMenuItem({
  children,
  className,
  onHighlight,
  ...props
}: React.ComponentProps<typeof CommandItem> & {
  onHighlight?: () => void
  "data-selected"?: string
  "aria-selected"?: string
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  useMutationObserver(ref, (mutations) => {
    mutations.forEach((mutation) => {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "aria-selected" &&
        ref.current?.getAttribute("aria-selected") === "true"
      ) {
        onHighlight?.()
      }
    })
  })

  return (
    <CommandItem
      ref={ref}
      className={cn(
        "data-[selected=true]:border-site-input data-[selected=true]:bg-site-input/50 site-rounded-lg! h-9 border border-transparent px-3! font-medium",
        className
      )}
      {...props}
    >
      {children}
    </CommandItem>
  )
}

function CommandMenuKbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      className={cn(
        "bg-site-background text-site-muted-foreground border-site-border font-site-sans site-rounded-sm pointer-events-none flex h-5 items-center justify-center gap-1 border px-1 text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}
