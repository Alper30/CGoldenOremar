import { SectionPlaceholder } from "@/components/admin/section-placeholder";

export const metadata = { title: "Aktivite Kaydı · Yönetim" };

export default function Page() {
  return (
    <SectionPlaceholder
      title="Aktivite Kaydı"
      description="Yönetici işlemleri ve sistem olaylarının denetim kaydı (audit log) burada listelenecek."
    />
  );
}
