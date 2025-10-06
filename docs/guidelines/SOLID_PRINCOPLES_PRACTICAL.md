# SOLID Principles in Practice: React + Redux Toolkit + TanStack Query + Axios

> Practical, code-only examples showing how to apply SOLID principles in a real React app using Redux Toolkit, TanStack Query, Axios, and React components.

---

## Single Responsibility Principle (SRP)

**Each module/class/component/hook should have one responsibility.**

```javascript
// src/services/api/user.api.js
import axios from 'axios';

export const userApi = {
  getUser: (id) => axios.get(`/api/users/${id}`),
  updateUser: (id, data) => axios.put(`/api/users/${id}`, data)
};

// src/services/query/user.query.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userApi } from '../api/user.api';

export const useUserQuery = (userId) =>
  useQuery(['user', userId], () => userApi.getUser(userId).then(res => res.data), { enabled: !!userId });

export const useUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({ id, ...data }) => userApi.updateUser(id, data).then(res => res.data),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['user', data.id]);
      }
    }
  );
};

// src/services/store/user.slice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { isEditing: false },
  reducers: {
    startEdit: (state) => { state.isEditing = true; },
    stopEdit: (state) => { state.isEditing = false; }
  }
});

export const { startEdit, stopEdit } = userSlice.actions;
export default userSlice.reducer;
```

---

## Open/Closed Principle (OCP)

**Modules should be open for extension, closed for modification.**

```javascript
// src/services/api/base.api.js
import axios from 'axios';

export const apiClient = axios.create({ baseURL: '/api' });

// src/services/api/user.api.js
import { apiClient } from './base.api';

export const userApi = {
  getUser: (id) => apiClient.get(`/users/${id}`),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data)
};

// src/services/api/admin.api.js (extension, no modification)
export const adminApi = {
  ...userApi,
  getAllUsers: () => apiClient.get('/admin/users')
};
```

---

## Liskov Substitution Principle (LSP)

**Derived modules/components should be substitutable for their base.**

```javascript
{% raw %}
// src/components/buttons/BaseButton.jsx
export const BaseButton = ({ children, ...props }) => (
  <button {...props}>{children}</button>
);

// src/components/buttons/PrimaryButton.jsx
import { BaseButton } from './BaseButton';

export const PrimaryButton = (props) => (
  <BaseButton {...props} style={{ background: 'blue', color: 'white' }} />
);

// Usage: <PrimaryButton onClick={...}>Save</PrimaryButton>
{% endraw %}
```

---

## Interface Segregation Principle (ISP)

**Clients should not be forced to depend on unused props or API.**

```javascript
// src/components/user/UserDisplay.jsx
export const UserDisplay = ({ user }) => (
  <div>
    <h2>{user.name}</h2>
    <p>{user.email}</p>
  </div>
);

// src/components/user/UserActions.jsx
export const UserActions = ({ onEdit, onDelete }) => (
  <div>
    <button onClick={onEdit}>Edit</button>
    <button onClick={onDelete}>Delete</button>
  </div>
);

// src/components/user/UserCard.jsx
import { UserDisplay } from './UserDisplay';
import { UserActions } from './UserActions';

export const UserCard = ({ user, onEdit, onDelete }) => (
  <div>
    <UserDisplay user={user} />
    <UserActions onEdit={onEdit} onDelete={onDelete} />
  </div>
);
```

---

## Dependency Inversion Principle (DIP)

**Depend on abstractions, not concretions.**

```javascript
// src/services/api/user.api.js
export const userApi = {
  getUser: (id) => axios.get(`/api/users/${id}`),
  updateUser: (id, data) => axios.put(`/api/users/${id}`, data)
};

// src/hooks/useUserService.hook.js
import { useMemo } from 'react';

export const useUserService = (api = userApi) => useMemo(() => api, [api]);

// src/components/user/UserProfile.jsx
import { useUserQuery, useUpdateUserMutation } from '../../services/query/user.query';
import { useUserService } from '../../hooks/useUserService.hook';

export const UserProfile = ({ userId, userApiOverride }) => {
  const userService = useUserService(userApiOverride);
  const { data: user, isLoading } = useUserQuery(userId, userService);
  const updateUser = useUpdateUserMutation(userService);

  if (isLoading) return <div>Loading...</div>;

  const handleSave = (updates) => updateUser.mutate({ id: userId, ...updates });

  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={() => handleSave({ name: 'New Name' })}>Save</button>
    </div>
  );
};
```

---

## Full Example: SOLID in a Real Feature

```javascript
// src/features/user-profile/UserProfileFeature.jsx
import { useSelector, useDispatch } from 'react-redux';
import { useUserQuery, useUpdateUserMutation } from '../../services/query/user.query';
import { startEdit, stopEdit } from '../../services/store/user.slice';
import { UserCard } from '../../components/user/UserCard';

export const UserProfileFeature = ({ userId }) => {
  const { data: user, isLoading } = useUserQuery(userId);
  const updateUser = useUpdateUserMutation();
  const isEditing = useSelector(state => state.user.isEditing);
  const dispatch = useDispatch();

  if (isLoading) return <div>Loading...</div>;

  const handleEdit = () => dispatch(startEdit());
  const handleDelete = () => {/* ... */};
  const handleSave = (updates) => {
    updateUser.mutate({ id: userId, ...updates }, { onSuccess: () => dispatch(stopEdit()) });
  };

  return (
    <div>
      <UserCard user={user} onEdit={handleEdit} onDelete={handleDelete} />
      {isEditing && (
        <form onSubmit={e => { e.preventDefault(); handleSave({ name: 'Updated' }); }}>
          <input defaultValue={user.name} />
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
};
```

---