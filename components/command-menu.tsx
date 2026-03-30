"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { type DialogProps } from "@radix-ui/react-dialog"
import { IconArrowRight } from "@tabler/icons-react"
import {
  CornerDownLeftIcon,
  LayoutGridIcon,
  SearchIcon,
  SquareDashedIcon,
} from "lucide-react"

import type { CategoryInfo } from "@/lib/registry"
import { cn, normalizeSlug } from "@/lib/utils"
import { useConfig } from "@/hooks/use-config"
import { useIsMac } from "@/hooks/use-is-mac"
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
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Separator } from "@/components/ui/separator"
import { copyToClipboardWithMeta } from "@/components/copy-button"

type CommandPage = {
  url: string
  name: string
  isComponent: boolean
}

export type CommandMenuGroup = {
  id: string
  name: string
  pages: CommandPage[]
}

export function CommandMenu({
  groups,
  navItems,
  componentCategories = [],
  ...props
}: DialogProps & {
  groups: CommandMenuGroup[]
  navItems?: { href: string; label: string; soon?: boolean }[]
  componentCategories?: CategoryInfo[]
}) {
  const router = useRouter()
  const isMac = useIsMac()
  const [config] = useConfig()
  const [open, setOpen] = React.useState(false)
  const [selectedType, setSelectedType] = React.useState<
    "color" | "page" | "component" | "category" | null
  >(null)
  const [copyPayload, setCopyPayload] = React.useState("")
  const packageManager = config.packageManager || "pnpm"

  const handlePageHighlight = React.useCallback(
    (isComponent: boolean, item: { url: string; name?: React.ReactNode }) => {
      if (isComponent) {
        const componentName = item.url.split("/").pop()
        setSelectedType("component")
        setCopyPayload(
          `${packageManager} dlx shadcn@latest add ${componentName}`
        )
      } else {
        setSelectedType("page")
        setCopyPayload("")
      }
    },
    [packageManager, setSelectedType, setCopyPayload]
  )

  const handleCategoryHighlight = React.useCallback(() => {
    setSelectedType("category")
    setCopyPayload("")
  }, [setSelectedType, setCopyPayload])

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

      if (e.key === "c" && (e.metaKey || e.ctrlKey)) {
        runCommand(() => {
          if (selectedType === "color") {
            copyToClipboardWithMeta(copyPayload, {
              name: "copy_command",
              properties: { color: copyPayload },
            })
          }

          if (selectedType === "page" || selectedType === "component") {
            copyToClipboardWithMeta(copyPayload, {
              name: "copy_command",
              properties: { command: copyPayload, pm: packageManager },
            })
          }
        })
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [copyPayload, runCommand, selectedType, packageManager])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className={cn(
            "text-site-foreground relative h-8 w-full justify-start bg-transparent pl-2! font-medium shadow-none sm:pr-12 md:w-21"
          )}
          onClick={() => setOpen(true)}
          {...props}
        >
          <SearchIcon className="size-4 shrink-0 opacity-60" />
          <div className="absolute top-1.5 right-1.5 hidden gap-1 sm:flex">
            <KbdGroup>
              <Kbd className="border">{isMac ? "⌘" : "Ctrl"}</Kbd>
              <Kbd className="border">K</Kbd>
            </KbdGroup>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="site-rounded-xl border-none bg-clip-padding p-2 pb-11 shadow-2xl ring-4 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-neutral-800"
      >
        <DialogHeader className="sr-only">
          <DialogTitle>Search...</DialogTitle>
          <DialogDescription>Search for a command to run...</DialogDescription>
        </DialogHeader>
        <Command
          className="**:data-[slot=command-input-wrapper]:bg-site-input/50 **:data-[slot=command-input-wrapper]:border-site-input site-rounded-none **:data-[slot=command-input-wrapper]:site-rounded-md bg-transparent **:data-[slot=command-input]:h-9! **:data-[slot=command-input]:py-0 **:data-[slot=command-input-wrapper]:mb-0 **:data-[slot=command-input-wrapper]:h-9! **:data-[slot=command-input-wrapper]:border"
          filter={(value, search, keywords) => {
            const extendValue = value + " " + (keywords?.join(" ") || "")
            if (extendValue.toLowerCase().includes(search.toLowerCase())) {
              return 1
            }
            return 0
          }}
        >
          <CommandInput placeholder="Search..." />
          <CommandList className="no-scrollbar min-h-80 scroll-pt-2 scroll-pb-1.5">
            <CommandEmpty className="text-site-muted-foreground py-12 text-center text-sm">
              No results found.
            </CommandEmpty>
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
                      setCopyPayload("")
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
            {groups.map((group) => {
              return (
                <CommandGroup
                  key={group.id}
                  heading={group.name}
                  className="p-0! **:[[cmdk-group-heading]]:scroll-mt-16 **:[[cmdk-group-heading]]:p-3! **:[[cmdk-group-heading]]:pb-1!"
                >
                  {group.pages.map((item) => {
                    return (
                      <CommandMenuItem
                        key={item.url}
                        value={item.name ? `${group.name} ${item.name}` : ""}
                        keywords={item.isComponent ? ["component"] : undefined}
                        onHighlight={() =>
                          handlePageHighlight(item.isComponent, item)
                        }
                        onSelect={() => {
                          runCommand(() => router.push(item.url))
                        }}
                      >
                        {item.isComponent ? (
                          <SquareDashedIcon />
                        ) : (
                          <IconArrowRight />
                        )}
                        {item.name}
                      </CommandMenuItem>
                    )
                  })}
                </CommandGroup>
              )
            })}
            {componentCategories.length > 0 && (
              <CommandGroup
                heading="Components"
                className="p-0! **:[[cmdk-group-heading]]:p-3!"
              >
                {componentCategories.map((category) => (
                  <CommandMenuItem
                    key={`component-cat-${category.name}`}
                    value={`Component category ${category.label}`}
                    onHighlight={handleCategoryHighlight}
                    keywords={[
                      "component",
                      "category",
                      category.name,
                      category.label,
                    ]}
                    onSelect={() => {
                      runCommand(() =>
                        router.push(
                          `/components/${normalizeSlug(category.name)}`
                        )
                      )
                    }}
                  >
                    <LayoutGridIcon />
                    {category.label}
                  </CommandMenuItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
        <div className="text-site-muted-foreground absolute inset-x-0 bottom-0 z-20 flex h-10 items-center gap-2 rounded-b-[12px] border-t border-t-neutral-100 bg-neutral-50 px-4 text-xs font-medium dark:border-t-neutral-700 dark:bg-neutral-800">
          <div className="flex items-center gap-2">
            <CommandMenuKbd>
              <CornerDownLeftIcon />
            </CommandMenuKbd>{" "}
            {selectedType === "page" || selectedType === "component"
              ? "Go to Page"
              : null}
            {selectedType === "category" ? "View Category" : null}
            {selectedType === "color" ? "Copy OKLCH" : null}
          </div>
          {copyPayload && (
            <>
              <Separator orientation="vertical" className="h-4!" />
              <div className="flex items-center gap-1">
                <CommandMenuKbd>{isMac ? "⌘" : "Ctrl"}</CommandMenuKbd>
                <CommandMenuKbd>C</CommandMenuKbd>
                {copyPayload}
              </div>
            </>
          )}
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
        "data-[selected=true]:border-site-input data-[selected=true]:bg-site-input/50 site-rounded-md h-9 border border-transparent px-3! font-medium",
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
        "bg-site-background text-site-muted-foreground border-site-border site-rounded-sm font-site-sans pointer-events-none flex h-5 items-center justify-center gap-1 border px-1 text-[0.7rem] font-medium select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}
