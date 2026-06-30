import { redirect } from "next/navigation";

// /dashboard, /hesabim ile aynı işlevi görüyordu (tekrar). Tek doğru kaynak /hesabim;
// eski bağlantılar/OAuth dönüşleri kırılmasın diye burası ona yönlendirir.
export default function DashboardPage() {
  redirect("/hesabim");
}
