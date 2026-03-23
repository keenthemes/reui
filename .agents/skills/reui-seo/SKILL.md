---
name: reui-seo
description: Authors ReUI pattern-category SEO in oss/registry-reui/bases/seo.json and related Next.js pattern pages. Use when adding or editing pattern SEO, shadcn category pages, meta descriptions, FAQs, relatedComponents prose, expanding seo.json for a new component category, or when the user says ReUI SEO, pattern SEO, or seo.json patterns.
metadata:
  version: 1.3.0
---

# ReUI SEO (pattern categories)

You help write and structure **SEO content** for **`/patterns/[category]`** pages. The source of truth for per-category copy is **`oss/registry-reui/bases/seo.json`**, merged by **`getPatternCategorySeo`** in **`oss/lib/registry.ts`**.

## First read

1. **`references/pattern-seo-playbook.md`** for structure and mandatory stack copy.
2. **`references/cross-skills.md`** for how to use **seo-audit**, **marketing-ideas**, **shadcn**, and **Context7 MCP** without diluting technical accuracy.
3. **Gold examples in `seo.json`**: **`accordion`** (user-tuned), **`alert`**, **`data-grid`** (TanStack Table, borders, integration). Migrate other categories toward this shape in batches.
4. **`oss/.agents/workflows/reui-pattern-seo-orchestration.md`** for multi-agent workflow and **five verification passes**.
5. Optionally **`.cursor/rules/reui-seo.mdc`** at repo root.
6. If **`.agents/product-marketing-context.md`** exists, read it for voice.

## Hard rules (always)

1. **No em dash** (`—`, Unicode U+2014). Use comma, period, colon, or a second sentence. Hyphens inside words are fine (`open-source`).
2. **Valid JSON**: no trailing commas; escape internal double quotes; UTF-8.
3. **`relatedComponents`** (when used): **`title`** + **`integrationBody`** (paragraphs with **`[[slug|Shadcn Name]]`**). Optional **`items`** in JSON for authors, not rendered. Optional **`featureItems`** for bulleted features.
4. Do not rely on a **“popular search topics”** UI (removed). Still populate **`keywords`** for **`generateMetadata`** in **`[category]/page.tsx`**.
5. **FAQs** in JSON power the on-page **Accordion** and **FAQPage** JSON-LD when FAQs exist. **FAQ quality:** questions must reflect **real search and Q&A intent** (Google, Stack Overflow, Quora) and **actual component API / behavior**, not random templates. Use the **FAQ Research Sub-Agent** workflow in **`references/faq-research-subagent.md`** before finalizing `content.faqs`.
6. **Shadcn component naming**: In all SEO prose, headings, FAQs, and in the **`Label`** of **`[[slug|Label]]`** links, use the form **Shadcn {Component}** (Title Case on the component part). Examples: **Shadcn Accordion**, **Shadcn Alert**, **Shadcn Badge**, **Shadcn Alert Dialog** (slug `alert-dialog`). Never use bare **Button** or **Badge** as the link text when referring to the library component. The **slug** remains the registry category (`button`, `badge`, `alert-dialog`).

## JSON shape per category

| Key | Purpose |
|-----|---------|
| `description` | Meta / Open Graph description |
| `intro` | Hero paragraph under page title |
| `highlights` | Pattern gallery chips (registry-driven UI) |
| `keywords` | Array merged into page `metadata.keywords` |
| `docsDescription` | Optional; docs-specific blurb when present |
| `content.title` | Guide block heading (e.g. **General Information**, Title Case) |
| `content.summary` | **2–3** short paragraphs (general information only) |
| `content.sections` | `{ title, paragraphs?, bullets?, featureItems? }` — see playbook for **What Is / Why Use / Features** |
| `content.faqs` | `{ question, answer }[]`, rendered **last** |
| `relatedComponents` | `{ title, integrationBody: string[] }` — prose with `[[slug|Shadcn Name]]` link labels; optional `items` for authors, not rendered |
| FAQ count | **5–7** entries per pattern in `content.faqs` |

## SEO improvement themes to apply per pattern

Use these **themes** when drafting or expanding any category (adapt to the component):

1. **Intent**: What the searcher is trying to do (build FAQ UI, settings, pick single vs multi expand, compare to tabs/dialogs).
2. **Product context**: Real surfaces (dashboards, onboarding, help), not a toy demo.
3. **Stack cues**: React, Next.js, Tailwind, shadcn/ui, Radix where truthful.
4. **Accessibility**: Keyboard, focus, labels, screen readers (accurate, not boilerplate).
5. **Technical SEO (light)**: Visible content, thin pages, optional FAQ/schema alignment; Core Web Vitals when relevant to the component.
6. **Internal linking**: **`integrationBody`** and feature copy use **`[[slug|Label]]`** for companion categories.

### Depth targets (relative to a minimal stub)

- **`description`** and **`intro`**: about **2×** a one-line stub.
- **`content.summary`**: **2–3** short paragraphs (general information).
- **Sections**: **What Is** / **Why Use** at **2 paragraphs** each; **Features** via **`featureItems`**; **Integration** via **`relatedComponents`** (**2–3** paragraphs). **FAQ** last.

## Implementation map

| Concern | File |
|---------|------|
| Merge SEO from JSON | `oss/lib/registry.ts` |
| React `cache()` for SEO | `oss/lib/registry-seo-cache.ts` |
| Metadata + FAQ JSON-LD | `oss/app/(create)/patterns/[category]/page.tsx` |
| Sections, FAQ accordion, related block | `oss/app/(create)/patterns/components/pattern-category-seo-content.tsx` |
| Parse `[[slug\|Label]]` | `pattern-category-seo-content.tsx` (`renderSeoLinkedText`, `PatternCategoryRelatedComponents`) |
| Prev/next label `N Label Patterns` | `oss/app/(create)/patterns/components/pattern-category-pager.tsx` |

## Verification

- Parse: `JSON.parse` on **`seo.json`** after edits.
- **Em dash**: zero occurrences of `\u2014` in changed strings (ripgrep or small script).
- **Slugs**: `[[slug|Label]]` slugs must match real category names from the registry.
- **Link labels**: visible text after `|` should start with **Shadcn** for library components (e.g. `Shadcn Button`, not `Button`).
- **FAQs**: scan for **generic** questions that could apply to any pattern; replace using **`faq-research-subagent.md`** process.

## Related skills

- **`seo-audit`**: meta, headings, thin content, internal linking quality (see `references/cross-skills.md`).
- **`marketing-ideas`**: keyword clusters and angles only, no fluff.
- **`shadcn`** (`oss/.agents/skills/shadcn`): component purpose, CLI, composition (required for correct integration copy).
- **`ai-seo`**: optional answer-engine angles.

## Automation

- Run **`pnpm verify:seo`** after edits (`oss/scripts/verify-seo-json.mjs`): JSON validity, `[[slug|…]]` slugs, em dash, FAQ band warnings.

## Duplicate skill path

A shorter mirror lives at **`oss/.cursor/skills/reui-seo/SKILL.md`**. **This** `.agents` copy is canonical for full playbook + references; keep them aligned on hard rules.
