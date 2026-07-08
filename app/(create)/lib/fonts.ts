import {
  DM_Sans,
  Figtree,
  Geist,
  Geist_Mono,
  IBM_Plex_Sans,
  Instrument_Sans,
  Inter,
  JetBrains_Mono,
  Lora,
  Manrope,
  Merriweather,
  Montserrat,
  Noto_Sans,
  Noto_Serif,
  Nunito_Sans,
  Outfit,
  Oxanium,
  Playfair_Display,
  Public_Sans,
  Raleway,
  Roboto,
  Roboto_Slab,
  Source_Sans_3,
  Space_Grotesk,
} from "next/font/google"

import { FONT_DEFINITIONS, type FontName } from "@/lib/font-definitions"
import { cn } from "@/lib/utils"

type PreviewFont = ReturnType<typeof Inter>

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  preload: false,
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  preload: false,
})

const notoSans = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-noto-sans",
  preload: false,
})

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  preload: false,
})

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  preload: false,
})

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  preload: false,
})

const raleway = Raleway({
  subsets: ["latin"],
  variable: "--font-raleway",
  preload: false,
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  preload: false,
})

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  preload: false,
})

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  preload: false,
})

const oxanium = Oxanium({
  subsets: ["latin"],
  variable: "--font-oxanium",
  preload: false,
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  preload: false,
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  preload: false,
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  preload: false,
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
  preload: false,
})

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans-3",
  preload: false,
})

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument-sans",
  preload: false,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  preload: false,
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  preload: false,
})

const notoSerif = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-noto-serif",
  preload: false,
})

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  variable: "--font-roboto-slab",
  preload: false,
})

const merriweather = Merriweather({
  subsets: ["latin"],
  variable: "--font-merriweather",
  preload: false,
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  preload: false,
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair-display",
  preload: false,
})

const PREVIEW_FONTS = {
  geist: geistSans,
  inter,
  "noto-sans": notoSans,
  "nunito-sans": nunitoSans,
  figtree,
  roboto,
  raleway,
  "dm-sans": dmSans,
  "public-sans": publicSans,
  outfit,
  oxanium,
  manrope,
  "space-grotesk": spaceGrotesk,
  montserrat,
  "ibm-plex-sans": ibmPlexSans,
  "source-sans-3": sourceSans3,
  "instrument-sans": instrumentSans,
  "jetbrains-mono": jetbrainsMono,
  "geist-mono": geistMono,
  "noto-serif": notoSerif,
  "roboto-slab": robotoSlab,
  merriweather,
  lora,
  "playfair-display": playfairDisplay,
} satisfies Record<FontName, PreviewFont>

export const createFontVariables = cn(
  ...Array.from(
    new Set(Object.values(PREVIEW_FONTS).map((font) => font.variable))
  )
)

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

export const FONTS = [
  createFontOption("geist"),
  createFontOption("inter"),
  createFontOption("noto-sans"),
  createFontOption("nunito-sans"),
  createFontOption("figtree"),
  createFontOption("roboto"),
  createFontOption("raleway"),
  createFontOption("dm-sans"),
  createFontOption("public-sans"),
  createFontOption("outfit"),
  createFontOption("oxanium"),
  createFontOption("manrope"),
  createFontOption("space-grotesk"),
  createFontOption("montserrat"),
  createFontOption("ibm-plex-sans"),
  createFontOption("source-sans-3"),
  createFontOption("instrument-sans"),
  createFontOption("geist-mono"),
  createFontOption("jetbrains-mono"),
  createFontOption("noto-serif"),
  createFontOption("roboto-slab"),
  createFontOption("merriweather"),
  createFontOption("lora"),
  createFontOption("playfair-display"),
] as const

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
