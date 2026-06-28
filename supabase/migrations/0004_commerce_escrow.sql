-- Golden Oremar — Katman 2: Ticaret & Escrow (şema + okuma RLS)
-- Para durum geçişleri (sipariş oluştur/kargola/onayla) guard'lı RPC'lerle
-- yapılacak (bkz. 0005); bu yüzden para tablolarında doğrudan yazma politikası yok.

-- Enumlar
create type public.order_status as enum
  ('pending','paid','partially_shipped','shipped','completed','cancelled','refunded');
create type public.payment_status as enum ('pending','paid','failed','refunded');
create type public.payment_provider as enum ('stripe','iyzico');
create type public.escrow_status as enum
  ('pending','shipped','delivered','released','refunded','disputed');
create type public.application_status as enum ('pending','approved','rejected');
create type public.txn_type as enum ('sale','commission','payout','refund','adjustment');

-- Platform ayarları (tek satır) — komisyon/escrow yapılandırılabilir
create table public.platform_settings (
  id                      boolean primary key default true,
  commission_rate         numeric(5,4) not null default 0.08,  -- %8 (karar)
  escrow_auto_confirm_days int       not null default 7,       -- 7 gün (karar)
  free_shipping_threshold numeric(10,2) not null default 250,
  updated_at              timestamptz not null default now(),
  constraint single_row check (id)
);
insert into public.platform_settings (id) values (true);

-- private şema — RLS yardımcıları (REST'e açık değil)
create schema if not exists private;
revoke all on schema private from public;

create function private.is_admin()
returns boolean language sql security definer set search_path = '' stable as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

create function private.current_vendor_id()
returns uuid language sql security definer set search_path = '' stable as $$
  select id from public.vendor_profiles where user_id = auth.uid();
$$;

grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;
grant execute on function private.current_vendor_id() to authenticated;

-- vendor_applications — KYC başvuru (TC + IBAN + belge/selfie)
create table public.vendor_applications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  store_name    text not null,
  person        text not null,
  tc_no         text not null,
  iban          text not null,
  phone         text not null,
  province      text,
  district      text,
  story         text,
  document_url  text,
  selfie_url    text,
  status        public.application_status not null default 'pending',
  reject_reason text,
  reviewed_by   uuid references auth.users(id),
  reviewed_at   timestamptz,
  created_at    timestamptz not null default now()
);
create unique index vendor_applications_one_pending
  on public.vendor_applications (user_id) where status = 'pending';

-- orders
create table public.orders (
  id              uuid primary key default gen_random_uuid(),
  buyer_id        uuid not null references auth.users(id) on delete restrict,
  status          public.order_status not null default 'pending',
  items_total     numeric(10,2) not null default 0,
  shipping_total  numeric(10,2) not null default 0,
  grand_total     numeric(10,2) not null default 0,
  payment_status  public.payment_status not null default 'pending',
  payment_provider public.payment_provider,
  payment_ref     text,
  ship_name       text,
  ship_phone      text,
  ship_line       text,
  ship_district   text,
  ship_province   text,
  created_at      timestamptz not null default now()
);
create index orders_buyer_idx on public.orders (buyer_id);

-- order_vendors — satıcı alt-siparişi (escrow + kargo birimi)
create table public.order_vendors (
  id               uuid primary key default gen_random_uuid(),
  order_id         uuid not null references public.orders(id) on delete cascade,
  vendor_id        uuid not null references public.vendor_profiles(id) on delete restrict,
  items_subtotal   numeric(10,2) not null,
  shipping_fee     numeric(10,2) not null default 0,
  commission_rate  numeric(5,4) not null,
  commission_amount numeric(10,2) not null,
  net_amount       numeric(10,2) not null,
  escrow_status    public.escrow_status not null default 'pending',
  tracking_carrier text,
  tracking_no      text,
  shipped_at       timestamptz,
  delivered_at     timestamptz,
  auto_confirm_at  timestamptz,
  confirmed_at     timestamptz,
  created_at       timestamptz not null default now(),
  unique (order_id, vendor_id)
);
create index order_vendors_order_idx  on public.order_vendors (order_id);
create index order_vendors_vendor_idx on public.order_vendors (vendor_id);
create index order_vendors_autoconfirm_idx
  on public.order_vendors (auto_confirm_at) where escrow_status = 'shipped';

