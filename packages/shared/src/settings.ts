export type DiscountSyncStatus = "pending" | "synced" | "failed";

export interface DiscountConfig {
  enabled: boolean;
  percentage: number;
  badge_text: string;
  banner_text: string;
  /**
   * ID of the corresponding Paddle Discount object. Populated by
   * the admin "Sync to Paddle" flow whenever the discount config
   * is saved. Checkout passes this as `discountId` to
   * `Paddle.Checkout.open()` so Paddle actually applies the % at
   * the billing layer - without this the UI shows a discount but
   * customers get charged full price (bug fixed 2026-05-29).
   *
   * `null` (or absent) when the discount has never been synced or
   * was never pushed to Paddle. NOTE: a FAILED re-sync does NOT
   * null this out - the admin save flow persists the submitted
   * form state, which carries the PREVIOUS id (pointing at the
   * old percentage on Paddle's side). That is exactly why
   * `isDiscountEffective` also rejects `sync_status === 'failed'`:
   * the id alone can be present-but-stale, and charging the old
   * percentage while displaying the new one is the divergence the
   * gate exists to prevent.
   */
  paddle_discount_id?: string | null;
  /** Tracks the most recent admin → Paddle sync attempt. */
  sync_status?: DiscountSyncStatus;
  /** Paddle error message captured on the last failed sync. */
  sync_error?: string | null;
  /** ISO timestamp of the most recent successful sync. */
  last_synced_at?: string | null;
}

export type DiscountSource = "none" | "global" | "waitlist";

export const GLOBAL_DISCOUNT_SETTINGS_KEY = "global_discount";
export const WAITLIST_DISCOUNT_SETTINGS_KEY = "waitlist_discount";
export const BRANDING_SETTINGS_KEY = "branding";
export const ANNOUNCEMENT_SETTINGS_KEY = "announcement";
export const NOTIFICATIONS_SETTINGS_KEY = "notifications";
export const MCP_RATE_LIMITS_SETTINGS_KEY = "mcp_rate_limits";

/**
 * MCP request limits, edited live in admin Settings > MCP and read by the
 * hosted MCP limiter. `perDay: null` means unlimited (no cap). `perSeat`
 * multiplies the base by the license seat_count (per-seat quotas). Free is
 * always per-account; pro/ultimate are per-license (shared across a team).
 */
export interface McpTierLimit {
  perDay: number | null;
  perSeat?: boolean;
}

export interface McpRateLimitsConfig {
  free: McpTierLimit;
  pro: McpTierLimit;
  ultimate: McpTierLimit;
}

/** Launch defaults: free capped at 100/day, licensed tiers unlimited. */
export const DEFAULT_MCP_RATE_LIMITS: McpRateLimitsConfig = {
  free: { perDay: 100 },
  pro: { perDay: null, perSeat: false },
  ultimate: { perDay: null, perSeat: false },
};

function normalizeTierLimit(
  value: unknown,
  fallback: McpTierLimit,
): McpTierLimit {
  const input = (value ?? {}) as Partial<McpTierLimit>;
  let perDay: number | null;
  if (input.perDay === null || input.perDay === undefined) {
    perDay = input.perDay === null ? null : fallback.perDay;
  } else {
    const n = Number(input.perDay);
    perDay = Number.isFinite(n) && n >= 0 ? Math.floor(n) : fallback.perDay;
  }
  return {
    perDay,
    perSeat:
      typeof input.perSeat === "boolean" ? input.perSeat : fallback.perSeat,
  };
}

export function normalizeMcpRateLimits(
  value?: Partial<McpRateLimitsConfig> | Record<string, unknown> | null,
): McpRateLimitsConfig {
  const input = (value ?? {}) as Partial<McpRateLimitsConfig>;
  return {
    free: normalizeTierLimit(input.free, DEFAULT_MCP_RATE_LIMITS.free),
    pro: normalizeTierLimit(input.pro, DEFAULT_MCP_RATE_LIMITS.pro),
    ultimate: normalizeTierLimit(
      input.ultimate,
      DEFAULT_MCP_RATE_LIMITS.ultimate,
    ),
  };
}

export const DEFAULT_DISCOUNT_CONFIG: DiscountConfig = {
  enabled: false,
  percentage: 0,
  badge_text: "",
  banner_text: "",
  paddle_discount_id: null,
  sync_status: "pending",
  sync_error: null,
  last_synced_at: null,
};

export const DEFAULT_WAITLIST_DISCOUNT_CONFIG: DiscountConfig = {
  enabled: false,
  percentage: 0,
  badge_text: "Waitlist",
  banner_text: "Waitlist pricing is active for your account.",
  paddle_discount_id: null,
  sync_status: "pending",
  sync_error: null,
  last_synced_at: null,
};

