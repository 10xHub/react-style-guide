# File Organization Guide - Kebab-Case Version

> Project structure standards with kebab-case file naming conventions and organization patterns

## Table of Contents

1. [Project Structure Overview](#project-structure-overview)
2. [File Naming Conventions](#file-naming-conventions)
3. [Folder Organization](#folder-organization)
4. [Component Organization](#component-organization)
5. [Service Layer Organization](#service-layer-organization)
6. [Asset Management](#asset-management)
7. [Import/Export Patterns](#importexport-patterns)
8. [Code Splitting Strategy](#code-splitting-strategy)

## Project Structure Overview

```
project-root/
├── public/                     # Static files served directly
│   ├── locales/               # Internationalization files
│   │   ├── en/
│   │   ├── es/
│   │   └── fr/
│   ├── images/                # Static images
│   ├── favicon.ico
│   └── index.html
├── src/                       # Source code
│   ├── assets/               # Static assets for bundling
│   ├── components/           # Reusable React components
│   ├── docs/                 # Documentation files
│   ├── lib/                  # Utility functions and helpers
│   ├── pages/                # Page components
│   ├── route/                # Routing configuration
│   └── services/             # External service integrations
├── .eslintrc.js              # ESLint configuration
├── .gitignore
├── package.json
├── README.md
└── vite.config.js            # Vite configuration
```

## File Naming Conventions

### Grouping Keywords

Use specific keywords before file extensions to categorize files:

- **`component`** - React components
- **`story`** - Storybook stories  
- **`stories`** - Multiple component stories
- **`api`** - Axios API clients
- **`query`** - TanStack Query implementations
- **`slice`** - Redux Toolkit slices
- **`test`** - Test files
- **`hook`** - Custom hooks
- **`util`** - Utility functions
- **`type`** - TypeScript type definitions

### Naming Examples (Kebab-Case)

```javascript
// React Components
user-profile.jsx
navigation-menu.jsx
product-card.jsx
auth-login-form.jsx

// Custom Hooks
use-user-data.hook.js
use-auth-state.hook.js
use-shopping-cart.hook.js
use-local-storage.hook.js

// API Services
user.api.js
auth.api.js
product.api.js
order.api.js

// TanStack Query
user.query.js
product.query.js
dashboard.query.js
analytics.query.js

// Redux Slices
auth.slice.js
user.slice.js
cart.slice.js
ui.slice.js

// Utility Functions
validators.util.js
formatters.util.js
constants.util.js
helpers.util.js

// Test Files
user-profile.test.jsx
use-user-data.test.js
user.api.test.js
validators.test.js

// Storybook Stories
button.story.jsx
user-card.stories.jsx
```

### Directory Naming

```javascript
// Use kebab-case for directories
user-management/
shopping-cart/
admin-panel/
product-catalog/

// Feature-based directories
auth/
dashboard/
user-profile/
order-management/
```

## Folder Organization

### `src/components/` Structure

```
src/components/
├── ui/                        # Base UI components (ShadCN/UI)
│   ├── button.jsx
│   ├── input.jsx
│   ├── card.jsx
│   ├── modal.jsx
│   └── index.js              # Barrel exports
├── layout/                   # Layout components
│   ├── header.jsx
│   ├── sidebar.jsx
│   ├── footer.jsx
│   ├── main-layout.jsx
│   └── index.js
├── forms/                    # Form-related components
│   ├── user-form.jsx
│   ├── login-form.jsx
│   ├── contact-form.jsx
│   └── index.js
├── features/                 # Feature-specific components
│   ├── auth/
│   │   ├── login-button.jsx
│   │   ├── auth-guard.jsx
│   │   └── index.js
│   ├── dashboard/
│   │   ├── stats-widget.jsx
│   │   ├── recent-activity.jsx
│   │   └── index.js
│   └── user-profile/
│       ├── profile-card.jsx
│       ├── avatar-upload.jsx
│       └── index.js
└── common/                   # Commonly used components
    ├── loading-spinner.jsx
    ├── error-boundary.jsx
    ├── not-found.jsx
    └── index.js
```

### `src/lib/` Structure

```
src/lib/
├── constants/                # Application constants
│   ├── api.constants.js     # API endpoints, status codes
│   ├── ui.constants.js      # UI constants (colors, sizes)
│   ├── app.constants.js     # App-wide constants
│   └── index.js
├── context/                 # React Context providers
│   ├── auth-context.js
│   ├── theme-context.js
│   ├── user-context.js
│   └── index.js
├── hooks/                   # Custom hooks organized by purpose
│   ├── data/               # Data fetching hooks
│   │   ├── use-user-data.hook.js
│   │   ├── use-api-request.hook.js
│   │   └── index.js
│   ├── ui/                 # UI state hooks
│   │   ├── use-toggle.hook.js
│   │   ├── use-modal.hook.js
│   │   ├── use-debounce.hook.js
│   │   └── index.js
│   ├── business/           # Business logic hooks
│   │   ├── use-auth.hook.js
│   │   ├── use-permissions.hook.js
│   │   ├── use-shopping-cart.hook.js
│   │   └── index.js
│   └── effects/            # Effect-based hooks
│       ├── use-event-listener.hook.js
│       ├── use-click-outside.hook.js
│       ├── use-interval.hook.js
│       └── index.js
└── utils/                  # Utility functions
    ├── validators.util.js  # Input validation functions
    ├── formatters.util.js  # Data formatting functions
    ├── helpers.util.js     # General helper functions
    ├── storage.util.js     # localStorage/sessionStorage utils
    ├── api.util.js         # API utility functions
    └── index.js
```

### `src/pages/` Structure

```
src/pages/
├── auth/                    # Authentication pages
│   ├── login.jsx
│   ├── register.jsx
│   ├── forgot-password.jsx
│   ├── reset-password.jsx
│   └── index.js
├── dashboard/               # Dashboard pages
│   ├── dashboard.jsx
│   ├── analytics.jsx
│   ├── reports.jsx
│   └── index.js
├── user-profile/           # User profile pages
│   ├── profile.jsx
│   ├── settings.jsx
│   ├── preferences.jsx
│   └── index.js
├── misc/                   # Miscellaneous pages
│   ├── not-found.jsx
│   ├── unauthorized.jsx
│   ├── server-error.jsx
│   ├── maintenance.jsx
│   └── index.js
└── index.js                # All page exports
```

### `src/services/` Structure

```
src/services/
├── api/                    # Axios API clients
│   ├── base.api.js        # Base API configuration
│   ├── user.api.js        # User-related API calls
│   ├── auth.api.js        # Authentication API calls
│   ├── product.api.js     # Product API calls
│   ├── order.api.js       # Order API calls
│   └── index.js
├── query/                 # TanStack Query implementations
│   ├── user.query.js      # User data queries and mutations
│   ├── product.query.js   # Product data queries
│   ├── order.query.js     # Order data queries
│   ├── auth.query.js      # Auth-related queries
│   └── index.js
├── store/                 # Redux store and slices
│   ├── store.js           # Store configuration
│   ├── auth.slice.js      # Authentication state
│   ├── user.slice.js      # User state
│   ├── ui.slice.js        # UI state (modals, loading, etc.)
│   ├── cart.slice.js      # Shopping cart state
│   └── index.js
└── mock/                  # Mock data for development/testing
    ├── handlers.js        # MSW request handlers
    ├── data/              # Mock data files
    │   ├── users.mock.js
    │   ├── products.mock.js
    │   └── orders.mock.js
    └── index.js
```

## Component Organization

### Single Component File Structure

```jsx
// user-profile.jsx

// 1. External imports
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

// 2. Internal imports - utilities
import { formatDate, validateEmail } from '../../lib/utils';
import { USER_ROLES } from '../../lib/constants';

// 3. Internal imports - components
import { Card, Button, Avatar } from '../ui';
import { LoadingSpinner, ErrorMessage } from '../common';

// 4. Internal imports - hooks and services
import { useUserData } from '../../lib/hooks/data';
import { usePermissions } from '../../lib/hooks/business';

// 5. Styles (if using CSS modules)
import styles from './user-profile.module.css';

// 6. Component definition
const UserProfile = ({ 
  userId, 
  onEdit, 
  onDelete, 
  showActions = true,
  variant = 'default' 
}) => {
  // Local state
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Custom hooks
  const { user, loading, error } = useUserData(userId);
  const { permissions } = usePermissions(user);
  
  // Event handlers
  const handleEdit = useCallback(() => {
    onEdit(user);
  }, [user, onEdit]);
  
  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure?')) {
      onDelete(user.id);
    }
  }, [user, onDelete]);
  
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);
  
  // Early returns
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <div>User not found</div>;
  
  // Main render
  return (
    <Card className={`user-profile user-profile--${variant}`}>
      <div className="user-profile__header">
        <Avatar 
          src={user.avatar} 
          alt={`${user.name} avatar`}
          size="large"
        />
        <div className="user-profile__info">
          <h3 className="user-profile__name">{user.name}</h3>
          <p className="user-profile__email">{user.email}</p>
          <span className="user-profile__role">{user.role}</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="user-profile__details">
          <p>Joined: {formatDate(user.createdAt)}</p>
          <p>Last login: {formatDate(user.lastLogin)}</p>
          <p>Status: {user.isActive ? 'Active' : 'Inactive'}</p>
        </div>
      )}
      
      <div className="user-profile__actions">
        <Button 
          variant="ghost" 
          size="small"
          onClick={toggleExpanded}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </Button>
        
        {showActions && permissions.canEdit && (
          <Button onClick={handleEdit}>Edit</Button>
        )}
        
        {showActions && permissions.canDelete && (
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
};

// 7. PropTypes
UserProfile.propTypes = {
  userId: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  showActions: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'compact', 'detailed'])
};

// 8. Default export
export default UserProfile;
```

### Feature Folder Structure

```
src/components/features/user-management/
├── components/              # Feature-specific components
│   ├── user-list.jsx
│   ├── user-card.jsx
│   ├── user-form.jsx
│   ├── user-filters.jsx
│   └── index.js
├── hooks/                  # Feature-specific hooks
│   ├── use-user-management.hook.js
│   ├── use-user-filters.hook.js
│   └── index.js
├── utils/                  # Feature-specific utilities
│   ├── user-validators.util.js
│   ├── user-formatters.util.js
│   └── index.js
├── constants/              # Feature-specific constants
│   ├── user-roles.constants.js
│   └── index.js
└── index.js               # Feature barrel export
```

## Service Layer Organization

### API Service Structure

```javascript
// src/services/api/base.api.js
import axios from 'axios';

const createApiClient = (baseURL = '/api') => {
  const client = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  
  // Response interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
  
  return client;
};

export const apiClient = createApiClient();
export default createApiClient;

// src/services/api/user.api.js
import { apiClient } from './base.api';

export const userApi = {
  // GET requests
  getUsers: (params = {}) => 
    apiClient.get('/users', { params }),
    
  getUserById: (id) => 
    apiClient.get(`/users/${id}`),
    
  getCurrentUser: () => 
    apiClient.get('/users/me'),
  
  // POST requests
  createUser: (userData) => 
    apiClient.post('/users', userData),
    
  // PUT requests
  updateUser: (id, userData) => 
    apiClient.put(`/users/${id}`, userData),
    
  // DELETE requests
  deleteUser: (id) => 
    apiClient.delete(`/users/${id}`),
    
  // Custom actions
  changePassword: (id, passwordData) => 
    apiClient.post(`/users/${id}/change-password`, passwordData),
    
  uploadAvatar: (id, formData) => 
    apiClient.post(`/users/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
};
```

### Query Service Structure

```javascript
// src/services/query/user.query.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user.api';

// Query keys factory
export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), { filters }],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id]
};

// Queries
export const useUsersQuery = (filters = {}) => {
  return useQuery({
    queryKey: userKeys.list(filters),
    queryFn: () => userApi.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    keepPreviousData: true
  });
};

export const useUserQuery = (userId) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userApi.getUserById(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000 // 10 minutes
  });
};

// Mutations
export const useCreateUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: userApi.createUser,
    onSuccess: (newUser) => {
      // Update cache
      queryClient.setQueryData(userKeys.detail(newUser.id), newUser);
      
      // Invalidate user lists
      queryClient.invalidateQueries(userKeys.lists());
    }
  });
};

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, ...data }) => userApi.updateUser(id, data),
    onSuccess: (updatedUser) => {
      // Update specific user cache
      queryClient.setQueryData(userKeys.detail(updatedUser.id), updatedUser);
      
      // Invalidate related queries
      queryClient.invalidateQueries(userKeys.lists());
    }
  });
};
```

### Redux Slice Structure

```javascript
// src/services/store/user.slice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../api/user.api';

