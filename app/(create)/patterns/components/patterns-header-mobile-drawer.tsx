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

import { PatternsSidebarContent } from "./patterns-sidebar-content"

export function PatternsHeaderMobileDrawer() {
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
            className="text-muted-foreground hover:text-foreground -ml-2 hover:bg-transparent"
          >
            <Filter />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="h-full">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Filters</DrawerTitle>
            <DrawerDescription>Filter patterns by category.</DrawerDescription>
          </DrawerHeader>
          <div className="h-full py-4">
            <PatternsSidebarContent
              onSelect={() => setIsDrawerOpen(false)}
              view="list"
            />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
