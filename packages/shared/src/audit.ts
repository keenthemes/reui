/**
 * Shared audit log types used by both web and admin apps.
 */

/** Which part of the system generated the log entry */
export type AuditScope = "admin" | "web" | "system" | "webhook" | "mcp";

/** Structured payload inserted into the audit_log table */
export interface AuditEntry {
  actor_id?: string | null;
  scope: AuditScope;
  action: string;
  entity_type: string;
  entity_id?: string | null;
  target_user_id?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Well-known action constants — use these instead of raw strings so the
 * audit log is consistent and easily filterable.
 */
export const AuditActions = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  AUTH_LOGIN: "auth.login",
  AUTH_LOGOUT: "auth.logout",
  AUTH_INVITE: "auth.invite",
  AUTH_INVITE_ACCEPT: "auth.invite.accept",

  // ── User / Profile ────────────────────────────────────────────────────────
  USER_UPDATE_PROFILE: "user.update_profile",
  USER_UPDATE_AVATAR: "user.update_avatar",
  USER_UPDATE_ROLE: "user.update_role",
  USER_SUSPEND: "user.suspend",
  USER_DELETE: "user.delete",

  // ── License ──────────────────────────────────────────────────────────────
  LICENSE_CREATED: "license.created",
  LICENSE_REVOKED: "license.revoked",
  LICENSE_UPGRADED: "license.upgraded",
  LICENSE_CERT_DOWNLOAD: "license.certificate.download",

  // ── Payment / Checkout ───────────────────────────────────────────────────
  PAYMENT_COMPLETED: "payment.completed",
  PAYMENT_REFUNDED: "payment.refunded",
  CHECKOUT_STARTED: "checkout.started",

  // ── Refund ───────────────────────────────────────────────────────────────
  REFUND_REQUESTED: "refund.requested",
  REFUND_APPROVED: "refund.approved",
  REFUND_REJECTED: "refund.rejected",

  // ── Template ─────────────────────────────────────────────────────────────
  TEMPLATE_DOWNLOAD: "template.download",
  TEMPLATE_PURCHASE: "template.purchase",
  TEMPLATE_CREATED: "template.created",
  TEMPLATE_UPDATED: "template.updated",
  TEMPLATE_DELETED: "template.deleted",

  // ── Block Issues ─────────────────────────────────────────────────────────
  BLOCK_ISSUE_RESOLVED: "block_issue.resolved",
  BLOCK_ISSUE_REJECTED: "block_issue.rejected",
  BLOCK_ISSUE_NOTE_UPDATED: "block_issue.public_note.updated",

  // ── Category ────────────────────────────────────────────────────────────
  CATEGORY_CREATED: "category.created",
  CATEGORY_UPDATED: "category.updated",
  CATEGORY_DELETED: "category.deleted",

  // ── Announcement ────────────────────────────────────────────────────────
  ANNOUNCEMENT_CREATED: "announcement.created",
  ANNOUNCEMENT_UPDATED: "announcement.updated",
  ANNOUNCEMENT_DELETED: "announcement.deleted",

  // ── Settings ─────────────────────────────────────────────────────────────
  SETTINGS_DISCOUNT: "settings.discount.updated",
  SETTINGS_BRANDING: "settings.branding.updated",

  // ── Team ─────────────────────────────────────────────────────────────────
  TEAM_MEMBER_ADDED: "team.member.added",
  TEAM_MEMBER_REMOVED: "team.member.removed",
  TEAM_MEMBER_ROLE: "team.member.role_updated",

  // ── Webhook ───────────────────────────────────────────────────────────────
  WEBHOOK_RECEIVED: "webhook.received",
  WEBHOOK_ERROR: "webhook.error",

  // ── MCP (ReUI for Agents) ─────────────────────────────────────────────────
  MCP_AUTH_GRANTED: "mcp.auth.granted",
  MCP_AUTH_DENIED: "mcp.auth.denied",
  MCP_TOOL_CALL: "mcp.tool.call",
  MCP_TOOL_ERROR: "mcp.tool.error",
  MCP_REQUEST: "mcp.request",
  MCP_SESSION_START: "mcp.session.start",
  MCP_SESSION_END: "mcp.session.end",
  // report_issue feedback on non-block items (blocks go to block_issues).
  MCP_FEEDBACK: "mcp.feedback",
} as const;

export type AuditAction = (typeof AuditActions)[keyof typeof AuditActions];
