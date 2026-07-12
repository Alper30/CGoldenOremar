import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "../database.types";

type BrowserClient = ReturnType<typeof createBrowserClient<Database>>;

// Tarayıcı (client component) istemcisi. Oturum çerezini localStorage yerine
// cookie üzerinden taşır; böylece sunucu da aynı oturumu görür.
//
// GLOBAL SINGLETON: her çağrıda yeni client üretmek birden fazla GoTrueClient
// örneği yaratıyordu → aynı auth-token storage anahtarında Web Locks çekişmesi →
// .rpc()/sorgu çağrıları sonsuza dek asılı kalıp (admin dashboard sonsuz
// skeleton) oluyordu. Modül-düzeyi `let` yetmez: dev/prod bundle'da bu modül
// birden çok chunk'a kopyalanabildiği için her kopya kendi örneğini alıyordu.
// Bu yüzden örneği globalThis üzerinde tutuyoruz → sayfada TEK client garanti.
const GLOBAL_KEY = "__goBrowserSupabase__";

function makeClient(): BrowserClient {
  return createBrowserClient<Database>(
    // `.invalid` (RFC 2606) çözümlenemez → env yokken kimlik bilgisi dışarı sızmaz.
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.invalid",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "invalid-anon-key",
    {
      auth: {
        // KRİTİK — navigator.locks DEADLOCK'unu tamamen kaldır.
        // Varsayılan kilit `navigator.locks` kullanır ve TÜM aynı-origin sekmeler
        // arasında paylaşılır: bir sekme/instance kilidi tutup serbest bırakmazsa
        // (çoklu GoTrueClient, asılı init, kapanmış sekme) diğer her .rpc()/sorgu
        // token'ı almak için kilidi beklerken HTTP isteğini HİÇ GÖNDERMEDEN sonsuza
        // dek asılıyordu (checkout "İşleniyor…"da kalıyordu, Network paneli boştu).
        // Oturum kaynağı cookie + middleware refresh olduğundan sekmeler-arası kilide
        // ihtiyaç yok. No-op kilit: fonksiyonu doğrudan çalıştır → asla bloklanmaz.
        lock: <R,>(_name: string, _acquireTimeout: number, fn: () => Promise<R>) => fn(),
      },
    },
  );
}

export function createSupabaseBrowserClient(): BrowserClient {
  // Sunucuda (SSR) global paylaşımı istemeyiz; her çağrıda yenisi güvenli.
  if (typeof window === "undefined") return makeClient();

  const g = globalThis as typeof globalThis & { [GLOBAL_KEY]?: BrowserClient };
  if (!g[GLOBAL_KEY]) g[GLOBAL_KEY] = makeClient();
  return g[GLOBAL_KEY];
}
