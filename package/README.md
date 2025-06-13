# @10xScale/eslint-config

A shareable ESLint configuration for React projects, designed to enforce consistent code style and best practices across your codebase. Built for use with ESLint v9+ Flat Config.

## Installation

Install the package:

```sh
# Using npm
npm install --save-dev @10xscale/eslint-modern

npm install --save-dev eslint-import-resolver-alias

# Using yarn
yarn add --dev @10xscale/eslint-modern

# Using pnpm
pnpm add -D @10xscale/eslint-modern
```

Install the package and all required peer dependencies:

```sh
# Using npm
npm install --save-dev @10xscale/eslint-modern @babel/eslint-parser @eslint/eslintrc @eslint/js eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-promise eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-sonarjs eslint-plugin-unicorn eslint-import-resolver-alias eslint-plugin-jsdoc

# Using yarn
yarn add --dev @10xscale/eslint-modern @babel/eslint-parser @eslint/eslintrc @eslint/js eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-promise eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-sonarjs eslint-plugin-unicorn eslint-import-resolver-alias eslint-plugin-jsdoc


# Using pnpm
pnpm add -D @10xscale/eslint-modern @babel/eslint-parser @eslint/eslintrc @eslint/js eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-promise eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-sonarjs eslint-plugin-unicorn eslint-import-resolver-alias eslint-plugin-jsdoc
```

> **Note:** You must also install all listed peer dependencies. Check the `peerDependencies` section in [`package.json`](./package.json) for the required versions.

## Usage (ESLint v9+ Flat Config)

> **Important:** This config is published as an ES module. You must set "type": "module" in your project's `package.json` to use it, or use the `.mjs` extension for your ESLint config file.

### 1. Enable ES Modules in your project

Add this to your `package.json`:

```json
{
  "type": "module"
}
```

### 2. Create an `eslint.config.js` (or `.mjs`) file in your project root:

```js
// eslint.config.js
import config from '@10xscale/eslint-modern';

export default [
  ...config,
  // Add your custom rules or overrides here
];
```

If you cannot use `type: "module"`, rename your config to `eslint.config.mjs` and use the same import/export syntax.

## Updating Peer Dependencies

When updating this package, always ensure your project's peer dependencies match the versions specified in [`package.json`](./package.json). Update them as needed to avoid version conflicts.

## Contributing & Contact

Contributions, issues, and suggestions are welcome! Please open an issue or pull request on the repository.

For questions or support, contact the maintainers via the repository's issue tracker.