-- Public pages may read published content, but all writes stay behind the
-- server-side service-role actions protected by Clerk admin authorization.
alter table public.restaurant_settings enable row level security;
alter table public.menu_categories enable row level security;
alter table public.menu_items enable row level security;

drop policy if exists "Public can read restaurant settings" on public.restaurant_settings;
create policy "Public can read restaurant settings"
  on public.restaurant_settings
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read menu categories" on public.menu_categories;
create policy "Public can read menu categories"
  on public.menu_categories
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
  on public.menu_items
  for select
  to anon, authenticated
  using (true);

-- menu-images is intentionally public for optimized public-page delivery.
-- Upload, replacement, deletion, and ordering remain server-only.
drop policy if exists "Public can read menu images" on storage.objects;
create policy "Public can read menu images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'menu-images');
