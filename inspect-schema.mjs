import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://cpjaqxgowvwurjfuctua.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNwamFxeGdvd3Z3dXJqZnVjdHVhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzM5Mzg2OCwiZXhwIjoyMDg4OTY5ODY4fQ._MrGQ14Tz43--zjKQ4z4AXl8DHQ4IrnLfyIT-ngkwsw'

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

async function inspectSchema() {
  console.log('Inspecting workers table schema...')
  
  const { data: columns, error } = await supabase.rpc('get_table_columns', { table_name: 'workers' })
  
  if (error) {
    // If RPC doesn't exist, try a direct query to information_schema if possible (though restricted)
    // Actually, let's just try to insert a dummy worker and see the error.
    console.log('RPC get_table_columns failed, trying a test insert...')
    const { data, error: insertError } = await supabase
      .from('workers')
      .insert({ full_name: 'Test' })
      .select()
    
    if (insertError) {
      console.error('Insert error:', insertError)
    } else {
      console.log('Insert succeeded:', data)
      // Delete the test worker
      await supabase.from('workers').delete().eq('id', data[0].id)
    }
  } else {
    console.log('Columns:', columns)
  }
}

inspectSchema()
