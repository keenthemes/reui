import { normalizePlanTier } from "./pricing";

/**
 * Lowercases and reduces a value to a filesystem- and header-safe slug:
 * keeps `[a-z0-9]`, collapses every other run of characters to a single
 * dash, and trims leading/trailing dashes. Keeps download filenames clean
 * and prevents unexpected characters from leaking into the
 * `Content-Disposition` header.
 */
function slugifyFilenamePart(value: string | null | undefined): string {
  return (value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface LicenseCertificateFileInput {
  /** DB plan tier ("pro" | "ultimate" | …). Normalized to a tier slug. */
  plan: string | null | undefined;
  /** DB license type ("personal" | "team" | "growth" | "enterprise"; legacy "business" possible). */
  licenseType: string | null | undefined;
  /**
   * A non-secret, human-readable identifier for the license. Use the
   * license's `certificate_id` (preferred — it's also printed on the
   * certificate, so the filename correlates with the document) or fall
   * back to the license row `id`. NEVER pass the license key.
   */
  id: string | null | undefined;
}

/**
 * Builds the download filename for a license certificate PDF.
 *
 * Format: `reui-<plan>-<type>-license-<id>.pdf`
 *   e.g. `reui-pro-personal-license-9f3c1d20-….pdf`
 *
 * The license key is deliberately NOT part of the filename — it is a secret
 * and would otherwise leak into download history, shared files, and server
 * logs. The `id` is the certificate id (or license id), which is safe to
 * expose and lets support correlate a file back to its certificate.
 */
export function licenseCertificateFilename(
  input: LicenseCertificateFileInput,
): string {
  const plan = normalizePlanTier(input.plan) ?? "pro";
  const type = slugifyFilenamePart(input.licenseType);
  const id = slugifyFilenamePart(input.id);
  const stem = ["reui", plan, type, "license", id].filter(Boolean).join("-");
  return `${stem}.pdf`;
}
