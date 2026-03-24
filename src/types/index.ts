export interface UserProfile {
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
  updated_at?: string
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

export interface ComplaintRegistrationData {
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
}
