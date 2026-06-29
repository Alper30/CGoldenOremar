"use client";

import { useStore } from "./store";
import { OrderCard, type AnyOrder } from "./OrderCard";

export function OrdersList({ orders }: { orders: AnyOrder[] }) {
  const { t } = useStore();
  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-line bg-card p-10 text-center text-muted">
        {t("accNoOrders")}
      </div>
    );
  }
  return (
    <div className="space-y-5">
      {orders.map((o) => (
        <OrderCard key={o.id} order={o} />
      ))}
    </div>
  );
}
