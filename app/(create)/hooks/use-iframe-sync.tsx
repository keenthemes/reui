"use client"

import * as React from "react"

import type { DesignSystemSearchParams } from "@/app/(create)/lib/search-params"

type DesignSystemParamsMessage = {
  type: "design-system-params"
  data: DesignSystemSearchParams
}

type ParentToIframeMessage = DesignSystemParamsMessage

export const isInIframe = () => {
  if (typeof window === "undefined") {
    return false
  }
  return window.self !== window.top
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
      if (event.origin !== window.location.origin) {
        return
      }

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
