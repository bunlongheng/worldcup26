import js from "@eslint/js";
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";

export default tseslint.config(
  // scripts/ holds Node build tooling (run via --experimental-strip-types), excluded
  // from the app tsconfig too - it parses untyped third-party JSON, so it is not linted.
  { ignores: [".next/**", "node_modules/**", "public/**", "scripts/**", "next-env.d.ts"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "@next/next": nextPlugin },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },
);
