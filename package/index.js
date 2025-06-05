// @10xScale/eslint-config: Modern React & JavaScript ESLint config

module.exports = {
    root: true,
    env: {
        browser: true,
        es2024: true,
        node: true,
        jest: true
    },
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2024,
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        requireConfigFile: false,
        babelOptions: { presets: ['@babel/preset-react'] }
    },
    plugins: [
        'react',
        'react-hooks',
        'jsx-a11y',
        'import',
        'prefer-arrow',
        'unicorn',
        'sonarjs',
        'vitest',
        'security',
        'promise',
        'eslint-comments',
        'fp',
        'jsdoc',
    ],
    extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:import/recommended',
        'plugin:vitest/recommended',
        'plugin:security/recommended',
        'plugin:promise/recommended',
        'plugin:eslint-comments/recommended',
        'plugin:fp/recommended',
        'plugin:jsdoc/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        // JavaScript best practices
        'no-var': 'error',
        'prefer-const': 'error',
        'prefer-arrow-callback': 'error',
        'prefer-template': 'error',
        'prefer-destructuring': ['error', { array: true, object: true }],
        'object-curly-spacing': ['error', 'always'],
        'array-bracket-spacing': ['error', 'never'],
        'comma-dangle': ['error', 'never'],
        'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true }],
        'no-console': ['warn', { allow: ['warn', 'error'] }],
        'no-debugger': 'warn',

        // Import organization
        'import/order': ['error', {
            groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
            'newlines-between': 'always',
            alphabetize: { order: 'asc', caseInsensitive: true }
        }],
        'import/no-default-export': 'off',
        'import/prefer-default-export': 'off',
        'import/no-duplicates': 'error',
        'import/no-unused-modules': ['error', { unusedExports: true, src: ['src/**/*'] }],

        // React 19+ and hooks
        'react/function-component-definition': ['error', { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' }],
        'react/prefer-stateless-function': 'error',
        'react/no-multi-comp': ['error', { ignoreStateless: true }],
        'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
        'react/jsx-fragments': ['error', 'syntax'],
        'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
        'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
        'react/jsx-boolean-value': ['error', 'never'],
        'react/jsx-wrap-multilines': ['error', {
            declaration: 'parens-new-line',
            assignment: 'parens-new-line',
            return: 'parens-new-line',
            arrow: 'parens-new-line',
            condition: 'parens-new-line',
            logical: 'parens-new-line',
            prop: 'parens-new-line'
        }],
        'react/jsx-handler-names': ['error', { eventHandlerPrefix: 'handle', eventHandlerPropPrefix: 'on', checkLocalVariables: true }],
        'react/no-access-state-in-setstate': 'error',
        'react/no-redundant-should-component-update': 'error',
        'react/no-typos': 'error',
        'react/no-unsafe': 'error',
        'react/no-unused-state': 'error',
        'react/jsx-no-bind': ['error', { ignoreDOMComponents: false, ignoreRefs: true, allowArrowFunctions: false, allowFunctions: false, allowBind: false }],
        'react/jsx-no-constructed-context-values': 'error',
        'react/prop-types': 'error',
        'react/require-default-props': 'error',
        'react/default-props-match-prop-types': 'error',
        'react/display-name': ['error', { ignoreTranspilerName: false }],
        'react/no-array-index-key': 'error',
        'react/no-danger': 'warn',
        'react/no-this-in-sfc': 'error',
        'react/no-unescaped-entities': 'error',
        'react/no-unknown-property': 'error',
        'react/void-dom-elements-no-children': 'error',

        // Hooks
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': ['error', { additionalHooks: '(useAsyncEffect|useUpdateEffect)' }],

        // Accessibility
        'jsx-a11y/anchor-is-valid': ['error', { components: ['Link'], specialLink: ['hrefLeft', 'hrefRight'], aspects: ['invalidHref', 'preferButton'] }],
        'jsx-a11y/click-events-have-key-events': 'error',
        'jsx-a11y/no-static-element-interactions': 'error',

        // Performance
        'prefer-arrow/prefer-arrow-functions': ['error', { disallowPrototype: true, singleReturnOnly: false, classPropertiesAllowed: false }],
        'unicorn/prefer-node-protocol': 'error',
        'unicorn/prefer-module': 'error',
        'unicorn/prefer-optional-catch-binding': 'error',
        'unicorn/prefer-string-starts-ends-with': 'error',
        'unicorn/prefer-array-find': 'error',
        'unicorn/prefer-array-some': 'error',
        'unicorn/prefer-includes': 'error',
        'unicorn/prefer-array-flat': 'error',
        'unicorn/prefer-array-flat-map': 'error',
        'unicorn/no-array-push-push': 'error',
        'unicorn/prefer-spread': 'error',
        'unicorn/prefer-string-slice': 'error',
        'unicorn/prefer-string-trim-start-end': 'error',
        'unicorn/prevent-abbreviations': ['error', { checkFilenames: false }],
        'unicorn/filename-case': ['error', {
            cases: { camelCase: true, pascalCase: true },
            ignore: [
                /^[A-Z]+\..*$/, // Allow README.md, LICENSE, etc.
                /.*\.component\.jsx?$/, /.*\.hook\.js$/, /.*\.api\.js$/, /.*\.query\.js$/,
                /.*\.slice\.js$/, /.*\.test\.jsx?$/, /.*\.story\.jsx?$/
            ]
        }],

        // SonarJS for code quality
        'sonarjs/cognitive-complexity': ['error', 15],
        'sonarjs/max-switch-cases': ['error', 10],
        'sonarjs/no-duplicate-string': ['error', 3],
        'sonarjs/no-identical-functions': 'error',

        // Code quality
        'complexity': ['error', { max: 10 }],
        'max-depth': ['error', { max: 4 }],
        'max-lines-per-function': ['error', { max: 50, skipBlankLines: true, skipComments: true }],
        'max-params': ['error', { max: 10 }],

        // Encourage explicit returns in array callbacks
        'array-callback-return': ['error', { allowImplicit: true }],

        // Treat var as block scoped (prefer let/const)
        'block-scoped-var': 'error',

        // Enforce consistent returns in functions
        'consistent-return': 'error',

        // Use curly braces for multiline control statements
        curly: ['error', 'multi-line'],

        // Require default case in switch (with comment pattern)
        'default-case': ['error', { commentPattern: '^no default$' }],
        'default-case-last': 'error',

        // Default parameters should be last
        'default-param-last': 'error',

        // Prefer dot notation when possible
        'dot-notation': ['error', { allowKeywords: true }],
        'dot-location': ['error', 'property'],

        // Enforce use of 'this' in class methods (for OOP code only)
        'class-methods-use-this': ['error', { exceptMethods: [] }],

        // JSDoc documentation
        'jsdoc/check-alignment': 'error',
        'jsdoc/check-indentation': 'error',
        'jsdoc/newline-after-description': 'error',
    }
};