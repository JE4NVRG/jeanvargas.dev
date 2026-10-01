/**
 * Standalone SEO metadata catalog for project case-study routes.
 *
 * Contract (editorial, not a search-engine ranking rule):
 * - One entry per project declared in `src/data/projects.ts`, keyed by slug.
 * - Each entry carries a PT and an EN description, aiming for 150-160 JS
 *   characters, so the metadata is a complete sentence instead of the short
 *   card copy used in listings and grids.
 * - Descriptions state project identity plus a meaningful supported
 *   capability/state taken from the project record. Archived, internal and MVP
 *   status is stated honestly; no customer metrics, revenue or availability is
 *   invented.
 * - Unknown slugs are rejected instead of silently falling back to shorter
 *   card copy, so a catalog gap fails loudly in tests and in the route.
 */

export type ProjectSeoLocale = "pt" | "en";

export interface ProjectSeoDescription {
  pt: string;
  en: string;
}

export const PROJECT_SEO_DESCRIPTIONS: Record<string, ProjectSeoDescription> = {
  nora: {
    pt: "Conheça a Nora, assistente de IA da JE4NDEV no site: conversa sobre seu projeto, organiza um briefing e registra contatos no Google Sheets com revisão humana.",
    en: "Explore Nora, JE4NDEV's custom AI website assistant: discuss your project, review a brief and send contact details to private Google Sheets for human follow-up.",
  },
  mepmail: {
    pt: "O MepMail conecta aplicações e agentes ao e-mail transacional por API, SMTP e MCP, com Amazon SES, documentação pública e base open source auto-hospedável.",
    en: "MepMail connects applications and agents to transactional email through API, SMTP and MCP, with Amazon SES, public docs and self-hostable open-source platform.",
  },
  nexpanel: {
    pt: "O NexPanel é um SaaS operacional para gestão de clientes: servidores, créditos, ativações, vencimentos, financeiro e permissões de equipe em um só dashboard.",
    en: "NexPanel is an operations SaaS for client lifecycle management: servers, credits, activations, due dates, finance and role-based permissions in one dashboard.",
  },
  "vultrix-3d": {
    pt: "O Vultrix 3D é uma plataforma de gestão para estúdios de impressão 3D: calculadora de custos .3mf e .gcode, taxas de marketplace, margens, estoque e financeiro.",
    en: "Vultrix 3D is a management platform for 3D printing studios: a .3mf and .gcode cost calculator, marketplace fees, margins, inventory and financial control.",
  },
  "hermes-agentes": {
    pt: "O Hermes Agentes é o laboratório interno de operações com agentes da JE4NDEV: perfis por escopo, dispatcher Kanban, permissões de ferramentas e revisão humana.",
    en: "Hermes Agentes is JE4NDEV's internal agent-operations lab: scoped profiles, a Kanban dispatcher, tool permissions and human review. Not a client deployment.",
  },
  archscene: {
    pt: "O ArchScene é um beta público para escritórios de arquitetura: cenas do SketchUp viram renders em lote, com custo em créditos visível antes de cada ação de IA.",
    en: "ArchScene is a public beta for architecture studios: SketchUp scenes become batch renders, with credit cost visible before each AI action and private galleries.",
  },
  "arremata-radar": {
    pt: "O Arremata Radar é um case arquivado de fluxo de pesquisa imobiliária com catálogo e scoring; o deploy está pausado, então não há demo ao vivo para visitar.",
    en: "Arremata Radar is an archived case study of a property research workflow with source provenance and scoring; its deployment is paused, so there is no live demo.",
  },
  "openclaw-gateway": {
    pt: "O OpenClaw Gateway é um gateway privado multi-modelo instalado na infraestrutura do cliente, com endpoint compatível com OpenAI, ferramentas MCP e memória.",
    en: "OpenClaw Gateway is a private multi-model AI gateway deployed to client-owned infrastructure, with an OpenAI-compatible endpoint, MCP tools and memory.",
  },
  mepchat: {
    pt: "O MepChat é um MVP de 2024: chatbot de WhatsApp com IA para consultas rotineiras e painel de gestão CNPJ, validado como protótipo, não como produto em operação.",
    en: "MepChat is a 2024 MVP: an AI WhatsApp chatbot for routine inquiries with a CNPJ management dashboard, validated as a prototype rather than a running product.",
  },
  fullcommerce360: {
    pt: "O FullCommerce360 organiza a rotina do seller no Mercado Livre: pesquisa de margem, preparo do anúncio, aprovação humana para publicar, pedidos e estoque.",
    en: "FullCommerce360 organizes Mercado Livre seller work: compare margins, prepare listings, require human approval to publish, then track orders and stock levels.",
  },
  urlpivot: {
    pt: "O URLPivot mantém link e QR impresso funcionando: mude o destino de um link gerenciado, reúna links em Pages de campanha e acompanhe visualizações e cliques.",
    en: "URLPivot keeps a shared link and printed QR working: change a managed link's destination, group links on campaign Pages, and review its views and clicks.",
  },
  hypefc: {
    pt: "O HypeFC é um case arquivado de dashboard de futebol em tempo real alimentado pela API-Football; o deploy está pausado, então o case aparece sem demo ao vivo.",
    en: "HypeFC is an archived case study of a realtime football dashboard fed by API-Football; its deployment is paused, so the case is shown without a live demo.",
  },
  stopultimate: {
    pt: "O Stop Ultimate é um case arquivado de jogo multiplayer de palavras em português com julgamento por IA; o deploy está pausado, então não há demo ao vivo.",
    en: "Stop Ultimate is an archived case study of a multiplayer Portuguese word game judged by AI; its deployment is paused and no live demo is offered for the game.",
  },
  "alchemix-auditor": {
    pt: "O Alchemix Auditor é um case arquivado de interface de auditoria Solidity construída com Foundry e Echidna; o deploy está pausado e não há demo ao vivo.",
    en: "Alchemix Auditor is an archived case study of a Solidity audit interface built with Foundry and Echidna; its deployment is paused and no live demo is offered.",
  },
  "ethena-scanner": {
    pt: "O Ethena Scanner é um case arquivado de interface de monitoramento de stablecoin e oráculos com alertas; o deploy está pausado e não há demo ao vivo hoje.",
    en: "Ethena Scanner is an archived case study of a stablecoin and oracle monitoring interface with alerts; its deployment is paused, so no live demo is offered.",
  },
  "bounty-hunter-mvp": {
    pt: "O Bounty Hunter é um MVP interno que agrega programas da Immunefi, Code4rena e Sherlock por semana e ranqueia por stack, payout e severidade para nossa rede.",
    en: "Bounty Hunter is an internal MVP that aggregates Immunefi, Code4rena and Sherlock programs weekly and ranks them by stack, payout and severity for our auditors.",
  },
};

function isLocale(value: string): value is ProjectSeoLocale {
  return value === "pt" || value === "en";
}

/**
 * Returns the SEO description for a project slug and locale.
 *
 * Throws when the slug is absent from the catalog or the locale entry is
 * empty: a missing key must surface as a hard failure instead of degrading to
 * the short card copy.
 */
export function getProjectSeoDescription(slug: string, locale: ProjectSeoLocale): string {
  if (typeof slug !== "string" || slug.length === 0) {
    throw new Error("getProjectSeoDescription: slug is required");
  }
  if (!isLocale(locale)) {
    throw new Error(`getProjectSeoDescription: unsupported locale "${String(locale)}"`);
  }
  const entry = PROJECT_SEO_DESCRIPTIONS[slug];
  if (!entry) {
    throw new Error(
      `getProjectSeoDescription: no SEO description registered for slug "${slug}"`,
    );
  }
  const description = entry[locale];
  if (typeof description !== "string" || description.trim().length === 0) {
    throw new Error(
      `getProjectSeoDescription: empty "${locale}" SEO description for slug "${slug}"`,
    );
  }
  return description;
}
