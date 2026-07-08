import { isPresetCode } from "shadcn/preset"

/**
 * Accepts a raw preset string or a `--preset <code>` CLI flag and
 * returns just the code if it's well-formed, or `null` otherwise.
 *
 * Mirrors the upstream shadcn create helper so users can paste either
 * the bare code or copy the entire flag from a terminal.
 */
const PRESET_FLAG_PATTERN = /^--preset\b\s+(.+)$/i

export function parsePresetInput(value: string): string | null {
  const input = value.trim()
  if (!input) return null

  const preset = input.match(PRESET_FLAG_PATTERN)?.[1]?.trim() ?? input

  return isPresetCode(preset) ? preset : null
}
