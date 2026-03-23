# FAQ Research Sub-Agent (reui-seo)

**Assign this role** before the **Writer** drafts or replaces `content.faqs` for a pattern category. Goal: **real user questions**, not template filler.

## Mission

Produce **5–7 FAQ candidates** per component that reflect:

- What people **actually search** and **ask** in public Q&A
- What breaks or confuses developers when using **shadcn/ui**, **Radix**, **React**, or **Tailwind** with this primitive
- What the **component API and behavior** require (install, SSR, accessibility, composition)

## Inputs (mandatory)

1. **Registry slug** (e.g. `button`, `data-grid`, `alert-dialog`).
2. **`oss/.agents/skills/shadcn/SKILL.md`** + relevant `rules/*.md` for composition constraints.
3. **Upstream component reality**: `npx shadcn@latest docs <component>` or project registry source for props, variants, and known caveats.
4. **ReUI patterns** for that category in `patterns.json` / live `/patterns/{slug}` if you need phrasing for “in context” answers.

## Research channels (use several, not one)

| Source | What to extract |
|--------|------------------|
| **Google** | “People also ask”, related searches, titles of top results for queries like `shadcn {component}`, `{component} radix accessibility`, `tailwind {component} react`. Prefer question-shaped queries. |
| **Stack Overflow** | Questions with votes about React + Radix + shadcn, TanStack (for table/grid), form libraries (for Field/Input). Note recurring errors (hydration, focus trap, controlled state). |
| **Quora** | Broader “when to use X vs Y” and beginner framing; use sparingly, validate technically. |
| **GitHub** | Issues/discussions on `shadcn/ui` or Radix for this primitive (breaking changes, FAQs in README). |

## Anti-patterns (reject)

- **Generic** FAQs reused across unrelated components, e.g. “Why include FAQs on pattern pages?”, “How do these patterns help product teams?” without component-specific detail.
- **Vague** questions that any UI library could answer without naming behavior.
- **Invented** API claims; every answer must be defensible via docs or the shadcn skill.

## Output format (handoff to Writer)

For each candidate FAQ:

1. **Question** (natural language, matches search intent).
2. **Answer outline** (bullet facts to expand into JSON `answer` string).
3. **Evidence** (one line: e.g. “Stack Overflow #…”, “Google PAA”, “shadcn docs: variants”).
4. **Priority** (P1–P3); Writer keeps top **5–7** after deduping.

## Example good vs bad

| Bad | Good |
|-----|------|
| “Why include FAQs on pattern pages?” | “How do I add Shadcn Button with an icon using `data-icon`?” |
| “Can I use these with Next.js?” (alone) | “Does Shadcn Dialog require a title for accessibility?” (specific to Alert Dialog / Dialog rules) |
| Random comparison | “When should I use Shadcn Accordion vs Tabs?” (intent-heavy, answer with real UX tradeoffs) |

## Handoff

The **Main planner** assigns **FAQ Research Sub-Agent** → output file or ticket → **Writer** merges into `seo.json` → **Reviewer** runs **FAQ relevance pass** (see orchestration workflow).
