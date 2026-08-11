"use client"

import * as React from "react"

import { LocaleField } from "@/registry-reui/bases/radix/reui/locale-field"

export default function Pattern() {
  const [value, setValue] = React.useState({
    en: { first: "Sam", last: "Evans" },
    ru: { first: "Сэм", last: "" },
    sk: { first: "", last: "" },
  })

  return (
    <div className="mx-auto w-full max-w-md p-4">
      <LocaleField
        variant="namePair"
        locales={["en", "ru", "sk"]}
        masterLocale="en"
        value={value}
        onChange={setValue}
      />
    </div>
  )
}
