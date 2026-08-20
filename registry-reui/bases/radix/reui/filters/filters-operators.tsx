import type {
  FilterField,
  FilterOperator,
  FilterValueType,
} from "@/registry-reui/bases/radix/reui/filters/filters-types"

/**
 * Every operator label, keyed by value. Split from `FilterLabels`: operator
 * wording is reworded per domain, chrome copy is translated once per app.
 */
export type FilterOperatorLabels = Record<string, string>

export const DEFAULT_FILTER_OPERATOR_LABELS: FilterOperatorLabels = {
  contains: "contains",
  not_contains: "does not contain",
  starts_with: "starts with",
  ends_with: "ends with",
  is: "is",
  is_not: "is not",
  is_any_of: "is any of",
  is_none_of: "is none of",
  has_any_of: "has any of",
  has_all_of: "has all of",
  has_none_of: "has none of",
  eq: "equals",
  neq: "does not equal",
  gt: "is greater than",
  gte: "is greater than or equal to",
  lt: "is less than",
  lte: "is less than or equal to",
  between: "is between",
  not_between: "is not between",
  is_before: "is before",
  is_after: "is after",
  is_on_or_before: "is on or before",
  is_on_or_after: "is on or after",
  empty: "is empty",
  not_empty: "is not empty",
}

/**
 * Operator catalog per value type: value, arity, inverse, labels resolved at
 * build time so translating one operator never restates the catalog. `arity`
 * of "none" drops the chip's value segment and the wizard's value step, in a
 * consumer's own `operators` array as much as in this catalog.
 */
const CATALOG: Record<
  FilterValueType,
  { value: string; arity?: FilterOperator["arity"]; inverse?: string }[]
> = {
  text: [
    { value: "contains", inverse: "not_contains" },
    { value: "not_contains", inverse: "contains" },
    { value: "starts_with" },
    { value: "ends_with" },
    { value: "is", inverse: "is_not" },
    { value: "is_not", inverse: "is" },
    { value: "empty", arity: "none", inverse: "not_empty" },
    { value: "not_empty", arity: "none", inverse: "empty" },
  ],
  number: [
    { value: "eq", inverse: "neq" },
    { value: "neq", inverse: "eq" },
    { value: "gt", inverse: "lte" },
    { value: "gte", inverse: "lt" },
    { value: "lt", inverse: "gte" },
    { value: "lte", inverse: "gt" },
    { value: "between", arity: "range", inverse: "not_between" },
    { value: "not_between", arity: "range", inverse: "between" },
    { value: "empty", arity: "none", inverse: "not_empty" },
    { value: "not_empty", arity: "none", inverse: "empty" },
  ],
  range: [
    { value: "between", arity: "range", inverse: "not_between" },
    { value: "not_between", arity: "range", inverse: "between" },
    { value: "empty", arity: "none", inverse: "not_empty" },
    { value: "not_empty", arity: "none", inverse: "empty" },
  ],
  select: [
    { value: "is", inverse: "is_not" },
    { value: "is_not", inverse: "is" },
    { value: "is_any_of", arity: "many", inverse: "is_none_of" },
    { value: "is_none_of", arity: "many", inverse: "is_any_of" },
    { value: "empty", arity: "none", inverse: "not_empty" },
    { value: "not_empty", arity: "none", inverse: "empty" },
  ],
  multiselect: [
    { value: "has_any_of", arity: "many", inverse: "has_none_of" },
    { value: "has_all_of", arity: "many" },
    { value: "has_none_of", arity: "many", inverse: "has_any_of" },
    { value: "empty", arity: "none", inverse: "not_empty" },
    { value: "not_empty", arity: "none", inverse: "empty" },
  ],
  boolean: [
    { value: "is", inverse: "is_not" },
    { value: "is_not", inverse: "is" },
    { value: "empty", arity: "none", inverse: "not_empty" },
    { value: "not_empty", arity: "none", inverse: "empty" },
  ],
}

export const DEFAULT_FILTER_VALUE_TYPE: FilterValueType = "text"

