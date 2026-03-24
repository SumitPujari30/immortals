'use client'

/**
 * React Query Hooks for Profiles
 * Nagar Seva Civic Portal - Supabase Version
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileService } from '@/services'
import { UserProfile } from '@/types'

export const profileKeys = {
  all: ['profiles'] as const,
  lists: () => [...profileKeys.all, 'list'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (userId: string) => [...profileKeys.details(), userId] as const,
}

export function useUserProfile(userId?: string) {
  return useQuery({
    queryKey: profileKeys.detail(userId || ''),
    queryFn: () => (userId ? profileService.get(userId) : null),
    enabled: !!userId,
  })
}

export function useProfileById(id: string) {
  return useQuery({
    queryKey: [...profileKeys.all, id],
    queryFn: () => profileService.getById(id),
    enabled: !!id,
  })
}

export function useProfileList(options?: { city?: string; role?: string }) {
  return useQuery({
    queryKey: [...profileKeys.lists(), options],
    queryFn: () => profileService.list(options),
  })
}

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<UserProfile> }) =>
      profileService.update(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.all,
      })
    },
  })
}

export function useGetOrCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, fullName }: { userId: string; fullName: string }) => {
      const existing = await profileService.get(userId)
      if (existing) return existing
      return profileService.create({ user_id: userId, full_name: fullName })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.all,
      })
    },
  })
}

export function useCreateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<UserProfile>) => profileService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: profileKeys.all,
      })
    },
  })
}

