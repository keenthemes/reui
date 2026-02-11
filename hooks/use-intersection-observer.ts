"use client"

import * as React from "react"

interface IntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean
}

/**
 * A shared intersection observer to manage multiple targets with a single observer instance.
 * Optimized for high-density lists (like the patterns grid).
 */
class SharedObserver {
  private observer: IntersectionObserver | null = null
  private callbacks = new Map<Element, (isIntersecting: boolean) => void>()
  private options: IntersectionObserverInit

  constructor(options: IntersectionObserverInit) {
    this.options = options
  }

  private getObserver() {
    if (!this.observer) {
      this.observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          const callback = this.callbacks.get(entry.target)
          if (callback) {
            callback(entry.isIntersecting)
          }
        })
      }, this.options)
    }
    return this.observer
  }

  observe(element: Element, callback: (isIntersecting: boolean) => void) {
    this.callbacks.set(element, callback)
    this.getObserver().observe(element)
  }

  unobserve(element: Element) {
    this.callbacks.delete(element)
    this.observer?.unobserve(element)
  }

  disconnect() {
    this.observer?.disconnect()
    this.callbacks.clear()
    this.observer = null
  }
}

// Singleton instances for common root margins to maximize reuse
const observers = new Map<string, SharedObserver>()

function getSharedObserver(options: IntersectionObserverInit) {
  const key = JSON.stringify(options)
  if (!observers.has(key)) {
    observers.set(key, new SharedObserver(options))
  }
  return observers.get(key)!
}

export function useIntersectionObserver(
  elementRef: React.RefObject<Element | null>,
  {
    threshold = 0,
    root = null,
    rootMargin = "0%",
    freezeOnceVisible = false,
  }: IntersectionObserverOptions = {}
): boolean {
  const [isIntersecting, setIntersecting] = React.useState(false)
  const frozen = React.useRef(false)

  React.useEffect(() => {
    const element = elementRef?.current
    if (!element || (freezeOnceVisible && frozen.current)) return

    const observer = getSharedObserver({ threshold, root, rootMargin })

    observer.observe(element, (intersecting) => {
      setIntersecting(intersecting)
      if (intersecting && freezeOnceVisible) {
        frozen.current = true
        observer.unobserve(element)
      }
    })

    return () => {
      observer.unobserve(element)
    }
  }, [elementRef, threshold, root, rootMargin, freezeOnceVisible])

  return isIntersecting
}
