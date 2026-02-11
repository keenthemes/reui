/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useRef } from "react"

type ReCaptchaInstance = {
  ready: (callback: () => void) => void
  render: (
    container: HTMLElement,
    config: { sitekey: string; size: string; theme: string }
  ) => number
  reset: (id: number) => void
  getResponse: (id: number) => string
}

const RECAPTCHA_SCRIPT_ID = "recaptcha-v2-script"
let scriptLoadPromise: Promise<void> | null = null

function loadRecaptchaScript(): Promise<void> {
  if (scriptLoadPromise) return scriptLoadPromise

  scriptLoadPromise = new Promise((resolve) => {
    // If script already exists and grecaptcha is loaded
    if (
      document.getElementById(RECAPTCHA_SCRIPT_ID) &&
      (window as any).grecaptcha
    ) {
      resolve()
      return
    }

    // Set up the callback for when the script loads
    ;(window as any).onRecaptchaLoaded = () => {
      resolve()
    }

    // Create and append the script
    const script = document.createElement("script")
    script.id = RECAPTCHA_SCRIPT_ID
    script.src = `https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoaded&render=explicit`
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  })

  return scriptLoadPromise
}

export function useRecaptchaV2(siteKey: string) {
  const widgetId = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const isRendered = useRef(false)
  const isInitializing = useRef(false)

  const resetCaptcha = useCallback(() => {
    const grecaptcha = (window as any).grecaptcha as ReCaptchaInstance
    if (!grecaptcha || widgetId.current === null) return

    try {
      grecaptcha.reset(widgetId.current)
      widgetId.current = null
      isRendered.current = false
    } catch (error) {
      console.error("Error resetting reCAPTCHA:", error)
    }
  }, [])

  const initializeRecaptcha = useCallback(async () => {
    // Prevent multiple simultaneous initialization attempts
    if (isInitializing.current) return
    if (!containerRef.current || !siteKey) return
    if (isRendered.current) return

    isInitializing.current = true

    try {
      // Load the script and wait for it to be ready
      await loadRecaptchaScript()

      // Additional check to ensure grecaptcha is available
      const grecaptcha = (window as any).grecaptcha as ReCaptchaInstance
      if (!grecaptcha) {
        throw new Error("reCAPTCHA failed to load")
      }

      // Wait for grecaptcha to be fully ready
      await new Promise<void>((resolve) => {
        grecaptcha.ready(() => resolve())
      })

      // Render the widget
      if (containerRef.current && !isRendered.current) {
        widgetId.current = grecaptcha.render(containerRef.current, {
          sitekey: siteKey,
          size: "normal",
          theme: "light",
        })
        isRendered.current = true
      }
    } catch (error) {
      console.error("Error initializing reCAPTCHA:", error)
    } finally {
      isInitializing.current = false
    }
  }, [siteKey])

  // Use callback ref to handle dynamic mounting (like in a Popover)
  const setContainerRef = useCallback(
    (node: HTMLDivElement | null) => {
      containerRef.current = node
      if (node) {
        // Use a small timeout to ensure the DOM is ready and stable
        setTimeout(() => {
          initializeRecaptcha()
        }, 0)
      } else {
        resetCaptcha()
      }
    },
    [initializeRecaptcha, resetCaptcha]
  )

  useEffect(() => {
    return () => {
      resetCaptcha()
    }
  }, [resetCaptcha])

  const getToken = (): string => {
    const grecaptcha = (window as any).grecaptcha as ReCaptchaInstance
    if (!grecaptcha || widgetId.current === null) {
      throw new Error("reCAPTCHA not initialized")
    }
    return grecaptcha.getResponse(widgetId.current)
  }

  return {
    containerRef: setContainerRef,
    getToken,
    resetCaptcha,
    initializeRecaptcha,
  }
}
