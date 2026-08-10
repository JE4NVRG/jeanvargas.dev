# JE4NDEV Distribution Pack

Status: `drafted_pending_approval`
Date: 2026-08-10
Campaign: `diagnosis-first-milestone`

No text in this document has been published or sent. External messages require Jean's approval of the exact recipient, channel and final copy.

## 1. Commercial entry point

Primary offer:

> Diagnóstico + primeiro marco navegável

Promise:

> You describe the bottleneck. Jean returns focused questions, scope, success criteria and the smallest end-to-end workflow worth building first. Timeline, investment and exclusions are defined before the build.

What this is not:

- an unlimited project;
- a generic "AI automation" package;
- a free speculative build;
- a promise of revenue, scale or continuous support;
- a replacement for discovery when the buyer has not described the current workflow.

Primary buyer fit:

1. A founder or operator with a manual workflow that spans spreadsheets, messages and disconnected tools.
2. A business with a live product that needs one critical flow fixed or expanded.
3. A team that needs a scoped SaaS, integration, automation or private agent, but can approve a small first milestone.

## 2. Destination matrix

| Buyer signal | Best destination | Proof to reference |
| --- | --- | --- |
| Needs a SaaS or internal system | `/pt/services/desenvolvimento-saas` | NexPanel or Gestão ML |
| Needs integrations or operational automation | `/pt/services/automacoes-ia` | Gestão ML |
| Needs a private AI workflow | `/pt/services/agentes-ia-privados` | Hermes Agentes |
| Marketplace operation is fragmented | `/pt/projects/gestaoml` | Sanitized Radar, Editor and Operations flow |
| IPTV reseller operation is in spreadsheets | `/pt/projects/nexpanel` | Reviewed reseller dashboard |
| Architecture studio needs batch visual review | `/pt/projects/archscene` | Live beta, examples and public changelog |
| Broad or referral introduction | `/pt` or `/en` | Offer section plus three priority cases |

Do not send every prospect to the homepage by default. Use the narrowest destination supported by the observed problem.

## 3. Canonical campaign links

Source of truth: `docs/distribution-links-2026-08-10.json`.

Validation command:

```bash
npm run validate:campaign-links
```

Rules:

- Only `utm_source`, `utm_medium`, `utm_campaign` and `utm_content` are allowed.
- Campaign is always `diagnosis-first-milestone` for this pack.
- Do not add names, emails, phone numbers or arbitrary query data.
- Use one link per placement so `utm_content` remains attributable.
- Do not shorten links before verifying that the shortener preserves the query string.

## 4. Content drafts

### X, PT-BR, builder post

ID: `X1`
Destination: `x-profile-pt`

```text
O problema de muito projeto de software não é falta de feature. É começar grande demais e só descobrir tarde que o fluxo principal estava errado.

Na JE4NDEV, a entrada que estou consolidando é simples: diagnóstico + primeiro marco navegável.

Você traz o gargalo. Eu mapeio usuários, integrações, critério de sucesso e o que fica fora. Depois construo o menor fluxo ponta a ponta que dá para abrir, testar e aprovar.

Sem vender projeto infinito antes da evidência.

[LINK x-profile-pt]
```

Proof boundary: this post describes the delivery method. It does not claim client volume, revenue or guaranteed outcome.

### X, PT-BR, Gestão ML case

ID: `X2`
Destination: `x-case-gestaoml-pt`

```text
Gestão de marketplace não começa no pedido. Começa antes, quando alguém precisa decidir se o produto tem margem, preparar fotos e oferta, revisar pendências e só então publicar.

Na Gestão ML, organizei esse caminho em três superfícies: Radar, Editor e Operação.

O ponto mais importante não é "usar IA". É manter cliente e conta isolados, separar dado real de estimativa e bloquear publicação sensível até aprovação humana.

O case público usa dados sanitizados e declara o que a prova não mostra.

[LINK x-case-gestaoml-pt]
```

Proof boundary: do not append seller count, GMV, order volume or autonomous-publishing claims.

### X, EN, ArchScene case

ID: `X3`
Destination: `x-case-archscene-en`

```text
Architecture teams rarely need one isolated AI image. They need a workflow that keeps the source scene, render batch, review history and project context together.

That is the product problem behind ArchScene.

The public beta now shows cost before AI actions, supports batch rendering, keeps source and output ready for review, and publishes dated product updates.

The case also states the boundary: reviewed examples do not guarantee fidelity for every input.

[LINK x-case-archscene-en]
```

### LinkedIn, PT-BR, proof post

ID: `L1`
Destination: `linkedin-profile-pt`

```text
Passei a apresentar meus projetos com uma regra mais rígida: cada case precisa separar claramente o que foi construído, qual foi meu papel, qual arquitetura sustenta o fluxo, o que está no ar e o que a prova pública não demonstra.

Isso parece detalhe de portfólio, mas é uma decisão de produto e venda.

Um screenshot pode provar que uma interface existe. Ele não prova volume, faturamento, performance ou resultado do cliente. Quando essa fronteira não é declarada, a copy fica maior do que a evidência.

Na JE4NDEV, também consolidei uma entrada comercial: diagnóstico + primeiro marco navegável. O cliente descreve o gargalo; eu devolvo escopo, critério de sucesso e o menor fluxo ponta a ponta que vale validar primeiro.

[LINK linkedin-profile-pt]
```

