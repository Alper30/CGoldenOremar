-- finalize_order_payment'i public şemaya taşı (PostgREST yalnız public'i sunar →
-- webhook'un service-role istemcisi RPC'yi REST üzerinden çağırabilsin).
-- Yetki: SADECE service_role. authenticated/anon/public reddedilir (auth.uid
-- kontrolü olmadığı için yetki yalnız grant ile sınırlanır — service-role anahtarı
-- yalnız sunucuda/webhook'ta bulunur).

drop function if exists private.finalize_order_payment(uuid, public.payment_provider, text);

create or replace function public.finalize_order_payment(
  p_order_id uuid,
  p_provider public.payment_provider,
  p_ref text
)
returns void language plpgsql security definer set search_path = '' as $$
begin
  update public.orders
    set payment_status = 'paid', status = 'paid',
        payment_provider = p_provider, payment_ref = p_ref
  where id = p_order_id and payment_status = 'pending';
end; $$;

revoke all on function public.finalize_order_payment(uuid, public.payment_provider, text)
  from public, anon, authenticated;
grant execute on function public.finalize_order_payment(uuid, public.payment_provider, text)
  to service_role;