-- Public bucket'ta dosya listeleme iznine gerek yok (public URL ile erişiliyor).
-- Geniş SELECT politikasını kaldır → listeleme sızıntısı uyarısı çözülür.
drop policy if exists "products: herkes okur" on storage.objects;
