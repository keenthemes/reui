import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"
import { defineConfig, globalIgnores } from "eslint/config"

// eslint-config-next 16 exports flat configs natively. Importing them
// directly replaces the previous FlatCompat({ extends: ["next/..."] })
// setup, which crashed: the legacy eslintrc resolver cannot validate
// flat-config modules (their plugin objects are circular, so even the
// validator's error formatter threw "property 'react' closes the
// circle" before linting anything).

// eslint-plugin-react 7.x (pulled in by eslint-config-next) still calls
// the context.getFilename API that ESLint 10 removed, so any react/*
// rule crashes at lint time. Drop those rules until the plugin ships
// ESLint 10 support; react-hooks/* and @next/next/* rules are separate
// plugins and keep working. Same workaround as apps/waitlist.
function stripReactRules(configs) {
  return configs.map((config) => {
    if (!config.rules) {
      return config
    }

    return {
      ...config,
      rules: Object.fromEntries(
        Object.entries(config.rules).filter(
          ([ruleName]) => !ruleName.startsWith("react/")
        )
      ),
    }
  })
}

export default defineConfig([
  ...stripReactRules(nextVitals),
  ...stripReactRules(nextTs),
  {
    rules: {
      "@next/next/no-duplicate-head": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Generated output (never hand-edited; see reui-project standards).
    ".source/**",
    "lib/generated/**",
    "public/**",
    "registry-reui/_meta/**",
  ]),
])
