-- Destek / iletişim mesajları — iletişim formundan gelen talepler admin
-- panelindeki Destek sayfasında listelenir ve kapatılır.

create table public.support_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete set null,
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (position('@' in email) > 1 and char_length(email) <= 200),
  phone text check (phone is null or char_length(phone) <= 40),
  subject text not null check (char_length(subject) between 2 and 80),
  body text not null check (char_length(body) between 5 and 4000),
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  closed_at timestamptz,
  closed_by uuid references auth.users (id)
);

create index support_messages_status_idx on public.support_messages (status, created_at desc);

alter table public.support_messages enable row level security;

-- Herkes (üye olmayan dâhil) iletişim formundan mesaj bırakabilir.
-- Kapalı/tarihli alanlar dayatılır; user_id ya boş ya da gönderenin kendisi.
create policy "destek: herkes mesaj bırakır"
  on public.support_messages for insert to anon, authenticated
  with check (
    status = 'open'
    and closed_at is null
    and closed_by is null
    and (user_id is null or user_id = auth.uid())
  );

-- Yalnızca admin okur ve günceller (kapatma).
create policy "destek: admin okur"
  on public.support_messages for select to authenticated
  using (private.is_admin());

create policy "destek: admin günceller"
  on public.support_messages for update to authenticated
  using (private.is_admin()) with check (private.is_admin());
