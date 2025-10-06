# Custom Hooks Guide

> Hook design philosophy, patterns, and best practices for React development

## Table of Contents

1. [Hook Design Philosophy](#hook-design-philosophy)
2. [Hook Categories](#hook-categories)
3. [Data Hooks](#data-hooks)
4. [UI State Hooks](#ui-state-hooks)
5. [Business Logic Hooks](#business-logic-hooks)
6. [Effect Hooks](#effect-hooks)
7. [Hook Composition](#hook-composition)
8. [Performance Optimization](#performance-optimization)
9. [Testing Strategies](#testing-strategies)
10. [Common Patterns](#common-patterns)

## Hook Design Philosophy

### Core Principles

1. **Single Purpose**: Each hook should have one clear responsibility
2. **Composable**: Hooks should work well together
3. **Testable**: Hooks should be easily unit tested
4. **Reusable**: Hooks should work across different components
5. **Predictable**: Similar inputs should produce similar outputs

### Hook Naming Conventions

```javascript
// ✅ Good naming patterns
const useUserData = () => { /* fetch user data */ };
const useToggle = () => { /* boolean state management */ };
const useLocalStorage = () => { /* localStorage interaction */ };
const useDebounce = () => { /* debounce values */ };
const useClickOutside = () => { /* detect outside clicks */ };

// ❌ Bad naming patterns
const getUserData = () => { /* not a hook - missing 'use' prefix */ };
const useEverything = () => { /* too generic */ };
const useData = () => { /* too vague */ };
const useUserDataAndPostsAndSettings = () => { /* doing too much */ };
```

### Return Value Patterns

```javascript
// ✅ Consistent return patterns

// 1. Simple value hooks
const useCounter = (initialValue = 0) => {
  const [count, setCount] = useState(initialValue);
  
  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => prev - 1);
  const reset = () => setCount(initialValue);
  
  return [count, { increment, decrement, reset }];
};

// 2. Object return for complex state
const useApi = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ... logic
  
  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
};

// 3. Tuple return for simple state
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(prev => !prev);
  
  return [value, toggle];
};
```

## Hook Categories

### File Organization

```
src/lib/hooks/
├── data/              # Data fetching and management hooks
│   ├── useUserData.hook.js
│   ├── useApiRequest.hook.js
│   ├── usePagination.hook.js
│   └── useLocalStorage.hook.js
├── ui/                # UI state and interaction hooks
│   ├── useToggle.hook.js
│   ├── useModal.hook.js
│   ├── useForm.hook.js
│   └── useDebounce.hook.js
├── business/          # Business logic hooks
│   ├── useAuth.hook.js
│   ├── usePermissions.hook.js
│   ├── useCart.hook.js
│   └── usePayment.hook.js
├── effects/           # Effect-based hooks
│   ├── useInterval.hook.js
│   ├── useEventListener.hook.js
│   ├── useClickOutside.hook.js
│   └── useScrollPosition.hook.js
└── composed/          # Composed hooks combining multiple concerns
    ├── useUserProfile.hook.js
    ├── useDashboard.hook.js
    └── useShoppingCart.hook.js
```

## Data Hooks

### API Request Hook

```javascript
// useApiRequest.hook.js
const useApiRequest = (config = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (requestConfig = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedConfig = { ...config, ...requestConfig };
      const response = await apiClient.request(mergedConfig);
      
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [config]);
  
  return {
    data,
    loading,
    error,
    execute
  };
};

// Usage examples
const useGetUsers = () => {
  return useApiRequest({
    method: 'GET',
    url: '/users'
  });
};

const useCreateUser = () => {
  return useApiRequest({
    method: 'POST',
    url: '/users'
  });
};
```

### Pagination Hook

```javascript
// usePagination.hook.js
const usePagination = ({ 
  initialPage = 1, 
  initialPageSize = 10,
  totalItems = 0 
}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  const totalPages = Math.ceil(totalItems / pageSize);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  
  const goToPage = useCallback((newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  }, [totalPages]);
  
  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setPage(prev => prev + 1);
    }
  }, [hasNextPage]);
  
  const previousPage = useCallback(() => {
    if (hasPreviousPage) {
      setPage(prev => prev - 1);
    }
  }, [hasPreviousPage]);
  
  const changePageSize = useCallback((newPageSize) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page when changing page size
  }, []);
  
  return {
    page,
    pageSize,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    changePageSize
  };
};

// Usage
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 10,
    totalItems: totalUsers
  });
  
  useEffect(() => {
    fetchUsers({
      page: pagination.page,
      limit: pagination.pageSize
    }).then(response => {
      setUsers(response.data);
      setTotalUsers(response.total);
    });
  }, [pagination.page, pagination.pageSize]);
  
  return (
    <div>
      {users.map(user => <UserCard key={user.id} user={user} />)}
      <PaginationControls {...pagination} />
    </div>
  );
};
```

### Local Storage Hook

```javascript
// useLocalStorage.hook.js
const useLocalStorage = (key, initialValue) => {
  // Get value from localStorage or use initial value
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (valueToStore === undefined) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(undefined);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key]);
  
  return [storedValue, setValue, removeValue];
};

// Usage
const UserPreferences = () => {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
  const [language, setLanguage] = useLocalStorage('language', 'en');
  
  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
      
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en">English</option>
        <option value="es">Spanish</option>
      </select>
      
      <button onClick={removeTheme}>Reset Theme</button>
    </div>
  );
};
```

## UI State Hooks

### Toggle Hook

```javascript
// useToggle.hook.js
const useToggle = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse, setValue }];
};

// Usage
const Modal = ({ children }) => {
  const [isOpen, { toggle, setTrue, setFalse }] = useToggle(false);
  
  return (
    <div>
      <button onClick={setTrue}>Open Modal</button>
      {isOpen && (
        <div className="modal-overlay" onClick={setFalse}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {children}
            <button onClick={setFalse}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
```

### Form Hook

```javascript
// useForm.hook.js
const useForm = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  }, [errors]);
  
  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
  }, []);
  
  const validateField = useCallback((name, value) => {
    const rule = validationRules[name];
    if (!rule) return null;
    
    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${name} is required`;
    }
    
    if (rule.minLength && value.length < rule.minLength) {
      return `${name} must be at least ${rule.minLength} characters`;
    }
    
    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || `${name} is invalid`;
    }
    
    if (rule.custom && typeof rule.custom === 'function') {
      return rule.custom(value, values);
    }
    
    return null;
  }, [validationRules, values]);
  
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(name => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validateField, validationRules]);
  
  const handleSubmit = useCallback((onSubmit) => async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    if (validateForm()) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      }
    }
    
    setIsSubmitting(false);
  }, [values, validateForm, validationRules]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  const getFieldProps = useCallback((name) => ({
    value: values[name] || '',
    onChange: (event) => setValue(name, event.target.value),
    onBlur: () => setFieldTouched(name),
    error: touched[name] && errors[name]
  }), [values, setValue, setFieldTouched, touched, errors]);
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    validateForm,
    handleSubmit,
    reset,
    getFieldProps
  };
};

// Usage
const UserForm = ({ onSubmit }) => {
  const form = useForm(
    { name: '', email: '', age: '' },
    {
      name: { required: true, minLength: 2 },
      email: { 
        required: true, 
        pattern: /\S+@\S+\.\S+/,
        message: 'Please enter a valid email'
      },
      age: { 
        required: true,
        custom: (value) => {
          const num = parseInt(value);
          return num >= 18 ? null : 'Must be at least 18 years old';
        }
      }
    }
  );
  
  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <div>
        <input
          {...form.getFieldProps('name')}
          placeholder="Name"
        />
        {form.getFieldProps('name').error && (
          <span className="error">{form.getFieldProps('name').error}</span>
        )}
      </div>
      
      <div>
        <input
          {...form.getFieldProps('email')}
          placeholder="Email"
          type="email"
        />
        {form.getFieldProps('email').error && (
          <span className="error">{form.getFieldProps('email').error}</span>
        )}
      </div>
      
      <div>
        <input
          {...form.getFieldProps('age')}
          placeholder="Age"
          type="number"
        />
        {form.getFieldProps('age').error && (
          <span className="error">{form.getFieldProps('age').error}</span>
        )}
      </div>
      
      <button type="submit" disabled={form.isSubmitting}>
        {form.isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      
      <button type="button" onClick={form.reset}>
        Reset
      </button>
    </form>
  );
};
```

### Debounce Hook

```javascript
// useDebounce.hook.js
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

// Advanced debounce with cancel functionality
const useAdvancedDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isDebouncing, setIsDebouncing] = useState(false);
  const timeoutRef = useRef();
  
  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIsDebouncing(false);
    }
  }, []);
  
  const flush = useCallback(() => {
    cancel();
    setDebouncedValue(value);
  }, [cancel, value]);
  
  useEffect(() => {
    setIsDebouncing(true);
    
    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsDebouncing(false);
    }, delay);
    
    return cancel;
  }, [value, delay, cancel]);
  
  return {
    debouncedValue,
    isDebouncing,
    cancel,
    flush
  };
};

