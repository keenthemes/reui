import { FONT_DEFINITIONS, type FontName } from "@/lib/font-definitions"

export const CREATE_PREVIEW_FONTS_ATTR = "data-create-preview-fonts"

type PreviewFont = {
  style: {
    fontFamily: string
  }
}

const BUILT_IN_PREVIEW_FONTS = new Set<FontName>(["inter"])

const loadedPreviewFonts = new Set<string>()

const LOCAL_PREVIEW_FONT_VARIABLES: Partial<Record<FontName, string>> = {
  inter: "--font-inter",
  geist: "--font-geist-sans",
  "geist-mono": "--font-geist-mono",
}

const LOCAL_PREVIEW_FONT_FAMILIES: Partial<Record<FontName, string>> = {
  inter: "var(--font-inter, 'Inter Variable'), sans-serif",
  geist: "var(--font-geist-sans, 'Geist Variable'), sans-serif",
  "geist-mono": "var(--font-geist-mono, 'Geist Mono'), monospace",
}

function hasLocalPreviewFont(fontName: FontName) {
  if (typeof document === "undefined") {
    return false
  }

  const variableName = LOCAL_PREVIEW_FONT_VARIABLES[fontName]

  if (!variableName) {
    return false
  }

  const host = document.querySelector<HTMLElement>(
    `[${CREATE_PREVIEW_FONTS_ATTR}]`
  )

  if (!host) {
    return false
  }

  return Boolean(getComputedStyle(host).getPropertyValue(variableName).trim())
}

function createPreviewFont(definition: (typeof FONT_DEFINITIONS)[number]) {
  return {
    style: {
      fontFamily:
        LOCAL_PREVIEW_FONT_FAMILIES[definition.name] ?? definition.family,
    },
  } satisfies PreviewFont
}

const PREVIEW_FONTS = Object.fromEntries(
  FONT_DEFINITIONS.map((definition) => [
    definition.name,
    createPreviewFont(definition),
  ])
) as Record<FontName, PreviewFont>

function createFontOption(name: FontName) {
  const definition = FONT_DEFINITIONS.find((font) => font.name === name)

  if (!definition) {
    throw new Error(`Unknown font definition: ${name}`)
  }

  return {
    name: definition.title,
    value: definition.name,
    font: PREVIEW_FONTS[name],
    type: definition.type,
  } as const
}

function getGooglePreviewFontUrl(name: FontName) {
  const definition = FONT_DEFINITIONS.find((font) => font.name === name)

  if (!definition) {
    return null
  }

  const family = encodeURIComponent(definition.title).replace(/%20/g, "+")

  return `https://fonts.googleapis.com/css2?family=${family}&display=swap`
}

export function ensurePreviewFontsLoaded(
  fontNames: Iterable<FontName | "inherit" | null | undefined>
) {
  if (typeof document === "undefined") {
    return
  }

  for (const fontName of fontNames) {
    if (
      !fontName ||
      fontName === "inherit" ||
      BUILT_IN_PREVIEW_FONTS.has(fontName) ||
      hasLocalPreviewFont(fontName)
    ) {
      continue
    }

    const href = getGooglePreviewFontUrl(fontName)

    if (!href || loadedPreviewFonts.has(href)) {
      continue
    }

    const existing = document.head.querySelector<HTMLLinkElement>(
      `link[data-preview-font="${fontName}"]`
    )

    if (existing) {
      loadedPreviewFonts.add(existing.href || href)
      continue
    }

    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = href
    link.dataset.previewFont = fontName
    document.head.appendChild(link)

    loadedPreviewFonts.add(href)
  }
}

export const FONTS = FONT_DEFINITIONS.map((definition) =>
  createFontOption(definition.name)
)

export type Font = (typeof FONTS)[number]

export const FONT_HEADING_OPTIONS = [
  {
    name: "Inherit",
    value: "inherit",
    font: null,
    type: "default",
  },
  ...FONTS,
] as const

export type FontHeadingOption = (typeof FONT_HEADING_OPTIONS)[number]
