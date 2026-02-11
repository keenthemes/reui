"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { trackEvent } from "@/lib/events"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { RecaptchaPopover } from "./recaptcha-popover"

export function SiteSubscribe() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [showRecaptcha, setShowRecaptcha] = useState(false)

  const validateEmail = () => {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.custom(
        () => (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>
              Invalid email address. Please check and try again.
            </AlertTitle>
          </Alert>
        ),
        {
          position: "top-center",
        }
      )
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateEmail()) {
      setShowRecaptcha(false)
      return
    }

    setShowRecaptcha(true)
  }

  const handleVerifiedSubmit = async (token: string) => {
    if (!token) {
      toast.custom(
        () => (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Please complete the reCAPTCHA verification.</AlertTitle>
          </Alert>
        ),
        {
          position: "top-center",
        }
      )
      return
    }

    setLoading(true)

    try {
      trackEvent({
        name: "site_newsletter_subscribe_submit",
        properties: {
          category: "conversion",
          label: "Newsletter Subscribe Submit",
          email,
        },
      })

      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-recaptcha-token": token,
        },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.custom(
          () => (
            <Alert>
              <CheckCircle2 className="size-4 text-green-500" />
              <AlertTitle>
                Thank you for your subscription. Expect amazing stuff soon!
              </AlertTitle>
            </Alert>
          ),
          {
            position: "top-center",
          }
        )
        trackEvent({
          name: "site_newsletter_subscribe_success",
          properties: {
            category: "conversion",
            label: "Newsletter Subscribe Success",
            email,
          },
        })
        setEmail("")
        setShowRecaptcha(false)
      } else {
        toast.custom(
          () => (
            <Alert variant="destructive">
              <AlertCircle className="size-4" />
              <AlertTitle>
                {data.message ||
                  "Oops! Something unexpected happened. Please try again later."}
              </AlertTitle>
            </Alert>
          ),
          {
            position: "top-center",
          }
        )
      }
    } catch (err: unknown) {
      console.error("Newsletter subscription error:", err)
      toast.custom(
        () => (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>
              Oops! Something unexpected happened. Please try again later.
            </AlertTitle>
          </Alert>
        ),
        {
          position: "top-center",
        }
      )
    } finally {
      setLoading(false)
    }
  }

  const style = {
    backgroundImage: `linear-gradient(0deg, transparent 0%, transparent 60%, rgba(183, 183, 183, 0.05) 60%, rgba(183, 183, 183, 0.05) 93%, transparent 93%, transparent 100%),
                      linear-gradient(135deg, transparent 0%, transparent 55%, rgba(183, 183, 183, 0.05) 55%, rgba(183, 183, 183, 0.05) 84%, transparent 84%, transparent 100%),
                      linear-gradient(0deg, transparent 0%, transparent 80%, rgba(183, 183, 183, 0.05) 80%, rgba(183, 183, 183, 0.05) 94%, transparent 94%, transparent 100%),
                      linear-gradient(90deg, rgb(0,0,0), rgb(0,0,0))`,
  }

  return (
    <footer className="pb-6">
      <div className="container">
        <div
          className="flex flex-wrap items-center justify-between gap-7 rounded-xl px-10 py-10 md:px-20 md:py-16"
          style={style}
        >
          <div className="flex flex-col gap-1.5">
            <h2 className="text-3xl font-medium text-white">
              Stay notified on every new release
            </h2>
            <div className="text-2xl font-medium text-white/50">
              Only the updates worth knowing
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex w-full flex-col items-stretch gap-2.5 md:w-auto md:flex-row md:items-center"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setShowRecaptcha(false)
              }}
              placeholder="Your email address"
              className="border-input/20 h-auto w-full rounded-lg border bg-white/5 px-5 py-3 text-white/80 placeholder:text-white/50 focus:ring focus:outline-none md:w-64"
              required
            />

            <RecaptchaPopover
              open={showRecaptcha}
              onOpenChange={(open: boolean) => {
                if (!open) {
                  setShowRecaptcha(false)
                }
              }}
              onVerify={handleVerifiedSubmit}
              verifyButtonText="Verify & Subscribe"
              isLoading={loading}
              trigger={
                <Button
                  type="submit"
                  className="h-auto w-full rounded-lg bg-white px-5 py-3 font-semibold text-black/80 hover:bg-white hover:text-black md:w-auto"
                  disabled={loading}
                >
                  {loading ? "Subscribing..." : "Subscribe"}
                </Button>
              }
            />
          </form>
        </div>
      </div>
    </footer>
  )
}
