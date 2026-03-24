import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cpjaqxgowvwurjfuctua.supabase.co'
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwamFxeGdvd3Z3dXJqZnVjdHVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5Mzg2OCwiZXhwIjoyMDg4OTY5ODY4fQ._MrGQ14Tz43--zjKQ4z4AXl8DHQ4IrnLfyIT-ngkwsw'

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function debug() {
  console.log('Fetching last 10 registered users...')
  const { data, error } = await supabaseAdmin
    .from('user_credentials')
    .select('email, created_at')
    .order('created_at', { ascending: false })
    .limit(10)
    
  if (error) {
    console.error('Error fetching users:', error)
  } else {
    console.log('Total users found:', data?.length)
    console.table(data)
  }
}
debug()
