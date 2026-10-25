-- WorkUru MVP data schema for Supabase (Mumbai / ap-south-1).
-- Firebase Auth owns identity and Phone OTP; Supabase stores application data only.
-- For production, move writes behind an Edge Function that verifies Firebase ID tokens.

create extension if not exists pgcrypto;

create table if not exists public.users (
  id text primary key,
  phone text unique not null,
  name text,
  district text not null default 'Salem',
  role text check (role in ('worker', 'owner')),
  language text not null default 'ta' check (language in ('ta', 'en')),
  created_at timestamptz not null default now()
);

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Other',
  salary integer not null check (salary >= 0),
  district text not null default 'Salem',
  location text not null,
  lat double precision,
  lng double precision,
  phone text not null,
  description text,
  image_url text,
  is_active boolean not null default true,
  owner_id text not null references public.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.ads (
  id uuid primary key default gen_random_uuid(),
  shop_name text not null,
  district text not null default 'Salem',
  poster_url text,
  phone text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Firebase users are not present in Supabase auth.users, so auth.uid() cannot
-- enforce ownership from the mobile client. This MVP intentionally disables RLS;
-- do not use this policy posture for production without a Firebase-token bridge.
alter table public.users disable row level security;
alter table public.jobs disable row level security;
alter table public.ads disable row level security;

insert into storage.buckets (id, name, public) values ('job_images', 'job_images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('ad_posters', 'ad_posters', true) on conflict (id) do nothing;

-- Public buckets are used by the MVP client. Add ownership-scoped storage
-- policies before production uploads are enabled.
