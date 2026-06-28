# SKILLS — Yeni ve Modern Golden Oremar

> **🧠 Bu dosya projenin "yetenek (skill) kayıt defteri"dir.**
> Kural: **Buraya eklenen TÜM skill'ler kullanılacak.** Kullanıcı (Selim Alper) zamanla buraya skill ekler;
> her agent kendi işinde ilgili skill'leri kullanır. Genel Müdür hangi rolün hangi skill'i kullanacağını dağıtır.
>
> İlgili: [`CLAUDE.md`](./CLAUDE.md) · [`AGENTS.md`](./AGENTS.md) · [`REFERANS.md`](./REFERANS.md)
> Durum: hâlâ **spec aşaması** — skill'ler kayıt altına alınır, **"başla"** gelene kadar çalıştırılmaz.

---

## 0. Kullanıcının Öncelikli İstedikleri

| Sıra | Skill | Kaynak | Durum |
|------|-------|--------|-------|
| 1 | **impeccable** | `pbakaus/impeccable` ([repo](https://github.com/pbakaus/impeccable) · [impeccable.style](https://impeccable.style)) | ✅ Klonlandı → `skills/external/impeccable/` |
| 2 | **taste-skill** | `Leonxlnx/taste-skill` ([repo](https://github.com/Leonxlnx/taste-skill)) | ✅ Klonlandı → `skills/external/taste-skill/` |

- **impeccable** ne işe yarar: **AI kod ajanları için kapsamlı tasarım rehberi** — Anthropic'in `frontend-design`'ından doğdu, jenerik AI-UI kokularını (her yere Inter font, mor→mavi gradyan, kart içinde kart, renkli zeminde gri yazı, başlık üstü yuvarlak ikon karosu) önler.
  - **1 skill + 23 komut**: `polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`...
  - **`/impeccable init`** → `PRODUCT.md` ve `DESIGN.md` üretir (hedef kitle, marka şeridi, ses, anti-referanslar, renk, tipografi, bileşenler).
  - **44 deterministik dedektör** (LLM'siz, API'siz) + tarayıcı eklentisiyle canlı iterasyon.
  - → **Tasarım & Frontend Sorumlusu**'nun ana skill'i. Kurulum: proje kökünde `npx impeccable install`, sonra AI aracında `/impeccable init`.
- **taste-skill** ne işe yarar: AI'ya "iyi tasarım zevki" kazandıran, **tasarım varyansı / hareket yoğunluğu / görsel yoğunluk** ayarlanabilen yüksek-yetkili frontend skill'i — sıradan UI üretimini engeller. → **Tasarım & Frontend** (impeccable ile birlikte).

> 💡 impeccable + taste-skill = "sıfırdan modern redesign" hedefimizin (CLAUDE.md §8) tasarım kalite güvencesi. Tasarım referans dosyan gelince bunlarla uygulanacak.

---

## 1. Klonlanmış Harici Kaynaklar (`skills/external/`)

Hepsi `Yeni-Golden-Oremar/skills/external/` altında klonlandı ✅

| Repo | Yol | Ne işe yarar | Hangi agent |
|------|-----|--------------|-------------|
| **awesome-agent-skills** | `skills/external/awesome-agent-skills/` | Yüzlerce agent skill'inin küratörlü listesi (kaynak havuzu). Buradan yeni skill seçilir. | GM / hepsi |
| **awesome-design-md** | `skills/external/awesome-design-md/design-md/` | Markaların **tasarım sistemleri** .md olarak (apple, airbnb, stripe, figma, expo, ferrari, framer, cursor...). Referans/ilham & token çıkarımı. | 🎨 Tasarım |
| **skillui** | `skills/external/skillui/` | `npx skillui` — **herhangi bir tasarım sistemini statik analizle çıkarır** (AI/API'siz). Beğenilen siteden token/stil çıkarmak için. | 🎨 Tasarım |
| **magic-mcp** | `skills/external/magic-mcp/` | 21st.dev **Magic** — doğal dille **modern UI bileşeni üreten MCP**. (MCP olarak yapılandırılması + 21st.dev API anahtarı gerekir.) | 🎨 Tasarım / 🖥️ Frontend |

**Notlar / yapılacaklar (sonra):**
- `taste-skill` klonlandı ✅ (`skills/external/taste-skill/`). `impeccable` linki gelince eklenecek.
- `magic-mcp` bir **MCP sunucusu**; kullanılacaksa Claude Code MCP yapılandırmasına eklenmeli + 21st.dev API key. (İnşa fazında.)
- `skillui` bir CLI; tasarım referansı geldiğinde `npx skillui` ile o tasarımın token'ları çıkarılabilir.

---

## 2. Şu An Mevcut (Yüklü) Skill'ler — bu projeye uygun olanlar

> Ortamımızda yüzlerce skill yüklü. Aşağıda **bu marketplace projesine doğrudan yarayanlar** rol bazında gruplandı.
> Tam katalog gerektiğinde genişletilir.

### 🎨 Tasarım & Frontend
- `frontend-design` · `frontend-design:frontend-design` · `example-skills:frontend-design`
- `web-design-guidelines` · `high-end-visual-design`
- `example-skills:brand-guidelines` · `example-skills:theme-factory` · `example-skills:canvas-design`
- `example-skills:web-artifacts-builder` · `vercel:shadcn`
- `hyperframes:*` (animasyon: css-animations, gsap, tailwind, three) — gerekirse

### 🖥️ Web (Next.js)
- `vercel:nextjs` · `vercel:react-best-practices` · `vercel-react-best-practices`
- `vercel:routing-middleware` · `vercel:next-cache-components` · `vercel-composition-patterns`
- `vercel:shadcn` · `vercel:bootstrap`

### 📱 Mobil (Expo / React Native)
- `expo:building-native-ui` · `expo:expo-deployment` · `expo:expo-cicd-workflows`
- `expo:expo-dev-client` · `expo:upgrading-expo` · `expo:eas-update-insights`
- `vercel-react-native-skills`

### 🗄️ Backend / Veritabanı (Supabase + Postgres)
- `supabase-postgres-best-practices`
- Supabase MCP araçları (`mcp__supabase__*`: migration, sql, advisors, types)
- `neon:*` (yedek Postgres bilgisi, gerekirse)

### 💳 Ödeme
- `stripe:stripe-best-practices` · `stripe:test-cards` · `stripe:explain-error` · `stripe:upgrade-stripe`
- iyzico: **yüklü skill yok** → resmi dökümandan + `context7` ile entegre edilecek (not düşüldü)

### 🔐 Güvenlik
- `security-review` · `aikido:scan` · `aikido:issues` · `aikido:setup`
- `code-review` (güvenlik açısından da)

### ✅ Kalite / Test
- `code-review` · `review` · `simplify` · `verify`
- `example-skills:webapp-testing`

### 🚀 DevOps / Yayın
- `vercel:deploy` · `vercel:env` · `vercel:status`
- `expo:expo-deployment` · `expo:expo-cicd-workflows`

### 📝 İçerik & SEO
- `seo-audit` · `ai-seo` · `programmatic-seo` · `schema` · `site-architecture`
- `copywriting` · `copy-editing` · `content-strategy` · `emails` · `social`

### 📚 Dokümantasyon & Yardımcı
- `document-skills:docx` · `document-skills:pdf` · `document-skills:xlsx` · `document-skills:pptx`
- `skill-creator` (yeni skill yazmak için) · `find-skills` (skill keşfi) · `context7` (güncel kütüphane dökümanı)

---

## 3. Kullanıcının Sonra Ekleyecekleri

> Buraya yeni skill linkleri/adları ekle; ben kaydedip (gerekirse klonlayıp) ilgili agent'a atayacağım.

- [ ... ]
- [ ... ]
- [ ... ]

---

## 4. Skill → Agent Eşleşmesi (özet)

| Agent | Birincil skill'ler |
|-------|--------------------|
| 🎨 Tasarım | **impeccable**, **taste-skill**, awesome-design-md, skillui, magic-mcp, frontend-design, high-end-visual-design, theme-factory |
| 🖥️ Frontend | vercel:nextjs, react-best-practices, shadcn, **impeccable**, taste-skill, frontend-design |
| 📱 Mobil | expo:*, vercel-react-native-skills |
| 🗄️ Backend | supabase-postgres-best-practices, supabase MCP |
| 🔌 API | context7, zod (kütüphane), supabase types |
| 💳 Ödeme | stripe:*, (iyzico doc/context7) |
| 🔐 Güvenlik | security-review, aikido:*, code-review |
| ✅ QA | code-review, verify, webapp-testing |
| 🚀 DevOps | vercel:deploy/env, expo:expo-deployment |
| 📝 İçerik/SEO | seo-audit, schema, copywriting, emails |
| 📚 Dok. | skill-creator, document-skills:* |
