import type { Project } from "@/types/project";

export const noraProject: Project = {
  slug: "nora",
  title: "Nora",
  description: {
    pt: "Assistente de IA personalizado para sites, com qualificação de demandas, resumo de escopo e registro consentido de contatos no Google Sheets.",
    en: "A custom AI website assistant for lead qualification, project scoping and consent-based contact records in private Google Sheets.",
  },
  shortDescription: {
    pt: "Conversa sobre a demanda, organiza o contexto e prepara um resumo para o atendimento humano.",
    en: "Explores the request, organizes context and prepares a brief for human follow-up.",
  },
  longDescription: {
    pt: "Nora é o assistente de IA do site da JE4NDEV e uma demonstração pública de um produto personalizado em operação. A conversa ajuda a entender objetivo, situação atual, solução desejada, restrições e dúvidas, preservando as correções do visitante. Quando há autorização de contato, o cadastro e o resumo alimentam uma planilha privada do Google Sheets. Uma fila durável conserva atualizações pendentes, enquanto o aviso no Telegram segue um canal independente. A memória é opcional, tem prazo de 30 dias e pode ser recuperada com o número cadastrado e um código pessoal. Escopo, preço e compromissos de entrega são definidos por Jean no atendimento humano.",
    en: "Nora is JE4NDEV's website AI assistant and a public demonstration of a custom product in operation. The conversation helps clarify the goal, current situation, desired solution, constraints and open questions while preserving the visitor's corrections. With permission to make contact, the registration and conversation brief feed a private Google Sheet. A durable queue retains pending updates, while Telegram notifications follow an independent channel. Memory is optional, expires after 30 days and can be recovered with the registered phone number and a personal code. Jean defines scope, pricing and delivery commitments during human follow-up.",
  },
  status: "live",
  role: "own-product",
  audience: ["business-owners", "founders", "service-businesses"],
  proofLevel: "public-live",
  visualKind: "product-screenshot",
  scope: {
    pt: "Assistente de IA para o site, qualificação de demandas e integrações de acompanhamento com consentimento.",
    en: "Website AI assistant, demand qualification and consent-based follow-up integrations.",
  },
  dateRange: { pt: "Em operação desde 2026", en: "In operation since 2026" },
  category: "AI Assistant",
  tags: ["ai", "assistant", "qualification", "automation", "integrations"],
  technologies: ["Next.js", "TypeScript", "Google Sheets", "Google Apps Script", "Cloudflare Turnstile", "Telegram"],
  problem: {
    pt: "Visitantes chegam com ideias em diferentes estágios e nem sempre conseguem descrever o que precisam em um formulário. O atendimento precisa entender o contexto, registrar dúvidas e restrições e preservar a escolha de pedir contato ou apenas explorar uma possibilidade.",
    en: "Visitors arrive with ideas at different stages and cannot always describe what they need in a form. Follow-up needs context, open questions and constraints, while preserving the visitor's choice to request contact or simply explore a possibility.",
  },
  solution: {
    pt: "Uma conversa guiada que reúne um resumo cumulativo e revisável pelo visitante. O backend registra os contatos autorizados e sincroniza o resumo com uma planilha privada, preservando os campos de atendimento e responsável editados pela equipe. A memória opcional permite retomar o contexto em outra sessão.",
    en: "A guided conversation builds a cumulative brief that the visitor can review. The backend stores authorized contacts and syncs the brief to a private spreadsheet, preserving the team's follow-up status and assigned owner. Optional memory supports resuming context in another session.",
  },
  deliveryRecord: {
    responsibility: {
      pt: "Produto, interface bilíngue, integração do modelo, controles de uso, persistência de contatos e operação pela JE4NDEV. Jean revisa a demanda e assume a definição de escopo, preço e próximos passos.",
      en: "Product, bilingual interface, model integration, usage controls, lead persistence and operations by JE4NDEV. Jean reviews the request and takes responsibility for scope, pricing and next steps.",
    },
    architecture: {
      pt: "Widget em Next.js e TypeScript, backend de conversa e registros persistidos. A sincronização usa fila durável e relay Google Apps Script com assinatura HMAC e planilha fixa. Telegram é uma notificação separada. Turnstile, proteção CSRF, limites de requisição e de concorrência controlam a admissão da conversa.",
      en: "Next.js and TypeScript widget, conversation backend and persisted records. Sync uses a durable queue and a Google Apps Script relay with HMAC signatures and a fixed spreadsheet. Telegram is a separate notification channel. Turnstile, CSRF protection, request limits and concurrency controls govern conversation admission.",
    },
    currentState: {
      pt: "Assistente público em português e inglês no site da JE4NDEV, com cadastro consentido, resumo de demanda e sincronização privada de contatos. A prova visual apresenta o onboarding real da Nora. Este case descreve o produto próprio e sua implementação.",
      en: "Public assistant in Portuguese and English on JE4NDEV's website, with consent-based registration, conversation briefs and private lead sync. Visual proof presents Nora's real onboarding. This case describes JE4NDEV's own product and its implementation.",
    },
    limitations: {
      pt: "A fila durável atende à entrega dos registros ao Sheets. Se o modelo estiver ocupado, a conversa exige nova tentativa manual; não há fila automática de inferência. Memória opcional de 30 dias usa número e código pessoal, sem comprovar titularidade do WhatsApp. Um registro salvo ou aviso Telegram entregue não confirma atendimento, proposta ou contratação. A Nora depende do provedor do modelo e das integrações externas; escopo e preço exigem revisão humana.",
      en: "The durable queue delivers records to Sheets. When the model is busy, the conversation requires a manual retry; inference has no automatic queue. Optional 30-day memory uses a phone number and personal code without verifying WhatsApp ownership. A saved record or delivered Telegram notification does not confirm follow-up, a proposal or a contract. Nora depends on the model provider and external integrations; scope and pricing require human review.",
    },
  },
  metrics: [],
  links: {
    live: "https://je4ndev.com/en",
  },
  primaryCta: "contact",
  image: "/projects/captures/nora-welcome-en.png",
  assetReview: {
    status: "approved",
    sourceUrl: "https://je4ndev.com/en",
    reviewedAt: "2026-10-01",
    note: {
      pt: "Captura real do onboarding público em inglês, feita em 01/10/2026 com campos vazios. A imagem mostra a entrada da conversa; não contém contatos nem demonstra resultados de clientes.",
      en: "Real English public onboarding captured on October 1, 2026 with empty fields. The image shows the conversation entry, contains no contact details and makes no customer-results claim.",
    },
  },
  gradient: "from-teal-600/20 via-emerald-500/10 to-cyan-600/20",
  featured: false,
  casePriority: 17,
};
