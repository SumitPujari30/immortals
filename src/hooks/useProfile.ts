'use client'

/**
 * React Query Hooks for Profiles
 * Nagar Seva Civic Portal - Supabase Version
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profilesDb, type Profile } from '@/lib/db'

export const profileKeys = {
  all: ['profiles'] as const,
  byUserId: (userId: string) => [...profileKeys.all, 'user', userId] as const,
  byId: (id: string) => [...profileKeys.all, 'id', id] as const,
  list: (filters?: Record<string, unknown>) =>
    [...profileKeys.all, 'list', filters] as const,
}

export function useUserProfile(userId: string | undefined) {
  return useQuery({
    queryKey: profileKeys.byUserId(userId || ''),
    queryFn: () => {
      if (!userId) return null
      return profilesDb.getByUserId(userId)
    },
    enabled: !!userId,
  })
}

export function useProfileById(id: string | undefined) {
  return useQuery({
    queryKey: profileKeys.byId(id || ''),
    queryFn: () => {
      if (!id) return null
      return profilesDb.getById(id)
    },
    enabled: !!id,
  })
}

export function useProfileList(options?: {
  limit?: number
  offset?: number
  city?: string
  role?: string
}) {
  return useQuery({
    queryKey: profileKeys.list(options),
    queryFn: () => profilesDb.list(options),
  })
}

export function useCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: {
      user_id: string
      full_name: string
      phone?: string
      address?: string
      city?: string
      pincode?: string
      role?: 'citizen' | 'volunteer' | 'admin'
      gov_id_type?: string
      gov_id_url?: string
    }) => profilesDb.create(data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.byUserId(result.user_id),
      })
    },
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: Partial<{
        full_name: string
        phone: string
        address: string
        city: string
        pincode: string
        role: 'citizen' | 'volunteer' | 'admin'
        gov_id_type: string
        gov_id_url: string
        is_on_duty: boolean
      }>
    }) => profilesDb.update(id, data),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.byUserId(result.user_id),
      })
      queryClient.invalidateQueries({
        queryKey: profileKeys.byId(result.id),
      })
    },
  })
}

export function useGetOrCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      userId,
      fullName,
    }: {
      userId: string
      fullName: string
    }) => profilesDb.getOrCreate(userId, fullName),
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.byUserId(result.user_id),
      })
    },
  })
}
