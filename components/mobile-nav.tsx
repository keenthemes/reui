"use client"

import * as React from "react"
import Link, { LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu } from "lucide-react"

import { getDocsPageUpdateHint } from "@/lib/docs"
import { showMcpDocs } from "@/lib/flags"
import {
  getAllPagesFromFolder,
  getCurrentBase,
  getPagesFromFolder,
} from "@/lib/page-tree"
import type { CategoryInfo } from "@/lib/registry"
import { source } from "@/lib/source"
import { cn, isActive, normalizeSlug } from "@/lib/utils"
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
import { ComponentUpdateIndicator } from "@/components/component-update-indicator"

export function MobileNav({
  items,
  tree,
  componentCategories,
  className,
}: {
  tree: ReturnType<typeof source.getPageTree>
  items: { href: string; label: string; soon?: boolean }[]
  componentCategories?: CategoryInfo[]
  className?: string
}) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
  const currentBase = getCurrentBase(pathname)
  const mobileComponentCategories = React.useMemo(
    () => componentCategories ?? [],
    [componentCategories]
  )
  const componentCategoryLinks = React.useMemo(
    () =>
      [...mobileComponentCategories]
        .sort((a, b) => a.label.localeCompare(b.label))
        .map((category) => ({
          ...category,
          href: `/components/${normalizeSlug(category.name)}`,
        })),
    [mobileComponentCategories]
  )
  const totalComponentCount = React.useMemo(
    () =>
      mobileComponentCategories.reduce(
        (total, category) => total + category.count,
        0
      ),
    [mobileComponentCategories]
  )

  const activeFolders = React.useMemo(() => {
    const folders: string[] = []
    tree.children.forEach((item) => {
      if (item.type === "folder") {
        const hasActiveChild = getAllPagesFromFolder(item).some(
          (page) => page.url === pathname
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
                const isComponents = item.href === "/components"
                return (
                  <div key={index} className="flex flex-col gap-3">
                    {isComponents ? (
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue={
                          isActive(pathname, "/components")
                            ? "components"
                            : undefined
                        }
                      >
                        <AccordionItem
                          value="components"
                          className="border-none"
                        >
                          <AccordionTrigger className="text-site-foreground/70 data-[state=open]:text-site-primary py-0 text-sm font-medium hover:no-underline">
                            {item.label}
                          </AccordionTrigger>
                          <AccordionContent className="pt-4 pb-0">
                            <div className="flex flex-col gap-3 pl-4">
                              <MobileLink
                                href={item.href}
                                onOpenChange={setOpen}
                                active={pathname === item.href}
                                className="flex items-center justify-between gap-3 text-sm font-normal"
                              >
                                <span>All Components</span>
                                <span className="text-site-muted-foreground text-xs">
                                  {totalComponentCount}
                                </span>
                              </MobileLink>
                              {componentCategoryLinks.length > 0 ? (
                                <div className="flex flex-col gap-2">
                                  {componentCategoryLinks.map((category) => {
                                    return (
                                      <MobileLink
                                        key={category.name}
                                        href={category.href}
                                        onOpenChange={setOpen}
                                        active={pathname === category.href}
                                        className="flex items-center justify-between gap-3 text-sm font-normal"
                                      >
                                        <span>{category.label}</span>
                                        <span className="flex shrink-0 items-center gap-2">
                                          <ComponentUpdateIndicator
                                            category={category.name}
                                          />
                                          <span className="text-site-muted-foreground text-xs">
                                            {category.count}
                                          </span>
                                        </span>
                                      </MobileLink>
                                    )
                                  })}
                                </div>
                              ) : null}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    ) : isDocs ? (
                      <Accordion
                        type="single"
                        collapsible
                        className="w-full"
                        defaultValue={
                          isActive(pathname, "/docs") ? "docs" : undefined
                        }
                      >
                        <AccordionItem value="docs" className="border-none">
                          <AccordionTrigger className="text-site-foreground/70 data-[state=open]:text-site-primary py-0 text-sm font-medium hover:no-underline">
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

                                  const pages = getPagesFromFolder(
                                    item,
                                    currentBase
                                  ).filter((page) => {
                                    if (
                                      !showMcpDocs &&
                                      page.url?.includes("/mcp")
                                    ) {
                                      return false
                                    }

                                    return true
                                  })

                                  if (pages.length === 0) {
                                    return null
                                  }

                                  return (
                                    <AccordionItem
                                      key={item.$id}
                                      value={item.$id ?? ""}
                                      className="border-none"
                                    >
                                      <AccordionTrigger className="text-site-foreground/70 py-2 text-sm font-medium hover:no-underline">
                                        {item.name}
                                      </AccordionTrigger>
                                      <AccordionContent className="pb-2">
                                        <div className="flex flex-col gap-2 pt-1 pl-4">
                                          {pages.map((page) => {
                                            const docsUpdateHint =
                                              getDocsPageUpdateHint(page.url)

                                            return (
                                              <MobileLink
                                                key={page.url}
                                                href={page.url}
                                                onOpenChange={setOpen}
                                                active={page.url === pathname}
                                                className="flex items-center justify-between gap-3 text-sm font-normal"
                                              >
                                                <span>{page.name}</span>
                                                {docsUpdateHint ? (
                                                  <span className="inline-flex shrink-0 cursor-help items-center">
                                                    <span className="sr-only">
                                                      {docsUpdateHint}
                                                    </span>
                                                    <span
                                                      aria-hidden="true"
                                                      className="site-rounded-full flex size-1.5 bg-blue-500"
                                                      title={docsUpdateHint}
                                                    />
                                                  </span>
                                                ) : null}
                                              </MobileLink>
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
                      <span className="text-site-foreground/40 flex items-center gap-2 text-sm font-medium">
                        {item.label}
                        <span className="bg-site-muted text-site-muted-foreground site-rounded-sm px-1.5 py-0.5 text-[10px] leading-none font-medium">
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
        "hover:text-site-primary text-sm font-medium transition-colors",
        active ? "text-site-primary" : "text-site-foreground/70",
        className
      )}
      {...props}
    >
      {children}
    </Link>
  )
}
