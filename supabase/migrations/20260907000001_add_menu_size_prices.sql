alter table public.menu_items
  add column if not exists price_small numeric,
  add column if not exists price_medium numeric,
  add column if not exists price_large numeric;

update public.menu_items
set
  price_small = coalesce(price_small, price),
  price_medium = coalesce(price_medium, price),
  price_large = coalesce(price_large, price)
where price_small is null
   or price_medium is null
   or price_large is null;

alter table public.menu_items
  alter column price_small drop not null,
  alter column price_medium drop not null,
  alter column price_large drop not null;