LinkedIn is a secondary proof channel. Recycle only after the core X/portfolio flow is working.

### TikTok/Reels, PT-BR, 30-second script

ID: `T1`
Destination: `tiktok-bio-pt`

```text
Hook: Seu sistema não precisa começar com vinte telas.

Corpo: Primeiro escolha um gargalo real. Mapeie quem usa, onde o fluxo quebra e o que precisa acontecer para chamar a primeira entrega de pronta. Aí você constrói um único caminho ponta a ponta, abre no navegador e valida antes de ampliar.

Fecho: É assim que eu trabalho na JE4NDEV: diagnóstico + primeiro marco navegável. Link no perfil.
```

Visual plan:

1. Show a cluttered spreadsheet/messages montage.
2. Cut to one simple flow diagram.
3. Show the Gestão ML, NexPanel and ArchScene case cards.
4. End on the offer section, not a generic logo screen.

### GitHub profile CTA, EN

ID: `G1`
Destination: `github-profile-en`

```text
Need to turn an operational bottleneck into a verifiable product slice? See the live cases and start with a diagnosis + first navigable milestone: [LINK github-profile-en]
```

Profile changes remain approval-gated.

## 5. Outbound drafts

These are templates, not approved sends. Replace every bracketed field with verified public evidence and present the exact final recipient/body to Jean before sending.

### Email, SaaS or internal system

ID: `E1`
Destination: `outbound-email-saas-pt`

Subject:

```text
Uma ideia objetiva para o fluxo de [EMPRESA]
```

Body:

```text
Oi, [NOME]. Encontrei a [EMPRESA] por [FONTE PÚBLICA] e vi que vocês [SINAL REAL DE OPERAÇÃO OU REPUTAÇÃO].

Notei que [GARGALO DIGITAL OBSERVADO, SEM AFIRMAR O QUE NÃO FOI VERIFICADO]. Em vez de propor um sistema grande de saída, eu começaria mapeando esse fluxo e entregando um primeiro marco navegável com critério de sucesso e escopo fechado.

Aqui está um exemplo do meu trabalho e da forma de entrega:
[LINK outbound-email-saas-pt]

Se fizer sentido, posso te devolver um esboço de uma página com o fluxo inicial, sem compromisso. Posso enviar?

Jean
JE4NDEV
```

### DM or WhatsApp, operations bottleneck

ID: `D1`
Destination: `outbound-dm-operations-pt`

```text
Oi, [NOME]. Vi a [EMPRESA] em [FONTE] e reparei que [SINAL REAL]. Trabalho transformando fluxos que hoje ficam entre planilha, WhatsApp e tarefas manuais em um primeiro marco navegável, pequeno o bastante para validar antes de ampliar.

Separei aqui três cases e o formato de entrada:
[LINK outbound-dm-operations-pt]

Se você me disser onde o fluxo mais trava hoje, posso responder com algumas perguntas objetivas e um recorte inicial. Faz sentido?
```

### Referral request

ID: `R1`
Destination: `referral-partner-pt`

```text
Estou abrindo espaço para projetos que comecem por um gargalo operacional claro, sem contrato infinito de saída. A entrada é diagnóstico + primeiro marco navegável.

Se você conhecer um founder ou operador que esteja preso entre planilhas, mensagens e ferramentas desconectadas, pode encaminhar este link:
[LINK referral-partner-pt]

Eu mesmo faço a primeira conversa e digo com transparência se existe um recorte que vale construir.
```

## 6. Lead qualification

A lead is qualified only when all required fields are known:

- identity and business are verified in a public source;
- current workflow or bottleneck is stated;
- there is a responsible decision-maker or clear contact route;
- the desired result can be framed as a bounded first milestone;
- timing is known or explicitly unknown;
- there is no request for unsafe access, free speculative build or unsupported guarantee.

Suggested status values:

- `new`
- `contacted`
- `conversation_started`
- `qualified`
- `proposal_sent`
- `closed_won`
- `closed_lost`
- `not_a_fit`

## 7. Seven-day release sequence

This sequence starts only after the portfolio changes are merged and production tracking is verified.

1. Day 1: verify production page views and CTA events with test UTM traffic.
2. Day 2: update one owned profile link using its canonical UTM URL, after Jean approves the exact profile change.
3. Day 3: publish at most one approved case/method post.
4. Day 4: prepare three verified prospects for exact-copy approval.
5. Day 5: send only the approved messages and update the lead ledger.
6. Day 6: inspect analytics and replies without sending automatic follow-ups.
7. Day 7: report visits, CTA clicks, conversations, qualified leads, proposals and gaps. Decide whether to repeat, revise or stop each channel.

## 8. Stop conditions

Stop distribution or outbound when:

- tracking is not working in production;
- a destination returns an error, login screen or mismatched offer;
- the message requires an invented metric, testimonial or result;
- contact evidence is ambiguous;
- a platform/account shows a restriction;
- the next step requires spend, public posting or sending without exact approval;
- traffic arrives but the CTA cannot be attributed;
- the same copy produces no conversation and the offer/destination has not been reviewed.
