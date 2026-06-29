"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "go-admin-theme";

// Koyu/açık sınıfı yalnız #admin-root (.admin-scope) üzerinde değişir → public
// site etkilenmez. Varsayılan: koyu (kontrol paneli görünümü).
function root() {
  return typeof document !== "undefined" ? document.getElementById("admin-root") : null;
}

export function useAdminTheme() {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Kayıtlı tercihi geri yükle (SSR varsayılanı koyu); yoksa koyu kalır.
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch {
      /* yok say */
    }
    const next: Theme = saved === "light" ? "light" : "dark";
    const el = root();
    if (el) el.classList.toggle("dark", next === "dark");
    setThemeState(next);
    setMounted(true);
  }, []);

  const applyTheme = useCallback((next: Theme) => {
    const el = root();
    if (el) el.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* yok say */
    }
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(
    () => applyTheme(theme === "dark" ? "light" : "dark"),
    [theme, applyTheme],
  );

  return { theme, setTheme: applyTheme, toggleTheme, mounted };
}
