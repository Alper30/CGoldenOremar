-- Ürün hikâyesi ve öne çıkan özellikler (legacy katalog verisinin taşınması için).
alter table public.products
  add column if not exists story text,
  add column if not exists features text[] not null default '{}';
