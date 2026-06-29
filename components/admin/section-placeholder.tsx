import { Hammer } from "lucide-react";
import { Card } from "@/components/ui/card";

export function SectionPlaceholder({ title, description }: { title: string; description?: string }) {
  return (
    <Card className="items-center justify-center gap-4 px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <Hammer className="size-6" />
      </div>
      <div className="max-w-md">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          {description ??
            "Bu bölüm bir sonraki aşamada tam işlevsellikle (tablo, filtre, detay ve aksiyonlar) doldurulacak."}
        </p>
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/15 px-3 py-1 text-xs font-medium text-gold">
        Yakında
      </span>
    </Card>
  );
}
