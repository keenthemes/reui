"use client"

import React from "react"
import { Info } from "lucide-react"
import { toast } from "sonner"

import { useRecaptchaV2 } from "@/hooks/use-recaptcha-v2"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface RecaptchaPopoverProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify: (token: string) => void
  trigger: React.ReactNode
  verifyButtonText?: string
  isLoading?: boolean
}

export function RecaptchaPopover({
  open,
  onOpenChange,
  onVerify,
  trigger,
  verifyButtonText = "Verify & Submit",
  isLoading = false,
}: RecaptchaPopoverProps) {
  const { containerRef, getToken, resetCaptcha } = useRecaptchaV2(
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""
  )

  const handleOpenChange = (newOpen: boolean) => {
    if (isLoading) return // Prevent closing while loading
    onOpenChange(newOpen)
    if (!newOpen) {
      resetCaptcha()
    }
  }

  const handleVerify = () => {
    if (isLoading) return
    try {
      const token = getToken()
      if (!token) {
        toast.custom(
          () => (
            <Alert variant="destructive">
              <Info className="size-4" />
              <AlertTitle>
                Please complete the reCAPTCHA verification.
              </AlertTitle>
            </Alert>
          ),
          {
            position: "top-center",
          }
        )
        return
      }
      onVerify(token)
    } catch (error) {
      console.error("Error getting reCAPTCHA token:", error)
      toast.custom(
        () => (
          <Alert variant="destructive">
            <Info className="size-4" />
            <AlertTitle>Please complete the reCAPTCHA verification.</AlertTitle>
          </Alert>
        ),
        {
          position: "top-center",
        }
      )
      return
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className="w-auto p-4"
        align="end"
        sideOffset={8}
        onInteractOutside={(e) => {
          if (isLoading) {
            e.preventDefault()
            return
          }
          // Prevent closing when interacting with reCAPTCHA iframe (challenges)
          const target = e.target as HTMLElement
          if (target.closest('iframe[src*="google.com/recaptcha"]')) {
            e.preventDefault()
          }
        }}
      >
        <div className="flex flex-col gap-4">
          <div ref={containerRef} className="min-h-[78px] min-w-[302px]" />
          <Button
            type="button"
            variant="default"
            onClick={handleVerify}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Subscribing..." : verifyButtonText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