// Usage
const SearchComponent = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    if (debouncedQuery) {
      searchApi.search(debouncedQuery).then(setResults);
    } else {
      setResults([]);
    }
  }, [debouncedQuery]);
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
      />
      
      <div>
        {results.map(result => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
    </div>
  );
};
```

## Business Logic Hooks

### Authentication Hook

```javascript
// useAuth.hook.js
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Check if user is logged in on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoading(false);
          return;
        }
        
        const userData = await authApi.verifyToken(token);
        setUser(userData);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('authToken');
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authApi.login(credentials);
      const { user: userData, token } = response;
      
      localStorage.setItem('authToken', token);
      setUser(userData);
      
      return userData;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  }, []);
  
  const updateProfile = useCallback(async (updates) => {
    try {
      const updatedUser = await authApi.updateProfile(updates);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err);
      throw err;
    }
  }, []);
  
  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    updateProfile
  };
};

// Usage
const App = () => {
  const { user, loading, isAuthenticated, login, logout } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <h1>Welcome, {user.name}!</h1>
          <button onClick={logout}>Logout</button>
          <Dashboard user={user} />
        </div>
      ) : (
        <LoginForm onLogin={login} />
      )}
    </div>
  );
};
```

### Shopping Cart Hook

```javascript
// useShoppingCart.hook.js
const useShoppingCart = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('shoppingCart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
      }
    }
  }, []);
  
  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(items));
  }, [items]);
  
  const addItem = useCallback((product, quantity = 1) => {
    setItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [...prev, { ...product, quantity }];
    });
  }, []);
  
  const removeItem = useCallback((productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  }, []);
  
  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    
    setItems(prev => prev.map(item =>
      item.id === productId
        ? { ...item, quantity }
        : item
    ));
  }, [removeItem]);
  
  const clearCart = useCallback(() => {
    setItems([]);
  }, []);
  
  const getItemQuantity = useCallback((productId) => {
    const item = items.find(item => item.id === productId);
    return item ? item.quantity : 0;
  }, [items]);
  
  // Computed values
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const isEmpty = items.length === 0;
  
  return {
    items,
    totalItems,
    totalPrice,
    isEmpty,
    isLoading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity
  };
};

