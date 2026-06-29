-- WP-0: Storage bucket'ları + RLS
-- kyc: özel (sadece sahibi + admin) — TC belge/selfie
-- products: public okuma, satıcı kendi klasörüne yazar

insert into storage.buckets (id, name, public)
values ('kyc', 'kyc', false), ('products', 'products', true)
on conflict (id) do nothing;

-- ===== kyc (özel) — yol: {auth.uid}/dosya =====
create policy "kyc: sahibi yükler"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'kyc' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "kyc: sahibi/admin okur"
  on storage.objects for select to authenticated
  using (bucket_id = 'kyc' and ((storage.foldername(name))[1] = auth.uid()::text or private.is_admin()));

create policy "kyc: sahibi siler"
  on storage.objects for delete to authenticated
  using (bucket_id = 'kyc' and (storage.foldername(name))[1] = auth.uid()::text);

-- ===== products (public okuma) — yol: {vendor_id}/dosya =====
-- Not: public bucket olduğu için okuma public URL ile yapılır; geniş SELECT
-- politikası 0009'da kaldırıldı (listeleme sızıntısını önlemek için).
create policy "products: satıcı yükler"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'products' and (storage.foldername(name))[1] = private.current_vendor_id()::text);

create policy "products: satıcı günceller"
  on storage.objects for update to authenticated
  using (bucket_id = 'products' and (storage.foldername(name))[1] = private.current_vendor_id()::text);

create policy "products: satıcı/admin siler"
  on storage.objects for delete to authenticated
  using (bucket_id = 'products' and ((storage.foldername(name))[1] = private.current_vendor_id()::text or private.is_admin()));
