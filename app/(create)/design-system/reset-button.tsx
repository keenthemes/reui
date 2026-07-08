"use client"

import * as React from "react"

import { notifyIconLibraryChanged } from "@/lib/icon-library-store"
import { DEFAULT_CONFIG, useConfig } from "@/hooks/use-config"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDesignSystemSearchParams } from "@/app/(create)/lib/search-params"

export function ResetButton() {
  const [params, setParams] = useDesignSystemSearchParams()
  const [config, setConfig] = useConfig()
  const handleReset = React.useCallback(() => {
    // Update URL params - set to null to clear them from URL
    setParams({
      base: null,
      style: null,
      baseColor: null,
      theme: null,
      chartColor: null,
      iconLibrary: null,
      font: null,
      fontHeading: null,
      menuAccent: null,
      menuColor: null,
      radius: null,
      template: null,
      item: null,
      search: null, // Also clear search
    })

    // Also update config storage directly for immediate persistence
    setConfig((prev) => ({
      ...prev,
      ...DEFAULT_CONFIG,
    }))
    notifyIconLibraryChanged()
  }, [setParams, setConfig])

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-site-border bg-site-background text-site-foreground hover:bg-site-muted/60 site-rounded-md w-full justify-center gap-2"
            >
              <span className="text-sm">Reset</span>
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">
          Reset all customization options to their defaults
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent className="dialog-ring p-4 sm:max-w-sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Reset to defaults?</AlertDialogTitle>
          <AlertDialogDescription>
            This will reset all customization options to their default values.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="site-rounded-lg">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction className="site-rounded-lg" onClick={handleReset}>
            Reset
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
