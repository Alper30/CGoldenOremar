-- Güvenlik sertleştirme (commit review bulguları)

-- (A) Ödeme bypass'ı kapat: mark_order_paid yalnızca SUNUCU sırrıyla çağrılabilir.
-- Sır private şemada + .env'de (PAYMENT_SECRET). Alıcı JWT'siyle doğrudan REST
-- çağrısı sırrı bilmediği için reddedilir → ödemeden "ödendi" yapılamaz.
create table if not exists private.app_config (
  key   text primary key,
  value text not null
);
revoke all on table private.app_config from public, anon, authenticated;

insert into private.app_config (key, value)
values (
  'payment_secret',
  replace(gen_random_uuid()::text, '-', '') || replace(gen_random_uuid()::text, '-', '')
)
on conflict (key) do nothing;

drop function if exists public.mark_order_paid(uuid, public.payment_provider, text);

create function public.mark_order_paid(
  p_order_id uuid,
  p_provider public.payment_provider,
  p_ref text,
  p_secret text
)
returns void language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_id uuid;
begin
  if v_uid is null then raise exception 'Giriş gerekli'; end if;
  if p_secret is null
     or p_secret <> (select value from private.app_config where key = 'payment_secret') then
    raise exception 'Yetkisiz ödeme onayı';
  end if;
  update public.orders
    set payment_status = 'paid', status = 'paid',
        payment_provider = p_provider, payment_ref = p_ref
  where id = p_order_id and buyer_id = v_uid and payment_status = 'pending'
  returning id into v_id;
  if v_id is null then raise exception 'Sipariş bulunamadı veya zaten ödendi'; end if;
end; $$;

revoke execute on function public.mark_order_paid(uuid, public.payment_provider, text, text) from public, anon;
grant execute on function public.mark_order_paid(uuid, public.payment_provider, text, text) to authenticated;

-- (B) Ürün agregat/sahiplik koruması: satıcı kendi ürününde rating/review_count/
-- vendor_id/created_at DEĞİŞTİREMEZ (puan şişirme / sahiplik kaçırma engeli).
create or replace function private.products_protect()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin() then
    new.rating       := old.rating;
    new.review_count := old.review_count;
    new.vendor_id    := old.vendor_id;
    new.created_at   := old.created_at;
  end if;
  return new;
end; $$;

drop trigger if exists products_protect_cols on public.products;
create trigger products_protect_cols
  before update on public.products
  for each row execute function private.products_protect();
