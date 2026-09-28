-- ============================================
-- LeadDesk - Database Schema
-- Project 01 / 30-Day SaaS Lab
-- ============================================


-- 1. Customers
create table public.customers (
  id uuid primary key default gen_random_uuid(),

  name text not null,
  phone text,

  source text not null default 'other'
    check (
      source in (
        'douyin',
        'wechat',
        'offline',
        'referral',
        'other'
      )
    ),

  status text not null default 'new'
    check (
      status in (
        'new',
        'contacted',
        'interested',
        'won',
        'lost'
      )
    ),

  need text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);


-- 2. Interactions
create table public.interactions (
  id uuid primary key default gen_random_uuid(),

  customer_id uuid not null
    references public.customers(id)
    on delete cascade,

  type text not null default 'other'
    check (
      type in (
        'phone',
        'wechat',
        'meeting',
        'other'
      )
    ),

  content text not null,

  created_at timestamptz not null default now()
);


-- 3. Indexes
create index customers_status_idx
  on public.customers(status);

create index customers_source_idx
  on public.customers(source);

create index interactions_customer_id_idx
  on public.interactions(customer_id);

create index interactions_created_at_idx
  on public.interactions(created_at desc);


-- 4. Automatically update customers.updated_at
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger update_customers_updated_at
before update on public.customers
for each row
execute function public.update_updated_at_column();


-- 5. Enable Row Level Security
alter table public.customers enable row level security;
alter table public.interactions enable row level security;