// Usage
const ProductCard = ({ product }) => {
  const { addItem, getItemQuantity, updateQuantity } = useShoppingCart();
  const quantity = getItemQuantity(product.id);
  
  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      
      {quantity === 0 ? (
        <button onClick={() => addItem(product)}>
          Add to Cart
        </button>
      ) : (
        <div className="quantity-controls">
          <button onClick={() => updateQuantity(product.id, quantity - 1)}>
            -
          </button>
          <span>{quantity}</span>
          <button onClick={() => updateQuantity(product.id, quantity + 1)}>
            +
          </button>
        </div>
      )}
    </div>
  );
};

const CartSummary = () => {
  const { items, totalItems, totalPrice, clearCart } = useShoppingCart();
  
  return (
    <div className="cart-summary">
      <h3>Cart Summary</h3>
      <p>Items: {totalItems}</p>
      <p>Total: ${totalPrice.toFixed(2)}</p>
      
      {items.map(item => (
        <div key={item.id}>
          {item.name} x {item.quantity}
        </div>
      ))}
      
      <button onClick={clearCart}>Clear Cart</button>
    </div>
  );
};
```

## Effect Hooks

### Event Listener Hook

```javascript
// useEventListener.hook.js
const useEventListener = (eventName, handler, element = window) => {
  const savedHandler = useRef();
  
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  
  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;
    
    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);
    
    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

