-- Webhook olay defteri (idempotency) + ödeme yaşam döngüsü işleyicileri.
-- Amaç: tekrar teslim edilen Stripe event'lerini bir kez işlemek ve ödemenin
-- başarısız/iptal/iade durumlarını sipariş + escrow'a otoritatif olarak yansıtmak.
-- Tümü SADECE service_role (webhook'un sunucu istemcisi) tarafından çağrılır.

-- 1) İşlenen Stripe event.id defteri — çift işlemeyi kesin engeller.
create table if not exists public.payment_webhook_events (
  event_id   text primary key,          -- Stripe event.id (evt_...)
  type       text not null,             -- event.type (payment_intent.succeeded ...)
  order_id   uuid references public.orders(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.payment_webhook_events enable row level security;
-- Politika yok → yalnız service_role (RLS bypass) erişir; alıcı/anon göremez.

comment on table public.payment_webhook_events is
  'Stripe webhook idempotency defteri: işlenen event.id kayıtları.';

-- 2) İptal edilen PaymentIntent → sipariş kalıcı başarısız/iptal.
-- YALNIZCA hâlâ 'pending' ise yazar: aynı intent'te retry ile başarılı olup
-- 'paid' olmuş bir siparişi ASLA geri almaz (payment_failed retry-güvenliği).
create or replace function public.mark_order_failed(p_order_id uuid, p_ref text)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.orders
    set payment_status = 'failed',
        status = 'cancelled',
        payment_ref = coalesce(payment_ref, p_ref)
  where id = p_order_id and payment_status = 'pending';
end; $$;

revoke all on function public.mark_order_failed(uuid, text)
  from public, anon, authenticated;
grant execute on function public.mark_order_failed(uuid, text) to service_role;

-- 3) Stripe iadesi → siparişi 'refunded' işaretle VE escrow'da bekleyen satıcı
-- kalemlerini 'refunded' yaparak cron/oto-onay ile satıcıya SERBEST BIRAKILMASINI
-- engelle. Zaten 'released' (parası satıcıya geçmiş) kalemler el değmeden kalır —
-- onların geri alımı admin hakemliği (dispute) ile manuel yürür (CLAUDE.md §8.3.1).
-- Eşleştirme payment_ref (= başarılı PaymentIntent id) üzerinden yapılır.
create or replace function public.refund_order(p_ref text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_order_id uuid;
begin
  select id into v_order_id
    from public.orders
    where payment_ref = p_ref and payment_status = 'paid'
    limit 1;
  if v_order_id is null then return; end if;  -- eşleşme yok / zaten iade → no-op

  update public.orders
    set payment_status = 'refunded', status = 'refunded'
  where id = v_order_id;

  update public.order_vendors
    set escrow_status = 'refunded'
  where order_id = v_order_id
    and escrow_status in ('pending', 'shipped', 'delivered');
end; $$;

revoke all on function public.refund_order(text)
  from public, anon, authenticated;
grant execute on function public.refund_order(text) to service_role;