// Async thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (params, { rejectWithValue }) => {
    try {
      const response = await userApi.getUsers(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await userApi.createUser(userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Initial state
const initialState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0
  }
};

// Slice
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetUsers: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        
        // Normalize data
        const users = action.payload.users || action.payload;
        state.entities = users.reduce((acc, user) => {
          acc[user.id] = user;
          return acc;
        }, {});
        state.ids = users.map(user => user.id);
        
        // Update pagination if provided
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        const newUser = action.payload;
        state.entities[newUser.id] = newUser;
        state.ids.push(newUser.id);
      });
  }
});

// Selectors
export const selectAllUsers = (state) => 
  state.users.ids.map(id => state.users.entities[id]);

export const selectUserById = (state, userId) => 
  state.users.entities[userId];

export const selectUsersLoading = (state) => state.users.loading;
export const selectUsersError = (state) => state.users.error;

// Actions
export const { setFilters, clearError, resetUsers } = userSlice.actions;

// Reducer
export default userSlice.reducer;
```

## Asset Management

### Asset Organization

```
src/assets/
├── images/                  # Images for bundling
│   ├── icons/              # SVG icons
│   │   ├── user.svg
│   │   ├── settings.svg
│   │   └── dashboard.svg
│   ├── logos/              # Company/brand logos
│   │   ├── logo.svg
│   │   ├── logo-dark.svg
│   │   └── favicon.png
│   ├── illustrations/       # Larger graphics
│   │   ├── empty-state.svg
│   │   ├── error-404.svg
│   │   └── welcome.svg
│   └── avatars/            # Default avatar images
│       ├── default-avatar.png
│       └── placeholder.svg
├── fonts/                  # Custom fonts
│   ├── inter/
│   │   ├── inter-regular.woff2
│   │   ├── inter-medium.woff2
│   │   └── inter-bold.woff2
│   └── roboto/
│       ├── roboto-regular.woff2
│       └── roboto-bold.woff2
├── styles/                 # Global styles
│   ├── globals.css
│   ├── variables.css
│   ├── components.css
│   └── utilities.css
└── data/                   # Static data files
    ├── countries.json
    ├── timezones.json
    └── currencies.json
