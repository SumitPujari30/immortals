import { createClient } from '@/lib/supabase/client'
import { UserProfile } from '@/types'

export const profileService = {
  async get(userId: string): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()
    if (error) throw error
    return data as UserProfile | null
  },

  async getById(id: string): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data as UserProfile | null
  },

  async update(id: string, data: Partial<UserProfile>): Promise<UserProfile> {
    const supabase = createClient()
    const { data: profile, error } = await supabase
      .from('profiles')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return profile as UserProfile
  },

  async list(options?: { city?: string; role?: string }): Promise<UserProfile[]> {
    const supabase = createClient()
    let query = supabase.from('profiles').select('*')
    if (options?.city) query = query.eq('city', options.city)
    if (options?.role) query = query.eq('role', options.role)
    const { data, error } = await query
    if (error) throw error
    return (data as UserProfile[]) || []
  },

  async create(data: Partial<UserProfile>): Promise<UserProfile> {
    const response = await fetch('/api/auth/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || 'Failed to create profile')
    }

    const { profile } = await response.json()
    return profile as UserProfile
  },
}
