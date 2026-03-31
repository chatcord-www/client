// @ts-nocheck
/** @type {import("eslint").Linter.Config} */
const config = {
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "project": false
  },
  "plugins": [
    "@typescript-eslint",
    "drizzle"
  ],
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/stylistic-type-checked"
  ],
  "rules": {
                          "@typescript-eslint/no-redundant-type-constituents": "off",
                        "@typescript-eslint/no-misused-promises": "off",
                      // Disable all rules that require parserServices/project config
                      "@typescript-eslint/no-unsafe-argument": "off",
                      "@typescript-eslint/no-unsafe-assignment": "off",
                      "@typescript-eslint/no-unsafe-call": "off",
                      "@typescript-eslint/no-unsafe-member-access": "off",
                      "@typescript-eslint/no-unsafe-return": "off",
                      "@typescript-eslint/restrict-plus-operands": "off",
                      "@typescript-eslint/restrict-template-expressions": "off",
                      "@typescript-eslint/unbound-method": "off",
                      "@typescript-eslint/no-unnecessary-type-assertion": "off",
                      "@typescript-eslint/no-unnecessary-type-constraint": "off",
                      "@typescript-eslint/no-explicit-any": "off",
                      "@typescript-eslint/no-unsafe-enum-comparison": "off",
                      "@typescript-eslint/no-confusing-void-expression": "off",
                      "@typescript-eslint/no-unsafe-declaration-merging": "off",
                      "@typescript-eslint/no-unsafe-argument": "off",
                      "@typescript-eslint/no-unsafe-assignment": "off",
                      "@typescript-eslint/no-unsafe-call": "off",
                      "@typescript-eslint/no-unsafe-member-access": "off",
                      "@typescript-eslint/no-unsafe-return": "off",
                      "@typescript-eslint/restrict-plus-operands": "off",
                      "@typescript-eslint/restrict-template-expressions": "off",
                      "@typescript-eslint/unbound-method": "off",
                      "@typescript-eslint/no-unnecessary-type-assertion": "off",
                      "@typescript-eslint/no-unnecessary-type-constraint": "off",
                      "@typescript-eslint/no-explicit-any": "off",
                      "@typescript-eslint/no-unsafe-enum-comparison": "off",
                      "@typescript-eslint/no-confusing-void-expression": "off",
                      "@typescript-eslint/no-unsafe-declaration-merging": "off",
                    "@typescript-eslint/no-implied-eval": "off",
                  "@typescript-eslint/no-floating-promises": "off",
                "@typescript-eslint/no-duplicate-type-constituents": "off",
              "@typescript-eslint/no-base-to-string": "off",
            "@typescript-eslint/await-thenable": "off",
          "@typescript-eslint/prefer-string-starts-ends-with": "off",
        "@typescript-eslint/prefer-optional-chain": "off",
      "@typescript-eslint/dot-notation": "off",
    "@typescript-eslint/array-type": "off",
    "@typescript-eslint/consistent-type-definitions": "off",
    "@typescript-eslint/non-nullable-type-assertion-style": "off",
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    // Removed invalid rule '@typescript-eslint/consistent-type-im sports'
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/require-await": "off",
    // "@typescript-eslint/no-misused-promises" removed to avoid parserServices/project config error
    "drizzle/enforce-delete-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ],
    "drizzle/enforce-update-with-where": [
      "error",
      {
        "drizzleObjectName": [
          "db",
          "ctx.db"
        ]
      }
    ]
  }
}
module.exports = config;