import Link from "next/link"
import {
  ArrowUpDownIcon,
  BadgeAlertIcon,
  BadgeIcon,
  BellIcon,
  CalendarDaysIcon,
  CalendarIcon,
  ChartColumnIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsLeftRightEllipsisIcon,
  ChevronsUpDownIcon,
  CircleHelpIcon,
  Columns3Icon,
  ComponentIcon,
  FileUpIcon,
  FilterIcon,
  FootprintsIcon,
  FrameIcon,
  GalleryHorizontalIcon,
  GripVerticalIcon,
  HashIcon,
  InboxIcon,
  KanbanIcon,
  KeyboardIcon,
  LayersIcon,
  ListChecksIcon,
  ListPlusIcon,
  ListTodoIcon,
  ListTreeIcon,
  LoaderCircleIcon,
  MenuIcon,
  MessageSquareIcon,
  MinusIcon,
  MousePointer2Icon,
  NavigationIcon,
  NotebookTabsIcon,
  PanelRightIcon,
  PanelTopIcon,
  PanelTopOpenIcon,
  PhoneIcon,
  RadioIcon,
  RectangleEllipsisIcon,
  ReplaceIcon,
  ScrollTextIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SquareCheckIcon,
  SquareIcon,
  SquareMousePointerIcon,
  StarIcon,
  Table2Icon,
  TagIcon,
  TerminalIcon,
  TextCursorInputIcon,
  TextIcon,
  ToggleLeftIcon,
  TriangleAlertIcon,
  UserIcon,
  type LucideIcon,
} from "lucide-react"

import type { ComponentCategoryInfo } from "@/lib/component-stats"
import { Heading } from "@/components/custom/heading"
import { PageGridBackdrop } from "@/components/page-grid-backdrop"

import { FreeUnderline } from "./free-underline"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  accordion: ChevronDownIcon,
  alert: TriangleAlertIcon,
  "alert-dialog": BadgeAlertIcon,
  "aspect-ratio": SquareIcon,
  autocomplete: SearchIcon,
  avatar: UserIcon,
  badge: BadgeIcon,
  breadcrumb: ChevronRightIcon,
  button: MousePointer2Icon,
  "button-group": Columns3Icon,
  calendar: CalendarIcon,
  card: PanelTopIcon,
  carousel: GalleryHorizontalIcon,
  chart: ChartColumnIcon,
  checkbox: SquareCheckIcon,
  collapsible: ChevronsUpDownIcon,
  combobox: SearchIcon,
  command: TerminalIcon,
  "context-menu": MousePointer2Icon,
  "data-grid": Table2Icon,
  "date-selector": CalendarDaysIcon,
  dialog: MessageSquareIcon,
  drawer: PanelRightIcon,
  "dropdown-menu": MenuIcon,
  empty: InboxIcon,
  field: TextCursorInputIcon,
  "file-upload": FileUpIcon,
  filters: FilterIcon,
  frame: FrameIcon,
  "hover-card": SquareMousePointerIcon,
  "icon-stack": LayersIcon,
  input: TextCursorInputIcon,
  "input-group": ListPlusIcon,
  "input-otp": RectangleEllipsisIcon,
  item: ListTreeIcon,
  kanban: KanbanIcon,
  kbd: KeyboardIcon,
  label: TagIcon,
  menubar: MenuIcon,
  "native-select": ListChecksIcon,
  "navigation-menu": NavigationIcon,
  "number-field": HashIcon,
  pagination: ChevronsLeftRightEllipsisIcon,
  "phone-input": PhoneIcon,
  popover: PanelTopOpenIcon,
  progress: LoaderCircleIcon,
  "radio-group": RadioIcon,
  rating: StarIcon,
  resizable: GripVerticalIcon,
  "scroll-area": ScrollTextIcon,
  scrollspy: ListTreeIcon,
  select: ListChecksIcon,
  separator: MinusIcon,
  sheet: PanelRightIcon,
  skeleton: RectangleEllipsisIcon,
  slider: SlidersHorizontalIcon,
  sonner: BellIcon,
  sortable: ArrowUpDownIcon,
  spinner: LoaderCircleIcon,
  stepper: FootprintsIcon,
  switch: ToggleLeftIcon,
  table: Table2Icon,
  tabs: NotebookTabsIcon,
  textarea: TextIcon,
  timeline: ListTodoIcon,
  toggle: ToggleLeftIcon,
  "toggle-group": ReplaceIcon,
  tooltip: CircleHelpIcon,
  tree: ListTreeIcon,
}

