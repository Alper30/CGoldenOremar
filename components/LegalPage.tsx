import Link from "next/link";

// Yasal sayfaların (KVKK, gizlilik, mesafeli satış, iade) ortak iskeleti.
// İçerik sunucuda render edilir; sayfalar statik metin + bölüm listesi verir.

export type LegalSection = {
  title: string;
  // Her eleman bir paragraf; "- " ile başlayan ardışık elemanlar madde listesi olur.
  body: string[];
};

function renderBody(body: string[]) {
  const blocks: React.ReactNode[] = [];
  let list: string[] = [];
  const flush = (key: number) => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`ul-${key}`} className="list-disc space-y-1.5 pl-5">
        {list.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>,
    );
    list = [];
  };
  body.forEach((line, i) => {
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
    } else {
      flush(i);
      blocks.push(<p key={`p-${i}`}>{line}</p>);
    }
  });
  flush(body.length);
  return blocks;
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  updatedAt,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
}) {
  return (
    <div>
      <section className="border-b border-line bg-canvas">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-16">
          <p className="text-xs font-semibold uppercase tracking-wider text-gold">
            {eyebrow}
          </p>
          <h1 className="mt-2 font-display text-3xl text-forest-deep lg:text-4xl">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted">{intro}</p>
          <p className="mt-4 text-xs text-muted">Son güncelleme: {updatedAt}</p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="space-y-10">
          {sections.map((s, i) => (
            <div key={i}>
              <h2 className="font-display text-xl text-forest-deep">
                {i + 1}. {s.title}
              </h2>
              <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">
                {renderBody(s.body)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-line bg-canvas p-6 text-sm text-muted">
          Sorularınız için{" "}
          <Link href="/iletisim" className="font-semibold text-forest hover:text-gold">
            İletişim
          </Link>{" "}
          sayfamızdaki kanallardan bize ulaşabilirsiniz.
        </div>
      </section>
    </div>
  );
}
