import "server-only"

import { loader } from "fumadocs-core/source"

// Always load the generated `server` source in both dev and prod.
//
// The `dynamic` dev variant (fumadocs-mdx) exposes the collection via a
// top-level `await create.docs(...)` export, which resolves to
// `undefined` under this app's dev bundler (Turbopack + cacheComponents).
// That made `docsSource.toFumadocsSource()` throw and 500'd every
// /docs page — and the sitemap, which walks doc URLs via
// `source.getPages()`. The `server` build is what production already
// uses and has no top-level await, so it works in both environments.
// Trade-off: docs MDX compiles eagerly in dev instead of lazily, which
// is a negligible cost for this content set and worth the correctness.
import { docs } from "../.source/server"

export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
})
