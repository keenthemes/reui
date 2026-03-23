import { ReactNode } from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_INLINE_LINK = /\[([^\]]+)\]\(([^)]+)\)/g

/** Renders `[Label](/path)` as internal `<Link>` (same styling as Patterns hero links). */
export function renderFaqAnswerWithPatternLinks(text: string): ReactNode {
  const parts: ReactNode[] = []
  let lastIndex = 0
  const re = new RegExp(FAQ_INLINE_LINK.source, "g")
  let match: RegExpExecArray | null
  let key = 0
  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const label = match[1]
    const href = match[2]
    parts.push(
      <Link key={`faq-a-${key++}`} href={href} className="font-semibold text-site-primary underline underline-offset-4">
        {label}
      </Link>
    )
    lastIndex = re.lastIndex
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return parts.length > 0 ? <>{parts}</> : text
}

export interface FAQSectionItem {
  id?: string
  question: ReactNode
  answer: ReactNode
}

export const defaultReuiFaqItems: FAQSectionItem[] = [
  // ── General ──────────────────────────────────────────────────────────────
  {
    id: "free-open-source",
    question: "Are ReUI patterns free and open source?",
    answer:
      "Yes. The entire ReUI OSS library is free and MIT-licensed. Every pattern is open source, copy-and-own, and built for the shadcn/ui ecosystem. Use them in personal, commercial, and enterprise projects without attribution requirements.",
  },
  {
    id: "components-vs-patterns",
    question:
      "What is the difference between a component and a pattern in ReUI?",
    answer:
      "A component is a primitive or composable building block such as Alert, Dialog, Button, Badge, and so on. A pattern combines those primitives into a more complete interface: [Data Grid](/patterns/data-grid) with [Filters](/patterns/filters) and [Pagination](/patterns/pagination), [File Upload](/patterns/file-upload) with [Progress](/patterns/progress) and [Sorting](/patterns/sortable), [Kanban](/patterns/kanban), or Multi-step checkout [Stepper](/patterns/stepper). ReUI ships both: raw component variants and full interface patterns built from them.",
  },
  {
    id: "react-next",
    question: "Can I use ReUI patterns in React and Next.js projects?",
    answer:
      "Yes. ReUI patterns are built for modern React and integrate naturally into Next.js App Router projects or literally any React based framework. Fetch data in Server Components, pass it to client-side interactive components, and wire patterns to your API routes or Server Actions. All patterns follow the same boundaries shadcn/ui uses.",
  },
  {
    id: "tailwind-shadcn-support",
    question: "Do ReUI patterns work with Tailwind CSS v4 and shadcn/ui?",
    answer:
      "Yes. ReUI patterns are built directly on top of shadcn/ui primitives and styled with Tailwind CSS v4 utility classes. They are fully compatible with Shadcn design system",
  },
  {
    id: "shadcn-create-compatibility",
    question: "Are ReUI patterns compatible with Shadcn Create style options?",
    answer:
      "Fully. ReUI patterns are compiled against all Shadcn Create style configurations. Every style option you configure in the Shadcn Create customizer such as base color, color scale, border radius, and font family propagates to ReUI pattern previews and to the source code you copy. What you see in the preview is exactly what lands in your project.",
  },
  {
    id: "best-starting-points",
    question:
      "Which ReUI patterns are the best starting point for a new project?",
    answer:
      "For most product teams the highest-leverage starting points are [Data Grid](/patterns/data-grid), [Filters](/patterns/filters), [File Upload](/patterns/file-upload), [Combobox](/patterns/combobox), [Alert](/patterns/alert), [Kanban](/patterns/kanban), and [Stepper](/patterns/stepper). They solve the most common and time-consuming product UI problems and usually save the most implementation time in the first sprint.",
  },

  // ── In-House Components ───────────────────────────────────────────────────
  {
    id: "inhouse-components",
    question: "What are ReUI in-house components and how are they different?",
    answer:
      "In-house components are custom shadcn-compatible components built and maintained by the ReUI team that are not part of the base shadcn/ui library. They fill capability gaps for real product needs: Data Grid (TanStack Table + TanStack Virtual + DnD Kit), Filters (TanStack Table column filters + nuqs URL state + Zod validation), Kanban (DnD Kit drag-and-drop board), Sortable (DnD Kit list and grid reordering), File Upload (drag-and-drop with progress and gallery), Frame (dashboard container with toolbar slots), Timeline, Stepper, Rating, Tree, Autocomplete, Combobox, Number Field, Phone Input, Scrollspy, and Date Selector. All follow the same copy-and-own installation model as shadcn/ui.",
  },
  {
    id: "inhouse-radix-base-ui",
    question: "Do in-house components support both Radix UI and Base UI?",
    answer:
      "Yes. Every ReUI in-house component ships in two API flavors: a Radix UI version for teams using standard shadcn/ui primitives, and a Base UI version for teams on @base-ui/react. Both versions share identical Tailwind CSS styling and visual output only the underlying headless primitive differs. You can find the full component API, props reference, and usage examples for each version in the dedicated docs pages.",
  },
  {
    id: "inhouse-docs",
    question:
      "Where can I find the full API and props docs for in-house components?",
    answer:
      "Each in-house component has dedicated documentation with the complete component API, prop reference, and usage examples. Visit /docs/base/[component] for the Base UI version and /docs/radix/[component] for the Radix UI version. For example: /docs/base/data-grid, /docs/base/filters, /docs/base/kanban, /docs/base/file-upload, /docs/base/sortable, and /docs/base/frame.",
  },
  {
    id: "base-radix",
    question:
      "What is the difference between the Base UI and Radix UI versions of a component?",
    answer:
      "Both versions produce identical visual output and use the same Tailwind CSS tokens. The difference is the headless primitive underneath: the Radix UI version uses @radix-ui/* packages that ship with standard shadcn/ui; the Base UI version uses @base-ui/react primitives from the MUI team. Choose the Base UI version if you are starting a new project or migrating away from Radix, and the Radix version if your project already uses the standard shadcn/ui setup.",
  },

  // ── Free vs Pro ───────────────────────────────────────────────────────────
  {
    id: "free-vs-pro",
    question:
      "What is the difference between the free ReUI library and ReUI Pro?",
    answer:
      "The free ReUI library available now gives you full access to all open-source component patterns, in-house components, and Shadcn Create compatibility with no restrictions. [ReUI Pro](https://pro.reui.io) is an upcoming premium tier focused on three things: a curated collection of premium design-forward blocks and page templates, a library of animated icons built for the shadcn/ui ecosystem, and AI-powered tooling to help teams compose, customize, and ship polished shadcn interfaces faster. Pro is aimed at teams that want to go beyond components and deliver consistently high-quality, design-forward product UIs.",
  },
  {
    id: "pro-waitlist",
    question: "How can I get early access to ReUI Pro?",
    answer:
      "ReUI Pro is currently in development and accepting waitlist sign-ups at [ReUI Pro Waitlist](https://pro.reui.io). Waitlist members receive a 40% launch discount when Pro becomes available. Signing up takes under a minute and locks in your discount regardless of when you choose to upgrade.",
  },
]

