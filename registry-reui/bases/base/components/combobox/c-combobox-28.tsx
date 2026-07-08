"use client"

import * as React from "react"

import { cn } from "@/registry/bases/base/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/bases/base/ui/avatar"
import { Button } from "@/registry/bases/base/ui/button"
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
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
} from "@/registry/bases/base/ui/combobox"
import { Field } from "@/registry/bases/base/ui/field"
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/registry/bases/base/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

type NoAssigneeOption = {
  type: "none"
  id: "no-assignee"
  value: "none"
  label: string
  searchText: string
}

type TeamMember = {
  type: "member"
  id: string
  value: string
  label: string
  avatar: string
  initials: string
  isCurrentUser?: boolean
  searchText: string
}

type InviteOption = {
  type: "invite"
  id: "invite-user"
  value: "invite"
  label: string
  searchText: string
}

type AssigneeSelectionItem = NoAssigneeOption | TeamMember | InviteOption

const noAssigneeOption: NoAssigneeOption = {
  type: "none",
  id: "no-assignee",
  value: "none",
  label: "No assignee",
  searchText: "No assignee unassigned clear assignee remove assignee",
}

const teamMembers: TeamMember[] = [
  {
    type: "member",
    id: "member-1",
    value: "alex-morgan",
    label: "Alex Morgan",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&dpr=2&q=80",
    initials: "AM",
    isCurrentUser: true,
    searchText: "Alex Morgan current user owner",
  },
  {
    type: "member",
    id: "member-2",
    value: "emma-carter",
    label: "Emma Carter",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&dpr=2&q=80",
    initials: "EC",
    searchText: "Emma Carter product design",
  },
  {
    type: "member",
    id: "member-3",
    value: "ryan-mitchell",
    label: "Ryan Mitchell",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&h=96&dpr=2&q=80",
    initials: "RM",
    searchText: "Ryan Mitchell engineering backend",
  },
  {
    type: "member",
    id: "member-4",
    value: "olivia-bennett",
    label: "Olivia Bennett",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=96&h=96&dpr=2&q=80",
    initials: "OB",
    searchText: "Olivia Bennett growth marketing",
  },
  {
    type: "member",
    id: "member-5",
    value: "ethan-brooks",
    label: "Ethan Brooks",
    avatar:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?w=96&h=96&dpr=2&q=80",
    initials: "EB",
    searchText: "Ethan Brooks operations",
  },
] as const

const inviteOption: InviteOption = {
  type: "invite",
  id: "invite-user",
  value: "invite",
  label: "Invite...",
  searchText: "Invite new user teammate member collaborator",
}

const assigneeOptions: AssigneeSelectionItem[] = [
  noAssigneeOption,
  ...teamMembers,
  inviteOption,
]

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

function PaperPlaneIcon({ className }: { className?: string }) {
  return (
    <IconPlaceholder
      lucide="SendIcon"
      tabler="IconSend"
      hugeicons="SentIcon"
      phosphor="PaperPlaneTiltIcon"
      remixicon="RiSendInsLine"
      className={cn("size-4 shrink-0", className)}
    />
  )
}

function AssigneeTriggerLabel({
  option,
  placeholder,
}: {
  option: NoAssigneeOption | TeamMember | null
  placeholder: string
}) {
  if (!option) {
    return <span className="text-muted-foreground truncate">{placeholder}</span>
  }

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

function AssigneeListRow({
  option,
}: {
  option: NoAssigneeOption | TeamMember | InviteOption
}) {
  if (option.type === "none") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <UserGlyph className="text-muted-foreground" />
        <span className="truncate">{option.label}</span>
      </span>
    )
  }

  if (option.type === "invite") {
    return (
      <span className="flex min-w-0 items-center gap-2">
        <PaperPlaneIcon className="text-muted-foreground" />
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
  const [assignee, setAssignee] = React.useState<TeamMember | null>(null)
  const selectedAssignee = assignee ?? noAssigneeOption

  function handleAssigneeChange(nextAssignee: AssigneeSelectionItem | null) {
    if (!nextAssignee || nextAssignee.type === "invite") {
      return
    }

    setAssignee(nextAssignee.type === "member" ? nextAssignee : null)
  }

  return (
    <Field className="max-w-xs">
      <Combobox
        items={assigneeOptions}
        value={selectedAssignee}
        onValueChange={handleAssigneeChange}
        itemToStringValue={(item: AssigneeSelectionItem) => item.searchText}
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
          <ComboboxValue placeholder="No assignee">
            {(selectedAssignee: NoAssigneeOption | TeamMember | null) => (
              <AssigneeTriggerLabel
                option={selectedAssignee}
                placeholder="No assignee"
              />
            )}
          </ComboboxValue>
        </ComboboxTrigger>

        <ComboboxContent className="max-w-(--anchor-width) min-w-(--anchor-width)">
          <ComboboxInput
            showTrigger={false}
            placeholder="Select assignee"
            className="mb-1"
          />
          <ComboboxEmpty>No assignees found.</ComboboxEmpty>
          <ComboboxList>
            <ComboboxItem value={noAssigneeOption}>
              <AssigneeListRow option={noAssigneeOption} />
            </ComboboxItem>
            <ComboboxSeparator />

            <ComboboxGroup items={teamMembers}>
              <ComboboxLabel>Team members</ComboboxLabel>
              <ComboboxCollection>
                {(member: TeamMember) => (
                  <ComboboxItem key={member.id} value={member}>
                    <AssigneeListRow option={member} />
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>

            <ComboboxSeparator />

            <ComboboxGroup items={[inviteOption]}>
              <ComboboxLabel>New user</ComboboxLabel>
              <ComboboxCollection>
                {(item: InviteOption) => (
                  <ComboboxItem key={item.id} value={item}>
                    <AssigneeListRow option={item} />
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
