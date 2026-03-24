import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { user_id, full_name, phone, address, city, pincode, role, gov_id_type, gov_id_url } = data

    if (!user_id || !full_name) {
      return NextResponse.json({ error: 'User ID and full name are required' }, { status: 400 })
    }

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        user_id,
        full_name,
        phone,
        address,
        city,
        pincode,
        role: role || 'citizen',
        gov_id_type,
        gov_id_url,
      })
      .select()
      .single()

    if (error) {
      // Check for unique constraint violation
      if (error.code === '23505') {
        // Find existing profile instead
        const { data: existingProfile, error: fetchError } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('user_id', user_id)
          .single()
        
        if (!fetchError && existingProfile) {
          return NextResponse.json({ profile: existingProfile })
        }
      }
      throw error
    }

    return NextResponse.json({ profile })
  } catch (error: any) {
    console.error('Error creating profile:', error)
    return NextResponse.json({ error: error.message || 'Failed to create profile' }, { status: 500 })
  }
}
