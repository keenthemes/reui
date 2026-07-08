import { defineConfig, defineDocs } from "fumadocs-mdx/config"
import rehypePrettyCode from "rehype-pretty-code"

import { transformers } from "./lib/highlight-code"

export const docs = defineDocs({
  dir: "content/docs",
  // Always use `async` mode (no dev-only `dynamic: true`). Dynamic mode
  // emits a top-level-await `export const docs = await create.docs(...)`
  // in `.source/dynamic`, which resolves to `undefined` under this app's
  // dev bundler (Turbopack + cacheComponents) — that 500'd every /docs
  // page and the sitemap (which walks doc URLs). Async mode emits a
  // TLA-free `.source/server` that works in dev and prod; doc content
  // still loads lazily per page, so the dev cost is negligible.
  docs: { async: true },
})

export default defineConfig({
  mdxOptions: {
    rehypePlugins: (plugins) => {
      plugins.shift()
      plugins.push([
        // TODO: fix the type.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypePrettyCode as any,
        {
          theme: {
            dark: "github-dark",
            light: "github-light-default",
          },
          transformers,
        },
      ])

      return plugins
    },
  },
})
