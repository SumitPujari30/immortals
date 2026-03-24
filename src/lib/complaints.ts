/**
 * Complaint Registration
 * Nagar Seva Civic Portal - Supabase Version
 *
 * Handles complaint submission with:
 * - Image/Video/Document upload to Supabase Storage
 * - Database record creation
 */

import { createClient } from '@/lib/supabase/client'
import { complaintsDb, type Complaint } from './db'

export interface ComplaintRegistrationData {
  userId: string
  userEmail: string
  userName: string
  category: string
  description: string
  locationAddress?: string
  latitude?: number
  longitude?: number
  imageFile?: File
  videoFile?: File
  docFile?: File
  priorityLevel?: 'low' | 'medium' | 'high'
  envRisk?: 'low' | 'medium' | 'high'
  healthRisk?: 'low' | 'medium' | 'high'
  peopleAffected?: number
}

export interface ComplaintRegistrationResult {
  success: boolean
  complaint?: Complaint
  error?: string
}

/**
 * Upload a file via the backend API to bypass RLS
 */
async function uploadFile(
  file: File,
  folder: string
): Promise<string | null> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    
    // Generate path
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

/**
 * Register a new complaint with optional file uploads via backend API
 */
export async function registerComplaint(
  data: ComplaintRegistrationData,
  onUploadProgress?: (progress: number) => void
): Promise<ComplaintRegistrationResult> {
  try {
    const totalFiles = [data.imageFile, data.videoFile, data.docFile].filter(Boolean).length
    const progressPerFile = totalFiles > 0 ? 60 / totalFiles : 0
    let currentProgress = 10

    // Upload image if provided
    let imageUrl: string | undefined
    if (data.imageFile) {
      currentProgress += progressPerFile
      onUploadProgress?.(Math.round(currentProgress))
      imageUrl = (await uploadFile(data.imageFile, 'images')) || undefined
    }

    // Upload video if provided
    let videoUrl: string | undefined
    if (data.videoFile) {
      currentProgress += progressPerFile
      onUploadProgress?.(Math.round(currentProgress))
      videoUrl = (await uploadFile(data.videoFile, 'videos')) || undefined
    }

    // Upload document if provided
    let docUrl: string | undefined
    if (data.docFile) {
      currentProgress += progressPerFile
      onUploadProgress?.(Math.round(currentProgress))
      docUrl = (await uploadFile(data.docFile, 'docs')) || undefined
    }

    currentProgress = 80
    onUploadProgress?.(Math.round(currentProgress))

    // Create complaint record in database via backend API
    const response = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: data.userId,
        category: data.category,
        description: data.description,
        location_address: data.locationAddress,
        latitude: data.latitude,
        longitude: data.longitude,
        image_url: imageUrl,
        video_url: videoUrl,
        doc_url: docUrl,
        priority_level: data.priorityLevel,
        env_risk: data.envRisk,
        health_risk: data.healthRisk,
        people_affected: data.peopleAffected,
      }),
    })

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to register complaint')
    }

    currentProgress = 100
    onUploadProgress?.(Math.round(currentProgress))

    return {
      success: true,
      complaint: result.complaint,
    }
  } catch (error: any) {
    console.error('Complaint registration failed:', error)
    return {
      success: false,
      error: error.message || 'Registration failed',
    }
  }
}

export async function getComplaintDetails(id: string) {
  return complaintsDb.getById(id)
}

export async function getUserComplaints(
  userId: string,
  options?: {
    status?: string
    category?: string
    limit?: number
    offset?: number
  }
) {
  return complaintsDb.listByUser(userId, options)
}

export async function updateComplaintStatus(
  id: string,
  status: 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'rejected',
  assignedVolunteerId?: string | null
) {
  return complaintsDb.updateStatus(id, status, assignedVolunteerId)
}

export async function deleteComplaint(id: string) {
  const response = await fetch('/api/complaints', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  
  const result = await response.json()
  if (!response.ok || !result.success) {
    throw new Error(result.error || 'Failed to delete complaint')
  }
  
  return result.complaint
}
