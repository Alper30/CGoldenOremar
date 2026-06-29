-- KYC: kimlik belgesi ARKA YÜZ fotoğrafı için ek alan.
-- Ön yüz `document_url`, arka yüz `document_back_url`, selfie `selfie_url`.
alter table public.vendor_applications
  add column if not exists document_back_url text;
