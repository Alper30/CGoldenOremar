-- WP-0: escrow oto-onay zamanlaması
create extension if not exists pg_cron;

-- Var olan işi temizle (idempotent), sonra her gün 03:00 UTC'de çalıştır.
do $$
begin
  perform cron.unschedule('auto-confirm-escrow');
exception when others then null;
end $$;

select cron.schedule(
  'auto-confirm-escrow',
  '0 3 * * *',
  $$select private.auto_confirm_escrow();$$
);
