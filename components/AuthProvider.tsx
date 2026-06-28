"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { AuthSnapshot, Profile } from "@/lib/auth";

type AuthContextValue = {
  userId: string | null;
  email: string | null;
  profile: Profile | null;
  isVendor: boolean;
  isAdmin: boolean;
  signedIn: boolean;
};

const Ctx = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error("AuthProvider eksik");
  return c;
}

export function AuthProvider({
  initial,
  children,
}: {
  initial: AuthSnapshot;
  children: React.ReactNode;
}) {
  const [userId, setUserId] = useState<string | null>(initial.user?.id ?? null);
  const [email, setEmail] = useState<string | null>(initial.user?.email ?? null);
  const [profile, setProfile] = useState<Profile | null>(initial.profile);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    // Giriş/çıkış anında istemci durumunu senkronla. Profil rolünü tazelemek
    // için SIGNED_IN olayında profiles tablosunu yeniden çekeriz.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const u = session?.user ?? null;
      setUserId(u?.id ?? null);
      setEmail(u?.email ?? null);
      if (u) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", u.id)
          .single();
        setProfile(data ?? null);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      userId,
      email,
      profile,
      isVendor: profile?.role === "vendor",
      isAdmin: profile?.role === "admin",
      signedIn: !!userId,
    }),
    [userId, email, profile],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
