import { type RegistryItem } from "shadcn/schema"

import { BASES } from "@/registry/bases"

export async function formatCode(code: string, styleName: string) {
  // First, transform style-specific classNames
  code = transformStyleClassNames(code, styleName)

  code = code.replaceAll(`@/registry/${styleName}/`, "@/components/")

  for (const base of BASES as RegistryItem[]) {
    code = code.replaceAll(`@/registry/bases/${base.name}/`, "@/components/")
    code = code.replaceAll(
      `@/registry-reui/bases/${base.name}/`,
      "@/components/"
    )
  }

  code = code.replaceAll("export default", "export")

  return code
}

/**
 * Transforms style-specific class names based on the current style.
 * Finds ALL string literals (in any context — className, cn(), cva(), etc.)
 * containing "style-*:" prefixed tokens, keeps only the classes matching
 * the current style (with the prefix stripped), and removes the rest.
 * Empty strings left after stripping are cleaned up.
 *
 * Examples:
 *   className="base style-vega:bg-white style-nova:bg-black"
 *     → (nova) className="base bg-black"
 *
 *   cn("style-vega:px-2 style-vega:py-1", "style-nova:px-3 style-nova:py-2")
 *     → (nova) cn("px-3 py-2")   // the vega-only string + its line removed
 *
 *   cva(["style-vega:shadow-xs"])
 *     → (nova) cva([])            // empty string entry removed
 */
export function transformStyleClassNames(
  code: string,
  styleName: string
): string {
  // Extract the visual style name (e.g., "nova" from "radix-nova")
  const style = styleName.split("-").pop() || styleName
  const stylePrefix = `style-${style}:`

  // Step 1: Transform style-* tokens inside ALL string literals.
  // Matches double-quoted, single-quoted, and backtick strings containing "style-".
  // IMPORTANT: \n is included in the negated character classes to prevent the regex
  // from matching across line boundaries (which would collapse multi-line code blocks
  // into a single line when .split(/\s+/).join(" ") runs on the captured content).
  code = code.replace(
    /"([^"\n]*style-[^"\n]*)"|'([^'\n]*style-[^'\n]*)'|`([^`\n]*style-[^`\n]*)`/g,
    (match, dq, sq, bt) => {
      const content = dq ?? sq ?? bt
      const quote = dq !== undefined ? '"' : sq !== undefined ? "'" : "`"

      const resolved = content
        .split(/\s+/)
        .map((cls: string) => {
          if (cls.startsWith("style-")) {
            return cls.startsWith(stylePrefix)
              ? cls.slice(stylePrefix.length)
              : null
          }
          return cls
        })
        .filter(Boolean)
        .join(" ")
        .trim()

      return `${quote}${resolved}${quote}`
    }
  )

  // Step 2: Remove lines that are now just empty string entries ("" or '')
  // with an optional trailing comma — leftover from fully-stripped style strings.
  code = code.replace(/^\s*(?:""|'')\s*,?\s*\n/gm, "")

  // Step 3: Collapse 3+ consecutive newlines into one blank line.
  code = code.replace(/\n{3,}/g, "\n\n")

  return code
}
