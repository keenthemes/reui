# ReUI pattern SEO orchestration (multi-agent + 6-pass review)

Use this workflow when **revising `oss/registry-reui/bases/seo.json`** for many categories, aligned with the **accordion** reference and **`oss/.agents/skills/reui-seo`**.

## Roles

| Role | Responsibility |
|------|------------------|
| **Main planner** | Chooses batch order (by traffic, component complexity, or alphabetical), defines acceptance criteria per category, assigns special cases (e.g. `data-grid` + TanStack Table). **Assigns FAQ Research Sub-Agent before Writer** when FAQs are new or replaced. |
| **FAQ Research Sub-Agent** | **Runs first** per category (or per batch). Investigates **real user questions** via **Google** (SERP, People Also Ask, related searches), **Stack Overflow**, **Quora** (secondary), plus **component API / features** from shadcn docs and **`oss/.agents/skills/shadcn`**. Delivers **5–7 ranked FAQ candidates** with evidence lines for the Writer. See **`oss/.agents/skills/reui-seo/references/faq-research-subagent.md`**. |
| **Sub-agent (writer)** | Rewrites one category at a time: `description`, `intro`, `keywords`, `content` (title, summary, What Is / Why Use / Features), **`faqs`** (from Research handoff only), `relatedComponents` when needed. Follows **reui-seo** + **shadcn** skill. Uses **Context7** MCP for upstream docs when a claim needs verification (Radix, TanStack Table, React). **Does not invent generic FAQs.** |
| **Reviewer** | Runs verification passes below, rejects until passes succeed or documents exceptions. **Fails** batches that still contain obvious template FAQs unrelated to the component API. |

## Inputs (read before writing)

1. **Gold reference**: `seo.json` → **`accordion`** (user-maintained template).
2. **`oss/.agents/skills/reui-seo/`** (SKILL + `references/pattern-seo-playbook.md`).
3. **`oss/.agents/skills/shadcn/SKILL.md`** + `rules/*.md` for composition, forms, Base vs Radix.
4. **`oss/lib/seo.ts`** → `isCanonicalComponentDoc` slugs (where `/docs/components/base/...` links resolve).
5. **`oss/registry-reui/bases/registry.json`** → valid category `name` slugs for `[[slug|Shadcn Label]]`.
6. Optional: **`seo-audit`** skill for SERP/meta/heading checks; **`marketing-ideas`** for keyword clusters and positioning language (not for fluff).
7. **Context7 MCP**: confirm technical statements (e.g. TanStack Table APIs, Radix primitives) when the writer is unsure.
8. **`references/faq-research-subagent.md`**: mandatory process for **FAQ Research Sub-Agent** before Writer fills `content.faqs`.

## Structure every category should move toward

- **`content.title`**: Descriptive H2-style title (see accordion: `Shadcn Accordion: Build Interactive Collapsible Sections`) or **General Information** pattern.
- **`summary`**: 2–3 paragraphs: stack (WAI-ARIA, Base UI, Radix UI, Shadcn Create / style panel above patterns), React + Tailwind + CLI where relevant, then product context.
- **Sections**: **What Is Shadcn {X}?**, **Why Use Shadcn {X}?**, **Shadcn {X} Features** (`featureItems` bullets: include WAI-ARIA, customization, Base/Radix compatibility, Shadcn styles / customizer CTA).
- **`relatedComponents`** (recommended for main primitives): **Integrating With Other Components** + `integrationBody` with valid `[[slug|Shadcn Name]]` only.
- **`faqs`**: **5–7** items, **each question must be research-backed and component-specific** (see FAQ Research Sub-Agent). No generic “why FAQs exist” copy unless uniquely justified.

## Five verification passes (run each time before merge)

Repeat up to **5 rounds** per batch: fix findings, re-run until clean or capped. **Pass 6 (FAQ relevance)** may trigger extra rounds focused only on `content.faqs`.

| Pass | Checks |
|------|--------|
| **1. Mechanical** | `node oss/scripts/verify-seo-json.mjs` (JSON, link slugs, Shadcn label prefix warnings, em dash count, FAQ count band). |
| **2. Links** | Every `[[slug|…]]` resolves to an existing registry category; labels match **Shadcn** naming rule. |
| **3. Technical** | Claims match **shadcn** skill + Context7 (e.g. data-grid + TanStack, dialog requires title, forms use Field). No invented APIs. |
| **4. SEO / marketing** | Unique `description`/`intro`; keywords specific to the component; no duplicate boilerplate across unrelated categories (**seo-audit** themes). |
| **5. Integration copy** | Related components named in prose are real pairings (Alert + Button, Data grid + Pagination, etc.). |
| **6. FAQ relevance** | Each `faq.question` sounds like a **real user or search query** for **this** component. **Reject** generic template questions (e.g. “Why include FAQs on pattern pages?”) unless rewritten to be component-specific. Confirm answers match **API / behavior** from shadcn skill + docs. Spot-check that Research Sub-Agent evidence could exist for each question. |

## Special cases

- **`data-grid`**: Mention **TanStack Table** (React) for headless table logic, column defs, sorting/filtering; borders and density via Tailwind + shadcn tokens; keyboard and WAI-ARIA for grid semantics where applicable.
- **Canonical doc components** (`data-grid`, `alert`, … per `seo.ts`): internal links to those slugs go to **`/docs/components/base/{slug}`** automatically.

## Long-running execution

1. Planner opens a tracking table (category → **FAQ research** → draft → review → pass number).
2. **FAQ Research Sub-Agent** completes research handoff for each category in the batch (or parallelizes by sub-batch if tooling allows).
3. Writer merges copy + FAQs; Reviewer runs **all 6 passes** (including FAQ relevance).
4. After each batch, commit; re-run full `verify-seo-json.mjs` on whole file.

## Related paths

- Script: `oss/scripts/verify-seo-json.mjs`
- FAQ Research spec: `oss/.agents/skills/reui-seo/references/faq-research-subagent.md`
- Cursor rule: `.cursor/rules/reui-seo.mdc`
