"use client"

import * as React from "react"

import { cn } from "@/registry/bases/radix/lib/utils"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/bases/radix/ui/combobox"
import { Field } from "@/registry/bases/radix/ui/field"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type EmptyTeamOption = {
  type: "none"
  id: "no-team"
  label: string
  searchText: string
}

type TeamOption = {
  type: "team"
  id: string
  value: string
  label: string
  tone: "lime" | "sky" | "violet" | "amber" | "rose"
  searchText: string
}

type TeamSelectionItem = EmptyTeamOption | TeamOption

const noTeamOption: EmptyTeamOption = {
  type: "none",
  id: "no-team",
  label: "No team",
  searchText: "No team clear team remove team empty",
}

const teamOptions: TeamOption[] = [
  {
    type: "team",
    id: "testo-growth",
    value: "testo-growth",
    label: "Testo Growth",
    tone: "lime",
    searchText: "Testo Growth experiments lifecycle activation",
  },
  {
    type: "team",
    id: "atlas-platform",
    value: "atlas-platform",
    label: "Atlas Platform",
    tone: "sky",
    searchText: "Atlas Platform infrastructure systems",
  },
  {
    type: "team",
    id: "nova-studio",
    value: "nova-studio",
    label: "Nova Studio",
    tone: "violet",
    searchText: "Nova Studio design systems creative",
  },
  {
    type: "team",
    id: "pulse-support",
    value: "pulse-support",
    label: "Pulse Support",
    tone: "rose",
    searchText: "Pulse Support product health customer care",
  },
  {
    type: "team",
    id: "orbit-ops",
    value: "orbit-ops",
    label: "Orbit Ops",
    tone: "amber",
    searchText: "Orbit Ops operations dependencies releases",
  },
] as const

const teamSelectionOptions: TeamSelectionItem[] = [noTeamOption, ...teamOptions]

function EmptyTeamGlyph({ className }: { className?: string }) {
  return (
    <IconPlaceholder
      lucide="UsersIcon"
      tabler="IconUsers"
      hugeicons="UserGroupIcon"
      phosphor="UsersIcon"
      remixicon="RiTeamLine"
      className={cn("size-4 shrink-0", className)}
    />
  )
}

const teamToneClassName: Record<TeamOption["tone"], string> = {
  lime: "text-lime-600! [&_*]:text-lime-600!",
  sky: "text-sky-600! [&_*]:text-sky-600!",
  violet: "text-violet-600! [&_*]:text-violet-600!",
  amber: "text-amber-600! [&_*]:text-amber-600!",
  rose: "text-rose-600! [&_*]:text-rose-600!",
}

function TeamMark({ team }: { team: TeamOption }) {
  const className = cn("size-4 shrink-0", teamToneClassName[team.tone])

  switch (team.tone) {
    case "sky":
      return (
        <IconPlaceholder
          lucide="LayersIcon"
          tabler="IconStack2"
          hugeicons="Layers01Icon"
          phosphor="StackIcon"
          remixicon="RiStackLine"
          className={className}
        />
      )
    case "violet":
      return (
        <IconPlaceholder
          lucide="BriefcaseBusinessIcon"
          tabler="IconBriefcase"
          hugeicons="Briefcase01Icon"
          phosphor="BriefcaseIcon"
          remixicon="RiBriefcaseLine"
          className={className}
        />
      )
    case "amber":
      return (
        <IconPlaceholder
          lucide="GitBranchIcon"
          tabler="IconGitBranch"
          hugeicons="GitBranchIcon"
          phosphor="GitBranchIcon"
          remixicon="RiGitBranchLine"
          className={className}
        />
      )
    case "rose":
      return (
        <IconPlaceholder
          lucide="PackageIcon"
          tabler="IconPackage"
          hugeicons="Package01Icon"
          phosphor="PackageIcon"
          remixicon="RiBox3Line"
          className={className}
        />
      )
    case "lime":
    default:
      return (
        <IconPlaceholder
          lucide="SparklesIcon"
          tabler="IconSparkles"
          hugeicons="SparklesIcon"
          phosphor="SparkleIcon"
          remixicon="RiSparklingLine"
          className={className}
        />
      )
  }
}

function TeamTriggerLabel({
  value,
  placeholder,
}: {
  value: TeamSelectionItem | null
  placeholder: string
}) {
  if (!value) {
    return <span className="text-muted-foreground truncate">{placeholder}</span>
  }

  if (value.type === "none") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <EmptyTeamGlyph className="text-muted-foreground" />
        <span className="truncate">{value.label}</span>
      </span>
    )
  }

  return (
    <span className="flex min-w-0 items-center gap-2">
      <TeamMark team={value} />
      <span className="truncate">{value.label}</span>
    </span>
  )
}

function TeamOptionRow({ option }: { option: TeamSelectionItem }) {
  if (option.type === "none") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <EmptyTeamGlyph className="text-muted-foreground" />
        <span className="truncate">{option.label}</span>
      </span>
    )
  }

  return (
    <span className="flex min-w-0 items-center gap-2">
      <TeamMark team={option} />
      <span className="truncate">{option.label}</span>
    </span>
  )
}

export default function Pattern() {
  const [team, setTeam] = React.useState<TeamOption | null>(teamOptions[0])
  const selectedTeam = team ?? noTeamOption

  function handleTeamChange(nextTeam: TeamSelectionItem | null) {
    setTeam(nextTeam?.type === "team" ? nextTeam : null)
  }

  return (
    <Field className="max-w-xs">
      <Combobox
        items={teamSelectionOptions}
        value={selectedTeam}
        onValueChange={handleTeamChange}
        itemToStringValue={(item: TeamSelectionItem) => item.searchText}
        autoHighlight
      >
        <ComboboxTrigger
          render={
            <Button
              type="button"
              variant="outline"
              className="w-full justify-between font-normal"
            />
          }
        >
          <ComboboxValue placeholder="Select team">
            {(selectedTeam: TeamSelectionItem | null) => (
              <TeamTriggerLabel
                value={selectedTeam}
                placeholder="Select team"
              />
            )}
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput
            showTrigger={false}
            placeholder="Select team"
            className="mb-1"
          />
          <ComboboxEmpty>No teams found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem value={noTeamOption}>
              <TeamOptionRow option={noTeamOption} />
            </ComboboxItem>
            <ComboboxSeparator />

            {teamOptions.map((item) => (
              <ComboboxItem key={item.id} value={item}>
                <TeamOptionRow option={item} />
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
