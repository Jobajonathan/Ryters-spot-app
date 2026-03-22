-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  role text not null default 'client' check (role in ('client', 'admin')),
  country text,
  company text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    'client'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Projects table
create table public.projects (
  id uuid default uuid_generate_v4() primary key,
  client_id uuid references public.profiles(id) on delete cascade,
  service text not null check (service in ('research_academic','digital_transformation','edtech','product_management')),
  title text not null,
  description text,
  deadline date,
  status text not null default 'pending' check (status in ('pending','in_review','in_progress','completed','cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Invoices table
create table public.invoices (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  amount numeric(10,2) not null,
  currency text default 'GBP',
  status text default 'pending' check (status in ('pending','paid','overdue','cancelled')),
  due_date date,
  stripe_invoice_id text,
  created_at timestamptz default now()
);

-- Messages table
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete cascade,
  body text not null,
  created_at timestamptz default now()
);

-- Project files table
create table public.project_files (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  uploaded_by uuid references public.profiles(id),
  file_url text not null,
  file_name text,
  file_type text check (file_type in ('brief','deliverable','attachment')),
  created_at timestamptz default now()
);

-- Notifications table
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  message text not null,
  read boolean default false,
  link text,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.invoices enable row level security;
alter table public.messages enable row level security;
alter table public.project_files enable row level security;
alter table public.notifications enable row level security;

-- RLS Policies
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Clients can view own projects" on public.projects for select using (auth.uid() = client_id);
create policy "Clients can insert own projects" on public.projects for insert with check (auth.uid() = client_id);

create policy "Users can view own invoices" on public.invoices for select using (
  exists (select 1 from public.projects where projects.id = invoices.project_id and projects.client_id = auth.uid())
);

create policy "Users can view own messages" on public.messages for select using (
  exists (select 1 from public.projects where projects.id = messages.project_id and projects.client_id = auth.uid())
  or sender_id = auth.uid()
);

create policy "Users can send messages" on public.messages for insert with check (auth.uid() = sender_id);

create policy "Users can view own files" on public.project_files for select using (
  exists (select 1 from public.projects where projects.id = project_files.project_id and projects.client_id = auth.uid())
);

create policy "Users can view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users can update own notifications" on public.notifications for update using (auth.uid() = user_id);
