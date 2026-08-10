begin;

create table if not exists public.portfolio_analytics_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  event_name text not null check (event_name ~ '^[a-z0-9-]{1,64}$'),
  page_path text not null check (char_length(page_path) between 1 and 256),
  page_type text not null default 'other' check (page_type in ('home', 'service', 'project', 'other')),
  project text,
  service text,
  offer text,
  cta text,
  cta_label text,
  locale text check (locale in ('pt', 'en')),
  source text not null default 'unknown',
  medium text not null default 'unknown',
  campaign text,
  content text,
  landing_path text not null,
  referrer_host text,
  channel text check (channel in ('whatsapp', 'email', 'github', 'linkedin', 'internal', 'website', 'other')),
  destination_host text,
  destination_path text,
  created_at timestamptz not null default now(),
  constraint portfolio_analytics_project_length check (project is null or char_length(project) <= 96),
  constraint portfolio_analytics_service_length check (service is null or char_length(service) <= 96),
  constraint portfolio_analytics_offer_length check (offer is null or char_length(offer) <= 96),
  constraint portfolio_analytics_cta_length check (cta is null or char_length(cta) <= 96),
  constraint portfolio_analytics_label_length check (cta_label is null or char_length(cta_label) <= 96),
  constraint portfolio_analytics_source_length check (char_length(source) <= 96),
  constraint portfolio_analytics_medium_length check (char_length(medium) <= 96),
  constraint portfolio_analytics_campaign_length check (campaign is null or char_length(campaign) <= 96),
  constraint portfolio_analytics_content_length check (content is null or char_length(content) <= 96),
  constraint portfolio_analytics_landing_path_length check (char_length(landing_path) between 1 and 256),
  constraint portfolio_analytics_referrer_length check (referrer_host is null or char_length(referrer_host) <= 253),
  constraint portfolio_analytics_destination_host_length check (destination_host is null or char_length(destination_host) <= 253),
  constraint portfolio_analytics_destination_path_length check (destination_path is null or char_length(destination_path) <= 256)
);

alter table public.portfolio_analytics_events enable row level security;
revoke all on table public.portfolio_analytics_events from anon, authenticated;

create index if not exists portfolio_analytics_events_occurred_at_idx
  on public.portfolio_analytics_events (occurred_at desc);
create index if not exists portfolio_analytics_events_event_idx
  on public.portfolio_analytics_events (event_name, occurred_at desc);
create index if not exists portfolio_analytics_events_source_idx
  on public.portfolio_analytics_events (source, medium, occurred_at desc);
create index if not exists portfolio_analytics_events_service_idx
  on public.portfolio_analytics_events (service, occurred_at desc)
  where service is not null;

comment on table public.portfolio_analytics_events is
  'Cookie-free JE4NDEV funnel events. Never stores IP, user-agent, full referrer URLs, form input, WhatsApp message text or stable visitor identifiers.';

create or replace function public.prune_portfolio_analytics_events(retention_days integer default 180)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  deleted_rows bigint;
begin
  if retention_days < 30 then
    raise exception 'retention_days must be at least 30';
  end if;

  delete from public.portfolio_analytics_events
  where occurred_at < now() - retention_days * interval '1 day';

  get diagnostics deleted_rows = row_count;
  return deleted_rows;
end;
$$;

revoke all on function public.prune_portfolio_analytics_events(integer) from public, anon, authenticated;
grant execute on function public.prune_portfolio_analytics_events(integer) to service_role;

commit;
