/**
 * Edge-safe license key validation (no Node.js crypto dependency).
 * Use this in proxy/middleware. For key generation, use "./license-key".
 */

export const LICENSE_KEY_REGEX =
  /^REUI-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/

export function isValidLicenseKeyFormat(key: string): boolean {
  return LICENSE_KEY_REGEX.test(key)
}