// Usage
const KeyboardShortcuts = () => {
  const [message, setMessage] = useState('');
  
  useEventListener('keydown', (event) => {
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      setMessage('Ctrl+S pressed - Save action triggered!');
    }
  });
  
  return <div>{message}</div>;
};
```

### Outside Click Hook

```javascript
// useClickOutside.hook.js
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
};

// Usage
const Dropdown = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();
  
  useClickOutside(dropdownRef, () => setIsOpen(false));
  
  return (
    <div ref={dropdownRef} className="dropdown">
      <button onClick={() => setIsOpen(!isOpen)}>
        Toggle Dropdown
      </button>
      {isOpen && (
        <div className="dropdown-content">
          {children}
        </div>
      )}
    </div>
  );
};
```

### Interval Hook

```javascript
// useInterval.hook.js
const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

// Usage
const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  useInterval(() => {
    setSeconds(seconds => seconds + 1);
  }, isRunning ? 1000 : null);
  
  return (
    <div>
      <h1>{seconds} seconds</h1>
      <button onClick={() => setIsRunning(!isRunning)}>
        {isRunning ? 'Stop' : 'Start'}
      </button>
      <button onClick={() => setSeconds(0)}>Reset</button>
    </div>
  );
};
```

## Hook Composition

### Composed Dashboard Hook

```javascript
// useUserDashboard.hook.js
const useUserDashboard = (userId) => {
  // Compose multiple hooks
  const { user, loading: userLoading, error: userError } = useUserData(userId);
  const { permissions } = usePermissions(user);
  const { stats, loading: statsLoading } = useUserStats(userId);
  const [isEditing, { toggle: toggleEditing, setFalse: stopEditing }] = useToggle(false);
  
  // Form management
  const form = useForm(
    user || {},
    {
      name: { required: true, minLength: 2 },
      email: { required: true, pattern: /\S+@\S+\.\S+/ }
    }
  );
  
  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.reset(user);
    }
  }, [user]);
  
  // Save handler
  const handleSave = useCallback(async (formData) => {
    try {
      await updateUser(userId, formData);
      stopEditing();
      // Optionally refetch user data
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  }, [userId, stopEditing]);
  
  // Computed values
  const isLoading = userLoading || statsLoading;
  const canEdit = permissions.canEdit && user?.id === userId;
  
  return {
    // Data
    user,
    stats,
    permissions,
    
    // Loading states
    isLoading,
    userLoading,
    statsLoading,
    
    // Errors
    userError,
    
    // UI state
    isEditing,
    toggleEditing,
    stopEditing,
    canEdit,
    
    // Form
    form,
    
    // Actions
    handleSave
  };
};