```

### Asset Import Patterns

```javascript
// Static imports for assets that will be bundled
import logoSvg from '../assets/images/logos/logo.svg';
import userIcon from '../assets/images/icons/user.svg';
import defaultAvatar from '../assets/images/avatars/default-avatar.png';

// Dynamic imports for code splitting
const loadIllustration = (name) => 
  import(`../assets/images/illustrations/${name}.svg`);

// Asset helper functions
export const getAssetUrl = (path) => {
  return new URL(`../assets/${path}`, import.meta.url).href;
};

export const getImageUrl = (filename) => {
  return getAssetUrl(`images/${filename}`);
};

export const getIconUrl = (iconName) => {
  return getAssetUrl(`images/icons/${iconName}.svg`);
};
```

## Import/Export Patterns

### Barrel Exports

```javascript
// src/components/ui/index.js
export { default as Button } from './button';
export { default as Input } from './input';
export { default as Card } from './card';
export { default as Modal } from './modal';
export { default as Avatar } from './avatar';

// src/lib/hooks/index.js
// Data hooks
export * from './data';

// UI hooks  
export * from './ui';

// Business hooks
export * from './business';

// Effect hooks
export * from './effects';

// src/lib/utils/index.js
export * from './validators.util';
export * from './formatters.util';
export * from './helpers.util';
export * from './storage.util';

