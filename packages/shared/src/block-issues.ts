import { z } from "zod";

export const BLOCK_ISSUE_RAW_STATUSES = [
  "submitted",
  "accepted",
  "fixed",
  "rejected",
] as const;

export type BlockIssueRawStatus = (typeof BLOCK_ISSUE_RAW_STATUSES)[number];

export const BLOCK_ISSUE_STATUSES = [
  "pending",
  "resolved",
  "rejected",
] as const;

export type BlockIssueStatus = (typeof BLOCK_ISSUE_STATUSES)[number];

export const BLOCK_ISSUE_RESOLVED_RAW_STATUSES = ["accepted", "fixed"] as const;

export type BlockIssueResolvedRawStatus =
  (typeof BLOCK_ISSUE_RESOLVED_RAW_STATUSES)[number];

export function getBlockIssueStatus(
  status: BlockIssueRawStatus | BlockIssueStatus,
): BlockIssueStatus {
  if (status === "submitted" || status === "pending") {
    return "pending";
  }

  if (status === "accepted" || status === "fixed" || status === "resolved") {
    return "resolved";
  }

  return "rejected";
}

export const BLOCK_ISSUE_ADMIN_STATUS_FILTERS = [
  "all",
  ...BLOCK_ISSUE_STATUSES,
] as const;

export type BlockIssueAdminStatusFilter =
  (typeof BLOCK_ISSUE_ADMIN_STATUS_FILTERS)[number];

export const BLOCK_ISSUE_MODERATION_ACTIONS = [
  "resolve",
  "reject",
  "update-note",
] as const;

export type BlockIssueModerationAction =
  (typeof BLOCK_ISSUE_MODERATION_ACTIONS)[number];

export const BLOCK_ISSUE_SORT_FIELDS = [
  "created_at",
  "updated_at",
  "block_id",
  "status",
] as const;

export type BlockIssueSortField = (typeof BLOCK_ISSUE_SORT_FIELDS)[number];

export const BLOCK_ISSUE_BLOCK_ID_REGEX = /^[a-z0-9][a-z0-9-]*$/;
export const BLOCK_ISSUE_DESCRIPTION_MIN = 12;
export const BLOCK_ISSUE_DESCRIPTION_MAX = 2000;
export const BLOCK_ISSUE_PUBLIC_NOTE_MAX = 1200;
export const BLOCK_ISSUE_PUBLIC_HISTORY_LIMIT = 50;

export function normalizeBlockIssueBlockId(value: string) {
  return value.trim().toLowerCase();
}

export function normalizeBlockIssuePublicNote(
  value: string | null | undefined,
) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length > 0 ? trimmed : null;
}

export const blockIssueIdSchema = z.string().uuid();

export const blockIssueBlockIdSchema = z
  .string()
  .trim()
  .min(1, "Block ID is required.")
  .max(120, "Block ID must be 120 characters or fewer.")
  .regex(BLOCK_ISSUE_BLOCK_ID_REGEX, "Block ID format is invalid.")
  .transform(normalizeBlockIssueBlockId);

export const blockIssueDescriptionSchema = z
  .string()
  .trim()
  .min(
    BLOCK_ISSUE_DESCRIPTION_MIN,
    `Description must be at least ${BLOCK_ISSUE_DESCRIPTION_MIN} characters.`,
  )
  .max(
    BLOCK_ISSUE_DESCRIPTION_MAX,
    `Description must be ${BLOCK_ISSUE_DESCRIPTION_MAX} characters or fewer.`,
  );

export const blockIssuePublicNoteSchema = z
  .string()
  .trim()
  .max(
    BLOCK_ISSUE_PUBLIC_NOTE_MAX,
    `Public note must be ${BLOCK_ISSUE_PUBLIC_NOTE_MAX} characters or fewer.`,
  );

/**
 * The "Report Block Issue" surface is now a multi-purpose feedback
 * channel. Each submission has a type:
 *
 *   - issue    → defect / regression
 *   - feature  → suggestion for improvement / new functionality
 *   - feedback → general comment, observation, or appreciation
 *
 * The default is "issue" for backwards compatibility with existing
 * client code that omits the field.
 */
export const BLOCK_REPORT_TYPES = ["issue", "feature", "feedback"] as const;

export type BlockReportType = (typeof BLOCK_REPORT_TYPES)[number];

export const BLOCK_REPORT_TYPE_DEFAULT: BlockReportType = "issue";

export const BLOCK_REPORT_TYPE_LABELS: Record<BlockReportType, string> = {
  issue: "Issue",
  feature: "Feature request",
  feedback: "Feedback",
};

export const BLOCK_REPORT_TYPE_DESCRIPTIONS: Record<BlockReportType, string> = {
  issue:
    "Something looks off, broken, or not working as expected.",
  feature:
    "A suggestion to add or improve functionality in this block.",
  feedback: "A general note, observation, or compliment.",
};

export const blockReportTypeSchema = z
  .enum(BLOCK_REPORT_TYPES)
  .default(BLOCK_REPORT_TYPE_DEFAULT);

export const BLOCK_REPORT_TYPE_FILTERS = ["all", ...BLOCK_REPORT_TYPES] as const;

export type BlockReportTypeFilter = (typeof BLOCK_REPORT_TYPE_FILTERS)[number];

export const blockIssueSubmitSchema = z.object({
  blockId: blockIssueBlockIdSchema,
  description: blockIssueDescriptionSchema,
  type: blockReportTypeSchema,
});

export const blockIssueHistoryQuerySchema = z.object({
  blockId: blockIssueBlockIdSchema,
});

export const blockIssueAdminListQuerySchema = z.object({
  page: z.coerce.number().int().min(0).default(0),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().trim().max(120).default(""),
  status: z.enum(BLOCK_ISSUE_ADMIN_STATUS_FILTERS).default("all"),
  type: z.enum(BLOCK_REPORT_TYPE_FILTERS).default("all"),
  sortBy: z.enum(BLOCK_ISSUE_SORT_FIELDS).default("created_at"),
  sortDir: z.enum(["asc", "desc"]).default("desc"),
});

export const blockIssueModerationSchema = z.object({
  action: z.enum(BLOCK_ISSUE_MODERATION_ACTIONS),
  publicNote: blockIssuePublicNoteSchema.optional(),
});
