# Acquisition measurement

The existing weekly report combines first-party analytics events, manually maintained commercial contacts and an optional daily Search Console CSV. It produces aggregate Markdown. Commercial customer names and contact identifiers are neither queried nor rendered; source and campaign labels remain attribution dimensions and should not contain personal information.

```sh
npm run report:weekly -- --days 7 --locale en --medium organic --search-console "search-console-en-daily.csv"
npm run report:weekly -- --days 7 --locale en --medium ai-referral
```

`--days` accepts 1–365 and defaults to 7. `--locale` accepts `en` or `pt`; omission includes both languages. `--medium` accepts `organic`, `ai-referral`, `direct`, `referral`, `campaign`, `organic-social`, `email`, `video`, `community`, `dm` or `unknown`. Omission includes every stored medium. This allowlist restricts the report filter; it does not change analytics ingestion or historical UTM values.

Run the existing local CLI with its existing server configuration loaded privately. It reads `portfolio_analytics_events` and `portfolio_funnel_leads` through the current Supabase Data API integration. Credentials belong on the server and are never command arguments, browser variables or report content. This workflow does not create tables, change permissions or provision a new environment. Analytics persistence must already be working; log-only fallback events are not read by this report.

## What the numbers mean

- **Page views:** `portfolio-page-view` events in the reporting window, selected by localized page path, compatible `locale` when present, and medium. Older events without locale can use the page path. These are events, not people, sessions or unique entries.
- **CTA clicks:** recorded WhatsApp, email and lead CTA clicks. Clicking does not establish that a message or contact was received.
- **Contacts registered manually:** commercial table rows whose `created_at` falls in the window. This measures manual registration, not mailbox delivery or Nora signup. Use the existing `funnel:lead` CLI to maintain real commercial records with their source, medium and landing path.
- **Qualified contacts:** rows whose `qualified_at` falls in the window, including contacts created earlier. Conversations, proposals and won projects use their own stage timestamps. These are stage activity counts, not a same-week cohort conversion rate.

Commercial language filtering uses `landing_path`, such as `/en/services/private-ai-agents`, and medium filtering uses the recorded commercial medium. A missing landing path or unknown medium cannot be assigned to an English organic segment. Language describes the page, not the visitor's country. Attribution is based on referrer/UTM metadata and manual commercial records; it is not proof of a search query or individual visitor journey.

Nora events such as `nora-lead-saved` and `nora-lead-delivered` remain UI observability. They are not authoritative human-delivery or qualification counts. There is **no automatic bridge from Nora or Google Sheets to `portfolio_funnel_leads`**. Maintain commercial stages manually; receiving a Nora receipt or a Sheet update does not populate this table.

## Search Console CSV

Apply the intended page/language and search filters in Search Console before exporting its daily table. For an English segment, filter the owned pages under `/en` and export dates, clicks and impressions, with optional CTR and position. English and Portuguese column headers are supported.

The CSV parser cannot verify the export's page filters, infer country or map Google Search clicks to commercial contacts. `--locale` and `--medium` filter first-party and commercial records; they do not filter a daily aggregate CSV. Search Console data concerns Google Search and should remain a separately declared scope, especially alongside an `ai-referral` report.

First-party and commercial stages use a rolling UTC timestamp window. The CSV uses the selected number of UTC calendar dates through the current date. An absent CSV is reported as not imported; an imported day with zero clicks remains valid data.

The CLI requests at most 10,000 rows per table with `Prefer: count=exact` and checks `Content-Range` against the returned rows. If the backend caps a response, omits the exact total or returns an inconsistent range, the CLI stops without emitting a Markdown report. A backend limit of 1,000 does not silently become the reported total. Reduce the reporting window or add a separately reviewed pagination change before relying on a larger dataset.

## Source references

- [Supabase Data REST API](https://supabase.com/docs/guides/api)
- [Supabase Boolean filter examples](https://supabase.com/docs/guides/api/sql-to-api)
- [Supabase API security](https://supabase.com/docs/guides/api/securing-your-api)
- [PostgREST result ranges and exact counts](https://docs.postgrest.org/en/stable/references/api/pagination_count.html)

Focused local verification: `npx tsx --test src/lib/analytics/weekly-report.test.ts`. It uses synthetic records and pure read-query construction; it does not access a database, send notifications or register contacts.
