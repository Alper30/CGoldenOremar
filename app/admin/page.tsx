import { Dashboard } from "@/components/admin/dashboard/dashboard";

export const metadata = { title: "Gösterge Paneli · Yönetim" };

export default function AdminHome() {
  // Veri istemcide admin_dashboard RPC'sinden (tarih aralığı seçilebilir) gelir.
  return <Dashboard />;
}
