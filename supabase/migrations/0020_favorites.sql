-- Golden Oremar — Favoriler (kalıcı, cihazlar arası senkron)
-- Store slug ile çalıştığı için tablo da product_slug ile tutulur; products(slug)
-- benzersiz olduğundan FK ile bütünlük korunur (istemciye ürün UUID'si sızmaz).
create table if not exists public.favorites (
  user_id      uuid not null references auth.users(id) on delete cascade,
  product_slug text not null references public.products(slug) on delete cascade,
  created_at   timestamptz not null default now(),
  primary key (user_id, product_slug)
);

alter table public.favorites enable row level security;

-- Kullanıcı yalnızca kendi favorilerini görür/ekler/siler.
create policy "favori: kendini gör"
  on public.favorites for select to authenticated
  using (auth.uid() = user_id);

create policy "favori: kendin ekle"
  on public.favorites for insert to authenticated
  with check (auth.uid() = user_id);

create policy "favori: kendin sil"
  on public.favorites for delete to authenticated
  using (auth.uid() = user_id);
