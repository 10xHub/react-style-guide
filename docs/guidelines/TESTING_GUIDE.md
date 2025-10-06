# Testing Guide

> Comprehensive testing patterns with Vitest, React Testing Library, and modern testing practices

---

## Automated Linting & Test File Naming

Test file naming, structure, and many best practices in this guide are enforced by the organization-wide ESLint config [`@10xscale/eslint-modern`](https://www.npmjs.com/package/@10xscale/eslint-modern).

**To use this config in your project:**

```js
// eslint.config.js (ESLint v9+ Flat Config)
import config from '@10xscale/eslint-modern'
export default config
```

- Test file naming conventions (e.g., `.test.js`, `.test.jsx`), import order, and code style are enforced automatically by ESLint.
- For details on the rules, see the [config source](https://www.npmjs.com/package/@10xscale/eslint-modern) or [`package/index.js`](package/index.js:1).

---

## Table of Contents

1. [Testing Philosophy](#testing-philosophy)
2. [Setup and Configuration](#setup-and-configuration)
3. [Component Testing](#component-testing)
4. [Hook Testing](#hook-testing)
5. [Integration Testing](#integration-testing)
6. [Mock Strategies](#mock-strategies)
7. [Testing Utilities](#testing-utilities)
8. [Performance Testing](#performance-testing)
9. [Best Practices](#best-practices)

## Testing Philosophy

### Testing Pyramid

```
    /\
   /  \    E2E Tests (Few, High-level)
  /____\   
 /      \   Integration Tests (Some, Mid-level)
/__________\ Unit Tests (Many, Low-level)
```

### Testing Principles

1. **Test behavior, not implementation**
2. **Write tests that give confidence**
3. **Make tests maintainable**
4. **Test user interactions**
5. **Fail fast and clearly**

### File Naming Convention

```
src/
├── components/
│   ├── UserCard.jsx
│   ├── UserCard.test.jsx           # Component tests
│   └── UserCard.stories.jsx        # Storybook stories
├── lib/hooks/
│   ├── useUserData.hook.js
│   └── useUserData.test.js         # Hook tests
├── services/
│   ├── user.api.js
│   └── user.api.test.js            # API tests
└── __tests__/                      # Integration tests
    ├── user-flow.test.js
    └── dashboard.test.js
```

## Setup and Configuration

### Installation

```bash
# Core testing packages
npm install --save-dev vitest
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
npm install --save-dev @testing-library/user-event

# Additional testing utilities
npm install --save-dev jsdom
npm install --save-dev @vitejs/plugin-react
npm install --save-dev msw
npm install --save-dev @testing-library/react-hooks
```

### Vitest Configuration

```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{js,jsx}',
        '**/*.stories.{js,jsx}',
        'src/main.jsx'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

### Test Setup

```javascript
// src/test/setup.js
import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn()
}));

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// MSW setup
beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  cleanup();
});
afterAll(() => server.close());
```

### Mock Service Worker Setup

```javascript
// src/test/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// src/test/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  // User API handlers
  rest.get('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        users: [
          { id: '1', name: 'John Doe', email: 'john@example.com' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
        ]
      })
    );
  }),

  rest.get('/api/users/:id', (req, res, ctx) => {
    const { id } = req.params;
    return res(
      ctx.status(200),
      ctx.json({
        id,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      })
    );
  }),

  rest.post('/api/users', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '3',
        ...req.body,
        createdAt: new Date().toISOString()
      })
    );
  })
];
```

## Component Testing

### Basic Component Testing

```jsx
// UserCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UserCard from './UserCard';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  avatar: 'https://example.com/avatar.jpg',
  role: 'user'
};

describe('UserCard', () => {
  it('renders user information correctly', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('user')).toBeInTheDocument();
    expect(screen.getByAltText('John Doe avatar')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    const onEdit = vi.fn();
    render(<UserCard user={mockUser} onEdit={onEdit} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(mockUser);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it('does not render action buttons when handlers are not provided', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();
  });

  it('applies correct CSS classes based on variant', () => {
    const { rerender } = render(<UserCard user={mockUser} variant="compact" />);

    expect(screen.getByTestId('user-card')).toHaveClass('user-card--compact');

    rerender(<UserCard user={mockUser} variant="detailed" />);
    expect(screen.getByTestId('user-card')).toHaveClass('user-card--detailed');
  });

  it('handles missing user data gracefully', () => {
    const incompleteUser = { id: '1', name: 'John' };
    render(<UserCard user={incompleteUser} />);

    expect(screen.getByText('John')).toBeInTheDocument();
    // Should not crash when optional fields are missing
  });
});
```

### Testing with User Events

```jsx
// LoginForm.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import LoginForm from './LoginForm';

describe('LoginForm', () => {
  it('submits form with correct data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    
    render(<LoginForm onSubmit={onSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });
  });

  it('shows validation errors for invalid input', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('disables submit button while loading', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    render(<LoginForm onSubmit={onSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/signing in.../i)).toBeInTheDocument();
  });
});
```

### Testing with Context

```jsx
// UserProfile.test.jsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthContext } from '../../lib/context/AuthContext';
import UserProfile from './UserProfile';

