import type {
  FilterDraftStep,
  FilterIssue,
  FilterIssueReason,
  FilterLabels,
} from "@/registry-reui/bases/radix/reui/filters/filters-types"

/**
 * The shipped English copy. `stepAnnouncement` (consumer-composed create
 * wizard) and `showRecords` (a consumer's own panel heading) are unread by the
 * shipped chrome and kept on purpose; do not prune them as dead keys.
 */
export const DEFAULT_FILTER_LABELS: FilterLabels = {
  addFilter: "Add filter",
  advancedFilter: "Advanced filter",
  showRecords: "In this view, show records",
  builderEmpty: "No filters yet",
  builderEmptyHint: "Add a filter to narrow down what you see.",
  addCondition: "Add filter",
  addConditionGroup: "Add group",
  addToGroup: "Add filter to this group",
  removeGroup: "Remove group",
  wrapInGroup: "Wrap in group",
  ungroup: "Ungroup",
  moveToTopLevel: "Move to top",
  moveToGroup: (position) => `Move to group ${position}`,
  reorder: "Reorder",
  reorderHint: "Press Alt with Arrow Up or Arrow Down to reorder",
  groupAll: "All of the following are true...",
  groupAny: "Any of the following are true...",
  groupPlaceholder: "Drag filters here",
  rowLabel: (condition, depth) => `${condition}, level ${depth}`,
  groupLabel: (description, depth) => `${description} level ${depth}`,
  groupAnnouncement: (added) => (added ? "Group added" : "Group removed"),
  reorderAnnouncement: (label, position, total) =>
    `${label} moved to position ${position} of ${total}`,
  // Destination FIRST after the verb: it is the half a plain reorder cannot
  // say and the half the user cannot see once the row has stopped moving.
  // Position stays last, so this still ends on the "of N" a reorder ends on.
  moveAnnouncement: (label, destination, position, total) =>
    `${label} moved into ${destination}, position ${position} of ${total}`,
  clearAll: "Clear all",
  groupMenu: "Group options",
  searchFields: "Search attributes...",
  searchOperators: "Search operators...",
  searchOptions: "Search...",
  back: "Back",
  clear: "Clear",
  apply: "Apply",
  discard: "Discard changes",
  empty: "No results",
  loading: "Loading...",
  loadingMore: "Loading more...",
  loadMore: "Load more",
  error: "Could not load",
  retry: "Retry",
  where: "Where",
  and: "And",
  or: "Or",
  combinator: "Change combinator",
  // The word first: it is what the control SAYS and what a truncated pill
  // stops showing. The action follows, so the name still names an action.
  combinatorLabel: (word) => `${word}, change combinator`,
  duplicate: "Duplicate",
  negate: "Negate",
  convertToAdvanced: "Advanced editor",
  remove: "Remove",
  chipMenu: (fieldLabel) => `${fieldLabel} filter options`,
  filtersLabel: "Filters",
  filterLabel: (condition) => condition,
  readOnly: "Read only. These filters cannot be changed.",
  pathSeparator: " > ",
  valuePlaceholder: "enter text...",
  selectPlaceholder: "Select...",
  noValue: "no value",
  selectCondition: "Select condition",
  incomplete: "incomplete filter",
  branchAffordance: "opens a list",
  exclusiveHint: "cannot be combined with the other options",
  exclusiveAnnouncement: (label, cleared) =>
    cleared === 1
      ? `${label} selected. 1 other selection cleared.`
      : `${label} selected. ${cleared} other selections cleared.`,
  itemCount: (count) => `${count} items`,
  fieldsLabel: "Attributes",
  resultsAnnouncement: (count) =>
    count === 1 ? "1 result" : `${count} results`,
  actionsLabel: "Actions",
  stepAnnouncement: (step, label) => {
    if (step === "field") return `Choose an attribute. ${label}`
    if (step === "operator") return `Choose a condition for ${label}`
    return `Enter a value for ${label}`
  },
  countAnnouncement: (count) =>
    count === 1 ? "1 filter applied" : `${count} filters applied`,
  valueCount: (count) => `${count} selected`,
  valueDetail: (summary, values) => `${summary}: ${values.join(", ")}`,
  valueRange: (from, to) => `${from} to ${to}`,
  rangeFrom: (fieldLabel) => `${fieldLabel} from`,
  rangeTo: (fieldLabel) => `${fieldLabel} to`,
  rangeSeparator: "to",
  negated: (operatorLabel) => `not ${operatorLabel}`,
  issueOperator: "Choose a condition",
  issueValue: "Enter a value",
  issueRange: "Enter both ends of the range",
  issueRangeOrder: "The end of the range comes before its start",
  issueEmptyGroup: "This group has no conditions yet",
  // "Row", not "condition": an empty GROUP is counted here too and a group is
  // not a condition. Rule and group divs alike carry `data-slot="filter-row"`.
  issueSummary: (count) =>
    count === 1 ? "1 row needs attention" : `${count} rows need attention`,
}

/**
 * Shallow merge over the defaults, like the cascader's. A deep merge would leak
 * the default back into a replaced function-valued label for the arguments the
 * consumer did not think about.
 */
export function resolveFilterLabels(
  labels?: Partial<FilterLabels>
): FilterLabels {
  if (!labels) return DEFAULT_FILTER_LABELS
  return { ...DEFAULT_FILTER_LABELS, ...labels }
}

/**
 * The sentence for one issue. Takes the ISSUE, not just the reason: a field's
 * `validate` supplies its own words, so `custom` has nothing to look up.
 */
export function filterIssueLabel(
  issue: Pick<FilterIssue, "reason" | "message"> | FilterIssueReason,
  labels: FilterLabels
): string {
  const reason = typeof issue === "string" ? issue : issue.reason
  if (typeof issue !== "string" && issue.message) return issue.message
  if (reason === "missing-operator") return labels.issueOperator
  if (reason === "incomplete-range") return labels.issueRange
  if (reason === "reversed-range") return labels.issueRangeOrder
  if (reason === "empty-group") return labels.issueEmptyGroup
  return labels.issueValue
}

/** The search placeholder for a step's panel. */
export function stepPlaceholder(
  step: FilterDraftStep,
  labels: FilterLabels
): string {
  if (step === "field") return labels.searchFields
  if (step === "operator") return labels.searchOperators
  return labels.searchOptions
}
