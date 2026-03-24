'use client'

/**
 * React Query Hooks for Complaints
 * Nagar Seva Civic Portal - Supabase Version
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { complaintsDb, type Complaint } from '@/lib/db'
import {
  registerComplaint,
  getComplaintDetails,
  getUserComplaints,
  updateComplaintStatus,
  deleteComplaint,
  type ComplaintRegistrationData,
} from '@/lib/complaints'

export const complaintKeys = {
  all: ['complaints'] as const,
  lists: () => [...complaintKeys.all, 'list'] as const,
  list: (userId: string, filters?: Record<string, unknown>) =>
    [...complaintKeys.lists(), { userId, ...filters }] as const,
  details: () => [...complaintKeys.all, 'detail'] as const,
  detail: (id: string) => [...complaintKeys.details(), id] as const,
  recent: () => [...complaintKeys.all, 'recent'] as const,
  counts: (userId: string, status?: string) =>
    [...complaintKeys.all, 'count', userId, status] as const,
}

export function useUserComplaints(
  userId: string | undefined,
  options?: {
    status?: string
    category?: string
    limit?: number
    offset?: number
  }
) {
  return useQuery({
    queryKey: complaintKeys.list(userId || '', options),
    queryFn: () => {
      if (!userId) return []
      return getUserComplaints(userId, options)
    },
    enabled: !!userId,
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

export function useAllComplaints(options?: {
  status?: string
  category?: string
  limit?: number
  offset?: number
}) {
  return useQuery({
    queryKey: [...complaintKeys.all, 'all', options],
    queryFn: () => complaintsDb.listAll(options),
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

export function useComplaintDetails(id: string | undefined) {
  return useQuery({
    queryKey: complaintKeys.detail(id || ''),
    queryFn: () => {
      if (!id) return null
      return getComplaintDetails(id)
    },
    enabled: !!id,
  })
}

export function useRecentComplaints(limit: number = 10) {
  return useQuery({
    queryKey: complaintKeys.recent(),
    queryFn: () => complaintsDb.getRecent(limit),
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

export function useComplaintCount(
  userId: string | undefined,
  status?: string
) {
  return useQuery({
    queryKey: complaintKeys.counts(userId || '', status),
    queryFn: () => {
      if (!userId) return 0
      return complaintsDb.countByUser(userId, status)
    },
    enabled: !!userId,
    refetchInterval: 30000,
    staleTime: 10000,
  })
}

export function useRegisterComplaint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      data: ComplaintRegistrationData & {
        onProgress?: (progress: number) => void
      }
    ) => {
      const { onProgress, ...complaintData } = data
      return registerComplaint(complaintData, onProgress)
    },
    onSuccess: (result, variables) => {
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
    }: {
      id: string
      status: 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'rejected'
      assignedVolunteerId?: string | null
    }) => updateComplaintStatus(id, status, assignedVolunteerId),
    onSuccess: () => {
      // Invalidate all complaint queries so every dashboard refreshes
      queryClient.invalidateQueries({
        queryKey: complaintKeys.all,
      })
    },
  })
}

export function useDeleteComplaint() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteComplaint(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: complaintKeys.all })
    },
  })
}
