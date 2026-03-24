# Database Fix - FINAL STEP

The error you're seeing (Foreign Key Violation) is because your database is trying to verify volunteers against a table named `users`, but our project uses `user_credentials`.

### 🚀 How to Fix

1.  Open your **Supabase Dashboard**.
2.  Go to the **SQL Editor**.
3.  Click **New Query**.
4.  Paste and **Run** the following SQL exactly:

```sql
-- 1. Drop the incorrect foreign key constraints
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_assigned_volunteer_id_fkey;
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_user_id_fkey;

-- 2. Repair the constraints to point to the correct 'user_credentials' table
ALTER TABLE complaints 
ADD CONSTRAINT complaints_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES user_credentials(id) ON DELETE CASCADE;

ALTER TABLE complaints 
ADD CONSTRAINT complaints_assigned_volunteer_id_fkey 
FOREIGN KEY (assigned_volunteer_id) REFERENCES user_credentials(id);

-- 3. Also fix the profiles table if it has the same issue
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;
ALTER TABLE profiles 
ADD CONSTRAINT profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES user_credentials(id) ON DELETE CASCADE;

-- 5. Expand Status Workflow
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_status_check;
ALTER TABLE complaints ADD CONSTRAINT complaints_status_check 
CHECK (status IN ('pending', 'under_review', 'in_progress', 'resolved', 'rejected'));

-- Reload schema
NOTIFY pgrst, 'reload schema';
```

5.  Click **Run**.

Once you run this, the **"BOOK THIS SLOT"** button and the **Duty Toggle** will both work perfectly!
