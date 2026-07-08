"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"

/**
 * Sticky chrome: announcement bar (when present) + main header pinned
 * to the top of the viewport. The announcement no longer hides on
 * scroll — keeping it visible avoids any layout shift mid-scroll that
 * caused the sticky header to flicker.
 *
 * We still publish `--announcement-height` so pages that need to know
 * the chrome's actual sticky offset (e.g. scroll-snap anchors, dialogs
 * positioned below the chrome) can read it from CSS.
 */
export function StickySiteChrome({
  announcement,
  header,
}: {
  announcement: React.ReactNode
  header: React.ReactNode
}) {
  const announcementRef = useRef<HTMLDivElement>(null)
  const [announcementHeight, setAnnouncementHeight] = useState(0)

  useEffect(() => {
    // The wrapper is always mounted so the server tree structure stays stable
    // for PPR resume; its measured height is 0 whenever the announcement bar
    // renders nothing (disabled or dismissed), matching the disabled state.
    const node = announcementRef.current
    if (!node) return

    const update = () => setAnnouncementHeight(node.scrollHeight)
    update()

    const observer = new ResizeObserver(update)
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    document.body.style.setProperty(
      "--announcement-height",
      `${announcementHeight}px`
    )
    return () => {
      document.body.style.setProperty("--announcement-height", "0px")
    }
  }, [announcementHeight])

  return (
    <div className="sticky top-0 z-50 flex flex-col">
      <div ref={announcementRef}>{announcement}</div>
      {header}
    </div>
  )
}
