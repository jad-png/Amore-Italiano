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
  price_small numeric,
  price_medium numeric,
  price_large numeric,
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

insert into storage.buckets (id, name, public)
values ('resumes', 'resumes', false)
on conflict (id) do update set public = excluded.public;

insert into storage.buckets (id, name, public)
values ('menu-images', 'menu-images', true)
on conflict (id) do update set public = excluded.public;

alter table public.restaurant_settings enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

drop policy if exists "Public can read restaurant settings" on public.restaurant_settings;
create policy "Public can read restaurant settings"
  on public.restaurant_settings for select to anon, authenticated using (true);
drop policy if exists "Public can read menu categories" on public.menu_categories;
create policy "Public can read menu categories"
  on public.menu_categories for select to anon, authenticated using (true);
drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
  on public.menu_items for select to anon, authenticated using (true);

drop policy if exists "Public can read menu images" on storage.objects;
create policy "Public can read menu images"
  on storage.objects for select to public using (bucket_id = 'menu-images');
