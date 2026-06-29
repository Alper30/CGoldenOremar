-- Zengin admin gösterge paneli verisi (tek RPC → DashboardData JSON).
-- Yalnız admin. SECURITY DEFINER + search_path=''. p_days: pencere (1/7/30/90).
-- Tüm para SUNUCUDA; istemci yalnız görüntüler.

-- Yüzde değişim yardımcı (private) — payda 0 ise 0.
create or replace function private.pct_change(cur numeric, prev numeric)
returns numeric language sql immutable set search_path = '' as $$
  select case when prev is null or prev = 0 then 0
              else round(((cur - prev) / prev) * 100, 1) end;
$$;

-- Sipariş durumu enum → Türkçe etiket (private).
create or replace function private.order_status_tr(s text)
returns text language sql immutable set search_path = '' as $$
  select case s
    when 'pending' then 'Bekliyor'
    when 'paid' then 'Ödendi'
    when 'partially_shipped' then 'Kısmi Kargo'
    when 'shipped' then 'Kargoda'
    when 'completed' then 'Tamamlandı'
    when 'cancelled' then 'İptal'
    when 'refunded' then 'İade'
    else s end;
$$;

create or replace function public.admin_dashboard(p_days int default 30)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v jsonb;
  v_days int := greatest(1, coalesce(p_days, 30));
  v_start timestamptz := now() - (v_days || ' days')::interval;
  v_prev_start timestamptz := now() - (2 * v_days || ' days')::interval;
  v_rev numeric := 0; v_rev_prev numeric := 0;
  v_com numeric := 0; v_com_prev numeric := 0;
  v_ord int := 0; v_ord_prev int := 0;
  v_vend_new int := 0; v_vend_new_prev int := 0;
  v_user_new int := 0; v_user_new_prev int := 0;
  v_vendors int := 0; v_users int := 0;
  v_pend_app int := 0; v_pend_prod int := 0; v_pend_pay numeric := 0;
  v_spark_rev numeric[]; v_spark_com numeric[]; v_spark_ord numeric[];
  v_trend jsonb;
