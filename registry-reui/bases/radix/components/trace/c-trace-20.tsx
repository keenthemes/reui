"use client"

import * as React from "react"

import { Button } from "@/registry/bases/radix/ui/button"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceDescription,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/registry/bases/radix/ui/trace"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// Asking for a new document turns the failure into a pending step, since the
// case stays open until the applicant replies.
export default function Pattern() {
  const [screened, setScreened] = React.useState(false)
  const [requested, setRequested] = React.useState(false)
  const addressTrigger = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    const timer = window.setTimeout(() => setScreened(true), 2400)
    return () => window.clearTimeout(timer)
  }, [])

  function requestDocument() {
    setRequested(true)
    // The button sits in the panel it replaces, so focus goes back to the row.
    addressTrigger.current?.focus()
  }

  return (
    <div className="flex w-full max-w-md flex-col gap-4 text-sm">
      <Trace>
        <TraceLine>
          <TraceIcon>
            <IconPlaceholder
              lucide="BadgeCheckIcon"
              tabler="IconRosetteDiscountCheck"
              hugeicons="CheckmarkBadge01Icon"
              phosphor="SealCheckIcon"
              remixicon="RiVerifiedBadgeLine"
            />
          </TraceIcon>
          <TraceTitle>Verified the passport</TraceTitle>
          <TraceDescription>chip and MRZ match</TraceDescription>
        </TraceLine>
        <TraceLine>
          <TraceIcon>
            <IconPlaceholder
              lucide="UserCheckIcon"
              tabler="IconUserCheck"
              hugeicons="UserCheck01Icon"
              phosphor="UserCheckIcon"
              remixicon="RiUserFollowLine"
            />
          </TraceIcon>
          <TraceTitle>Matched the selfie to the photo</TraceTitle>
          <TraceDescription>97% similar</TraceDescription>
        </TraceLine>
        <TraceLine status={screened ? undefined : "running"}>
          <TraceIcon>
            <IconPlaceholder
              lucide="ShieldCheckIcon"
              tabler="IconShieldCheck"
              hugeicons="Shield01Icon"
              phosphor="ShieldCheckIcon"
              remixicon="RiShieldCheckLine"
            />
          </TraceIcon>
          <TraceTitle>
            {screened
              ? "Screened sanctions and PEP lists"
              : "Screening sanctions and PEP lists"}
          </TraceTitle>
          {screened ? <TraceDescription>no matches</TraceDescription> : null}
        </TraceLine>
        <TraceCollapsible defaultOpen>
          <TraceCollapsibleTrigger ref={addressTrigger}>
            <TraceLine status={requested ? "pending" : "error"}>
              <TraceIcon>
                <IconPlaceholder
                  lucide="MapPinIcon"
                  tabler="IconMapPin"
                  hugeicons="Location06Icon"
                  phosphor="MapPinIcon"
                  remixicon="RiMapPinLine"
                />
              </TraceIcon>
              <TraceTitle>
                {requested
                  ? "Waiting for a new proof of address"
                  : "Rejected the proof of address"}
              </TraceTitle>
              <TraceDescription>
                {requested ? "requested just now" : "too old"}
              </TraceDescription>
            </TraceLine>
          </TraceCollapsibleTrigger>
          <TraceCollapsibleContent>
            <div className="flex flex-col items-start gap-3">
              {requested ? (
                <p className="text-pretty">
                  Jordan was emailed a link to upload a recent one.
                </p>
              ) : (
                <>
                  <p className="text-pretty">
                    The utility bill is from June 2, and policy needs one from
                    the last 90 days.
                  </p>
                  <Button size="xs" variant="outline" onClick={requestDocument}>
                    Request a new document
                  </Button>
                </>
              )}
            </div>
          </TraceCollapsibleContent>
        </TraceCollapsible>
      </Trace>
      {/* Rows change in place, so the two changes a reviewer waits for are
            also announced. */}
      <p role="status" className="sr-only">
        {requested
          ? "New proof of address requested"
          : screened
            ? "Screening finished, no matches"
            : ""}
      </p>
    </div>
  )
}
