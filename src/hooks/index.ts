/**
 * Hooks Index
 * Nagar Seva Civic Portal
 */

export { useAuth } from './useAuth'
export {
  useUserComplaints,
  useComplaintDetails,
  useRecentComplaints,
  useComplaintCount,
  useRegisterComplaint,
  useUpdateComplaintStatus,
  useDeleteComplaint,
  useAllComplaints,
  complaintKeys,
} from './useComplaints'

export {
  useUserProfile,
  useProfileById,
  useProfileList,
  useCreateProfile,
  useUpdateProfile,
  useGetOrCreateProfile,
  profileKeys,
} from './useProfile'

export { useWorkerList, useDeleteWorker } from './useWorkers'

export type { AuthState, UseAuthReturn } from './useAuth'
