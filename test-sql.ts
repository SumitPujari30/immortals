import { supabaseAdmin } from './src/lib/supabase/admin'

async function run() {
  const { data, error } = await supabaseAdmin.rpc('exec_sql', { sql: 'SELECT 1' })
  console.log('Result:', data, error)
}
run()
