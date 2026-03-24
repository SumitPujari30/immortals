import { supabaseAdmin } from './src/lib/supabase/admin'

async function probe() {
  const statuses = ['pending', 'under_review', 'in_progress', 'resolved', 'rejected', 'completed', 'cancelled']
  const results: Record<string, string> = {}

  for (const status of statuses) {
    console.log(`Testing status: ${status}`)
    // We'll try to update an existing complaint or insert a dummy one
    // But inserting a dummy one might fail due to other FK constraints
    // Let's try to update a complaint that we know exists from the log
    const testId = '9df6c0c2-d92a-4b3b-8d40-57697b59412b'
    
    const { error } = await supabaseAdmin
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
