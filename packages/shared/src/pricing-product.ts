import type { LicenseType, PlanTier } from "./index";

/**
 * Shape of a single row in the `pricing_products` table.
 *
 * Shared across web and admin so the DAL on each side returns
 * the same TS type. Keep this in lockstep with the schema in
 * `apps/web/supabase/migrations/20260525000000_pricing_products.sql`.
 */
export interface PricingProduct {
  id: string;
  plan: PlanTier;
  license_type: LicenseType;
  /**
   * Stored in MINOR currency units (cents). Use `priceWholeUnits()`
   * to render whole dollars in UI.
   */
  price_cents: number;
  currency: string;
  paddle_product_id: string | null;
  paddle_price_id: string | null;
  sync_status: PricingSyncStatus;
  sync_error: string | null;
  last_synced_at: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export type PricingSyncStatus = "pending" | "synced" | "failed";

/**
 * Subset of a `PricingProduct` an admin can edit via the UI. The
 * rest of the row (Paddle IDs, sync status, timestamps) is owned
 * by the server (sync flow + DB triggers).
 */
export interface PricingProductEditable {
  price_cents: number;
  currency?: string;
  sort_order?: number;
  is_active?: boolean;
}

/** Convert cents to whole-unit dollars for display. */
export function priceWholeUnits(priceCents: number): number {
  return Math.round(priceCents / 100);
}

/** Convert a whole-unit dollar amount (from an admin input) to cents. */
export function priceToCents(wholeUnits: number): number {
  return Math.round(wholeUnits * 100);
}

/**
 * Find a single product in a fetched list by its plan + license
 * key. Used by callers that already have all products loaded
 * (e.g. the pricing page renders the full table) and want to
 * avoid a per-row DB roundtrip.
 */
export function findPricingProduct(
  products: PricingProduct[],
  plan: PlanTier,
  licenseType: LicenseType,
): PricingProduct | null {
  return (
    products.find((p) => p.plan === plan && p.license_type === licenseType) ??
    null
  );
}

/**
 * Cache tag used by `'use cache'` reads in the web app and by
 * `revalidateTag()` in the admin app's save flow. Defined here
 * so the two stay in sync via a single import.
 */
export const PRICING_PRODUCTS_CACHE_TAG = "pricing-products";
