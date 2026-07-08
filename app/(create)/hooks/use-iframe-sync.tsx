"use client"

import * as React from "react"

import type { DesignSystemSearchParams } from "@/app/(create)/lib/search-params"

// Message types for parent to iframe communication
type DesignSystemParamsMessage = {
  type: "design-system-params"
  data: DesignSystemSearchParams
}

type GridColumnsMessage = {
  type: "grid-columns"
  data: { columns: 1 | 2 }
}

type NavigationMessage = {
  type: "navigation"
  data: {
    category: string | null
    searchQuery: string | null
    params: DesignSystemSearchParams
  }
}

type ParentToIframeMessage =
  | DesignSystemParamsMessage
  | GridColumnsMessage
  | NavigationMessage

export const isInIframe = () => {
  if (typeof window === "undefined") {
    return false
  }
  return window.self !== window.top
}

/**
 * True ONLY when this page is embedded in a SAME-ORIGIN parent - i.e. one of
 * reui's own preview iframes, not an arbitrary cross-origin embedder (e.g.
 * shoogle.dev). Reading the parent's origin throws a SecurityError for a
 * cross-origin ancestor, which we treat as "not a same-origin embed".
 *
 * Use this (not `isInIframe`) to gate behavior that must affect ONLY reui's own
 * previews - notably the document scroll lock. `isInIframe` (`self !== top`) is
 * true for ANY embed, so gating a scroll lock on it left external embedders'
 * pages completely unscrollable.
 */
export const isSameOriginEmbed = () => {
  if (typeof window === "undefined") {
    return false
  }
  if (window.self === window.top) {
    return false
  }
  try {
    return window.parent.location.origin === window.location.origin
  } catch {
    return false
  }
}

function getIframeTargetOrigin(iframe: HTMLIFrameElement | null) {
  if (!iframe?.src) {
    return window.location.origin
  }

  try {
    return new URL(iframe.src, window.location.href).origin
  } catch {
    return window.location.origin
  }
}

export function useIframeMessageListener<
  Message extends ParentToIframeMessage,
  MessageType extends Message["type"],
>(
  messageType: MessageType,
  onMessage: (data: Extract<Message, { type: MessageType }>["data"]) => void
) {
  React.useEffect(() => {
    if (!isInIframe()) {
      return
    }

    const handleMessage = (event: MessageEvent) => {
      // Validate origin to prevent cross-origin message injection
      if (event.origin !== window.location.origin) return

      if (event.data.type === messageType) {
        onMessage(event.data.data)
      }
    }

    window.addEventListener("message", handleMessage)
    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [messageType, onMessage])
}

export function sendToIframe<
  Message extends ParentToIframeMessage,
  MessageType extends Message["type"],
>(
  iframe: HTMLIFrameElement | null,
  messageType: MessageType,
  data: Extract<Message, { type: MessageType }>["data"],
  targetOrigin = getIframeTargetOrigin(iframe)
) {
  if (!iframe?.contentWindow) {
    return
  }

  iframe.contentWindow.postMessage(
    {
      type: messageType,
      data,
    },
    targetOrigin
  )
}
