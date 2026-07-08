import { randomBytes } from "crypto"

// Re-export Edge-safe validation from the regex module
export { LICENSE_KEY_REGEX, isValidLicenseKeyFormat } from "./license-key-regex"

/**
 * Generates a unique license key in the format: REUI-XXXX-XXXX-XXXX-XXXX
 * Node.js only (uses crypto.randomBytes).
 */
export function generateLicenseKey(): string {
  const segments = 4
  const segmentLength = 4
  const parts: string[] = ["REUI"]

  for (let i = 0; i < segments; i++) {
    const bytes = randomBytes(segmentLength)
    parts.push(
      bytes.toString("hex").toUpperCase().slice(0, segmentLength)
    )
  }

  return parts.join("-")
}
