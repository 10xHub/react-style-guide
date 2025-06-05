# Migration Guide

> Step-by-step guide for migrating from Airbnb and other configurations to modern React patterns

## Table of Contents

1. [Migration Overview](#migration-overview)
2. [From Airbnb ESLint Config](#from-airbnb-eslint-config)
3. [From Class Components](#from-class-components)
4. [From Legacy State Management](#from-legacy-state-management)
5. [From Jest to Vitest](#from-jest-to-vitest)
6. [From Create React App](#from-create-react-app)
7. [Code Transformation Examples](#code-transformation-examples)
8. [Migration Checklist](#migration-checklist)

## Migration Overview

### Why Migrate?

**From Airbnb Style Guide:**
- Outdated React patterns (class components focus)
- Missing React 19 features
- No performance optimization rules
- Limited modern JavaScript support

**From Legacy Patterns:**
- Better performance with modern hooks
- Improved developer experience
- Enhanced type safety
- Modern tooling benefits

### Migration Strategy

1. **Incremental Migration** - Update piece by piece
2. **Coexistence Period** - Run old and new patterns together
3. **Team Training** - Ensure team understands new patterns
4. **Testing** - Comprehensive testing during transition

## From Airbnb ESLint Config

### Step 1: Update Dependencies

```bash
# Remove old Airbnb dependencies
npm uninstall eslint-config-airbnb-base

# Install new dependencies
npm install --save-dev eslint-config-airbnb
npm install --save-dev eslint-plugin-react-hooks
npm install --save-dev eslint-plugin-react-refresh
npm install --save-dev eslint-plugin-prefer-arrow
npm install --save-dev eslint-plugin-unicorn
npm install --save-dev eslint-plugin-sonarjs
```

### Step 2: Update ESLint Configuration

```javascript
// .eslintrc.js - Before
module.exports = {
  extends: ['airbnb-base'],
  rules: {
    'no-console': 'warn'
  }
};

// .eslintrc.js - After
module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks'
  ],
  plugins: [
    'react',
    'react-hooks',
    'react-refresh',
    'prefer-arrow',
    'unicorn',
    'sonarjs'
  ],
  rules: {
    // Modern React patterns
    'react/function-component-definition': ['error', {
      namedComponents: 'arrow-function'
    }],
    'react/react-in-jsx-scope': 'off',
    
    // Performance rules
    'react/jsx-no-bind': 'error',
    'react/jsx-no-constructed-context-values': 'error',
    
    // Modern JavaScript
    'prefer-arrow/prefer-arrow-functions': 'error',
    'unicorn/prefer-module': 'error',
    
    // Override Airbnb rules for modern patterns
    'import/prefer-default-export': 'off',
    'react/jsx-props-no-spreading': ['error', {
      custom: 'ignore',
      explicitSpread: 'ignore'
    }]
  }
};
```

### Step 3: Update File Extensions

```bash
# Rename .js files to .jsx for React components
find src -name "*.js" -exec grep -l "React\|jsx" {} \; | while read file; do
  mv "$file" "${file%.js}.jsx"
done
```

### Step 4: Fix Common Rule Violations

```javascript
// Before - Airbnb style
import React, { Component } from 'react';

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: true };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // handle click
  }

  render() {
    return <div onClick={this.handleClick}>Profile</div>;
  }
}

export default UserProfile;

// After - Modern style
import { useState, useCallback } from 'react';

const UserProfile = () => {
  const [loading, setLoading] = useState(true);

  const handleClick = useCallback(() => {
    // handle click
  }, []);

  return <div onClick={handleClick}>Profile</div>;
};

export default UserProfile;
```

## From Class Components

### Automated Conversion Tools

```bash
# Install conversion tools
npm install -g react-codemod

# Convert class components to hooks
npx react-codemod class-to-hooks src/

# Convert lifecycle methods
npx react-codemod lifecycle-to-hooks src/
```

### Manual Conversion Examples

#### State Conversion

```jsx
// Before - Class component state
class UserForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      errors: {}
    };
  }

  updateField = (field, value) => {
    this.setState({ [field]: value });
  };

  render() {
    return (
      <form>
        <input 
          value={this.state.name}
          onChange={(e) => this.updateField('name', e.target.value)}
        />
      </form>
    );
  }
}

// After - Functional component with hooks
const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    errors: {}
  });

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  return (
    <form>
      <input 
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
      />
    </form>
  );
};
```

#### Lifecycle Method Conversion

```jsx
// Before - Class lifecycle methods
class DataFetcher extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null, loading: true };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchData();
    }
  }

  componentWillUnmount() {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  fetchData = async () => {
    this.abortController = new AbortController();
    try {
      const data = await fetchUser(this.props.userId, {
        signal: this.abortController.signal
      });
      this.setState({ data, loading: false });
    } catch (error) {
      if (error.name !== 'AbortError') {
        this.setState({ error, loading: false });
      }
    }
  };

  render() {
    const { data, loading, error } = this.state;
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    return <div>{JSON.stringify(data)}</div>;
  }
}

// After - Functional component with useEffect
const DataFetcher = ({ userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await fetchUser(userId, {
          signal: abortController.signal
        });
        
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled && err.name !== 'AbortError') {
          setError(err);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      abortController.abort();
    };
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{JSON.stringify(data)}</div>;
};
```

### Context Migration

```jsx
// Before - Class-based context
class ThemeProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { theme: 'light' };
  }

  toggleTheme = () => {
    this.setState(prev => ({ 
      theme: prev.theme === 'light' ? 'dark' : 'light' 
    }));
  };

  render() {
    return (
      <ThemeContext.Provider value={{
        theme: this.state.theme,
        toggleTheme: this.toggleTheme
      }}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

// After - Functional context provider
const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const value = useMemo(() => ({
    theme,
    toggleTheme
  }), [theme, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## From Legacy State Management

### Redux to Redux Toolkit

```javascript
// Before - Legacy Redux
// actions/user.js
export const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const fetchUserRequest = () => ({ type: FETCH_USER_REQUEST });
export const fetchUserSuccess = (user) => ({ type: FETCH_USER_SUCCESS, payload: user });
export const fetchUserFailure = (error) => ({ type: FETCH_USER_FAILURE, payload: error });

export const fetchUser = (userId) => async (dispatch) => {
  dispatch(fetchUserRequest());
  try {
    const user = await api.getUser(userId);
    dispatch(fetchUserSuccess(user));
  } catch (error) {
    dispatch(fetchUserFailure(error.message));
  }
};

// reducers/user.js
const initialState = {
  data: null,
  loading: false,
  error: null
};

export const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_USER_SUCCESS:
      return { ...state, loading: false, data: action.payload };
    case FETCH_USER_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// After - Redux Toolkit
// store/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async (userId, { rejectWithValue }) => {
    try {
      const user = await api.getUser(userId);
      return user;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = userSlice.actions;
export default userSlice.reducer;
```

### From Redux to TanStack Query

```jsx
// Before - Redux for data fetching
const UserProfile = ({ userId }) => {
  const { user, loading, error } = useSelector(state => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchUser(userId));
  }, [dispatch, userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return <div>{user.name}</div>;
};

// After - TanStack Query
const UserProfile = ({ userId }) => {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user.name}</div>;
};
```

## From Jest to Vitest

### Configuration Migration

```javascript
// Before - jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js'
  ]
};

// After - vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js']
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### Test Migration

```javascript
// Before - Jest syntax
import { render, screen } from '@testing-library/react';

describe('UserCard', () => {
  test('renders user name', () => {
    render(<UserCard user={{ name: 'John' }} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});

// After - Vitest syntax (very similar)
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('UserCard', () => {
  it('renders user name', () => {
    render(<UserCard user={{ name: 'John' }} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });
});
```

### Mock Migration

```javascript
// Before - Jest mocks
jest.mock('../api/userApi');
const mockUserApi = require('../api/userApi');

// After - Vitest mocks
import { vi } from 'vitest';
import * as userApi from '../api/userApi';

vi.mock('../api/userApi');
const mockUserApi = vi.mocked(userApi);
```

## From Create React App

### Step 1: Install Vite

```bash
npm install --save-dev vite @vitejs/plugin-react
```

### Step 2: Create Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'build',
    sourcemap: true
  }
});
```

### Step 3: Update index.html

```html
<!-- Before - public/index.html (CRA) -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>

<!-- After - index.html (Vite) -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>React App</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### Step 4: Update Entry Point

```javascript
// Before - src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(<App />, document.getElementById('root'));

// After - src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 5: Update Package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui"
  }
}
```

## Code Transformation Examples

### Event Handlers

```jsx
// Before - Inline functions
const UserList = ({ users }) => (
  <div>
    {users.map(user => (
      <div key={user.id} onClick={() => handleClick(user)}>
        {user.name}
      </div>
    ))}
  </div>
);

// After - Memoized handlers
const UserList = ({ users, onUserClick }) => {
  const handleUserClick = useCallback((user) => {
    onUserClick(user);
  }, [onUserClick]);

  return (
    <div>
      {users.map(user => (
        <UserItem
          key={user.id}
          user={user}
          onClick={handleUserClick}
        />
      ))}
    </div>
  );
};

const UserItem = React.memo(({ user, onClick }) => (
  <div onClick={() => onClick(user)}>
    {user.name}
  </div>
));
```

### Form Handling

```jsx
// Before - Controlled components with individual state
const UserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user');

  return (
    <form>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </form>
  );
};

// After - Custom hook with unified state
const useForm = (initialValues) => {
  const [values, setValues] = useState(initialValues);

  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
  }, []);

  const getFieldProps = useCallback((name) => ({
    value: values[name],
    onChange: (e) => setValue(name, e.target.value)
  }), [values, setValue]);

  return { values, setValue, getFieldProps };
};

const UserForm = () => {
  const { values, getFieldProps } = useForm({
    name: '',
    email: '',
    role: 'user'
  });

  return (
    <form>
      <input {...getFieldProps('name')} />
      <input {...getFieldProps('email')} />
      <select {...getFieldProps('role')}>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>
    </form>
  );
};
```

### Data Fetching

```jsx
// Before - useEffect with manual state management
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await api.getUser(userId);
        setUser(userData);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user.name}</div>;
};

// After - Custom hook with TanStack Query
const useUser = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => api.getUser(userId),
    enabled: !!userId
  });
};

const UserProfile = ({ userId }) => {
  const { data: user, isLoading, error } = useUser(userId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  return <div>{user.name}</div>;
};
```

## Migration Checklist

### Pre-Migration

- [ ] Audit current codebase and dependencies
- [ ] Create migration timeline and phases
- [ ] Set up development branch for migration
- [ ] Document current patterns and pain points
- [ ] Train team on new patterns

### ESLint Migration

- [ ] Update ESLint dependencies
- [ ] Configure new rules incrementally
- [ ] Fix existing violations
- [ ] Update file extensions (.js to .jsx)
- [ ] Configure IDE integration

### Component Migration

- [ ] Convert class components to functional components
- [ ] Replace lifecycle methods with useEffect
- [ ] Implement custom hooks for reusable logic
- [ ] Add React.memo where beneficial
- [ ] Optimize event handlers with useCallback

### State Management Migration

- [ ] Evaluate current state management needs
- [ ] Migrate to Redux Toolkit (if using Redux)
- [ ] Consider TanStack Query for server state
- [ ] Implement optimized Context providers
- [ ] Remove unnecessary state management

### Testing Migration

- [ ] Migrate from Jest to Vitest
- [ ] Update test configurations
- [ ] Convert mock syntax
- [ ] Update testing utilities
- [ ] Add new testing patterns

### Build Tool Migration

- [ ] Migrate from CRA to Vite
- [ ] Update build configurations
- [ ] Configure development server
- [ ] Update deployment scripts
- [ ] Test build performance

### Performance Optimization

- [ ] Implement code splitting
- [ ] Add bundle analysis
- [ ] Optimize images and assets
- [ ] Configure caching strategies
- [ ] Set up performance monitoring

### Post-Migration

- [ ] Run comprehensive testing
- [ ] Monitor performance metrics
- [ ] Update documentation
- [ ] Provide team training
- [ ] Plan ongoing maintenance

### Rollback Plan

- [ ] Maintain backup of previous configuration
- [ ] Document rollback procedures
- [ ] Test rollback process
- [ ] Prepare communication plan
- [ ] Monitor for critical issues

This migration guide provides a structured approach to modernizing your React codebase while minimizing disruption to development workflows.