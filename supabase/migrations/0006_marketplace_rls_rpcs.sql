-- WP-0: Pazaryeri RLS + para/yönetim RPC'leri
-- Ürün moderasyonu: satıcı kendi ürününü ekler/günceller (yayını admin yapar).

-- orders: Stripe PaymentIntent referansı
alter table public.orders add column if not exists payment_intent_id text;

-- ===== products RLS (mevcut "published herkese okunur" duruyor) =====
create policy "ürün: satıcı/admin kendi görür"
  on public.products for select to authenticated
  using (vendor_id = private.current_vendor_id() or private.is_admin());

create policy "ürün: satıcı ekler (moderasyon)"
  on public.products for insert to authenticated
  with check (
    vendor_id = private.current_vendor_id()
    and status in ('draft','pending')
  );

create policy "ürün: satıcı günceller (yayını kendi yapamaz)"
  on public.products for update to authenticated
  using (vendor_id = private.current_vendor_id())
  with check (
    vendor_id = private.current_vendor_id()
    and status in ('draft','pending','rejected')
  );

create policy "ürün: satıcı siler"
  on public.products for delete to authenticated
  using (vendor_id = private.current_vendor_id());

create policy "ürün: admin tam yetki"
  on public.products for all to authenticated
  using (private.is_admin()) with check (private.is_admin());

-- ===== RPC'ler (SECURITY DEFINER + search_path sabit) =====