// Usage
const UserDashboard = ({ userId }) => {
  const dashboard = useUserDashboard(userId);
  
  if (dashboard.isLoading) {
    return <LoadingSpinner />;
  }
  
  if (dashboard.userError) {
    return <ErrorMessage error={dashboard.userError} />;
  }
  
  return (
    <div className="user-dashboard">
      {dashboard.isEditing ? (
        <UserEditForm
          form={dashboard.form}
          onSave={dashboard.handleSave}
          onCancel={dashboard.stopEditing}
        />
      ) : (
        <UserProfile
          user={dashboard.user}
          stats={dashboard.stats}
          canEdit={dashboard.canEdit}
          onEdit={dashboard.toggleEditing}
        />
      )}
    </div>
  );
};
```

### Multi-Step Form Hook

```javascript
// useMultiStepForm.hook.js
const useMultiStepForm = (steps, initialData = {}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;
  
  const goToStep = useCallback((stepIndex) => {
    if (stepIndex >= 0 && stepIndex < totalSteps) {
      setCurrentStep(stepIndex);
    }
  }, [totalSteps]);
  
  const nextStep = useCallback(() => {
    if (!isLastStep) {
      setCompletedSteps(prev => new Set([...prev, currentStep]));
      setCurrentStep(prev => prev + 1);
    }
  }, [isLastStep, currentStep]);
  
  const previousStep = useCallback(() => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  }, [isFirstStep]);
  
  const updateStepData = useCallback((stepData) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  }, []);
  
  const resetForm = useCallback(() => {
    setCurrentStep(0);
    setFormData(initialData);
    setCompletedSteps(new Set());
  }, [initialData]);
  
  const isStepCompleted = useCallback((stepIndex) => {
    return completedSteps.has(stepIndex);
  }, [completedSteps]);
  
  return {
    currentStep,
    currentStepData: steps[currentStep],
    formData,
    isFirstStep,
    isLastStep,
    totalSteps,
    progress,
    goToStep,
    nextStep,
    previousStep,
    updateStepData,
    resetForm,
    isStepCompleted
  };
};

