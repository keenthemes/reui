import type { LicenseType, PlanTier } from "./index";

/**
 * Reference sale prices in USD (whole dollars).
 *
 * The pricing UI reads LIVE prices from public.pricing_products via
 * `getDbPrices()` — admins can edit them through the admin app
 * without redeploying. This constant only serves three remaining
 * purposes:
 *
 *   1. Fallback for upgrade-diff math when the DB query fails or
 *      returns no row for the requested plan/license_type combo.
 *   2. Default seed values when running the project locally
 *      against an empty DB (`pnpm db:reset`).
 *   3. A documentation anchor for what the prices were intended
 *      to be at launch — drift between this constant and the DB
 *      is expected once the admin starts editing.
 *
 * Pre-launch checklist (before turning live transactions on):
 *   • Run the admin's "Sync all to Paddle" flow so every
 *     pricing_products row has matching paddle_product_id /
 *     paddle_price_id values.
 *   • Spot-check one purchase per plan × license_type combo
 *     in Paddle sandbox.
 *   • The retired 'business' tier is no longer sold; its DB enum value is
 *     intentionally retained for grandfathered rows (migration
 *     20260630000000).
 */
export const BASE_PRICES: Record<PlanTier, Record<LicenseType, number>> = {
  pro: { personal: 249, team: 499, growth: 999, enterprise: 3999 },
  ultimate: { personal: 499, team: 999, growth: 1999, enterprise: 7999 },
};

/**
 * Seat allocation per license type.
 *
 *  personal   → 1 seat    (Solo: no team management)
 *  team       → 5 seats   (Team: small teams, low-cost entry)
 *  growth     → 10 seats  (Growth: mid-market teams, adds select procurement perks)
 *  enterprise → unlimited seats (stored with a high sentinel value)
 */
export const ENTERPRISE_SEAT_SENTINEL = 999_999;

export const SEAT_COUNTS: Record<LicenseType, number> = {
  personal: 1,
  team: 5,
  growth: 10,
  enterprise: ENTERPRISE_SEAT_SENTINEL,
};

export function hasUnlimitedSeats(
  licenseType?: string | null,
  seatCount?: number | null,
): boolean {
  return (
    licenseType === "enterprise" ||
    (typeof seatCount === "number" && seatCount >= ENTERPRISE_SEAT_SENTINEL)
  );
}

/**
 * Plans included from lower to higher tier for upgrade comparison.
 */
export const PLAN_TIER_ORDER: PlanTier[] = ["pro", "ultimate"];

/**
 * Normalize historical plan keys to the current paid package model.
 * Free is display-only and is intentionally not a license plan.
 */
export function normalizePlanTier(plan?: string | null): PlanTier | null {
  const value = plan?.trim().toLowerCase();
  if (!value) return null;

  if (
    value === "pro" ||
    value === "standard" ||
    value === "essentials" ||
    value === "starter"
  ) {
    return "pro";
  }

  if (value === "ultimate" || value === "plus" || value === "complete") {
    return "ultimate";
  }

  return null;
}

// Ordered low → high so `indexOf` produces a monotonic rank used by
// `licenseTierRank` for upgrade-path arithmetic.
const LICENSE_TYPE_ORDER: LicenseType[] = [
  "personal",
  "team",
  "growth",
  "enterprise",
];

/**
 * Numeric rank for a license combining plan tier and license type.
 * Higher = better.  Plan tier is weighted more heavily than license type.
 */
export function licenseTierRank(plan: string, licenseType: string): number {
  const normalizedPlan = normalizePlanTier(plan);
  const planIdx = normalizedPlan ? PLAN_TIER_ORDER.indexOf(normalizedPlan) : -1;
  const typeIdx = LICENSE_TYPE_ORDER.indexOf(licenseType as LicenseType);
  return (planIdx < 0 ? 0 : planIdx) * 10 + (typeIdx < 0 ? 0 : typeIdx);
}

/**
 * Returns true if `to` is a higher tier than `from`.
 */
export function isUpgrade(fromPlan: PlanTier, toPlan: PlanTier): boolean {
  const from = normalizePlanTier(fromPlan);
  const to = normalizePlanTier(toPlan);
  if (!from || !to) return false;
  return PLAN_TIER_ORDER.indexOf(to) > PLAN_TIER_ORDER.indexOf(from);
}

/**
 * Calculates upgrade price difference in whole dollars.
 */
export function getUpgradePriceDiff(
  fromPlan: PlanTier,
  toPlan: PlanTier,
  licenseType: LicenseType,
): number {
  return BASE_PRICES[toPlan][licenseType] - BASE_PRICES[fromPlan][licenseType];
}
