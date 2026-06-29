-- KRİTİK GÜVENLİK: profiles.role yetki yükseltme deliğini kapat.
-- Sorun: "profil: kendini güncelle" RLS politikası sütun kısıtlamıyordu ve role'ü
-- koruyan bir trigger yoktu → herhangi bir giriş yapmış kullanıcı
--   supabase.from('profiles').update({ role: 'admin' })
-- ile kendini admin yapabiliyordu (tüm güven modelini çökertir).
--
-- Çözüm: BEFORE UPDATE trigger; admin olmayan biri role/id/created_at sütunlarını
-- DEĞİŞTİREMEZ (eski değer zorla geri yazılır). Admin değişiklikleri (örn.
-- approve_vendor_application içindeki role='vendor') is_admin() true olduğundan geçer.

create or replace function private.profiles_protect()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if not private.is_admin() then
    new.role       := old.role;
    new.id         := old.id;
    new.created_at := old.created_at;
  end if;
  return new;
end; $$;

drop trigger if exists profiles_protect_cols on public.profiles;
create trigger profiles_protect_cols
  before update on public.profiles
  for each row execute function private.profiles_protect();
