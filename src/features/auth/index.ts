// Public exports for auth feature

// Types
export type { 
    UserRole, 
    UserProfile, 
    AuthUser, 
    LoginCredentials, 
    RegisterCredentials,
    AuthStore as AuthStoreType
} from './types/auth.types'
export { getFullName } from './types/auth.types'

// Hooks
export { useAuth } from './hooks/useAuth'
export { usePermissions } from './hooks/usePermissions'
export type { Module, Action } from './hooks/usePermissions'

// Store
export { useAuthStore } from './store/auth-store'

// Service
export { authService, AuthService } from './services/auth-service'

// Components
export { default as LoginForm } from './components/LoginForm'
export { default as AuthInitializer } from './components/AuthInitializer'
export { default as AuthLoading } from './components/AuthLoading'
export { default as ProtectedRoute } from './components/ProtectedRoute'
export { RequirePermission } from './components/RequirePermission'
export { default as EditRoleModal } from './components/EditRoleModal'

// Roles hooks
export { useAllProfiles, useUserCountByRole, useUpdateUserRole, useSearchProfiles } from './hooks/useRoles'

// Roles service
export { rolesService } from './services/roles-service'
export type { ProfileWithEmail, RoleCount } from './services/roles-service'
