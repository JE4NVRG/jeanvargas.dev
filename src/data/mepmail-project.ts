import type { Project } from "@/types/project";

/** MepMail's maintained product and public documentation, not an original-upstream claim. */
export const mepMailProject: Project = {
  slug: "mepmail",
  title: "MepMail",
  description: {
    pt: "E-mail transacional para produtos digitais. API compatível com SDKs Resend, SMTP e integração com agentes via MCP, sobre Amazon SES.",
    en: "Transactional email for digital products. A Resend-SDK-compatible API, SMTP and MCP agent integration, powered by Amazon SES.",
  },
  shortDescription: {
    pt: "A infraestrutura de e-mail que conecta aplicações, operações e agentes de IA.",
    en: "Email infrastructure connecting applications, operations and AI agents.",
  },
  longDescription: {
    pt: "MepMail é o produto de e-mail transacional mantido e operado pela JE4NDEV. Reúne uma API compatível com SDKs Resend, relay SMTP e envio por Amazon SES. Documentação pública e ferramentas MCP e CLI apoiam a integração com aplicações e agentes. O trabalho da JE4NDEV inclui adaptação do produto, operação, experiência comercial e integrações; a base open source e sua atribuição AGPL são preservadas.",
    en: "MepMail is the transactional-email product maintained and operated by JE4NDEV. It combines a Resend-SDK-compatible API, an SMTP relay and delivery through Amazon SES. Public documentation and MCP and CLI tools support application and agent integrations. JE4NDEV's work includes product adaptation, operations, commercial experience and integrations; the open-source foundation and its AGPL attribution are preserved.",
  },
  status: "live",
  role: "own-product",
  audience: ["developers", "saas-founders", "ai-agent-builders"],
  proofLevel: "public-live",
  visualKind: "product-screenshot",
  scope: {
    pt: "Produto, operação de e-mail e integrações para aplicações e agentes.",
    en: "Product, email operations and integrations for applications and agents.",
  },
  dateRange: { pt: "Em operação", en: "In operation" },
  category: "Email Infrastructure",
  tags: ["saas", "email", "api", "mcp", "open-source"],
  technologies: ["TypeScript", "PostgreSQL", "Amazon SES", "MCP"],
  problem: {
    pt: "Produtos precisam enviar e-mails transacionais e acompanhar a operação sem manter integrações desconectadas para cada aplicação ou agente.",
    en: "Products need to send transactional email and monitor operations without maintaining disconnected integrations for each application or agent.",
  },
  solution: {
    pt: "Uma superfície de API, SMTP e ferramentas para agentes, com documentação pública, fila de envio e eventos operacionais sobre Amazon SES.",
    en: "API, SMTP and agent tooling with public documentation, a sending queue and operational events on Amazon SES.",
  },
  deliveryRecord: {
    responsibility: {
      pt: "Adaptação, manutenção e operação pela JE4NDEV sobre uma base open source, preservando sua atribuição.",
      en: "Adaptation, maintenance and operations by JE4NDEV on an open-source foundation, preserving upstream attribution.",
    },
    architecture: {
      pt: "API e relay SMTP, PostgreSQL e fila durável, envio por Amazon SES e eventos de entrega; ferramentas MCP e CLI para integração.",
      en: "API and SMTP relay, PostgreSQL and a durable queue, Amazon SES delivery and delivery events; MCP and CLI integration tools.",
    },
    currentState: {
      pt: "Landing, documentação pública e integrações para desenvolvedores. A prova visual mostra a galeria de templates publicada na página atual do MepMail; não expõe uma sessão privada ou dados de clientes.",
      en: "Public landing page, documentation and developer integrations. Visual proof shows the template gallery published on MepMail's current product page; it does not expose a private session or customer data.",
    },
    limitations: {
      pt: "Compatibilidade com SDKs não significa paridade integral com outro provedor. Entregabilidade depende de domínio, reputação, conteúdo e políticas; não há garantia de entrega universal ou métricas comerciais neste case.",
      en: "SDK compatibility does not mean complete parity with another provider. Deliverability depends on domain, reputation, content and policies; this case makes no universal delivery guarantee or commercial-metric claim.",
    },
  },
  metrics: [
    { value: "API + SMTP", label: { pt: "Integração com aplicações", en: "Application integration" }, color: "cyan", verified: true },
    { value: "MCP", label: { pt: "Integração com agentes", en: "Agent integration" }, color: "green", verified: true },
    { value: "Amazon SES", label: { pt: "Infraestrutura de envio", en: "Sending infrastructure" }, color: "purple", verified: true },
    { value: "AGPL", label: { pt: "Base open source atribuída", en: "Attributed open-source foundation" }, color: "pink", verified: true },
  ],
  links: {
    live: "https://mepmail.je4ndev.com",
    github: "https://github.com/JE4NVRG/mepmail",
    docs: "https://docs-mepmail.je4ndev.com",
  },
  primaryCta: "live",
  image: "/projects/captures/mepmail-templates-public.webp",
  coverImage: "/projects/captures/mepmail-home-latest.webp",
  assetReview: {
    status: "approved",
    sourceUrl: "https://mepmail.je4ndev.com",
    reviewedAt: "2026-09-30",
    note: {
      pt: "Galeria real de templates apresentada na página pública atual do MepMail. Mostra templates, não métricas comerciais ou uma jornada de cliente validada neste case.",
      en: "Real template gallery publicly presented on MepMail's current product page. Shows templates, not commercial metrics or a customer journey verified for this case.",
    },
  },
  gradient: "from-blue-600/20 via-sky-600/10 to-indigo-500/20",
  featured: true,
  casePriority: 1,
};
