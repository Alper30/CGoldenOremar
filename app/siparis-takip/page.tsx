import { getAuthSnapshot } from "@/lib/auth";
import { fetchMyOrders } from "@/lib/orders";
import { ShipmentTracker } from "@/components/ShipmentTracker";
import type { AnyOrder } from "@/components/OrderCard";

export const metadata = { title: "Sipariş Takip · Golden Oremar" };

export default async function TrackingPage() {
  const { user } = await getAuthSnapshot();
  const orders = user ? await fetchMyOrders() : [];

  return (
    <ShipmentTracker
      orders={orders as unknown as AnyOrder[]}
      signedIn={!!user}
    />
  );
}
