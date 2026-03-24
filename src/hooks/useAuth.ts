'use client'

/**
 * Authentication Hook
 * Nagar Seva Civic Portal - Supabase Version
 */

import { useAuthContext } from '@/context/AuthContext'
import type { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface UseAuthReturn extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signup: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const context = useAuthContext()
  
  return {
    user: context.user,
    isLoading: context.isLoading,
    isAuthenticated: context.isAuthenticated,
    login: context.login,
    signup: context.signup,
    logout: context.logout,
    refreshUser: context.refreshUser,
  }
}

export default useAuth
