"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { dicts, tr, type Lang } from "@/lib/i18n";

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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
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
    (slug: string) =>
      setFavs((f) => (f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug])),
    [],
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
