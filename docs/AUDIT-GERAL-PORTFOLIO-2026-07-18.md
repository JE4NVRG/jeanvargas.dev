<!-- markdownlint-disable MD013 -->

# Auditoria geral do portfólio JE4NDEV — 2026-07-18

## Resumo executivo

O portfólio está tecnicamente saudável e visualmente pronto para uma revisão pré-publicação. A branch atual passou em build, lint, TypeScript, auditoria de dependências, integridade do catálogo, responsividade em 390 px e testes dos eventos de conversão.

Para captação orgânica e contato direto, o corte está em boa condição. Antes de investir em tráfego pago, permanecem três bloqueios operacionais:

1. definir persistência, retenção e leitura dos eventos de analytics;
2. consolidar `www.je4ndev.com` no host canonical `je4ndev.com` com redirect permanente;
3. executar Lighthouse/Core Web Vitals em ambiente equivalente à produção.

Não houve deploy durante esta auditoria.

## Escopo verificado

- posicionamento comercial e jornada de conversão;
- responsividade e acessibilidade básica;
- integridade dos 12 projetos e links públicos;
- SEO técnico, metadata, JSON-LD, sitemap e robots;
- build de produção e dependências;
- headers e endpoints públicos;
- transferência inicial e métricas locais indicativas;
- estado do repositório e apresentação no GitHub;
- coerência do README com o produto atual.

## Resultado por área

| Área | Estado | Evidência |
| --- | --- | --- |
| Build | Aprovado | Next.js 16.2.3, 35 páginas estáticas/SSG e APIs dinâmicas |
| Lint e tipos | Aprovado | ESLint sem erros; TypeScript e tipos de rotas aprovados |
| Dependências | Aprovado | `npm audit --omit=dev --audit-level=high`: 0 vulnerabilidades |
| Catálogo | Aprovado após correção | 12 projetos, prioridades únicas e assets presentes |
| Links públicos | Aprovado após correção | link de GitHub privado da Gestão ML removido da superfície pública |
| Mobile | Aprovado | 390 × 844 sem overflow horizontal; menu e CTAs funcionais |
| Acessibilidade básica | Aprovado com ressalvas | H1 único, nomes acessíveis e alvos críticos de 44 px; WCAG completa pendente |
| SEO no código | Forte | canonical, `hreflang`, Open Graph, JSON-LD, sitemap e robots |
| SEO em produção | Atenção | apex e `www` respondem 200; índice ainda mostra copy e preços antigos |
| Segurança | Boa base | validação Zod, limites de payload, upload dev-only e headers básicos adicionados |
| Analytics | Funcional, não operacional | eventos chegam ao endpoint, mas hoje são apenas logs do servidor |
| Performance | Boa amostra local, auditoria incompleta | 416 KB em cache frio observado; Lighthouse/CWV pendente |
| GitHub | Corrigido na branch | README refeito, screenshots atuais e workflow de qualidade preparado |

## Métricas locais de produção

Medição indicativa feita contra `next start`, cache desabilitado, em loopback local:

| Métrica observada | Resultado |
| --- | ---: |
| Requisições iniciais | 24 |
| Transferência inicial codificada | 416 KB |
| JavaScript transferido | 296 KB |
| Fonts transferidas | 52 KB |
| Documento HTML | 29 KB |
| Imagens iniciais | 20 KB |
| CSS | 11 KB |
| DOMContentLoaded local | ~687 ms |
| First Meaningful Paint indicado pelo CDP | ~592 ms |
| Heap JS após carregamento | ~25,1 MB |
| Nós DOM observados | 8.423 |

Esses números não substituem Lighthouse nem dados de campo. Loopback elimina latência real, Cloudflare, TLS, CPU de celular e condições de rede. O número de nós DOM merece atenção porque a home renderiza o catálogo e todas as seções no mesmo documento.

## Achados priorizados

### P1 — Hosts duplicados em produção

**Evidência:** `https://je4ndev.com/pt` e `https://www.je4ndev.com/pt` responderam `200` em 18/07/2026. O código usa `https://je4ndev.com` como canonical e no sitemap (`src/app/[locale]/layout.tsx:51`, `src/app/sitemap.ts:4`).

**Risco:** duplicação de URL, sinais de autoridade divididos e rastreamento fragmentado.

**Ação recomendada:** redirect permanente `www` → apex no Cloudflare ou nginx, preservando path e query. Revalidar sitemap, canonical e Search Console depois.

### P1 — Analytics ainda não fecha o funil comercial

**Evidência:** o endpoint valida e escreve eventos com `console.info` (`src/app/api/analytics/route.ts:4-30`). Cliques, 50% de scroll e 30 segundos de engajamento foram observados gerando POST real.

**Risco:** dados podem desaparecer com rotação de logs e ainda não existe painel, retenção ou atribuição de lead.

