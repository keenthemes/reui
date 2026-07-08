"use client"

import * as React from "react"

import { cn } from "@/registry/bases/radix/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/radix/ui/avatar"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/bases/radix/ui/combobox"
import { Field } from "@/registry/bases/radix/ui/field"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type NoLeadOption = {
  type: "none"
  value: "none"
  label: "No lead"
}

type TeamMember = {
  type: "member"
  id: string
  value: string
  label: string
  avatar: string
  initials: string
  isCurrentUser?: boolean
}

type LeadOption = NoLeadOption | TeamMember

const noLeadOption: NoLeadOption = {
  type: "none",
  value: "none",
  label: "No lead",
}

const teamMembers: TeamMember[] = [
  {
    type: "member",
    id: "member-1",
    value: "shuhrat-saipov",
    label: "Shuhrat Saipov",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
    initials: "SS",
    isCurrentUser: true,
  },
  {
    type: "member",
    id: "member-2",
    value: "nadia-karimova",
    label: "Nadia Karimova",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    initials: "NK",
  },
  {
    type: "member",
    id: "member-3",
    value: "bekzod-rakhimov",
    label: "Bekzod Rakhimov",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&dpr=2&q=80",
    initials: "BR",
  },
  {
    type: "member",
    id: "member-4",
    value: "lina-bauer",
    label: "Lina Bauer",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&dpr=2&q=80",
    initials: "LB",
  },
  {
    type: "member",
    id: "member-5",
    value: "omar-haddad",
    label: "Omar Haddad",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=96&h=96&dpr=2&q=80",
    initials: "OH",
  },
  {
    type: "member",
    id: "member-6",
    value: "priya-nand",
    label: "Priya Nand",
    avatar:
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=96&h=96&dpr=2&q=80",
    initials: "PN",
  },
  {
    type: "member",
    id: "member-7",
    value: "kenji-watan",
    label: "Kenji Watan",
    avatar:
      "https://images.unsplash.com/photo-1504257432389-52343af06ae3?w=96&h=96&dpr=2&q=80",
    initials: "KW",
  },
  {
    type: "member",
    id: "member-8",
    value: "ava-sinclair",
    label: "Ava Sinclair",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&dpr=2&q=80",
    initials: "AS",
  },
  {
    type: "member",
    id: "member-9",
    value: "nia-okafor",
    label: "Nia Okafor",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=96&h=96&dpr=2&q=80",
    initials: "NO",
  },
  {
    type: "member",
    id: "member-10",
    value: "matteo-sosa",
    label: "Matteo Sosa",
    avatar:
      "https://images.unsplash.com/photo-1506795660185-2f0c6a1c7f6c?w=96&h=96&dpr=2&q=80",
    initials: "MS",
  },
  {
    type: "member",
    id: "member-11",
    value: "salma-rahman",
    label: "Salma Rahman",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=96&h=96&dpr=2&q=80",
    initials: "SR",
  },
  {
    type: "member",
    id: "member-12",
    value: "jonas-meyer",
    label: "Jonas Meyer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
    initials: "JM",
  },
]

const leadOptions: LeadOption[] = [noLeadOption, ...teamMembers]

function UserGlyph({ className }: { className?: string }) {
  return (
    <IconPlaceholder
      lucide="UserIcon"
      tabler="IconUser"
      hugeicons="UserIcon"
      phosphor="UserIcon"
      remixicon="RiUserLine"
      className={cn("size-4 shrink-0", className)}
    />
  )
}

function LeadTriggerLabel({ option }: { option: LeadOption }) {
  if (option.type === "none") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <UserGlyph className="text-muted-foreground" />
        <span className="truncate">{option.label}</span>
      </span>
    )
  }

  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar className="size-5">
        <AvatarImage src={option.avatar} alt={option.label} />
        <AvatarFallback className="text-[9px]">
          {option.initials}
        </AvatarFallback>
      </Avatar>
      <span className="truncate">{option.label}</span>
    </span>
  )
}

function LeadListRow({ option }: { option: LeadOption }) {
  if (option.type === "none") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <UserGlyph className="text-muted-foreground" />
        <span className="truncate">{option.label}</span>
      </span>
    )
  }

  return (
    <Item size="xs" className="p-0">
      <ItemMedia>
        <Avatar className="size-5">
          <AvatarImage src={option.avatar} alt={option.label} />
          <AvatarFallback className="text-[9px]">
            {option.initials}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="gap-1 whitespace-nowrap">
          <span>{option.label}</span>
          {option.isCurrentUser ? (
            <span className="text-muted-foreground font-normal">(You)</span>
          ) : null}
        </ItemTitle>
      </ItemContent>
    </Item>
  )
}

export default function Pattern() {
  const [lead, setLead] = React.useState<LeadOption | null>(noLeadOption)

  return (
    <Field className="max-w-xs">
      <Combobox
        items={leadOptions}
        value={lead}
        onValueChange={setLead}
        itemToStringValue={(item: LeadOption) => item.label}
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
          <ComboboxValue placeholder="No lead">
            {(selectedLead: LeadOption | null) =>
              selectedLead ? (
                <LeadTriggerLabel option={selectedLead} />
              ) : (
                <span className="text-muted-foreground">No lead</span>
              )
            }
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput
            showTrigger={false}
            placeholder="Select lead"
            className="mb-1"
          />
          <ComboboxEmpty>No team members found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem value={noLeadOption}>
              <LeadListRow option={noLeadOption} />
            </ComboboxItem>

            <ComboboxGroup items={teamMembers}>
              <ComboboxLabel>Team members</ComboboxLabel>
              <ComboboxCollection>
                {(member: TeamMember) => (
                  <ComboboxItem key={member.id} value={member}>
                    <LeadListRow option={member} />
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}
