# File Organization Guide

> Project structure standards, file naming conventions, and organization patterns

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

### Naming Examples

```javascript
// React Components
UserProfile.jsx
NavigationMenu.jsx
ProductCard.jsx
AuthLoginForm.jsx

// Custom Hooks
useUserData.hook.js
useAuthState.hook.js
useShoppingCart.hook.js
useLocalStorage.hook.js

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
UserProfile.test.jsx
useUserData.test.js
user.api.test.js
validators.test.js

// Storybook Stories
Button.story.jsx
UserCard.stories.jsx
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
│   ├── Button.component.jsx
│   ├── Input.component.jsx
│   ├── Card.component.jsx
│   ├── Modal.component.jsx
│   └── index.js              # Barrel exports
├── layout/                   # Layout components
│   ├── Header.component.jsx
│   ├── Sidebar.component.jsx
│   ├── Footer.component.jsx
│   ├── MainLayout.component.jsx
│   └── index.js
├── forms/                    # Form-related components
│   ├── UserForm.component.jsx
│   ├── LoginForm.component.jsx
│   ├── ContactForm.component.jsx
│   └── index.js
├── features/                 # Feature-specific components
│   ├── auth/
│   │   ├── LoginButton.component.jsx
│   │   ├── AuthGuard.component.jsx
│   │   └── index.js
│   ├── dashboard/
│   │   ├── StatsWidget.component.jsx
│   │   ├── RecentActivity.component.jsx
│   │   └── index.js
│   └── user-profile/
│       ├── ProfileCard.component.jsx
│       ├── AvatarUpload.component.jsx
│       └── index.js
└── common/                   # Commonly used components
    ├── LoadingSpinner.component.jsx
    ├── ErrorBoundary.component.jsx
    ├── NotFound.component.jsx
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
│   ├── AuthContext.js
│   ├── ThemeContext.js
│   ├── UserContext.js
│   └── index.js
├── hooks/                   # Custom hooks organized by purpose
│   ├── data/               # Data fetching hooks
│   │   ├── useUserData.hook.js
│   │   ├── useApiRequest.hook.js
│   │   └── index.js
│   ├── ui/                 # UI state hooks
│   │   ├── useToggle.hook.js
│   │   ├── useModal.hook.js
│   │   ├── useDebounce.hook.js
│   │   └── index.js
│   ├── business/           # Business logic hooks
│   │   ├── useAuth.hook.js
│   │   ├── usePermissions.hook.js
│   │   ├── useShoppingCart.hook.js
│   │   └── index.js
│   └── effects/            # Effect-based hooks
│       ├── useEventListener.hook.js
│       ├── useClickOutside.hook.js
│       ├── useInterval.hook.js
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
│   ├── Login.component.jsx
│   ├── Register.component.jsx
│   ├── ForgotPassword.component.jsx
│   ├── ResetPassword.component.jsx
│   └── index.js
├── dashboard/               # Dashboard pages
│   ├── Dashboard.component.jsx
│   ├── Analytics.component.jsx
│   ├── Reports.component.jsx
│   └── index.js
├── user-profile/           # User profile pages
│   ├── Profile.component.jsx
│   ├── Settings.component.jsx
│   ├── Preferences.component.jsx
│   └── index.js
├── misc/                   # Miscellaneous pages
│   ├── NotFound.component.jsx
│   ├── Unauthorized.component.jsx
│   ├── ServerError.component.jsx
│   ├── Maintenance.component.jsx
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
// UserProfile.component.jsx

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
import styles from './UserProfile.module.css';

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
│   ├── UserList.component.jsx
│   ├── UserCard.component.jsx
│   ├── UserForm.component.jsx
│   ├── UserFilters.component.jsx
│   └── index.js
├── hooks/                  # Feature-specific hooks
│   ├── useUserManagement.hook.js
│   ├── useUserFilters.hook.js
│   └── index.js
├── utils/                  # Feature-specific utilities
│   ├── userValidators.util.js
│   ├── userFormatters.util.js
│   └── index.js
├── constants/              # Feature-specific constants
│   ├── userRoles.constants.js
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
│   │   ├── Inter-Regular.woff2
│   │   ├── Inter-Medium.woff2
│   │   └── Inter-Bold.woff2
│   └── roboto/
│       ├── Roboto-Regular.woff2
│       └── Roboto-Bold.woff2
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
export { default as Button } from './Button.component';
export { default as Input } from './Input.component';
export { default as Card } from './Card.component';
export { default as Modal } from './Modal.component';
export { default as Avatar } from './Avatar.component';

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
// src/route/main.routes.jsx
import { lazy } from 'react';

// Lazy load page components
const Dashboard = lazy(() => import('../pages/dashboard/Dashboard.component'));
const UserProfile = lazy(() => import('../pages/user-profile/Profile.component'));
const Settings = lazy(() => import('../pages/user-profile/Settings.component'));

// Admin pages with longer loading
const AdminPanel = lazy(() => 
  import('../pages/admin/AdminPanel.component').then(module => ({
    default: module.AdminPanel
  }))
);

export const mainRoutes = [
  {
    path: '/dashboard',
    element: <Dashboard />,
    preload: () => import('../pages/dashboard/Dashboard.component')
  },
  {
    path: '/profile',
    element: <UserProfile />,
    preload: () => import('../pages/user-profile/Profile.component')
  },
  {
    path: '/settings',
    element: <Settings />,
    preload: () => import('../pages/user-profile/Settings.component')
  },
  {
    path: '/admin',
    element: <AdminPanel />,
    preload: () => import('../pages/admin/AdminPanel.component')
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

This file organization guide provides a comprehensive structure for maintaining clean, scalable, and well-organized React projects. The patterns ensure consistency across team members and make the codebase easier to navigate and maintain.
