"use client"

import * as React from "react"

/**
 * The "Free" word in the components heading with a single underline stroke
 * that draws itself in when the word scrolls into view. The stroke uses the
 * premium nav-tile color tone (pink -> violet -> blue), and a larger bottom
 * offset leaves a clear gap between the word and the line.
 *
 * The line starts fully drawn so SSR / no-JS / reduced-motion users always see
 * it; the effect resets it and replays the single draw once, the first time the
 * word enters the viewport. The reset happens off-screen (the section sits
 * below the fold), so there is no visible flash.
 */
export function FreeUnderline() {
  const hostRef = React.useRef<HTMLSpanElement>(null)
  const [drawn, setDrawn] = React.useState(true)

  React.useEffect(() => {
    const host = hostRef.current
    if (!host) return

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    // Reset to the undrawn state, then draw once the word scrolls into view.
    setDrawn(false)
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setDrawn(true)
            observer.disconnect()
            break
          }
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(host)

    return () => observer.disconnect()
  }, [])

  return (
    <span ref={hostRef} className="relative inline-block">
      Free
      <svg
        aria-hidden="true"
        viewBox="0 0 120 18"
        fill="none"
        preserveAspectRatio="none"
        className="pointer-events-none absolute -bottom-[0.32em] left-0 h-[0.42em] w-full"
      >
        <defs>
          <linearGradient
            id="free-underline-gradient"
            x1="0"
            y1="0"
            x2="1"
            y2="0"
          >
            <stop offset="0%" stopColor="oklch(0.72 0.16 330)" />
            <stop offset="50%" stopColor="oklch(0.7 0.15 292)" />
            <stop offset="100%" stopColor="oklch(0.72 0.16 262)" />
          </linearGradient>
        </defs>
        <path
          pathLength={1}
          d="M3 12C23 6 47 6 66 9c18 2.7 36 3 51-3"
          stroke="url(#free-underline-gradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
          style={{
            strokeDasharray: 1,
            strokeDashoffset: drawn ? 0 : 1,
            transition:
              "stroke-dashoffset 1100ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        />
      </svg>
    </span>
  )
}
