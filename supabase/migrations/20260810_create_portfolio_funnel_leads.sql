begin;

create table if not exists public.portfolio_funnel_leads (
  id bigint generated always as identity primary key,
  lead_code text not null unique check (lead_code ~ '^[a-z0-9]+(?:[._-][a-z0-9]+)*$' and char_length(lead_code) <= 96),
  business_name text not null check (char_length(business_name) between 1 and 160),
  status text not null default 'new' check (
    status in ('new', 'contacted', 'conversation_started', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost', 'not_a_fit')
  ),
  source text not null default 'unknown' check (char_length(source) <= 96),
  medium text not null default 'unknown' check (char_length(medium) <= 96),
  campaign text check (campaign is null or char_length(campaign) <= 96),
  channel text not null default 'other' check (
    channel in ('x', 'email', 'dm', 'whatsapp', 'referral', 'github', 'linkedin', 'tiktok', 'other')
  ),
  landing_path text check (landing_path is null or (landing_path like '/%' and char_length(landing_path) <= 256)),
  created_at timestamptz not null default now(),
  first_contact_at timestamptz,
  conversation_started_at timestamptz,
  qualified_at timestamptz,
  proposal_sent_at timestamptz,
  closed_at timestamptz,
  deal_value_brl numeric(12, 2) check (deal_value_brl is null or deal_value_brl >= 0),
  lost_reason text check (lost_reason is null or char_length(lost_reason) <= 500),
  notes text check (notes is null or char_length(notes) <= 2000),
  updated_at timestamptz not null default now()
);

alter table public.portfolio_funnel_leads enable row level security;
revoke all on table public.portfolio_funnel_leads from anon, authenticated;

create index if not exists portfolio_funnel_leads_status_idx
  on public.portfolio_funnel_leads (status, updated_at desc);
create index if not exists portfolio_funnel_leads_source_idx
  on public.portfolio_funnel_leads (source, medium, created_at desc);
create index if not exists portfolio_funnel_leads_campaign_idx
  on public.portfolio_funnel_leads (campaign, created_at desc)
  where campaign is not null;

comment on table public.portfolio_funnel_leads is
  'Server-only JE4NDEV commercial funnel ledger. Uses a lead code and business name; contact details remain in the approved communication channel or CRM, not in analytics events.';

commit;
