export const SITE_NAME = "ReUI Pro";
export const SITE_DESCRIPTION =
  "Build faster with premium UI blocks, hand-crafted icons, and production-ready templates.";

// License tiers, ordered low → high seat capacity: Personal (1 seat),
// Team (5 seats), Growth (10 seats), Enterprise (unlimited). The retired
// `business` tier is intentionally omitted here so no new code path can
// select it; the Postgres `license_type` enum keeps the value for any
// grandfathered rows (see migration 20260630000000), and
// `formatLicenseType()` still labels it.
export const LICENSE_TYPES = [
  "personal",
  "team",
  "growth",
  "enterprise",
] as const;
export type LicenseType = (typeof LICENSE_TYPES)[number];

export const PLAN_TIERS = ["pro", "ultimate"] as const;
export type PlanTier = (typeof PLAN_TIERS)[number];

/** @deprecated Use PLAN_TIERS */
export const PLAN_NAMES = ["pro", "ultimate"] as const;
export type PlanName = (typeof PLAN_NAMES)[number];

export const LICENSE_STATUSES = [
  "active",
  "revoked",
  "expired",
  "refunded",
] as const;
export type LicenseStatus = (typeof LICENSE_STATUSES)[number];

export const REFUND_STATUSES = ["pending", "approved", "rejected"] as const;
export type RefundStatus = (typeof REFUND_STATUSES)[number];

export const FAQ_CATEGORIES = [
  "general",
  "pricing",
  "billing",
  "technical",
] as const;
export type FaqCategory = (typeof FAQ_CATEGORIES)[number];

export const USER_ROLES = ["customer", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const PRODUCT_TYPES = [
  "bundle",
  "templates",
  "blocks",
  "icons",
  "tool",
  "ai_tool",
] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

/**
 * Returns the Resend-formatted sender string: "Name <address>".
 *
 * Reads EMAIL_FROM_NAME and EMAIL_FROM_ADDRESS from environment variables.
 * Both apps (.env.local / .env.example) define these vars — no Resend
 * dashboard configuration is needed for the sender identity.
 *
 * Note: the sending domain (the part after @) must still be verified in the
 * Resend dashboard once, but the display name and address are controlled here.
 */
/**
 * Canonical display names for plan tiers.
 * Includes legacy aliases (e.g. "essentials" → "Pro") so old DB rows
 * render correctly while the database is being cleaned up.
 */
export const PLAN_DISPLAY_NAMES: Record<string, string> = {
  // Current tiers
  free: "Free",
  pro: "Pro",
  ultimate: "Ultimate",
  // Legacy aliases — remove once DB is fully migrated
  essentials: "Pro",
  starter: "Pro",
  standard: "Pro",
  plus: "Ultimate",
  complete: "Ultimate",
};

/**
 * Returns the human-readable plan name for a DB tier key.
 * Falls back to Title-casing the raw value for unknown/future tiers.
 */
export function formatPlanName(plan: string | null | undefined): string {
  if (!plan) return "—";
  return (
    PLAN_DISPLAY_NAMES[plan.toLowerCase()] ??
    plan.charAt(0).toUpperCase() + plan.slice(1)
  );
}

/**
 * Canonical display names for license types. The DB enum value
 * `personal` renders as "Personal" (renamed from the old "Solo" label).
 * Keep this as the single source of truth — UI label maps, emails, and the
 * PDF certificate all format through `formatLicenseType()`.
 */
export const LICENSE_TYPE_DISPLAY_NAMES: Record<string, string> = {
  personal: "Personal",
  team: "Team",
  growth: "Growth",
  // Retired tier: kept here (and in the DB enum) only so grandfathered
  // `business` license rows still render a clean label. Not a sellable tier.
  business: "Business",
  enterprise: "Enterprise",
};

/**
 * Returns the human-readable license-type name for a DB enum key
 * ("personal" → "Personal"). Falls back to Title-casing unknown values.
 */
export function formatLicenseType(
  licenseType: string | null | undefined,
): string {
  if (!licenseType) return "—";
  return (
    LICENSE_TYPE_DISPLAY_NAMES[licenseType.toLowerCase()] ??
    licenseType.charAt(0).toUpperCase() + licenseType.slice(1)
  );
}

/**
 * General / marketing sender ("Name <address>"). Used for campaigns and any
 * non-transactional mail. Reads EMAIL_FROM_NAME + EMAIL_FROM_ADDRESS.
 */
export function getEmailFrom(): string {
  const name = process.env.EMAIL_FROM_NAME || "ReUI";
  const address = process.env.EMAIL_FROM_ADDRESS || "hello@reui.io";
  return `${name} <${address}>`;
}

/**
 * Transactional / system sender ("Name <address>"). Used for receipts, license
 * keys, magic links, refunds, welcome, and admin notifications - the mail whose
 * deliverability is most critical. Set EMAIL_FROM_TRANSACTIONAL_ADDRESS (e.g.
 * "notifications@reui.io") to isolate this stream from marketing; when unset it
 * falls back to the general EMAIL_FROM_ADDRESS, so behavior is unchanged until
 * you opt in. NEVER send campaigns from this address.
 */
export function getTransactionalEmailFrom(): string {
  const name = process.env.EMAIL_FROM_NAME || "ReUI";
  const address =
    process.env.EMAIL_FROM_TRANSACTIONAL_ADDRESS ||
    process.env.EMAIL_FROM_ADDRESS ||
    "hello@reui.io";
  return `${name} <${address}>`;
}

/**
 * Reply-To for transactional/system mail. Point it at a monitored inbox (e.g.
 * "hello@reui.io") so a reply to a send-only address like notifications@ still
 * reaches a human. Returns undefined when EMAIL_REPLY_TO is unset.
 */
export function getEmailReplyTo(): string | undefined {
  return process.env.EMAIL_REPLY_TO || undefined;
}

/**
 * Canonical currency formatter - always renders exactly two decimal places
 * with thousands separators (e.g. 1234.5 -> "$1,234.50", 249 -> "$249.00"),
 * matching how a real charge/refund amount should read everywhere in the
 * product: checkout, emails, payment history, admin views. Takes a
 * whole-currency-unit amount (dollars for USD), not cents.
 */
export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
}

