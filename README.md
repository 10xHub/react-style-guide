# Modern React Development Guide

> Comprehensive guide for building scalable React applications with modern patterns, performance optimization, and best practices

## 🚀 Overview

This repository contains a complete set of development guides for modern React applications, focusing on JavaScript patterns, performance optimization, and maintainable code architecture. Built for teams transitioning from traditional setups to modern React development.

## 📚 Guide Collection

### Core Development Guides

| Guide | Description | Key Topics |
|-------|-------------|------------|
| **[JavaScript Guide](./JAVASCRIPT_GUIDE.md)** | Modern JavaScript patterns and best practices | ES2024, async/await, modules, error handling |
| **[React Guide](./REACT_GUIDE.md)** | React 19+ patterns and component architecture | Hooks, components, state management, performance |
| **[SOLID Principles](./SOLID_PRINCIPLES.md)** | SOLID principles applied to React development | Component design, maintainability, architecture |
| **[Custom Hooks Guide](./CUSTOM_HOOKS_GUIDE.md)** | Hook design patterns and best practices | Hook composition, testing, performance |

### Configuration & Setup

| Guide | Description | Key Topics |
|-------|-------------|------------|
| **[File Organization](./FILE_ORGANIZATION.md)** | Project structure and naming conventions | Folder structure, imports, code splitting |
| **[ESLint Configuration](./ESLINT_CONFIG.md)** | Modern ESLint setup extending Airbnb | Rules, IDE integration, CI/CD |
| **[Testing Guide](./TESTING_GUIDE.md)** | Comprehensive testing with Vitest | Component testing, hooks, integration |

### Optimization & Migration

| Guide | Description | Key Topics |
|-------|-------------|------------|
| **[Performance Guide](./PERFORMANCE_GUIDE.md)** | React performance optimization techniques | Bundle optimization, memory management, monitoring |
| **[Migration Guide](./MIGRATION_GUIDE.md)** | Migrating from legacy patterns and Airbnb config | Step-by-step migration, code transformation |

## 🎯 Quick Start

### 1. Project Setup

```bash
# Create new React project with Vite
npm create vite@latest my-react-app -- --template react
cd my-react-app

# Install dependencies
npm install

# Install development dependencies
npm install --save-dev eslint vitest @testing-library/react
```

### 2. Configure ESLint

Follow the [ESLint Configuration Guide](./ESLINT_CONFIG.md) to set up modern linting rules:

```bash
# Install ESLint dependencies
npm install --save-dev eslint-config-airbnb eslint-plugin-react-hooks
npm install --save-dev eslint-plugin-unicorn eslint-plugin-sonarjs
```

### 3. Set Up Testing

Follow the [Testing Guide](./TESTING_GUIDE.md) to configure Vitest:

```bash
# Install testing dependencies
npm install --save-dev vitest @testing-library/jest-dom @testing-library/user-event
```

### 4. Organize Project Structure

Use the [File Organization Guide](./FILE_ORGANIZATION.md) to structure your project:

```
src/
├── components/          # Reusable components
├── pages/              # Page components
├── lib/                # Utilities and helpers
├── services/           # API and external services
└── assets/             # Static assets
```

## 🏗️ Architecture Principles

### Component Design
- **Functional Components Only** - Use hooks for all state and side effects
- **Single Responsibility** - Each component has one clear purpose
- **Composition over Inheritance** - Build complex UIs through composition
- **Props Interface Design** - Clear, documented prop interfaces

### Performance First
- **Bundle Optimization** - Code splitting and tree shaking
- **React Optimization** - memo, useMemo, useCallback where beneficial
- **Loading Strategies** - Progressive enhancement and lazy loading
- **Memory Management** - Proper cleanup and optimization

### Developer Experience
- **Modern Tooling** - Vite, Vitest, ESLint with modern rules
- **Type Safety** - PropTypes and careful data handling
- **Testing Strategy** - Comprehensive testing at all levels
- **Documentation** - Clear documentation and examples

## 📋 Development Workflow

### 1. Component Development

```jsx
// Follow React Guide patterns
import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const UserCard = ({ user, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleEdit = useCallback(() => {
    onEdit(user);
  }, [user, onEdit]);

  return (
    <div className="user-card">
      <UserAvatar user={user} />
      <UserInfo user={user} expanded={isExpanded} />
      <UserActions onEdit={handleEdit} onDelete={onDelete} />
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default UserCard;
```

