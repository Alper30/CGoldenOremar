"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setUserRole, setUserSuspended } from "@/app/admin/kullanicilar/actions";

export type AdminUser = {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: string;
  suspended: boolean;
  created_at: string;
};

const roleLabel: Record<string, string> = { user: "Alıcı", vendor: "Satıcı", admin: "Yönetici" };
const ROLES = ["user", "vendor", "admin"];

function Row({ u }: { u: AdminUser }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  function run(fn: () => Promise<{ ok: true } | { error: string }>) {
    setErr(null);
    startTransition(async () => {
      const res = await fn();
      if ("error" in res) setErr(res.error);
      else router.refresh();
    });
  }

  return (
    <tr className={u.suspended ? "bg-red-50/40" : ""}>
      <td className="px-4 py-3 font-medium text-foreground">{u.full_name ?? "—"}</td>
      <td className="px-4 py-3 text-muted-foreground">{u.phone ?? "—"}</td>
      <td className="px-4 py-3">
        <select
          value={u.role}
          disabled={pending}
          onChange={(e) => run(() => setUserRole(u.id, e.target.value))}
          className="rounded-lg border border-border bg-card px-2 py-1 text-xs font-semibold text-foreground disabled:opacity-60"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {roleLabel[r]}
            </option>
          ))}
        </select>
      </td>
      <td className="px-4 py-3">
        {u.suspended ? (
          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700">Askıda</span>
        ) : (
          <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">Aktif</span>
        )}
      </td>
      <td className="px-4 py-3 text-muted-foreground">
        {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(u.created_at))}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => setUserSuspended(u.id, !u.suspended))}
          className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-60 ${
            u.suspended
              ? "border-green-200 text-green-700 hover:bg-green-50"
              : "border-red-200 text-red-700 hover:bg-red-50"
          }`}
        >
          {u.suspended ? "Askıyı kaldır" : "Askıya al"}
        </button>
        {err && <p className="mt-1 text-right text-xs text-red-600">{err}</p>}
      </td>
    </tr>
  );
}

export function UsersTable({ users }: { users: AdminUser[] }) {
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-foreground">Kullanıcılar</h1>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Ad soyad</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Durum</th>
              <th className="px-4 py-3 font-medium">Kayıt</th>
              <th className="px-4 py-3 text-right font-medium">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <Row key={u.id} u={u} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
