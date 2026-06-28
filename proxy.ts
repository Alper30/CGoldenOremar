import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Her istekte Supabase oturum token'ını tazeler ve çerezleri hem isteğe hem
// yanıta yazar. Bu olmadan access token süresi dolunca kullanıcı sessizce düşer.
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  // ÖNEMLİ: getUser() çağrısı token'ı doğrular/tazeler. Aradaki kod kaldırılmamalı.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    // Statik dosyalar ve görseller hariç tüm yollar
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
