import { SectionPlaceholder } from "@/components/admin/section-placeholder";

export const metadata = { title: "Değerlendirmeler · Yönetim" };

export default function Page() {
  return (
    <SectionPlaceholder
      title="Değerlendirmeler"
      description="Ürün ve satıcı yorumlarının moderasyonu burada yapılacak (onay, gizleme, yanıt, şikâyet yönetimi)."
    />
  );
}
