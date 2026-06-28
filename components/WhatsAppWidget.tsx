"use client";

import { useState } from "react";
import { ChatIcon, XIcon, ArrowRightIcon, SearchIcon } from "./icons";

// Türkiye destek hattı (gerçek numara)
const WA_NUMBER = "905379594851";

const quickReplies = [
  "Siparişimin durumunu öğrenmek istiyorum",
  "Bir ürün hakkında bilgi almak istiyorum",
  "Randevu / çiftlik turu hakkında bilgi",
  "Toptan / işbirliği için iletişim",
];

function waLink(text: string) {
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
}

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Sohbet paneli */}
      {open && (
        <div className="w-[88vw] max-w-sm overflow-hidden rounded-2xl border border-line bg-card shadow-[0_24px_60px_-20px_rgba(31,39,28,0.5)]">
          {/* Başlık */}
          <div className="flex items-center gap-3 bg-success px-4 py-3.5 text-white">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
              <ChatIcon className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">Golden Oremar Destek</p>
              <p className="flex items-center gap-1.5 text-xs text-white/85">
                <span className="h-2 w-2 rounded-full bg-white" />
                Çevrimiçi · genellikle hızlı yanıt
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Kapat"
              className="rounded-full p-1 text-white/90 transition-colors hover:bg-white/20"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Gövde */}
          <div className="space-y-3 bg-canvas px-4 py-4">
            <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-card px-3.5 py-2.5 text-sm text-ink shadow-sm">
              Merhaba! Golden Oremar destek ekibine hoş geldiniz. Size nasıl
              yardımcı olabiliriz?
            </div>

            <p className="pt-1 text-xs font-semibold uppercase tracking-wide text-muted">
              Hızlı seçenekler
            </p>
            <div className="flex flex-col gap-2">
              {quickReplies.map((q) => (
                <a
                  key={q}
                  href={waLink(q)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-line bg-card px-3.5 py-2.5 text-left text-sm text-forest-deep transition-colors hover:border-success/50 hover:bg-success/5"
                >
                  {q}
                </a>
              ))}
            </div>
          </div>

          {/* Mesaj kutusu */}
          <div className="flex items-center gap-2 border-t border-line bg-card p-3">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && msg.trim()) {
                    window.open(waLink(msg), "_blank");
                  }
                }}
                placeholder="Mesajınızı yazın…"
                className="h-10 w-full rounded-full border border-line bg-cream pl-9 pr-3 text-sm text-ink outline-none placeholder:text-muted focus:border-success"
              />
            </div>
            <a
              href={waLink(msg.trim() || "Merhaba, bilgi almak istiyorum.")}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp'ta aç"
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-full bg-success px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Gönder
              <ArrowRightIcon className="h-4 w-4" />
            </a>
          </div>
        </div>
      )}

      {/* Yüzen buton */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Destek penceresini kapat" : "WhatsApp destek"}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-success text-white shadow-lg transition-transform hover:scale-105"
      >
        {!open && (
          <span className="absolute inset-0 animate-ping rounded-full bg-success/40" />
        )}
        {open ? <XIcon className="h-6 w-6" /> : <ChatIcon className="h-7 w-7" />}
      </button>
    </div>
  );
}
