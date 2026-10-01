# Running the Nora integration

Nora's interface is included in this repository. A checkout alone does not provide a model, private storage, a Google Sheet or notification credentials. Missing configuration keeps those services unavailable.

## Local development

Use the existing checkout and the commands in the README. Keep real values in an ignored server environment file or your deployment platform's secret store. The browser must never receive model credentials, the ingress proof, the Turnstile secret or the Sheets signing secret.

The test suite uses isolated fixtures. Test contacts and transcripts must stay outside the source tree and public assets.

## Server configuration

Copy the variable names from `.env.example`, then configure:

- An authenticated, trusted model bridge on loopback. `HERMES_CONCIERGE_URL`, `HERMES_CONCIERGE_KEY` and the permitted public origin are server settings.
- A private, durable state directory outside `public/` and the checkout, owned by the application user. Quotas, optional visitor memory and lead records need appropriate file permissions, retention and backups.
- A reverse proxy that strips incoming `X-Concierge-Proxy` and `X-Real-IP`, then supplies its own trusted values. Keep the Next backend and model bridge off public interfaces.
- Real Cloudflare Turnstile credentials for the intended production hostname. Test keys are restricted to loopback review.
- Model and request controls appropriate to the deployment. Passing unit tests does not establish production capacity or provider quotas.

## Private Google Sheets

The relay source is `integrations/nora-sheets/Code.gs`. Create a private spreadsheet and configure the Apps Script properties `NORA_SPREADSHEET_ID` and `NORA_SECRET`. Deploy under the spreadsheet owner's account. The endpoint accepts signed writes; anonymous read requests do not expose the sheet.

Configure the server's `PORTFOLIO_LEADS_SHEETS_WEBHOOK_URL` and `PORTFOLIO_LEADS_SHEETS_SECRET_FILE`. Store the secret file outside the checkout with restricted permissions. A scheduled invocation of `scripts/sync-nora-leads.ts` delivers queued records. Configure notification and retention jobs separately for your environment; do not copy another installation's credentials or runtime data.

Verify a contact registration, a conversation update to the same row, preservation of manually edited status/owner fields and retry behavior with disposable test data. A saved row or delivered notification does not establish that a person has read or answered the request.

## Memory and publication

Memory is a separate opt-in. Recovery requires the registered number and a personal recovery code; this does not verify ownership of a WhatsApp account. The current implementation retains optional memory for 30 days after its last update and supports review, editing and deletion.

Before public use, review privacy disclosures, provider terms, permitted data, backup/retention practices and operating limits for your deployment. Build and test locally, deploy the verified standalone artifact, retain a working rollback and verify the served build and the actual visitor journey.