export function normalizeDiscountConfig(
  value?: Partial<DiscountConfig> | Record<string, unknown> | null,
): DiscountConfig {
  const input = (value ?? {}) as Partial<DiscountConfig>;
  const percentage = Number(input.percentage ?? 0);
  const syncStatus = input.sync_status;

  return {
    enabled: Boolean(input.enabled),
    percentage: Number.isFinite(percentage)
      ? Math.min(99, Math.max(0, Math.round(percentage)))
      : 0,
    badge_text: typeof input.badge_text === "string" ? input.badge_text : "",
    banner_text: typeof input.banner_text === "string" ? input.banner_text : "",
    paddle_discount_id:
      typeof input.paddle_discount_id === "string"
        ? input.paddle_discount_id
        : null,
    sync_status:
      syncStatus === "synced" || syncStatus === "failed"
        ? syncStatus
        : "pending",
    sync_error: typeof input.sync_error === "string" ? input.sync_error : null,
    last_synced_at:
      typeof input.last_synced_at === "string" ? input.last_synced_at : null,
  };
}

export function applyPercentageDiscount(
  amount: number,
  discount?: Pick<DiscountConfig, "enabled" | "percentage"> | null,
): number {
  if (!discount?.enabled || discount.percentage <= 0) {
    return amount;
  }

  return Math.round(amount * (1 - discount.percentage / 100));
}

/**
 * Same discount math as `applyPercentageDiscount`, but rounds at the CENTS
 * level rather than the whole-dollar level. Paddle itself always computes a
 * percentage discount against the exact integer-cents price, so any caller
 * whose number has to match what Paddle actually charges (checkout, the
 * upgrade breakdown) must round here, not on a whole-dollar amount -
 * rounding to whole dollars first (as `applyPercentageDiscount` does, by
 * design, for the pricing page's deliberately decimal-free display) can be
 * off by tens of cents to a full dollar relative to the real charge.
 */
export function applyPercentageDiscountCents(
  amountCents: number,
  discount?: Pick<DiscountConfig, "enabled" | "percentage"> | null,
): number {
  if (!discount?.enabled || discount.percentage <= 0) {
    return amountCents;
  }

  return Math.round(amountCents * (1 - discount.percentage / 100));
}

/**
 * A discount only counts - for DISPLAY and for CHARGING alike - when Paddle
 * can actually honor it. `enabled` alone is not enough:
 *
 *   - no `paddle_discount_id` (initial sync failed / never ran): the UI
 *     would show a discounted price while `Checkout.open()` has no
 *     `discountId` to pass, so Paddle charges FULL price;
 *   - `sync_status === "failed"` with an id present (a later re-sync
 *     failed): the id points at the OLD percentage on Paddle's side, so
 *     Paddle would charge a different percentage than the one displayed.
 *
 * Both shapes are display-vs-charge divergences - the worst checkout bug
 * class. Gating on this predicate in `resolveDiscountState` makes every
 * consumer (pricing badge, checkout sidebar, the `discountId` handed to
 * Paddle, upgrade breakdowns) flip together: either the discount is fully
 * honorable and shown everywhere, or it is treated as absent everywhere.
 *
 * `pending` (not just `synced`) is deliberately accepted: the admin save
 * flow persists the config before re-persisting sync metadata, so a
 * previously-synced id briefly rides a `pending` status; rejecting it
 * would flicker the discount off during every save.
 */
export function isDiscountEffective(
  discount?: Pick<
    DiscountConfig,
    "enabled" | "percentage" | "paddle_discount_id" | "sync_status"
  > | null,
): boolean {
  if (!discount) return false;
  return Boolean(
    discount.enabled &&
    (discount.percentage ?? 0) > 0 &&
    discount.paddle_discount_id &&
    discount.sync_status !== "failed",
  );
}

/**
 * Admin notification recipients, configured in the admin app under
 * Settings → Notifications and stored as the `notifications` settings blob.
 * Each list holds explicit recipient emails; an EMPTY list means
 * "fall back to all admins" at send time (resolved in
 * apps/web/lib/notifications/admin-notify.ts).
 */
export interface NotificationsConfig {
  /** Recipients for new orders — covers both new licenses AND upgrades. */
  newOrderEmails: string[];
  /** Recipients for block issue reports. */
  blockIssueEmails: string[];
}

export const DEFAULT_NOTIFICATIONS_CONFIG: NotificationsConfig = {
  newOrderEmails: [],
  blockIssueEmails: [],
};

/** Trim + lowercase + dedupe a stored email list, dropping non-strings. */
function normalizeEmailList(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const email = entry.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    out.push(email);
  }
  return out;
}

export function normalizeNotificationsConfig(
  value?: Partial<NotificationsConfig> | Record<string, unknown> | null,
): NotificationsConfig {
  const input = (value ?? {}) as Partial<NotificationsConfig>;
  return {
    newOrderEmails: normalizeEmailList(input.newOrderEmails),
    blockIssueEmails: normalizeEmailList(input.blockIssueEmails),
  };
}
