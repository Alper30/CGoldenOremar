import { createSupabaseServerClient } from "@/lib/supabase/server";
import { fmtPrice } from "@/lib/data";

export const metadata = { title: "Satıcılar · Yönetim" };

export default async function AdminVendorsPage() {
  const supabase = await createSupabaseServerClient();
  const { data: vendors } = await supabase
    .from("vendor_profiles")
    .select("id, name, person, location, balance, rating, units_sold, verified")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-forest-deep">Satıcılar</h1>
      <div className="overflow-x-auto rounded-2xl border border-line bg-card">
        <table className="w-full text-sm">
          <thead className="bg-canvas text-left text-xs text-muted">
            <tr>
              <th className="px-4 py-3 font-medium">Mağaza</th>
              <th className="px-4 py-3 font-medium">Üretici</th>
              <th className="px-4 py-3 font-medium">Konum</th>
              <th className="px-4 py-3 font-medium">Puan</th>
              <th className="px-4 py-3 text-right font-medium">Bakiye</th>
              <th className="px-4 py-3 text-center font-medium">KYC</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {(vendors ?? []).map((v) => (
              <tr key={v.id}>
                <td className="px-4 py-3 font-medium text-forest-deep">{v.name}</td>
                <td className="px-4 py-3 text-muted">{v.person}</td>
                <td className="px-4 py-3 text-muted">{v.location ?? "—"}</td>
                <td className="px-4 py-3 text-muted">
                  {v.rating} · {v.units_sold} satış
                </td>
                <td className="px-4 py-3 text-right font-display text-forest-deep">
                  {fmtPrice(Number(v.balance))}
                </td>
                <td className="px-4 py-3 text-center">
                  {v.verified ? (
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700">
                      ✓
                    </span>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