-- Ödeme onayı: Stripe PaymentIntent SUNUCUDA doğrulandıktan sonra çağrılır.
-- TODO (canlı): webhook + service-role ile sağlamlaştır; şu an test akışı.
create function public.mark_order_paid(p_order_id uuid, p_provider public.payment_provider, p_ref text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_id uuid;
begin
  if v_uid is null then raise exception 'Giriş gerekli'; end if;
  update public.orders
    set payment_status = 'paid', status = 'paid',
        payment_provider = p_provider, payment_ref = p_ref
  where id = p_order_id and buyer_id = v_uid and payment_status = 'pending'
  returning id into v_id;
  if v_id is null then raise exception 'Sipariş bulunamadı veya zaten ödendi'; end if;
end; $$;

-- Satıcı payout talebi: bakiyeden düş, payout + defter kaydı oluştur.
create function public.request_payout(p_amount numeric)
returns uuid language plpgsql security definer set search_path = '' as $$
declare v_vendor uuid := private.current_vendor_id(); v_bal numeric; v_iban text; v_id uuid;
begin
  if v_vendor is null then raise exception 'Satıcı değilsiniz'; end if;
  if p_amount is null or p_amount <= 0 then raise exception 'Geçersiz tutar'; end if;
  select balance, iban into v_bal, v_iban from public.vendor_profiles where id = v_vendor for update;
  if p_amount > v_bal then raise exception 'Yetersiz bakiye'; end if;
  update public.vendor_profiles set balance = balance - p_amount where id = v_vendor;
  insert into public.payouts (vendor_id, amount, iban) values (v_vendor, p_amount, v_iban) returning id into v_id;
  insert into public.vendor_transactions (vendor_id, type, amount, description)
    values (v_vendor, 'payout', -p_amount, 'Ödeme talebi');
  return v_id;
end; $$;

-- Alıcı ihtilaf açar (escrow shipped/delivered → disputed).
create function public.open_dispute(p_order_vendor_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_uid uuid := auth.uid(); v_id uuid;
begin
  if v_uid is null then raise exception 'Giriş gerekli'; end if;
  update public.order_vendors ov set escrow_status = 'disputed'
  from public.orders o
  where ov.id = p_order_vendor_id and o.id = ov.order_id and o.buyer_id = v_uid
    and ov.escrow_status in ('shipped','delivered')
  returning ov.id into v_id;
  if v_id is null then raise exception 'Geçersiz durum veya yetki yok'; end if;
end; $$;

-- Admin ihtilaf hakemliği: release (satıcıya öde) veya refund (alıcıya iade).
create function public.resolve_dispute(p_order_vendor_id uuid, p_action text)
returns void language plpgsql security definer set search_path = '' as $$
declare v_ov public.order_vendors;
begin
  if not private.is_admin() then raise exception 'Yalnızca yönetici'; end if;
  select * into v_ov from public.order_vendors where id = p_order_vendor_id and escrow_status = 'disputed';
  if v_ov.id is null then raise exception 'İhtilaflı sipariş bulunamadı'; end if;
  if p_action = 'release' then
    update public.order_vendors set escrow_status = 'released', confirmed_at = now() where id = v_ov.id;
    insert into public.vendor_transactions (vendor_id, order_vendor_id, type, amount, description)
    values (v_ov.vendor_id, v_ov.id, 'sale', v_ov.items_subtotal, 'Satış — ihtilaf çözümü'),
           (v_ov.vendor_id, v_ov.id, 'commission', -v_ov.commission_amount, 'Platform komisyonu');
    update public.vendor_profiles set balance = balance + v_ov.net_amount where id = v_ov.vendor_id;
  elsif p_action = 'refund' then
    update public.order_vendors set escrow_status = 'refunded' where id = v_ov.id;
  else
    raise exception 'Geçersiz işlem';
  end if;
end; $$;

-- Satıcı mağaza profili güncelleme (yalnız izinli alanlar; verified/balance/komisyon HARİÇ).
create function public.update_vendor_profile(p_patch jsonb)
returns void language plpgsql security definer set search_path = '' as $$
declare v_vendor uuid := private.current_vendor_id();
begin
  if v_vendor is null then raise exception 'Satıcı değilsiniz'; end if;
  update public.vendor_profiles set
    name     = coalesce(p_patch->>'name', name),
    person   = coalesce(p_patch->>'person', person),
    story    = coalesce(p_patch->>'story', story),
    avatar   = coalesce(p_patch->>'avatar', avatar),
    cover    = coalesce(p_patch->>'cover', cover),
    location = coalesce(p_patch->>'location', location),
    province = coalesce(p_patch->>'province', province),
    district = coalesce(p_patch->>'district', district),
    iban     = coalesce(p_patch->>'iban', iban)
  where id = v_vendor;
end; $$;

-- Admin gösterge paneli istatistikleri (grafikler için 14 günlük seri dahil).
create function public.admin_stats()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare v jsonb;
begin
  if not private.is_admin() then raise exception 'Yalnızca yönetici'; end if;
  select jsonb_build_object(
    'orders_total', (select count(*) from public.orders),
    'orders_paid', (select count(*) from public.orders where payment_status = 'paid'),
    'revenue_total', (select coalesce(sum(grand_total),0) from public.orders where payment_status = 'paid'),
    'commission_total', (select coalesce(sum(commission_amount),0) from public.order_vendors where escrow_status = 'released'),
    'vendors_total', (select count(*) from public.vendor_profiles),
    'users_total', (select count(*) from public.profiles),
    'pending_applications', (select count(*) from public.vendor_applications where status = 'pending'),
    'pending_products', (select count(*) from public.products where status = 'pending'),
    'pending_payouts', (select count(*) from public.payouts where status = 'pending'),
    'daily', (
      select coalesce(jsonb_agg(d order by d->>'day'), '[]'::jsonb) from (
        select jsonb_build_object(
          'day', to_char(g.day, 'YYYY-MM-DD'),
          'orders', count(o.id),
          'revenue', coalesce(sum(o.grand_total) filter (where o.payment_status = 'paid'), 0)
        ) as d
        from generate_series((now()::date - interval '13 days'), now()::date, interval '1 day') as g(day)
        left join public.orders o on o.created_at::date = g.day::date
        group by g.day
      ) s
    )
  ) into v;
  return v;
end; $$;

-- Yetkiler
revoke execute on function public.mark_order_paid(uuid, public.payment_provider, text) from public, anon;
revoke execute on function public.request_payout(numeric) from public, anon;
revoke execute on function public.open_dispute(uuid) from public, anon;
revoke execute on function public.resolve_dispute(uuid, text) from public, anon;
revoke execute on function public.update_vendor_profile(jsonb) from public, anon;
revoke execute on function public.admin_stats() from public, anon;

grant execute on function public.mark_order_paid(uuid, public.payment_provider, text) to authenticated;
grant execute on function public.request_payout(numeric) to authenticated;
grant execute on function public.open_dispute(uuid) to authenticated;
grant execute on function public.resolve_dispute(uuid, text) to authenticated;
grant execute on function public.update_vendor_profile(jsonb) to authenticated;
grant execute on function public.admin_stats() to authenticated;
