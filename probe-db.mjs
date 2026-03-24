import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cpjaqxgowvwurjfuctua.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwamFxeGdvd3Z3dXJqZnVjdHVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5Mzg2OCwiZXhwIjoyMDg4OTY5ODY4fQ._MrGQ14Tz43--zjKQ4z4AXl8DHQ4IrnLfyIT-ngkwsw'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function probe() {
  const statuses = ['pending', 'under_review', 'in_progress', 'resolved', 'rejected']
  const results = {}

  // Get a valid complaint ID first
  const { data: complaints } = await supabase.from('complaints').select('id').limit(1)
  if (!complaints || complaints.length === 0) {
    console.error('No complaints found to test with')
    return
  }
  const testId = complaints[0].id

  for (const status of statuses) {
    const { error } = await supabase
      .from('complaints')
      .update({ status })
      .eq('id', testId)

    if (error) {
      results[status] = `FAILED: ${error.message}`
    } else {
      results[status] = 'SUCCESS'
    }
  }

  console.log('--- Results ---')
  console.log(JSON.stringify(results, null, 2))
}

probe()
