export const WAITLIST_STATUSES = ["joined", "claimed", "removed"] as const;

export type WaitlistStatus = (typeof WAITLIST_STATUSES)[number];

export interface WaitlistProfileSnapshot {
  waitlist_status?: string | null;
  waitlist_discount_eligible?: boolean | null;
  /**
   * Set once the one-time waitlist discount has been consumed on a completed
   * order. A redeemed profile is no longer eligible, regardless of the flag or
   * status above, so the discount applies to a single purchase only.
   */
  waitlist_discount_redeemed_at?: string | null;
}

export interface WaitlistJoinSubmission {
  email: string;
  company?: string;
  startedAt?: number;
  source?: string;
  referrer?: string | null;
}

export const WAITLIST_FORM_MIN_ELAPSED_MS = 1500;

export function normalizeWaitlistEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isWaitlistEligible(
  profile?: WaitlistProfileSnapshot | null,
): boolean {
  if (!profile) {
    return false;
  }

  // One-time discount: once redeemed on a completed order it never requalifies.
  if (profile.waitlist_discount_redeemed_at) {
    return false;
  }

  return (
    profile.waitlist_discount_eligible === true ||
    profile.waitlist_status === "claimed"
  );
}

export function isLikelyBotSubmission(
  submission: Pick<WaitlistJoinSubmission, "company" | "startedAt">,
  now = Date.now(),
  minElapsedMs = WAITLIST_FORM_MIN_ELAPSED_MS,
): boolean {
  if ((submission.company ?? "").trim().length > 0) {
    return true;
  }

  const startedAt = Number(submission.startedAt ?? 0);
  if (!Number.isFinite(startedAt) || startedAt <= 0) {
    return true;
  }

  return now - startedAt < minElapsedMs;
}
