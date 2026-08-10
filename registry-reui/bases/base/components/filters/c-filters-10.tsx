"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  createFilter,
  Filters,
  type Filter,
  type FilterFieldConfig,
  type FilterOption,
  type FilterOptionListRenderProps,
} from "@/registry-reui/bases/base/reui/filters"
import {
  defaultRangeExtractor,
  useVirtualizer,
  type Range,
} from "@tanstack/react-virtual"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

const ROW_HEIGHT = 32

// Consumer-owned virtualization wired through the primitive's `renderOptionList`
// slot. The Filters primitive ships no windowing dependency - you bring your own
// (here @tanstack/react-virtual) and stay bound to its selection/keyboard logic
// via `renderOption` and `highlightedIndex`.
function VirtualizedOptions({
  options,
  highlightedIndex,
  renderOption,
}: FilterOptionListRenderProps) {
  const [scrollEl, setScrollEl] = useState<HTMLDivElement | null>(null)

  // Keep the highlighted row mounted even when scrolled away, so the combobox's
  // aria-activedescendant never points at an unmounted node.
  const rangeExtractor = useCallback(
    (range: Range) => {
      const indices = new Set(defaultRangeExtractor(range))
      if (highlightedIndex >= 0 && highlightedIndex < options.length) {
        indices.add(highlightedIndex)
      }
      return Array.from(indices).sort((a, b) => a - b)
    },
    [highlightedIndex, options.length]
  )

  const virtualizer = useVirtualizer({
    count: options.length,
    getScrollElement: () => scrollEl,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
    getItemKey: (index) => String(options[index].value),
    rangeExtractor,
  })

  useEffect(() => {
    if (highlightedIndex >= 0 && highlightedIndex < options.length) {
      virtualizer.scrollToIndex(highlightedIndex, { align: "auto" })
    }
  }, [highlightedIndex, options.length, virtualizer])

  return (
    <div
      ref={setScrollEl}
      className="max-h-[300px] overflow-y-auto overscroll-contain px-1"
    >
      <div
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            data-index={row.index}
            ref={virtualizer.measureElement}
            className="absolute top-0 left-0 w-full"
            style={{ transform: `translateY(${row.start}px)` }}
          >
            {renderOption(options[row.index], row.index)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Pattern() {
  const products = useMemo<FilterOption[]>(
    () =>
      Array.from({ length: 5000 }, (_, index) => {
        const id = index + 1
        return {
          value: `sku-${id}`,
          label: `Product ${String(id).padStart(4, "0")}`,
        }
      }),
    []
  )

  const fields: FilterFieldConfig[] = useMemo(
    () => [
      {
        key: "product",
        label: "Product",
        icon: (
          <IconPlaceholder
            lucide="PackageIcon"
            tabler="IconPackage"
            hugeicons="PackageIcon"
            phosphor="PackageIcon"
            remixicon="RiBox3Line"
            className="size-3.5"
          />
        ),
        type: "multiselect",
        options: products,
        // Bring your own windowing for large lists.
        renderOptionList: (props) => <VirtualizedOptions {...props} />,
      },
    ],
    [products]
  )

  const [filters, setFilters] = useState<Filter[]>([
    createFilter("product", "is_any_of", ["sku-42", "sku-1024"]),
  ])

  const handleFiltersChange = useCallback((next: Filter[]) => {
    setFilters(next)
  }, [])

  return (
    <div className="flex grow content-start items-start self-start">
      <Filters
        filters={filters}
        fields={fields}
        onChange={handleFiltersChange}
      />
    </div>
  )
}
