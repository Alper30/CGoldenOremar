import { redirect } from "next/navigation";
import { getAuthSnapshot } from "@/lib/auth";
import { VendorNav } from "@/components/panel/VendorNav";

// Rol guard: yalnız satıcılar. Alıcı → başvuruya, misafir → girişe yönlenir.
export default async function VendorPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = await getAuthSnapshot();
  if (!user) redirect("/giris");
  if (profile?.role !== "vendor") redirect("/satici-ol");

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <VendorNav />
      {children}
    </div>
  );
}
