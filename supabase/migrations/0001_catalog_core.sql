-- Golden Oremar — Katman 1: Katalog & Güven çekirdeği
-- categories, vendor_profiles, products, product_reviews
-- App veri modeli (lib/types.ts) ile birebir; ticaret/escrow katmanı ayrı migration.
-- Tüm tablolarda RLS açık: katalog herkese okunur, yazma sonraki katmanda (vendor/admin politikaları).

-- ============================================================
-- categories
-- ============================================================
create table public.categories (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text,
  image         text,
  sort_order    int not null default 0,
  -- Denormalize edilmiş sayaç (app Category.productCount bekliyor); ileride
  -- trigger/view ile yeniden hesaplanabilir.
  product_count int not null default 0,
  created_at    timestamptz not null default now()
);

-- ============================================================
-- vendor_profiles  (app'teki "Producer"; satıcı/üretici)
-- ============================================================
create table public.vendor_profiles (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique,
  name            text not null,            -- mağaza / üretici adı
  person          text not null,            -- gerçek kişi adı
  avatar          text,
  cover           text,
  location        text,                     -- serbest metin "İlçe, İl"
  province        text,                     -- il (yapısal filtre için, §8.4.1)
  district        text,                     -- ilçe
  verified        boolean not null default false,  -- KYC doğrulandı
  member_since    int,                      -- üyelik yılı, ör. 2024
  story           text,
  badges          text[] not null default '{}',
  -- KYC / finans (değerler ticaret katmanında dolar)
  iban            text,
  commission_rate numeric(5,4),             -- yapılandırılabilir; null → platform varsayılanı (§8.7)
  balance         numeric(12,2) not null default 0,  -- escrow/kullanılabilir bakiye
  -- Agregat güven istatistikleri (denormalize; §8.4.2)
  units_sold      int not null default 0,
  positive_pct    int not null default 0,
  rating          numeric(2,1) not null default 0,
  review_count    int not null default 0,
  product_count   int not null default 0,
  -- Bağlı hesap (yardımlı kayıtta null olabilir, §8.3.3)
  user_id         uuid references auth.users(id) on delete set null,
  created_at      timestamptz not null default now()
);

-- ============================================================
-- products
-- ============================================================
create table public.products (
  id           uuid primary key default gen_random_uuid(),
  slug         text not null unique,
  name         text not null,
  category_id  uuid not null references public.categories(id) on delete restrict,
  vendor_id    uuid not null references public.vendor_profiles(id) on delete cascade,
  price        numeric(10,2) not null check (price >= 0),
  old_price    numeric(10,2) check (old_price is null or old_price >= 0),
  unit         text not null,             -- "500 g", "1 L cam şişe"
  image        text,
  gallery      text[] not null default '{}',
  region       text,                      -- menşe/konum rozeti (§8.4.1)
  badge        text,                      -- tekil vurgu: "Katkısız" | "Organik" ...
  tags         text[] not null default '{}',
  cold_chain   boolean not null default false,
  description  text,
  rating       numeric(2,1) not null default 0,
  review_count int not null default 0,
  stock        int,                       -- null = takip edilmiyor (faz 1)
  -- Moderasyon durumu (§8.1: ürün yayına girmeden admin onayı)
  status       text not null default 'published'
                 check (status in ('draft','pending','published','rejected')),
  created_at   timestamptz not null default now()
);

create index products_category_idx on public.products (category_id);
create index products_vendor_idx   on public.products (vendor_id);
create index products_status_idx   on public.products (status);

-- ============================================================
-- product_reviews
-- ============================================================
create table public.product_reviews (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references public.products(id) on delete cascade,
  vendor_id   uuid not null references public.vendor_profiles(id) on delete cascade,
  author      text not null,
  location    text,
  rating      int not null check (rating between 1 and 5),
  text        text not null,
  user_id     uuid references auth.users(id) on delete set null,
  created_at  timestamptz not null default now()
);

create index product_reviews_product_idx on public.product_reviews (product_id);
create index product_reviews_vendor_idx  on public.product_reviews (vendor_id);

-- ============================================================
-- RLS — katalog herkese okunur, yazma henüz kapalı
-- (vendor/admin yazma politikaları ticaret katmanında eklenecek)
-- ============================================================
alter table public.categories      enable row level security;
alter table public.vendor_profiles enable row level security;
alter table public.products        enable row level security;
alter table public.product_reviews enable row level security;

create policy "categories herkese okunur"
  on public.categories for select
  to anon, authenticated
  using (true);

create policy "vendor_profiles herkese okunur"
  on public.vendor_profiles for select
  to anon, authenticated
  using (true);

-- Sadece yayındaki ürünler herkese görünür (moderasyon)
create policy "yayindaki urunler herkese okunur"
  on public.products for select
  to anon, authenticated
  using (status = 'published');

create policy "product_reviews herkese okunur"
  on public.product_reviews for select
  to anon, authenticated
  using (true);
