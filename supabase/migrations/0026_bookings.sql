-- Golden Oremar — Randevu / Deneyim talepleri (booking)
-- /randevu formu buraya yazar. Anonim kullanıcı doğrudan INSERT edemez;
-- yalnızca guarded create_booking() RPC ile (sunucu-tarafı doğrulama).
-- Admin talepleri görür ve durumunu yönetir.

create table public.bookings (
  id              uuid primary key default gen_random_uuid(),
  experience_type text not null check (char_length(experience_type) between 2 and 120),
  guests          int  not null check (guests between 1 and 50),
  booking_date    date not null,
  booking_time    text not null check (char_length(booking_time) <= 10),
  name            text not null check (char_length(name) between 2 and 120),
  email           text not null check (position('@' in email) > 1 and char_length(email) <= 200),
  phone           text not null check (char_length(phone) between 5 and 40),
  notes           text check (notes is null or char_length(notes) <= 2000),
  status          text not null default 'new'
                    check (status in ('new', 'confirmed', 'cancelled', 'done')),
  created_at      timestamptz not null default now()
);

alter table public.bookings enable row level security;

create index bookings_status_idx on public.bookings (status, created_at desc);

-- Anonim/oturumlu kullanıcı SADECE bu RPC ile randevu oluşturur.
-- Doğrulama sunucuda tekrar edilir (istemciye güvenilmez — CLAUDE.md ilkesi).
create function public.create_booking(
  p_experience text,
  p_guests     int,
  p_date       date,
  p_time       text,
  p_name       text,
  p_email      text,
  p_phone      text,
  p_notes      text
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if p_guests is null or p_guests < 1 or p_guests > 50 then
    raise exception 'guests_out_of_range';
  end if;
  if p_date is null or p_date < current_date then
    raise exception 'date_in_past';
  end if;
  if p_experience is null or char_length(trim(p_experience)) < 2 then
    raise exception 'experience_required';
  end if;
  if p_email is null or position('@' in p_email) < 2 then
    raise exception 'email_invalid';
  end if;

  insert into public.bookings
    (experience_type, guests, booking_date, booking_time, name, email, phone, notes)
  values (
    left(trim(p_experience), 120),
    p_guests,
    p_date,
    left(coalesce(p_time, ''), 10),
    left(trim(coalesce(p_name, '')), 120),
    left(lower(trim(p_email)), 200),
    left(trim(coalesce(p_phone, '')), 40),
    nullif(left(trim(coalesce(p_notes, '')), 2000), '')
  )
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.create_booking(text, int, date, text, text, text, text, text) from public;
grant execute on function public.create_booking(text, int, date, text, text, text, text, text) to anon, authenticated;

-- Admin: randevuları okur ve durumunu günceller.
create policy "randevu: admin okur"
  on public.bookings for select
  to authenticated
  using (private.is_admin());

create policy "randevu: admin günceller"
  on public.bookings for update
  to authenticated
  using (private.is_admin())
  with check (private.is_admin());
