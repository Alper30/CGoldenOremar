import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notifyShipped } from "@/lib/notify";

// Satıcı, mark_shipped RPC'si başarıyla tamamlandıktan sonra bu ucu çağırır.
// Güvenlik: e-posta içeriği tamamen SUNUCUDAKİ veriden kurulur; istemciden yalnız
// id alınır. Çağıranın o sipariş kaleminin satıcısı olduğu ve kaydın gerçekten
// kargolanmış olduğu doğrulanır — uç, keyfî e-posta tetikletmek için kullanılamaz.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { orderVendorId } = await req.json().catch(() => ({}));
  if (!orderVendorId) {
    return NextResponse.json({ error: "orderVendorId gerekli" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });

  // RLS satıcının yalnız kendi kayıtlarını görmesine izin verir; kayıt dönüyorsa
  // çağıran bu kalemin satıcısıdır. Yine de kargolanmış olduğunu açıkça doğrula.
  const { data: ov } = await supabase
    .from("order_vendors")
    .select("id, tracking_no, vendor_profiles!inner(user_id)")
    .eq("id", orderVendorId)
    .single();

  const ownerId = (ov?.vendor_profiles as unknown as { user_id: string | null } | null)
    ?.user_id;
  if (!ov || ownerId !== user.id) {
    return NextResponse.json({ error: "Kayıt bulunamadı" }, { status: 404 });
  }
  if (!ov.tracking_no) {
    return NextResponse.json({ error: "Kargo bilgisi yok" }, { status: 400 });
  }

  await notifyShipped(orderVendorId);
  return NextResponse.json({ ok: true });
}