const renderWithAuth = (component, authValue) => {
  return render(
    <AuthContext.Provider value={authValue}>
      {component}
    </AuthContext.Provider>
  );
};

describe('UserProfile', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin'
  };

  it('shows edit button for admin users', () => {
    const authValue = {
      user: mockUser,
      isAuthenticated: true
    };

    renderWithAuth(<UserProfile user={mockUser} />, authValue);

    expect(screen.getByRole('button', { name: /edit profile/i })).toBeInTheDocument();
  });

  it('hides edit button for non-admin users', () => {
    const authValue = {
      user: { ...mockUser, role: 'user' },
      isAuthenticated: true
    };

    renderWithAuth(<UserProfile user={mockUser} />, authValue);

    expect(screen.queryByRole('button', { name: /edit profile/i })).not.toBeInTheDocument();
  });

  it('shows login prompt for unauthenticated users', () => {
    const authValue = {
      user: null,
      isAuthenticated: false
    };

    renderWithAuth(<UserProfile user={mockUser} />, authValue);

    expect(screen.getByText(/please log in to view profile/i)).toBeInTheDocument();
  });
});
```

## Hook Testing

### Basic Hook Testing

```javascript
// useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter.hook';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);
  });

  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.decrement();
    });

    expect(result.current.count).toBe(4);
  });

  it('should reset count to initial value', () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => {
      result.current.increment();
      result.current.increment();
    });

    expect(result.current.count).toBe(7);

    act(() => {
      result.current.reset();
    });

    expect(result.current.count).toBe(5);
  });
});
```

### Testing Hooks with Dependencies

```javascript
// useUserData.test.js
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import { useUserData } from './useUserData.hook';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useUserData', () => {
  it('should return loading state initially', () => {
    const { result } = renderHook(() => useUserData('user-123'), {
      wrapper: createWrapper()
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should fetch and return user data', async () => {
    const { result } = renderHook(() => useUserData('user-123'), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual({
      id: 'user-123',
      name: 'John Doe',
      email: 'john@example.com'
    });
    expect(result.current.error).toBe(null);
  });

  it('should handle errors', async () => {
    // Mock API to return error
    vi.mocked(userApi.getUser).mockRejectedValueOnce(new Error('User not found'));

    const { result } = renderHook(() => useUserData('invalid-id'), {
      wrapper: createWrapper()
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBe(null);
    expect(result.current.error).toBeInstanceOf(Error);
  });

  it('should not fetch when userId is not provided', () => {
    const { result } = renderHook(() => useUserData(null), {
      wrapper: createWrapper()
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBe(null);
  });
});
```

### Testing Custom Hooks with Context

```javascript
// useAuth.test.js
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { AuthProvider } from '../../lib/context/AuthContext';
import { useAuth } from './useAuth.hook';

const wrapper = ({ children }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
    });

    expect(result.current.user).toEqual({
      id: '1',
      name: 'Test User',
      email: 'test@example.com'
    });
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should handle login errors', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      try {
        await result.current.login({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        });
      } catch (error) {
        expect(error.message).toBe('Invalid credentials');
      }
    });

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should logout successfully', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    // First login
    await act(async () => {
      await result.current.login({
        email: 'test@example.com',
        password: 'password'
      });
    });

    expect(result.current.isAuthenticated).toBe(true);

    // Then logout
    await act(async () => {
      await result.current.logout();
    });

    expect(result.current.user).toBe(null);
    expect(result.current.isAuthenticated).toBe(false);
  });
});
```

## Integration Testing

### Page Component Testing

```jsx
// UserDashboard.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect } from 'vitest';
import UserDashboard from './UserDashboard';

const renderWithProviders = (component, { route = '/' } = {}) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <MemoryRouter initialEntries={[route]}>
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    </MemoryRouter>
  );
};

