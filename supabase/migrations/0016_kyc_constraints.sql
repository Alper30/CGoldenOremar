-- GÜVENLİK: KYC alan doğrulamasını DB seviyesine taşı (yalnız istemci doğrulaması
-- yetersizdi — PostgREST üzerinden geçersiz TC/IBAN doğrudan yazılabiliyordu).
-- TC: 11 hane. IBAN: TR + 24 hane (boşluklar normalize edilmiş halde).
-- NOT VALID: mevcut (test) satırları kırmadan, yeni kayıtlara uygulanır.

alter table public.vendor_applications
  add constraint vendor_applications_tc_no_chk
  check (tc_no ~ '^[0-9]{11}$') not valid;

alter table public.vendor_applications
  add constraint vendor_applications_iban_chk
  check (replace(upper(iban), ' ', '') ~ '^TR[0-9]{24}$') not valid;
