# JE4NDEV Measurement Loop

Status: `implementation_ready_not_deployed`
Date: 2026-08-10
Reporting window: 7 days
30-day target end: 2026-09-09

This runbook combines three evidence layers:

1. first-party portfolio events;
2. a server-only commercial lead ledger;
3. aggregate Search Console data.

No Supabase migration was applied and no production secret, deploy or cron was changed while preparing this package.

## 1. Funnel definition

| Stage | Source of truth | Definition |
| --- | --- | --- |
| Visit | `portfolio_analytics_events` | `portfolio-page-view` accepted by the first-party endpoint |
| CTA click | `portfolio_analytics_events` | `lead-cta-click`, `whatsapp-click` or `email-click` |
| Conversation initiated | `portfolio_funnel_leads` | A real two-way conversation, not merely a sent message |
| Qualified lead | `portfolio_funnel_leads` | Bottleneck, decision route and bounded first milestone are credible |
| Proposal sent | `portfolio_funnel_leads` | A scoped proposal was actually delivered |
| Closed won | `portfolio_funnel_leads` | Paid project confirmed |

Do not infer conversations or revenue from CTA clicks.

## 2. Privacy boundary

Analytics events do not store:

- IP address;
- user-agent;
- full referrer URL;
- arbitrary query data;
- form input;
- WhatsApp message text;
- stable visitor identifier.

The commercial ledger stores a `lead_code`, business name, attribution and stage timestamps. Contact details remain in the approved mailbox, WhatsApp thread or CRM. They are not copied into analytics events.

## 3. Infrastructure files

Migrations, prepared but not applied:

- `supabase/migrations/20260810_create_portfolio_analytics_events.sql`
- `supabase/migrations/20260810_create_portfolio_funnel_leads.sql`

Server-only configuration:

```env
ANALYTICS_SUPABASE_ENABLED=false
ANALYTICS_SUPABASE_URL=https://your-project.supabase.co
ANALYTICS_SUPABASE_SERVICE_ROLE_KEY=replace-with-a-dedicated-server-secret
```

Never expose the service-role key through `NEXT_PUBLIC_*`. Keep `ANALYTICS_SUPABASE_ENABLED=false` until the dedicated schema and an edge rate limit for `POST /api/analytics` are applied and verified. The API accepts only the event-name allowlist defined in `src/lib/analytics/schema.ts`.

## 4. Lead ledger commands

Create a lead after a verified record exists:

```bash
npm run funnel:lead -- add \
  --code lead-20260810-001 \
  --business "Example Business" \
  --source outbound \
  --medium email \
  --campaign diagnosis-first-milestone \
  --channel email \
  --landing-path /pt/services/desenvolvimento-saas
```

Move the lead only after the real stage happened. The CLI enforces the sequence `new → contacted → conversation_started → qualified → proposal_sent → closed_won`; loss and not-a-fit terminal states are allowed from their documented decision points, while skipped, reversed and reopened transitions are rejected:

```bash
npm run funnel:lead -- move \
  --code lead-20260810-001 \
  --status contacted

npm run funnel:lead -- move \
  --code lead-20260810-001 \
  --status conversation_started

npm run funnel:lead -- move \
  --code lead-20260810-001 \
  --status qualified

npm run funnel:lead -- move \
  --code lead-20260810-001 \
  --status proposal_sent

npm run funnel:lead -- move \
  --code lead-20260810-001 \
  --status closed_won \
  --value-brl 2500
```

Read the latest 50 records:

```bash
npm run funnel:lead -- list
```

The CLI never sends a message or changes a public profile. It only updates the server-only funnel ledger.

## 5. Search Console input

Export daily aggregate performance for the same reporting window with columns equivalent to:

```csv
date,clicks,impressions,ctr,position
```

Template:

- `docs/search-console-weekly-template.csv`

The parser accepts English or Portuguese headers:

- `date` or `data`;
- `clicks` or `cliques`;
- `impressions` or `impressões`;
- `ctr`;
- `position` or `posição`.

Only aggregate daily metrics are imported. Queries and individual user data are not required for the weekly funnel summary.

## 6. Weekly report

Without Search Console CSV:

```bash
npm run report:weekly -- --days 7
```

With Search Console CSV:

```bash
npm run report:weekly -- \
  --days 7 \
  --search-console docs/search-console-weekly-template.csv
```

The report prints Markdown with:

- portfolio page views;
- lead CTA clicks;
- CTA clicks per page view (directional; it is not a unique-visitor conversion rate);
- conversations initiated;
- qualified leads;
- proposals;
- closed-won count and BRL value;
- source/medium and campaign breakdowns;
- Search Console clicks, impressions, CTR and impression-weighted average position;
- the 30-day commercial target.

## 7. Weekly operator checklist

Run after production tracking is deployed and verified:

1. Export the same 7-day Search Console window.
2. Confirm every commercial conversation has one lead code.
3. Move stages only from real thread/proposal/payment evidence.
4. Run the weekly report.
5. Compare acquisition source, CTA page and commercial stage.
6. Record one decision per channel: repeat, revise, pause or stop.
7. Do not request indexing again just because impressions are low.
8. Do not run ads until CTA attribution and lead reconciliation work.

## 8. Decision rules

- Visits but no CTA clicks: review offer clarity, destination and CTA placement.
- CTA clicks but no conversations: review contact friction, prefilled text and destination mismatch.
- Conversations but no qualified leads: tighten buyer qualification and problem framing.
- Qualified leads but no proposals: shorten diagnosis-to-scope time.
- Proposals but no close: review risk, proof, milestone boundary and commercial terms.
- Search impressions but no clicks: review query/page alignment and snippets, not indexing requests.
- No meaningful volume: distribute the approved pack before making another system.

## 9. Scheduling gate

Do not schedule a weekly cron until all of these pass:

- migrations applied to the intended Supabase project;
- production server-only variables configured;
- edge rate limit for `POST /api/analytics` applied and verified;
- `ANALYTICS_SUPABASE_ENABLED=true` set only after that control is active;
- production analytics event verified end to end;
- one test lead created and removed or clearly labeled as test;
- Search Console export location decided;
- delivery target decided.

In Hermes CLI, default cron delivery is local-only. A future report will not message Telegram or another platform unless an explicit gateway destination is configured.
