// @10xScale/eslint-config: Modern React & JavaScript ESLint config (ESLint v9+ Flat Config)

import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

import babelParser from "@babel/eslint-parser"
import { FlatCompat } from "@eslint/eslintrc"
import eslint from "@eslint/js"

// Import plugins directly
import importPlugin from "eslint-plugin-import"
import jsxA11yPlugin from "eslint-plugin-jsx-a11y"
import prettierPlugin from "eslint-plugin-prettier"
import promisePlugin from "eslint-plugin-promise"
import reactPlugin from "eslint-plugin-react"
import reactHooksPlugin from "eslint-plugin-react-hooks"
import sonarjsPlugin from "eslint-plugin-sonarjs"
import unicornPlugin from "eslint-plugin-unicorn"
// import vitestPlugin from "eslint-plugin-vitest";
// import securityPlugin from "eslint-plugin-security";

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Setup compat for legacy configs if needed
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslint.configs.recommended,
    allConfig: eslint.configs.all,
})

export default [
    // Global ignores - these files will be completely ignored by ESLint
    {
        ignores: [
            "dist/**/*",
            "build/**/*",
            "node_modules/**/*",
            "vite.config.js",
            "src/components/ui/**/*",
            "public/**/*",
            "*.min.js",
            ".prettierrc.cjs",
            "eslint.config.js"
        ],
    },
    eslint.configs.recommended,
    ...compat.extends(
        "plugin:react/recommended",
        "plugin:react-hooks/recommended",
        "plugin:jsx-a11y/recommended",
        "plugin:import/recommended",
        "plugin:promise/recommended",
        "plugin:jsdoc/recommended",
        "plugin:prettier/recommended"
    ),
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module",
            parser: babelParser,
            parserOptions: {
                ecmaFeatures: { jsx: true },
                requireConfigFile: false,
                babelOptions: { presets: ["@babel/preset-react"] },
            },
            globals: {
                browser: true,
                node: true,
                jest: true,
            },
        },
        plugins: {
            react: reactPlugin,
            "react-hooks": reactHooksPlugin,
            "jsx-a11y": jsxA11yPlugin,
            import: importPlugin,
            // 'prefer-arrow': preferArrow,
            unicorn: unicornPlugin,
            sonarjs: sonarjsPlugin,
            // vitest: vitestPlugin,
            // security: securityPlugin,
            promise: promisePlugin,
            // "eslint-comments": eslintCommentsPlugin,
            // fp: fpPlugin,
            prettier: prettierPlugin,
        },
        rules: {
            // JavaScript best practices
            "no-var": "error",
            "prefer-const": "error",
            // "prefer-arrow-callback": "error",
            "prefer-template": "error",
            "prefer-destructuring": ["error", { array: true, object: true }],
            "object-curly-spacing": ["error", "always"],
            "array-bracket-spacing": ["error", "never"],
            "comma-dangle": ["off"],
            "no-unused-vars": [
                "error",
                {
                    varsIgnorePattern: "^_",
                    argsIgnorePattern: "^_",
                    ignoreRestSiblings: true,
                },
            ],
            "no-console": ["warn", { allow: ["warn", "error"] }],
            "no-debugger": "warn",

            // Import organization
            "import/order": [
                "error",
                {
                    groups: [
                        "builtin",
                        "external",
                        "internal",
                        "parent",
                        "sibling",
                        "index",
                    ],
                    "newlines-between": "always",
                    alphabetize: { order: "asc", caseInsensitive: true },
                },
            ],
            "import/no-default-export": "off",
            "import/prefer-default-export": "off",
            "import/no-duplicates": "error",
            // "import/no-unused-modules": ["error", { unusedExports: true, src: ["src/**/*"] }], // Disabled due to flat config compatibility

            // React 19+ and hooks
            "react/function-component-definition": [
                "error",
                {
                    namedComponents: "arrow-function",
                    unnamedComponents: "arrow-function",
                },
            ],
            "react/prefer-stateless-function": "error",
            "react/no-multi-comp": ["error", { ignoreStateless: true }],
            "react/jsx-filename-extension": ["error", { extensions: [".jsx"] }],
            "react/jsx-fragments": ["error", "syntax"],
            "react/jsx-no-useless-fragment": ["error", { allowExpressions: true }],
            "react/jsx-curly-brace-presence": [
                "error",
                { props: "never", children: "never" },
            ],
            "react/jsx-boolean-value": ["error", "never"],
            "react/jsx-wrap-multilines": [
                "error",
                {
                    declaration: "parens-new-line",
                    assignment: "parens-new-line",
                    return: "parens-new-line",
                    arrow: "parens-new-line",
                    condition: "parens-new-line",
                    logical: "parens-new-line",
                    prop: "parens-new-line",
                },
            ],
            "react/jsx-handler-names": [
                "error",
                {
                    eventHandlerPrefix: "handle",
                    eventHandlerPropPrefix: "on",
                    checkLocalVariables: true,
                },
            ],
            "react/no-access-state-in-setstate": "error",
            "react/no-redundant-should-component-update": "error",
            "react/no-typos": "error",
            "react/no-unsafe": "error",
            "react/no-unused-state": "error",
            "react/jsx-no-bind": ["off"],
            "react/jsx-no-constructed-context-values": "error",
            "react/prop-types": "error",
            "react/require-default-props": "error",
            "react/default-props-match-prop-types": "error",
            "react/display-name": ["error", { ignoreTranspilerName: false }],
            "react/no-array-index-key": "error",
            "react/no-danger": "warn",
            "react/no-this-in-sfc": "error",
            "react/no-unescaped-entities": "error",
            "react/no-unknown-property": "error",
            "react/void-dom-elements-no-children": "error",

            // Hooks
            "react-hooks/rules-of-hooks": "error",
            "react-hooks/exhaustive-deps": [
                "error",
                { additionalHooks: "(useAsyncEffect|useUpdateEffect)" },
            ],

            // Accessibility
            "jsx-a11y/anchor-is-valid": [
                "error",
                {
                    components: ["Link"],
                    specialLink: ["hrefLeft", "hrefRight"],
                    aspects: ["invalidHref", "preferButton"],
                },
            ],
            "jsx-a11y/click-events-have-key-events": "error",
            "jsx-a11y/no-static-element-interactions": "error",

            // Performance
            // "prefer-arrow/prefer-arrow-functions": [
            //     "error",
            //     { disallowPrototype: true, singleReturnOnly: false, classPropertiesAllowed: false },
            // ],
            "unicorn/prefer-node-protocol": "error",
            "unicorn/prefer-module": "error",
            "unicorn/prefer-optional-catch-binding": "error",
            "unicorn/prefer-string-starts-ends-with": "error",
            "unicorn/prefer-array-find": "error",
            "unicorn/prefer-array-some": "error",
            "unicorn/prefer-includes": "error",
            "unicorn/prefer-array-flat": "error",
            "unicorn/prefer-array-flat-map": "error",
            "unicorn/no-array-push-push": "error",
            "unicorn/prefer-spread": "error",
            "unicorn/prefer-string-slice": "error",
            "unicorn/prefer-string-trim-start-end": "error",
            "unicorn/prevent-abbreviations": ["error", { checkFilenames: false }],
            "unicorn/filename-case": [
                "error",
                {
                    cases: { camelCase: true, pascalCase: true },
                    ignore: [
                        /^[A-Z]+\..*$/, // Allow README.md, LICENSE, etc.
                        /.*\.component\.jsx?$/,
                        /.*\.hook\.js$/,
                        /.*\.api\.js$/,
                        /.*\.query\.js$/,
                        /.*\.slice\.js$/,
                        /.*\.test\.jsx?$/,
                        /.*\.story\.jsx?$/,
                        /.*\.config\.js$/,
                        /.*\.constant\.js$/,
                    ],
                },
            ],

            // SonarJS for code quality
            "sonarjs/cognitive-complexity": ["error", 15],
            "sonarjs/max-switch-cases": ["error", 10],
            "sonarjs/no-duplicate-string": ["error", { threshold: 2 }],
            "sonarjs/no-identical-functions": "error",

            // Code quality
            complexity: ["error", { max: 10 }],
            "max-depth": ["error", { max: 4 }],
            "max-lines-per-function": [
                "error",
                { max: 100, skipBlankLines: true, skipComments: true },
            ],
            "max-params": ["error", { max: 10 }],

            // Encourage explicit returns in array callbacks
            "array-callback-return": ["error", { allowImplicit: true }],

            // Treat var as block scoped (prefer let/const)
            "block-scoped-var": "error",

            // Enforce consistent returns in functions
            "consistent-return": "error",

            // Use curly braces for multiline control statements
            curly: ["error", "multi-line"],

            // Require default case in switch (with comment pattern)
            "default-case": ["error", { commentPattern: "^no default$" }],
            "default-case-last": "error",

            // Default parameters should be last
            "default-param-last": "error",

            // Prefer dot notation when possible
            "dot-notation": ["error", { allowKeywords: true }],
            "dot-location": ["error", "property"],

            // Enforce use of 'this' in class methods (for OOP code only)
            "class-methods-use-this": ["error", { exceptMethods: [] }],

            // JSDoc documentation
            "jsdoc/check-alignment": "error",
            "jsdoc/check-indentation": "error",
            // "jsdoc/newline-after-description": "error",
            "react/react-in-jsx-scope": "off",
            "jsdoc/require-returns": "off",
            "jsdoc/require-param": "off",
        },
        settings: {
            "import/resolver": {
                alias: {
                    map: [
                        ["@", path.resolve(__dirname, "./src")],
                        ["@hooks", path.resolve(__dirname, "./src/hooks")],
                        ["@lib", path.resolve(__dirname, "./src/lib")],
                        ["@context", path.resolve(__dirname, "./src/lib/context")],
                        ["@pages", path.resolve(__dirname, "./src/pages")],
                        ["@constants", path.resolve(__dirname, "./src/lib/constants")],
                        ["@api", path.resolve(__dirname, "./src/services/api")],
                        ["@query", path.resolve(__dirname, "./src/services/query")],
                        ["@store", path.resolve(__dirname, "./src/services/store")],
                        ["@public", path.resolve(__dirname, "./public")],
                    ],
                    extensions: [".js", ".jsx"],
                },
                node: {
                    extensions: [".js", ".jsx"],
                },
            },
            react: {
                pragma: "React",
                version: "detect",
            },
            propWrapperFunctions: [
                "forbidExtraProps",
                { property: "freeze", object: "Object" },
                { property: "myFavoriteWrapper" },
                { property: "forbidExtraProps", exact: true },
            ],
            componentWrapperFunctions: [
                "observer",
                { property: "styled" },
                { property: "observer", object: "Mobx" },
                { property: "observer", object: "React" },
            ],
            formComponents: [
                "CustomForm",
                { name: "SimpleForm", formAttribute: "endpoint" },
                { name: "Form", formAttribute: ["registerEndpoint", "loginEndpoint"] },
            ],
            linkComponents: [
                "Hyperlink",
                { name: "MyLink", linkAttribute: "to" },
                { name: "Link", linkAttribute: ["to", "href"] },
            ],
        },
    },
    {
        files: ["**/*.jsx"],
        rules: {
            "unicorn/filename-case": [
                "error",
                {
                    cases: { pascalCase: true },
                    ignore: [/^index\.jsx$/, /^App\.jsx$/, /^main\.jsx$/, /^setupTests\.jsx$/, /^.*\.test\.jsx$/],
                },
            ],
        },
    },
    {
        files: ["**/*.js"],
        rules: {
            "unicorn/filename-case": [
                "error",
                {
                    cases: { camelCase: true },
                },
            ],
        },
    },
]
