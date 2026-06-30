-- Golden Oremar — Müşteri yorum/puan sistemi (güven katmanının çekirdeği, §10.2)
-- Yalnızca ürünü SATIN ALMIŞ alıcı yorum yazabilir (verified purchase = anti-fraud).
-- Ürün/satıcı agregatları (rating, review_count, positive_pct) HER ZAMAN sunucuda
-- yeniden hesaplanır; istemci değerine güvenilmez (§8.5/§9.1).

-- ------------------------------------------------------------------
-- (A) Yorum başına tek kayıt: aynı alıcı bir ürüne bir yorum yazar
--     (tekrar gönderim = güncelleme). Seed yorumlar user_id null → hariç.
-- ------------------------------------------------------------------
create unique index if not exists product_reviews_user_product_uniq
  on public.product_reviews (user_id, product_id)
  where user_id is not null;

-- ------------------------------------------------------------------
-- (B) products_protect trigger'ını agrega güncellemesine izin verecek
--     şekilde genişlet: rating/review_count yalnızca admin VEYA
--     transaction-local 'app.allow_agg' bayrağı set edilmişse değişebilir.
--     Bu bayrak yalnızca aşağıdaki SECURITY DEFINER RPC'ler içinde set edilir;
--     REST'ten doğrudan UPDATE bunu set edemez → puan şişirme hâlâ engelli.
-- ------------------------------------------------------------------
create or replace function private.products_protect()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin()
     and coalesce(current_setting('app.allow_agg', true), '') <> '1' then
    new.rating       := old.rating;
    new.review_count := old.review_count;
  end if;
  -- vendor_id / created_at her durumda korunur (sahiplik kaçırma engeli).
  if not private.is_admin() then
    new.vendor_id  := old.vendor_id;
    new.created_at := old.created_at;
  end if;
  return new;
end; $$;

-- ------------------------------------------------------------------
-- (C) Ürün ve satıcı agregatlarını yeniden hesapla (ortak yardımcı).
-- ------------------------------------------------------------------
create or replace function private.recompute_review_aggregates(p_product_id uuid, p_vendor_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_p_avg   numeric;
  v_p_count int;
  v_v_avg   numeric;
  v_v_count int;
  v_v_pos   int;
begin
  -- Ürün agregatı
  select coalesce(round(avg(rating)::numeric, 2), 0), count(*)
    into v_p_avg, v_p_count
    from public.product_reviews where product_id = p_product_id;

  perform set_config('app.allow_agg', '1', true);  -- transaction-local
  update public.products
     set rating = v_p_avg, review_count = v_p_count
   where id = p_product_id;
  perform set_config('app.allow_agg', '0', true);

  -- Satıcı agregatı (tüm ürünlerinin yorumları)
  select coalesce(round(avg(rating)::numeric, 2), 0),
         count(*),
         coalesce(round(100.0 * count(*) filter (where rating >= 4)
                        / nullif(count(*), 0))::int, 0)
    into v_v_avg, v_v_count, v_v_pos
    from public.product_reviews where vendor_id = p_vendor_id;

  update public.vendor_profiles
     set rating = v_v_avg, review_count = v_v_count, positive_pct = v_v_pos
   where id = p_vendor_id;
end; $$;

-- ------------------------------------------------------------------
-- (D) Yorum gönder / güncelle — verified purchase zorunlu.
-- ------------------------------------------------------------------
create or replace function public.submit_review(
  p_product_slug text,
  p_rating int,
  p_text text
)
returns void language plpgsql security definer set search_path = '' as $$
declare
  v_uid       uuid := auth.uid();
  v_product   record;
  v_author    text;
  v_location  text;
begin
  if v_uid is null then raise exception 'Giriş gerekli'; end if;
  if p_rating is null or p_rating < 1 or p_rating > 5 then
    raise exception 'Puan 1 ile 5 arasında olmalı';
  end if;
  if p_text is null or length(btrim(p_text)) < 3 then
    raise exception 'Lütfen kısa bir değerlendirme yazın';
  end if;

  select id, vendor_id into v_product
    from public.products
   where slug = p_product_slug and status = 'published';
  if v_product.id is null then raise exception 'Ürün bulunamadı'; end if;

  -- VERIFIED PURCHASE: alıcı bu ürünü ödenmiş bir siparişte almış olmalı.
  if not exists (
    select 1
      from public.order_items oi
      join public.orders o on o.id = oi.order_id
     where oi.product_id = v_product.id
       and o.buyer_id = v_uid
       and o.payment_status = 'paid'
  ) then
    raise exception 'Yalnızca bu ürünü satın alanlar değerlendirme yazabilir';
  end if;

  v_author := coalesce((select full_name from public.profiles where id = v_uid), 'Müşteri');
  v_location := (
    select ship_province from public.orders
     where buyer_id = v_uid and ship_province is not null
     order by created_at desc limit 1
  );

  insert into public.product_reviews (product_id, vendor_id, author, location, rating, text, user_id)
  values (v_product.id, v_product.vendor_id, v_author, v_location, p_rating, btrim(p_text), v_uid)
  on conflict (user_id, product_id) where user_id is not null
  do update set rating = excluded.rating,
                text   = excluded.text,
                author = excluded.author,
                location = excluded.location,
                created_at = now();

  perform private.recompute_review_aggregates(v_product.id, v_product.vendor_id);
end; $$;

revoke execute on function public.submit_review(text, int, text) from public, anon;
grant execute on function public.submit_review(text, int, text) to authenticated;

-- ------------------------------------------------------------------
-- (E) Alıcının bu ürün için yorum durumu (form state'i için).
--     state: 'not_purchased' | 'can_review' | 'reviewed'
-- ------------------------------------------------------------------
create or replace function public.my_review(p_product_slug text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_uid     uuid := auth.uid();
  v_pid     uuid;
  v_rev     record;
  v_bought  boolean;
begin
  if v_uid is null then raise exception 'Giriş gerekli'; end if;

  select id into v_pid from public.products
   where slug = p_product_slug and status = 'published';
  if v_pid is null then return jsonb_build_object('state', 'not_purchased'); end if;

  select * into v_rev from public.product_reviews
   where product_id = v_pid and user_id = v_uid;
  if v_rev.id is not null then
    return jsonb_build_object('state', 'reviewed',
                              'rating', v_rev.rating, 'text', v_rev.text);
  end if;

  select exists (
    select 1 from public.order_items oi
      join public.orders o on o.id = oi.order_id
     where oi.product_id = v_pid and o.buyer_id = v_uid and o.payment_status = 'paid'
  ) into v_bought;

  return jsonb_build_object('state', case when v_bought then 'can_review' else 'not_purchased' end);
end; $$;

revoke execute on function public.my_review(text) from public, anon;
grant execute on function public.my_review(text) to authenticated;

-- ------------------------------------------------------------------
-- (F) Admin moderasyon: yorumu sil + agregatları tazele.
-- ------------------------------------------------------------------
create or replace function public.admin_delete_review(p_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_pid uuid; v_vid uuid;
begin
  if not private.is_admin() then raise exception 'Yetkisiz'; end if;
  delete from public.product_reviews where id = p_id
    returning product_id, vendor_id into v_pid, v_vid;
  if v_pid is not null then
    perform private.recompute_review_aggregates(v_pid, v_vid);
  end if;
end; $$;

revoke execute on function public.admin_delete_review(uuid) from public, anon;
grant execute on function public.admin_delete_review(uuid) to authenticated;
