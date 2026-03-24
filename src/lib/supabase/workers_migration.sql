-- ============================================================================
-- Workers Table
-- ============================================================================
create table if not exists workers (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  age integer not null,
  gender text not null check (gender in ('male', 'female', 'other')),
  gov_id_type text not null check (gov_id_type in ('Aadhaar Card', 'PAN Card', 'Voter ID', 'Driving License')),
  gov_id_number text,
  phone text not null unique,
  photo_url text,
  gov_id_url text,
  assigned_count integer default 0,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table workers enable row level security;

-- Policies for workers
create policy "Workers are viewable by admins"
  on workers for select
  using (
    exists (
      select 1 from profiles
      where profiles.user_id = auth.uid()
      and profiles.role = 'admin'
    )
  );

create policy "Admins can manage workers"
  on workers for all
  using (
    exists (
      select 1 from profiles
      where profiles.user_id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- ============================================================================
-- Update Complaints Table
-- ============================================================================
do $$ 
begin
  if not exists (select 1 from information_schema.columns where table_name='complaints' and column_name='assigned_worker_id') then
    alter table complaints add column assigned_worker_id uuid references workers(id);
  end if;
end $$;

-- ============================================================================
-- Storage Bucket for worker photos
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('workers', 'workers', true)
on conflict do nothing;

-- Storage policies
create policy "Anyone can view worker photos"
  on storage.objects for select
  using (bucket_id = 'workers');

create policy "Admins can upload worker photos"
  on storage.objects for insert
  with check (
    bucket_id = 'workers' and 
    exists (
      select 1 from profiles
      where profiles.user_id = auth.uid()
      and profiles.role = 'admin'
    )
  );
