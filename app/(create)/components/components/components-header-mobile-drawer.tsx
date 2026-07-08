"use client"

import * as React from "react"
import { Filter } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

import { ComponentsSidebarContent } from "./components-sidebar-content"

export function ComponentsHeaderMobileDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-2 min-[992px]:hidden">
      <Drawer
        open={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        direction="left"
      >
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-site-muted-foreground hover:text-site-foreground -ml-2 hover:bg-transparent"
          >
            <Filter />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>
              Filter components by category.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex h-full min-h-0 flex-col py-4">
            <ComponentsSidebarContent
              onSelect={() => setIsDrawerOpen(false)}
              view="list"
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
