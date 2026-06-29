-- KRİTİK: 3DS sonrası sipariş onayını sağlamlaştır + kargo ücretini yapılandırılabilir yap.
--
-- Sorun (3DS): istemci confirmPayment({redirect:"if_required"}) ile 3D Secure'da
-- tarayıcı yönleniyor, onFinalize hiç çalışmıyordu → sipariş kalıcı 'pending',
-- escrow başlamıyor. Webhook'a güveniliyordu ama webhook handler yoktu.
--
-- Çözüm: service_role ile çağrılabilen idempotent finalize fonksiyonu. Stripe
-- webhook'u (payment_intent.succeeded) bunu çağırır → kullanıcı dönmese bile
-- sipariş ödendi işaretlenir. (İstemci dönüş akışı da ayrıca confirm route'u çağırır.)

-- Kargo ücreti artık sabit kod değil, platform_settings'ten gelir.
alter table public.platform_settings
  add column if not exists shipping_fee numeric(10,2) not null default 49.90;

-- create_order: kargo ücretini platform_settings.shipping_fee'den oku (sabit 49.90 kaldırıldı).
create or replace function public.create_order(p_items jsonb, p_ship jsonb)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_rate_default numeric(5,4);
  v_free_threshold numeric(10,2);
  v_ship_fee numeric(10,2);
  v_order_id uuid;
  v_items_total numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  rec record;
  v_ov_id uuid;
  v_commission numeric(10,2);
  v_net numeric(10,2);
begin
  if v_uid is null then raise exception 'Giriş gerekli'; end if;

  select commission_rate, free_shipping_threshold, shipping_fee
    into v_rate_default, v_free_threshold, v_ship_fee
  from public.platform_settings where id = true;

  insert into public.orders
    (buyer_id, ship_name, ship_phone, ship_line, ship_district, ship_province)
  values
    (v_uid, p_ship->>'name', p_ship->>'phone', p_ship->>'line',
     p_ship->>'district', p_ship->>'province')
  returning id into v_order_id;

  create temporary table _req on commit drop as
  select (e->>'product_id')::uuid as product_id,
         greatest(1, (e->>'qty')::int) as qty
  from jsonb_array_elements(p_items) e;

  for rec in
    select p.vendor_id,
           coalesce(vp.commission_rate, v_rate_default) as rate,
           sum(p.price * r.qty) as subtotal
    from _req r
    join public.products p on p.id = r.product_id and p.status = 'published'
    join public.vendor_profiles vp on vp.id = p.vendor_id
    group by p.vendor_id, vp.commission_rate, v_rate_default
  loop
    v_commission := round(rec.subtotal * rec.rate, 2);
    v_net := rec.subtotal - v_commission;

    insert into public.order_vendors
      (order_id, vendor_id, items_subtotal, shipping_fee,
       commission_rate, commission_amount, net_amount)
    values
      (v_order_id, rec.vendor_id, rec.subtotal, 0,
       rec.rate, v_commission, v_net)
    returning id into v_ov_id;

    insert into public.order_items
      (order_id, order_vendor_id, product_id, vendor_id, name, unit_price, qty, line_total)
    select v_order_id, v_ov_id, p.id, p.vendor_id, p.name, p.price, r.qty, p.price * r.qty
    from _req r
    join public.products p on p.id = r.product_id
    where p.vendor_id = rec.vendor_id and p.status = 'published';

    v_items_total := v_items_total + rec.subtotal;
  end loop;

  if v_items_total = 0 then raise exception 'Geçerli ürün yok'; end if;

  if v_items_total < v_free_threshold then v_shipping := v_ship_fee; end if;

  update public.orders
    set items_total = v_items_total,
        shipping_total = v_shipping,
        grand_total = v_items_total + v_shipping
  where id = v_order_id;

  return v_order_id;
end;
$$;

revoke execute on function public.create_order(jsonb, jsonb) from public, anon;
grant execute on function public.create_order(jsonb, jsonb) to authenticated;

-- Webhook finalize: yalnız service_role çağırır (auth.uid yok). Idempotent:
-- sipariş zaten ödendiyse sessizce geçer. RLS service_role ile atlanır ama biz
-- yine de SECURITY DEFINER + private şema ile REST yüzeyinden gizliyoruz.
create or replace function private.finalize_order_payment(
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

revoke all on function private.finalize_order_payment(uuid, public.payment_provider, text)
  from public, anon, authenticated;
grant execute on function private.finalize_order_payment(uuid, public.payment_provider, text)
  to service_role;
