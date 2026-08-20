"use client"

import * as React from "react"

interface UseIframeWatchdogOptions {
  /**
   * True once the iframe has signalled it loaded - either the embedded page
   * posted `iframe-ready` or the iframe element fired `onLoad`. While false the
   * watchdog is armed.
   */
  ready: boolean
  /**
   * Logical identity of the preview being shown (e.g. the block name or the
   * iframe src). Changing it - a user switching block / category - resets the
   * retry budget and the timed-out state, starting a fresh watchdog cycle.
   * It must NOT include `retryNonce`, or each retry would reset the budget and
   * loop forever.
   */
  loadId: string
  /** Per-attempt grace period before the watchdog reloads / gives up. */
  timeoutMs?: number
  /** How many automatic reloads to try before surfacing the failure. */
  maxRetries?: number
}

interface UseIframeWatchdogResult {
  /**
   * Bumped on each automatic retry. Fold it into the iframe `key` (or a
   * cache-bust query) so the element remounts and re-attempts the load. The
   * caller must reset `ready` to false when it changes so the watchdog keeps
   * timing the new attempt.
   */
  retryNonce: number
  /**
   * True once every automatic retry has elapsed without `ready`. The caller
   * should reveal the iframe anyway (the load signal is often just lost, not
   * the content) and show a manual Reload affordance.
   */
  timedOut: boolean
  /** Manual reload, e.g. behind a "Reload" button shown on `timedOut`. */
  retry: () => void
}

/**
 * Availability backstop for iframe-backed preview panels.
 *
 * A preview hides its loading spinner when the embedded page posts
 * `iframe-ready` OR the iframe's `onLoad` fires. If the preview route stalls
 * (dev compile, a 5xx, a dropped connection) neither fires and the spinner
 * spins forever. This watchdog waits `timeoutMs` for `ready`; if it doesn't
 * arrive it reloads the iframe (via `retryNonce`, up to `maxRetries`), and
 * after the final attempt reports `timedOut` so the caller can reveal the frame
 * and offer a manual Reload - so a preview always resolves to *something* and is
 * never stuck spinning.
 *
 * Purely timer-based: no scroll / resize listeners.
 */
export function useIframeWatchdog({
  ready,
  loadId,
  timeoutMs = 8000,
  maxRetries = 2,
}: UseIframeWatchdogOptions): UseIframeWatchdogResult {
  const [retryNonce, setRetryNonce] = React.useState(0)
  const [timedOut, setTimedOut] = React.useState(false)

  // New logical preview -> start over (clear the retry budget + failure state).
  React.useEffect(() => {
    setRetryNonce(0)
    setTimedOut(false)
  }, [loadId])

  // Arm a timer for the current attempt. `retryNonce` is a dep, so each retry
  // (which the caller turns into an iframe remount) starts a fresh timer; once
  // `ready` flips true the effect bails and the cleanup clears the pending timer.
  React.useEffect(() => {
    if (ready || timedOut) return
    const timer = window.setTimeout(() => {
      if (retryNonce < maxRetries) {
        setRetryNonce((n) => n + 1)
      } else {
        setTimedOut(true)
      }
    }, timeoutMs)
    return () => window.clearTimeout(timer)
  }, [ready, timedOut, loadId, retryNonce, timeoutMs, maxRetries])

  const retry = React.useCallback(() => {
    setTimedOut(false)
    setRetryNonce((n) => n + 1)
  }, [])

  return { retryNonce, timedOut, retry }
}
