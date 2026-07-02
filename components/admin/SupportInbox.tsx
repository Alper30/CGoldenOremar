"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Mail, Phone, CheckCircle2 } from "lucide-react";

export type SupportMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  status: string;
  created_at: string;
};

const fmtTs = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(
    new Date(iso),
  );

function MessageCard({ msg, onClosed }: { msg: SupportMessage; onClosed: () => void }) {
  const [busy, setBusy] = useState(false);
  const open = msg.status === "open";

  async function close() {
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("support_messages")
      .update({ status: "closed", closed_at: new Date().toISOString(), closed_by: user?.id ?? null })
      .eq("id", msg.id);
    setBusy(false);
    if (!error) onClosed();
  }

  return (
    <Card className={`gap-3 p-5 ${open ? "" : "opacity-70"}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-foreground">{msg.subject}</p>
          <p className="text-sm text-muted-foreground">
            {msg.name} · {fmtTs(msg.created_at)}
          </p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            open ? "bg-gold/15 text-gold" : "bg-muted text-muted-foreground"
          }`}
        >
          {open ? "Açık" : "Kapatıldı"}
        </span>
      </div>

      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">{msg.body}</p>

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <a href={`mailto:${msg.email}`} className="inline-flex items-center gap-1 hover:text-foreground">
          <Mail className="size-3.5" /> {msg.email}
        </a>
        {msg.phone && (
          <a href={`tel:${msg.phone}`} className="inline-flex items-center gap-1 hover:text-foreground">
            <Phone className="size-3.5" /> {msg.phone}
          </a>
        )}
        {open && (
          <button
            type="button"
            onClick={close}
            disabled={busy}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            <CheckCircle2 className="size-3.5" />
            {busy ? "Kapatılıyor…" : "Çözüldü olarak kapat"}
          </button>
        )}
      </div>
    </Card>
  );
}

export function SupportInbox({ messages }: { messages: SupportMessage[] }) {
  const router = useRouter();
  const open = messages.filter((m) => m.status === "open");
  const closed = messages.filter((m) => m.status !== "open");

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        İletişim formundan gelen mesajlar. Yanıtı e-posta/telefonla verin, sonra
        kaydı kapatın.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          Açık talepler ({open.length})
        </h2>
        {open.length === 0 && (
          <Card className="items-center p-10 text-center text-sm text-muted-foreground">
            Bekleyen destek talebi yok.
          </Card>
        )}
        {open.map((m) => (
          <MessageCard key={m.id} msg={m} onClosed={() => router.refresh()} />
        ))}
      </section>

      {closed.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">
            Kapatılanlar ({closed.length})
          </h2>
          {closed.map((m) => (
            <MessageCard key={m.id} msg={m} onClosed={() => router.refresh()} />
          ))}
        </section>
      )}
    </div>
  );
}
