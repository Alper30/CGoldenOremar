import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// OAuth (Google/Apple/GitHub) dönüş adresi. Sağlayıcı kullanıcıyı buraya
// `?code=...` ile geri yollar; kodu oturuma çevirip çerezleri yazarız.
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Güvenlik: yalnızca site içi göreli yola yönlendir (open-redirect engeli).
  const nextParam = searchParams.get("next") ?? "/";
  const next = nextParam.startsWith("/") ? nextParam : "/";

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // Hata: kullanıcıyı bilgilendiren bir bayrakla giriş sayfasına döndür.
  return NextResponse.redirect(`${origin}/giris?oauth_error=1`);
}