**Ação recomendada:** persistir apenas eventos mínimos em banco ou coletor, definir retenção, dashboard e correlação anônima de sessão antes de mídia paga. Aplicar rate limit no Cloudflare.

### P1 — Lighthouse/Core Web Vitals não concluído

**Evidência:** o conector Chrome DevTools exigido pela auditoria não está disponível nesta sessão. Foi possível medir rede e timing local via CDP, mas não LCP, CLS, INP, TBT e Speed Index com o protocolo completo.

**Ação recomendada:** configurar `chrome-devtools-mcp` e executar trace de cache frio em mobile e desktop sobre o build de produção.

### P2 — DOM grande

**Evidência:** 8.423 nós observados após o carregamento completo da home.

**Risco:** maior custo de style/layout, memória e interação em dispositivos modestos.

**Ação recomendada:** medir por seção no trace completo. Se confirmado como gargalo, renderizar parte do universo sob demanda ou reduzir duplicação estrutural sem esconder conteúdo essencial de SEO.

### P2 — Assets-fonte pesados

**Evidência:** `openclaw-terminal.mp4` tem 10,7 MB; `hero-blob.mp4`, 3,19 MB; `jean-about.png`, 1,67 MB. O hero já evita vídeo em mobile, Save-Data, rede lenta e reduced motion (`src/components/ui/hero-video-bg.tsx:9-56`). `next/image` otimiza as fotos usadas na interface.

**Risco:** bandwidth pós-render e custo alto em páginas de case que reproduzam vídeos.

**Ação recomendada:** medir cada case, recomprimir vídeos e publicar variantes menores antes de autoplay amplo. Não remover assets apenas pelo tamanho do arquivo-fonte.

### P2 — CSP e rate limit dependem da infraestrutura

**Evidência:** produção não apresentou CSP nos headers observados. A branch agora adiciona `nosniff`, `DENY`, Referrer Policy, Permissions Policy e remove `X-Powered-By` (`next.config.ts:3-34`).

**Risco:** menor defesa em profundidade contra XSS e abuso de endpoints.

**Ação recomendada:** criar CSP compatível com scripts do Next.js usando nonce/hash e validar em report-only antes de bloquear. Aplicar rate limit na borda para `/api/analytics`.

### P3 — Índice de busca ainda descreve a versão antiga

**Evidência:** resultados rastreados recentemente ainda exibem “Starts at US$ 100”, prazos e provas antigas.

**Ação recomendada:** depois do deploy aprovado, solicitar recrawl das homes e cases prioritários, reenviar sitemap e acompanhar snippets.

### P3 — Pull request antigo aberto

**Evidência:** PR #1, de 22/05/2026, permanece aberto com uma versão anterior do Sprint 1.

**Risco:** confusão de histórico e possibilidade de reintroduzir copy ou componentes superados.

**Ação recomendada:** revisar e encerrar ou superseder explicitamente quando a branch atual virar PR.

## Correções aplicadas nesta branch

- README totalmente reescrito com stack, arquitetura, provas e contatos atuais;
- screenshots desktop, mobile e universo de projetos recapturados;
- link privado da Gestão ML removido da interface pública;
- headers básicos de segurança adicionados;
- `X-Powered-By` desabilitado;
- canonical do README alinhado a `je4ndev.com`;
- workflow de qualidade preparado para pull requests;
- auditoria de captação anterior preservada e ligada no README.

## Pontos fortes confirmados

- sem vulnerabilidades conhecidas no `npm audit` atual;
- endpoint de screenshot bloqueado em produção e protegido por tamanho, MIME, filename e subdiretório (`src/app/api/save-screenshot/route.ts:10-38`);
- JSON-LD é gerado apenas de dados internos serializados, sem entrada arbitrária do visitante;
- nenhum uso de `eval`, `new Function`, `document.write` ou HTML arbitrário foi encontrado;
- catálogo diferencia prova pública, privada, editorial e interna;
- analytics não usa cookies nem scripts de terceiros;
- mobile e reduced motion possuem fallback funcional;
- build `standalone` e CI reproduzível com `npm ci`.

## Gate recomendado antes do deploy

1. Revisar visualmente README e home no navegador.
2. Rodar `npm run validate` e `npm audit --omit=dev --audit-level=high`.
3. Confirmar `npm run audit:links` sem erros.
4. Abrir PR da branch atual e deixar o GitHub Actions concluir.
5. Resolver/superseder o PR antigo.
6. Após aprovação do Jean, fazer deploy.
7. Configurar redirect `www` → apex e revalidar headers.
8. Executar Lighthouse/CWV e solicitar recrawl.

## Limites

- nenhuma área autenticada foi auditada;
- não foi realizado pentest;
- Lighthouse e métricas de campo não foram executados;
- resultados locais não representam latência de usuário real;
- CSP, WAF, rate limits e redirects de host precisam ser confirmados na infraestrutura de produção.