// Usage
const RegistrationForm = () => {
  const steps = [
    { id: 'personal', title: 'Personal Info', component: PersonalInfoStep },
    { id: 'account', title: 'Account Details', component: AccountStep },
    { id: 'preferences', title: 'Preferences', component: PreferencesStep },
    { id: 'review', title: 'Review', component: ReviewStep }
  ];
  
  const multiStepForm = useMultiStepForm(steps, {
    personalInfo: {},
    accountDetails: {},
    preferences: {}
  });
  
  const handleStepSubmit = (stepData) => {
    multiStepForm.updateStepData(stepData);
    
    if (multiStepForm.isLastStep) {
      // Submit final form
      submitRegistration(multiStepForm.formData);
    } else {
      multiStepForm.nextStep();
    }
  };
  
  const CurrentStepComponent = multiStepForm.currentStepData;
  
  return (
    {% raw %}
    <div className="multi-step-form">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${multiStepForm.progress}%` }}
        />
      </div>
      
      <div className="step-indicators">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`step-indicator ${
              index === multiStepForm.currentStep ? 'active' : ''
            } ${
              multiStepForm.isStepCompleted(index) ? 'completed' : ''
            }`}
            onClick={() => multiStepForm.goToStep(index)}
          >
            {step.title}
          </div>
        ))}
      </div>
      
      <CurrentStepComponent
        data={multiStepForm.formData}
        onSubmit={handleStepSubmit}
        onPrevious={multiStepForm.previousStep}
        isFirstStep={multiStepForm.isFirstStep}
        isLastStep={multiStepForm.isLastStep}
      />
    </div>
    {% endraw %}
  );
};
```

## Performance Optimization

### Memoized Hook

```javascript
// useMemoizedHook.hook.js
const useMemoizedCalculation = (data, dependencies) => {
  return useMemo(() => {
    // Expensive calculation
    return data.reduce((acc, item) => {
      return acc + item.value * item.multiplier;
    }, 0);
  }, dependencies);
};

// Debounced API hook
const useDebouncedApiCall = (apiCall, dependencies, delay = 300) => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const debouncedDeps = useDebounce(dependencies, delay);
  
  useEffect(() => {
    let cancelled = false;
    
    const makeApiCall = async () => {
      if (!debouncedDeps || debouncedDeps.some(dep => !dep)) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await apiCall(...debouncedDeps);
        
        if (!cancelled) {
          setResult(response);
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
    
    makeApiCall();
    
    return () => {
      cancelled = true;
    };
  }, debouncedDeps);
  
  return { result, loading, error };
};
```

## Testing Strategies

### Hook Testing

```javascript
// useCounter.test.js
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useCounter } from './useCounter.hook';

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current[0]).toBe(0);
  });
  
  it('should initialize with provided value', () => {
    const { result } = renderHook(() => useCounter(10));
    
    expect(result.current[0]).toBe(10);
  });
  
  it('should increment count', () => {
    const { result } = renderHook(() => useCounter());
    
    act(() => {
      result.current[1].increment();
    });
    
    expect(result.current[0]).toBe(1);
  });
  
  it('should decrement count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current[1].decrement();
    });
    
    expect(result.current[0]).toBe(4);
  });
  
  it('should reset count', () => {
    const { result } = renderHook(() => useCounter(5));
    
    act(() => {
      result.current[1].increment();
      result.current[1].increment();
    });
    
    expect(result.current[0]).toBe(7);
    
    act(() => {
      result.current[1].reset();
    });
    
    expect(result.current[0]).toBe(5);
  });
});

// Testing with context
// useAuth.test.js
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useAuth } from './useAuth.hook';

// Mock API
const mockAuthApi = {
  login: vi.fn(),
  logout: vi.fn(),
  verifyToken: vi.fn()
};

const wrapper = ({ children }) => (
  <AuthProvider api={mockAuthApi}>
    {children}
  </AuthProvider>
);

describe('useAuth', () => {
  it('should login successfully', async () => {
    const mockUser = { id: '1', name: 'John Doe' };
    mockAuthApi.login.mockResolvedValue({
      user: mockUser,
      token: 'fake-token'
    });
    
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.login({ email: 'test@test.com', password: 'password' });
    });
    
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });
});
```

## Common Patterns

### Resource Management Hook

```javascript
// useResource.hook.js
const useResource = (resourceFactory, dependencies = []) => {
  const [resource, setResource] = useState(null);
  
  useEffect(() => {
    const newResource = resourceFactory();
    setResource(newResource);
    
    return () => {
      if (newResource && typeof newResource.cleanup === 'function') {
        newResource.cleanup();
      }
    };
  }, dependencies);
  
  return resource;
};

// Usage
const WebSocketComponent = () => {
  const ws = useResource(() => {
    const socket = new WebSocket('ws://localhost:8080');
    
    socket.onopen = () => console.log('Connected');
    socket.onclose = () => console.log('Disconnected');
    
    return {
      socket,
      cleanup: () => socket.close()
    };
  }, []);
  
  const sendMessage = (message) => {
    if (ws?.socket?.readyState === WebSocket.OPEN) {
      ws.socket.send(message);
    }
  };
  
  return (
    <div>
      <button onClick={() => sendMessage('Hello')}>
        Send Message
      </button>
    </div>
  );
};
```

### Previous Value Hook

```javascript
// usePrevious.hook.js
const usePrevious = (value) => {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
};

// Usage
const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const previousUserId = usePrevious(userId);
  
  useEffect(() => {
    if (userId !== previousUserId) {
      fetchUser(userId).then(setUser);
    }
  }, [userId, previousUserId]);
  
  return <div>{user?.name}</div>;
};
```

---

This comprehensive custom hooks guide provides patterns and best practices for creating reusable, testable, and maintainable hooks in React applications. Each hook follows the established principles and can be composed together for complex functionality.