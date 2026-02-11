import { createFromSource } from "fumadocs-core/search/server"

import { source } from "@/lib/source"

export const revalidate = false // Static - only changes on deploy

export const { GET } = createFromSource(source, {
  // https://docs.orama.com/docs/orama-js/supported-languages
  language: "english",
})
