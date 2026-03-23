# ReUI pattern category SEO playbook

Use this when authoring or expanding **`oss/registry-reui/bases/seo.json`** entries for each pattern category (accordion, alert, button, …).

**Completed reference categories (accordion-style):** `accordion`, `alert`, `data-grid` (TanStack Table called out). Migrate the rest in batches using **`oss/.agents/workflows/reui-pattern-seo-orchestration.md`**.

## Standard page structure (accordion template)

Use this **order** in JSON and on the page:

1. **`content.title`**: Title Case. Use **"General Information"** (or **"{Component} Overview"**) for the guide block heading above the summary.
2. **`content.summary`**: **2–3 short paragraphs** only (general intro, what ReUI shows, pointer to sections below). Internal links: `[[slug|Shadcn Name]]` (see naming below).
3. **`content.sections`** (typically **3** blocks):
   - **What Is Shadcn {X}?** — 2 paragraphs, 2–3 max.
   - **Why Use Shadcn {X}?** — 2 paragraphs.
   - **Shadcn {X} Features** — **`featureItems`**: array of `{ "title": "Short label.", "description": "…" }` (title bold, description inline; links use **`[[slug|Shadcn Name]]`**).
4. **`relatedComponents`** (after sections, before FAQ in UI):
   - **`title`**: e.g. **"Integrating With Other Components"** (Title Case).
   - **`integrationBody`**: **2–3 paragraphs** with **`[[slug|Shadcn Name]]`** only. Mention components **in prose**; the site does **not** show a separate list of links.
   - **`items`**: optional in JSON for author reference only (not rendered).
5. **`content.faqs`**: **Last** on the page (accordion + FAQPage JSON-LD). **5–7** questions per pattern. **Each question must be a real user or search intent**, derived from research (Google, Stack Overflow, Quora) and from **component API / features** (shadcn docs + **`faq-research-subagent.md`** process). **Forbidden:** generic template FAQs copied across unrelated components (e.g. “Why include FAQs on pattern pages?”). No subtitle under the FAQ heading in the UI.

## Decisions already locked in (do not regress)

| Topic | Choice |
|--------|--------|
| Em dash | **Never** use `—` (U+2014). Use comma, period, colon, or two sentences. |
| Keyword badges on page | **Removed** from UI. Keep `keywords` in JSON for **`metadata.keywords`** only. |
| SEO section chrome | **No top border** on the pattern SEO block (muted background only). |
| Section titles | **Title Case**, same **visual size** as the guide title (`text-xl sm:text-2xl font-semibold`). |
| Related components | **`integrationBody`** only on page (no link list). Optional **`items`** in JSON for authors. |
| FAQ UI | **Accordion**. Heading: **"Frequently Asked Questions"** only (no subtitle). **5–7** FAQs. |
| SEO column width | **Fluid** within `max-w-7xl` (same as pattern grid), full width of column. |
| Component names | Always **Shadcn {Component}** in copy and link labels: e.g. `[[button|Shadcn Button]]`, `[[alert-dialog|Shadcn Alert Dialog]]`. |

## Length and density (targets)

- **`description` / `intro`**: Meta and hero; keep tight and accurate.
- **`content.summary`**: **~Half** the old long summaries: **3** short paragraphs max for the template.
- **Section bodies**: **Up to 2–3 paragraphs** per section (features use **featureItems** instead of long prose).
- **`integrationBody`**: **2–3 paragraphs**.

## Internal linking

- **`[[slug|Label]]`** only; **slug** is the registry category id (`button`, `alert-dialog`, `card`).
- **Label** (visible text) must use **Shadcn** + component name: **Shadcn Button**, **Shadcn Card**, **Shadcn Alert Dialog** (not bare "Button" or "Alert Dialog").
- Link companion categories in **`integrationBody`** and feature text; optional **`items`** in JSON only if you want a private checklist for authors.

## Quality checks before commit

1. `JSON.parse` on `seo.json`.
2. No **U+2014** in new strings.
3. **`relatedComponents`**: **`integrationBody`** present when the block exists; **`items`** optional.
4. **`content.faqs`**: **5–7** entries; questions are **research-backed** and **component-specific** (see **`faq-research-subagent.md`**).
5. Link labels use **Shadcn** prefix (spot-check `[[…|…]]` in new strings).
6. No **boilerplate** FAQ titles that could apply to any component without editing.

## Code map

| Piece | Location |
|--------|----------|
| Inline `[[slug|Label]]` | `pattern-category-seo-content.tsx` (`renderSeoLinkedText`, summary, sections, integration) |
| SEO block layout | `pattern-category-seo-content.tsx` |
| Related list + integration | `pattern-category-seo-content.tsx` (`PatternCategoryRelatedComponents`) |

## Cursor rule

`.cursor/rules/reui-seo.mdc`
