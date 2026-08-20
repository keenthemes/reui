import type {
  FilterDraft,
  FilterDraftStep,
  FilterOperatorArity,
} from "@/registry-reui/bases/base/reui/filters/filters-types"

/**
 * The filter builder's step machine. Pure: no React, Base UI or shadcn import,
 * so the whole create and amend flow is a table test in node with no DOM.
 *
 * Arity arrives ON THE ACTION, which keeps the reducer free of the schema index
 * while it still owns the branch that skips the value step. The shipped chrome
 * drives `openCreate`, browse, query, `selectField` and `close`; `openAmend`,
 * `selectOperator`, `setValue`, `commit`, `back` and `goto` are published
 * surface for a consumer composing their own panel.
 */
export type FilterDraftAction<V = unknown> =
  | { type: "openCreate"; cascaderPath?: string[] }
  | {
      type: "openAmend"
      ruleId: string
      step: FilterDraftStep
      path: string[]
      operator: string | null
      value: V | undefined
      cascaderPath?: string[]
    }
  | { type: "close" }
  /** Where the user is BROWSING, not the selected field's path. */
  | { type: "setCascaderPath"; path: string[] }
  | { type: "setQuery"; query: string }
  | {
      type: "selectField"
      path: string[]
      defaultOperator: string | null
    }
  | {
      type: "selectOperator"
      operator: string
      arity: FilterOperatorArity
      /** Carried across the operator change, already coerced. */
      value: V | undefined
    }
  | { type: "setValue"; value: V | undefined }
  | { type: "commit"; value?: V }
  | { type: "back" }
  | { type: "goto"; step: FilterDraftStep }

export function createFilterDraft<V = unknown>(
  cascaderPath: string[] = []
): FilterDraft<V> {
  return {
    step: "field",
    status: "editing",
    ruleId: null,
    path: [],
    cascaderPath,
    operator: null,
    value: undefined,
    query: "",
  }
}

/** null means Back closes the builder rather than stepping back. */
function previousStep(step: FilterDraftStep): FilterDraftStep | null {
  if (step === "value") return "operator"
  if (step === "operator") return "field"
  return null
}

/**
 * `null` is the closed state, not a separate boolean: `{ open, draft }` would
 * make "open with no draft" and "closed but still holding one" representable.
 */
export function filterDraftReducer<V = unknown>(
  state: FilterDraft<V> | null,
  action: FilterDraftAction<V>
): FilterDraft<V> | null {
  switch (action.type) {
    case "openCreate":
      return createFilterDraft<V>(action.cascaderPath ?? [])

    case "openAmend":
      return {
        step: action.step,
        status: "editing",
        ruleId: action.ruleId,
        path: action.path,
        // Defaults the picker to the field's own level, so amend opens beside
        // its siblings, not at the root. Callers may override.
        cascaderPath: action.cascaderPath ?? action.path.slice(0, -1),
        operator: action.operator,
        value: action.value,
        query: "",
      }

    case "close":
      return null

    case "setCascaderPath":
      if (!state) return state
      if (state.cascaderPath === action.path) return state
      return { ...state, cascaderPath: action.path }

    case "setQuery":
      if (!state) return state
      if (state.query === action.query) return state
      return { ...state, query: action.query }

    case "selectField": {
      if (!state) return state
      // Choosing a field COMMITS at once; the condition is picked on the chip,
      // so the popover never holds a second and third step to walk.
      return {
        ...state,
        path: action.path,
        operator: action.defaultOperator,
        status: "ready",
        // A field change invalidates the value: "Active" means nothing once
        // the field becomes "Created at".
        value: undefined,
        step: "operator",
        query: "",
      }
    }

    case "selectOperator": {
      if (!state) return state
      // arity "none" is the whole filter; a value step would be an empty panel.
      if (action.arity === "none") {
        return {
          ...state,
          operator: action.operator,
          value: undefined,
          status: "ready",
          query: "",
        }
      }
      return {
        ...state,
        operator: action.operator,
        value: action.value,
        step: "value",
        status: "editing",
        query: "",
      }
    }

    case "setValue":
      if (!state) return state
      return { ...state, value: action.value }

    case "commit":
      if (!state) return state
      return {
        ...state,
        value: action.value === undefined ? state.value : action.value,
        status: "ready",
      }

    case "back": {
      if (!state) return state
      const step = previousStep(state.step)
      if (!step) return null
      return { ...state, step, status: "editing", query: "" }
    }

    case "goto":
      if (!state) return state
      if (state.step === action.step) return state
      return { ...state, step: action.step, status: "editing", query: "" }

    default:
      return state
  }
}

/**
 * A path is enough. Not an operator: the flow commits when the field is picked,
 * so `operator: ""` is a legitimate committed state. Not a value either, since
 * `arity: "none"` has none and an editor may commit `undefined` to clear.
 */
export function isFilterDraftCommittable<V>(
  draft: FilterDraft<V> | null
): draft is FilterDraft<V> {
  return Boolean(draft && draft.path.length > 0)
}
