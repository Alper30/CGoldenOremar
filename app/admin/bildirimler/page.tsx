import { emailEnabled } from "@/lib/email";
import { Card } from "@/components/ui/card";
import { CheckCircle2, AlertTriangle, Mail } from "lucide-react";

export const metadata = { title: "Bildirimler · Yönetim" };

// Otomatik e-posta bildirimlerinin durumu ve kapsamı. Kampanya/push
// bildirimleri ileriki fazda; buradaki tablo mevcut otomasyonu belgeler.
const FLOWS = [
  {
    event: "Ödeme tamamlandı",
    to: "Alıcı",
    content: "Sipariş onayı — kalemler, tutar, teslimat adresi, escrow bilgisi",
  },
  {
    event: "Ödeme tamamlandı",
    to: "İlgili satıcı(lar)",
    content: "Yeni sipariş — yalnız kendi kalemleri, kargo talimatı",
  },
  {
    event: "Satıcı kargoladı",
    to: "Alıcı",
    content: "Kargo firması + takip numarası, teslim onayı hatırlatması",
  },
  {
    event: "KYC başvurusu onaylandı",
    to: "Satıcı adayı",
    content: "Mağaza açıldı — satıcı paneline yönlendirme",
  },
  {
    event: "KYC başvurusu reddedildi",
    to: "Satıcı adayı",
    content: "Red gerekçesi + yeniden başvuru bağlantısı",
  },
  {
    event: "Yardımlı kayıt (admin üretici ekledi)",
    to: "Üretici",
    content: "Mağaza açıldı bildirimi",
  },
];

export default function AdminNotificationsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card
        className={`flex-row items-start gap-4 p-5 ${
          emailEnabled ? "border-emerald-500/30" : "border-amber-500/40"
        }`}
      >
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
            emailEnabled ? "bg-emerald-500/10 text-emerald-600" : "bg-amber-500/10 text-amber-600"
          }`}
        >
          {emailEnabled ? <CheckCircle2 className="size-5" /> : <AlertTriangle className="size-5" />}
        </span>
        <div>
          <p className="font-semibold text-foreground">
            E-posta gönderimi {emailEnabled ? "aktif" : "yapılandırılmadı"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {emailEnabled
              ? "RESEND_API_KEY tanımlı; aşağıdaki olaylarda otomatik e-posta gönderilir."
              : "RESEND_API_KEY tanımlı değil. Bildirimler atlanıyor (sunucu loguna yazılıyor). Vercel ortam değişkenlerine RESEND_API_KEY ve EMAIL_FROM ekleyin; domaini Resend'de doğrulayın."}
          </p>
        </div>
      </Card>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Mail className="size-4 text-muted-foreground" />
          <h2 className="text-sm font-semibold text-foreground">
            Otomatik bildirim kapsamı
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Olay</th>
                <th className="px-4 py-3 font-medium">Alıcı</th>
                <th className="px-4 py-3 font-medium">İçerik</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {FLOWS.map((f, i) => (
                <tr key={i}>
                  <td className="px-4 py-3 font-medium text-foreground">{f.event}</td>
                  <td className="px-4 py-3">{f.to}</td>
                  <td className="px-4 py-3 text-muted-foreground">{f.content}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Kampanya duyuruları ve push bildirimleri bir sonraki fazda (mobil uygulama
        ile birlikte) planlanmıştır.
      </p>
    </div>
  );
}
