"use client"

import { useState } from "react"
import {
  Cascader,
  CascaderEmpty,
  CascaderList,
  CascaderPanel,
  CascaderStatus,
} from "@/registry-reui/bases/base/reui/cascader/cascader"
import { CascaderItems } from "@/registry-reui/bases/base/reui/cascader/cascader-item"
import {
  CascaderBreadcrumb,
  CascaderInput,
  CascaderNav,
} from "@/registry-reui/bases/base/reui/cascader/cascader-nav"
import type { CascaderNode } from "@/registry-reui/bases/base/reui/cascader/cascader-types"

import { Card } from "@/registry/bases/base/ui/card"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

/* -------------------------------------------------------------------------- */
/*                                Section icons                               */
/* -------------------------------------------------------------------------- */

/**
 * A table of contents is scanned, not read, and the icon column is the first
 * thing the eye lands on - so it has to be the thing that tells sections apart.
 * One book for every page and one stack for every section made the column a
 * ruled margin: eight identical marks above twenty-four identical marks.
 *
 * Every icon is declared once here and referenced from the tree below, so the
 * data stays a table of contents rather than a page of JSX.
 */
const gettingStartedIcon = (
  <IconPlaceholder
    lucide="RocketIcon"
    tabler="IconRocket"
    hugeicons="RocketIcon"
    phosphor="RocketIcon"
    remixicon="RiRocketLine"
    className="size-4"
  />
)
const componentsIcon = (
  <IconPlaceholder
    lucide="LayoutGridIcon"
    tabler="IconLayoutGrid"
    hugeicons="GridViewIcon"
    phosphor="SquaresFourIcon"
    remixicon="RiLayoutGridLine"
    className="size-4"
  />
)
const primitivesIcon = (
  <IconPlaceholder
    lucide="LayersIcon"
    tabler="IconStack2"
    hugeicons="Layers01Icon"
    phosphor="StackIcon"
    remixicon="RiStackLine"
    className="size-4"
  />
)
const guidesIcon = (
  <IconPlaceholder
    lucide="BookOpenIcon"
    tabler="IconBook"
    hugeicons="BookOpen01Icon"
    phosphor="BookOpenIcon"
    remixicon="RiBookOpenLine"
    className="size-4"
  />
)
const stylesIcon = (
  <IconPlaceholder
    lucide="PaletteIcon"
    tabler="IconPalette"
    hugeicons="PaintBoardIcon"
    phosphor="PaletteIcon"
    remixicon="RiPaletteLine"
    className="size-4"
  />
)
const integrationsIcon = (
  <IconPlaceholder
    lucide="PuzzleIcon"
    tabler="IconPuzzle"
    hugeicons="PuzzleIcon"
    phosphor="PuzzlePieceIcon"
    remixicon="RiPuzzleLine"
    className="size-4"
  />
)
const mcpIcon = (
  <IconPlaceholder
    lucide="BotIcon"
    tabler="IconRobot"
    hugeicons="BotIcon"
    phosphor="RobotIcon"
    remixicon="RiRobot2Line"
    className="size-4"
  />
)
const changelogIcon = (
  <IconPlaceholder
    lucide="TagIcon"
    tabler="IconTag"
    hugeicons="Tag01Icon"
    phosphor="TagIcon"
    remixicon="RiPriceTag3Line"
    className="size-4"
  />
)

/* -------------------------------------------------------------------------- */
/*                                 Page icons                                 */
/* -------------------------------------------------------------------------- */

