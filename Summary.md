# Modern React & JavaScript Guidelines — Lite Mode Summary

This summary distills the core rules and patterns from all project guidelines and ESLint config. It is intended for code reviewers (human or AI) to quickly check for compliance and best practices.

---

## 1. Component & Hook Design

- **Functional Components Only:** Use functional components and React hooks. Do not use class components.
- **Single Responsibility:** Each component, hook, or module should do one thing only.
- **Naming:** Use PascalCase for components, camelCase for variables/functions, SCREAMING_SNAKE_CASE for constants, and kebab-case for files/folders.
- **File Naming:** Use suffixes like `.component.jsx`, `.hook.js`, `.util.js`, `.api.js`, `.slice.js`, `.test.js` for clarity.

## 2. File & Project Structure

- **Organize by Feature:** Group related files (components, hooks, utils, tests) by feature or domain.
- **Consistent Folders:** Use standard folders: `components/`, `lib/hooks/`, `services/`, `pages/`, `assets/`, etc.
- **Barrel Exports:** Use `index.js` for grouped exports in folders.

## 3. JavaScript & React Patterns

- **Modern Syntax:** Use `const`/`let`, arrow functions, destructuring, template literals, async/await.
- **Descriptive Names:** Functions and variables must be descriptive and action-oriented.
- **Avoid Inline Handlers:** Memoize event handlers with `useCallback` and avoid inline functions in JSX.
- **React.memo & useMemo:** Use memoization for expensive components, calculations, and handlers.
- **SOLID Principles:** Apply SRP, OCP, LSP, ISP, DIP in all code (see SOLID guides).

## 4. State & Data Management

- **Redux Toolkit or TanStack Query:** Use for global/server state. Prefer context for shared state over prop drilling.
- **Custom Hooks:** Place in `lib/hooks/`, follow naming and return conventions.
- **Keep State Local:** Use `useState`/`useReducer` for local state; split state for independent updates.

## 5. Imports & Exports

- **Order Imports:** Group as external, internal, then relative. Alphabetize within groups.
- **No Default Exports:** Prefer named exports for tree-shaking and clarity.

## 6. Linting & Formatting

- **ESLint/Prettier:** All code must pass linting and formatting checks. Fix all errors and warnings.
- **Rules:** No `var`, prefer `const`, no unused vars, no console except `warn`/`error`, enforce curly braces, etc.

## 7. Testing

- **Vitest & React Testing Library:** Write tests for all logic, components, and hooks.
- **Test Behavior:** Focus on user behavior, not implementation details. Use mocks for APIs/services.
- **Naming:** Test files must match the file under test (e.g., `UserCard.test.jsx`).

## 8. Performance

- **Code Splitting:** Split bundles by route/feature.
- **Optimize Assets:** Use lazy loading for images, fonts, and components. Use skeletons for loading states.
- **Monitor:** Track Core Web Vitals, bundle size, and clean up all side effects.

## 9. Accessibility & Documentation

- **Accessibility:** Follow a11y rules (`jsx-a11y`), use semantic HTML, and proper ARIA attributes.
- **JSDoc:** Document all public APIs, components, and complex functions.

---

**Summary:**  
Keep code modular, testable, and scalable. Follow naming, structure, and linting rules. Optimize for performance, accessibility, and maintainability. Apply modern patterns and SOLID principles throughout.