describe('UserDashboard Integration', () => {
  it('loads and displays user data', async () => {
    renderWithProviders(<UserDashboard userId="user-123" />);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('handles user editing flow', async () => {
    const user = userEvent.setup();
    renderWithProviders(<UserDashboard userId="user-123" />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click edit button
    await user.click(screen.getByRole('button', { name: /edit/i }));

    // Edit form should appear
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();

    // Update name
    const nameInput = screen.getByDisplayValue('John Doe');
    await user.clear(nameInput);
    await user.type(nameInput, 'John Smith');

    // Save changes
    await user.click(screen.getByRole('button', { name: /save/i }));

    // Verify update
    await waitFor(() => {
      expect(screen.getByText('John Smith')).toBeInTheDocument();
    });
  });

  it('handles error states', async () => {
    renderWithProviders(<UserDashboard userId="invalid-id" />);

    await waitFor(() => {
      expect(screen.getByText(/error loading user/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
  });
});
```

### User Flow Testing

```jsx
// user-registration-flow.test.js
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('User Registration Flow', () => {
  it('completes full registration process', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );

    // Step 1: Personal Information
    expect(screen.getByText(/personal information/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Step 2: Account Details
    await waitFor(() => {
      expect(screen.getByText(/account details/i)).toBeInTheDocument();
    });

    await user.type(screen.getByLabelText(/password/i), 'SecurePassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'SecurePassword123');
    await user.click(screen.getByRole('button', { name: /next/i }));

    // Step 3: Preferences
    await waitFor(() => {
      expect(screen.getByText(/preferences/i)).toBeInTheDocument();
    });

    await user.selectOptions(screen.getByLabelText(/language/i), 'en');
    await user.click(screen.getByLabelText(/newsletter/i));
    await user.click(screen.getByRole('button', { name: /complete registration/i }));

    // Success
    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });

    // Should redirect to dashboard
    await waitFor(() => {
      expect(screen.getByText(/welcome to your dashboard/i)).toBeInTheDocument();
    });
  });

  it('validates form fields correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );

    // Try to proceed without filling required fields
    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    });

    // Fill with invalid email
    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
    });
  });
});
```

## Mock Strategies

### API Mocking

```javascript
// src/test/mocks/userApi.mock.js
import { vi } from 'vitest';

export const mockUserApi = {
  getUsers: vi.fn().mockResolvedValue({
    data: [
      { id: '1', name: 'John Doe', email: 'john@example.com' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com' }
    ]
  }),

  getUserById: vi.fn().mockImplementation((id) => {
    if (id === 'invalid-id') {
      return Promise.reject(new Error('User not found'));
    }
    return Promise.resolve({
      data: {
        id,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      }
    });
  }),

  createUser: vi.fn().mockResolvedValue({
    data: {
      id: '3',
      name: 'New User',
      email: 'new@example.com',
      createdAt: new Date().toISOString()
    }
  }),

  updateUser: vi.fn().mockImplementation((id, updates) => {
    return Promise.resolve({
      data: {
        id,
        ...updates,
        updatedAt: new Date().toISOString()
      }
    });
  }),

  deleteUser: vi.fn().mockResolvedValue({ success: true })
};

// Mock the module
vi.mock('../../services/api/user.api', () => ({
  userApi: mockUserApi
}));
```

### Component Mocking

```javascript
// Mock heavy components
vi.mock('../components/HeavyChart', () => ({
  default: ({ data }) => <div data-testid="mock-chart">Chart with {data.length} items</div>
}));

// Mock third-party components
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ pathname: '/test' })
  };
});

// Conditional mocking
const mockComponent = (props) => {
  if (process.env.NODE_ENV === 'test') {
    return <div data-testid="mocked-component" {...props} />;
  }
  return <ActualComponent {...props} />;
};
```

### Hook Mocking

```javascript
// Mock custom hooks
vi.mock('../../lib/hooks/useAuth.hook', () => ({
  useAuth: vi.fn(() => ({
    user: { id: '1', name: 'Test User' },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn()
  }))
}));

// Partial hook mocking
vi.mock('../../lib/hooks/useUserData.hook', () => ({
  useUserData: vi.fn()
}));

// In test file
beforeEach(() => {
  useUserData.mockReturnValue({
    data: mockUser,
    loading: false,
    error: null
  });
});
```

## Testing Utilities

### Custom Render Function

```javascript
// src/test/utils/test-utils.jsx
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../../lib/context/AuthContext';
import { ThemeProvider } from '../../lib/context/ThemeContext';

