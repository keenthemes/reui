---
name: reui-seo
description: Writes ReUI pattern-category SEO (seo.json). Use when editing pattern SEO or seo.json; follow accordion, alert, and data-grid examples, run verify:seo, and read cross-skills + orchestration workflow.
---

# ReUI SEO skill (short)

**Canonical:** `oss/.agents/skills/reui-seo/SKILL.md` (v1.2.0) + `references/pattern-seo-playbook.md` + **`references/cross-skills.md`** (seo-audit, marketing-ideas, shadcn, Context7).

**Examples in `seo.json`:** `accordion`, **`alert`**, **`data-grid`** (TanStack Table, WAI-ARIA, Base UI, Radix, Shadcn Create, CLI keywords).

**Verify:** `pnpm verify:seo` → `oss/scripts/verify-seo-json.mjs`

**FAQ Research Sub-Agent:** `oss/.agents/skills/reui-seo/references/faq-research-subagent.md` (Google, Stack Overflow, Quora + API). Run **before** writing `content.faqs`.

**Long-running workflow:** `oss/.agents/workflows/reui-pattern-seo-orchestration.md` (planner, **FAQ researcher**, writer, reviewer, **6 passes** including FAQ relevance).

**Cursor rule:** `.cursor/rules/reui-seo.mdc`
