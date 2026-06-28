-- Katman 2 — guard'lı para fonksiyonları. Hepsi SECURITY DEFINER + search_path
-- sabit. Fiyat/komisyon SUNUCUDA hesaplanır; istemci tutarlarına güvenilmez.
-- Bu RPC'ler authenticated tarafından supabase.rpc() ile çağrılır; her biri
-- içeride auth.uid()/is_admin/current_vendor_id + durum kontrolü yapar.

-- create_order: sepeti alır, ürün fiyatlarını DB'den okur, satıcı bazında
-- gruplar, komisyon/net hesaplar, order + order_vendors + order_items yazar.
create function public.create_order(p_items jsonb, p_ship jsonb)
returns uuid
language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_rate_default numeric(5,4);
  v_free_threshold numeric(10,2);
  v_order_id uuid;
  v_items_total numeric(10,2) := 0;
  v_shipping numeric(10,2) := 0;
  rec record;
  v_ov_id uuid;
  v_commission numeric(10,2);
  v_net numeric(10,2);
begin
  if v_uid is null then raise exception 'Giriş gerekli'; end if;

  select commission_rate, free_shipping_threshold
    into v_rate_default, v_free_threshold
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

  if v_items_total < v_free_threshold then v_shipping := 49.90; end if;

  update public.orders
    set items_total = v_items_total,
        shipping_total = v_shipping,
        grand_total = v_items_total + v_shipping
  where id = v_order_id;

  return v_order_id;
end;
$$;

-- mark_shipped: satıcı kargolar. Takip numarası ZORUNLU. pending→shipped,
-- escrow penceresine göre auto_confirm_at hesaplanır.
create function public.mark_shipped(p_order_vendor_id uuid, p_carrier text, p_tracking_no text)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  v_vendor uuid := private.current_vendor_id();
  v_days int;
  v_id uuid;
begin
  if v_vendor is null then raise exception 'Satıcı değilsiniz'; end if;
  if coalesce(trim(p_tracking_no), '') = '' then
    raise exception 'Kargo takip numarası zorunlu';
  end if;

  select escrow_auto_confirm_days into v_days from public.platform_settings where id = true;

  update public.order_vendors
    set escrow_status = 'shipped',
        tracking_carrier = p_carrier,
        tracking_no = p_tracking_no,
        shipped_at = now(),
        auto_confirm_at = now() + (v_days || ' days')::interval
  where id = p_order_vendor_id
    and vendor_id = v_vendor
    and escrow_status = 'pending'
  returning id into v_id;

  if v_id is null then raise exception 'Geçersiz durum veya yetki yok'; end if;
end;
$$;

-- confirm_received: alıcı teslim onaylar → escrow serbest, komisyon kesilir,
-- net satıcı bakiyesine + deftere işlenir.
create function public.confirm_received(p_order_vendor_id uuid)
returns void language plpgsql security definer set search_path = ''
as $$
declare
  v_uid uuid := auth.uid();
  v_ov public.order_vendors;
begin
  if v_uid is null then raise exception 'Giriş gerekli'; end if;

  update public.order_vendors ov
    set escrow_status = 'released',
        delivered_at = coalesce(ov.delivered_at, now()),
        confirmed_at = now()
  from public.orders o
  where ov.id = p_order_vendor_id
    and o.id = ov.order_id
    and o.buyer_id = v_uid
    and ov.escrow_status in ('shipped', 'delivered')
  returning ov.* into v_ov;

  if v_ov.id is null then raise exception 'Geçersiz durum veya yetki yok'; end if;

  insert into public.vendor_transactions (vendor_id, order_vendor_id, type, amount, description)
  values
    (v_ov.vendor_id, v_ov.id, 'sale',       v_ov.items_subtotal,    'Satış — teslim onayı'),
    (v_ov.vendor_id, v_ov.id, 'commission', -v_ov.commission_amount, 'Platform komisyonu');

  update public.vendor_profiles
    set balance = balance + v_ov.net_amount
  where id = v_ov.vendor_id;
end;
$$;

-- auto_confirm_escrow: süresi gelen kargoları otomatik serbest bırakır (cron).
-- private şemada — REST'e açık değil.
create function private.auto_confirm_escrow()
returns int language plpgsql security definer set search_path = ''
as $$
declare r public.order_vendors; v_count int := 0;
begin
  for r in
    select * from public.order_vendors
    where escrow_status = 'shipped'
      and auto_confirm_at is not null
      and auto_confirm_at <= now()
  loop
    update public.order_vendors
      set escrow_status = 'released', confirmed_at = now(),
          delivered_at = coalesce(delivered_at, now())
    where id = r.id;

    insert into public.vendor_transactions (vendor_id, order_vendor_id, type, amount, description)
    values
      (r.vendor_id, r.id, 'sale',       r.items_subtotal,    'Satış — otomatik onay'),
      (r.vendor_id, r.id, 'commission', -r.commission_amount, 'Platform komisyonu');

    update public.vendor_profiles set balance = balance + r.net_amount where id = r.vendor_id;
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

-- approve_vendor_application / reject — admin KYC kararı.
create function public.approve_vendor_application(p_app_id uuid)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare a public.vendor_applications; v_vendor_id uuid; v_slug text;
begin
  if not private.is_admin() then raise exception 'Yalnızca yönetici'; end if;

  select * into a from public.vendor_applications where id = p_app_id and status = 'pending';
  if a.id is null then raise exception 'Başvuru bulunamadı veya beklemede değil'; end if;

  v_slug := regexp_replace(
              lower(translate(a.store_name, 'çğıİöşüÇĞÖŞÜ ', 'cgiiosucgosu-')),
              '[^a-z0-9-]', '', 'g'
            ) || '-' || left(replace(gen_random_uuid()::text, '-', ''), 4);

  insert into public.vendor_profiles
    (slug, name, person, province, district, story, iban, verified, member_since, user_id, badges)
  values
    (v_slug, a.store_name, a.person, a.province, a.district, a.story, a.iban,
     true, extract(year from now())::int, a.user_id, array['KYC Doğrulandı'])
  returning id into v_vendor_id;

  update public.profiles set role = 'vendor' where id = a.user_id;
  update public.vendor_applications
    set status = 'approved', reviewed_by = auth.uid(), reviewed_at = now()
  where id = p_app_id;

  return v_vendor_id;
end;
$$;

create function public.reject_vendor_application(p_app_id uuid, p_reason text)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if not private.is_admin() then raise exception 'Yalnızca yönetici'; end if;
  update public.vendor_applications
    set status = 'rejected', reject_reason = p_reason,
        reviewed_by = auth.uid(), reviewed_at = now()
  where id = p_app_id and status = 'pending';
  if not found then raise exception 'Başvuru bulunamadı veya beklemede değil'; end if;
end;
$$;

-- Yetkiler: anon/public kapalı, authenticated açık (içeride auth kontrolü)
revoke execute on function public.create_order(jsonb, jsonb) from public, anon;
revoke execute on function public.mark_shipped(uuid, text, text) from public, anon;
revoke execute on function public.confirm_received(uuid) from public, anon;
revoke execute on function public.approve_vendor_application(uuid) from public, anon;
revoke execute on function public.reject_vendor_application(uuid, text) from public, anon;

grant execute on function public.create_order(jsonb, jsonb) to authenticated;
grant execute on function public.mark_shipped(uuid, text, text) to authenticated;
grant execute on function public.confirm_received(uuid) to authenticated;
grant execute on function public.approve_vendor_application(uuid) to authenticated;
grant execute on function public.reject_vendor_application(uuid, text) to authenticated;
