# Role-Based Access Control (RBAC) Guideline

This document outlines the security architecture and permission management for the ARCHICOPRO Extranet.

## 1. Role Definitions

| Role | Key (`UserRole`) | Description |
| :--- | :--- | :--- |
| **Admin** | `admin` | Full system access. Manages members, configurations, and all high-level content. |
| **Moderator** | `moderator` | Content oversight. Manages community discussions, article reviews, and reports. |
| **Member** | `membre` | Standard user. Can interact with the community and access shared resources. |

---

## 2. Permissions Matrix

| Feature / Page | Member | Moderator | Admin |
| :--- | :---: | :---: | :---: |
| **Dashboard** | View | View | View |
| **Members Directory** | - | - | Full Access |
| **Forums: Read/Reply** | Yes | Yes | Yes |
| **Forums: Create Topic** | - | Yes | Yes |
| **Forums: Create Forum / Pin** | - | - | Yes |
| **Articles: Read** | Yes | Yes | Yes |
| **Articles: Write/Review** | - | Yes | Yes |
| **Articles: Manage Categories** | - | - | Yes |
| **Calendar: Create/Delete** | - | - | Yes |
| **Certifications: Propose** | - | - | Yes |
| **Moderation Center** | - | Yes | Yes |
| **Admin Panel** | - | - | Yes |

---

## 3. Implementation Patterns

### A. Component-Level Logic
To show or hide UI elements based on roles, use the `useSelector` hook from Redux.

```tsx
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { UserRole } from '../types';

export function MyComponent() {
  const { user } = useSelector((state: RootState) => state.auth);
  
  const isAdmin = user?.role === UserRole.ADMIN;
  const isModerator = user?.role === UserRole.MODERATOR;

  return (
    <div>
      {/* Admin only button */}
      {isAdmin && <button>Delete Content</button>}
      
      {/* Admin or Moderator button */}
      {(isAdmin || isModerator) && <button>Edit Content</button>}
    </div>
  );
}
```

### B. Navigation Guard (Sidebar)
Navigation items are filtered dynamically in `DashboardLayout.tsx`.

```tsx
if (isAdmin) {
  navItems.push({ name: 'Administration', path: '/admin', icon: Settings });
}
```

### C. Page-Level Protection
Sensitive pages include an internal check to prevent direct URL access.

```tsx
const isAuthorized = user?.role === UserRole.ADMIN || user?.role === UserRole.MODERATOR;

if (!isAuthorized) {
  return <Navigate to="/" replace />;
}
```

---

## 4. Best Practices

1. **Prioritize Redux State**: Always use the role from the `auth` slice as the source of truth.
2. **Fail-Safe Design**: Default to the most restrictive access if a user's role is unknown or undefined.
3. **Double Verification**: Remember that frontend RBAC is for **User Experience**. Critical actions must also be verified on the **Backend API**.
4. **Consistency**: Use the `UserRole` enum instead of hardcoded strings to prevent typos.
