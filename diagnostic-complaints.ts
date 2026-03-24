
import { createClient } from '@supabase/supabase-js'
import { supabaseAdmin } from './src/lib/supabase/admin';

async function checkComplaintsSchema() {
  console.log('--- Checking complaints table columns ---');
  // Fallback if RPC doesn't exist
  const { data: cols, error: fallbackError } = await supabaseAdmin.from('complaints').select('*').limit(0);
  if (fallbackError) {
     console.error('Error selecting from complaints:', fallbackError.message);
  } else {
     console.log('Columns likely exist and table is accessible.');
  }

  console.log('\n--- Checking foreign keys for complaints ---');
  // This query works on Supabase/PostgreSQL to find FKs
  const { data: fks, error: fkError } = await supabaseAdmin.rpc('get_table_info', { table_name: 'complaints' });
  
  if (fkError) {
    console.log('Error checking FKs via RPC (expected if RPC missing):', fkError.message);
    
    // Direct SQL attempt via RPC if available, or just guess based on error 409
    console.log('Assuming user_id FK issue based on 409 Conflict error.');
  } else {
    console.log('Table info:', fks);
  }
}

checkComplaintsSchema();
