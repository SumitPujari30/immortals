'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextType extends AuthState {
  refreshUser: () => Promise<void>
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  signup: (email: string, password: string) => Promise<{ success: boolean; user?: User; message?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  const refreshUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me')
      const data = await response.json()
      setState({
        user: data.user,
        isLoading: false,
        isAuthenticated: !!data.user,
      })
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.error || 'Login failed' }
      }

      await refreshUser()
      return { success: true }
    } catch (error: any) {
      return { success: false, message: error.message || 'An unexpected error occurred' }
    }
  }, [refreshUser])

  const signup = useCallback(async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json()

      if (!response.ok) {
        return { success: false, message: data.error || 'Signup failed' }
      }

      // No need to refreshUser here as we usually redirect to OTP or verify next
      return { success: true, user: data.user }
    } catch (error: any) {
      return { success: false, message: error.message || 'An unexpected error occurred' }
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      })
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ ...state, refreshUser, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
