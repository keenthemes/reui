"use client"

import { useMemo, useState } from "react"
import { Badge } from "@/registry-reui/bases/radix/reui/badge"
import { useDataGrid } from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import type { DataGridFeatures } from "@/registry-reui/bases/radix/reui/data-grid/data-grid"
import type { Column } from "@tanstack/react-table"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import { Input } from "@/registry/bases/radix/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/bases/radix/ui/popover"
import { Separator } from "@/registry/bases/radix/ui/separator"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

interface DataGridColumnFilterProps<TData extends object, TValue> {
  column?: Column<DataGridFeatures, TData, TValue>
  title?: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

function DataGridColumnFilter<TData extends object, TValue>({
  column,
  title,
  options,
}: DataGridColumnFilterProps<TData, TValue>) {
  const { i18n } = useDataGrid()
  const facets = column?.getFacetedUniqueValues()
  const filterValue = column?.getFilterValue()
  const selectedValues = new Set(
    Array.isArray(filterValue) ? (filterValue as string[]) : []
  )
  const [searchQuery, setSearchQuery] = useState("")

  const filteredOptions = useMemo(() => {
    if (!searchQuery) return options
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [options, searchQuery])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <IconPlaceholder
            lucide="CirclePlusIcon"
            tabler="IconCirclePlus"
            hugeicons="AddCircleIcon"
            phosphor="PlusCircleIcon"
            remixicon="RiAddCircleLine"
            className="size-4"
          />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge variant="secondary" className="px-1 font-normal lg:hidden">
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge variant="secondary" className="px-1 font-normal">
                    {i18n.labels.filterSelectedCount(selectedValues.size)}
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <div className="p-2">
          <Input
            placeholder={title}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8"
          />
        </div>
        <div className="max-h-[300px] overflow-y-auto">
          {filteredOptions.length === 0 ? (
            <div className="text-muted-foreground py-6 text-center text-sm">
              {i18n.labels.filterNoResults}
            </div>
          ) : (
            <div className="p-1">
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.has(option.value)
                const facetCount = facets?.get(option.value)
                const toggleOption = () => {
                  if (isSelected) {
                    selectedValues.delete(option.value)
                  } else {
                    selectedValues.add(option.value)
                  }
                  const filterValues = Array.from(selectedValues)
                  column?.setFilterValue(
                    filterValues.length ? filterValues : undefined
                  )
                }
                return (
                  <div
                    key={option.value}
                    role="button"
                    tabIndex={0}
                    aria-pressed={isSelected}
                    onClick={toggleOption}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        toggleOption()
                      }
                    }}
                    className={cn(
                      "style-vega:rounded-sm style-nova:rounded-md style-maia:rounded-xl style-lyra:rounded-none style-mira:rounded-md style-luma:rounded-2xl style-sera:rounded-none style-rhea:rounded-2xl relative flex cursor-pointer items-center gap-2 px-2 py-1.5 text-sm outline-hidden select-none",
                      "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    )}
                  >
                    <div
                      className={cn(
                        "border-primary style-vega:rounded-sm style-nova:rounded-sm style-maia:rounded-md style-lyra:rounded-none style-mira:rounded-sm style-luma:rounded-md style-sera:rounded-none style-rhea:rounded-md flex h-4 w-4 items-center justify-center border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <IconPlaceholder
                        lucide="CheckIcon"
                        tabler="IconCheck"
                        hugeicons="Tick02Icon"
                        phosphor="CheckIcon"
                        remixicon="RiCheckLine"
                        className="h-4 w-4"
                      />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground h-4 w-4" />
                    )}
                    <span>{option.label}</span>
                    {facetCount !== undefined && (
                      <span className="ms-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facetCount}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
          {selectedValues.size > 0 && (
            <>
              <div className="bg-border -mx-1 my-1 h-px" />
              <div className="p-1">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => column?.setFilterValue(undefined)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      column?.setFilterValue(undefined)
                    }
                  }}
                  className="hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground style-vega:rounded-sm style-nova:rounded-md style-maia:rounded-xl style-lyra:rounded-none style-mira:rounded-md style-luma:rounded-2xl style-sera:rounded-none style-rhea:rounded-2xl relative flex cursor-pointer items-center justify-center px-2 py-1.5 text-sm outline-hidden select-none"
                >
                  {i18n.labels.filterClear}
                </div>
              </div>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export { DataGridColumnFilter, type DataGridColumnFilterProps }
