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

import { ComponentSidebarContent } from "./component-sidebar-content"

export function ComponentHeaderMobileDrawer() {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false)

  return (
    <div className="flex items-center gap-2 lg:hidden">
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
          <div className="h-full py-4">
            <ComponentSidebarContent
              onSelect={() => setIsDrawerOpen(false)}
              view="list"
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