const installIcon = (
  <IconPlaceholder
    lucide="DownloadIcon"
    tabler="IconDownload"
    hugeicons="Download01Icon"
    phosphor="DownloadSimpleIcon"
    remixicon="RiDownloadLine"
    className="size-4"
  />
)
const themingIcon = (
  <IconPlaceholder
    lucide="SlidersHorizontalIcon"
    tabler="IconAdjustmentsHorizontal"
    hugeicons="SlidersHorizontalIcon"
    phosphor="SlidersHorizontalIcon"
    remixicon="RiEqualizer2Line"
    className="size-4"
  />
)
const cliIcon = (
  <IconPlaceholder
    lucide="TerminalIcon"
    tabler="IconTerminal"
    hugeicons="ComputerTerminal01Icon"
    phosphor="TerminalIcon"
    remixicon="RiTerminalLine"
    className="size-4"
  />
)
const upgradeIcon = (
  <IconPlaceholder
    lucide="RefreshCwIcon"
    tabler="IconRefresh"
    hugeicons="RefreshIcon"
    phosphor="ArrowsClockwiseIcon"
    remixicon="RiRefreshLine"
    className="size-4"
  />
)
const cascaderIcon = (
  <IconPlaceholder
    lucide="ChevronsRightIcon"
    tabler="IconChevronsRight"
    hugeicons="ArrowRightDoubleIcon"
    phosphor="CaretDoubleRightIcon"
    remixicon="RiArrowRightDoubleLine"
    className="size-4"
  />
)
const dataGridIcon = (
  <IconPlaceholder
    lucide="TableIcon"
    tabler="IconTable"
    hugeicons="Table01Icon"
    phosphor="TableIcon"
    remixicon="RiTableLine"
    className="size-4"
  />
)
const kanbanIcon = (
  <IconPlaceholder
    lucide="KanbanIcon"
    tabler="IconLayoutKanban"
    hugeicons="LayoutThreeColumnIcon"
    phosphor="KanbanIcon"
    remixicon="RiKanbanView"
    className="size-4"
  />
)
const ganttIcon = (
  <IconPlaceholder
    lucide="ChartBarIcon"
    tabler="IconChartBar"
    hugeicons="BarChartHorizontalIcon"
    phosphor="ChartBarIcon"
    remixicon="RiBarChartLine"
    className="size-4"
  />
)
const calendarIcon = (
  <IconPlaceholder
    lucide="CalendarDaysIcon"
    tabler="IconCalendarWeek"
    hugeicons="Calendar03Icon"
    phosphor="CalendarDotsIcon"
    remixicon="RiCalendarLine"
    className="size-4"
  />
)
const frameIcon = (
  <IconPlaceholder
    lucide="AppWindowIcon"
    tabler="IconAppWindow"
    hugeicons="BrowserIcon"
    phosphor="AppWindowIcon"
    remixicon="RiWindowLine"
    className="size-4"
  />
)
const badgeIcon = (
  <IconPlaceholder
    lucide="BadgeCheckIcon"
    tabler="IconRosetteDiscountCheck"
    hugeicons="CheckmarkBadge01Icon"
    phosphor="SealCheckIcon"
    remixicon="RiVerifiedBadgeLine"
    className="size-4"
  />
)
const stepperIcon = (
  <IconPlaceholder
    lucide="RouteIcon"
    tabler="IconRoute"
    hugeicons="Route01Icon"
    phosphor="PathIcon"
    remixicon="RiRouteLine"
    className="size-4"
  />
)
const formsIcon = (
  <IconPlaceholder
    lucide="ClipboardListIcon"
    tabler="IconClipboardList"
    hugeicons="CheckListIcon"
    phosphor="ClipboardTextIcon"
    remixicon="RiFileListLine"
    className="size-4"
  />
)
const accessibilityIcon = (
  <IconPlaceholder
    lucide="CircleUserRoundIcon"
    tabler="IconUserCircle"
    hugeicons="UserCircleIcon"
    phosphor="UserCircleIcon"
    remixicon="RiAccountCircleLine"
    className="size-4"
  />
)
const darkModeIcon = (
  <IconPlaceholder
    lucide="MoonIcon"
    tabler="IconMoon"
    hugeicons="Moon02Icon"
    phosphor="MoonIcon"
    remixicon="RiMoonLine"
    className="size-4"
  />
)

/**
 * The four styles are the one run of pages with no natural iconography of their
 * own - they are named after constellations, so they get the sky rather than
 * four shades of the same swatch.
 */
const novaIcon = (
  <IconPlaceholder
    lucide="SparklesIcon"
    tabler="IconSparkles"
    hugeicons="SparklesIcon"
    phosphor="SparkleIcon"
    remixicon="RiSparklingLine"
    className="size-4"
  />
)
const lyraIcon = (
  <IconPlaceholder
    lucide="MusicIcon"
    tabler="IconMusic"
    hugeicons="MusicNote03Icon"
    phosphor="MusicNotesIcon"
    remixicon="RiMusic2Line"
    className="size-4"
  />
)
const maiaIcon = (
  <IconPlaceholder
    lucide="StarIcon"
    tabler="IconStar"
    hugeicons="StarIcon"
    phosphor="StarIcon"
    remixicon="RiStarLine"
    className="size-4"
  />
)
const seraIcon = (
  <IconPlaceholder
    lucide="SunIcon"
    tabler="IconSun"
    hugeicons="Sun01Icon"
    phosphor="SunIcon"
    remixicon="RiSunLine"
    className="size-4"
  />
)
const nextIcon = (
  <IconPlaceholder
    lucide="GlobeIcon"
    tabler="IconWorld"
    hugeicons="Globe02Icon"
    phosphor="GlobeIcon"
    remixicon="RiGlobalLine"
    className="size-4"
  />
)
const viteIcon = (
  <IconPlaceholder
    lucide="ZapIcon"
    tabler="IconBolt"
    hugeicons="ZapIcon"
    phosphor="LightningIcon"
    remixicon="RiFlashlightLine"
    className="size-4"
  />
)
const remixIcon = (
  <IconPlaceholder
    lucide="GitMergeIcon"
    tabler="IconGitMerge"
    hugeicons="GitMergeIcon"
    phosphor="GitMergeIcon"
    remixicon="RiGitMergeLine"
    className="size-4"
  />
)
const setupIcon = (
  <IconPlaceholder
    lucide="SettingsIcon"
    tabler="IconSettings"
    hugeicons="Settings01Icon"
    phosphor="GearIcon"
    remixicon="RiSettings3Line"
    className="size-4"
  />
)
const toolsIcon = (
  <IconPlaceholder
    lucide="WrenchIcon"
    tabler="IconTool"
    hugeicons="Wrench01Icon"
    phosphor="WrenchIcon"
    remixicon="RiToolsLine"
    className="size-4"
  />
)

