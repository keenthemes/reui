// Description: Toggle with text label that changes
// Order: 10

"use client"

import { useState } from "react"

import { Toggle } from "@/registry/bases/base/ui/toggle"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [pressed, setPressed] = useState(false)

  return (
    <div className="flex items-center justify-center">
      <Toggle
        variant="outline"
        aria-label="Toggle bookmark"
        pressed={pressed}
        onPressedChange={setPressed}
      >
        {pressed ? (
          <IconPlaceholder
            lucide="BookmarkCheckIcon"
            tabler="IconBookmark"
            hugeicons="BookmarkCheck02Icon"
            phosphor="BookmarkSimpleIcon"
            remixicon="RiBookmarkLine"
            className="fill-current"
          />
        ) : (
          <IconPlaceholder
            lucide="BookmarkIcon"
            tabler="IconBookmark"
            hugeicons="Bookmark02Icon"
            phosphor="BookmarkSimpleIcon"
            remixicon="RiBookmarkLine"
          />
        )}
        {pressed ? "Bookmarked" : "Bookmark"}
      </Toggle>
    </div>
  )
}
