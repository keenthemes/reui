import { Inter } from "next/font/google"

const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const fontVariables = fontInter.variable