begin
  if not private.is_admin() then raise exception 'Yalnızca yönetici'; end if;

  with days as (select generate_series((now()::date - (v_days - 1)), now()::date, interval '1 day')::date as d),
  ord as (select o.created_at::date as d, o.id, o.grand_total, o.payment_status from public.orders o where o.created_at >= now()::date - (v_days - 1)),
  com as (select o.created_at::date as d, sum(ov.commission_amount) as c from public.orders o join public.order_vendors ov on ov.order_id = o.id where o.created_at >= now()::date - (v_days - 1) and o.payment_status = 'paid' group by o.created_at::date),
  series as (select days.d, coalesce(sum(ord.grand_total) filter (where ord.payment_status = 'paid'), 0) as ciro, coalesce(max(com.c), 0) as komisyon, count(ord.id) as siparis from days left join ord on ord.d = days.d left join com on com.d = days.d group by days.d)
  select coalesce(jsonb_agg(jsonb_build_object('date', to_char(d, 'DD.MM'),'ciro', round(ciro, 2),'komisyon', round(komisyon, 2),'siparis', siparis) order by d), '[]'::jsonb),
    array_agg(round(ciro, 2) order by d), array_agg(round(komisyon, 2) order by d), array_agg(siparis order by d)
  into v_trend, v_spark_rev, v_spark_com, v_spark_ord from series;

  select coalesce(sum(grand_total) filter (where payment_status='paid' and created_at >= v_start),0),
         coalesce(sum(grand_total) filter (where payment_status='paid' and created_at >= v_prev_start and created_at < v_start),0),
         count(*) filter (where created_at >= v_start), count(*) filter (where created_at >= v_prev_start and created_at < v_start)
    into v_rev, v_rev_prev, v_ord, v_ord_prev from public.orders;
  select coalesce(sum(ov.commission_amount) filter (where o.created_at >= v_start),0),
         coalesce(sum(ov.commission_amount) filter (where o.created_at >= v_prev_start and o.created_at < v_start),0)
    into v_com, v_com_prev from public.order_vendors ov join public.orders o on o.id = ov.order_id where o.payment_status = 'paid';
  select count(*) filter (where created_at >= v_start), count(*) filter (where created_at >= v_prev_start and created_at < v_start), count(*)
    into v_vend_new, v_vend_new_prev, v_vendors from public.vendor_profiles;
  select count(*) filter (where created_at >= v_start), count(*) filter (where created_at >= v_prev_start and created_at < v_start), count(*)
    into v_user_new, v_user_new_prev, v_users from public.profiles;
  select count(*) from public.vendor_applications where status='pending' into v_pend_app;
  select count(*) from public.products where status='pending' into v_pend_prod;
  select coalesce(sum(amount),0) from public.payouts where status='pending' into v_pend_pay;

  v := jsonb_build_object(
    'revenueTrend', v_trend,
    'kpis', jsonb_build_array(
      jsonb_build_object('key','revenue','label','Toplam Ciro','value',round(v_rev,2),'change', private.pct_change(v_rev, v_rev_prev),'format','currency','tone','primary','spark', to_jsonb(v_spark_rev)),
      jsonb_build_object('key','commission','label','Toplam Komisyon','value',round(v_com,2),'change', private.pct_change(v_com, v_com_prev),'format','currency','tone','gold','spark', to_jsonb(v_spark_com)),
      jsonb_build_object('key','orders','label','Sipariş Sayısı','value',v_ord,'change', private.pct_change(v_ord, v_ord_prev),'format','number','tone','info','spark', to_jsonb(v_spark_ord)),
      jsonb_build_object('key','vendors','label','Aktif Satıcı','value',v_vendors,'change', private.pct_change(v_vend_new, v_vend_new_prev),'format','number','tone','primary','spark', to_jsonb(v_spark_ord)),
      jsonb_build_object('key','users','label','Kullanıcı','value',v_users,'change', private.pct_change(v_user_new, v_user_new_prev),'format','number','tone','info','spark', to_jsonb(v_spark_ord)),
      jsonb_build_object('key','pendingApps','label','Bekleyen Başvuru','value',v_pend_app,'change', 0,'format','number','tone','warning','spark', to_jsonb(v_spark_ord)),
      jsonb_build_object('key','pendingProducts','label','Bekleyen Ürün','value',v_pend_prod,'change', 0,'format','number','tone','warning','spark', to_jsonb(v_spark_ord)),
      jsonb_build_object('key','pendingPayouts','label','Bekleyen Ödeme','value',round(v_pend_pay,2),'change', 0,'format','currency','tone','warning','spark', to_jsonb(v_spark_com))
    ),
    'categories', coalesce((select jsonb_agg(t) from (select c.name as name, round(sum(oi.line_total))::numeric as value from public.order_items oi join public.products p on p.id = oi.product_id join public.categories c on c.id = p.category_id join public.orders o on o.id = oi.order_id and o.payment_status='paid' group by c.name order by value desc limit 6) t), '[]'::jsonb),
    'orderStatus', coalesce((select jsonb_agg(jsonb_build_object('status', private.order_status_tr(status::text), 'value', n)) from (select status, count(*) n from public.orders group by status order by count(*) desc) s), '[]'::jsonb),
    'topProducts', coalesce((select jsonb_agg(t) from (select oi.product_id::text as id, max(oi.name) as name, coalesce(max(vp.name),'—') as vendor, coalesce(max(c.name),'—') as category, sum(oi.qty)::int as sold, round(sum(oi.line_total))::numeric as revenue from public.order_items oi join public.orders o on o.id=oi.order_id and o.payment_status='paid' left join public.vendor_profiles vp on vp.id=oi.vendor_id left join public.products p on p.id=oi.product_id left join public.categories c on c.id=p.category_id group by oi.product_id order by revenue desc limit 5) t), '[]'::jsonb),
    'topVendors', coalesce((select jsonb_agg(t) from (select vp.id::text as id, vp.name as name, coalesce(vp.province,'—') as city, round(sum(ov.items_subtotal))::numeric as revenue, count(distinct ov.order_id)::int as orders, coalesce(vp.rating,0)::numeric as rating from public.order_vendors ov join public.vendor_profiles vp on vp.id=ov.vendor_id join public.orders o on o.id=ov.order_id and o.payment_status='paid' group by vp.id, vp.name, vp.province, vp.rating order by revenue desc limit 5) t), '[]'::jsonb),
    'cities', coalesce((select jsonb_agg(t) from (select coalesce(nullif(ship_province,''),'Bilinmiyor') as city, count(*)::int as orders, round(coalesce(sum(grand_total),0))::numeric as revenue from public.orders group by 1 order by orders desc limit 6) t), '[]'::jsonb),
    'activity', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'type', type, 'title', title, 'detail', detail, 'ago', greatest(0, floor(extract(epoch from (now()-ts))/60))::int) order by ts desc) from (
        select * from (
          (select o.id::text as id, 'order' as type, 'Yeni sipariş' as title, '#'||left(o.id::text,8)||' · '||to_char(o.grand_total,'FM999G999')||' ₺' as detail, o.created_at as ts from public.orders o order by o.created_at desc limit 5)
          union all (select a.id::text, 'application', 'Satıcı başvurusu', a.store_name, a.created_at from public.vendor_applications a order by a.created_at desc limit 3)
          union all (select py.id::text, 'payout', 'Ödeme talebi', to_char(py.amount,'FM999G999')||' ₺', py.created_at from public.payouts py order by py.created_at desc limit 3)
        ) u order by ts desc limit 8
      ) acts), '[]'::jsonb)
  );
  return v;
end; $$;

revoke execute on function public.admin_dashboard(int) from public, anon;
grant execute on function public.admin_dashboard(int) to authenticated;
