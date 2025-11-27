import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";

import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

import pluginImport from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import pluginPreferArrow from "eslint-plugin-prefer-arrow";
import pluginPrettier from "eslint-plugin-prettier";

export default defineConfig([
    ...nextCoreWebVitals,

    {
        files: ["**/*.{js,ts,jsx,tsx}"],

        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                project: "./tsconfig.json",
                sourceType: "module",
                ecmaVersion: "latest"
            }
        },

        plugins: {
            import: pluginImport,
            react: pluginReact,
            "prefer-arrow": pluginPreferArrow,
            "@typescript-eslint": tseslint,
            prettier: pluginPrettier
        },

        rules: {
            // Prettier-disable rules
            indent: "off",
            quotes: "off",
            "linebreak-style": "off",
            semi: "off",

            // General
            "no-template-curly-in-string": "error",
            "no-mixed-spaces-and-tabs": ["error", "smart-tabs"],
            "no-var": "error",
            "no-useless-rename": "error",
            "object-shorthand": ["error", "always"],
            "comma-dangle": ["error", "never"],
            "arrow-body-style": ["error", "as-needed"],
            eqeqeq: ["error", "always"],
            "dot-notation": "error",
            "prefer-arrow-callback": "error",
            "prefer-const": "error",
            "prefer-template": "error",
            "prefer-arrow/prefer-arrow-functions": "error",

            // React
            "react/function-component-definition": [
                "error",
                { namedComponents: "arrow-function", unnamedComponents: "arrow-function" }
            ],
            "react/react-in-jsx-scope": "off",
            "react/self-closing-comp": "error",
            "react/jsx-boolean-value": ["error", "never"],
            "react/jsx-curly-brace-presence": ["error", "never"],
            "react/jsx-curly-spacing": ["error", "never"],
            "react/jsx-equals-spacing": ["error", "never"],
            "react/jsx-fragments": ["error", "syntax"],
            "react/jsx-no-useless-fragment": "error",
            "react/display-name": "off",

            // TypeScript
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/consistent-type-definitions": ["error", "type"],
            "@typescript-eslint/prefer-optional-chain": "error",
            "@typescript-eslint/prefer-nullish-coalescing": "error",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-unused-vars": [
                "warn",
                { args: "all", argsIgnorePattern: "^_", varsIgnorePattern: "^_" }
            ],
            "@typescript-eslint/consistent-type-imports": [
                "warn",
                { prefer: "type-imports", fixStyle: "inline-type-imports" }
            ],

            // Import
            "import/order": [
                "error",
                {
                    "newlines-between": "always",
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index"
                    ]
                }
            ],

            // Hook Prettier into ESLint
            "prettier/prettier": "error"
        },

        settings: {
            react: { version: "detect" },
            "import/resolver": {
                node: { paths: ["src"] },
                typescript: {
                    extensionAlias: {
                        ".js": [".ts", ".tsx", ".d.ts", ".js"],
                        ".jsx": [".tsx", ".d.ts", ".jsx"],
                        ".cjs": [".cts", ".d.cts", ".cjs"],
                        ".mjs": [".mts", ".d.mts", ".mjs"]
                    }
                }
            }
        }
    },

    // Overrides
    {
        files: ["**/*.tsx"],
        rules: {
            "react/prop-types": "off"
        }
    },

    // Ignore patterns
    {
        ignores: [
            ".eslintrc.*",
            "eslint.config.*",
            ".prettierrc.js",
            "*.config.js",
            "*.config.cjs",
            "*.config.mjs",
            "*.rc.js",
            "tailwind.config.cjs",
            "postcss.config.js",
            "next.config.mjs",
            ".next/**",
            "node_modules/**",
            "**/*.md",
            "**/*.html"
        ]
    }
]);
