"use client"

import { useState } from "react"
import {
  Cascader,
  CascaderContent,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
  CascaderTrigger,
  useCascaderSelection,
} from "@/registry-reui/bases/base/reui/cascader/cascader"
import { CascaderItems } from "@/registry-reui/bases/base/reui/cascader/cascader-item"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
  CascaderValue,
} from "@/registry-reui/bases/base/reui/cascader/cascader-nav"
import type { CascaderNode } from "@/registry-reui/bases/base/reui/cascader/cascader-types"

import { Discord } from "@/components/ui/svgs/discord"
import { Dropbox } from "@/components/ui/svgs/dropbox"
import { GithubDark } from "@/components/ui/svgs/githubDark"
import { GithubLight } from "@/components/ui/svgs/githubLight"
import { GoogleDrive } from "@/components/ui/svgs/googleDrive"
import { Loom } from "@/components/ui/svgs/loom"
import { Slack } from "@/components/ui/svgs/slack"
import { Stripe } from "@/components/ui/svgs/stripe"
import { Zoom } from "@/components/ui/svgs/zoom"
import { Button } from "@/registry/bases/base/ui/button"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/registry/bases/base/ui/toggle-group"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                Brand marks                                 */
/* -------------------------------------------------------------------------- */

/**
 * `node.icon` is a ReactNode, so a product logo drops straight in where an
 * IconPlaceholder would otherwise go. The marks are full colour and carry their
 * own fills, so they survive both themes untouched - except GitHub, whose mark
 * is a single flat shape and therefore ships as two files. Rendering both and
 * letting `dark:` pick decides at paint time rather than at render time, so it
 * still works when the theme flips without React re-rendering.
 */
const slackLogo = <Slack className="size-4" aria-hidden="true" />
const githubLogo = (
  <>
    <GithubLight className="size-4 dark:hidden" aria-hidden="true" />
    <GithubDark className="hidden size-4 dark:block" aria-hidden="true" />
  </>
)
const driveLogo = <GoogleDrive className="size-4" aria-hidden="true" />
const dropboxLogo = <Dropbox className="size-4" aria-hidden="true" />
const stripeLogo = <Stripe className="size-4" aria-hidden="true" />
const zoomLogo = <Zoom className="size-4" aria-hidden="true" />
const loomLogo = <Loom className="size-4" aria-hidden="true" />
const discordLogo = <Discord className="size-4" aria-hidden="true" />

/* -------------------------------------------------------------------------- */
/*                              Capability icons                              */
/* -------------------------------------------------------------------------- */

/**
 * The middle level is a KIND of thing rather than a product, so it keeps
 * generic icons. That contrast is the point: logos say which product a row
 * belongs to, icons say what the row is.
 */
const channelIcon = (
  <IconPlaceholder
    lucide="HashIcon"
    tabler="IconHash"
    hugeicons="HashtagIcon"
    phosphor="HashIcon"
    remixicon="RiHashtag"
    className="size-4"
  />
)
const messageIcon = (
  <IconPlaceholder
    lucide="MessageSquareIcon"
    tabler="IconMessageDots"
    hugeicons="Message02Icon"
    phosphor="ChatIcon"
    remixicon="RiChat3Line"
    className="size-4"
  />
)
const folderIcon = (
  <IconPlaceholder
    lucide="FolderIcon"
    tabler="IconFolder"
    hugeicons="FolderIcon"
    phosphor="FolderIcon"
    remixicon="RiFolderLine"
    className="size-4"
  />
)
const pullRequestIcon = (
  <IconPlaceholder
    lucide="GitPullRequestArrowIcon"
    tabler="IconGitPullRequest"
    hugeicons="GitPullRequestIcon"
    phosphor="GitPullRequest"
    remixicon="RiGitPullRequestLine"
    className="size-4"
  />
)
const issueIcon = (
  <IconPlaceholder
    lucide="BugIcon"
    tabler="IconBug"
    hugeicons="Bug01Icon"
    phosphor="BugIcon"
    remixicon="RiBugLine"
    className="size-4"
  />
)
const documentIcon = (
  <IconPlaceholder
    lucide="FileTextIcon"
    tabler="IconFileText"
    hugeicons="File01Icon"
    phosphor="FileTextIcon"
    remixicon="RiFileTextLine"
    className="size-4"
  />
)
const paymentIcon = (
  <IconPlaceholder
    lucide="CreditCardIcon"
    tabler="IconCreditCard"
    hugeicons="CreditCardIcon"
    phosphor="CreditCardIcon"
    remixicon="RiBankCardLine"
    className="size-4"
  />
)
const customerIcon = (
  <IconPlaceholder
    lucide="UsersIcon"
    tabler="IconUsers"
    hugeicons="UserGroupIcon"
    phosphor="UsersIcon"
    remixicon="RiGroupLine"
    className="size-4"
  />
)
const invoiceIcon = (
  <IconPlaceholder
    lucide="ReceiptIcon"
    tabler="IconReceipt"
    hugeicons="ReceiptDollarIcon"
    phosphor="ReceiptIcon"
    remixicon="RiReceiptLine"
    className="size-4"
  />
)
const meetingIcon = (
  <IconPlaceholder
    lucide="CalendarIcon"
    tabler="IconCalendar"
    hugeicons="Calendar03Icon"
    phosphor="CalendarIcon"
    remixicon="RiCalendarLine"
    className="size-4"
  />
)
const videoIcon = (
  <IconPlaceholder
    lucide="VideoIcon"
    tabler="IconVideo"
    hugeicons="Video02Icon"
    phosphor="VideoCameraIcon"
    remixicon="RiVideoOnLine"
    className="size-4"
  />
)