const AllTheProviders = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return (
    <MemoryRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  );
};

const customRender = (ui, options) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
```

### Test Data Factories

```javascript
// src/test/factories/user.factory.js
export const createUser = (overrides = {}) => ({
  id: Math.random().toString(36).substr(2, 9),
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
});

export const createUsers = (count = 3, overrides = {}) => {
  return Array.from({ length: count }, (_, index) =>
    createUser({
      id: `user-${index + 1}`,
      name: `User ${index + 1}`,
      email: `user${index + 1}@example.com`,
      ...overrides
    })
  );
};

// Usage in tests
const testUser = createUser({ role: 'admin' });
const testUsers = createUsers(5, { role: 'user' });
```

### Assertion Helpers

```javascript
// src/test/utils/assertions.js
import { screen } from '@testing-library/react';

export const expectToBeLoading = () => {
  expect(screen.getByText(/loading.../i)).toBeInTheDocument();
};

export const expectToHaveError = (errorMessage) => {
  expect(screen.getByText(errorMessage)).toBeInTheDocument();
};

export const expectFormFieldError = (fieldName, errorMessage) => {
  expect(screen.getByText(errorMessage)).toBeInTheDocument();
  expect(screen.getByLabelText(new RegExp(fieldName, 'i'))).toHaveAttribute('aria-invalid', 'true');
};

export const expectToBeAccessible = async (element) => {
  const { container } = render(element);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
};
```

## Performance Testing

### Component Performance

```javascript
// Performance testing with React DevTools Profiler
import { Profiler } from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

describe('UserList Performance', () => {
  it('should not re-render unnecessarily', () => {
    const onRender = vi.fn();
    const users = createUsers(100);

    const { rerender } = render(
      <Profiler id="UserList" onRender={onRender}>
        <UserList users={users} />
      </Profiler>
    );

    // Initial render
    expect(onRender).toHaveBeenCalledTimes(1);

    // Re-render with same props - should not trigger re-render due to memo
    rerender(
      <Profiler id="UserList" onRender={onRender}>
        <UserList users={users} />
      </Profiler>
    );

    expect(onRender).toHaveBeenCalledTimes(1);
  });

  it('should handle large datasets efficiently', () => {
    const startTime = performance.now();
    const users = createUsers(1000);

    render(<UserList users={users} />);

    const renderTime = performance.now() - startTime;
    
    // Render should complete within reasonable time
    expect(renderTime).toBeLessThan(100); // 100ms threshold
  });
});
```

### Memory Leak Testing

```javascript
// Memory leak detection
describe('Memory Leak Tests', () => {
  it('should not leak memory on component unmount', () => {
    const { unmount } = render(<ComplexComponent />);
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    const initialMemory = performance.memory?.usedJSHeapSize || 0;
    
    unmount();
    
    if (global.gc) {
      global.gc();
    }
    
    const finalMemory = performance.memory?.usedJSHeapSize || 0;
    
    // Memory should not increase significantly
    expect(finalMemory - initialMemory).toBeLessThan(1000000); // 1MB threshold
  });
});
```

## Best Practices

### Test Organization

```javascript
// Group related tests
describe('UserCard Component', () => {
  describe('Rendering', () => {
    it('renders user information correctly', () => {});
    it('applies correct CSS classes', () => {});
    it('handles missing data gracefully', () => {});
  });

  describe('Interactions', () => {
    it('calls onEdit when edit button is clicked', () => {});
    it('calls onDelete with confirmation', () => {});
    it('toggles expanded state', () => {});
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {});
    it('supports keyboard navigation', () => {});
    it('meets contrast requirements', () => {});
  });
});
```

### Test Data Management

```javascript
// Use consistent test data
const TEST_DATA = {
  USER: {
    ADMIN: createUser({ role: 'admin' }),
    REGULAR: createUser({ role: 'user' }),
    INACTIVE: createUser({ isActive: false })
  },
  API_RESPONSES: {
    SUCCESS: { status: 200, data: {} },
    ERROR: { status: 500, message: 'Server Error' },
    NOT_FOUND: { status: 404, message: 'Not Found' }
  }
};
```

### Error Boundary Testing

```jsx
// ErrorBoundary.test.jsx
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ErrorBoundary', () => {
  it('catches and displays error', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest --watch",
    "test:e2e": "playwright test"
  }
}
```

This comprehensive testing guide provides patterns for testing React applications with Vitest, focusing on practical examples and best practices for maintaining a robust test suite.