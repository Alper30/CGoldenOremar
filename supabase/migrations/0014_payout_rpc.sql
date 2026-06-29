-- KRİTİK MİMARİ: payout "ödendi" işaretlemesini guard'lı RPC'ye taşı.
-- Sorun: PayoutsManager doğrudan `update payouts set status='paid'` yapıyordu
-- (0011'deki geniş admin UPDATE politikası üzerinden). Bu, "para tabloları yalnız
-- RPC ile yazılır" ilkesini bozuyor ve admin'in REST üzerinden amount gibi alanları
-- değiştirmesine kapı aralıyordu.
--
-- Not: bakiye, payout TALEP edilirken (request_payout) zaten düşülür. Bu yüzden
-- burada TEKRAR düşülmez (çift kesinti olmaz) — yalnızca durum geçişi yapılır.

-- Geniş doğrudan-yazma politikasını kaldır → tüm payout yazımı RPC'den geçsin.
drop policy if exists "payout: admin günceller" on public.payouts;

create or replace function public.mark_payout_paid(p_payout_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare v_id uuid;
begin
  if not private.is_admin() then raise exception 'Yalnızca yönetici'; end if;
  update public.payouts
    set status = 'paid', processed_at = now()
  where id = p_payout_id and status in ('pending', 'processing')
  returning id into v_id;
  if v_id is null then raise exception 'Payout bulunamadı veya zaten ödendi'; end if;
end; $$;

revoke execute on function public.mark_payout_paid(uuid) from public, anon;
grant execute on function public.mark_payout_paid(uuid) to authenticated;