/**
 * Connected products, the areas inside them, and one resource to act on.
 *
 * The leaf carries the product logo again rather than a third icon, because the
 * trigger only ever renders the LEAF's icon - so whichever resource is picked,
 * the closed control still says which product it came from.
 */
const sources: CascaderNode[] = [
  {
    value: "slack",
    label: "Slack",
    icon: slackLogo,
    children: [
      {
        value: "slack.channels",
        label: "Channels",
        icon: channelIcon,
        children: [
          {
            value: "slack.channels.product-launch",
            label: "#product-launch",
            icon: slackLogo,
          },
          {
            value: "slack.channels.design-review",
            label: "#design-review",
            icon: slackLogo,
          },
          {
            value: "slack.channels.incidents",
            label: "#incidents",
            icon: slackLogo,
          },
        ],
      },
      {
        value: "slack.messages",
        label: "Direct messages",
        icon: messageIcon,
        children: [
          {
            value: "slack.messages.mentions",
            label: "Mentions",
            icon: slackLogo,
          },
          {
            value: "slack.messages.saved",
            label: "Saved items",
            icon: slackLogo,
          },
        ],
      },
    ],
  },
  {
    value: "github",
    label: "GitHub",
    icon: githubLogo,
    children: [
      {
        value: "github.repositories",
        label: "Repositories",
        icon: folderIcon,
        children: [
          {
            value: "github.repositories.web",
            label: "reui/web",
            icon: githubLogo,
          },
          {
            value: "github.repositories.registry",
            label: "reui/registry",
            icon: githubLogo,
          },
        ],
      },
      {
        value: "github.pull-requests",
        label: "Pull requests",
        icon: pullRequestIcon,
        children: [
          {
            value: "github.pull-requests.review",
            label: "Awaiting review",
            icon: githubLogo,
          },
          {
            value: "github.pull-requests.merge",
            label: "Ready to merge",
            icon: githubLogo,
          },
        ],
      },
      {
        value: "github.issues",
        label: "Issues",
        icon: issueIcon,
        children: [
          {
            value: "github.issues.assigned",
            label: "Assigned to me",
            icon: githubLogo,
          },
          {
            value: "github.issues.triage",
            label: "Triage backlog",
            icon: githubLogo,
          },
        ],
      },
    ],
  },
  {
    value: "drive",
    label: "Google Drive",
    icon: driveLogo,
    children: [
      {
        value: "drive.shared",
        label: "Shared drives",
        icon: folderIcon,
        children: [
          { value: "drive.shared.design", label: "Design", icon: driveLogo },
          {
            value: "drive.shared.marketing",
            label: "Marketing",
            icon: driveLogo,
          },
        ],
      },
      {
        value: "drive.documents",
        label: "Documents",
        icon: documentIcon,
        children: [
          {
            value: "drive.documents.checklist",
            label: "Launch checklist",
            icon: driveLogo,
          },
          {
            value: "drive.documents.guidelines",
            label: "Brand guidelines",
            icon: driveLogo,
          },
        ],
      },
    ],
  },
  {
    value: "dropbox",
    label: "Dropbox",
    icon: dropboxLogo,
    children: [
      {
        value: "dropbox.folders",
        label: "Team folders",
        icon: folderIcon,
        children: [
          {
            value: "dropbox.folders.contracts",
            label: "Contracts",
            icon: dropboxLogo,
          },
          {
            value: "dropbox.folders.photography",
            label: "Photography",
            icon: dropboxLogo,
          },
        ],
      },
      {
        value: "dropbox.paper",
        label: "Paper docs",
        icon: documentIcon,
        children: [
          {
            value: "dropbox.paper.weekly",
            label: "Weekly notes",
            icon: dropboxLogo,
          },
          {
            value: "dropbox.paper.retro",
            label: "Retro board",
            icon: dropboxLogo,
          },
        ],
      },
    ],
  },
  {
    value: "stripe",
    label: "Stripe",
    icon: stripeLogo,
    children: [
      {
        value: "stripe.payments",
        label: "Payments",
        icon: paymentIcon,
        children: [
          {
            value: "stripe.payments.charges",
            label: "Recent charges",
            icon: stripeLogo,
          },
          {
            value: "stripe.payments.disputes",
            label: "Disputes",
            icon: stripeLogo,
          },
        ],
      },
      {
        value: "stripe.customers",
        label: "Customers",
        icon: customerIcon,
        children: [
          {
            value: "stripe.customers.subscribers",
            label: "Subscribers",
            icon: stripeLogo,
          },
          {
            value: "stripe.customers.trials",
            label: "Trials",
            icon: stripeLogo,
          },
        ],
      },
      {
        value: "stripe.invoices",
        label: "Invoices",
        icon: invoiceIcon,
        children: [
          {
            value: "stripe.invoices.drafts",
            label: "Drafts",
            icon: stripeLogo,
          },
          {
            value: "stripe.invoices.overdue",
            label: "Past due",
            icon: stripeLogo,
          },
        ],
      },
    ],
  },
  {
    value: "zoom",
    label: "Zoom",
    icon: zoomLogo,
    children: [
      {
        value: "zoom.meetings",
        label: "Meetings",
        icon: meetingIcon,
        children: [
          {
            value: "zoom.meetings.upcoming",
            label: "Upcoming",
            icon: zoomLogo,
          },
          {
            value: "zoom.meetings.recurring",
            label: "Recurring",
            icon: zoomLogo,
          },
        ],
      },
      {
        value: "zoom.recordings",
        label: "Recordings",
        icon: videoIcon,
        children: [
          {
            value: "zoom.recordings.cloud",
            label: "Cloud recordings",
            icon: zoomLogo,
          },
          {
            value: "zoom.recordings.transcripts",
            label: "Transcripts",
            icon: zoomLogo,
          },
        ],
      },
    ],
  },
  {
    value: "loom",
    label: "Loom",
    icon: loomLogo,
    children: [
      {
        value: "loom.videos",
        label: "Videos",
        icon: videoIcon,
        children: [
          {
            value: "loom.videos.recent",
            label: "Recent recordings",
            icon: loomLogo,
          },
          {
            value: "loom.videos.shared",
            label: "Shared with me",
            icon: loomLogo,
          },
        ],
      },
      {
        value: "loom.spaces",
        label: "Spaces",
        icon: folderIcon,
        children: [
          {
            value: "loom.spaces.engineering",
            label: "Engineering",
            icon: loomLogo,
          },
          { value: "loom.spaces.sales", label: "Sales", icon: loomLogo },
        ],
      },
    ],
  },
  {
    value: "discord",
    label: "Discord",
    icon: discordLogo,
    children: [
      {
        value: "discord.channels",
        label: "Channels",
        icon: channelIcon,
        children: [
          {
            value: "discord.channels.announcements",
            label: "#announcements",
            icon: discordLogo,
          },
          {
            value: "discord.channels.help",
            label: "#help",
            icon: discordLogo,
          },
        ],
      },
      {
        value: "discord.members",
        label: "Members",
        icon: customerIcon,
        children: [
          {
            value: "discord.members.moderators",
            label: "Moderators",
            icon: discordLogo,
          },
          {
            value: "discord.members.joiners",
            label: "New joiners",
            icon: discordLogo,
          },
        ],
      },
    ],
  },
]

