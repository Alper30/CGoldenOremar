-- Admin paneli için okuma/güncelleme politikaları.

-- Admin tüm profilleri görebilsin (mevcut self-only SELECT'e OR eklenir).
-- is_admin() SECURITY DEFINER olduğundan profiles okurken RLS'i atlar → recursion yok.
create policy "profil: admin hepsini görür"
  on public.profiles for select to authenticated
  using (private.is_admin());

-- Admin payout durumunu güncelleyebilsin (ödeme yapıldı/işleniyor).
create policy "payout: admin günceller"
  on public.payouts for update to authenticated
  using (private.is_admin()) with check (private.is_admin());
