export type ServiceLocale = "pt" | "en";

type LocalizedText = Record<ServiceLocale, string>;

export interface ServiceOffer {
  id: "saas" | "automation" | "agents";
  slugs: Record<ServiceLocale, string>;
  label: LocalizedText;
  title: LocalizedText;
  metaTitle: LocalizedText;
  metaDescription: LocalizedText;
  hero: LocalizedText;
  intro: LocalizedText;
  buyerFit: LocalizedText[];
  deliverables: LocalizedText[];
  process: Array<{
    title: LocalizedText;
    description: LocalizedText;
  }>;
  faq: Array<{
    question: LocalizedText;
    answer: LocalizedText;
  }>;
  relatedProjectSlugs: string[];
  whatsappPrompt: LocalizedText;
}

export const serviceOffers: ServiceOffer[] = [
  {
    id: "saas",
    slugs: { pt: "desenvolvimento-saas", en: "saas-development" },
    label: { pt: "Engenharia de produto", en: "Product engineering" },
    title: {
      pt: "Desenvolvimento de SaaS e sistemas sob medida",
      en: "Custom SaaS and internal systems development",
    },
    metaTitle: {
      pt: "Desenvolvimento de SaaS sob medida | Jean Carlos Vargas | JE4NDEV",
      en: "Custom SaaS development | Jean Carlos Vargas | JE4NDEV",
    },
    metaDescription: {
      pt: "Desenvolvimento founder-led de SaaS e sistemas internos com autenticação, permissões, integrações, billing e deploy por marcos verificáveis.",
      en: "Founder-led SaaS and internal systems development with authentication, permissions, integrations, billing and verifiable milestones.",
    },
    hero: {
      pt: "Do fluxo manual a um produto que sua operação consegue usar, medir e evoluir.",
      en: "From a manual workflow to a product your operation can use, measure and evolve.",
    },
    intro: {
      pt: "Eu desenho e construo o primeiro recorte útil do produto, conectando interface, regras de negócio, dados e integrações. O trabalho começa por critério de sucesso e termina em evidência navegável — não em uma lista abstrata de features.",
      en: "I design and build the first useful product slice, connecting interface, business rules, data and integrations. The engagement starts with success criteria and ends in navigable evidence — not an abstract feature list.",
    },
    buyerFit: [
      {
        pt: "A operação depende de planilhas, mensagens e retrabalho para manter dados sincronizados.",
        en: "The operation depends on spreadsheets, messages and rework to keep data synchronized.",
      },
      {
        pt: "Existe uma ideia validada, mas falta transformar o fluxo em um MVP com arquitetura evolutiva.",
        en: "There is a validated idea, but the workflow still needs to become an MVP with an evolvable architecture.",
      },
      {
        pt: "Um produto existente precisa de autenticação, permissões, billing, painel administrativo ou resgate técnico.",
        en: "An existing product needs authentication, permissions, billing, an admin panel or technical recovery.",
      },
    ],
    deliverables: [
      { pt: "Fluxo atual, usuários e critério de aceite", en: "Current workflow, users and acceptance criteria" },
      { pt: "Arquitetura e recorte do primeiro marco", en: "Architecture and first milestone slice" },
      { pt: "Interface responsiva e estados reais", en: "Responsive interface and real states" },
      { pt: "Backend, banco, autenticação e permissões", en: "Backend, database, authentication and permissions" },
      { pt: "Integrações e billing quando fazem parte do escopo", en: "Integrations and billing when included in scope" },
      { pt: "Preview, QA, documentação e handoff", en: "Preview, QA, documentation and handoff" },
    ],
    process: [
      {
        title: { pt: "Diagnóstico", en: "Diagnosis" },
        description: {
          pt: "Mapeamos fluxo, usuário, gargalo, dados, integrações e risco.",
          en: "We map the workflow, user, bottleneck, data, integrations and risk.",
        },
      },
      {
        title: { pt: "Primeiro marco", en: "First milestone" },
        description: {
          pt: "Fechamos entregáveis, exclusões, aceite, prazo e investimento antes do build.",
          en: "We define deliverables, exclusions, acceptance, timeline and investment before the build.",
        },
      },
      {
        title: { pt: "Preview navegável", en: "Navigable preview" },
        description: {
          pt: "Você abre, testa e valida o fluxo antes do próximo marco.",
          en: "You open, test and validate the workflow before the next milestone.",
        },
      },
      {
        title: { pt: "Aceite e produção", en: "Acceptance and production" },
        description: {
          pt: "Rodamos os gates definidos e fazemos deploy ou handoff conforme o contrato.",
          en: "We run the agreed gates and deploy or hand off according to the engagement.",
        },
      },
    ],
    faq: [
      {
        question: { pt: "Você trabalha apenas com MVP?", en: "Do you only build MVPs?" },
        answer: {
          pt: "Não. Posso construir o primeiro marco de um produto novo, evoluir um sistema em produção ou recuperar uma base existente. O recorte depende do risco e do resultado esperado.",
          en: "No. I can build the first milestone of a new product, evolve a production system or recover an existing codebase. The slice depends on risk and expected outcome.",
        },
      },
      {
        question: { pt: "O código e os dados ficam comigo?", en: "Do I keep the code and data?" },
        answer: {
          pt: "A propriedade, o repositório, os acessos e o handoff são definidos na proposta. A arquitetura evita dependência forçada da JE4NDEV.",
          en: "Ownership, repository access, credentials and handoff are defined in the proposal. The architecture avoids forced dependency on JE4NDEV.",
        },
      },
      {
        question: { pt: "Quanto tempo leva?", en: "How long does it take?" },
        answer: {
          pt: "O prazo final só é definido depois de mapear integrações, dados, risco e critério de aceite. A proposta sempre começa por um primeiro marco verificável.",
          en: "The final timeline is defined only after mapping integrations, data, risk and acceptance criteria. The proposal always starts with a verifiable first milestone.",
        },
      },
    ],
    relatedProjectSlugs: ["archscene", "arremata-radar", "fullcommerce360"],
    whatsappPrompt: {
      pt: "Oi Jean, quero avaliar um SaaS ou sistema sob medida. Meu gargalo hoje é: ",
      en: "Hi Jean, I want to evaluate a custom SaaS or internal system. My current bottleneck is: ",
    },
  },
  {
    id: "automation",
    slugs: { pt: "automacoes-ia", en: "ai-automation" },
    label: { pt: "Automação operacional", en: "Operational automation" },
    title: {
      pt: "Automações com IA e integrações para operações reais",
      en: "AI automation and integrations for real operations",
    },
    metaTitle: {
      pt: "Automação com IA e integrações | Jean Carlos Vargas | JE4NDEV",
      en: "AI automation and integrations | Jean Carlos Vargas | JE4NDEV",
    },
    metaDescription: {
      pt: "Automatize processos com integrações, logs, aprovações humanas e métricas. WhatsApp, APIs, pagamentos, marketplaces, CRM e sistemas internos.",
      en: "Automate workflows with integrations, logs, human approvals and metrics across APIs, payments, marketplaces, CRM and internal systems.",
    },
    hero: {
      pt: "Automatize o caminho repetitivo sem perder controle sobre exceções, acesso e decisão humana.",
      en: "Automate the repetitive path without losing control over exceptions, access and human decisions.",
    },
    intro: {
      pt: "Automação útil não é um fluxo isolado que quebra em silêncio. Eu conecto os sistemas que já fazem parte da operação, desenho fallback e aprovação quando necessário e deixo logs suficientes para o time entender o que aconteceu.",
      en: "Useful automation is not an isolated flow that fails silently. I connect the systems already used by the operation, design fallback and approval where needed, and keep enough logs for the team to understand what happened.",
    },
    buyerFit: [
      {
        pt: "O time copia dados entre WhatsApp, CRM, ERP, marketplace, pagamento e planilhas.",
        en: "The team copies data across WhatsApp, CRM, ERP, marketplaces, payments and spreadsheets.",
      },
      {
        pt: "Tarefas repetitivas consomem horas, mas algumas decisões ainda precisam de aprovação humana.",
        en: "Repetitive tasks consume hours, while some decisions still require human approval.",
      },
      {
        pt: "A empresa já tentou automatizar, mas não tem logs, fallback, segurança ou dono do processo.",
        en: "The company tried to automate, but lacks logs, fallback, security or process ownership.",
      },
    ],
    deliverables: [
      { pt: "Mapa do processo atual e dos sistemas envolvidos", en: "Map of the current process and connected systems" },
      { pt: "Critério de automação, exceções e aprovação humana", en: "Automation rules, exceptions and human approvals" },
      { pt: "Integrações via API, webhook ou conectores adequados", en: "Integrations through APIs, webhooks or suitable connectors" },
      { pt: "Logs, idempotência, retry e alertas conforme o risco", en: "Logs, idempotency, retries and alerts according to risk" },
      { pt: "Painel ou relatório para acompanhar o resultado", en: "Dashboard or report to track the outcome" },
      { pt: "Documentação e rotina de operação", en: "Documentation and operating routine" },
    ],
    process: [
      {
        title: { pt: "Observe", en: "Observe" },
        description: { pt: "Medimos frequência, custo, erro e decisão no fluxo atual.", en: "We measure frequency, cost, errors and decisions in the current flow." },
      },
      {
        title: { pt: "Recorte", en: "Scope" },
        description: { pt: "Escolhemos o trecho com valor e risco controlável.", en: "We select the slice with useful value and controllable risk." },
      },
      {
        title: { pt: "Integre", en: "Integrate" },
        description: { pt: "Conectamos sistemas com logs, fallback e permissões.", en: "We connect systems with logs, fallback and permissions." },
      },
      {
        title: { pt: "Meça", en: "Measure" },
        description: { pt: "Validamos tempo poupado, erros evitados e exceções restantes.", en: "We validate time saved, avoided errors and remaining exceptions." },
      },
    ],
    faq: [
      {
        question: { pt: "Toda automação precisa usar IA?", en: "Does every automation need AI?" },
        answer: {
          pt: "Não. Regras determinísticas são preferíveis quando resolvem o problema com menor custo e risco. IA entra quando interpretação, classificação ou geração realmente agrega valor.",
          en: "No. Deterministic rules are preferable when they solve the problem with lower cost and risk. AI is used when interpretation, classification or generation adds real value.",
        },
      },
      {
        question: { pt: "Vocês usam n8n?", en: "Do you use n8n?" },
        answer: {
          pt: "A implementação é escolhida conforme controle, volume, manutenção e ambiente. A JE4NDEV prioriza código e integrações auditáveis quando o fluxo é crítico.",
          en: "Implementation is chosen according to control, volume, maintenance and environment. JE4NDEV prioritizes code and auditable integrations for critical workflows.",
        },
      },
      {
        question: { pt: "Como evitam ações erradas?", en: "How do you prevent incorrect actions?" },
        answer: {
          pt: "O desenho pode incluir validação, idempotência, limites, dry-run, aprovação humana, rollback e trilha de auditoria, proporcionalmente ao risco.",
          en: "The design can include validation, idempotency, limits, dry runs, human approval, rollback and audit trails in proportion to risk.",
        },
      },
    ],
    relatedProjectSlugs: ["fullcommerce360", "urlpivot", "nexpanel"],
    whatsappPrompt: {
      pt: "Oi Jean, quero avaliar uma automação. O processo repetitivo hoje é: ",
      en: "Hi Jean, I want to evaluate an automation. The repetitive process today is: ",
    },
  },
  {
    id: "agents",
    slugs: { pt: "agentes-ia-privados", en: "private-ai-agents" },
    label: { pt: "Infraestrutura agent-ready", en: "Agent-ready infrastructure" },
    title: {
      pt: "Agentes de IA privados com memória, permissões e revisão humana",
      en: "Private AI agents with memory, permissions and human review",
    },
    metaTitle: {
      pt: "Agentes de IA privados para empresas | Jean Carlos Vargas | JE4NDEV",
      en: "Private AI agents for operations | Jean Carlos Vargas | JE4NDEV",
    },
    metaDescription: {
      pt: "Agentes de IA em infraestrutura própria com identidade, memória, ferramentas, permissões, logs, gates humanos e integração à operação.",
      en: "AI agents on private infrastructure with identity, memory, tools, permissions, logs, human gates and operational integrations.",
    },
    hero: {
      pt: "Um agente útil precisa saber quem é, o que pode fazer, o que deve registrar e quando precisa parar para pedir aprovação.",
      en: "A useful agent needs to know who it is, what it may do, what it must record and when it must stop for approval.",
    },
    intro: {
      pt: "A JE4NDEV usa o Hermes como laboratório real de operações com agentes. Para clientes, o recorte parte de uma tarefa concreta e adiciona contexto, memória, ferramentas e controles somente quando eles são necessários para o resultado.",
      en: "JE4NDEV uses Hermes as a real agent-operations laboratory. For clients, the engagement starts from a concrete task and adds context, memory, tools and controls only when needed for the outcome.",
    },
    buyerFit: [
      {
        pt: "O time precisa consultar documentos e sistemas, executar ferramentas e manter contexto entre etapas.",
        en: "The team needs to query documents and systems, execute tools and preserve context across steps.",
      },
      {
        pt: "Dados ou integrações exigem infraestrutura privada e controle de acesso.",
        en: "Data or integrations require private infrastructure and access control.",
      },
      {
        pt: "Um protótipo de agente funciona em demo, mas não tem observabilidade, fallback ou gate humano.",
        en: "An agent prototype works in a demo but lacks observability, fallback or human gates.",
      },
    ],
    deliverables: [
      { pt: "Tarefa-alvo, usuário e critério de sucesso", en: "Target task, user and success criteria" },
      { pt: "Identidade, contexto e política de memória", en: "Identity, context and memory policy" },
      { pt: "Ferramentas e permissões por perfil", en: "Tools and permissions by profile" },
      { pt: "Logs, limites, fallback e gates humanos", en: "Logs, limits, fallback and human gates" },
      { pt: "Deploy em VPS ou ambiente definido no escopo", en: "Deployment to a VPS or scoped environment" },
      { pt: "Runbook, documentação e handoff", en: "Runbook, documentation and handoff" },
    ],
    process: [
      {
        title: { pt: "Tarefa concreta", en: "Concrete task" },
        description: { pt: "Começamos pelo trabalho e pela decisão, não por um agente genérico.", en: "We start from the work and decision, not a generic agent." },
      },
      {
        title: { pt: "Permissões", en: "Permissions" },
        description: { pt: "Definimos dados, ferramentas, limites e ações bloqueadas.", en: "We define data, tools, limits and blocked actions." },
      },
      {
        title: { pt: "Execução observável", en: "Observable execution" },
        description: { pt: "Cada etapa relevante gera contexto e evidência para revisão.", en: "Each relevant step creates context and evidence for review." },
      },
      {
        title: { pt: "Gate humano", en: "Human gate" },
        description: { pt: "Ações de risco param para aprovação e ficam auditáveis.", en: "Risky actions stop for approval and remain auditable." },
      },
    ],
    faq: [
      {
        question: { pt: "É um chatbot?", en: "Is this a chatbot?" },
        answer: {
          pt: "Pode ter interface conversacional, mas o foco é executar uma tarefa operacional com contexto, ferramentas, memória e controles definidos.",
          en: "It may have a conversational interface, but the focus is executing an operational task with defined context, tools, memory and controls.",
        },
      },
      {
        question: { pt: "Meus dados vão para treino?", en: "Will my data be used for training?" },
        answer: {
          pt: "O fluxo de dados, os providers e a retenção são definidos antes da implementação. Infraestrutura privada e modelos locais podem fazer parte do desenho quando o risco justificar.",
          en: "Data flow, providers and retention are defined before implementation. Private infrastructure and local models can be part of the design when risk justifies it.",
        },
      },
      {
        question: { pt: "O agente pode publicar ou gastar sozinho?", en: "Can the agent publish or spend autonomously?" },
        answer: {
          pt: "Ações externas, gastos, produção e dados sensíveis devem ter permissões explícitas e gates proporcionais ao risco. Autonomia não significa ausência de controle.",
          en: "External actions, spending, production and sensitive data require explicit permissions and risk-proportionate gates. Autonomy does not mean lack of control.",
        },
      },
    ],
    relatedProjectSlugs: ["hermes-agentes", "openclaw-gateway", "nexpanel"],
    whatsappPrompt: {
      pt: "Oi Jean, quero avaliar um agente de IA privado. A tarefa que ele precisa executar é: ",
      en: "Hi Jean, I want to evaluate a private AI agent. The task it needs to execute is: ",
    },
  },
];

export function getServiceOffer(locale: ServiceLocale, slug: string) {
  return serviceOffers.find((offer) => offer.slugs[locale] === slug);
}