type Format = "collapsed" | "full" | "tail" | "leaf" | "custom"

/**
 * A fully headless trigger. `useCascaderSelection` hands back the resolved
 * nodes and their ancestor chain as plain data, so this renders whatever it
 * likes - here the product logo taken from the ROOT of the chain next to a
 * two-line label with a monospace resource slug - without going through
 * `CascaderValue` at all.
 */
function ResourceValue() {
  const { firstPath, isEmpty } = useCascaderSelection()

  if (isEmpty) {
    return <span className="text-muted-foreground">Select a resource</span>
  }

  const brand = firstPath[0]
  const leaf = firstPath[firstPath.length - 1]
  const slug = leaf?.value.split(".").join("/")

  return (
    <span className="flex min-w-0 items-center gap-2">
      <span className="flex shrink-0 items-center">{brand?.icon}</span>
      <span className="flex min-w-0 flex-col items-start leading-tight">
        <span className="truncate text-sm font-medium">{leaf?.label}</span>
        <span className="text-muted-foreground truncate font-mono text-[10px]">
          {slug}
        </span>
      </span>
    </span>
  )
}

/**
 * How the trigger renders the selection, all on one cascader instance.
 *
 * A connected-product tree is exactly where a bare leaf label stops being
 * enough: "Channels" exists under both Slack and Discord, and "#help" says
 * nothing about which of the two it came from. Switch the format to see the
 * trade-off between compactness and being unambiguous - the last option drops
 * `CascaderValue` entirely for a headless renderer.
 *
 * `maxSegments` is 2 rather than the default 3 because a product path is three
 * segments deep, and a limit of three would never actually collapse anything.
 * At two, `collapse="middle"` keeps the product and the resource and folds the
 * area between them, while `collapse="start"` keeps the tail and folds the
 * product away.
 *
 * The buttons sit BELOW the control and the control's row reserves the height
 * of the tallest trigger, so switching to the two-line headless renderer does
 * not shove the buttons down the page mid-comparison.
 */
