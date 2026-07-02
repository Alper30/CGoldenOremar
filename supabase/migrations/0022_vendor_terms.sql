-- Satıcı Sözleşmesi kabul kaydı (ispat için başvuruyla birlikte saklanır).
-- Yeni başvurularda uygulama katmanı bu alanı doldurur; eski kayıtlarda null kalır.
alter table public.vendor_applications
  add column if not exists terms_accepted_at timestamptz;

comment on column public.vendor_applications.terms_accepted_at is
  'Satıcı Sözleşmesi''nin kabul edildiği an (yardımlı kayıtta operatör onayı aktarır).';