/**
 * Builds the operator catalog for one set of labels. Callers memoize on the
 * label object: the old primitive built its equivalent inside
 * `getOperatorsForField`, keyed on a `values` array that was fresh after every
 * filter update, so every miss reallocated four arrays of 27 objects each.
 */
export function createFilterOperators(
  labels: FilterOperatorLabels
): Record<FilterValueType, FilterOperator[]> {
  const built = {} as Record<FilterValueType, FilterOperator[]>
  for (const type of Object.keys(CATALOG) as FilterValueType[]) {
    built[type] = CATALOG[type].map((entry) => ({
      value: entry.value,
      label: labels[entry.value] ?? entry.value,
      arity: entry.arity ?? "one",
      inverse: entry.inverse,
    }))
  }
  return built
}

export const DEFAULT_FILTER_OPERATORS: Record<
  FilterValueType,
  FilterOperator[]
> = createFilterOperators(DEFAULT_FILTER_OPERATOR_LABELS)

/**
 * The operators for a field: its own `operators` wins, array or function,
 * otherwise the catalog entry for its `type`. No implicit select to multiselect
 * promotion by selection count: that changed the list as the user picked.
 */
export function resolveFilterOperators<V, O>(
  field: FilterField<V, O>,
  catalog: Record<FilterValueType, FilterOperator[]> = DEFAULT_FILTER_OPERATORS
): FilterOperator[] {
  if (typeof field.operators === "function") return field.operators(field)
  if (field.operators) return field.operators
  return catalog[field.type ?? DEFAULT_FILTER_VALUE_TYPE] ?? catalog.text
}

export function visibleFilterOperators(
  operators: readonly FilterOperator[]
): FilterOperator[] {
  return operators.filter((operator) => !operator.hidden)
}

export function getFilterOperator(
  operators: readonly FilterOperator[],
  value: string | null | undefined
): FilterOperator | undefined {
  if (!value) return undefined
  return operators.find((operator) => operator.value === value)
}

export function getFilterArity(
  operator: FilterOperator | undefined
): FilterOperator["arity"] {
  return operator?.arity ?? "one"
}

export function operatorTakesValue(
  operator: FilterOperator | undefined
): boolean {
  return getFilterArity(operator) !== "none"
}

/**
 * The operator a field starts with: `defaultOperator` when it names one the
 * field offers, otherwise the first visible operator. Falling back rather than
 * trusting the schema keeps the rule out of a state its own list cannot show.
 */
export function getDefaultFilterOperator<V, O>(
  field: FilterField<V, O>,
  operators: readonly FilterOperator[]
): string | null {
  if (field.defaultOperator) {
    const named = getFilterOperator(operators, field.defaultOperator)
    if (named) return named.value
  }
  const visible = visibleFilterOperators(operators)
  return visible[0]?.value ?? operators[0]?.value ?? null
}

/**
 * Negating a rule: swap to the declared `inverse` so the chip reads "does not
 * contain", else toggle `negated` so Negate still works without an inverse.
 */
export function negateFilterOperator(
  operator: FilterOperator | undefined,
  operators: readonly FilterOperator[],
  negated: boolean | undefined
): { operator: string | null; negated: boolean } {
  if (operator?.inverse) {
    const inverse = getFilterOperator(operators, operator.inverse)
    if (inverse) return { operator: inverse.value, negated: Boolean(negated) }
  }
  return { operator: operator?.value ?? null, negated: !negated }
}

/**
 * Reshapes a value when arity changes: widening "is" to "is any of" keeps what
 * the user picked, narrowing keeps the first of them, `"none"` always drops it.
 */
export function coerceFilterValue(
  value: unknown,
  from: FilterOperator | undefined,
  to: FilterOperator | undefined
): unknown {
  const nextArity = getFilterArity(to)
  if (nextArity === "none") return undefined
  if (value === undefined || value === null) return value

  const previousArity = getFilterArity(from)
  if (previousArity === nextArity) return value

  const asArray = Array.isArray(value) ? value : [value]

  if (nextArity === "many") return asArray
  if (nextArity === "one") return asArray[0]
  if (nextArity === "range") {
    return [asArray[0], asArray[1]] as [unknown, unknown]
  }
  return value
}
