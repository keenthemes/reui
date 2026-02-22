/**
 * sync-registry.mts
 *
 * Syncs registry content from shadcn/apps/v4/registry → registry/
 *
 * Usage:
 *   pnpm sync:registry           # sync changed/new files
 *   pnpm sync:registry -- --dry  # preview without writing
 */

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DRY = process.argv.includes("--dry")
const VERBOSE = process.argv.includes("--verbose")

const PROJECT_ROOT = path.resolve(__dirname, "..")
const REPO_ROOT = path.resolve(PROJECT_ROOT, "..")
const SOURCE_DIR = path.resolve(REPO_ROOT, "shadcn/apps/v4/registry")
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

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Stats {
  added: number
  updated: number
  unchanged: number
  deleted: number
  skipped: number
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function* walk(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) yield* walk(full)
    else yield full
  }
}

function filesMatch(a: string, b: string): boolean {
  if (!fs.existsSync(b)) return false
  return fs.readFileSync(a).equals(fs.readFileSync(b))
}

function logLine(symbol: string, relPath: string) {
  console.log(`  ${symbol} ${relPath}`)
}

// ---------------------------------------------------------------------------
// Sync a single file src → dest, returns change type
// ---------------------------------------------------------------------------

function syncFile(src: string, dest: string, stats: Stats) {
  const rel = path.relative(DEST_DIR, dest)
  const exists = fs.existsSync(dest)

  if (exists && filesMatch(src, dest)) {
    stats.unchanged++
    if (VERBOSE) logLine("·", rel)
    return
  }

  if (!exists) {
    if (!DRY) {
      fs.mkdirSync(path.dirname(dest), { recursive: true })
      fs.copyFileSync(src, dest)
    }
    stats.added++
    logLine("+", rel)
  } else {
    if (!DRY) fs.copyFileSync(src, dest)
    stats.updated++
    logLine("~", rel)
  }
}

// ---------------------------------------------------------------------------
// Sync a directory src → dest (copy new/changed, remove orphaned dest files)
// ---------------------------------------------------------------------------

function syncDirectory(srcDir: string, destDir: string, stats: Stats) {
  if (!fs.existsSync(srcDir)) {
    stats.skipped++
    logLine("!", `${path.relative(DEST_DIR, destDir)} (source not found)`)
    return
  }

  // Forward pass: add / update
  const srcRelPaths = new Set<string>()
  for (const srcFile of walk(srcDir)) {
    const rel = path.relative(srcDir, srcFile)
    srcRelPaths.add(rel)
    syncFile(srcFile, path.join(destDir, rel), stats)
  }

  // Backward pass: remove orphaned files in dest
  if (fs.existsSync(destDir)) {
    for (const destFile of walk(destDir)) {
      const rel = path.relative(destDir, destFile)
      if (!srcRelPaths.has(rel)) {
        const display = path.relative(DEST_DIR, destFile)
        if (!DRY) fs.rmSync(destFile, { force: true })
        stats.deleted++
        logLine("-", display)
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function sync() {
  const label = DRY ? "[DRY RUN] " : ""
  const srcLabel = path.relative(REPO_ROOT, SOURCE_DIR)
  const destLabel = path.relative(REPO_ROOT, DEST_DIR)
  console.log(`\n${label}Syncing registry: ${srcLabel} → ${destLabel}\n`)

  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`  Source not found: ${SOURCE_DIR}`)
    process.exit(1)
  }

  if (!fs.existsSync(DEST_DIR)) {
    if (!DRY) fs.mkdirSync(DEST_DIR, { recursive: true })
    console.log(`  Created: ${DEST_DIR}`)
  }

  const totals: Stats = { added: 0, updated: 0, unchanged: 0, deleted: 0, skipped: 0 }

  for (const item of SYNC_ITEMS) {
    const srcPath = path.join(SOURCE_DIR, item)
    const destPath = path.join(DEST_DIR, item)

    if (!fs.existsSync(srcPath)) {
      console.warn(`  ! ${item} (source not found — skipping)`)
      totals.skipped++
      continue
    }

    const stat = fs.statSync(srcPath)
    if (stat.isDirectory()) {
      syncDirectory(srcPath, destPath, totals)
    } else {
      syncFile(srcPath, destPath, totals)
    }
  }

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------

  const changed = totals.added + totals.updated + totals.deleted
  console.log("\n──────────────────────────────────────────────")
  console.log(`  Sync complete: ${srcLabel} → ${destLabel}`)
  if (changed === 0 && totals.skipped === 0) {
    console.log("  ✓ Everything is already up to date.")
  } else {
    if (totals.added > 0) console.log(`  + ${totals.added} added`)
    if (totals.updated > 0) console.log(`  ~ ${totals.updated} updated`)
    if (totals.deleted > 0) console.log(`  - ${totals.deleted} deleted`)
    if (totals.unchanged > 0) console.log(`  · ${totals.unchanged} unchanged`)
    if (totals.skipped > 0) console.log(`  ! ${totals.skipped} skipped`)
    if (DRY) console.log("\n  (dry run — no files written)")
  }
  console.log("──────────────────────────────────────────────\n")
}

sync().catch((err) => {
  console.error("Error syncing registry:", err)
  process.exit(1)
})