### 2. Custom Hook Development

```javascript
// Follow Custom Hooks Guide patterns
const useUserData = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        
        if (!cancelled) {
          setUser(userData);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (userId) {
      fetchUser();
    }

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { user, loading, error };
};
```

### 3. Testing Approach

```javascript
// Follow Testing Guide patterns
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import UserCard from './UserCard.component';

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com'
  };

  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    
    render(<UserCard user={mockUser} onEdit={onEdit} />);

    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(mockUser);
  });
});
```

## 🛠️ Available Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src --ext .js,.jsx --max-warnings 0",
    "lint:fix": "eslint src --ext .js,.jsx --fix",
    "type-check": "tsc --noEmit"
  }
}
```

## 📦 Recommended Dependencies

### Core Dependencies
```bash
# React ecosystem
npm install react react-dom react-router-dom

# State management (choose based on needs)
npm install @tanstack/react-query  # For server state
npm install @reduxjs/toolkit react-redux  # For complex client state

# UI and utilities
npm install axios date-fns
```

### Development Dependencies
```bash
# Build tools
npm install --save-dev vite @vitejs/plugin-react

# Linting and formatting
npm install --save-dev eslint eslint-config-airbnb
npm install --save-dev eslint-plugin-react eslint-plugin-react-hooks
npm install --save-dev prettier

# Testing
npm install --save-dev vitest @testing-library/react
npm install --save-dev @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jsdom
```

## 🚀 Performance Optimization

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Monitor bundle size
npm install --save-dev size-limit
```

### Code Splitting Examples
```javascript
// Route-based splitting
const Dashboard = lazy(() => import('./pages/Dashboard.component'));
const UserProfile = lazy(() => import('./pages/UserProfile.component'));

// Feature-based splitting
const AdminPanel = lazy(() => import('./features/admin/AdminPanel.component'));
```

### Performance Monitoring
```javascript
// Core Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## 🔧 IDE Configuration

### VS Code Settings
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript", "javascriptreact"]
}
```

### Recommended Extensions
- ESLint
- Prettier - Code formatter
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer

## 🎯 Migration Path

### From Airbnb Configuration
1. **Update ESLint Config** - Follow [ESLint Configuration Guide](./ESLINT_CONFIG.md)
2. **Convert Class Components** - Use [Migration Guide](./MIGRATION_GUIDE.md)
3. **Modernize Patterns** - Apply [React Guide](./REACT_GUIDE.md) patterns
4. **Optimize Performance** - Implement [Performance Guide](./PERFORMANCE_GUIDE.md) techniques

### From Create React App
1. **Migrate to Vite** - Follow build tool migration in [Migration Guide](./MIGRATION_GUIDE.md)
2. **Update Testing** - Switch from Jest to Vitest
3. **Reorganize Structure** - Apply [File Organization Guide](./FILE_ORGANIZATION.md)
4. **Optimize Bundle** - Implement code splitting and optimization

## 🤝 Contributing

### Adding New Patterns
1. **Follow Existing Structure** - Use established guide formats
2. **Provide Examples** - Include practical, real-world examples
3. **Test Thoroughly** - Ensure all examples work as expected
4. **Document Rationale** - Explain why patterns are recommended

### Updating Guides
1. **Keep Current** - Update for latest React and ecosystem changes
2. **Maintain Consistency** - Follow established conventions
3. **Add Migration Notes** - Help teams transition smoothly
4. **Test Examples** - Verify all code examples work

## 📖 Additional Resources

### Official Documentation
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Vitest Documentation](https://vitest.dev/)
- [ESLint Documentation](https://eslint.org/)

### Community Resources
- [React Patterns](https://reactpatterns.com/)
- [JavaScript Info](https://javascript.info/)
- [Web.dev](https://web.dev/) - Performance and best practices

### Tools and Libraries
- [React DevTools](https://react.dev/learn/react-developer-tools)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [React Hook Form](https://react-hook-form.com/)
- [TanStack Query](https://tanstack.com/query)

## 📄 License

This guide collection is available under the MIT License. Feel free to use, modify, and distribute as needed for your projects and teams.

---

**Built for modern React development** 🚀

For specific implementation details, dive into the individual guides. Each guide is designed to be comprehensive yet practical, with real-world examples and clear migration paths from legacy patterns.