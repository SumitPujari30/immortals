import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'
import fs from 'fs'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    
    // Validate required fields
    if (!data.user_id || !data.category || !data.description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: complaint, error } = await supabaseAdmin
      .from('complaints')
      .insert({
        user_id: data.user_id,
        category: data.category,
        description: data.description,
        location_address: data.location_address,
        latitude: data.latitude,
        longitude: data.longitude,
        image_url: data.image_url,
        video_url: data.video_url,
        doc_url: data.doc_url,
        priority_level: data.priority_level || 'low',
        env_risk: data.env_risk || 'low',
        health_risk: data.health_risk || 'low',
        people_affected: data.people_affected || 0,
        status: 'pending',
      })
      .select()
      .single()

    if (error) {
      console.error('Complaint insertion error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, complaint })
  } catch (error: any) {
    console.error('Complaint API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, ...data } = await req.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Missing complaint ID' }, { status: 400 })
    }

    const { data: updated, error } = await supabaseAdmin
      .from('complaints')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Complaint update error:', error)
      try {
        fs.writeFileSync('server_error.log', JSON.stringify({ error, data, id, timestamp: new Date().toISOString() }, null, 2))
      } catch (logError) {
        console.error('Failed to write log file:', logError)
      }
      return NextResponse.json({ 
        error: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      }, { status: 500 })
    }

    // If a worker was newly assigned, increment their count
    if (data.assigned_worker_id) {
      const { error: workerError } = await supabaseAdmin.rpc('increment_worker_assigned_count', { 
        worker_id: data.assigned_worker_id 
      })
      if (workerError) {
        console.error('Failed to increment worker count via RPC:', workerError)
        // Fallback: direct update if RPC fails
        const { data: worker } = await supabaseAdmin
          .from('workers')
          .select('assigned_count')
          .eq('id', data.assigned_worker_id)
          .single()
        
        if (worker) {
          await supabaseAdmin
            .from('workers')
            .update({ assigned_count: (worker.assigned_count || 0) + 1 })
            .eq('id', data.assigned_worker_id)
        }
      }
    }

    return NextResponse.json({ success: true, complaint: updated })
  } catch (error: any) {
    console.error('Complaint Update API error:', error)
    return NextResponse.json({ error: error.message || 'Server-side error occurred' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { id } = await req.json()
    
    if (!id) {
      return NextResponse.json({ error: 'Missing complaint ID' }, { status: 400 })
    }

    const { data: deleted, error } = await supabaseAdmin
      .from('complaints')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Complaint delete error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, complaint: deleted })
  } catch (error: any) {
    console.error('Complaint Delete API error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
