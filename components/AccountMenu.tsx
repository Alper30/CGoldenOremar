"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthProvider";
import { useStore } from "./store";
import { logoutAction } from "@/app/giris/actions";
import { PersonIcon, BagPlusIcon } from "./icons";

export function AccountMenu() {
  const { signedIn, profile, email, isVendor, isAdmin } = useAuth();
  const { t } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  if (!signedIn) {
    return (
      <>
        <Link
          href="/giris"
          className="ml-1 hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-forest transition-colors hover:bg-canvas lg:flex"
        >
          <PersonIcon className="h-4 w-4" />
          {t("navLogin")}
        </Link>
        <Link
          href="/kayit"
          className="ml-1 hidden items-center gap-1.5 rounded-full bg-gold px-4 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-gold-deep sm:flex"
        >
          <BagPlusIcon className="h-4 w-4" />
          {t("navSell")}
        </Link>
      </>
    );
  }

  const display = (profile?.full_name || email || "").split(" ")[0] || t("navAccount");

  return (
    <div ref={ref} className="relative ml-1">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 rounded-full border border-line px-3 py-2 text-sm font-semibold text-forest transition-colors hover:bg-canvas"
      >
        <PersonIcon className="h-4 w-4" />
        <span className="hidden max-w-24 truncate sm:inline">{display}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-line bg-card py-1.5 shadow-lg">
          <div className="border-b border-line px-4 py-2">
            <p className="truncate text-sm font-semibold text-forest-deep">
              {profile?.full_name || t("navAccount")}
            </p>
            {email && <p className="truncate text-xs text-muted">{email}</p>}
          </div>

          <MenuLink href="/hesabim" onClick={() => setOpen(false)}>
            {t("navAccount")}
          </MenuLink>

          {isVendor && (
            <MenuLink href="/satici-panel" onClick={() => setOpen(false)}>
              {t("navVendorPanel")}
            </MenuLink>
          )}
          {isAdmin && (
            <MenuLink href="/admin" onClick={() => setOpen(false)}>
              {t("navAdmin")}
            </MenuLink>
          )}
          {!isVendor && !isAdmin && (
            <MenuLink href="/kayit" onClick={() => setOpen(false)}>
              {t("navSell")}
            </MenuLink>
          )}

          <form action={logoutAction} className="border-t border-line">
            <button
              type="submit"
              className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              {t("navLogout")}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas"
    >
      {children}
    </Link>
  );
}
