-- Golden Oremar — Admin kullanıcı & satıcı yönetim aksiyonları
-- Admin panelinden rol değiştirme, kullanıcı/satıcı askıya alma, KYC verify.
-- Hepsi guarded SECURITY DEFINER RPC (private.is_admin()); doğrudan tablo
-- yazımı RLS + profiles_protect trigger'ıyla zaten engelli.

alter table public.profiles
  add column if not exists suspended boolean not null default false;

alter table public.vendor_profiles
  add column if not exists suspended boolean not null default false;

-- Rol değiştir. Admin kendini admin dışına ALAMAZ (kilitlenmeyi önler).
create or replace function public.admin_set_user_role(p_user uuid, p_role public.user_role)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'not_authorized';
  end if;
  if p_user = auth.uid() and p_role <> 'admin' then
    raise exception 'cannot_demote_self';
  end if;
  update public.profiles set role = p_role where id = p_user;
end;
$$;

-- Kullanıcıyı askıya al / geri aç. Login engeli auth katmanında (service-role
-- ban) uygulanır; bu bayrak sorgulanabilir durum içindir. Kendini askıya alamaz.
create or replace function public.admin_set_user_suspended(p_user uuid, p_suspended boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'not_authorized';
  end if;
  if p_user = auth.uid() and p_suspended then
    raise exception 'cannot_suspend_self';
  end if;
  update public.profiles set suspended = p_suspended where id = p_user;
end;
$$;

-- Satıcı KYC doğrulama rozetini aç/kapat (güven sinyali, §8.4.2).
create or replace function public.admin_set_vendor_verified(p_vendor uuid, p_verified boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'not_authorized';
  end if;
  update public.vendor_profiles set verified = p_verified where id = p_vendor;
end;
$$;

-- Satıcıyı askıya al / geri aç. Askıya alınca yayındaki ürünleri vitrinden çeker
-- (status published → draft); geri açınca ürünler taslakta kalır (admin/satıcı
-- yeniden yayınlar) — istemeden toplu yayına çıkışı önler.
create or replace function public.admin_set_vendor_suspended(p_vendor uuid, p_suspended boolean)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'not_authorized';
  end if;
  update public.vendor_profiles set suspended = p_suspended where id = p_vendor;
  if p_suspended then
    update public.products
      set status = 'draft'
      where vendor_id = p_vendor and status = 'published';
  end if;
end;
$$;

revoke all on function public.admin_set_user_role(uuid, public.user_role) from public;
revoke all on function public.admin_set_user_suspended(uuid, boolean) from public;
revoke all on function public.admin_set_vendor_verified(uuid, boolean) from public;
revoke all on function public.admin_set_vendor_suspended(uuid, boolean) from public;
grant execute on function public.admin_set_user_role(uuid, public.user_role) to authenticated;
grant execute on function public.admin_set_user_suspended(uuid, boolean) to authenticated;
grant execute on function public.admin_set_vendor_verified(uuid, boolean) to authenticated;
grant execute on function public.admin_set_vendor_suspended(uuid, boolean) to authenticated;
