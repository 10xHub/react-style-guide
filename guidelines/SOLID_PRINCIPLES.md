# SOLID Principles in React Development

> Applying SOLID principles to modern React development with JavaScript examples

## Table of Contents

1. [Introduction](#introduction)
2. [Single Responsibility Principle (SRP)](#single-responsibility-principle-srp)
3. [Open/Closed Principle (OCP)](#openclosed-principle-ocp)
4. [Liskov Substitution Principle (LSP)](#liskov-substitution-principle-lsp)
5. [Interface Segregation Principle (ISP)](#interface-segregation-principle-isp)
6. [Dependency Inversion Principle (DIP)](#dependency-inversion-principle-dip)
7. [Practical Examples](#practical-examples)
8. [Common Anti-Patterns](#common-anti-patterns)

## Introduction

SOLID principles, originally designed for object-oriented programming, can be effectively applied to React development to create more maintainable, testable, and scalable applications. This guide demonstrates how to implement each principle in modern React with JavaScript.

### Benefits of SOLID in React

- **Maintainability**: Easier to modify and extend components
- **Testability**: Components are easier to unit test
- **Reusability**: Components can be reused across different contexts
- **Scalability**: Applications remain manageable as they grow
- **Debugging**: Isolated responsibilities make debugging simpler

## Single Responsibility Principle (SRP)

> A component should have only one reason to change

### ❌ Violating SRP

```jsx
// Bad: Component doing too much
const UserDashboard = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  // Data fetching logic
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [userData, userPosts, userNotifications] = await Promise.all([
          fetchUser(userId),
          fetchUserPosts(userId),
          fetchUserNotifications(userId)
        ]);
        setUser(userData);
        setPosts(userPosts);
        setNotifications(userNotifications);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [userId]);
  
  // Form handling logic
  const handleEdit = () => {
    setIsEditing(true);
    setEditData(user);
  };
  
  const handleSave = async () => {
    try {
      const updatedUser = await updateUser(userId, editData);
      setUser(updatedUser);
      setIsEditing(false);
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Notification logic
  const markNotificationRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      setError(err.message);
    }
  };
  
  // Complex rendering logic
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div className="dashboard">
      {/* User profile section */}
      <div className="profile-section">
        {isEditing ? (
          <form onSubmit={handleSave}>
            <input 
              value={editData.name} 
              onChange={(e) => setEditData({...editData, name: e.target.value})}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </form>
        ) : (
          <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <button onClick={handleEdit}>Edit</button>
          </div>
        )}
      </div>
      
      {/* Posts section */}
      <div className="posts-section">
        <h2>Recent Posts</h2>
        {posts.map(post => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content}</p>
          </div>
        ))}
      </div>
      
      {/* Notifications section */}
      <div className="notifications-section">
        <h2>Notifications</h2>
        {notifications.map(notification => (
          <div 
            key={notification.id} 
            className={notification.read ? 'read' : 'unread'}
            onClick={() => markNotificationRead(notification.id)}
          >
            {notification.message}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### ✅ Following SRP

```jsx
// Good: Separated responsibilities

// 1. Data fetching responsibility
const useUserData = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await getUserById(userId);
        setUser(userData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
  }, [userId]);
  
  return { user, loading, error, setUser };
};

// 2. User editing responsibility
const useUserEditor = (user) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  
  const startEdit = () => {
    setIsEditing(true);
    setEditData(user);
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({});
  };
  
  const saveEdit = async () => {
    const updatedUser = await updateUser(user.id, editData);
    setIsEditing(false);
    return updatedUser;
  };
  
  return {
    isEditing,
    editData,
    setEditData,
    startEdit,
    cancelEdit,
    saveEdit
  };
};

// 3. User profile display responsibility
const UserProfile = ({ user, onEdit }) => (
  <div className="user-profile">
    <img src={user.avatar} alt={user.name} />
    <h1>{user.name}</h1>
    <p>{user.email}</p>
    <p>Role: {user.role}</p>
    <button onClick={onEdit}>Edit Profile</button>
  </div>
);

// 4. User editing form responsibility
const UserEditForm = ({ user, editData, setEditData, onSave, onCancel }) => (
  <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
    <input
      value={editData.name}
      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
      placeholder="Name"
    />
    <input
      value={editData.email}
      onChange={(e) => setEditData({ ...editData, email: e.target.value })}
      placeholder="Email"
    />
    <button type="submit">Save</button>
    <button type="button" onClick={onCancel}>Cancel</button>
  </form>
);

// 5. Posts display responsibility
const UserPosts = ({ userId }) => {
  const [posts, setPosts] = useState([]);
  
  useEffect(() => {
    fetchUserPosts(userId).then(setPosts);
  }, [userId]);
  
  return (
    <div className="user-posts">
      <h2>Recent Posts</h2>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

// 6. Main dashboard orchestration responsibility
const UserDashboard = ({ userId }) => {
  const { user, loading, error, setUser } = useUserData(userId);
  const userEditor = useUserEditor(user);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!user) return <div>User not found</div>;
  
  const handleSave = async () => {
    const updatedUser = await userEditor.saveEdit();
    setUser(updatedUser);
  };
  
  return (
    <div className="dashboard">
      {userEditor.isEditing ? (
        <UserEditForm
          user={user}
          editData={userEditor.editData}
          setEditData={userEditor.setEditData}
          onSave={handleSave}
          onCancel={userEditor.cancelEdit}
        />
      ) : (
        <UserProfile user={user} onEdit={userEditor.startEdit} />
      )}
      
      <UserPosts userId={userId} />
      <UserNotifications userId={userId} />
    </div>
  );
};
```

### SRP in Custom Hooks

```jsx
// Bad: Hook doing too much
const useUserManagement = (userId) => {
  // User data
  const [user, setUser] = useState(null);
  // Posts data
  const [posts, setPosts] = useState([]);
  // UI state
  const [isEditing, setIsEditing] = useState(false);
  // Form state
  const [editData, setEditData] = useState({});
  // Loading states
  const [loading, setLoading] = useState(true);
  
  // ... all the logic mixed together
};

// Good: Separate hooks for separate concerns
const useUserData = (userId) => {
  // Only user data fetching logic
};

const useUserPosts = (userId) => {
  // Only posts fetching logic
};

const useEditMode = () => {
  // Only editing state logic
};

const useFormData = (initialData) => {
  // Only form data management
};
```

## Open/Closed Principle (OCP)

> Components should be open for extension but closed for modification

### ✅ Extensible Component Design

```jsx
// Base button component - closed for modification
const Button = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  loading = false,
  icon,
  className = '',
  ...restProps 
}) => {
  const baseClass = 'btn';
  const variantClass = `btn--${variant}`;
  const sizeClass = `btn--${size}`;
  const combinedClass = `${baseClass} ${variantClass} ${sizeClass} ${className}`;
  
  return (
    <button
      className={combinedClass}
      onClick={onClick}
      disabled={disabled || loading}
      {...restProps}
    >
      {icon && <span className="btn__icon">{icon}</span>}
      {loading ? <Spinner /> : children}
    </button>
  );
};

// Extensions - open for extension
const PrimaryButton = (props) => (
  <Button variant="primary" {...props} />
);

const SecondaryButton = (props) => (
  <Button variant="secondary" {...props} />
);

const DangerButton = (props) => (
  <Button variant="danger" {...props} />
);

const IconButton = ({ icon, ...props }) => (
  <Button icon={icon} {...props} />
);

const LoadingButton = ({ loading, children, ...props }) => (
  <Button loading={loading} {...props}>
    {loading ? 'Loading...' : children}
  </Button>
);

// Compound extension
const ConfirmButton = ({ onConfirm, confirmMessage, children, ...props }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleClick = () => {
    if (showConfirm) {
      onConfirm();
      setShowConfirm(false);
    } else {
      setShowConfirm(true);
    }
  };
  
  return (
    <Button onClick={handleClick} {...props}>
      {showConfirm ? confirmMessage : children}
    </Button>
  );
};
```

### Extensible Hook Patterns

```jsx
// Base hook - closed for modification
const useApiRequest = (config = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const execute = useCallback(async (requestConfig = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiClient.request({
        ...config,
        ...requestConfig
      });
      
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [config]);
  
  return { data, loading, error, execute };
};

// Extensions - open for extension
const useGetRequest = (url, options = {}) => {
  return useApiRequest({
    method: 'GET',
    url,
    ...options
  });
};

const usePostRequest = (url, options = {}) => {
  return useApiRequest({
    method: 'POST',
    url,
    ...options
  });
};

const usePaginatedRequest = (url, options = {}) => {
  const baseHook = useApiRequest({ method: 'GET', url, ...options });
  const [page, setPage] = useState(1);
  const [allData, setAllData] = useState([]);
  
  const loadPage = useCallback(async (pageNumber) => {
    const data = await baseHook.execute({ 
      params: { page: pageNumber, ...options.params }
    });
    
    if (pageNumber === 1) {
      setAllData(data.items);
    } else {
      setAllData(prev => [...prev, ...data.items]);
    }
    
    return data;
  }, [baseHook, options.params]);
  
  return {
    ...baseHook,
    page,
    setPage,
    allData,
    loadPage,
    loadMore: () => loadPage(page + 1)
  };
};
```

### Plugin Architecture

```jsx
// Base form component
const Form = ({ children, onSubmit, validation, plugins = [] }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  
  // Apply plugins
  const enhancedFormData = plugins.reduce((data, plugin) => {
    return plugin.enhanceData ? plugin.enhanceData(data) : data;
  }, formData);
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Run plugin validations
    const pluginErrors = {};
    for (const plugin of plugins) {
      if (plugin.validate) {
        const pluginValidationErrors = await plugin.validate(enhancedFormData);
        Object.assign(pluginErrors, pluginValidationErrors);
      }
    }
    
    if (Object.keys(pluginErrors).length > 0) {
      setErrors(pluginErrors);
      return;
    }
    
    onSubmit(enhancedFormData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {children}
      {/* Render plugin components */}
      {plugins.map((plugin, index) => (
        plugin.Component ? (
          <plugin.Component 
            key={index}
            formData={enhancedFormData}
            setFormData={setFormData}
            errors={errors}
          />
        ) : null
      ))}
    </form>
  );
};

// Plugins
const autoSavePlugin = {
  enhanceData: (data) => ({ ...data, autoSaved: true }),
  validate: async (data) => ({}),
  Component: ({ formData }) => {
    useEffect(() => {
      const timer = setInterval(() => {
        localStorage.setItem('formData', JSON.stringify(formData));
      }, 5000);
      
      return () => clearInterval(timer);
    }, [formData]);
    
    return <div className="auto-save-indicator">Auto-saving...</div>;
  }
};

const confirmationPlugin = {
  validate: async (data) => {
    const confirmed = window.confirm('Are you sure you want to submit?');
    return confirmed ? {} : { confirmation: 'Please confirm submission' };
  }
};

// Usage
const UserForm = () => (
  <Form 
    plugins={[autoSavePlugin, confirmationPlugin]}
    onSubmit={handleSubmit}
  >
    <input name="name" />
    <input name="email" />
    <button type="submit">Submit</button>
  </Form>
);
```

## Liskov Substitution Principle (LSP)

> Derived components must be substitutable for their base components

### ✅ Substitutable Components

```jsx
// Base interface (implicit in JavaScript)
const BaseButtonInterface = {
  // All button variants must accept these props
  children: 'ReactNode',
  onClick: 'function',
  disabled: 'boolean',
  className: 'string'
};

// Base button implementation
const BaseButton = ({ children, onClick, disabled = false, className = '' }) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    className={`btn ${className}`}
  >
    {children}
  </button>
);

// All these components are substitutable for BaseButton
const PrimaryButton = ({ children, onClick, disabled, className = '' }) => (
  <BaseButton 
    onClick={onClick}
    disabled={disabled}
    className={`btn-primary ${className}`}
  >
    {children}
  </BaseButton>
);

const SecondaryButton = ({ children, onClick, disabled, className = '' }) => (
  <BaseButton 
    onClick={onClick}
    disabled={disabled}
    className={`btn-secondary ${className}`}
  >
    {children}
  </BaseButton>
);

const IconButton = ({ children, onClick, disabled, className = '', icon }) => (
  <BaseButton 
    onClick={onClick}
    disabled={disabled}
    className={`btn-icon ${className}`}
  >
    {icon && <span className="icon">{icon}</span>}
    {children}
  </BaseButton>
);

// ✅ All these can be used interchangeably
const ActionBar = ({ primaryAction, secondaryAction, iconAction }) => (
  <div className="action-bar">
    <PrimaryButton onClick={primaryAction.onClick}>
      {primaryAction.label}
    </PrimaryButton>
    
    <SecondaryButton onClick={secondaryAction.onClick}>
      {secondaryAction.label}
    </SecondaryButton>
    
    <IconButton onClick={iconAction.onClick} icon={iconAction.icon}>
      {iconAction.label}
    </IconButton>
  </div>
);

// Test substitutability
const TestButtonSubstitution = () => {
  const actions = {
    onClick: () => console.log('clicked'),
    children: 'Click me'
  };
  
  // All should work identically
  return (
    <div>
      <BaseButton {...actions} />
      <PrimaryButton {...actions} />
      <SecondaryButton {...actions} />
      <IconButton {...actions} icon="🚀" />
    </div>
  );
};
```

### ❌ Violating LSP

```jsx
// Bad: Breaking the interface contract
const ProblematicButton = ({ children, onClick, disabled, className }) => {
  // ❌ Changes expected behavior - throws error instead of handling disabled state
  if (disabled) {
    throw new Error('This button cannot be disabled');
  }
  
  // ❌ Requires additional props not in base interface
  if (!children || children.length < 3) {
    throw new Error('Children must be at least 3 characters');
  }
  
  return <button onClick={onClick} className={className}>{children}</button>;
};

// ❌ Cannot substitute ProblematicButton for BaseButton
const BrokenActionBar = () => (
  <div>
    <BaseButton disabled>Base Button</BaseButton> {/* ✅ Works */}
    <ProblematicButton disabled>Problematic</ProblematicButton> {/* ❌ Throws error */}
  </div>
);
```

### Substitutable Hook Pattern

```jsx
// Base data fetching hook interface
const useBaseDataFetcher = (config) => {
  // Contract: return { data, loading, error, refetch }
};

// All implementations must follow the same contract
const useUserData = (userId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const userData = await fetchUser(userId);
      setData(userData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);
  
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  return { data, loading, error, refetch };
};

const usePostData = (postId) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const refetch = useCallback(async () => {
    try {
      setLoading(true);
      const postData = await fetchPost(postId);
      setData(postData);
      setError(null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [postId]);
  
  useEffect(() => {
    refetch();
  }, [refetch]);
  
  return { data, loading, error, refetch };
};

// ✅ Both hooks are substitutable
const DataDisplay = ({ dataHook }) => {
  const { data, loading, error, refetch } = dataHook;
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <button onClick={refetch}>Refresh</button>
    </div>
  );
};

// Usage - both work identically
const UserDisplay = ({ userId }) => (
  <DataDisplay dataHook={useUserData(userId)} />
);

const PostDisplay = ({ postId }) => (
  <DataDisplay dataHook={usePostData(postId)} />
);
```

## Interface Segregation Principle (ISP)

> Components shouldn't depend on props they don't use

### ❌ Fat Interface (Violating ISP)

```jsx
// Bad: Monolithic prop interface
const UserComponent = ({
  // Display props
  user,
  showAvatar,
  showEmail,
  showRole,
  
  // Action props
  onEdit,
  onDelete,
  onView,
  onShare,
  onBlock,
  onUnblock,
  
  // UI props
  variant,
  size,
  className,
  
  // Admin props
  showAdminActions,
  onPromote,
  onDemote,
  onAudit,
  
  // Permission props
  canEdit,
  canDelete,
  canView,
  canShare,
  canPromote,
  canAudit
}) => {
  // Component forced to handle all possible concerns
  return (
    <div className={`user-component ${variant} ${size} ${className}`}>
      {/* Display section */}
      {showAvatar && <img src={user.avatar} alt={user.name} />}
      <h3>{user.name}</h3>
      {showEmail && <p>{user.email}</p>}
      {showRole && <span>{user.role}</span>}
      
      {/* Actions section */}
      <div className="actions">
        {canView && <button onClick={onView}>View</button>}
        {canEdit && <button onClick={onEdit}>Edit</button>}
        {canDelete && <button onClick={onDelete}>Delete</button>}
        {canShare && <button onClick={onShare}>Share</button>}
        <button onClick={onBlock}>Block</button>
        <button onClick={onUnblock}>Unblock</button>
      </div>
      
      {/* Admin section */}
      {showAdminActions && (
        <div className="admin-actions">
          {canPromote && <button onClick={onPromote}>Promote</button>}
          <button onClick={onDemote}>Demote</button>
          {canAudit && <button onClick={onAudit}>Audit</button>}
        </div>
      )}
    </div>
  );
};
```

### ✅ Segregated Interfaces

```jsx
// Good: Segregated interfaces

// 1. Display interface - only display concerns
const UserDisplay = ({ 
  user, 
  showAvatar = true, 
  showEmail = true, 
  showRole = true,
  variant = 'default'
}) => (
  <div className={`user-display user-display--${variant}`}>
    {showAvatar && (
      <img 
        src={user.avatar} 
        alt={`${user.name} avatar`}
        className="user-display__avatar"
      />
    )}
    <div className="user-display__info">
      <h3 className="user-display__name">{user.name}</h3>
      {showEmail && <p className="user-display__email">{user.email}</p>}
      {showRole && <span className="user-display__role">{user.role}</span>}
    </div>
  </div>
);

// 2. Actions interface - only action concerns
const UserActions = ({ 
  user,
  onEdit,
  onDelete,
  onView,
  onShare
}) => (
  <div className="user-actions">
    {onView && <button onClick={() => onView(user)}>View</button>}
    {onEdit && <button onClick={() => onEdit(user)}>Edit</button>}
    {onDelete && <button onClick={() => onDelete(user.id)}>Delete</button>}
    {onShare && <button onClick={() => onShare(user)}>Share</button>}
  </div>
);

// 3. Admin interface - only admin concerns
const UserAdminActions = ({ 
  user,
  onPromote,
  onDemote,
  onAudit,
  onBlock,
  onUnblock
}) => (
  <div className="user-admin-actions">
    {onPromote && <button onClick={() => onPromote(user.id)}>Promote</button>}
    {onDemote && <button onClick={() => onDemote(user.id)}>Demote</button>}
    {onAudit && <button onClick={() => onAudit(user.id)}>Audit</button>}
    {onBlock && <button onClick={() => onBlock(user.id)}>Block</button>}
    {onUnblock && <button onClick={() => onUnblock(user.id)}>Unblock</button>}
  </div>
);

// 4. Composition component - combines interfaces as needed
const UserCard = ({ 
  user, 
  displayOptions = {},
  actions = {},
  adminActions = {},
  showAdminActions = false
}) => (
  <div className="user-card">
    <UserDisplay user={user} {...displayOptions} />
    <UserActions user={user} {...actions} />
    {showAdminActions && (
      <UserAdminActions user={user} {...adminActions} />
    )}
  </div>
);

// Usage - clients only provide what they need
const SimpleUserList = ({ users }) => (
  <div>
    {users.map(user => (
      <UserCard 
        key={user.id}
        user={user}
        displayOptions={{ showRole: false }}
        actions={{ onView: handleUserView }}
      />
    ))}
  </div>
);

const AdminUserList = ({ users }) => (
  <div>
    {users.map(user => (
      <UserCard 
        key={user.id}
        user={user}
        actions={{ 
          onEdit: handleEdit,
          onDelete: handleDelete 
        }}
        adminActions={{
          onPromote: handlePromote,
          onAudit: handleAudit
        }}
        showAdminActions={true}
      />
    ))}
  </div>
);
```

### Hook Interface Segregation

```jsx
// Bad: Fat hook interface
const useUserManagement = (userId) => {
  // Returns everything, even if not needed
  return {
    // Data
    user,
    loading,
    error,
    
    // CRUD operations
    updateUser,
    deleteUser,
    
    // UI state
    isEditing,
    setIsEditing,
    editData,
    setEditData,
    
    // Admin operations
    promoteUser,
    demoteUser,
    auditUser,
    
    // Permissions
    permissions,
    canEdit,
    canDelete,
    canPromote
  };
};

// Good: Segregated hook interfaces
const useUserData = (userId) => ({
  user,
  loading,
  error,
  refetch
});

const useUserEditor = (user) => ({
  isEditing,
  editData,
  setEditData,
  startEdit,
  cancelEdit,
  saveEdit
});

const useUserPermissions = (user) => ({
  permissions,
  canEdit,
  canDelete,
  canView,
  hasPermission
});

const useUserAdminActions = (user) => ({
  promoteUser,
  demoteUser,
  auditUser,
  blockUser
});

// Clients can pick only what they need
const UserProfile = ({ userId }) => {
  const { user, loading, error } = useUserData(userId);
  const { isEditing, startEdit, cancelEdit } = useUserEditor(user);
  const { canEdit } = useUserPermissions(user);
  
  // Only uses what it needs
};

const AdminPanel = ({ userId }) => {
  const { user } = useUserData(userId);
  const { promoteUser, auditUser } = useUserAdminActions(user);
  const { canPromote, canAudit } = useUserPermissions(user);
  
  // Only uses admin-specific functionality
};
```

## Dependency Inversion Principle (DIP)

> Depend on abstractions, not concretions

### ❌ Depending on Concretions

```jsx
// Bad: Tightly coupled to specific implementations
const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Directly depending on axios
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch users:', error);
        setLoading(false);
      });
  }, []);
  
  const handleDelete = async (userId) => {
    // Directly depending on axios
    try {
      await axios.delete(`/api/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };
  
  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        users.map(user => (
          <div key={user.id}>
            {user.name}
            <button onClick={() => handleDelete(user.id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
};
```

### ✅ Depending on Abstractions

```jsx
// Good: Define abstractions (interfaces)

// 1. Abstract service interface
const createUserService = (httpClient) => ({
  async getUsers() {
    const response = await httpClient.get('/users');
    return response.data;
  },
  
  async getUserById(id) {
    const response = await httpClient.get(`/users/${id}`);
    return response.data;
  },
  
  async createUser(userData) {
    const response = await httpClient.post('/users', userData);
    return response.data;
  },
  
  async updateUser(id, userData) {
    const response = await httpClient.put(`/users/${id}`, userData);
    return response.data;
  },
  
  async deleteUser(id) {
    await httpClient.delete(`/users/${id}`);
  }
});

// 2. HTTP client abstraction
const createHttpClient = (baseURL, options = {}) => ({
  async get(url, config = {}) {
    // Implementation can be axios, fetch, or any other client
    return axios.get(`${baseURL}${url}`, { ...options, ...config });
  },
  
  async post(url, data, config = {}) {
    return axios.post(`${baseURL}${url}`, data, { ...options, ...config });
  },
  
  async put(url, data, config = {}) {
    return axios.put(`${baseURL}${url}`, data, { ...options, ...config });
  },
  
  async delete(url, config = {}) {
    return axios.delete(`${baseURL}${url}`, { ...options, ...config });
  }
});

// 3. Hook that depends on abstraction
const useUsers = (userService) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await userService.getUsers();
      setUsers(userData);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userService]);
  
  const deleteUser = useCallback(async (userId) => {
    try {
      await userService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (err) {
      setError(err);
    }
  }, [userService]);
  
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    deleteUser
  };
};

// 4. Component depends on abstraction
const UserList = ({ userService }) => {
  const { users, loading, error, deleteUser } = useUsers(userService);
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  
  return (
    <div className="user-list">
      {users.map(user => (
        <UserCard 
          key={user.id} 
          user={user}
          onDelete={() => deleteUser(user.id)}
        />
      ))}
    </div>
  );
};

// 5. Dependency injection at app level
const App = () => {
  // Create concrete implementations
  const httpClient = createHttpClient('/api');
  const userService = createUserService(httpClient);
  
  return (
    <div className="app">
      <UserList userService={userService} />
    </div>
  );
};
```

### Context-based Dependency Injection

```jsx
// Service context for dependency injection
const ServiceContext = createContext();

const ServiceProvider = ({ children }) => {
  const httpClient = useMemo(() => createHttpClient('/api'), []);
  const userService = useMemo(() => createUserService(httpClient), [httpClient]);
  const postService = useMemo(() => createPostService(httpClient), [httpClient]);
  
  const services = {
    userService,
    postService,
    httpClient
  };
  
  return (
    <ServiceContext.Provider value={services}>
      {children}
    </ServiceContext.Provider>
  );
};

// Hook to access services
const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within ServiceProvider');
  }
  return context;
};

// Components use injected dependencies
const UserList = () => {
  const { userService } = useServices();
  const { users, loading, deleteUser } = useUsers(userService);
  
  // Component logic remains the same
  return (
    <div>
      {users.map(user => (
        <UserCard key={user.id} user={user} onDelete={deleteUser} />
      ))}
    </div>
  );
};

// Easy to test with mock services
const TestApp = () => {
  const mockUserService = {
    getUsers: () => Promise.resolve([{ id: '1', name: 'Test User' }]),
    deleteUser: () => Promise.resolve()
  };
  
  return (
    <ServiceContext.Provider value={{ userService: mockUserService }}>
      <UserList />
    </ServiceContext.Provider>
  );
};
```

## Practical Examples

### SOLID File Upload Component

```jsx
// Single Responsibility: File validation
const useFileValidator = (rules = {}) => {
  const validateFile = useCallback((file) => {
    const errors = [];
    
    if (rules.maxSize && file.size > rules.maxSize) {
      errors.push(`File size must be less than ${rules.maxSize} bytes`);
    }
    
    if (rules.allowedTypes && !rules.allowedTypes.includes(file.type)) {
      errors.push(`File type ${file.type} is not allowed`);
    }
    
    if (rules.maxNameLength && file.name.length > rules.maxNameLength) {
      errors.push(`File name is too long`);
    }
    
    return errors;
  }, [rules]);
  
  return { validateFile };
};

// Single Responsibility: File upload
const useFileUploader = (uploadService) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const uploadFile = useCallback(async (file, options = {}) => {
    setUploading(true);
    setProgress(0);
    
    try {
      const result = await uploadService.upload(file, {
        onProgress: setProgress,
        ...options
      });
      return result;
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }, [uploadService]);
  
  return { uploadFile, uploading, progress };
};

// Open/Closed: Extensible file display
const FileDisplay = ({ 
  file, 
  variant = 'default',
  showSize = true,
  showType = true,
  className = '',
  children
}) => (
  <div className={`file-display file-display--${variant} ${className}`}>
    <div className="file-display__icon">
      📎
    </div>
    <div className="file-display__info">
      <span className="file-display__name">{file.name}</span>
      {showSize && (
        <span className="file-display__size">
          {(file.size / 1024).toFixed(2)} KB
        </span>
      )}
      {showType && (
        <span className="file-display__type">{file.type}</span>
      )}
    </div>
    {children}
  </div>
);

// Interface Segregation: Separate concerns
const FileActions = ({ file, onRemove, onDownload, onPreview }) => (
  <div className="file-actions">
    {onPreview && (
      <button onClick={() => onPreview(file)}>Preview</button>
    )}
    {onDownload && (
      <button onClick={() => onDownload(file)}>Download</button>
    )}
    {onRemove && (
      <button onClick={() => onRemove(file)}>Remove</button>
    )}
  </div>
);

// Dependency Inversion: Inject upload service
const FileUpload = ({ 
  uploadService,
  validationRules = {},
  onUploadComplete,
  onError
}) => {
  const [files, setFiles] = useState([]);
  const { validateFile } = useFileValidator(validationRules);
  const { uploadFile, uploading, progress } = useFileUploader(uploadService);
  
  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    
    const validFiles = selectedFiles.filter(file => {
      const errors = validateFile(file);
      if (errors.length > 0) {
        onError?.(new Error(errors.join(', ')));
        return false;
      }
      return true;
    });
    
    setFiles(prev => [...prev, ...validFiles]);
  };
  
  const handleUpload = async () => {
    try {
      const uploadPromises = files.map(file => uploadFile(file));
      const results = await Promise.all(uploadPromises);
      onUploadComplete?.(results);
      setFiles([]);
    } catch (error) {
      onError?.(error);
    }
  };
  
  const removeFile = (fileToRemove) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
  };
  
  return (
    <div className="file-upload">
      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        disabled={uploading}
      />
      
      <div className="file-list">
        {files.map((file, index) => (
          <FileDisplay key={index} file={file}>
            <FileActions 
              file={file}
              onRemove={() => removeFile(file)}
            />
          </FileDisplay>
        ))}
      </div>
      
      {files.length > 0 && (
        <button 
          onClick={handleUpload}
          disabled={uploading}
        >
          {uploading ? `Uploading ${progress}%` : 'Upload Files'}
        </button>
      )}
    </div>
  );
};
```

## Common Anti-Patterns

### Anti-Pattern: God Component

```jsx
// ❌ Bad: Component trying to do everything
const Dashboard = () => {
  // User management state
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userFormData, setUserFormData] = useState({});
  const [userErrors, setUserErrors] = useState({});
  
  // Post management state
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postFormData, setPostFormData] = useState({});
  
  // Analytics state
  const [analytics, setAnalytics] = useState({});
  const [charts, setCharts] = useState([]);
  
  // UI state
  const [activeTab, setActiveTab] = useState('users');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Hundreds of lines of mixed logic...
  
  return (
    <div>
      {/* Complex rendering logic mixing all concerns */}
    </div>
  );
};

// ✅ Good: Separated components
const Dashboard = () => (
  <div className="dashboard">
    <DashboardSidebar />
    <DashboardContent />
    <NotificationCenter />
  </div>
);

const DashboardContent = () => {
  const [activeTab, setActiveTab] = useState('users');
  
  return (
    <div className="dashboard-content">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'users' && <UserManagement />}
      {activeTab === 'posts' && <PostManagement />}
      {activeTab === 'analytics' && <Analytics />}
    </div>
  );
};
```

### Anti-Pattern: Prop Drilling

```jsx
// ❌ Bad: Deep prop drilling
const App = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  
  return (
    <Layout user={user} theme={theme} setTheme={setTheme}>
      <Dashboard user={user} theme={theme} />
    </Layout>
  );
};

const Layout = ({ user, theme, setTheme, children }) => (
  <div className={`layout layout--${theme}`}>
    <Header user={user} theme={theme} setTheme={setTheme} />
    {children}
  </div>
);

const Header = ({ user, theme, setTheme }) => (
  <header>
    <UserProfile user={user} />
    <ThemeToggle theme={theme} setTheme={setTheme} />
  </header>
);

// ✅ Good: Context-based solution
const UserContext = createContext();
const ThemeContext = createContext();

const App = () => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Layout>
          <Dashboard />
        </Layout>
      </ThemeContext.Provider>
    </UserContext.Provider>
  );
};

const Header = () => {
  const { user } = useContext(UserContext);
  const { theme, setTheme } = useContext(ThemeContext);
  
  return (
    <header>
      <UserProfile user={user} />
      <ThemeToggle theme={theme} setTheme={setTheme} />
    </header>
  );
};
```

---

By following these SOLID principles in React development, you'll create more maintainable, testable, and scalable applications. Each principle contributes to better separation of concerns and more flexible architecture.