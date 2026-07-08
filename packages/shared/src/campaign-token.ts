import { createHmac, timingSafeEqual } from "crypto";

/**
 * Stateless unsubscribe tokens, shared by the campaign sender (apps/admin, which
 * SIGNS one into every marketing email) and the public unsubscribe page
 * (apps/web, which VERIFIES it). HMAC(email) so no per-recipient token is ever
 * stored: the link embeds base64url(email) + signature, and the route recomputes
 * the HMAC and constant-time compares.
 *
 * Secret: signing uses SUPABASE_SERVICE_ROLE_KEY, which is identical across both
 * apps (same Supabase project), so a token minted in admin always verifies in
 * web with no extra env wiring. Verification ALSO accepts CRON_SECRET and the
 * dev fallback, so any link minted by the earlier admin-only implementation
 * (which preferred CRON_SECRET) keeps working. Unsubscribe is compliance
 * critical - a marketing send must never carry a dead link.
 */

const DEV_FALLBACK_SECRET = "reui-campaign-unsub-dev-secret";

/** The one secret new tokens are signed with - present + equal in every app. */
function signingSecret(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || DEV_FALLBACK_SECRET;
}

/**
 * Every secret a token could legitimately have been signed with, so a link
 * survives a secret change or the admin-only -> shared migration. Deduped and
 * emptied of unset vars.
 */
function candidateSecrets(): string[] {
  const secrets = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.CRON_SECRET,
    DEV_FALLBACK_SECRET,
  ].filter((secret): secret is string => Boolean(secret));
  return Array.from(new Set(secrets));
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromB64url(input: string): Buffer {
  return Buffer.from(input.replace(/-/g, "+").replace(/_/g, "/"), "base64");
}

function sign(email: string, secret: string): string {
  return b64url(createHmac("sha256", secret).update(email).digest());
}

/** `<base64url(email)>.<base64url(hmac)>` - safe to place in an email link. */
export function createUnsubscribeToken(email: string): string {
  const normalized = email.trim().toLowerCase();
  return `${b64url(normalized)}.${sign(normalized, signingSecret())}`;
}

/** Returns the verified lowercase email, or null if the token is malformed/forged. */
export function verifyUnsubscribeToken(token: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  let email: string;
  try {
    email = fromB64url(parts[0]!).toString("utf8").trim().toLowerCase();
  } catch {
    return null;
  }
  if (!email || !email.includes("@")) return null;

  const provided = Buffer.from(parts[1]!);
  for (const secret of candidateSecrets()) {
    const expected = Buffer.from(sign(email, secret));
    if (
      expected.length === provided.length &&
      timingSafeEqual(expected, provided)
    ) {
      return email;
    }
  }
  return null;
}