export default function Pattern() {
  const [value, setValue] = useState("")
  const [format, setFormat] = useState<Format>("collapsed")

  return (
    <div className="flex w-full flex-col items-center p-4">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <div className="min-h-12 w-full">
          <Cascader items={sources} value={value} onValueChange={setValue}>
            <CascaderTrigger
              aria-label="Resource"
              render={
                <Button
                  variant="outline"
                  className="h-auto min-h-9 w-full justify-between gap-2 py-1.5 font-normal"
                />
              }
            >
              {format === "custom" ? (
                <ResourceValue />
              ) : (
                <CascaderValue
                  placeholder="Select a resource"
                  display={format === "leaf" ? "leaf" : "path"}
                  collapse={
                    format === "full"
                      ? "none"
                      : format === "tail"
                        ? "start"
                        : "middle"
                  }
                  maxSegments={2}
                />
              )}
            </CascaderTrigger>

            <CascaderContent className="w-72">
              <CascaderPanel>
                <CascaderNav>
                  <CascaderInput />
                </CascaderNav>
                <CascaderBreadcrumb />
                <CascaderEmpty />
                <CascaderList>
                  <CascaderItems />
                </CascaderList>
                <CascaderStatus />
              </CascaderPanel>
            </CascaderContent>
          </Cascader>
        </div>

        <ToggleGroup
          variant="outline"
          size="sm"
          value={[format]}
          onValueChange={(next: string[]) =>
            next[0] && setFormat(next[0] as Format)
          }
          className="self-center"
        >
          <ToggleGroupItem value="collapsed">Collapsed</ToggleGroupItem>
          <ToggleGroupItem value="full">Full</ToggleGroupItem>
          <ToggleGroupItem value="tail">Tail</ToggleGroupItem>
          <ToggleGroupItem value="leaf">Leaf</ToggleGroupItem>
          <ToggleGroupItem value="custom">Headless</ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  )
}
