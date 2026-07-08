import { createHash, randomBytes } from "crypto";

/**
 * MCP credential tokens - shared between the authorization server
 * (apps/web, mints them) and the resource server (apps/mcp, verifies them).
 *
 * Three opaque, prefix-disambiguated kinds, all hashed at rest (SHA-256;
 * the raw secret exists only client-side after issuance):
 *
 *   reui_oat_  OAuth access token   (short-lived, interactive clients)
 *   reui_ort_  OAuth refresh token  (rotating families)
 *   reui_pat_  personal API token   (account-issued, headless / CI)
 *
 * The legacy license key (REUI-XXXX-XXXX-XXXX-XXXX) remains a fourth valid
 * Bearer credential; it is generated and validated by the license modules,
 * not here. Prefixes are chosen so no kind can ever be confused with a
 * license key or with each other.
 */

export const MCP_TOKEN_PREFIXES = {
  access: "reui_oat_",
  refresh: "reui_ort_",
  personal: "reui_pat_",
} as const;

export type McpTokenKind = keyof typeof MCP_TOKEN_PREFIXES;

/** 32 random bytes, base64url = ~256 bits of entropy after the prefix. */
export function generateMcpToken(kind: McpTokenKind): string {
  return MCP_TOKEN_PREFIXES[kind] + randomBytes(32).toString("base64url");
}

/** SHA-256 hex digest - the only form ever stored server-side. */
export function hashMcpToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/** Which kind a bearer string claims to be, or null if none match. */
export function detectMcpTokenKind(
  bearer: string | null | undefined,
): McpTokenKind | null {
  if (!bearer) return null;
  const t = bearer.trim();
  for (const [kind, prefix] of Object.entries(MCP_TOKEN_PREFIXES)) {
    if (t.startsWith(prefix)) return kind as McpTokenKind;
  }
  return null;
}

/**
 * Display prefix for UI listings (e.g. "reui_pat_Ab3d"): the kind prefix
 * plus the first 4 secret chars. Pair with the stored last4 - never the
 * raw token - when rendering.
 */
export function mcpTokenDisplayPrefix(token: string): string {
  const kind = detectMcpTokenKind(token);
  if (!kind) return token.slice(0, 8);
  const prefix = MCP_TOKEN_PREFIXES[kind];
  return prefix + token.slice(prefix.length, prefix.length + 4);
}

/** Last 4 chars of the secret, for UI listings next to the display prefix. */
export function mcpTokenLast4(token: string): string {
  return token.slice(-4);
}
