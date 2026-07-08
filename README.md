# ReUI

**Free, open-source shadcn/ui components and in-house primitives for building production-ready React apps faster.**

ReUI is a component library for the [shadcn/ui](https://ui.shadcn.com) ecosystem: **1,000+ copy-paste component examples** across 69 categories, plus **17 in-house primitives** that are not part of base shadcn/ui - Data Grid, Kanban, Filters, Stepper, Tree, Timeline, and more. Every primitive ships in both **Radix UI** and **Base UI** flavors, fully documented.

- **Live site** - [reui.io](https://reui.io)
- **Docs** - [reui.io/docs](https://reui.io/docs)
- **Components** - [reui.io/components](https://reui.io/components)

This repository is the public, open-source site: the marketing landing page, the docs, and the free component/primitive catalog. It is MIT licensed and runs locally with zero configuration.

---

## Quick start

Requires **Node.js 18+** and **pnpm**.

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

### Scripts

Everyday:

| Script | Description |
| --- | --- |
| `pnpm dev` | Start the dev server (consumes the already-built preview bundles) |
| `pnpm dev:packages` | Dev server **plus** a watcher that rebuilds the preview bundles on source change — use when editing component source |
| `pnpm build` | Production build (regenerates the full registry first, automatically) |
| `pnpm start` | Serve the production build |
| `pnpm lint` / `pnpm lint:fix` | Lint the project |
| `pnpm typecheck` | Type-check the project |
| `pnpm format:write` / `pnpm format:check` | Format with Prettier |

---

## Registry & component build tasks

The catalog is **generated** from the source in `registry-reui/` by four tools in `scripts/`. You rarely run these by hand — `dev`, `dev:packages`, and `build` wire them up for you — but here is what each produces and when you'd invoke it manually.

| Task | Produces | Run it when |
| --- | --- | --- |
| `pnpm components:build` | Component **metadata** — category shards + counts under `registry-reui/_meta/components/`. Feeds the listing pages, category counts, and search. Runs automatically on `postinstall` and before `dev`. | Almost never by hand — it's already wired into install and dev. |
| `pnpm components:packages` | The pre-bundled **preview packages** (`packages/registry/bases/**/dist/`) that the live previews import, and rewires the generated loader map + workspace deps. | Once after a fresh clone, and whenever you **add / rename / delete component source** — otherwise the component and preview pages can't render. |
| `pnpm components:packages:watch` <br>(alias `pnpm registry:watch`) | The same preview bundles, rebuilt on every source change. This is the watcher that runs inside `dev:packages`. | Only inside `dev:packages`; you won't call it alone. |
| `pnpm registry:build` | The public **shadcn registry** JSON in `public/r/styles/**` that the shadcn CLI serves (`npx shadcn add @reui/...`). | When you want to test CLI installs of changed components locally. |
| `pnpm registry:verify` | Validation of the generated `public/r/**` registry JSON (non-empty file entries, valid dependency arrays). | In CI, or to sanity-check a registry build. |

Composite tasks just chain the above:

| Task | Equivalent to | Used by |
| --- | --- | --- |
| `pnpm registry:prod` | `components:build` → `components:packages` → `registry:build` | Runs automatically before `pnpm build`. |
| `pnpm registry:all` | `registry:prod` → `registry:verify` | The full, verified pipeline. |
| `pnpm build:local` | `registry:all` → `next build` | A from-scratch production build, verified, run locally. |

### Which task do I run?

- **Just running the site** → `pnpm dev`
- **Editing component source or previews** → `pnpm dev:packages`
- **Fresh clone, or a component / category page won't load** → `pnpm components:packages` once, then `pnpm dev`
- **Testing `npx shadcn add @reui/...` locally** → `pnpm registry:build`
- **Production build** → `pnpm build` (the registry pipeline runs for you)

> [!NOTE]
> Plain `pnpm dev` does **not** rebuild the preview bundles — it uses whatever is in `packages/registry/bases/**/dist/`. If a bundle is missing or stale, that category page hangs while compiling (with a `Module not found: @reui/components-...` in the dev logs). Fix it by running `pnpm components:packages` (or `pnpm dev:packages`) and restarting. If Turbopack itself panics after many rebuilds, stop the server, `rm -rf .next`, and restart.

---

## Using ReUI components

ReUI is installed with the [shadcn CLI](https://ui.shadcn.com/docs/cli) - no npm package, no lock-in. Add the registry namespace to your `components.json`:

```json
{
  "registries": {
    "@reui": "https://reui.io/r/{style}/{name}.json"
  }
}
```

Then install any component:

```bash
npx shadcn@latest add @reui/c-data-grid-1
```

See the [Get Started guide](https://reui.io/docs/get-started) for the full walkthrough.

---

## Project structure

```
app/                 Next.js App Router - landing (/), components, docs, preview
components/          Site UI (nav, footer, landing sections, docs chrome)
content/docs/        MDX docs (getting started + component pages, base + radix)
lib/                 Registry, docs, and site helpers
registry/            Base shadcn registry (primitives, themes, styles, fonts)
registry-reui/       ReUI component sources + generated component metadata
packages/            Vendored workspace packages:
  shared/              small shared utilities (@reui/shared)
  registry/            pre-built component packages the live previews import
public/r/            Generated component registry the shadcn CLI serves
scripts/             Registry build tooling
```

Built with **Next.js**, **React 19**, **Tailwind CSS v4**, and **Fumadocs**.

---

## Contributing

Contributions are welcome - see [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

[MIT](./LICENSE.md) © Keenthemes. Free and open-source, forever.

Reach us at [@reui_io](https://x.com/reui_io) or [hello@reui.io](mailto:hello@reui.io).