export function HomeComponentsCategoriesBlock({
  categories,
  totalCount,
}: {
  categories: ComponentCategoryInfo[]
  totalCount: number
}) {
  return (
    <section
      // `relative` anchors the grid backdrop below; `overflow-hidden` clips it
      // to the section. `pb-0` removes the trailing gap below the bordered grid
      // so the next section ("Crafted, not generated" / ProofBlock, which has
      // its own tinted bg + `border-y`) docks flush. The grid's `border-b` and
      // the ProofBlock's `border-t` then form a single shared seam.
      className="bg-site-background relative overflow-hidden pt-14 pb-0 lg:pt-18"
      aria-labelledby="home-components-categories-title"
    >
      {/*
        Section heading halo: the shared grid texture with an early top fade
        that dissolves into the section background. It sits behind the content
        (z-0), so the wrappers below opt into `z-10` to paint over it.
      */}
      <PageGridBackdrop variant="section" />

      {/*
        Heading stays inside the `container-wrapper` + `container`
        (max-w 1400px, centered, with horizontal padding) so it
        lines up with the other home sections. The grid below
        deliberately sits OUTSIDE all wrappers so it spans true
        edge-to-edge viewport width with no left/right padding.
      */}
      <div className="container-wrapper relative z-10">
        <div className="container">
          <Heading
            badge="Free Components"
            title={
              <span id="home-components-categories-title">
                {totalCount.toLocaleString()} <FreeUnderline /> Shadcn UI
                Components
              </span>
            }
            description="Essential Shadcn components, organized by category with practical examples and copy-ready CLI installs."
            className="mb-10 [&_h2]:max-w-none"
          />
        </div>
      </div>

      {/*
        Bordered grid, full viewport width. The `Card` frame is gone:
        each cell brings its own border, and `-m-px` on the cells
        collapses adjacent borders into single hairlines for the
        classic "bordered grid" look. `overflow-hidden` clips the
        outermost edge cells' negative margins so the grid doesn't
        cause a 2px horizontal scrollbar on the page.

        Auto-fit grid: `repeat(auto-fit, minmax(220px, 1fr))` packs
        as many cells as fit at >= 220px each and distributes any
        remaining space equally (1fr). Scales fluidly from a single
        full-width column on mobile up to 7–8+ columns on
        ultra-wide displays.
      */}
      <div className="border-site-border/60 relative z-10 grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] overflow-hidden border-t border-b">
        {categories.map((category) => {
          const Icon = CATEGORY_ICONS[category.slug] ?? ComponentIcon

          return (
            <Link
              key={category.slug}
              href={`/components/${category.slug}`}
              prefetch={false}
              className="group border-site-border/60 bg-site-background hover:bg-site-muted/45 focus-visible:ring-site-ring -m-px flex min-h-20 items-center justify-between gap-4 border px-5 py-4 transition-colors focus-visible:z-10 focus-visible:ring-2 focus-visible:outline-none"
            >
              <span className="flex min-w-0 items-center gap-3">
                <Icon
                  className="text-site-muted-foreground group-hover:text-site-foreground size-5 shrink-0 transition-colors"
                  aria-hidden="true"
                />
                <span className="text-site-foreground truncate text-sm font-medium">
                  {category.label}
                </span>
              </span>
              <span className="text-site-muted-foreground bg-site-muted/45 border-site-border/60 group-hover:bg-site-primary group-hover:text-site-primary-foreground group-hover:border-site-primary site-rounded-full shrink-0 border px-2 py-0.5 text-xs font-medium tabular-nums transition-colors">
                {category.count}
                <span className="sr-only">
                  {" "}
                  {category.count === 1 ? "component" : "components"}
                </span>
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
