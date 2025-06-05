# Performance Guide

> React performance optimization techniques, bundle optimization, and monitoring strategies

## Table of Contents

1. [Performance Fundamentals](#performance-fundamentals)
2. [React Performance](#react-performance)
3. [Bundle Optimization](#bundle-optimization)
4. [Loading Strategies](#loading-strategies)
5. [Memory Management](#memory-management)
6. [Network Optimization](#network-optimization)
7. [Monitoring & Measurement](#monitoring--measurement)
8. [Performance Checklist](#performance-checklist)

## Performance Fundamentals

### Core Web Vitals

**Largest Contentful Paint (LCP)** - Loading performance
- Target: < 2.5 seconds
- Measures when the largest content element loads

**First Input Delay (FID)** - Interactivity
- Target: < 100 milliseconds  
- Measures time from first user interaction to browser response

**Cumulative Layout Shift (CLS)** - Visual stability
- Target: < 0.1
- Measures unexpected layout shifts

### Performance Budget

```javascript
// vite.config.js - Performance budgets
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
        }
      }
    }
  },
  
  // Performance warnings
  esbuild: {
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  }
});

// Bundle analyzer configuration
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig({
  plugins: [
    analyzer({
      analyzerMode: 'server',
      openAnalyzer: false
    })
  ]
});
```

## React Performance

### Component Optimization

#### React.memo Usage

```jsx
// ✅ Memoize expensive components
const UserCard = React.memo(({ user, onEdit, onDelete }) => {
  return (
    <div className="user-card">
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
});

// ✅ Custom comparison for complex props
const UserList = React.memo(({ users, filters, onUserSelect }) => {
  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          onSelect={() => onUserSelect(user)}
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
    ) &&
    JSON.stringify(prevProps.filters) === JSON.stringify(nextProps.filters)
  );
});

// ❌ Don't memo simple components
const SimpleButton = ({ children, onClick }) => (
  <button onClick={onClick}>{children}</button>
);
// No need for React.memo here - overhead outweighs benefits
```

#### useMemo for Expensive Calculations

```jsx
// ✅ Memoize expensive calculations
const DataVisualization = ({ data, filters }) => {
  // Expensive data processing
  const processedData = useMemo(() => {
    return data
      .filter(item => matchesFilters(item, filters))
      .map(item => ({
        ...item,
        calculated: performHeavyCalculation(item),
        formatted: formatForChart(item)
      }))
      .sort((a, b) => b.calculated - a.calculated);
  }, [data, filters]);

  // Expensive chart configuration
  const chartConfig = useMemo(() => {
    return {
      data: processedData,
      options: generateChartOptions(processedData),
      plugins: getOptimalPlugins(processedData.length)
    };
  }, [processedData]);

  return <Chart {...chartConfig} />;
};

// ✅ Memoize object/array creation
const UserProfile = ({ user }) => {
  const userPermissions = useMemo(() => ({
    canEdit: user.role === 'admin' || user.id === currentUser.id,
    canDelete: user.role === 'admin',
    canView: true
  }), [user.role, user.id, currentUser.id]);

  const actionButtons = useMemo(() => [
    { label: 'Edit', show: userPermissions.canEdit },
    { label: 'Delete', show: userPermissions.canDelete },
    { label: 'View', show: userPermissions.canView }
  ].filter(button => button.show), [userPermissions]);

  return (
    <div className="user-profile">
      <UserInfo user={user} />
      <ActionBar buttons={actionButtons} />
    </div>
  );
};
```

#### useCallback for Event Handlers

```jsx
// ✅ Memoize event handlers passed to child components
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(new Set());

  // Memoize handlers to prevent child re-renders
  const handleUserSelect = useCallback((userId) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  const handleUserEdit = useCallback((user) => {
    setUsers(prev => prev.map(u => 
      u.id === user.id ? { ...u, ...user } : u
    ));
  }, []);

  const handleUserDelete = useCallback((userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      newSet.delete(userId);
      return newSet;
    });
  }, []);

  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          selected={selectedUsers.has(user.id)}
          onSelect={handleUserSelect}
          onEdit={handleUserEdit}
          onDelete={handleUserDelete}
        />
      ))}
    </div>
  );
};

// ❌ Avoid inline functions in render
const BadExample = ({ users }) => (
  <div>
    {users.map(user => (
      <UserCard
        key={user.id}
        user={user}
        onClick={() => handleClick(user)} // Creates new function on every render
        onEdit={(data) => handleEdit(user.id, data)} // Creates new function
      />
    ))}
  </div>
);
```

### State Management Optimization

#### Optimized State Updates

```jsx
// ✅ Minimize state updates
const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });

  // Batch multiple updates
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  // Debounce rapid updates
  const debouncedUpdate = useMemo(
    () => debounce((field, value) => {
      handleInputChange(field, value);
    }, 300),
    [handleInputChange]
  );

  return (
    <form>
      <input
        onChange={(e) => debouncedUpdate('name', e.target.value)}
        placeholder="Name"
      />
      <input
        onChange={(e) => debouncedUpdate('email', e.target.value)}
        placeholder="Email"
      />
    </form>
  );
};

// ✅ Split state for independent updates
const Dashboard = () => {
  // Split into separate state pieces
  const [userStats, setUserStats] = useState(null);
  const [systemStats, setSystemStats] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // Rather than one large state object
  // const [dashboardData, setDashboardData] = useState({
  //   userStats: null,
  //   systemStats: null,
  //   notifications: []
  // });
};
```

#### Optimized Context Usage

```jsx
// ✅ Split contexts by update frequency
const UserContext = createContext();
const UserActionsContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Memoize user data to prevent unnecessary re-renders
  const userData = useMemo(() => user, [user]);

  // Memoize actions to prevent re-renders
  const userActions = useMemo(() => ({
    updateUser: (updates) => setUser(prev => ({ ...prev, ...updates })),
    logout: () => setUser(null)
  }), []);

  return (
    <UserContext.Provider value={userData}>
      <UserActionsContext.Provider value={userActions}>
        {children}
      </UserActionsContext.Provider>
    </UserContext.Provider>
  );
};

// Custom hooks for accessing context
const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};

const useUserActions = () => {
  const context = useContext(UserActionsContext);
  if (!context) throw new Error('useUserActions must be used within UserProvider');
  return context;
};
```

### Virtual Scrolling for Large Lists

```jsx
// ✅ Virtual scrolling for large datasets
import { FixedSizeList as List } from 'react-window';

const VirtualizedUserList = ({ users }) => {
  const Row = useCallback(({ index, style }) => (
    <div style={style}>
      <UserCard user={users[index]} />
    </div>
  ), [users]);

  return (
    <List
      height={600}
      itemCount={users.length}
      itemSize={120}
      itemData={users}
    >
      {Row}
    </List>
  );
};

// ✅ Variable height virtual scrolling
import { VariableSizeList as List } from 'react-window';

const VariableHeightList = ({ items }) => {
  const listRef = useRef();
  const rowHeights = useRef({});

  const getItemHeight = useCallback((index) => {
    return rowHeights.current[index] || 100;
  }, []);

  const setItemHeight = useCallback((index, height) => {
    rowHeights.current[index] = height;
    if (listRef.current) {
      listRef.current.resetAfterIndex(index);
    }
  }, []);

  const Row = ({ index, style }) => (
    <div style={style}>
      <MeasuredRow
        index={index}
        item={items[index]}
        onHeightChange={setItemHeight}
      />
    </div>
  );

  return (
    <List
      ref={listRef}
      height={600}
      itemCount={items.length}
      estimatedItemSize={100}
      itemSize={getItemHeight}
    >
      {Row}
    </List>
  );
};
```

## Bundle Optimization

### Code Splitting Strategies

#### Route-based Splitting

```jsx
// ✅ Split by routes
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load page components
const Dashboard = lazy(() => import('../pages/Dashboard.component'));
const UserProfile = lazy(() => import('../pages/UserProfile.component'));
const Settings = lazy(() => import('../pages/Settings.component'));

// Admin pages - separate chunk
const AdminPanel = lazy(() => 
  import('../pages/admin/AdminPanel.component')
);

const App = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/admin" element={<AdminPanel />} />
    </Routes>
  </Suspense>
);

// ✅ Preload on hover
const NavigationLink = ({ to, children, preload }) => {
  const handleMouseEnter = useCallback(() => {
    if (preload) {
      preload();
    }
  }, [preload]);

  return (
    <Link to={to} onMouseEnter={handleMouseEnter}>
      {children}
    </Link>
  );
};

// Usage
<NavigationLink 
  to="/admin" 
  preload={() => import('../pages/admin/AdminPanel.component')}
>
  Admin Panel
</NavigationLink>
```

#### Feature-based Splitting

```jsx
// ✅ Split heavy features
const DataVisualization = lazy(() => 
  import('../features/analytics/DataVisualization.component')
);

const ReportGenerator = lazy(() => 
  import('../features/reports/ReportGenerator.component')
);

const VideoPlayer = lazy(() => 
  import('../features/media/VideoPlayer.component')
);

// ✅ Conditional loading
const ConditionalFeature = ({ userRole }) => {
  if (userRole === 'admin') {
    const AdminFeature = lazy(() => import('../features/admin/AdminFeature'));
    return (
      <Suspense fallback={<div>Loading admin features...</div>}>
        <AdminFeature />
      </Suspense>
    );
  }
  
  return <StandardFeature />;
};
```

### Webpack Bundle Analysis

```javascript
// vite.config.js - Bundle optimization
import { defineConfig } from 'vite';
import { analyzer } from 'vite-bundle-analyzer';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor splitting
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('@tanstack/react-query')) {
              return 'query-vendor';
            }
            if (id.includes('axios')) {
              return 'http-vendor';
            }
            return 'vendor';
          }
          
          // Feature splitting
          if (id.includes('/features/admin/')) {
            return 'admin';
          }
          if (id.includes('/features/analytics/')) {
            return 'analytics';
          }
          if (id.includes('/features/reports/')) {
            return 'reports';
          }
        }
      }
    },
    
    // Optimize chunks
    chunkSizeWarningLimit: 1000,
    
    // Remove console logs in production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  
  plugins: [
    analyzer({
      analyzerMode: 'server',
      openAnalyzer: process.env.ANALYZE === 'true'
    })
  ]
});
```

### Tree Shaking Optimization

```javascript
// ✅ Named imports for tree shaking
import { debounce } from 'lodash';
import { formatDate } from 'date-fns';
import { Button, Card } from '@/components/ui';

// ❌ Default imports prevent tree shaking
import lodash from 'lodash';
import * as dateFns from 'date-fns';
import * as UI from '@/components/ui';

// ✅ Configure package.json for tree shaking
{
  "name": "my-app",
  "sideEffects": [
    "*.css",
    "*.scss",
    "./src/polyfills.js"
  ]
}

// ✅ Mark functions as pure
/*#__PURE__*/ function expensiveCalculation() {
  // This function can be tree-shaken if not used
}
```

## Loading Strategies

### Progressive Enhancement

```jsx
// ✅ Progressive loading with Suspense boundaries
const App = () => (
  <div className="app">
    <Header />
    
    <Suspense fallback={<NavSkeleton />}>
      <Navigation />
    </Suspense>
    
    <main>
      <Suspense fallback={<ContentSkeleton />}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/profile" element={<UserProfile />} />
        </Routes>
      </Suspense>
    </main>
    
    <Suspense fallback={null}>
      <Footer />
    </Suspense>
  </div>
);

// ✅ Skeleton components for better UX
const ContentSkeleton = () => (
  <div className="content-skeleton">
    <div className="skeleton-header" />
    <div className="skeleton-body">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="skeleton-item" />
      ))}
    </div>
  </div>
);
```

### Image Optimization

```jsx
// ✅ Lazy loading images
const LazyImage = ({ src, alt, className, placeholder }) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageRef, isIntersecting] = useIntersectionObserver({
    threshold: 0.1
  });

  useEffect(() => {
    if (isIntersecting && src !== imageSrc) {
      setImageSrc(src);
    }
  }, [isIntersecting, src, imageSrc]);

  return (
    <img
      ref={imageRef}
      src={imageSrc}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
};

// ✅ Responsive images
const ResponsiveImage = ({ src, alt, sizes = "100vw" }) => {
  const srcSet = useMemo(() => {
    const breakpoints = [320, 640, 768, 1024, 1280];
    return breakpoints
      .map(width => `${src}?w=${width} ${width}w`)
      .join(', ');
  }, [src]);

  return (
    <img
      src={`${src}?w=640`}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
};

// ✅ Image preloading for critical images
const preloadImage = (src) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};

// Usage in component
useEffect(() => {
  preloadImage('/hero-image.jpg');
}, []);
```

### Font Optimization

```css
/* ✅ Optimized font loading */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('/fonts/inter-regular.woff2') format('woff2');
}

/* ✅ Preload critical fonts */
/* In HTML head */
<link rel="preload" href="/fonts/inter-regular.woff2" as="font" type="font/woff2" crossorigin>

/* ✅ Fallback fonts */
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
}
```

## Memory Management

### Preventing Memory Leaks

```jsx
// ✅ Cleanup event listeners
const WindowSize = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateSize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', updateSize);
    updateSize(); // Set initial size

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return <div>Window size: {size.width} x {size.height}</div>;
};

// ✅ Cancel async operations
const DataFetcher = ({ url }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          signal: controller.signal
        });
        const result = await response.json();
        
        if (!cancelled) {
          setData(result);
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled && error.name !== 'AbortError') {
          console.error('Fetch failed:', error);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [url]);

  return loading ? <div>Loading...</div> : <div>{JSON.stringify(data)}</div>;
};

// ✅ Clear intervals and timeouts
const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef();

  const startTimer = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopTimer(); // Cleanup on unmount
    };
  }, []);

  return (
    <div>
      <div>Time: {seconds}s</div>
      <button onClick={startTimer}>Start</button>
      <button onClick={stopTimer}>Stop</button>
    </div>
  );
};
```

### Optimized Data Structures

```jsx
// ✅ Use Map for O(1) lookups
const UserManagement = () => {
  const [users] = useState([]);
  
  // Create lookup map for performance
  const userMap = useMemo(() => {
    return new Map(users.map(user => [user.id, user]));
  }, [users]);

  const getUserById = useCallback((id) => {
    return userMap.get(id);
  }, [userMap]);

  // Use Set for unique collections
  const [selectedUserIds, setSelectedUserIds] = useState(new Set());

  const toggleUserSelection = useCallback((userId) => {
    setSelectedUserIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  }, []);

  return (
    <div>
      {users.map(user => (
        <UserCard
          key={user.id}
          user={user}
          selected={selectedUserIds.has(user.id)}
          onToggleSelect={() => toggleUserSelection(user.id)}
        />
      ))}
    </div>
  );
};
```

## Network Optimization

### API Request Optimization

```jsx
// ✅ Request deduplication with TanStack Query
import { useQuery, useQueries } from '@tanstack/react-query';

const useUserData = (userId) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000)
  });
};

// ✅ Parallel requests
const Dashboard = () => {
  const queries = useQueries({
    queries: [
      {
        queryKey: ['user-stats'],
        queryFn: fetchUserStats,
        staleTime: 5 * 60 * 1000
      },
      {
        queryKey: ['system-stats'],
        queryFn: fetchSystemStats,
        staleTime: 1 * 60 * 1000
      },
      {
        queryKey: ['notifications'],
        queryFn: fetchNotifications,
        staleTime: 30 * 1000
      }
    ]
  });

  const [userStatsQuery, systemStatsQuery, notificationsQuery] = queries;

  if (queries.some(query => query.isLoading)) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <UserStats data={userStatsQuery.data} />
      <SystemStats data={systemStatsQuery.data} />
      <Notifications data={notificationsQuery.data} />
    </div>
  );
};

// ✅ Optimistic updates
const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateUser,
    onMutate: async (newUser) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['user', newUser.id]);

      // Snapshot previous value
      const previousUser = queryClient.getQueryData(['user', newUser.id]);

      // Optimistically update
      queryClient.setQueryData(['user', newUser.id], {
        ...previousUser,
        ...newUser
      });

      return { previousUser };
    },
    onError: (err, newUser, context) => {
      // Rollback on error
      queryClient.setQueryData(['user', newUser.id], context.previousUser);
    },
    onSettled: (data, error, variables) => {
      // Refetch after mutation
      queryClient.invalidateQueries(['user', variables.id]);
    }
  });
};
```

### Service Worker for Caching

```javascript
// public/sw.js - Service worker for caching
const CACHE_NAME = 'app-cache-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/api/user/profile'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Register service worker in main.jsx
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
```

## Monitoring & Measurement

### Performance Metrics

```jsx
// ✅ Core Web Vitals measurement
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const sendToAnalytics = (metric) => {
  // Send to your analytics service
  console.log(metric);
};

// Measure all Web Vitals
getCLS(sendToAnalytics);
getFID(sendToAnalytics);
getFCP(sendToAnalytics);
getLCP(sendToAnalytics);
getTTFB(sendToAnalytics);

// ✅ Custom performance measurements
const measureComponentRender = (componentName) => {
  return (WrappedComponent) => {
    return function MeasuredComponent(props) {
      useEffect(() => {
        const startTime = performance.now();
        
        return () => {
          const endTime = performance.now();
          console.log(`${componentName} render time: ${endTime - startTime}ms`);
        };
      });

      return <WrappedComponent {...props} />;
    };
  };
};

// Usage
const MeasuredUserList = measureComponentRender('UserList')(UserList);
```

### React DevTools Profiler

```jsx
// ✅ Profiler API for performance monitoring
import { Profiler } from 'react';

const onRenderCallback = (id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => {
  // Log performance metrics
  console.log(`Component ${id} took ${actualDuration}ms to ${phase}`);
  
  // Send to analytics in production
  if (process.env.NODE_ENV === 'production') {
    analytics.track('component_render', {
      componentId: id,
      phase,
      duration: actualDuration,
      baseDuration
    });
  }
};

const App = () => (
  <Profiler id="App" onRender={onRenderCallback}>
    <div className="app">
      <Profiler id="Header" onRender={onRenderCallback}>
        <Header />
      </Profiler>
      
      <Profiler id="MainContent" onRender={onRenderCallback}>
        <MainContent />
      </Profiler>
    </div>
  </Profiler>
);
```

### Bundle Size Monitoring

```javascript
// package.json scripts for monitoring
{
  "scripts": {
    "analyze": "npm run build && npx vite-bundle-analyzer dist",
    "size-limit": "size-limit",
    "size-check": "npm run build && bundlesize"
  },
  "size-limit": [
    {
      "path": "dist/assets/*.js",
      "limit": "100 KB"
    },
    {
      "path": "dist/assets/*.css",
      "limit": "20 KB"
    }
  ],
  "bundlesize": [
    {
      "path": "./dist/assets/*.js",
      "maxSize": "100kB",
      "compression": "gzip"
    }
  ]
}
```

## Performance Checklist

### Development Phase

- [ ] Use React.memo for expensive components
- [ ] Implement useMemo for expensive calculations
- [ ] Use useCallback for event handlers passed to children
- [ ] Split state into smaller pieces
- [ ] Implement virtual scrolling for large lists
- [ ] Add proper loading states and skeletons
- [ ] Optimize images with lazy loading
- [ ] Use proper font loading strategies

### Build Phase

- [ ] Configure code splitting by route and features
- [ ] Optimize bundle chunks with manual splitting
- [ ] Enable tree shaking
- [ ] Remove console logs in production
- [ ] Compress assets with gzip/brotli
- [ ] Analyze bundle size regularly
- [ ] Set up performance budgets

### Deployment Phase

- [ ] Enable CDN for static assets
- [ ] Configure proper caching headers
- [ ] Implement service worker for offline support
- [ ] Monitor Core Web Vitals
- [ ] Set up performance alerts
- [ ] Regular performance audits with Lighthouse

### Runtime Monitoring

- [ ] Track component render times
- [ ] Monitor memory usage patterns
- [ ] Measure API response times
- [ ] Track user interaction metrics
- [ ] Monitor error rates and performance impact
- [ ] Set up real user monitoring (RUM)

This comprehensive performance guide provides actionable strategies for optimizing React applications across all phases of development and deployment.