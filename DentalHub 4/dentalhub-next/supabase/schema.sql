-- DentalHub: profiles table linked to Supabase Auth.
-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Users can only see and edit their own profile row.
drop policy if exists "Profiles are viewable by their owner" on public.profiles;
create policy "Profiles are viewable by their owner"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Profiles are updatable by their owner" on public.profiles;
create policy "Profiles are updatable by their owner"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Create the profile automatically when someone signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
