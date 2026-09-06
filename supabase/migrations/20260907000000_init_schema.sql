create extension if not exists pgcrypto;

create table if not exists public.menu_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  display_order integer not null default 0,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.menu_categories(id) on delete cascade,
  name text not null,
  description text not null default '',
  price numeric not null,
  display_order integer not null default 0,
  is_available boolean not null default true,
  image_url text,
  created_at timestamp with time zone not null default now()
);

create table if not exists public.restaurant_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamp with time zone not null default now()
);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  nom text not null,
  prenom text not null,
  telephone text not null,
  ville text not null,
  adresse text not null default '',
  genre text not null,
  poste text not null default '',
  resume_url text not null,
  status text not null default 'pending' check (status in ('pending', 'reviewed', 'rejected')),
  created_at timestamp with time zone not null default now()
);

create index if not exists menu_items_category_id_idx on public.menu_items(category_id);
create index if not exists applications_created_at_idx on public.applications(created_at desc);
create index if not exists applications_status_idx on public.applications(status);

alter table public.applications enable row level security;

drop policy if exists "Allow public application submissions" on public.applications;
create policy "Allow public application submissions"
  on public.applications
  for insert
  to anon, authenticated
  with check (true);

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do nothing;