/** Same as `formatCurrency`, but takes an integer cents amount (e.g. a DB `amount_cents` column). */
export function formatCents(cents: number, currency = "USD"): string {
  return formatCurrency(cents / 100, currency);
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export {
  isTeamLicense,
  ACCOUNT_ROUTES,
  ACCOUNT_PATH,
  PRICING_PATH,
  LOGIN_PATH,
} from "./account";
export type { AccountRoute } from "./account";
export { licenseCertificateFilename } from "./license-file";
export type { LicenseCertificateFileInput } from "./license-file";
export {
  generateLicenseKey,
  isValidLicenseKeyFormat,
  LICENSE_KEY_REGEX,
} from "./license-key";
export {
  BASE_PRICES,
  ENTERPRISE_SEAT_SENTINEL,
  SEAT_COUNTS,
  PLAN_TIER_ORDER,
  normalizePlanTier,
  hasUnlimitedSeats,
  licenseTierRank,
  isUpgrade,
  getUpgradePriceDiff,
} from "./pricing";
export {
  ANNOUNCEMENT_SETTINGS_KEY,
  BRANDING_SETTINGS_KEY,
  DEFAULT_DISCOUNT_CONFIG,
  DEFAULT_MCP_RATE_LIMITS,
  DEFAULT_NOTIFICATIONS_CONFIG,
  DEFAULT_WAITLIST_DISCOUNT_CONFIG,
  GLOBAL_DISCOUNT_SETTINGS_KEY,
  MCP_RATE_LIMITS_SETTINGS_KEY,
  NOTIFICATIONS_SETTINGS_KEY,
  WAITLIST_DISCOUNT_SETTINGS_KEY,
  applyPercentageDiscount,
  applyPercentageDiscountCents,
  isDiscountEffective,
  normalizeDiscountConfig,
  normalizeMcpRateLimits,
  normalizeNotificationsConfig,
} from "./settings";
export type {
  DiscountConfig,
  DiscountSource,
  McpRateLimitsConfig,
  McpTierLimit,
  NotificationsConfig,
} from "./settings";
export {
  WAITLIST_FORM_MIN_ELAPSED_MS,
  WAITLIST_STATUSES,
  isLikelyBotSubmission,
  isWaitlistEligible,
  normalizeWaitlistEmail,
} from "./waitlist";
export type {
  WaitlistJoinSubmission,
  WaitlistProfileSnapshot,
  WaitlistStatus,
} from "./waitlist";
export { AuditActions } from "./audit";
export type { AuditScope, AuditEntry, AuditAction } from "./audit";
