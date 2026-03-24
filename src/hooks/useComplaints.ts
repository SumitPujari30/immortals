'use client'

/**
 * React Query Hooks for Complaints
 * Nagar Seva Civic Portal - Supabase Version
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { complaintsService } from '@/services'
import { type Complaint, type ComplaintRegistrationData } from '@/types'

export const complaintKeys = {
  all: ['complaints'] as const,
  lists: () => [...complaintKeys.all, 'list'] as const,
  list: (userId: string, filters?: Record<string, unknown>) =>
    [...complaintKeys.lists(), { userId, ...filters }] as const,
  details: () => [...complaintKeys.all, 'detail'] as const,
  detail: (id: string) => [...complaintKeys.details(), id] as const,
  recent: () => [...complaintKeys.all, 'recent'] as const,
}

export function useUserComplaints(userId?: string) {
  return useQuery({
    queryKey: [...complaintKeys.all, 'user', userId],
    queryFn: () => (userId ? complaintsService.listByUser(userId) : []),
    enabled: !!userId,
  })
}

export function useAllComplaints(options?: { status?: string; category?: string }) {
  return useQuery({
    queryKey: [...complaintKeys.all, 'list', options],
    queryFn: () => complaintsService.listAll(options),
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

export function useComplaintDetails(id: string) {
  return useQuery({
    queryKey: complaintKeys.detail(id),
    queryFn: async () => {
      const all = await complaintsService.listAll()
      return all.find((c) => c.id === id) || null
    },
    enabled: !!id,
  })
}

export function useRecentComplaints(limit: number = 10) {
  return useQuery({
    queryKey: [...complaintKeys.all, 'recent', limit],
    queryFn: () => complaintsService.getRecent(limit),
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

export function useComplaintCount(userId?: string, status?: string) {
  return useQuery({
    queryKey: [...complaintKeys.all, 'count', userId, status],
    queryFn: () => complaintsService.getCount(userId, status),
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

export function useRegisterComplaint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: any) => complaintsService.register(data),
    onSuccess: (data) => {
      // Invalidate everything so all dashboards refresh
      queryClient.invalidateQueries({
        queryKey: complaintKeys.all,
      })
    },
  })
}

export function useUpdateComplaintStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      status,
      assignedVolunteerId,
      assignedWorkerId,
    }: {
      id: string
      status: 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'rejected'
      assignedVolunteerId?: string | null
      assignedWorkerId?: string | null
    }) => complaintsService.updateStatus(id, status, assignedVolunteerId, assignedWorkerId),
    onSuccess: () => {
      // Invalidate all complaint queries so every dashboard refreshes
      queryClient.invalidateQueries({
        queryKey: complaintKeys.all,
      })
      // Also invalidate workers since assigned_count might have changed
      queryClient.invalidateQueries({
        queryKey: ['workers'],
      })
    },
  })
}

export function useDeleteComplaint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => complaintsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: complaintKeys.all,
      })
    },
  })
}
