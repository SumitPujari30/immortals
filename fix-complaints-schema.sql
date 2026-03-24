-- 1. CREATE WORKERS TABLE (If missing)
CREATE TABLE IF NOT EXISTS workers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    age INTEGER,
    gender TEXT,
    gov_id_type TEXT,
    phone TEXT,
    photo_url TEXT,
    gov_id_url TEXT,
    area TEXT,
    is_active BOOLEAN DEFAULT true,
    assigned_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. LINK COMPLAINTS TO WORKERS
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='complaints' AND column_name='assigned_worker_id') THEN
        ALTER TABLE complaints ADD COLUMN assigned_worker_id UUID REFERENCES workers(id);
    END IF;
END $$;

-- 3. FIX COMPLAINTS TABLE FOREIGN KEY (Citizen ID)
ALTER TABLE IF EXISTS complaints 
DROP CONSTRAINT IF EXISTS complaints_user_id_fkey;

ALTER TABLE IF EXISTS complaints 
ADD CONSTRAINT complaints_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES user_credentials(id) 
ON DELETE CASCADE;

-- 4. ENSURE COMPLAINTS TABLE RLS
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own complaints" ON complaints;
CREATE POLICY "Users can view their own complaints" 
ON complaints FOR SELECT 
USING (true);

-- 5. STORAGE BUCKET SETUP
-- Ensure the 'complaints' and 'workers' buckets exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('complaints', 'complaints', true),
       ('workers', 'workers', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 6. STORAGE RLS POLICIES
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id IN ('complaints', 'workers'));

DROP POLICY IF EXISTS "Allow All Storage" ON storage.objects;
CREATE POLICY "Allow All Storage" 
ON storage.objects FOR ALL 
USING (bucket_id IN ('complaints', 'workers'))
WITH CHECK (bucket_id IN ('complaints', 'workers'));

-- 7. EXPAND STATUS WORKFLOW
ALTER TABLE complaints DROP CONSTRAINT IF EXISTS complaints_status_check;
ALTER TABLE complaints ADD CONSTRAINT complaints_status_check 
CHECK (status IN ('pending', 'under_review', 'in_progress', 'resolved', 'rejected'));

-- 8. WORKERS TABLE RLS
ALTER TABLE IF EXISTS workers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow Full Access" ON workers;
CREATE POLICY "Allow Full Access" 
ON workers FOR ALL 
USING (true)
WITH CHECK (true);

-- Reload PostgREST schema
NOTIFY pgrst, 'reload schema';
