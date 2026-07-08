import { COMPONENTS_TOTAL, CUSTOM_PRIMITIVES_TOTAL } from "@/lib/registry-stats"

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export interface FAQCategory {
  id: string
  label: string
  faqs: FAQItem[]
}

const fmt = (n: number) => n.toLocaleString("en-US")

/**
 * Static, component-focused FAQ set for the open-source ReUI site.
 *
 * Answers are plain strings and may embed `[Label](href)` markdown links, which
 * `faq-block.tsx` renders into styled links. Nothing here is fetched at runtime.
 */
const FAQ_CATEGORIES: FAQCategory[] = [
  {
    id: "general",
    label: "General",
    faqs: [
      {
        id: "what-is-reui",
        question: "What is ReUI?",
        answer: `ReUI is a free, open-source component library for the [shadcn/ui](https://ui.shadcn.com) ecosystem. It gives you ${fmt(
          COMPONENTS_TOTAL
        )}+ copy-paste component examples plus ${CUSTOM_PRIMITIVES_TOTAL} in-house primitives that are not part of base shadcn/ui - all built on React, Radix UI, Base UI, and Tailwind CSS.`,
      },
      {
        id: "who-is-it-for",
        question: "Who is ReUI for?",
        answer:
          "Anyone building product UIs with React and Tailwind CSS - especially teams already using shadcn/ui who want more real-world components and advanced primitives like Data Grid, Kanban, and Filters without building them from scratch.",
      },
      {
        id: "is-it-free",
        question: "Is ReUI really free?",
        answer:
          "Yes. Every component and primitive in this repository is free and open-source under the MIT license, for both commercial and personal projects. No account, no sign-up, no license key.",
      },
    ],
  },
  {
    id: "components",
    label: "Components",
    faqs: [
      {
        id: "what-is-included",
        question: "What's included?",
        answer: `${fmt(
          COMPONENTS_TOTAL
        )}+ shadcn component examples and ${CUSTOM_PRIMITIVES_TOTAL} ReUI custom primitives - including Data Grid, Kanban, Filters, Stepper, Tree, Timeline, and more. Each primitive ships with full documentation and usage examples. The catalog grows with every release.`,
      },
      {
        id: "radix-vs-base",
        question: "What are the Radix UI and Base UI versions?",
        answer:
          "Every in-house primitive ships in two flavors: one built on [Radix UI](https://www.radix-ui.com) and one on [Base UI](https://base-ui.com). Pick whichever aligns with your stack - the API and docs are provided for both. Browse them under [Docs](/docs).",
      },
      {
        id: "customization",
        question: "Can I customize the components?",
        answer:
          "Completely. You own the source once you copy it in, so you can restyle, extend, or refactor any component. Everything uses Tailwind CSS design tokens, so it adapts to your theme automatically.",
      },
    ],
  },
  {
    id: "installation",
    label: "Installation",
    faqs: [
      {
        id: "how-to-install",
        question: "How do I install a component?",
        answer:
          "Use the shadcn CLI just like the official shadcn/ui set - each component page gives you a ready-to-run `npx shadcn@latest add` command that pulls the source straight into your project. See the [Docs](/docs) to get started.",
      },
      {
        id: "requirements",
        question: "What are the requirements?",
        answer:
          "A React project (Next.js, Vite, etc.) with Tailwind CSS and the shadcn/ui setup. If you already run shadcn/ui, you are ready to go.",
      },
      {
        id: "no-lock-in",
        question: "Is there any lock-in?",
        answer:
          "None. There is no npm package to depend on - you copy the source into your repo and own it. Update on your schedule, or never; your code keeps working.",
      },
    ],
  },
  {
    id: "license",
    label: "License",
    faqs: [
      {
        id: "license-terms",
        question: "What license is ReUI released under?",
        answer:
          "The MIT license. You can use ReUI components in personal, commercial, and open-source projects for free, forever.",
      },
      {
        id: "contributing",
        question: "Can I contribute?",
        answer:
          "Yes - contributions are welcome. Check the repository on [GitHub](https://github.com/keenthemes/reui) to report issues or open a pull request.",
      },
    ],
  },
]

export function getFAQCategories(): FAQCategory[] {
  return FAQ_CATEGORIES
}
