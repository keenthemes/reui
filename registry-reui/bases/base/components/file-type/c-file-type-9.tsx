"use client"

import { useId, useRef, useState } from "react"
import {
  FileType,
  getFileType,
  getFileTypeCategory,
  type FileTypeVariant,
} from "@/registry-reui/bases/base/reui/file-type"

import { Button } from "@/registry/bases/base/ui/button"
import { Card, CardContent, CardFooter } from "@/registry/bases/base/ui/card"
import { Field, FieldLabel } from "@/registry/bases/base/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/registry/bases/base/ui/input-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

// One sample per kind of input getFileType reads: a file name, a path in
// another case, a MIME type, a folder, a well-known name and a URL with a
// query. The long URL goes last, so the wrap never strands a short chip on a
// row of its own.
const SAMPLES = [
  "Q3 report.pdf",
  "photos/IMG_2041.HEIC",
  "video/quicktime",
  "assets/",
  ".env.local",
  "https://example.com/data.csv?v=2",
]

const VARIANTS: { variant: FileTypeVariant; label: string }[] = [
  { variant: "outline", label: "Outline" },
  { variant: "solid", label: "Solid" },
  { variant: "light", label: "Light" },
  { variant: "mono", label: "Mono" },
]

// Only the two fallbacks need words: a value with nothing to resolve draws a
// blank page, and an unknown extension draws a neutral page with its label.
function describe(value: string, type: string) {
  if (!value.trim()) return "Nothing to resolve yet, so it shows a blank page."
  if (type === "empty") {
    return "No extension or known MIME type, so it shows a blank page."
  }
  if (getFileTypeCategory(type) === "file") {
    return "Unknown extension, so it shows a neutral page with its label."
  }
  return null
}

export default function Pattern() {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  // Opens on a sample so the card shows a resolved type; Clear reaches the
  // blank state.
  const [value, setValue] = useState("Q3 report.pdf")

  // getFileType is a pure string parse, so the icons, the readout and the
  // hint all derive from the raw value on each render, with no effect.
  const type = getFileType(value)
  const family = getFileTypeCategory(type)
  const hint = describe(value, type)

  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Field>
          <FieldLabel htmlFor={`${id}-value`}>
            File name, path, URL or MIME type
          </FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              {/* The field already shows the name and the status below
                  announces the result, so this icon is decorative here. */}
              <FileType type={type} size="mini" aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput
              ref={inputRef}
              id={`${id}-value`}
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="invoice.docx or image/png"
              autoComplete="off"
              spellCheck={false}
            />
            {value ? (
              <InputGroupAddon align="inline-end">
                <InputGroupButton
                  size="icon-xs"
                  aria-label="Clear"
                  onClick={() => {
                    // The button unmounts once the field is empty, so focus
                    // goes back to the field instead of falling to the body.
                    setValue("")
                    inputRef.current?.focus()
                  }}
                >
                  <IconPlaceholder
                    lucide="XIcon"
                    tabler="IconX"
                    hugeicons="Cancel01Icon"
                    phosphor="XIcon"
                    remixicon="RiCloseLine"
                    aria-hidden="true"
                  />
                </InputGroupButton>
              </InputGroupAddon>
            ) : null}
          </InputGroup>
        </Field>
        <div
          role="group"
          aria-labelledby={`${id}-samples`}
          className="flex flex-wrap items-center gap-1.5"
        >
          <span
            id={`${id}-samples`}
            className="text-muted-foreground me-1 text-xs"
          >
            Try
          </span>
          {SAMPLES.map((sample) => (
            <Button
              key={sample}
              variant="outline"
              size="xs"
              className="max-w-full"
              onClick={() => setValue(sample)}
            >
              {/* The span, not the button, truncates: a long URL then ends
                  in an ellipsis on a narrow card instead of overflowing. */}
              <span className="truncate">{sample}</span>
            </Button>
          ))}
        </div>
      </div>
      <Card>
        <CardContent>
          <div className="grid grid-cols-4 justify-items-center gap-4">
            {VARIANTS.map(({ variant, label }) => (
              <div key={variant} className="flex flex-col items-center gap-2">
                <FileType type={type} variant={variant} size="lg" />
                <span className="text-muted-foreground text-xs">{label}</span>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          {/* A polite live region holding text only: the icons sit outside
              it, so each change is read once as "Type pdf, Family document". */}
          <div role="status" className="flex min-w-0 flex-1 flex-col gap-1">
            <dl className="flex min-w-0 flex-wrap gap-x-6 gap-y-1">
              <div className="flex min-w-0 gap-2">
                <dt className="text-muted-foreground">Type</dt>
                <dd className="truncate font-mono">{type}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-muted-foreground">Family</dt>
                <dd className="font-mono">{family}</dd>
              </div>
            </dl>
            {hint ? (
              <p className="text-muted-foreground text-xs">{hint}</p>
            ) : null}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
