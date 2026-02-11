import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const PROJECT_ROOT = path.resolve(__dirname, "..")
const SOURCE_DIR = path.resolve(PROJECT_ROOT, "../shadcn/apps/v4/registry")
const DEST_DIR = path.resolve(PROJECT_ROOT, "registry")

const SYNC_ITEMS = [
  "bases/base/hooks",
  "bases/base/lib",
  "bases/base/ui",
  "bases/radix/hooks",
  "bases/radix/lib",
  "bases/radix/ui",
  "icons",
  "styles",
  "base-colors.ts",
  "bases.ts",
  "config.ts",
  "fonts.ts",
  "styles.tsx",
  "themes.ts",
]

async function sync() {
  console.log(`Syncing registry from ${SOURCE_DIR} to ${DEST_DIR}`)

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Source directory not found: ${SOURCE_DIR}`)
    process.exit(1)
  }

  if (!fs.existsSync(DEST_DIR)) {
    console.log(`Creating destination directory: ${DEST_DIR}`)
    fs.mkdirSync(DEST_DIR, { recursive: true })
  }

  for (const item of SYNC_ITEMS) {
    const sourcePath = path.join(SOURCE_DIR, item)
    const destPath = path.join(DEST_DIR, item)

    if (fs.existsSync(sourcePath)) {
      console.log(`Syncing ${item}...`)

      // Clear existing item
      if (fs.existsSync(destPath)) {
        fs.rmSync(destPath, { recursive: true, force: true })
      }

      // Copy from source to destination
      fs.cpSync(sourcePath, destPath, { recursive: true })
      console.log(`  Successfully synced ${item}`)
    } else {
      console.warn(`  Source item ${sourcePath} does not exist. Skipping...`)
    }
  }

  console.log("\nSync completed successfully!")
}

sync().catch((err) => {
  console.error("Error syncing shadcn registry:", err)
  process.exit(1)
})
