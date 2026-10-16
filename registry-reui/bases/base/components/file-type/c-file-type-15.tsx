import {
  FileType,
  getFileType,
} from "@/registry-reui/bases/base/reui/file-type"

// Names as a repository lists them. Most have no extension of their own, or
// one no type owns (".local"), and getFileType still reads the type from the
// whole name: Dockerfile, .env.local, .gitignore.
const FILES = [
  ".env.local",
  ".gitignore",
  ".dockerignore",
  "Dockerfile",
  "Makefile",
  "wrangler.toml",
  "schema.prisma",
  "main.tf",
  "App.vue",
  "schema.graphql",
  "train.ipynb",
  "model.safetensors",
]

export default function Pattern() {
  return (
    <div className="@container mx-auto w-full max-w-lg">
      <ul
        aria-label="Repository files"
        className="grid gap-x-6 gap-y-3 @md:grid-cols-2"
      >
        {FILES.map((name) => (
          <li key={name} className="flex min-w-0 items-center gap-3">
            <FileType type={getFileType(name)} />
            <span className="truncate text-sm" title={name}>
              {name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
