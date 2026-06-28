-- Güvenlik sertleştirme: SECURITY DEFINER fonksiyonlarını dış REST RPC'den kapat
-- ve search_path'i sabitle. Trigger çağrıları bundan etkilenmez.

alter function public.touch_updated_at() set search_path = '';

revoke execute on function public.handle_new_user() from public;
revoke execute on function public.handle_new_user() from anon, authenticated;

revoke execute on function public.touch_updated_at() from public;
revoke execute on function public.touch_updated_at() from anon, authenticated;
