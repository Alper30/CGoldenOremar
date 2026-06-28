-- Golden Oremar — Katman 1b: Kimlik & Profil (Auth)
-- profiles: auth.users'a 1-1 bağlı; rol & iletişim. KYC/finans vendor_profiles'da.

create type public.user_role as enum ('user', 'vendor', 'admin');

create table public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text,
  phone       text,
  role        public.user_role not null default 'user',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Kullanıcı yalnızca kendi profilini görür/günceller (PII gizli).
create policy "profil: kendini gör"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id);

create policy "profil: kendini güncelle"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Kayıt sonrası otomatik profil oluştur (kayıt formundaki full_name metadata'dan).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'phone'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- updated_at otomatik tazele
create function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch_updated_at
  before update on public.profiles
  for each row execute function public.touch_updated_at();
