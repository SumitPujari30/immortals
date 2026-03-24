import { createClient } from '@/lib/supabase/client'
import { Complaint, ComplaintRegistrationData } from '@/types'

async function uploadFile(
  file: File,
  folder: string
): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    const timestamp = Date.now()
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_')
    const path = `${folder}/${timestamp}-${sanitizedName}`
    formData.append('path', path)
    formData.append('bucket', 'complaints')

    const response = await fetch('/api/storage/upload', {
      method: 'POST',
      body: formData,
    })
    
    const result = await response.json()
    if (result.success) return result.url
    throw new Error(result.error)
  } catch (error) {
    console.error(`Failed to upload to ${folder}:`, error)
    return null
  }
}

export const complaintsService = {
  async register(
    data: ComplaintRegistrationData & {
      imageFile?: File
      videoFile?: File
      docFile?: File
      onProgress?: (progress: number) => void
    }
  ): Promise<{ success: boolean; complaint?: Complaint; error?: string }> {
    try {
      const { onProgress, imageFile, videoFile, docFile, ...complaintData } = data
      
      const totalFiles = [imageFile, videoFile, docFile].filter(Boolean).length
      const progressPerFile = totalFiles > 0 ? 60 / totalFiles : 0
      let currentProgress = 10

      // Upload files
      let imageUrl, videoUrl, docUrl
      if (imageFile) {
        currentProgress += progressPerFile
        onProgress?.(Math.round(currentProgress))
        imageUrl = await uploadFile(imageFile, 'images')
      }
      if (videoFile) {
        currentProgress += progressPerFile
        onProgress?.(Math.round(currentProgress))
        videoUrl = await uploadFile(videoFile, 'videos')
      }
      if (docFile) {
        currentProgress += progressPerFile
        onProgress?.(Math.round(currentProgress))
        docUrl = await uploadFile(docFile, 'docs')
      }

      currentProgress = 80
      onProgress?.(Math.round(currentProgress))

      // Create record
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...complaintData,
          image_url: imageUrl,
          video_url: videoUrl,
          doc_url: docUrl,
        }),
      })

      const result = await response.json()
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to register complaint')
      }

      onProgress?.(100)
      return result.complaint as Complaint
    } catch (error: any) {
      throw error
    }
  },

  async updateStatus(
    id: string,
    status: string,
    assignedVolunteerId?: string | null,
    assignedWorkerId?: string | null
  ): Promise<Complaint> {
    const updateData: Record<string, unknown> = { id, status }
    if (assignedVolunteerId !== undefined) {
      updateData.assigned_volunteer_id = assignedVolunteerId
    }
    if (assignedWorkerId !== undefined) {
      updateData.assigned_worker_id = assignedWorkerId
    }
    
    const response = await fetch('/api/complaints', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    const result = await response.json()
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update complaint status')
    }

    return result.complaint as Complaint
  },

  async listAll(options?: { status?: string; category?: string }): Promise<Complaint[]> {
    const supabase = createClient()
    let query = supabase
      .from('complaints')
      .select('*, profiles:user_id(full_name, avatar_url)')
      .order('created_at', { ascending: false })

    if (options?.status) {
      query = query.eq('status', options.status)
    }
    if (options?.category) {
      query = query.eq('category', options.category)
    }

    const { data, error } = await query
    if (error) throw error
    return (data as Complaint[]) || []
  },

  async listByUser(userId: string): Promise<Complaint[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return (data as Complaint[]) || []
  },

  async getRecent(limit: number = 10): Promise<Complaint[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw error
    return (data as Complaint[]) || []
  },

  async getCount(userId?: string, status?: string): Promise<number> {
    const supabase = createClient()
    let query = supabase
      .from('complaints')
      .select('id', { count: 'exact', head: true })

    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { count, error } = await query
    if (error) throw error
    return count || 0
  },

  async delete(id: string): Promise<void> {
    const response = await fetch('/api/complaints', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    
    const result = await response.json()
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to delete complaint')
    }
  },
}
