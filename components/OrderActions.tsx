"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "./store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

// Alıcı eylemleri: teslim onayı (escrow serbest) / sorun bildir (ihtilaf).
export function OrderActions({
  orderVendorId,
  escrow,
}: {
  orderVendorId: string;
  escrow: string;
}) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  if (escrow !== "shipped" && escrow !== "delivered") return null;

  async function act(fn: "confirm_received" | "open_dispute") {
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc(fn, { p_order_vendor_id: orderVendorId });
    setBusy(false);
    if (error) {
      toast(t("coError"));
      return;
    }
    toast(t(fn === "confirm_received" ? "ordConfirmed" : "ordDisputeOpened"));
    router.refresh();
  }

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button
        disabled={busy}
        onClick={() => act("confirm_received")}
        className="rounded-full bg-forest px-4 py-2 text-xs font-semibold text-cream transition-colors hover:bg-forest-deep disabled:opacity-60"
      >
        {t("ordConfirmReceive")}
      </button>
      <button
        disabled={busy}
        onClick={() => act("open_dispute")}
        className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted transition-colors hover:border-red-300 hover:text-red-600 disabled:opacity-60"
      >
        {t("ordOpenDispute")}
      </button>
    </div>
  );
}
