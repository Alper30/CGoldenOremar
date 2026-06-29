import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Her istekte Supabase oturum token'ını tazeler ve çerezleri hem isteğe hem
// yanıta yazar. Bu olmadan access token süresi dolunca kullanıcı sessizce düşer.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Her istekte çalışır → fail-open olmalı: oturum tazeleme başarısız olsa bile
  // (env eksik/bozuk, ağ hatası vb.) sayfayı yine de servis et, ASLA 500 atma.
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.invalid",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "invalid-anon-key",
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.next({ request });
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

    // getUser() token'ı doğrular/tazeler.
    await supabase.auth.getUser();
  } catch (e) {
    console.error("[proxy] oturum tazeleme atlandı:", e);
  }

  return response;
}

export const config = {
  matcher: [
    // Statik dosyalar ve görseller hariç tüm yollar
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
