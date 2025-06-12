# @10xScale/eslint-config

A shareable ESLint configuration for React projects, designed to enforce consistent code style and best practices across your codebase. Built for use with ESLint v9+ Flat Config.

## Installation

Install the package:

```sh
# Using npm
npm install --save-dev @10xscale/eslint-modern

# Using yarn
yarn add --dev @10xscale/eslint-modern

# Using pnpm
pnpm add -D @10xscale/eslint-modern
```

Install the package and all required peer dependencies:

```sh
# Using npm
npm install --save-dev @10xscale/eslint-modern @babel/eslint-parser @eslint/eslintrc @eslint/js eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-promise eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-sonarjs eslint-plugin-unicorn

# Using yarn
yarn add --dev @10xscale/eslint-modern @babel/eslint-parser @eslint/eslintrc @eslint/js eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-promise eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-sonarjs eslint-plugin-unicorn

# Using pnpm
pnpm add -D @10xscale/eslint-modern @babel/eslint-parser @eslint/eslintrc @eslint/js eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-prettier eslint-plugin-promise eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-sonarjs eslint-plugin-unicorn
```

> **Note:** You must also install all listed peer dependencies. Check the `peerDependencies` section in [`package.json`](./package.json) for the required versions.

## Usage (ESLint v9+ Flat Config)

Create an `eslint.config.js` file in your project root and extend this config:

```js
// eslint.config.js
import config from '@10xScale/eslint-config/react';

export default [
  ...config,
  // Add your custom rules or overrides here
];
```

## Updating Peer Dependencies

When updating this package, always ensure your project's peer dependencies match the versions specified in [`package.json`](./package.json). Update them as needed to avoid version conflicts.

## Contributing & Contact

Contributions, issues, and suggestions are welcome! Please open an issue or pull request on the repository.

For questions or support, contact the maintainers via the repository's issue tracker.