// src/services/api/index.js
export { userApi } from './user.api';
export { authApi } from './auth.api';
export { productApi } from './product.api';
export { orderApi } from './order.api';
```

### Import Organization

```javascript
// Component imports organized by source
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';

// UI components
import { Button, Card, Input } from '../ui';
import { LoadingSpinner, ErrorMessage } from '../common';

// Business hooks
import { useAuth, usePermissions } from '../../lib/hooks/business';

// Utilities
import { formatDate, validateEmail } from '../../lib/utils';
import { USER_ROLES, API_ENDPOINTS } from '../../lib/constants';

// Services
import { userApi } from '../../services/api';
import { useUserQuery } from '../../services/query';
```

## Code Splitting Strategy

### Route-based Splitting

```javascript
// src/route/main-routes.jsx
import { lazy } from 'react';

// Lazy load page components
const Dashboard = lazy(() => import('../pages/dashboard/dashboard'));
const UserProfile = lazy(() => import('../pages/user-profile/profile'));
const Settings = lazy(() => import('../pages/user-profile/settings'));

// Admin pages with longer loading
const AdminPanel = lazy(() => 
  import('../pages/admin/admin-panel').then(module => ({
    default: module.AdminPanel
  }))
);

export const mainRoutes = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    preload: () => import('../pages/dashboard/dashboard')
  },
  {
    path: '/profile',
    element: <UserProfile />,
    preload: () => import('../pages/user-profile/profile')
  },
  {
    path: '/settings',
    element: <Settings />,
    preload: () => import('../pages/user-profile/settings')
  },
  {
    path: '/admin',
    element: <AdminPanel />,
    preload: () => import('../pages/admin/admin-panel')
  }
];
```

### Feature-based Splitting

```javascript
// src/components/features/index.js
import { lazy } from 'react';

// Split by feature size and usage frequency
export const UserManagement = lazy(() => 
  import('./user-management').then(m => ({ default: m.UserManagement }))
);

export const ProductCatalog = lazy(() => 
  import('./product-catalog').then(m => ({ default: m.ProductCatalog }))
);

export const OrderManagement = lazy(() => 
  import('./order-management').then(m => ({ default: m.OrderManagement }))
);

// Heavy features that are rarely used
export const ReportsModule = lazy(() => 
  import('./reports').then(m => ({ default: m.ReportsModule }))
);

export const AnalyticsModule = lazy(() => 
  import('./analytics').then(m => ({ default: m.AnalyticsModule }))
);
```

### Vendor Splitting

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom'],
          
          // Routing
          'router': ['react-router-dom'],
          
          // State management
          'state': ['@reduxjs/toolkit', 'react-redux'],
          
          // Data fetching
          'query': ['@tanstack/react-query'],
          
          // UI libraries
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          
          // Form handling
          'forms': ['react-hook-form', 'zod'],
          
          // Utilities
          'utils': ['axios', 'date-fns', 'lodash']
        }
      }
    }
  }
});
```