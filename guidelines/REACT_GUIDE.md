# React Style Guide

> Modern React 19+ patterns, functional components, and best practices with JavaScript examples

---

## Automated Linting & Style Enforcement

This guide is enforced by the organization-wide ESLint config [`@10xscale/eslint-modern`](https://www.npmjs.com/package/@10xscale/eslint-modern), which covers all React, JSX, and hooks rules described here.

**To use this config in your project:**

```js
// eslint.config.js (ESLint v9+ Flat Config)
import config from '@10xscale/eslint-modern'
export default config
```

- All React/JSX naming, file naming, hooks, and best practices in this guide are enforced automatically by ESLint.
- For details on the rules, see the [config source](https://www.npmjs.com/package/@10xscale/eslint-modern) or [`package/index.js`](package/index.js:1).

---

## Table of Contents

1. [Component Fundamentals](#component-fundamentals)
2. [Props and PropTypes](#props-and-proptypes)
3. [State Management](#state-management)
4. [Event Handling](#event-handling)
5. [Lifecycle and Effects](#lifecycle-and-effects)
6. [Component Composition](#component-composition)
7. [Performance Optimization](#performance-optimization)
8. [React 19 Features](#react-19-features)
9. [Error Boundaries](#error-boundaries)
10. [Testing Patterns](#testing-patterns)

## Component Fundamentals

### Functional Components Only

**✅ Use functional components with hooks:**

```jsx
// Good: Functional component
const UserProfile = ({ userId, onEdit }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <UserAvatar user={user} />
      <UserDetails user={user} />
      <ActionButtons onEdit={onEdit} user={user} />
    </div>
  );
};
```

**❌ Avoid class components:**

```jsx
// Don't use class components
class UserProfile extends Component { // ❌
  constructor(props) {
    super(props);
    this.state = { user: null };
  }
  
  render() {
    return <div>{/* component content */}</div>;
  }
}
```

### Component Naming

**✅ Use PascalCase and descriptive names:**

```jsx
// Component names
const UserDashboard = () => { /* ... */ };
const NavigationMenu = () => { /* ... */ };
const ProductCard = () => { /* ... */ };
const ShoppingCartIcon = () => { /* ... */ };

// Feature-specific components
const AuthLoginForm = () => { /* ... */ };
const DashboardStatsWidget = () => { /* ... */ };
const UserProfileAvatar = () => { /* ... */ };

// Higher-order components
const withAuthentication = (Component) => { /* ... */ };
const withErrorBoundary = (Component) => { /* ... */ };

// Hooks
const useUserData = () => { /* ... */ };
const useAuthState = () => { /* ... */ };
const useLocalStorage = () => { /* ... */ };
```

### File Organization

**✅ Follow consistent file naming:**

```
// Component files
UserProfile.jsx
NavigationMenu.jsx
ProductCard.jsx

// Hook files
useUserData.hook.js
useAuthState.hook.js
useLocalStorage.hook.js

// Utility files
formatters.util.js
validators.util.js
api-client.util.js
```

## Props and PropTypes

### Props Interface Design

**✅ Use PropTypes for validation:**

```jsx
import PropTypes from 'prop-types';

const UserCard = ({ 
  user, 
  onEdit, 
  onDelete, 
  showActions = true,
  variant = 'default',
  className = ''
}) => {
  const handleEdit = () => {
    onEdit(user);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure?')) {
      onDelete(user.id);
    }
  };

  return (
    <div className={`user-card user-card--${variant} ${className}`}>
      <div className="user-card__header">
        <img src={user.avatar} alt={`${user.name} avatar`} />
        <h3>{user.name}</h3>
        <span className="user-card__role">{user.role}</span>
      </div>
      
      <div className="user-card__body">
        <p>{user.email}</p>
        <p>Last login: {formatDate(user.lastLogin)}</p>
      </div>
      
      {showActions && (
        <div className="user-card__actions">
          <button onClick={handleEdit}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    role: PropTypes.string.isRequired,
    lastLogin: PropTypes.string
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'compact', 'detailed']),
  className: PropTypes.string
};

export default UserCard;
```

### Props Destructuring

**✅ Destructure props at the function signature:**

```jsx
// Good: Destructure in function signature with defaults
const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  ...restProps 
}) => {
  const buttonClass = `btn btn--${variant} btn--${size} ${className}`;
  
  return (
    <button
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...restProps}
    >
      {loading ? <Spinner /> : children}
    </button>
  );
};

// Good: Nested destructuring when needed
const UserProfile = ({ 
  user: { name, email, avatar, preferences = {} },
  settings: { theme = 'light', language = 'en' } = {},
  onUpdate
}) => {
  return (
    <div className={`profile profile--${theme}`}>
      <img src={avatar} alt={`${name} avatar`} />
      <h1>{name}</h1>
      <p>{email}</p>
      <p>Language: {language}</p>
    </div>
  );
};
```

### Children Patterns

**✅ Handle children prop effectively:**

```jsx
// Children as content
const Card = ({ children, title, className = '' }) => (
  <div className={`card ${className}`}>
    {title && <div className="card__header">{title}</div>}
    <div className="card__body">{children}</div>
  </div>
);

// Children as render prop
const DataProvider = ({ children, userId }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return children({ data, loading, error });
};

// Usage
const UserDashboard = ({ userId }) => (
  <DataProvider userId={userId}>
    {({ data, loading, error }) => {
      if (loading) return <LoadingSpinner />;
      if (error) return <ErrorMessage error={error} />;
      return <UserProfile user={data} />;
    }}
  </DataProvider>
);

// Children validation
const Modal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};
```

## State Management

### useState Patterns

**✅ Effective useState usage:**

```jsx
// Simple state
const Counter = () => {
  const [count, setCount] = useState(0);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(0);
  
  return (
    <div>
      <span>Count: {count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
};

// Object state
const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });
  
  const [errors, setErrors] = useState({});
  
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const handleSubmit = (event) => {
    event.preventDefault();
    
    const newErrors = validateForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    submitForm(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
        placeholder="Name"
      />
      {errors.name && <span className="error">{errors.name}</span>}
      
      <input
        value={formData.email}
        onChange={(e) => updateField('email', e.target.value)}
        placeholder="Email"
      />
      {errors.email && <span className="error">{errors.email}</span>}
      
      <button type="submit">Submit</button>
    </form>
  );
};

// Array state
const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  
  const addTodo = () => {
    if (!newTodo.trim()) return;
    
    const todo = {
      id: Date.now().toString(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date()
    };
    
    setTodos(prev => [...prev, todo]);
    setNewTodo('');
  };
  
  const toggleTodo = (id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  const deleteTodo = (id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };
  
  return (
    <div>
      <input
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && addTodo()}
      />
      <button onClick={addTodo}>Add Todo</button>
      
      <ul>
        {todos.map(todo => (
          <li key={todo.id}>
            <span 
              onClick={() => toggleTodo(todo.id)}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            >
              {todo.text}
            </span>
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
```

### useReducer for Complex State

**✅ Use useReducer for complex state logic:**

```jsx
// Action types
const ACTIONS = {
  LOAD_START: 'LOAD_START',
  LOAD_SUCCESS: 'LOAD_SUCCESS',
  LOAD_ERROR: 'LOAD_ERROR',
  UPDATE_FILTER: 'UPDATE_FILTER',
  UPDATE_SORT: 'UPDATE_SORT',
  RESET: 'RESET'
};

// Reducer function
const userListReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.LOAD_START:
      return {
        ...state,
        loading: true,
        error: null
      };
      
    case ACTIONS.LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        users: action.payload,
        error: null
      };
      
    case ACTIONS.LOAD_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
      
    case ACTIONS.UPDATE_FILTER:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };
      
    case ACTIONS.UPDATE_SORT:
      return {
        ...state,
        sortBy: action.payload.field,
        sortOrder: action.payload.order
      };
      
    case ACTIONS.RESET:
      return initialState;
      
    default:
      return state;
  }
};

// Initial state
const initialState = {
  users: [],
  loading: false,
  error: null,
  filters: { role: '', status: '' },
  sortBy: 'name',
  sortOrder: 'asc'
};

// Component using useReducer
const UserList = () => {
  const [state, dispatch] = useReducer(userListReducer, initialState);
  
  const loadUsers = async () => {
    dispatch({ type: ACTIONS.LOAD_START });
    
    try {
      const users = await fetchUsers(state.filters, state.sortBy, state.sortOrder);
      dispatch({ type: ACTIONS.LOAD_SUCCESS, payload: users });
    } catch (error) {
      dispatch({ type: ACTIONS.LOAD_ERROR, payload: error.message });
    }
  };
  
  const updateFilter = (filterUpdates) => {
    dispatch({ type: ACTIONS.UPDATE_FILTER, payload: filterUpdates });
  };
  
  const updateSort = (field, order) => {
    dispatch({ type: ACTIONS.UPDATE_SORT, payload: { field, order } });
  };
  
  useEffect(() => {
    loadUsers();
  }, [state.filters, state.sortBy, state.sortOrder]);
  
  return (
    <div>
      <UserFilters filters={state.filters} onUpdate={updateFilter} />
      <UserSort sortBy={state.sortBy} sortOrder={state.sortOrder} onUpdate={updateSort} />
      
      {state.loading && <LoadingSpinner />}
      {state.error && <ErrorMessage error={state.error} />}
      {state.users.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  );
};
```

## Event Handling

### Event Handler Patterns

**✅ Effective event handling:**

```jsx
const UserForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '' });
  
  // Generic change handler
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    const inputValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: inputValue
    }));
  };
  
  // Specific handler with parameter
  const handleRoleChange = (newRole) => {
    setFormData(prev => ({ ...prev, role: newRole }));
  };
  
  // Handler with validation
  const handleEmailChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({ ...prev, email: value }));
    
    // Real-time validation
    if (value && !isValidEmail(value)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };
  
  // Form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      await submitUserData(formData);
      showSuccessMessage('User created successfully');
      resetForm();
    } catch (error) {
      showErrorMessage(error.message);
    }
  };
  
  // Keyboard events
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      handleSubmit(event);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
      <input
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="Name"
      />
      
      <input
        name="email"
        value={formData.email}
        onChange={handleEmailChange}
        placeholder="Email"
      />
      
      <RoleSelector
        value={formData.role}
        onChange={handleRoleChange}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
};

// Click handlers with event delegation
const UserList = ({ users, onUserClick, onUserEdit, onUserDelete }) => {
  const handleListClick = (event) => {
    const userId = event.target.closest('[data-user-id]')?.dataset.userId;
    if (!userId) return;
    
    const action = event.target.dataset.action;
    
    switch (action) {
      case 'edit':
        onUserEdit(userId);
        break;
      case 'delete':
        onUserDelete(userId);
        break;
      default:
        onUserClick(userId);
    }
  };
  
  return (
    <div onClick={handleListClick}>
      {users.map(user => (
        <div key={user.id} data-user-id={user.id}>
          <span>{user.name}</span>
          <button data-action="edit">Edit</button>
          <button data-action="delete">Delete</button>
        </div>
      ))}
    </div>
  );
};
```

### Custom Event Hooks

**✅ Reusable event handling:**

```jsx
// Custom hook for keyboard shortcuts
const useKeyboardShortcut = (keys, callback, deps = []) => {
  useEffect(() => {
    const handleKeyPress = (event) => {
      const keyMatch = keys.every(key => {
        switch (key) {
          case 'ctrl': return event.ctrlKey;
          case 'shift': return event.shiftKey;
          case 'alt': return event.altKey;
          default: return event.key.toLowerCase() === key.toLowerCase();
        }
      });
      
      if (keyMatch) {
        event.preventDefault();
        callback(event);
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, deps);
};

// Custom hook for outside click
const useOutsideClick = (ref, callback) => {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
};

// Usage in components
const Modal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef();
  
  useKeyboardShortcut(['Escape'], onClose, [onClose]);
  useOutsideClick(modalRef, onClose);
  
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div ref={modalRef} className="modal-content">
        {children}
      </div>
    </div>
  );
};
```

## Lifecycle and Effects

### useEffect Patterns

**✅ Effective useEffect usage:**

```jsx
// Data fetching
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    let cancelled = false;
    
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        
        if (!cancelled) {
          setUser(userData);
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Failed to fetch user:', error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    
    fetchUser();
    
    return () => {
      cancelled = true;
    };
  }, [userId]);
  
  // ... rest of component
};

// Event listeners
const WindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return <div>Window size: {windowSize.width} x {windowSize.height}</div>;
};

// Subscriptions
const RealTimeData = ({ endpoint }) => {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const subscription = dataService.subscribe(endpoint, (newData) => {
      setData(newData);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [endpoint]);
  
  return <div>{JSON.stringify(data)}</div>;
};

// Timers
const AutoSave = ({ data, onSave }) => {
  useEffect(() => {
    const timer = setInterval(() => {
      onSave(data);
    }, 30000); // Auto-save every 30 seconds
    
    return () => {
      clearInterval(timer);
    };
  }, [data, onSave]);
  
  return null; // This component doesn't render anything
};
```

### Effect Dependencies

**✅ Manage dependencies correctly:**

```jsx
// Dependency array best practices
const SearchResults = ({ query, filters }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Memoize search function to avoid unnecessary re-runs
  const searchFunction = useCallback(async (searchQuery, searchFilters) => {
    setLoading(true);
    try {
      const data = await searchApi.search(searchQuery, searchFilters);
      setResults(data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Effect with proper dependencies
  useEffect(() => {
    if (query.length >= 3) {
      searchFunction(query, filters);
    } else {
      setResults([]);
    }
  }, [query, filters, searchFunction]);
  
  return (
    <div>
      {loading && <LoadingSpinner />}
      {results.map(result => (
        <SearchResultItem key={result.id} result={result} />
      ))}
    </div>
  );
};

// Custom effect hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage
const DebouncedSearch = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  
  useEffect(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery);
    }
  }, [debouncedQuery]);
  
  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

## Component Composition

### Higher-Order Components

**✅ Create reusable component enhancers:**

```jsx
// HOC for loading states
const withLoading = (Wrapped) => {
  const withLoading = (props) => {
    if (props.loading) {
      return <LoadingSpinner />;
    }
    
    return <Wrapped {...props} />;
  };
  
  withLoading.displayName = `withLoading(${Wrapped.displayName || Wrapped.name})`;
  
  return withLoading;
};

// HOC for error handling
const withErrorBoundary = (Wrapped, ErrorComponent = DefaultErrorComponent) => {
  class WithErrorBoundary extends Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
      return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
      console.error('Error caught by boundary:', error, errorInfo);
    }
    
    render() {
      if (this.state.hasError) {
        return <ErrorComponent error={this.state.error} />;
      }
      
      return <Wrapped {...this.props} />;
    }
  }
  
  WithErrorBoundary.displayName = `withErrorBoundary(${Wrapped.displayName || Wrapped.name})`;
  
  return WithErrorBoundary;
};

// Usage
const UserProfile = withErrorBoundary(withLoading(({ user }) => (
  <div>
    <h1>{user.name}</h1>
    <p>{user.email}</p>
  </div>
)));
```

### Render Props Pattern

**✅ Share logic through render props:**

```jsx
// Data fetching with render props
const DataFetcher = ({ url, children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [url]);
  
  return children({ data, loading, error });
};

// Usage
const UserList = () => (
  <DataFetcher url="/api/users">
    {({ data, loading, error }) => {
      if (loading) return <LoadingSpinner />;
      if (error) return <ErrorMessage error={error} />;
      return (
        <div>
          {data.map(user => <UserCard key={user.id} user={user} />)}
        </div>
      );
    }}
  </DataFetcher>
);

// Toggle render prop
const Toggle = ({ children, initialValue = false }) => {
  const [isToggled, setIsToggled] = useState(initialValue);
  
  const toggle = () => setIsToggled(prev => !prev);
  const setTrue = () => setIsToggled(true);
  const setFalse = () => setIsToggled(false);
  
  return children({
    isToggled,
    toggle,
    setTrue,
    setFalse
  });
};

// Usage
const ToggleableModal = () => (
  <Toggle>
    {({ isToggled, toggle, setFalse }) => (
      <div>
        <button onClick={toggle}>Open Modal</button>
        <Modal isOpen={isToggled} onClose={setFalse}>
          <p>Modal content here</p>
        </Modal>
      </div>
    )}
  </Toggle>
);
```

## Performance Optimization

### Memoization

**✅ Use React.memo and hooks for optimization:**

```jsx
import { memo, useMemo, useCallback } from 'react';

// Memoize components
const UserCard = memo(({ user, onEdit, onDelete }) => {
  // Memoize expensive calculations
  const userStats = useMemo(() => {
    return calculateUserStats(user);
  }, [user]);
  
  // Memoize event handlers
  const handleEdit = useCallback(() => {
    onEdit(user);
  }, [user, onEdit]);
  
  const handleDelete = useCallback(() => {
    onDelete(user.id);
  }, [user.id, onDelete]);
  
  return (
    <div className="user-card">
      <UserAvatar user={user} />
      <UserInfo user={user} stats={userStats} />
      <UserActions onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
});

UserCard.displayName = 'UserCard';

// Custom comparison for complex props
const UserList = memo(({ users, onUserEdit, onUserDelete }) => {
  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onEdit={onUserEdit}
          onDelete={onUserDelete}
        />
      ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison logic
  return (
    prevProps.users.length === nextProps.users.length &&
    prevProps.users.every((user, index) => 
      user.id === nextProps.users[index].id &&
      user.updatedAt === nextProps.users[index].updatedAt
    )
  );
});

// Memoize expensive computations
const DataVisualization = ({ data, filters }) => {
  const processedData = useMemo(() => {
    return data
      .filter(item => matchesFilters(item, filters))
      .map(item => transformDataForChart(item))
      .sort((a, b) => a.value - b.value);
  }, [data, filters]);
  
  const chartConfig = useMemo(() => {
    return generateChartConfig(processedData);
  }, [processedData]);
  
  return <Chart data={processedData} config={chartConfig} />;
};
```

### Code Splitting

**✅ Lazy load components:**

```jsx
import { lazy, Suspense } from 'react';

// Lazy load heavy components
const Dashboard = lazy(() => import('./Dashboard'));
const UserProfile = lazy(() => import('./UserProfile'));
const AdminPanel = lazy(() => import('./AdminPanel'));

// Component with lazy loading
const App = () => {
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route 
            path="/dashboard" 
            element={<Dashboard />} 
          />
          <Route 
            path="/profile" 
            element={<UserProfile />} 
          />
          <Route 
            path="/admin" 
            element={<AdminPanel />} 
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

// Conditional lazy loading
const ConditionalComponent = ({ userRole }) => {
  const AdminComponent = lazy(() => import('./AdminComponent'));
  const UserComponent = lazy(() => import('./UserComponent'));
  
  const ComponentToRender = userRole === 'admin' ? AdminComponent : UserComponent;
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ComponentToRender />
    </Suspense>
  );
};

// Preload components
const preloadComponent = (componentImport) => {
  const componentImportFunc = typeof componentImport === 'function' 
    ? componentImport 
    : () => componentImport;
    
  componentImportFunc();
};

// Preload on hover
const NavigationLink = ({ to, children, preload }) => {
  const handleMouseEnter = () => {
    if (preload) {
      preloadComponent(preload);
    }
  };
  
  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
};

// Usage
<NavigationLink 
  to="/dashboard" 
  preload={() => import('./Dashboard')}
>
  Dashboard
</NavigationLink>
```

## React 19 Features

### Concurrent Features

**✅ Use React 19 concurrent features:**

```jsx
import { startTransition, useDeferredValue, useTransition } from 'react';

// Use transitions for non-urgent updates
const SearchableList = ({ items }) => {
  const [query, setQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  
  const handleSearch = (newQuery) => {
    setQuery(newQuery);
    
    // Mark filtering as non-urgent
    startTransition(() => {
      // This update will be deferred if more urgent updates come in
      performExpensiveFiltering(newQuery);
    });
  };
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      {isPending && <div>Filtering...</div>}
      <ItemList items={items} query={query} />
    </div>
  );
};

// Use deferred values for expensive operations
const ExpensiveChart = ({ data, filters }) => {
  const deferredFilters = useDeferredValue(filters);
  
  // This will use the latest data but deferred filters
  // allowing urgent updates to data to not be blocked
  const chartData = useMemo(() => {
    return processDataForChart(data, deferredFilters);
  }, [data, deferredFilters]);
  
  return (
    <div>
      <Chart data={chartData} />
      {filters !== deferredFilters && (
        <div>Updating chart...</div>
      )}
    </div>
  );
};
```

### Server Components (Preparation)

**✅ Structure components for server component compatibility:**

```jsx
// Client component (interactive)
'use client';

const InteractiveButton = ({ onClick, children }) => {
  return (
    <button onClick={onClick} className="interactive-btn">
      {children}
    </button>
  );
};

// Server component compatible (no client-side state/events)
const UserCard = ({ user }) => {
  return (
    <div className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
};

// Hybrid approach - server component with client islands
const UserProfile = ({ user }) => {
  return (
    <div className="user-profile">
      {/* Server-rendered content */}
      <UserCard user={user} />
      
      {/* Client-side interactive elements */}
      <InteractiveButton onClick={() => editUser(user.id)}>
        Edit Profile
      </InteractiveButton>
    </div>
  );
};
```

## Error Boundaries

**✅ Implement comprehensive error handling:**

```jsx
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    
    // Log error to monitoring service
    console.error('Error boundary caught an error:', error, errorInfo);
    
    // You can also log the error to an error reporting service
    // errorReportingService.captureException(error, { extra: errorInfo });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfoStack}
          </details>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}

// Error boundary wrapper HOC
const withErrorBoundary = (Component, ErrorComponent) => {
  const Wrapped = (props) => (
    <ErrorBoundary fallback={ErrorComponent}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  Wrapped.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return Wrapped;
};

// Usage
const App = () => (
  <ErrorBoundary>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  </ErrorBoundary>
);
```

## Testing Patterns

**✅ Component testing best practices:**

```jsx
// UserCard.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UserCard from './UserCard';

const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
  avatar: 'https://example.com/avatar.jpg'
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
    
    fireEvent.click(screen.getByText('Edit'));
    
    expect(onEdit).toHaveBeenCalledWith(mockUser);
    expect(onEdit).toHaveBeenCalledTimes(1);
  });
  
  it('does not render action buttons when handlers are not provided', () => {
    render(<UserCard user={mockUser} />);
    
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  });
  
  it('handles missing user data gracefully', () => {
    const incompleteUser = { id: '1', name: 'John' };
    render(<UserCard user={incompleteUser} />);
    
    expect(screen.getByText('John')).toBeInTheDocument();
    // Should not crash when optional fields are missing
  });
});
```

---

This React style guide provides comprehensive patterns for modern React development with JavaScript examples, focusing on functional components, hooks, and React 19 features.