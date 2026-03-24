import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { workersService } from '@/services'

export function useWorkerList(options?: { area?: string; isActive?: boolean }) {
  return useQuery({
    queryKey: ['workers', options],
    queryFn: () => workersService.list(options)
  })
}

export function useDeleteWorker() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => workersService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workers'] })
    }
  })
}
