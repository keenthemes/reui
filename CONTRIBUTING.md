# Contributing to ReUI

Thanks for your interest in improving ReUI! This repository hosts the public,
open-source ReUI site and the free component catalog.

## Getting started

1. Fork and clone the repository.
2. Install dependencies with `pnpm install`.
   (`postinstall` runs `fumadocs-mdx` and `components:build`, which generate the
   registry metadata + preview loaders — no extra setup needed.)
3. Start the dev server with `pnpm dev` and open http://localhost:3000.

Everything the site needs is built from source inside this repository — there
are no external services or private packages to fetch.

## How the registry is built

The free ReUI surface is a shadcn-compatible registry generated entirely from
sources in this repo by four scripts in [`scripts/`](./scripts):

| Source you edit | Script | Generates |
| --- | --- | --- |
| `registry/bases/<base>/{ui,hooks,lib}`, `registry-reui/bases/<base>/reui` — **reui primitives** | `build-registry.mts` | `public/r/styles/**` (style-aware) |
| `registry-reui/bases/<base>/components/<category>/c-*.tsx` + `meta.json` — **examples** | `build-components.mts` → `build-component-packages.mts` | `registry-reui/_meta/**`, `lib/generated/component-preview-loaders/**`, `packages/registry/**`, `public/r/styles/**` |

`base` and `radix` are the two design bases; styles come from
`registry/styles.tsx`. Scripts only ever read/write paths inside this repo.

Useful commands:

- `pnpm dev` — dev server. Edits to any primitive or `c-*` example are compiled
  by Next directly, so changes show up instantly (no rebuild step).
- `pnpm dev:packages` — dev with the workspace component packages rebuilt on
  change via esbuild (`--watch`), matching the production bundling path.
- `pnpm registry:build` — regenerate `public/r/styles/**`.
- `pnpm registry:all` — full regenerate + `registry:verify` production gate.
- `pnpm components:packages` — (re)build the `@reui/components-*` workspace
  packages the live previews import (`dist/` is git-ignored and rebuilt).
- `pnpm build` — production build. `prebuild` runs `registry:prod`
  (`components:build` → `components:packages` → `registry:build`) first, so a
  deploy always ships a freshly generated registry.

### Adding a new example or component category

Add your `c-*.tsx` under `registry-reui/bases/<base>/components/<category>/`
(and a `meta.json` entry), then run `pnpm registry:all`. If you introduce a
brand-new category, also run `pnpm install` once so pnpm links the new
`@reui/components-<base>-<category>` workspace package.

## Before you open a pull request

- Run `pnpm lint` and `pnpm typecheck`.
- Run `pnpm build` to confirm the production build passes.
- If you changed the registry, run `pnpm registry:all` and commit the
  regenerated `public/r/styles/**` and `registry-reui/_meta/**`.
- Keep changes focused and describe the motivation in your PR.

## Reporting issues

Open an issue on [GitHub](https://github.com/keenthemes/reui/issues) with clear
reproduction steps. For questions, reach us at
[@reui_io](https://x.com/reui_io) or [hello@reui.io](mailto:hello@reui.io).

## License

By contributing, you agree that your contributions are licensed under the
[MIT License](./LICENSE.md).
