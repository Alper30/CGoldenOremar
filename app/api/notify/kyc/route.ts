import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { notifyKycDecision } from "@/lib/notify";

// Admin, approve/reject RPC'si tamamlandıktan sonra bu ucu çağırır.
// notifyKycDecision içeriği sunucudaki başvuru kaydından kurar ve yalnızca
// status approved/rejected ise gönderir; uç keyfî e-posta tetikleyemez.
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { applicationId } = await req.json().catch(() => ({}));
  if (!applicationId) {
    return NextResponse.json({ error: "applicationId gerekli" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Giriş gerekli" }, { status: 401 });

  const { data: prof } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (prof?.role !== "admin") {
    return NextResponse.json({ error: "Yetkisiz" }, { status: 403 });
  }

  await notifyKycDecision(applicationId);
  return NextResponse.json({ ok: true });
}