const docs: CascaderNode[] = [
  {
    value: "getting-started",
    label: "Getting started",
    icon: gettingStartedIcon,
    children: [
      { value: "gs.install", label: "Installation", icon: installIcon },
      { value: "gs.theming", label: "Theming", icon: themingIcon },
      { value: "gs.cli", label: "CLI", icon: cliIcon },
      { value: "gs.upgrade", label: "Upgrading", icon: upgradeIcon },
    ],
  },
  {
    value: "components",
    label: "Components",
    icon: componentsIcon,
    children: [
      { value: "c.cascader", label: "Cascader", icon: cascaderIcon },
      { value: "c.data-grid", label: "Data Grid", icon: dataGridIcon },
      { value: "c.kanban", label: "Kanban", icon: kanbanIcon },
      { value: "c.gantt", label: "Gantt", icon: ganttIcon },
      { value: "c.calendar", label: "Event Calendar", icon: calendarIcon },
    ],
  },
  {
    value: "primitives",
    label: "Primitives",
    icon: primitivesIcon,
    children: [
      { value: "p.frame", label: "Frame", icon: frameIcon },
      { value: "p.badge", label: "Badge", icon: badgeIcon },
      { value: "p.stepper", label: "Stepper", icon: stepperIcon },
    ],
  },
  {
    value: "guides",
    label: "Guides",
    icon: guidesIcon,
    children: [
      { value: "g.forms", label: "Forms", icon: formsIcon },
      { value: "g.a11y", label: "Accessibility", icon: accessibilityIcon },
      { value: "g.dark-mode", label: "Dark mode", icon: darkModeIcon },
    ],
  },
  {
    value: "styles",
    label: "Styles",
    icon: stylesIcon,
    children: [
      { value: "s.nova", label: "Nova", icon: novaIcon },
      { value: "s.lyra", label: "Lyra", icon: lyraIcon },
      { value: "s.maia", label: "Maia", icon: maiaIcon },
      { value: "s.sera", label: "Sera", icon: seraIcon },
    ],
  },
  {
    value: "integrations",
    label: "Integrations",
    icon: integrationsIcon,
    children: [
      { value: "i.next", label: "Next.js", icon: nextIcon },
      { value: "i.vite", label: "Vite", icon: viteIcon },
      { value: "i.remix", label: "Remix", icon: remixIcon },
    ],
  },
  {
    value: "mcp",
    label: "MCP",
    icon: mcpIcon,
    children: [
      { value: "m.setup", label: "Setup", icon: setupIcon },
      { value: "m.tools", label: "Tools", icon: toolsIcon },
    ],
  },
  { value: "changelog", label: "Changelog", icon: changelogIcon },
]

/**
 * No trigger and no popover: `inline` drops the floating layer and
 * `CascaderPanel` renders the same nav, list and footer straight into the page.
 * Useful for sidebars, dialog bodies and settings screens, where a popover
 * inside a popover would be awkward.
 *
 * The surround is a shadcn `Card` rather than a hand-rolled `rounded-lg border`
 * div: radius is per style, and a literal is wrong in five of the eight.
 * `py-0` is the only override, so the panel sits flush inside it.
 *
 * The wrapper pins itself to the TOP of the preview surface (`self-start`,
 * plus `items-start` for the case where a host stretches it). Both the docs
 * frame and the catalog card centre their child vertically, and an embedded
 * panel changes height on every drill, so a centred demo slides up and down
 * under the reader's cursor. Anchored at the top it only grows downwards, and
 * `pt-6` keeps that top edge from sitting flush against the frame.
 */
export default function Pattern() {
  const [value, setValue] = useState("")

  return (
    <div className="flex w-full items-start justify-center self-start px-4 pt-6 pb-4">
      <div className="flex w-full max-w-md flex-col gap-3">
        <Cascader inline items={docs} value={value} onValueChange={setValue}>
          <Card className="py-0">
            <CascaderPanel>
              <CascaderNav>
                <CascaderInput placeholder="Search documentation..." />
              </CascaderNav>
              <CascaderBreadcrumb />
              <CascaderEmpty />
              {/* Kept, and the ONE shape where it is not a shortcut: `inline` has no
                  positioner, so there is no `--available-height` to bound the
                  panel and the cap is the only thing that does. Every popover
                  example below drops it and lets the viewport decide. */}
              <CascaderList maxHeight={240}>
                <CascaderItems />
              </CascaderList>
              <CascaderStatus />
            </CascaderPanel>
          </Card>
        </Cascader>
      </div>
    </div>
  )
}
