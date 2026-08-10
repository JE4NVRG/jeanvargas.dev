# JE4NDEV Measurement Loop

Status: `production_active_local_weekly_reporting`
Created: 2026-08-10
Production activation verified: 2026-08-10
Reporting window: 7 days
30-day target end: 2026-09-09

This runbook combines three evidence layers:

1. first-party portfolio events;
2. a server-only commercial lead ledger;
3. aggregate Search Console data.

Production analytics persistence is active. The database migrations, edge rate limit,
server-only environment and end-to-end write/readback gate were applied and verified
separately from the application deploy. The weekly report is scheduled with local-only
delivery; external Telegram delivery remains a separate approval gate.

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

## 3. Production infrastructure

Applied migrations:

- `supabase/migrations/20260810_create_portfolio_analytics_events.sql`
- `supabase/migrations/20260810_create_portfolio_funnel_leads.sql`

Active server-only configuration:

```env
ANALYTICS_SUPABASE_ENABLED=true
ANALYTICS_SUPABASE_URL=<server-only Supabase URL>
ANALYTICS_SUPABASE_SERVICE_ROLE_KEY=<server-only secret>
```

The variables are loaded from `/home/jean/.config/jeanvargas-dev/analytics.env`
with mode `0600`. Never expose the service-role key through `NEXT_PUBLIC_*`.
The edge rate limit for `POST /api/analytics` is active and verified, and the API
accepts only the event-name allowlist defined in `src/lib/analytics/schema.ts`.

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

## 9. Scheduling gate and current state

The local-only weekly cron was enabled only after all required controls passed:

- [x] migrations applied to the intended Supabase project;
- [x] production server-only variables configured;
- [x] edge rate limit for `POST /api/analytics` applied and verified;
- [x] `ANALYTICS_SUPABASE_ENABLED=true` set after the edge control became active;
- [x] production browser event persisted and read back end to end;
- [x] behavioral test rows rolled back and browser E2E rows removed;
- [x] Search Console aggregate source and private CSV locations decided;
- [x] delivery set explicitly to `local` for the initial automation gate;
- [ ] Telegram delivery to `Sage-Operation` is `review-required` until Jean approves
  the external report message scope.

Current automation:

- job: `JE4NDEV Measurement Ops — weekly funnel`;
- Hermes cron job ID: `cc22bc2f6929`;
- schedule: Mondays at 09:10 BRT (`10 9 * * 1`);
- delivery: `local`;
- next scheduled run after activation: 2026-08-17 09:10 BRT.

In Hermes CLI, local delivery saves the result to the cron history and does not send
Telegram or another external message. Changing delivery to a group/topic requires a
separate explicit update and delivery smoke.

## 10. Production activation evidence

- Production commit: `bc8a8b355c90910a71bb6890bd5ccf33dc6108a4`.
- Cloudflare rate-limit ruleset: `2ed6028f75af41608f41cd27f43d259c`.
- Rule: 10 analytics POSTs per 10 seconds per IP/colo, 10-second mitigation.
- Burst validation: app-level `400` before the threshold, edge `429` above it,
  then app-level `400` after cooldown.
- RLS: enabled on both tables; `anon` and `authenticated` have no table access;
  `service_role` has the required server operations.
- Browser E2E: `portfolio-page-view` and `portfolio-engaged-30s` persisted with
  `persistence: supabase`, read back through PostgREST, then deleted.
- Secret leak scan: service key absent from 122 static/public files and origin HTML.
- Postflight manifest:
  `/home/je4ndev/.hermes/backups/je4ndev-analytics-gate/20260810T134402Z/postflight-manifest.json`.
- First Search Console-backed report:
  `/home/jean/backups/jeanvargas-dev/measurement-ops/weekly-with-gsc-20260810T140912Z.md`.
- Search Console input contains daily aggregate metrics only, not queries or PII.

Rollback handles and pre-migration/database/ruleset backups are recorded in the
postflight manifest. Do not remove those artifacts as part of normal report cleanup.
