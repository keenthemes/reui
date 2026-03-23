# Cross-skill references for pattern SEO

When revising **`seo.json`** at scale, combine:

## `reui-seo` (this skill)

Canonical structure, Shadcn naming, `[[slug|Shadcn Label]]`, FAQ count, integration blocks.

## `seo-audit` (`oss/.agents/skills/seo-audit`)

Use for **quality checks**, not duplicate boilerplate:

- Unique **title** / **description** per URL intent
- **Meta** length and primary keyword in first sentences
- **Heading** hierarchy themes (one clear H1 on the page from the pattern title; guide sections as nested headings in the SEO block)
- **Thin content** avoidance: each category should answer a distinct search intent
- **Internal links**: descriptive anchor text (`Shadcn X` in link labels)

## `marketing-ideas` (optional)

Use for **keyword clustering** and **positioning language** only:

- Long-tail variants per component (`npx shadcn add …`, `tailwind …`, framework names)
- Do **not** add hype or filler; keep technically accurate

## `shadcn` (`oss/.agents/skills/shadcn`)

Required for **component purpose** and **composition rules**:

- When to use Alert vs Toast, Field vs raw div, Dialog title requirements, etc.
- CLI: `npx shadcn@latest add <component>` (match project package manager)
- **Data grid**: TanStack Table is the headless data layer; document honestly.

## Context7 MCP

Use to **verify** upstream docs when making claims about:

- Radix primitives, TanStack Table APIs, React APIs
- Avoid inventing props or behaviors

## FAQ research (mandatory for `content.faqs`)

Before writing FAQs, run the **FAQ Research Sub-Agent** process (`references/faq-research-subagent.md`):

- **Google**: People Also Ask, related searches, high-intent queries for `shadcn {component}`, `{component} react radix`, etc.
- **Stack Overflow**: Recurring errors and integration questions.
- **Quora**: Optional, for broader “vs” questions; validate technically.
- **Component API**: shadcn CLI/docs + **`shadcn`** skill so answers are accurate.

Do not ship **placeholder** FAQs that duplicate across categories without component-specific wording.

## Verification script

`pnpm verify:seo` / `npm run verify:seo` → `oss/scripts/verify-seo-json.mjs`

## Orchestration

`oss/.agents/workflows/reui-pattern-seo-orchestration.md` (planner, writer, reviewer, **5 passes**).
