"use client"

import * as React from "react"

import { LocaleField } from "@/registry-reui/bases/radix/reui/locale-field"

export default function Pattern() {
  const [value, setValue] = React.useState<Record<string, string>>({
    en: "All About You",
    ru: "Все для Тебя",
    sk: "",
    uk: "",
  })

  return (
    <div className="mx-auto w-full max-w-md p-4">
      <LocaleField
        variant="single"
        locales={["ru", "en", "sk", "uk"]}
        masterLocale="en"
        value={value}
        onChange={setValue}
        label="Title"
      />
    </div>
  )
}
