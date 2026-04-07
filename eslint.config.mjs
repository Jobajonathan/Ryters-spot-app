import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Legal pages and prose content use natural quotes and apostrophes throughout.
      // Escaping every ' and " in long-form text is impractical and worsens readability.
      'react/no-unescaped-entities': 'off',
      // Load-once fetch patterns intentionally omit function deps to avoid infinite loops.
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
]);

export default eslintConfig;
