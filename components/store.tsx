"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { dicts, tr, type Lang } from "@/lib/i18n";
import { useAuth } from "./AuthProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export type CartItem = { slug: string; qty: number };
type Toast = { id: number; msg: string };

type Store = {
  hydrated: boolean;
  // dil
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  // sepet
  cart: CartItem[];
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartOpen: boolean;
  setCartOpen: (v: boolean) => void;
  // favoriler
  favs: string[];
  toggleFav: (slug: string) => void;
  isFav: (slug: string) => boolean;
  favCount: number;
  // bildirim
  toast: (msg: string) => void;
  toasts: Toast[];
};

const Ctx = createContext<Store | null>(null);

export function useStore() {
  const c = useContext(Ctx);
  if (!c) throw new Error("StoreProvider eksik");
  return c;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  // Favori senkronunda bayat closure'dan kaçınmak için son favori listesini ref'te tut.
  // Ref render'da değil effect'te güncellenir (event handler'lar commit sonrası okur).
  const favsRef = useRef<string[]>([]);
  useEffect(() => {
    favsRef.current = favs;
  }, [favs]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [lang, setLangState] = useState<Lang>("tr");

  // localStorage'dan yükle. Not: setState burada bilinçli — SSR'da localStorage
  // olmadığı için ilk render boş başlar, hidrasyon sonrası senkronlanır (mismatch önlenir).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      setCart(JSON.parse(localStorage.getItem("go_cart") || "[]"));
      setFavs(JSON.parse(localStorage.getItem("go_favs") || "[]"));
      const l = localStorage.getItem("go_lang");
      if (l === "tr" || l === "ku") setLangState(l);
    } catch {
      /* yoksay */
    }
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem("go_lang", l);
    } catch {
      /* yoksay */
    }
  }, []);

  const t = useCallback(
    (key: string) => dicts[lang][key] ?? tr[key] ?? key,
    [lang],
  );

  useEffect(() => {
    if (hydrated) localStorage.setItem("go_cart", JSON.stringify(cart));
  }, [cart, hydrated]);
  useEffect(() => {
    if (hydrated) localStorage.setItem("go_favs", JSON.stringify(favs));
  }, [favs, hydrated]);

  // Giriş yapınca: DB favorilerini yükle + yerel (localStorage) favorileri DB'ye
  // taşı (merge). Böylece favoriler kalıcı ve cihazlar arası senkron olur.
  useEffect(() => {
    if (!hydrated || !userId) return;
    let alive = true;
    (async () => {
      const supabase = createSupabaseBrowserClient();
      const { data } = await supabase.from("favorites").select("product_slug");
      if (!alive) return;
      const dbSlugs = (data ?? []).map((r) => r.product_slug);
      const local = favsRef.current;
      const toInsert = local.filter((s) => !dbSlugs.includes(s));
      if (toInsert.length) {
        await supabase
          .from("favorites")
          .upsert(toInsert.map((slug) => ({ user_id: userId, product_slug: slug })));
      }
      if (!alive) return;
      setFavs(Array.from(new Set([...local, ...dbSlugs])));
    })();
    return () => {
      alive = false;
    };
  }, [hydrated, userId]);

  const toast = useCallback((msg: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, msg }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600);
  }, []);

  const add = useCallback((slug: string, qty = 1) => {
    setCart((c) => {
      const ex = c.find((i) => i.slug === slug);
      if (ex) return c.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i));
      return [...c, { slug, qty }];
    });
  }, []);

  const setQty = useCallback(
    (slug: string, qty: number) =>
      setCart((c) =>
        qty <= 0
          ? c.filter((i) => i.slug !== slug)
          : c.map((i) => (i.slug === slug ? { ...i, qty } : i)),
      ),
    [],
  );

  const remove = useCallback(
    (slug: string) => setCart((c) => c.filter((i) => i.slug !== slug)),
    [],
  );
  const clearCart = useCallback(() => setCart([]), []);

  const toggleFav = useCallback(
    (slug: string) => {
      const has = favsRef.current.includes(slug);
      setFavs((f) =>
        has ? f.filter((s) => s !== slug) : f.includes(slug) ? f : [...f, slug],
      );
      // Girişliyse DB'ye yaz (upsert/delete idempotent → strict-mode çift çağrısı güvenli).
      if (userId) {
        const supabase = createSupabaseBrowserClient();
        if (has) {
          supabase
            .from("favorites")
            .delete()
            .eq("user_id", userId)
            .eq("product_slug", slug)
            .then(() => {});
        } else {
          supabase
            .from("favorites")
            .upsert({ user_id: userId, product_slug: slug })
            .then(() => {});
        }
      }
    },
    [userId],
  );

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const isFav = (slug: string) => favs.includes(slug);

  return (
    <Ctx.Provider
      value={{
        hydrated,
        lang,
        setLang,
        t,
        cart,
        add,
        setQty,
        remove,
        clearCart,
        cartCount,
        cartOpen,
        setCartOpen,
        favs,
        toggleFav,
        isFav,
        favCount: favs.length,
        toast,
        toasts,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}
