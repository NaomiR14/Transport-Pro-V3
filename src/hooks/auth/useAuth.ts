import { useAuthStore } from '@/store/auth-store'

export function useAuth() {
    const { 
        user, 
        profile, 
        isLoading, 
        error,
        signIn,
        signOut,
        refreshProfile 
    } = useAuthStore()

    return {
        user,
        profile,
        isLoading,
        error,
        isAuthenticated: !!user,
        signIn,
        signOut,
        refreshProfile,
    }
}