-- order_items
create table public.order_items (
  id              uuid primary key default gen_random_uuid(),
  order_id        uuid not null references public.orders(id) on delete cascade,
  order_vendor_id uuid not null references public.order_vendors(id) on delete cascade,
  product_id      uuid not null references public.products(id) on delete restrict,
  vendor_id       uuid not null references public.vendor_profiles(id) on delete restrict,
  name            text not null,
  unit_price      numeric(10,2) not null,
  qty             int not null check (qty > 0),
  line_total      numeric(10,2) not null,
  created_at      timestamptz not null default now()
);
create index order_items_order_idx  on public.order_items (order_id);
create index order_items_vendor_idx on public.order_items (vendor_id);

-- vendor_transactions — para hareketleri defteri (audit trail)
create table public.vendor_transactions (
  id              uuid primary key default gen_random_uuid(),
  vendor_id       uuid not null references public.vendor_profiles(id) on delete cascade,
  order_vendor_id uuid references public.order_vendors(id) on delete set null,
  type            public.txn_type not null,
  amount          numeric(10,2) not null,
  description     text,
  created_at      timestamptz not null default now()
);
create index vendor_transactions_vendor_idx on public.vendor_transactions (vendor_id);

-- payouts — satıcıya ödeme
create table public.payouts (
  id           uuid primary key default gen_random_uuid(),
  vendor_id    uuid not null references public.vendor_profiles(id) on delete restrict,
  amount       numeric(10,2) not null check (amount > 0),
  status       text not null default 'pending'
                 check (status in ('pending','processing','paid','failed')),
  iban         text,
  processed_at timestamptz,
  created_at   timestamptz not null default now()
);
create index payouts_vendor_idx on public.payouts (vendor_id);

-- RLS
alter table public.platform_settings   enable row level security;
alter table public.vendor_applications  enable row level security;
alter table public.orders               enable row level security;
alter table public.order_vendors        enable row level security;
alter table public.order_items          enable row level security;
alter table public.vendor_transactions  enable row level security;
alter table public.payouts              enable row level security;

create policy "ayarlar herkese okunur"
  on public.platform_settings for select to anon, authenticated using (true);
create policy "ayarlar admin yazar"
  on public.platform_settings for update to authenticated
  using (private.is_admin()) with check (private.is_admin());

create policy "başvuru: kendini gör"
  on public.vendor_applications for select to authenticated
  using (auth.uid() = user_id or private.is_admin());
create policy "başvuru: kendin oluştur"
  on public.vendor_applications for insert to authenticated
  with check (auth.uid() = user_id);

create policy "sipariş: erişim"
  on public.orders for select to authenticated
  using (
    private.is_admin()
    or buyer_id = auth.uid()
    or exists (
      select 1 from public.order_vendors ov
      where ov.order_id = orders.id and ov.vendor_id = private.current_vendor_id()
    )
  );

create policy "alt-sipariş: erişim"
  on public.order_vendors for select to authenticated
  using (
    private.is_admin()
    or vendor_id = private.current_vendor_id()
    or exists (
      select 1 from public.orders o
      where o.id = order_vendors.order_id and o.buyer_id = auth.uid()
    )
  );

create policy "kalem: erişim"
  on public.order_items for select to authenticated
  using (
    private.is_admin()
    or vendor_id = private.current_vendor_id()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id and o.buyer_id = auth.uid()
    )
  );

create policy "işlem: erişim"
  on public.vendor_transactions for select to authenticated
  using (private.is_admin() or vendor_id = private.current_vendor_id());

create policy "payout: erişim"
  on public.payouts for select to authenticated
  using (private.is_admin() or vendor_id = private.current_vendor_id());
