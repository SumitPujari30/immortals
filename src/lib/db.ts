/**
 * Database Helpers
 * Nagar Seva Civic Portal - Supabase Version
 *
 * Provides typed CRUD operations for profiles and complaints tables
 */

import { createClient } from '@/lib/supabase/client'

// ============================================================================
// Type Definitions
// ============================================================================

export interface Profile {
  id: string
  user_id: string
  full_name: string
  phone?: string
  address?: string
  city?: string
  pincode?: string
  role: 'citizen' | 'volunteer' | 'admin'
  gov_id_type?: string
  gov_id_url?: string
  is_on_duty: boolean
  created_at: string
}

export interface Complaint {
  id: string
  user_id: string
  category: string
  description: string
  location_address?: string
  latitude?: number
  longitude?: number
  image_url?: string
  video_url?: string
  doc_url?: string
  priority_level: 'low' | 'medium' | 'high'
  env_risk: 'low' | 'medium' | 'high'
  health_risk: 'low' | 'medium' | 'high'
  people_affected: number
  status: 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'rejected'
  assigned_volunteer_id: string | null
  assigned_worker_id: string | null
  created_at: string
  // Joined fields
  user_email?: string
  user_full_name?: string
}

export interface Worker {
  id: string
  full_name: string
  age: number | null
  gender: string | null
  gov_id_type: string | null
  phone: string | null
  photo_url: string | null
  gov_id_url: string | null
  area: string | null
  is_active: boolean
  assigned_count: number
  created_at: string
}

// ============================================================================
// Profile Helpers
// ============================================================================

export const profilesDb = {
  async create(data: {
    user_id: string
    full_name: string
    phone?: string
    address?: string
    city?: string
    pincode?: string
    role?: 'citizen' | 'volunteer' | 'admin'
    gov_id_type?: string
    gov_id_url?: string
    is_on_duty?: boolean
  }): Promise<Profile> {
    const response = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create profile')
    }

    const { profile } = await response.json()
    return profile as Profile
  },

  async getByUserId(userId: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw error
    return (data as Profile) || null
  },

  async getById(id: string): Promise<Profile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return (data as Profile) || null
  },

  async list(options?: {
    limit?: number
    offset?: number
    city?: string
    role?: string
  }): Promise<Profile[]> {
    const supabase = createClient()
    let query = supabase.from('profiles').select('*')

    if (options?.city) query = query.eq('city', options.city)
    if (options?.role) query = query.eq('role', options.role)
    query = query.range(
      options?.offset || 0,
      (options?.offset || 0) + (options?.limit || 50) - 1
    )

    const { data, error } = await query
    if (error) throw error
    return (data as Profile[]) || []
  },

  async update(
    id: string,
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
  ): Promise<Profile> {
    const supabase = createClient()
    const { data: updated, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return updated as Profile
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) throw error
  },

  async getOrCreate(userId: string, fullName: string): Promise<Profile> {
    const existing = await this.getByUserId(userId)
    if (existing) return existing
    return this.create({ user_id: userId, full_name: fullName })
  },
}

// ============================================================================
// Complaint Helpers
// ============================================================================

export const complaintsDb = {
  async create(data: {
    user_id: string
    category: string
    description: string
    location_address?: string
    latitude?: number
    longitude?: number
    image_url?: string
    video_url?: string
    doc_url?: string
    priority_level?: 'low' | 'medium' | 'high'
    env_risk?: 'low' | 'medium' | 'high'
    health_risk?: 'low' | 'medium' | 'high'
    people_affected?: number
  }): Promise<Complaint> {
    const response = await fetch('/api/complaints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    const result = await response.json()
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to create complaint record')
    }

    return result.complaint as Complaint
  },

  async getById(id: string): Promise<Complaint | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .eq('id', id)
      .single()
    if (error && error.code !== 'PGRST116') throw error
    return (data as Complaint) || null
  },

  async listByUser(
    userId: string,
    options?: {
      limit?: number
      offset?: number
      status?: string
      category?: string
    }
  ): Promise<Complaint[]> {
    const supabase = createClient()
    let query = supabase
      .from('complaints')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (options?.status) query = query.eq('status', options.status)
    if (options?.category) query = query.eq('category', options.category)
    query = query.range(
      options?.offset || 0,
      (options?.offset || 0) + (options?.limit || 20) - 1
    )

    const { data, error } = await query
    if (error) throw error
    return (data as Complaint[]) || []
  },

  async listAll(options?: {
    limit?: number
    offset?: number
    status?: string
    category?: string
  }): Promise<Complaint[]> {
    const supabase = createClient()
    let query = supabase
      .from('complaints')
      .select('*')
      .order('created_at', { ascending: false })

    if (options?.status) query = query.eq('status', options.status)
    if (options?.category) query = query.eq('category', options.category)
    query = query.range(
      options?.offset || 0,
      (options?.offset || 0) + (options?.limit || 50) - 1
    )

    const { data, error } = await query
    if (error) throw error
    return (data as Complaint[]) || []
  },

  async updateStatus(
    id: string,
    status: 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'rejected',
    assignedVolunteerId?: string | null
  ): Promise<Complaint> {
    const updateData: Record<string, unknown> = { id, status }
    if (assignedVolunteerId !== undefined) {
      updateData.assigned_volunteer_id = assignedVolunteerId
    }
    
    const response = await fetch('/api/complaints', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    const result = await response.json()
    if (!response.ok || !result.success) {
      console.error('API Error details:', result)
      throw new Error(result.error || 'Failed to update complaint status')
    }

    return result.complaint as Complaint
  },

  async update(
    id: string,
    data: Partial<{
      category: string
      description: string
      location_address: string
      latitude: number
      longitude: number
      image_url: string
      video_url: string
      doc_url: string
      priority_level: 'low' | 'medium' | 'high'
      env_risk: 'low' | 'medium' | 'high'
      health_risk: 'low' | 'medium' | 'high'
      people_affected: number
      status: 'pending' | 'under_review' | 'in_progress' | 'resolved' | 'rejected'
      assigned_volunteer_id: string
      assigned_worker_id: string
    }>
  ): Promise<Complaint> {
    const response = await fetch('/api/complaints', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...data }),
    })

    const result = await response.json()
    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Failed to update complaint')
    }

    return result.complaint as Complaint
  },

  async delete(id: string): Promise<void> {
    const supabase = createClient()
    const { error } = await supabase.from('complaints').delete().eq('id', id)
    if (error) throw error
  },

  async countByUser(userId: string, status?: string): Promise<number> {
    const supabase = createClient()
    let query = supabase
      .from('complaints')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
    if (status) query = query.eq('status', status)

    const { count, error } = await query
    if (error) throw error
    return count || 0
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
}
