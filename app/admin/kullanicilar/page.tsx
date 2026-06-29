import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Kullanıcılar · Yönetim" };

const roleLabel: Record<string, string> = {
  user: "Alıcı",
  vendor: "Satıcı",
  admin: "Yönetici",
};

export default async function AdminUsersPage() {
  const supabase = await createSupabaseServerClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, phone, role, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-forest-deep">Kullanıcılar</h1>
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-canvas text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Ad soyad</th>
              <th className="px-4 py-3 font-medium">Telefon</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Kayıt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(users ?? []).map((u) => (
              <tr key={u.id}>
                <td className="px-4 py-3 font-medium text-forest-deep">{u.full_name ?? "—"}</td>
                <td className="px-4 py-3 text-muted">{u.phone ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-canvas px-2 py-0.5 text-xs font-semibold text-forest">
                    {roleLabel[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted">
                  {new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium" }).format(new Date(u.created_at))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
