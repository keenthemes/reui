"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"

import { PAGES_NEW } from "@/lib/docs"
import { showMcpDocs } from "@/lib/flags"
import { source } from "@/lib/source"
import { cn, isActive } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

export function MobileNav({
  items,
  tree,
  className,
}: {
  tree: ReturnType<typeof source.getPageTree>
  items: { href: string; label: string; soon?: boolean }[]
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()

  const activeFolders = React.useMemo(() => {
    const folders: string[] = []
    tree.children.forEach((item) => {
      if (item.type === "folder") {
        const hasActiveChild = item.children.some(
          (child) => child.type === "page" && child.url === pathname
        )
        if (hasActiveChild && item.$id) {
          folders.push(item.$id)
        }
      }
    })
    return folders
  }, [tree.children, pathname])

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="left">
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "extend-touch-target h-8 touch-manipulation items-center justify-start gap-2.5 p-0! hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 active:bg-transparent dark:hover:bg-transparent",
            className
          )}
        >
          <Menu />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="h-full">
        <DrawerHeader className="sr-only">
          <DrawerTitle>Navigation Menu</DrawerTitle>
          <DrawerDescription>
            Access the main sections and documentation of ReUI.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-8 overflow-auto px-6 py-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <MobileLink
                href="/"
                onOpenChange={setOpen}
                active={pathname === "/"}
              >
                Home
              </MobileLink>
              {items.map((item, index) => {
                const isDocs = item.href === "/docs"
                return (
                  <div key={index} className="flex flex-col gap-3">
                    {isDocs ? (
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue={
                          isActive(pathname, "/docs") ? "docs" : undefined
                        }
                      >
                        <AccordionItem value="docs" className="border-none">
                          <AccordionTrigger className="text-foreground/70 [&[data-state=open]]:text-primary py-0 text-sm font-medium hover:no-underline">
                            {item.label}
                          </AccordionTrigger>
                          <AccordionContent className="pt-4 pb-0">
                            <div className="flex flex-col gap-4">
                              <MobileLink
                                href={item.href}
                                onOpenChange={setOpen}
                                active={pathname === item.href}
                                className="pl-4"
                              >
                                Introduction
                              </MobileLink>
                              <Accordion
                                type="multiple"
                                defaultValue={activeFolders}
                                className="w-full pl-4"
                              >
                                {tree.children.map((item) => {
                                  if (item.type !== "folder") return null

                                  return (
                                    <AccordionItem
                                      key={item.$id}
                                      value={item.$id ?? ""}
                                      className="border-none"
                                    >
                                      <AccordionTrigger className="text-foreground/70 py-2 text-sm font-medium hover:no-underline">
                                        {item.name}
                                      </AccordionTrigger>
                                      <AccordionContent className="pb-2">
                                        <div className="flex flex-col gap-2 pt-1 pl-4">
                                          {item.children.map((child) => {
                                            if (
                                              child.type === "page" &&
                                              !showMcpDocs &&
                                              child.url?.includes("/mcp")
                                            ) {
                                              return null
                                            }

                                            return (
                                              child.type === "page" && (
                                                <MobileLink
                                                  key={child.url}
                                                  href={child.url}
                                                  onOpenChange={setOpen}
                                                  active={
                                                    child.url === pathname
                                                  }
                                                  className="flex items-center gap-2 text-sm font-normal"
                                                >
                                                  {child.name}
                                                  {PAGES_NEW?.includes(
                                                    child.url as never
                                                  ) && (
                                                    <span
                                                      className="flex size-1.5 rounded-full bg-blue-500"
                                                      title="New"
                                                    />
                                                  )}
                                                </MobileLink>
                                              )
                                            )
                                          })}
                                        </div>
                                      </AccordionContent>
                                    </AccordionItem>
                                  )
                                })}
                              </Accordion>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : item.soon ? (
                      <span className="text-foreground/40 flex items-center gap-2 text-sm font-medium">
                        {item.label}
                        <span className="bg-muted text-muted-foreground rounded px-1.5 py-0.5 text-[10px] leading-none font-medium">
                          Soon
                        </span>
                      </span>
                    ) : (
                      <MobileLink
                        href={item.href}
                        onOpenChange={setOpen}
                        active={isActive(pathname, item.href)}
                      >
                        {item.label}
                      </MobileLink>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  active,
  ...props
}: LinkProps & {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
  active?: boolean
}) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(
        "hover:text-primary text-sm font-medium transition-colors",
        active ? "text-primary" : "text-foreground/70",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
