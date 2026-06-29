import { getMyVendor } from "@/lib/vendor";
import { StoreSettingsForm } from "@/components/panel/StoreSettingsForm";

export const metadata = { title: "Mağaza Ayarları · Golden Oremar" };

export default async function VendorSettingsPage() {
  const vendor = await getMyVendor();
  if (!vendor) return null;
  return <StoreSettingsForm vendor={vendor} />;
}
