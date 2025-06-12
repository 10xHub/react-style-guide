# JavaScript Style Guide

> Modern ES2024+ JavaScript patterns, naming conventions, and best practices

## Table of Contents

1. [Naming Conventions](#naming-conventions)
2. [Variable Declaration](#variable-declaration)
3. [Functions](#functions)
4. [Objects and Arrays](#objects-and-arrays)
5. [Classes](#classes)
6. [Modules](#modules)
7. [Async Programming](#async-programming)
8. [Error Handling](#error-handling)
9. [Modern ES2024+ Features](#modern-es2024-features)
10. [Performance Patterns](#performance-patterns)

## Naming Conventions

### Variables and Functions

**✅ Use camelCase for variables and functions:**

```javascript
// Variables
const userName = 'john_doe';
const isUserActive = true;
const userProfileData = {};
const maxRetryCount = 3;

// Functions
function getUserById(id) {
  return users.find(user => user.id === id);
}

const calculateTotalPrice = (items) => {
  return items.reduce((total, item) => total + item.price, 0);
};

const handleUserClick = (event) => {
  event.preventDefault();
  // Handle click
};
```

**❌ Avoid snake_case or PascalCase for variables:**

```javascript
// Don't use snake_case for variables
const user_name = 'john'; // ❌
const is_user_active = true; // ❌

// Don't use PascalCase for variables
const UserName = 'john'; // ❌
const IsUserActive = true; // ❌
```

### Constants

**✅ Use SCREAMING_SNAKE_CASE for constants:**

```javascript
// Global constants
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;
const DEFAULT_TIMEOUT = 5000;
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator'
};

// Enum-like objects
const HTTP_STATUS = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};

const CACHE_KEYS = {
  USER_DATA: 'user_data',
  PREFERENCES: 'user_preferences'
};
```

### Classes and Constructors

**✅ Use PascalCase for classes:**

```javascript
// Classes
class UserService {
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  async getUserById(id) {
    return this.apiClient.get(`/users/${id}`);
  }
}

class ApiResponse {
  constructor(data, status, message) {
    this.data = data;
    this.status = status;
    this.message = message;
  }
}

// Factory functions
function createUserManager(config) {
  return new UserManager(config);
}
```

### File and Directory Names

**✅ Use kebab-case for files and directories:**

```javascript
// File names
user-service.js
api-client.js
user-profile.jsx
auth-utils.js

// Directory names
user-management/
api-services/
shared-components/
utility-functions/
```

### Private and Internal

**✅ Use underscore prefix for private/internal:**

```javascript
class UserManager {
  constructor() {
    this._cache = new Map();
    this._config = {};
  }

  // Public method
  getUser(id) {
    return this._fetchFromCacheOrApi(id);
  }

  // Private method
  _fetchFromCacheOrApi(id) {
    if (this._cache.has(id)) {
      return this._cache.get(id);
    }
    return this._fetchFromApi(id);
  }

  _fetchFromApi(id) {
    // Implementation
  }
}
```

### Boolean Variables

**✅ Use descriptive boolean prefixes:**

```javascript
// Good boolean naming
const isUserLoggedIn = checkUserAuth();
const hasPermission = checkUserPermission();
const canEdit = user.role === 'admin';
const shouldShowDialog = !user.hasSeenWelcome;
const wasSuccessful = response.status === 200;

// Event handlers
const handleIsVisible = (visible) => {
  setIsModalVisible(visible);
};

// State variables
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [canSubmit, setCanSubmit] = useState(true);
```

## Variable Declaration

**✅ Use const by default, let when reassignment is needed:**

```javascript
// Use const for values that won't be reassigned
const users = [];
const config = { apiUrl: '/api' };
const userName = user.name;

// Use let for variables that will be reassigned
let currentUser = null;
let retryCount = 0;
let isProcessing = false;

// Avoid var completely
var oldStyle = 'avoid this'; // ❌
```

**✅ Destructuring with meaningful names:**

```javascript
// Object destructuring
const { name: userName, email: userEmail, id: userId } = user;
const { data: responseData, status: httpStatus } = apiResponse;

// Array destructuring
const [firstUser, secondUser, ...restUsers] = users;
const [currentPage, setCurrentPage] = useState(1);

// Function parameter destructuring
function createUser({ name, email, role = 'user' }) {
  return {
    id: generateId(),
    name,
    email,
    role,
    createdAt: new Date()
  };
}
```

## Functions

### Function Declaration vs Expression

**✅ Use function expressions for consistency:**

```javascript
// Prefer arrow functions for simple operations
const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

// Use regular function expressions for complex logic
const processUserData = function(userData) {
  // Complex processing logic
  const processedData = userData.map(user => ({
    ...user,
    fullName: `${user.firstName} ${user.lastName}`,
    isActive: user.lastLogin > Date.now() - 30 * 24 * 60 * 60 * 1000
  }));
  
  return processedData;
};

// Use function declarations for hoisted functions
function initializeApp() {
  setupEventListeners();
  loadInitialData();
  renderApp();
}
```

### Function Naming

**✅ Use descriptive, action-oriented names:**

```javascript
// Action verbs for functions
const getUserById = (id) => users.find(user => user.id === id);
const createNewUser = (userData) => ({ id: generateId(), ...userData });
const updateUserProfile = (id, updates) => ({ ...getUser(id), ...updates });
const deleteUserAccount = (id) => users.filter(user => user.id !== id);

// Boolean-returning functions
const isUserActive = (user) => user.status === 'active';
const hasUserPermission = (user, permission) => user.permissions.includes(permission);
const canUserEdit = (user, resource) => user.role === 'admin' || resource.ownerId === user.id;

// Event handlers
const handleUserLogin = (credentials) => {
  // Handle login logic
};

const handleFormSubmit = (event) => {
  event.preventDefault();
  // Handle form submission
};

// Utility functions
const formatCurrency = (amount) => `$${amount.toFixed(2)}`;
const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);
const sanitizeInput = (input) => input.trim().toLowerCase();
```

### Function Parameters

**✅ Use object parameters for multiple arguments:**

```javascript
// Good: Object parameters
function createUser({ name, email, role, department, isActive = true }) {
  return {
    id: generateId(),
    name,
    email,
    role,
    department,
    isActive,
    createdAt: new Date()
  };
}

// Usage
const newUser = createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'developer',
  department: 'engineering'
});

// Good: Rest parameters
function combineMessages(primaryMessage, ...additionalMessages) {
  return [primaryMessage, ...additionalMessages].join(' ');
}

// Bad: Too many positional parameters
function createUser(name, email, role, department, isActive, createdAt) { // ❌
  // Hard to remember parameter order
}
```

## Objects and Arrays

### Object Creation and Manipulation

**✅ Use modern object patterns:**

```javascript
// Object shorthand
const name = 'John';
const age = 30;
const user = { name, age }; // Instead of { name: name, age: age }

// Computed property names
const dynamicKey = 'userType';
const userConfig = {
  [dynamicKey]: 'admin',
  [`${dynamicKey}Priority`]: 'high'
};

// Object spread for updates
const originalUser = { name: 'John', age: 30 };
const updatedUser = { ...originalUser, age: 31, lastLogin: new Date() };

// Object destructuring with defaults
const { name = 'Anonymous', age = 0, email = 'no-email' } = user;
```

### Array Operations

**✅ Use array methods over loops:**

```javascript
// Filtering
const activeUsers = users.filter(user => user.isActive);
const adminUsers = users.filter(user => user.role === 'admin');

// Mapping
const userNames = users.map(user => user.name);
const userSummaries = users.map(user => ({
  id: user.id,
  name: user.name,
  email: user.email
}));

// Finding
const targetUser = users.find(user => user.id === targetId);
const hasAdminUser = users.some(user => user.role === 'admin');
const allUsersActive = users.every(user => user.isActive);

// Reducing
const totalAge = users.reduce((sum, user) => sum + user.age, 0);
const usersByRole = users.reduce((acc, user) => {
  acc[user.role] = acc[user.role] || [];
  acc[user.role].push(user);
  return acc;
}, {});

// Sorting
const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
const usersByAge = users.sort((a, b) => b.age - a.age);
```

## Classes

**✅ Modern class patterns:**

```javascript
class UserService {
  // Public fields
  version = '1.0.0';
  
  // Private fields
  #apiClient;
  #cache = new Map();
  
  constructor(apiClient) {
    this.#apiClient = apiClient;
  }
  
  // Public methods
  async getUser(id) {
    if (this.#cache.has(id)) {
      return this.#cache.get(id);
    }
    
    const user = await this.#fetchUser(id);
    this.#cache.set(id, user);
    return user;
  }
  
  // Private methods
  async #fetchUser(id) {
    const response = await this.#apiClient.get(`/users/${id}`);
    return response.data;
  }
  
  // Static methods
  static validateUserId(id) {
    return typeof id === 'string' && id.length > 0;
  }
  
  // Getters and setters
  get cacheSize() {
    return this.#cache.size;
  }
  
  clearCache() {
    this.#cache.clear();
  }
}
```

## Modules

### Module Organization

**✅ Clear import/export patterns:**

```javascript
// Named exports (preferred)
export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email);
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

// Default export for main functionality
export default class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }
  
  async get(endpoint) {
    // Implementation
  }
}

// Re-exports
export { UserService } from './user-service.js';
export { formatDate, parseDate } from './date-utils.js';
```

### Import Patterns

**✅ Organize imports consistently:**

```javascript
// External libraries first
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// Internal modules
import { validateEmail, formatCurrency } from '../utils/validators.js';
import { UserService } from '../services/user-service.js';
import { API_ENDPOINTS } from '../constants/api.js';

// Relative imports last
import './component.css';
```

## Async Programming

### Promises and Async/Await

**✅ Use async/await over Promise chains:**

```javascript
// Good: async/await
async function fetchUserProfile(userId) {
  try {
    const user = await getUserById(userId);
    const preferences = await getUserPreferences(userId);
    const permissions = await getUserPermissions(userId);
    
    return {
      ...user,
      preferences,
      permissions
    };
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw new Error('User profile fetch failed');
  }
}

// Parallel execution when possible
async function fetchUserData(userId) {
  try {
    const [user, preferences, permissions] = await Promise.all([
      getUserById(userId),
      getUserPreferences(userId),
      getUserPermissions(userId)
    ]);
    
    return { user, preferences, permissions };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}

// Handle partial failures
async function fetchMultipleUsers(userIds) {
  const results = await Promise.allSettled(
    userIds.map(id => getUserById(id))
  );
  
  const successful = results
    .filter(result => result.status === 'fulfilled')
    .map(result => result.value);
    
  const failed = results
    .filter(result => result.status === 'rejected')
    .map(result => result.reason);
    
  return { successful, failed };
}
```

## Error Handling

### Custom Error Classes

**✅ Create meaningful error types:**

```javascript
// Base error class
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'GENERIC_ERROR') {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
class ValidationError extends AppError {
  constructor(field, message) {
    super(`Validation failed for ${field}: ${message}`, 400, 'VALIDATION_ERROR');
    this.field = field;
  }
}

class NotFoundError extends AppError {
  constructor(resource, id) {
    super(`${resource} with id ${id} not found`, 404, 'NOT_FOUND');
    this.resource = resource;
    this.resourceId = id;
  }
}

class NetworkError extends AppError {
  constructor(message, originalError) {
    super(`Network error: ${message}`, 503, 'NETWORK_ERROR');
    this.originalError = originalError;
  }
}

// Usage
async function getUserById(id) {
  if (!id) {
    throw new ValidationError('id', 'User ID is required');
  }
  
  try {
    const response = await apiClient.get(`/users/${id}`);
    
    if (!response.data) {
      throw new NotFoundError('User', id);
    }
    
    return response.data;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    if (error.code === 'NETWORK_ERROR') {
      throw new NetworkError('Failed to fetch user', error);
    }
    
    throw new AppError('Unexpected error occurred', 500, 'UNEXPECTED_ERROR');
  }
}
```

### Error Handling Patterns

**✅ Consistent error handling:**

```javascript
// Result pattern for handling errors
function createResult(data = null, error = null) {
  return {
    data,
    error,
    isSuccess: !error,
    isError: !!error
  };
}

async function safeAsyncOperation(operation) {
  try {
    const result = await operation();
    return createResult(result);
  } catch (error) {
    console.error('Operation failed:', error);
    return createResult(null, error);
  }
}

// Usage
async function handleUserCreation(userData) {
  const result = await safeAsyncOperation(() => createUser(userData));
  
  if (result.isError) {
    showErrorMessage(result.error.message);
    return;
  }
  
  showSuccessMessage('User created successfully');
  redirectToUserProfile(result.data.id);
}

// Error boundary pattern for React
function withErrorHandling(operation) {
  return async (...args) => {
    try {
      return await operation(...args);
    } catch (error) {
      console.error(`Error in ${operation.name}:`, error);
      
      // Log to external service
      errorLogger.log(error, { operation: operation.name, args });
      
      // Re-throw for higher-level handling
      throw error;
    }
  };
}
```

## Modern ES2024+ Features

### Optional Chaining and Nullish Coalescing

**✅ Use modern operators:**

```javascript
// Optional chaining
const userCity = user?.address?.city;
const hasPermission = user?.permissions?.includes('edit');
const methodResult = api?.getUserData?.(userId);

// Nullish coalescing
const userName = user.name ?? 'Anonymous';
const maxItems = config.maxItems ?? 10;
const apiUrl = process.env.API_URL ?? 'http://localhost:3000';

// Combined usage
const displayName = user?.profile?.displayName ?? user?.name ?? 'Unknown User';

// Method chaining with optional chaining
const transformedData = data
  ?.filter?.(item => item.active)
  ?.map?.(item => ({ ...item, processed: true }))
  ?.sort?.((a, b) => a.name.localeCompare(b.name));
```

### Template Literals

**✅ Use template literals for string interpolation:**

```javascript
// Simple interpolation
const greeting = `Hello, ${user.name}!`;
const apiEndpoint = `${baseUrl}/users/${userId}`;

// Multiline strings
const emailTemplate = `
  Dear ${user.name},
  
  Your account has been created successfully.
  
  Login details:
  - Username: ${user.username}
  - Email: ${user.email}
  
  Best regards,
  The Team
`;

// Tagged template literals
function highlight(strings, ...values) {
  return strings.reduce((result, string, i) => {
    const value = values[i] ? `<mark>${values[i]}</mark>` : '';
    return result + string + value;
  }, '');
}

const searchTerm = 'JavaScript';
const message = highlight`Search results for ${searchTerm}`;
```

### Destructuring Patterns

**✅ Advanced destructuring:**

```javascript
// Nested destructuring
const {
  user: { name, email },
  preferences: { theme, language = 'en' },
  permissions = []
} = response.data;

// Renaming during destructuring
const { name: userName, id: userId } = user;

// Rest patterns
const { name, email, ...otherUserData } = user;
const [first, second, ...remaining] = items;

// Function parameter destructuring with defaults
function createApiClient({
  baseURL = 'http://localhost:3000',
  timeout = 5000,
  retries = 3,
  headers = {}
} = {}) {
  return new ApiClient({ baseURL, timeout, retries, headers });
}

// Swapping variables
let a = 1, b = 2;
[a, b] = [b, a];
```

## Performance Patterns

### Memory Management

**✅ Prevent memory leaks:**

```javascript
// Clean up event listeners
function setupUserDashboard() {
  const handleResize = () => {
    // Handle window resize
  };
  
  window.addEventListener('resize', handleResize);
  
  // Return cleanup function
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}

// Use WeakMap for private data
const privateData = new WeakMap();

class UserManager {
  constructor(config) {
    privateData.set(this, {
      apiKey: config.apiKey,
      cache: new Map()
    });
  }
  
  getPrivateData() {
    return privateData.get(this);
  }
}

// Avoid closure memory leaks
function createHandler(data) {
  // Instead of capturing entire data object
  const { id, name } = data; // Only capture what's needed
  
  return function handler() {
    console.log(`Handling ${name} with ID ${id}`);
  };
}
```

### Efficient Data Processing

**✅ Optimize data operations:**

```javascript
// Use Map for O(1) lookups
const userMap = new Map(users.map(user => [user.id, user]));
const getUserById = (id) => userMap.get(id);

// Use Set for unique collections
const uniqueRoles = new Set(users.map(user => user.role));
const hasRole = (role) => uniqueRoles.has(role);

// Lazy evaluation with generators
function* processUsers(users) {
  for (const user of users) {
    if (user.isActive) {
      yield {
        ...user,
        processed: true,
        processedAt: new Date()
      };
    }
  }
}

// Use for batch processing
const processedUsers = Array.from(processUsers(allUsers));

// Memoization for expensive operations
function memoize(fn) {
  const cache = new Map();
  
  return function memoized(...args) {
    const key = JSON.stringify(args);
    
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveOperation = memoize((data) => {
  // Expensive computation
  return data.reduce((acc, item) => acc + item.value, 0);
});
```

### Debouncing and Throttling

**✅ Control function execution frequency:**

```javascript
// Debounce: Wait for pause in calls
function debounce(func, delay) {
  let timeoutId;
  
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// Throttle: Limit execution frequency
function throttle(func, limit) {
  let inThrottle;
  
  return function throttled(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Usage examples
const debouncedSearch = debounce((query) => {
  searchApi.search(query);
}, 300);

const throttledScroll = throttle(() => {
  updateScrollPosition();
}, 100);

// Advanced debounce with immediate execution
function debounceImmediate(func, delay) {
  let timeoutId;
  
  return function debouncedImmediate(...args) {
    const callNow = !timeoutId;
    
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => timeoutId = null, delay);
    
    if (callNow) {
      func.apply(this, args);
    }
  };
}
```

---

This JavaScript style guide provides a comprehensive foundation for modern JavaScript development with clear naming conventions and best practices. Use it alongside the React-specific guides for complete coverage of your development standards.