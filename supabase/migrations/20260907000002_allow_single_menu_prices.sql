alter table public.menu_items
  alter column price_small drop not null,
  alter column price_medium drop not null,
  alter column price_large drop not null;
