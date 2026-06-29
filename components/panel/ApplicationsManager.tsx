"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "../store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type App = {
  id: string;
  store_name: string;
  person: string;
  tc_no: string;
  iban: string;
  phone: string;
  province: string | null;
  district: string | null;
  story: string | null;
  document_url: string | null;
  document_back_url: string | null;
  selfie_url: string | null;
  created_at: string;
};

export function ApplicationsManager({ applications }: { applications: App[] }) {
  const { t } = useStore();
  if (applications.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
        {t("adNoApps")}
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-4 font-display text-2xl text-foreground">{t("adApplications")}</h1>
      <div className="space-y-4">
        {applications.map((a) => (
          <AppCard key={a.id} app={a} />
        ))}
      </div>
    </div>
  );
}

function AppCard({ app }: { app: App }) {
  const { t, toast } = useStore();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  async function viewFile(path: string | null) {
    if (!path) return;
    const supabase = createSupabaseBrowserClient();
    const { data } = await supabase.storage.from("kyc").createSignedUrl(path, 120);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank", "noopener");
  }

  async function approve() {
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("approve_vendor_application", { p_app_id: app.id });
    setBusy(false);
    if (error) return toast(t("coError"));
    toast(t("adDone"));
    router.refresh();
  }

  async function reject() {
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.rpc("reject_vendor_application", {
      p_app_id: app.id,
      p_reason: reason || "—",
    });
    setBusy(false);
    if (error) return toast(t("coError"));
    toast(t("adDone"));
    router.refresh();
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg text-foreground">{app.store_name}</p>
          <p className="text-sm text-muted-foreground">
            {app.person} · {app.phone}
          </p>
          <p className="mt-1 text-sm text-foreground/80">
            TC: {app.tc_no} · IBAN: {app.iban}
          </p>
          <p className="text-sm text-muted-foreground">
            {app.district}
            {app.district && app.province ? " / " : ""}
            {app.province}
          </p>
          {app.story && <p className="mt-2 max-w-xl text-sm text-foreground/70">{app.story}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => viewFile(app.document_url)}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40"
          >
            {t("soDocFront")}
          </button>
          <button
            onClick={() => viewFile(app.document_back_url)}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40"
          >
            {t("soDocBack")}
          </button>
          <button
            onClick={() => viewFile(app.selfie_url)}
            className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-foreground hover:border-primary/40"
          >
            {t("soSelfie")}
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
        <button
          onClick={approve}
          disabled={busy}
          className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60"
        >
          {t("adApprove")}
        </button>
        {!rejecting ? (
          <button
            onClick={() => setRejecting(true)}
            className="rounded-full border border-border px-5 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
          >
            {t("adReject")}
          </button>
        ) : (
          <div className="flex flex-1 items-center gap-2">
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("adRejectReason")}
              className="h-10 flex-1 rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-gold"
            />
            <button
              onClick={reject}
              disabled={busy}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
            >
              {t("adReject")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
