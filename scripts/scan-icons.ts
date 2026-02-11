import fs from "fs"
import path from "path"
import { glob } from "glob"
import {
  JsxOpeningElement,
  JsxSelfClosingElement,
  Project,
  SyntaxKind,
} from "ts-morph"

// Only scan base folder - radix is a mirror created by migrate-radix.mts
const TARGET_DIR = "registry-reui/bases/base"
const OUTPUT_FILE = "registry/icons/scanned-icons.json"
const UNMAPPED_OUTPUT_FILE = "registry/icons/unmapped-icons.json"

async function scanIcons() {
  console.log("Scanning for IconPlaceholder and Lucide icons in", TARGET_DIR)
  const files = await glob(`${TARGET_DIR}/**/*.tsx`)

  const project = new Project({
    compilerOptions: {
      jsx: 1, // Preserve
    },
  })

  const matches: any[] = []
  const unmappedMatches: any[] = []

  for (const file of files) {
    const content = fs.readFileSync(file, "utf-8")

    // We only process files that actually mention "IconPlaceholder" or "lucide-react" to save time
    const hasPlaceholder = content.includes("IconPlaceholder")
    const hasLucide = content.includes("lucide-react")

    if (!hasPlaceholder && !hasLucide) continue

    const sourceFile = project.createSourceFile("temp.tsx", content, {
      overwrite: true,
    })

    // 1. Scan for IconPlaceholder (Mapped)
    if (hasPlaceholder) {
      const placeholders = sourceFile
        .getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement)
        .filter(
          (el) => el.getTagNameNode().getText() === "IconPlaceholder"
        ) as JsxSelfClosingElement[]

      // Also check opening elements if it's not self-closing (though it should be)
      const openingPlaceholders = sourceFile
        .getDescendantsOfKind(SyntaxKind.JsxOpeningElement)
        .filter(
          (el) => el.getTagNameNode().getText() === "IconPlaceholder"
        ) as JsxOpeningElement[]

      const allPlaceholders = [...placeholders, ...openingPlaceholders]

      for (const placeholder of allPlaceholders) {
        const attrs: any = { _path: file }
        placeholder.getAttributes().forEach((attr) => {
          if (attr.getKind() === SyntaxKind.JsxAttribute) {
            const jsxAttr = attr.asKindOrThrow(SyntaxKind.JsxAttribute)
            const name = jsxAttr.getNameNode().getText()
            const initializer = jsxAttr.getInitializer()

            if (initializer) {
              if (initializer.getKind() === SyntaxKind.StringLiteral) {
                attrs[name] = initializer
                  .asKindOrThrow(SyntaxKind.StringLiteral)
                  .getLiteralValue()
                  .trim()
              } else if (initializer.getKind() === SyntaxKind.JsxExpression) {
                const expr = initializer
                  .asKindOrThrow(SyntaxKind.JsxExpression)
                  .getExpression()
                if (expr && expr.getKind() === SyntaxKind.StringLiteral) {
                  attrs[name] = expr
                    .asKindOrThrow(SyntaxKind.StringLiteral)
                    .getLiteralValue()
                    .trim()
                }
              }
            }
          }
        })
        matches.push(attrs)
      }
    }

    // 2. Scan for direct Lucide usages (Unmapped) using ts-morph
    if (hasLucide) {
      const lucideImports = sourceFile
        .getImportDeclarations()
        .filter((imp) => imp.getModuleSpecifierValue() === "lucide-react")

      if (lucideImports.length > 0) {
        const importedNames = new Map<string, string>() // localName -> originalName

        for (const imp of lucideImports) {
          // Named imports: import { Check, X as Close } from "lucide-react"
          imp.getNamedImports().forEach((named) => {
            const originalName = named.getName()
            const localName = named.getAliasNode()?.getText() || originalName
            if (
              originalName !== "LucideProps" &&
              originalName !== "LucideIcon"
            ) {
              importedNames.set(localName, originalName)
            }
          })

          // Star import: import * as Lucide from "lucide-react"
          const namespaceImport = imp.getNamespaceImport()
          if (namespaceImport) {
            const starName = namespaceImport.getText()
            sourceFile
              .getDescendantsOfKind(SyntaxKind.PropertyAccessExpression)
              .forEach((prop) => {
                if (prop.getExpression().getText() === starName) {
                  const iconName = prop.getName().trim()
                  if (iconName && /^[A-Z]/.test(iconName)) {
                    unmappedMatches.push({
                      icon: iconName,
                      _path: file,
                    })
                  }
                }
              })
          }
        }

        // Find all usages of named imports
        if (importedNames.size > 0) {
          sourceFile
            .getDescendantsOfKind(SyntaxKind.Identifier)
            .forEach((ident) => {
              const localName = ident.getText().trim()
              if (importedNames.has(localName)) {
                const parent = ident.getParent()
                if (!parent) return

                const kind = parent.getKind()
                // Skip declarations and type references
                if (
                  kind === SyntaxKind.ImportSpecifier ||
                  kind === SyntaxKind.TypeReference ||
                  kind === SyntaxKind.InterfaceDeclaration ||
                  kind === SyntaxKind.TypeAliasDeclaration
                )
                  return

                const iconName = importedNames.get(localName)?.trim()
                if (iconName && /^[A-Z]/.test(iconName)) {
                  unmappedMatches.push({
                    icon: iconName,
                    localName: localName !== iconName ? localName : undefined,
                    _path: file,
                  })
                }
              }
            })
        }
      }
    }

    // Cleanup to prevent memory leaks
    project.removeSourceFile(sourceFile)
  }

  // Save results
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(matches, null, 2))
  fs.writeFileSync(
    UNMAPPED_OUTPUT_FILE,
    JSON.stringify(unmappedMatches, null, 2)
  )

  console.log(`\nScan Summary:`)
  console.log(`- Mapped (IconPlaceholder): ${matches.length}`)
  console.log(`- Unmapped (lucide-react): ${unmappedMatches.length}`)

  console.log(
    `\nFull reports saved to ${OUTPUT_FILE} and ${UNMAPPED_OUTPUT_FILE}`
  )
}

scanIcons().catch(console.error)
