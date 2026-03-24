import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const area = searchParams.get('area')
    const isActive = searchParams.get('is_active') !== 'false'

    let query = supabaseAdmin
      .from('workers')
      .select('*')
      .eq('is_active', isActive)

    if (area) {
      query = query.eq('area', area)
    }

    const { data: workers, error } = await query.order('full_name')

    if (error) {
      console.error('Error fetching workers:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, workers })
  } catch (error: any) {
    console.error('Workers API GET error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Validate required fields
    if (!data.full_name || !data.phone) {
      return NextResponse.json({ error: 'Full name and phone are required' }, { status: 400 })
    }

    const { data: worker, error } = await supabaseAdmin
      .from('workers')
      .insert({
        full_name: data.full_name,
        age: parseInt(data.age) || null,
        gender: data.gender,
        gov_id_type: data.gov_id_type,
        phone: data.phone,
        area: data.area,
        photo_url: data.photo_url,
        gov_id_url: data.gov_id_url,
        is_active: true,
        assigned_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating worker:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, worker })
  } catch (error: any) {
    console.error('Workers API POST error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...updates } = await req.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Worker ID is required' }, { status: 400 })
    }

    const { data: worker, error } = await supabaseAdmin
      .from('workers')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating worker:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, worker })
  } catch (error: any) {
    console.error('Workers API PATCH error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id, permanent } = await req.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Worker ID is required' }, { status: 400 })
    }

    let error
    if (permanent) {
      const { error: deleteError } = await supabaseAdmin
        .from('workers')
        .delete()
        .eq('id', id)
      error = deleteError
    } else {
      const { error: updateError } = await supabaseAdmin
        .from('workers')
        .update({ is_active: false })
        .eq('id', id)
      error = updateError
    }

    if (error) {
      console.error('Error deleting worker:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Worker removed successfully' })
  } catch (error: any) {
    console.error('Workers API DELETE error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
