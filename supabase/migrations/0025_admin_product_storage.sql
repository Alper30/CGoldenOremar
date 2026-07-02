-- Admin ürün CRUD'u için: products bucket'ına admin de görsel yükleyip
-- güncelleyebilsin. Mevcut INSERT/UPDATE politikaları yalnız satıcının kendi
-- klasörüne (foldername[1] = current_vendor_id) izin veriyordu; admin satıcı
-- olmadığı için (assisted onboarding, §8.3.3) yükleme RLS'e takılıyordu.
-- DELETE politikasında admin zaten vardı; simetri için INSERT/UPDATE ekleniyor.

create policy "products: admin yükler" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'products' and private.is_admin());

create policy "products: admin günceller" on storage.objects
  for update to authenticated
  using (bucket_id = 'products' and private.is_admin())
  with check (bucket_id = 'products' and private.is_admin());
