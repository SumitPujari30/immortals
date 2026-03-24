import { Worker } from '@/types'

export const workersService = {
  async list(options?: { area?: string; isActive?: boolean }): Promise<Worker[]> {
    const params = new URLSearchParams()
    if (options?.area) params.append('area', options.area)
    if (options?.isActive !== undefined) params.append('is_active', options.isActive.toString())
    
    const response = await fetch(`/api/workers?${params.toString()}`)
    const result = await response.json()
    
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to fetch workers')
    }
    
    return result.workers as Worker[]
  },

  async create(data: Partial<Worker>): Promise<Worker> {
    const response = await fetch('/api/workers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to create worker')
    }

    return result.worker as Worker
  },

  async update(id: string, updates: Partial<Worker>): Promise<Worker> {
    const response = await fetch('/api/workers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    })

    const result = await response.json()
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update worker')
    }

    return result.worker as Worker
  },

  async delete(id: string, permanent: boolean = false): Promise<void> {
    const response = await fetch('/api/workers', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, permanent }),
    })

    const result = await response.json()
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to remove worker')
    }
  },
}
