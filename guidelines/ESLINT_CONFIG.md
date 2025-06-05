# ESLint Configuration Guide

> Modern ESLint setup extending Airbnb with React 19+ and performance optimizations

## Table of Contents

1. [Installation](#installation)
2. [Base Configuration](#base-configuration)
3. [React Configuration](#react-configuration)
4. [Custom Rules](#custom-rules)
5. [Performance Rules](#performance-rules)
6. [Hook Rules](#hook-rules)
7. [IDE Integration](#ide-integration)
8. [CI/CD Integration](#ci-cd-integration)

## Installation

### Package Installation

```bash
# Core ESLint packages
npm install --save-dev eslint

# Airbnb configuration (base)
npm install --save-dev eslint-config-airbnb
npm install --save-dev eslint-plugin-import
npm install --save-dev eslint-plugin-jsx-a11y

# React specific
npm install --save-dev eslint-plugin-react
npm install --save-dev eslint-plugin-react-hooks

# Performance and modern patterns
npm install --save-dev eslint-plugin-react-refresh
npm install --save-dev eslint-plugin-prefer-arrow

# Optional but recommended
npm install --save-dev eslint-plugin-unicorn
npm install --save-dev eslint-plugin-sonarjs
```

### TypeScript Support (Optional)

```bash
npm install --save-dev @typescript-eslint/eslint-plugin
npm install --save-dev @typescript-eslint/parser
npm install --save-dev eslint-config-airbnb-typescript
```

## Base Configuration

### `.eslintrc.js`

```javascript
module.exports = {
  env: {
    browser: true,
    es2024: true,
    node: true,
    jest: true
  },
  
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended'
  ],
  
  parser: '@babel/eslint-parser',
  
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    },
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react']
    }
  },
  
  plugins: [
    'react',
    'react-hooks',
    'react-refresh',
    'jsx-a11y',
    'import',
    'prefer-arrow',
    'unicorn',
    'sonarjs'
  ],
  
  settings: {
    react: {
      version: '18.0' // or 'detect' for auto-detection
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      },
      alias: {
        '@': './src'
      }
    }
  },
  
  rules: {
    // Override Airbnb rules for modern React patterns
    ...require('./rules/base-overrides'),
    ...require('./rules/react-rules'),
    ...require('./rules/performance-rules'),
    ...require('./rules/custom-rules')
  },
  
  overrides: [
    {
      files: ['**/*.test.js', '**/*.test.jsx', '**/*.spec.js', '**/*.spec.jsx'],
      env: {
        jest: true,
        'jest/globals': true
      },
      extends: ['plugin:testing-library/react'],
      plugins: ['testing-library', 'jest'],
      rules: {
        // Test-specific rule overrides
        'react/jsx-props-no-spreading': 'off',
        'import/no-extraneous-dependencies': 'off'
      }
    }
  ]
};
```

### `rules/base-overrides.js`

```javascript
module.exports = {
  // Modern JavaScript patterns
  'no-console': ['warn', { allow: ['warn', 'error'] }],
  'no-debugger': 'warn',
  'no-unused-vars': ['error', { 
    varsIgnorePattern: '^_',
    argsIgnorePattern: '^_',
    ignoreRestSiblings: true
  }],
  
  // Prefer modern syntax
  'prefer-const': 'error',
  'prefer-arrow-callback': 'error',
  'prefer-template': 'error',
  'prefer-destructuring': ['error', {
    array: true,
    object: true
  }],
  
  // Object and array patterns
  'object-curly-spacing': ['error', 'always'],
  'array-bracket-spacing': ['error', 'never'],
  'comma-dangle': ['error', {
    arrays: 'never',
    objects: 'never',
    imports: 'never',
    exports: 'never',
    functions: 'never'
  }],
  
  // Function patterns
  'function-paren-newline': ['error', 'multiline-arguments'],
  'arrow-spacing': ['error', { before: true, after: true }],
  'space-before-function-paren': ['error', {
    anonymous: 'never',
    named: 'never',
    asyncArrow: 'always'
  }],
  
  // Import/Export patterns
  'import/prefer-default-export': 'off',
  'import/no-default-export': 'off',
  'import/order': ['error', {
    groups: [
      'builtin',
      'external',
      'internal',
      'parent',
      'sibling',
      'index'
    ],
    'newlines-between': 'always',
    alphabetize: {
      order: 'asc',
      caseInsensitive: true
    }
  }],
  
  // Modern async patterns
  'no-async-promise-executor': 'error',
  'prefer-promise-reject-errors': 'error',
  'no-promise-executor-return': 'error',
  
  // Unicorn rules for modern patterns
  'unicorn/prefer-node-protocol': 'error',
  'unicorn/prefer-module': 'error',
  'unicorn/prefer-optional-catch-binding': 'error',
  'unicorn/prefer-string-starts-ends-with': 'error',
  'unicorn/prefer-array-find': 'error',
  'unicorn/prefer-array-some': 'error',
  'unicorn/prefer-includes': 'error',
  
  // SonarJS complexity rules
  'sonarjs/cognitive-complexity': ['error', 15],
  'sonarjs/max-switch-cases': ['error', 10],
  'sonarjs/no-duplicate-string': ['error', 3],
  'sonarjs/no-identical-functions': 'error'
};
```

## React Configuration

### `rules/react-rules.js`

```javascript
module.exports = {
  // React 19+ patterns
  'react/react-in-jsx-scope': 'off', // Not needed with new JSX transform
  'react/jsx-uses-react': 'off',
  
  // Component patterns
  'react/function-component-definition': ['error', {
    namedComponents: 'arrow-function',
    unnamedComponents: 'arrow-function'
  }],
  'react/prefer-stateless-function': 'error',
  'react/no-multi-comp': ['error', { ignoreStateless: true }],
  
  // Props patterns
  'react/jsx-props-no-spreading': ['error', {
    html: 'enforce',
    custom: 'ignore',
    explicitSpread: 'ignore'
  }],
  'react/prop-types': 'error',
  'react/require-default-props': 'error',
  'react/default-props-match-prop-types': 'error',
  
  // JSX patterns
  'react/jsx-filename-extension': ['error', { 
    extensions: ['.jsx', '.tsx'] 
  }],
  'react/jsx-fragments': ['error', 'syntax'],
  'react/jsx-no-useless-fragment': ['error', { 
    allowExpressions: true 
  }],
  'react/jsx-curly-brace-presence': ['error', {
    props: 'never',
    children: 'never'
  }],
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
  
  // Event handler patterns
  'react/jsx-handler-names': ['error', {
    eventHandlerPrefix: 'handle',
    eventHandlerPropPrefix: 'on',
    checkLocalVariables: true
  }],
  
  // State and lifecycle
  'react/no-access-state-in-setstate': 'error',
  'react/no-redundant-should-component-update': 'error',
  'react/no-typos': 'error',
  'react/no-unsafe': 'error',
  'react/no-unused-state': 'error',
  
  // Performance
  'react/jsx-no-bind': ['error', {
    ignoreDOMComponents: false,
    ignoreRefs: true,
    allowArrowFunctions: false,
    allowFunctions: false,
    allowBind: false
  }],
  'react/jsx-no-constructed-context-values': 'error',
  
  // Accessibility
  'jsx-a11y/anchor-is-valid': ['error', {
    components: ['Link'],
    specialLink: ['hrefLeft', 'hrefRight'],
    aspects: ['invalidHref', 'preferButton']
  }],
  'jsx-a11y/click-events-have-key-events': 'error',
  'jsx-a11y/no-static-element-interactions': 'error',
  
  // Modern React patterns
  'react/hook-use-state': 'error', // Custom rule for useState patterns
  'react/jsx-no-leaked-render': ['error', { 
    validStrategies: ['ternary', 'coerce'] 
  }]
};
```

### `rules/performance-rules.js`

```javascript
module.exports = {
  // Memory management
  'react/no-object-type-as-default-prop': 'error',
  'react/jsx-no-constructed-context-values': 'error',
  
  // Unnecessary re-renders
  'react/jsx-no-bind': ['error', {
    ignoreDOMComponents: false,
    ignoreRefs: true,
    allowArrowFunctions: false,
    allowFunctions: false,
    allowBind: false
  }],
  
  // Bundle size optimization
  'import/no-duplicates': 'error',
  'import/no-unused-modules': ['error', { 
    unusedExports: true,
    src: ['src/**/*'],
    ignoreExports: ['src/main.jsx', 'src/App.jsx']
  }],
  
  // Code splitting hints
  'import/dynamic-import-chunkname': 'error',
  
  // Prefer arrow functions for callbacks
  'prefer-arrow/prefer-arrow-functions': ['error', {
    disallowPrototype: true,
    singleReturnOnly: false,
    classPropertiesAllowed: false
  }],
  
  // Optimize object creation
  'no-object-constructor': 'error',
  'prefer-object-spread': 'error',
  
  // Array optimization
  'unicorn/prefer-array-flat': 'error',
  'unicorn/prefer-array-flat-map': 'error',
  'unicorn/no-array-push-push': 'error',
  'unicorn/prefer-spread': 'error',
  
  // String optimization
  'unicorn/prefer-string-slice': 'error',
  'unicorn/prefer-string-trim-start-end': 'error',
  
  // Number optimization
  'unicorn/prefer-number-properties': 'error',
  'unicorn/numeric-separators-style': 'error'
};
```

## Custom Rules

### `rules/custom-rules.js`

```javascript
module.exports = {
  // File naming conventions
  'unicorn/filename-case': ['error', {
    cases: {
      camelCase: true,
      pascalCase: true
    },
    ignore: [
      /^[A-Z]+\..*$/, // Allow README.md, LICENSE, etc.
      /.*\.component\.jsx?$/, // Component files
      /.*\.hook\.js$/, // Hook files
      /.*\.api\.js$/, // API files
      /.*\.query\.js$/, // Query files
      /.*\.slice\.js$/, // Redux slice files
      /.*\.test\.jsx?$/, // Test files
      /.*\.story\.jsx?$/ // Story files
    ]
  }),
  
  // Naming conventions
  'unicorn/prevent-abbreviations': ['error', {
    checkFilenames: false,
    replacements: {
      props: false,
      ref: false,
      refs: false,
      param: false,
      params: false,
      arg: false,
      args: false,
      env: false,
      temp: false,
      tmp: false
    }
  }],
  
  // Hook naming
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': ['error', {
    additionalHooks: '(useAsyncEffect|useUpdateEffect)'
  }],
  
  // Component naming
  'react/display-name': ['error', { 
    ignoreTranspilerName: false 
  }],
  
  // Prevent common mistakes
  'react/no-array-index-key': 'error',
  'react/no-danger': 'warn',
  'react/no-did-mount-set-state': 'error',
  'react/no-did-update-set-state': 'error',
  'react/no-direct-mutation-state': 'error',
  'react/no-find-dom-node': 'error',
  'react/no-render-return-value': 'error',
  'react/no-string-refs': 'error',
  'react/no-this-in-sfc': 'error',
  'react/no-unescaped-entities': 'error',
  'react/no-unknown-property': 'error',
  'react/void-dom-elements-no-children': 'error',
  
  // Modern patterns enforcement
  'no-var': 'error',
  'prefer-const': 'error',
  'prefer-arrow-callback': 'error',
  'object-shorthand': ['error', 'always'],
  
  // Import organization
  'sort-imports': ['error', {
    ignoreCase: true,
    ignoreDeclarationSort: true,
    ignoreMemberSort: false,
    memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
    allowSeparatedGroups: true
  }],
  
  // Code quality
  'complexity': ['error', { max: 10 }],
  'max-depth': ['error', { max: 4 }],
  'max-lines-per-function': ['error', { 
    max: 50, 
    skipBlankLines: true, 
    skipComments: true 
  }],
  'max-params': ['error', { max: 4 }]
};
```

## Hook Rules

### `rules/hook-rules.js`

```javascript
module.exports = {
  // Hook dependencies
  'react-hooks/exhaustive-deps': ['error', {
    additionalHooks: '(useAsyncEffect|useUpdateEffect|useInterval)'
  }],
  
  // Custom hook patterns
  'react/hook-use-state': ['error', {
    allowDestructuredState: true
  }],
  
  // useEffect patterns
  'react/prefer-read-only-props': 'error',
  'react/no-unstable-nested-components': ['error', { 
    allowAsProps: true 
  }],
  
  // Custom hook naming
  'react-hooks/rules-of-hooks': 'error',
  
  // Performance hooks
  'react/jsx-no-constructed-context-values': 'error',
  'react/no-object-type-as-default-prop': 'error'
};
```

## IDE Integration

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "eslint.format.enable": true,
  "eslint.codeAction.showDocumentation": {
    "enable": true
  },
  "editor.rulers": [80, 120],
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

### VS Code Extensions

Create `.vscode/extensions.json`:

```json
{
  "recommendations": [
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-react-native",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### Prettier Integration

Create `.prettierrc`:

```json
{
  "semi": true,
  "trailingComma": "none",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf",
  "jsxSingleQuote": true,
  "quoteProps": "as-needed"
}
```

## CI/CD Integration

### GitHub Actions

Create `.github/workflows/lint.yml`:

```yaml
name: Lint

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  lint:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run ESLint
      run: npm run lint

    - name: Run ESLint with sarif output
      run: npx eslint . --format @microsoft/eslint-formatter-sarif --output-file eslint-results.sarif
      continue-on-error: true

    - name: Upload ESLint results to GitHub
      uses: github/codeql-action/upload-sarif@v2
      with:
        sarif_file: eslint-results.sarif
      if: always()
```

### Package.json Scripts

```json
{
  "scripts": {
    "lint": "eslint src --ext .js,.jsx --max-warnings 0",
    "lint:fix": "eslint src --ext .js,.jsx --fix",
    "lint:staged": "lint-staged",
    "lint:ci": "eslint src --ext .js,.jsx --format junit --output-file reports/eslint.xml"
  },
  "lint-staged": {
    "src/**/*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ]
  },
  "husky": {
    "hooks": {
      "pre-commit": "lint-staged",
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
}
```

### Pre-commit Hooks

Install husky and lint-staged:

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

## Configuration Files

### `.eslintignore`

```
# Dependencies
node_modules/
dist/
build/

# Generated files
coverage/
*.min.js
*.bundle.js

# Config files
*.config.js
vite.config.js
vitest.config.js

# Public assets
public/

# Environment files
.env*

# IDE files
.vscode/
.idea/

# OS files
.DS_Store
Thumbs.db
```

### Environment-specific Overrides

For development:

```javascript
// .eslintrc.dev.js
module.exports = {
  extends: ['./.eslintrc.js'],
  rules: {
    'no-console': 'warn',
    'no-debugger': 'warn',
    'react/jsx-props-no-spreading': 'off'
  }
};
```

For production:

```javascript
// .eslintrc.prod.js
module.exports = {
  extends: ['./.eslintrc.js'],
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'no-alert': 'error'
  }
};
```

## Custom Plugin Rules

### Creating Custom Rules

```javascript
// eslint-plugin-project-rules/index.js
module.exports = {
  rules: {
    'no-hardcoded-strings': require('./rules/no-hardcoded-strings'),
    'consistent-component-naming': require('./rules/consistent-component-naming'),
    'enforce-hook-naming': require('./rules/enforce-hook-naming')
  },
  configs: {
    recommended: {
      rules: {
        'project-rules/no-hardcoded-strings': 'warn',
        'project-rules/consistent-component-naming': 'error',
        'project-rules/enforce-hook-naming': 'error'
      }
    }
  }
};

// Usage in .eslintrc.js
module.exports = {
  plugins: ['project-rules'],
  extends: ['plugin:project-rules/recommended']
};
```

This ESLint configuration provides a solid foundation that extends Airbnb's rules while adding modern React patterns, performance optimizations, and team-specific conventions. It enforces consistency while allowing flexibility for modern development practices.