"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Mail, Phone, Calendar, Clock, Users } from "lucide-react";
import { setBookingStatus } from "@/app/admin/randevular/actions";

export type Booking = {
  id: string;
  experience_type: string;
  guests: number;
  booking_date: string;
  booking_time: string;
  name: string;
  email: string;
  phone: string;
  notes: string | null;
  status: string;
  created_at: string;
};

const STATUS: Record<string, { label: string; cls: string }> = {
  new: { label: "Yeni", cls: "bg-gold/15 text-gold" },
  confirmed: { label: "Onaylandı", cls: "bg-green-50 text-green-700" },
  done: { label: "Tamamlandı", cls: "bg-muted text-muted-foreground" },
  cancelled: { label: "İptal", cls: "bg-red-50 text-red-700" },
};

const NEXT: { value: string; label: string }[] = [
  { value: "confirmed", label: "Onayla" },
  { value: "done", label: "Tamamlandı" },
  { value: "cancelled", label: "İptal et" },
  { value: "new", label: "Yeniye al" },
];

const fmtTs = (iso: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));

const fmtDate = (d: string) =>
  new Intl.DateTimeFormat("tr-TR", { dateStyle: "full" }).format(new Date(d));

function BookingCard({ b }: { b: Booking }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const st = STATUS[b.status] ?? STATUS.new;
  const closed = b.status === "done" || b.status === "cancelled";

  function change(status: string) {
    setErr(null);
    startTransition(async () => {
      const res = await setBookingStatus(b.id, status);
      if ("error" in res) setErr(res.error);
      else router.refresh();
    });
  }

  return (
    <Card className={`gap-3 p-5 ${closed ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-foreground">{b.experience_type}</p>
          <p className="text-sm text-muted-foreground">
            {b.name} · talep {fmtTs(b.created_at)}
          </p>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${st.cls}`}>{st.label}</span>
      </div>

      <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-foreground/90">
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="size-3.5 text-gold" /> {fmtDate(b.booking_date)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5 text-gold" /> {b.booking_time}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Users className="size-3.5 text-gold" /> {b.guests} misafir
        </span>
      </div>

      {b.notes && <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/80">{b.notes}</p>}

      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <a href={`mailto:${b.email}`} className="inline-flex items-center gap-1 hover:text-foreground">
          <Mail className="size-3.5" /> {b.email}
        </a>
        <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1 hover:text-foreground">
          <Phone className="size-3.5" /> {b.phone}
        </a>
      </div>

      {err && <p className="text-xs text-red-600">{err}</p>}

      <div className="flex flex-wrap gap-2">
        {NEXT.filter((n) => n.value !== b.status).map((n) => (
          <button
            key={n.value}
            type="button"
            onClick={() => change(n.value)}
            disabled={pending}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted disabled:opacity-60"
          >
            {n.label}
          </button>
        ))}
      </div>
    </Card>
  );
}

export function BookingsList({ bookings }: { bookings: Booking[] }) {
  const active = bookings.filter((b) => b.status === "new" || b.status === "confirmed");
  const past = bookings.filter((b) => b.status === "done" || b.status === "cancelled");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-2xl text-foreground">Randevular</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          /randevu formundan gelen deneyim talepleri. Onaylayın, tamamlayın veya iptal edin.
        </p>
      </div>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-foreground">Aktif talepler ({active.length})</h2>
        {active.length === 0 && (
          <Card className="items-center p-10 text-center text-sm text-muted-foreground">
            Bekleyen randevu talebi yok.
          </Card>
        )}
        {active.map((b) => (
          <BookingCard key={b.id} b={b} />
        ))}
      </section>

      {past.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground">Geçmiş ({past.length})</h2>
          {past.map((b) => (
            <BookingCard key={b.id} b={b} />
          ))}
        </section>
      )}
    </div>
  );
}
