-- ============================================================================
-- User Credentials Table (Custom Auth)
-- ============================================================================
create table if not exists user_credentials (
  id uuid default uuid_generate_v4() primary key,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

-- ============================================================================
-- Profiles Table
-- ============================================================================
create table if not exists profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_credentials(id) on delete cascade not null unique,
  full_name text not null,
  phone text,
  address text,
  city text,
  pincode text,
  role text default 'citizen' check (role in ('citizen', 'volunteer', 'admin')),
  gov_id_type text,
  gov_id_url text,
  is_on_duty boolean default false,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using (true);

create policy "Anyone can create a profile"
  on profiles for insert
  with check (true);

create policy "Anyone can update their own profile"
  on profiles for update
  using (true);

-- ============================================================================
-- Complaints Table
-- ============================================================================
create table if not exists complaints (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references user_credentials(id) on delete cascade not null,
  category text not null,
  description text not null,
  location_address text,
  latitude double precision,
  longitude double precision,
  image_url text,
  video_url text,
  doc_url text,
  priority_level text default 'low' check (priority_level in ('low', 'medium', 'high')),
  env_risk text default 'low' check (env_risk in ('low', 'medium', 'high')),
  health_risk text default 'low' check (health_risk in ('low', 'medium', 'high')),
  people_affected integer default 0,
  status text default 'pending' check (status in ('pending', 'in_progress', 'resolved', 'rejected')),
  assigned_volunteer_id uuid references user_credentials(id),
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table complaints enable row level security;

-- Policies for complaints
create policy "Complaints are viewable by everyone"
  on complaints for select
  using (true);

create policy "Anyone can create complaints"
  on complaints for insert
  with check (true);

create policy "Users can update their own complaints"
  on complaints for update
  using (true);

create policy "Admins and volunteers can update any complaint"
  on complaints for update
  using (
    exists (
      select 1 from profiles
      where profiles.user_id = auth.uid()
      and profiles.role in ('admin', 'volunteer')
    )
  );

create policy "Users can delete their own complaints"
  on complaints for delete
  using (auth.uid() = user_id);

-- ============================================================================
-- Storage Bucket for complaint media
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('complaints', 'complaints', true)
on conflict do nothing;

-- Storage policies
create policy "Anyone can view complaint files"
  on storage.objects for select
  using (bucket_id = 'complaints');

create policy "Authenticated users can upload complaint files"
  on storage.objects for insert
  with check (bucket_id = 'complaints' and auth.role() = 'authenticated');
