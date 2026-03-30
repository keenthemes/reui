// Description: Theme toggle button with animated moon and sun icons
// Order: 61

"use client"

import { useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/registry/bases/base/ui/button"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function Pattern() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <IconPlaceholder
        lucide="SunIcon"
        tabler="IconSun"
        hugeicons="Sun01Icon"
        phosphor="SunIcon"
        remixicon="RiSunLine"
        className={cn(
          "size-4 transition-all duration-300",
          theme === "dark"
            ? "scale-0 -rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100"
        )}
      />
      <IconPlaceholder
        lucide="MoonIcon"
        tabler="IconMoon"
        hugeicons="Moon02Icon"
        phosphor="MoonIcon"
        remixicon="RiMoonLine"
        className={cn(
          "absolute size-4 transition-all duration-300",
          theme === "dark"
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 rotate-90 opacity-0"
        )}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
