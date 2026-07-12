-- Golden Oremar — Destek in-app yanıt
-- Admin, destek mesajına panelden yanıt yazar; yanıt müşteriye e-posta ile
-- gönderilir ve kayda işlenir. Yeni durum: 'answered'.

alter table public.support_messages
  drop constraint support_messages_status_check;

alter table public.support_messages
  add constraint support_messages_status_check
    check (status in ('open', 'answered', 'closed'));

alter table public.support_messages
  add column if not exists reply_body text,
  add column if not exists replied_at timestamptz,
  add column if not exists replied_by uuid references auth.users (id) on delete set null;
