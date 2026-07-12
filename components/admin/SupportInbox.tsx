"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Mail, Phone, CheckCircle2, Send } from "lucide-react";
import { sendSupportReply, closeSupport } from "@/app/admin/destek/actions";

export type SupportMessage = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  body: string;
  status: string;
  created_at: string;
  reply_body: string | null;
  replied_at: string | null;
};

const fmtTs = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

const STATUS: Record<string, { label: string; cls: string }> = {
  open: { label: "Açık", cls: "bg-gold/15 text-gold" },
  answered: { label: "Yanıtlandı", cls: "bg-green-50 text-green-700" },
  closed: { label: "Kapatıldı", cls: "bg-muted text-muted-foreground" },
};

function MessageCard({ msg }: { msg: SupportMessage }) {
  const router = useRouter();
  const [reply, setReply] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const st = STATUS[msg.status] ?? STATUS.open;
  const closed = msg.status === "closed";

  function submitReply() {
    if (!reply.trim()) return;
    setErr(null);
    startTransition(async () => {
      const res = await sendSupportReply(msg.id, reply);
      if ("error" in res) setErr(res.error);
      else {
        setReply("");
        router.refresh();
      }
    });
  }

  function close() {
    setErr(null);
    startTransition(async () => {
      const res = await closeSupport(msg.id);
      if ("error" in res) setErr(res.error);
      else router.refresh();
    });
  }

  return (
    <Card className={`gap-3 p-5 ${closed ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-foreground">{msg.subject}</p>
          <p className="text-sm text-muted-foreground">
            {msg.name} · {fmtTs(msg.created_at)}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${st.cls}`}>{st.label}</span>
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
      </div>

      {msg.reply_body && (
        <div className="rounded-xl border border-border bg-muted/40 p-3">
          <p className="mb-1 text-xs font-semibold text-muted-foreground">
            Yanıtınız{msg.replied_at ? ` · ${fmtTs(msg.replied_at)}` : ""}
          </p>
          <p className="whitespace-pre-wrap text-sm text-foreground/90">{msg.reply_body}</p>
        </div>
      )}

      {!closed && (
        <div className="flex flex-col gap-2">
          <textarea
            rows={3}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder={msg.reply_body ? "Ek yanıt yaz…" : "Müşteriye yanıt yaz — e-posta ile gönderilir…"}
            className="w-full resize-none rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold"
          />
          {err && <p className="text-xs text-red-600">{err}</p>}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={submitReply}
              disabled={pending || !reply.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gold px-3 py-1.5 text-xs font-semibold text-cream transition-colors hover:bg-gold-deep disabled:opacity-60"
            >
              <Send className="size-3.5" />
              {pending ? "Gönderiliyor…" : "Yanıtla ve gönder"}
            </button>
            <button
              type="button"
              onClick={close}
              disabled={pending}
              className="ml-auto inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
            >
              <CheckCircle2 className="size-3.5" />
              Kapat
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

export function SupportInbox({ messages }: { messages: SupportMessage[] }) {
  const active = messages.filter((m) => m.status !== "closed");
  const closed = messages.filter((m) => m.status === "closed");

  return (
    <div className="flex flex-col gap-6">
      <p className="text-sm text-muted-foreground">
        İletişim formundan gelen mesajlar. Panelden yanıtlayın (müşteriye e-posta gider),
        sonra kaydı kapatın.
      </p>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Açık talepler ({active.length})</h2>
        {active.length === 0 && (
          <Card className="items-center p-10 text-center text-sm text-muted-foreground">
            Bekleyen destek talebi yok.
          </Card>
        )}
        {active.map((m) => (
          <MessageCard key={m.id} msg={m} />
        ))}
      </section>

      {closed.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Kapatılanlar ({closed.length})</h2>
          {closed.map((m) => (
            <MessageCard key={m.id} msg={m} />
          ))}
        </section>
      )}
    </div>
  );
}
