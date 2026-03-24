import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cpjaqxgowvwurjfuctua.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwamFxeGdvd3Z3dXJqZnVjdHVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5Mzg2OCwiZXhwIjoyMDg4OTY5ODY4fQ._MrGQ14Tz43--zjKQ4z4AXl8DHQ4IrnLfyIT-ngkwsw'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function checkWorkers() {
  console.log('Fetching all workers...')
  const { data, error } = await supabase
    .from('workers')
    .select('*')
  
  if (error) {
    console.error('Error fetching workers:', error.message)
    return
  }
  
  if (!data || data.length === 0) {
    console.log('No workers found in the table.')
  } else {
    console.log(`Found ${data.length} workers:`)
    console.table(data.map(w => ({
      id: w.id,
      full_name: w.full_name,
      phone: w.phone,
      is_active: w.is_active,
      created_at: w.created_at
    })))
  }
}

checkWorkers()