interface FAQSectionProps {
  badge?: ReactNode
  title?: ReactNode
  description?: ReactNode
  items?: FAQSectionItem[]
  className?: string
}

export function FAQSection({
  badge = "FAQ",
  title = "Frequently asked questions about ReUI patterns",
  description = "Answers about free open-source shadcn/ui patterns, React and Tailwind CSS usage, and how to adapt ReUI examples for real product UI.",
  items = defaultReuiFaqItems,
  className,
}: FAQSectionProps) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className={cn("container-wrapper mb-20 py-12", className)}>
      <div className="container space-y-10">
        <h2 className="mx-auto text-center text-3xl font-semibold text-balance sm:text-4xl">
          Frequently Asked Questions
        </h2>

        <div className="site-rounded-xl border-site-border bg-site-background mx-auto mt-8 max-w-3xl border px-6 py-2">
          <Accordion type="single" collapsible className="w-full">
            {items.map((item, index) => {
              const value = item.id ?? `faq-${index}`

              return (
                <AccordionItem key={value} value={value}>
                  <AccordionTrigger className="flex items-center gap-2 text-left text-sm">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-site-foreground/90 text-sm leading-7 text-pretty">
                    {typeof item.answer === "string"
                      ? renderFaqAnswerWithPatternLinks(item.answer)
                      : item.answer}
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
