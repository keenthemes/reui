"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

/** Scrolls the window to the top on every page navigation. */
export function ScrollToTop() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  return null
}
