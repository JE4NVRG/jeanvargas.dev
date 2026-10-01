export type ServiceLocale = "pt" | "en";

type LocalizedText = Record<ServiceLocale, string>;

export interface ServiceOffer {
  id: "saas" | "automation" | "agents" | "websites" | "landing-pages";
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
  relatedProjectReasons: Record<string, LocalizedText>;
  whatsappPrompt: LocalizedText;
}

export const serviceOffers: ServiceOffer[] = [
  {
    id: "saas",
    slugs: { pt: "desenvolvimento-saas", en: "saas-development" },
    label: { pt: "Engenharia de produto", en: "Product engineering" },
    title: {
      pt: "Desenvolvimento de SaaS e sistemas sob medida",
      en: "Custom software and SaaS MVP development",
    },
    metaTitle: {
      pt: "Desenvolvimento de SaaS sob medida | JE4NDEV",
      en: "Custom software & SaaS MVP development | JE4NDEV",
    },
    metaDescription: {
      pt: "Transforme conhecimento de setor e um problema recorrente em um primeiro produto testável. Escopo de MVP, sistema ou SaaS com usuários, regras e critérios observáveis — sem promessa de aderência de mercado ou receita.",
      en: "Build custom software or a SaaS MVP around your users and workflow. JE4NDEV scopes, designs and delivers remote projects in English and Portuguese.",
    },
    hero: {
      pt: "Do fluxo manual a um produto que sua operação consegue usar, medir e evoluir.",
      en: "Turn the workflow you know into software people can use. Start with a focused MVP, then improve it with real feedback.",
    },
    intro: {
      pt: "Para fundadores que conhecem de perto um setor, têm acesso a usuários ou a um problema recorrente e querem explorar um produto próprio. Você traz contexto, conhecimento e acesso ao domínio; juntos delimitamos hipóteses, um MVP e sinais que possam ser observados. O projeto transforma o recorte acordado em software, mas não garante product-market fit, receita ou adoção. Hospedagem, serviços externos e manutenção contínua têm custos e condições próprios.",
      en: "For founders with an idea, professionals with domain knowledge and teams outgrowing spreadsheets. We work together on users, the core workflow and a first release you can test. You work directly with the person building it, with clear milestones and reviews in English or Portuguese. The proposal defines ownership, hosting, integrations and ongoing support.",
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
          pt: "Partimos do seu conhecimento do setor, do problema recorrente, dos usuários a que você tem acesso e das hipóteses que precisam ser testadas.",
          en: "We start with your industry knowledge, the recurring problem, the users you can reach and the hypotheses to test.",
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
      {
        question: { pt: "Preciso chegar com a ideia validada?", en: "Do I need a validated idea?" },
        answer: {
          pt: "Não precisa chegar com respostas prontas. Ajuda trazer seu conhecimento do setor, o problema que observa e acesso a pessoas que o enfrentam. Juntos definimos uma hipótese e o que um primeiro recorte pode testar; isso reduz incerteza, mas não garante product-market fit, receita ou adoção.",
          en: "You do not need all the answers up front. It helps to bring your industry knowledge, the problem you see and access to people who experience it. Together we define a hypothesis and what a first slice can test; that can reduce uncertainty, but it does not guarantee product-market fit, revenue or adoption.",
        },
      },
    ],
    relatedProjectSlugs: ["archscene", "fullcommerce360", "nexpanel"],
    relatedProjectReasons: {
      archscene: { pt: "Exemplo de produto SaaS com fluxo de render, créditos e revisão de resultados.", en: "A SaaS product example with rendering, credits and result-review workflows." },
      fullcommerce360: { pt: "Exemplo de produto operacional com integrações e etapas de revisão.", en: "An operational product example with integrations and review steps." },
      nexpanel: { pt: "Produto operacional público com módulos, permissões e fluxo por conta.", en: "A public operational product with modules, permissions and account-scoped workflows." },
    },
    whatsappPrompt: {
      pt: "Olá! Quero avaliar um SaaS ou sistema sob medida. Meu gargalo hoje é: ",
      en: "Hi! I want to evaluate a custom SaaS or internal system. My current bottleneck is: ",
    },
  },
  {
    id: "automation",
    slugs: { pt: "automacoes-ia", en: "ai-automation" },
    label: { pt: "Automação operacional", en: "Operational automation" },
    title: {
      pt: "Automações com IA e integrações para operações reais",
      en: "AI workflow automation and API integrations",
    },
    metaTitle: {
      pt: "Automação com IA e integrações | JE4NDEV",
      en: "AI automation and integrations | JE4NDEV",
    },
    metaDescription: {
      pt: "Conecte APIs e ferramentas para reduzir tarefas repetitivas. Automações com IA, acompanhamento de execução e tratamento de exceções para sua operação.",
      en: "Connect your tools and reduce repetitive work with AI automation and API integrations. Scoped workflows, exception handling and remote delivery in English.",
    },
    hero: {
      pt: "Automatize o caminho repetitivo sem perder controle sobre exceções, acesso e decisão humana.",
      en: "Make your tools work together. Automate repeatable steps and give your team a clear way to handle exceptions.",
    },
    intro: {
      pt: "Para empresas que querem criar um sistema para clientes ou equipe e automatizar rotinas com integrações ou bots. O escopo conecta APIs e ferramentas existentes, explicita o que o sistema e o bot podem fazer e prevê acompanhamento de falhas e exceções. Hermes, OpenClaw ou outra ferramenta só entram quando forem adequados ao processo e forem nomeados na proposta; contas de terceiros, volume de uso e manutenção têm condições próprias.",
      en: "For teams moving the same information between spreadsheets, inboxes and business systems. We map the workflow, connect the APIs you can access and build the agreed automation with validation and a path for human review. AI is added when it helps with interpretation or generation. Usage, third-party accounts and maintenance are defined in the proposal.",
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
        question: { pt: "Dá para combinar o sistema com um bot ou agente?", en: "Can the system work with a bot or agent?" },
        answer: {
          pt: "Pode fazer sentido integrar APIs e bots, inclusive avaliar Hermes ou OpenClaw para tarefas delimitadas, permissões e operação. A ferramenta depende do processo, do ambiente e dos acessos; isso não significa que qualquer agente seja adequado nem implica vínculo ou certificação oficial. O que será configurado fica descrito na proposta.",
          en: "It can make sense to connect APIs and bots, including evaluating Hermes or OpenClaw for bounded tasks, permissions and operation. Tool choice depends on the workflow, runtime and access; this does not mean every agent is suitable or imply official affiliation or certification. The configuration is specified in the proposal.",
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
    relatedProjectSlugs: ["nora", "fullcommerce360", "urlpivot", "nexpanel"],
    relatedProjectReasons: {
      nora: { pt: "Assistente em produção no site, com briefing de projeto, contato autorizado e retorno humano.", en: "A live website assistant with a project brief, consent-based contact capture and human follow-up." },
      fullcommerce360: { pt: "Mostra integração entre pesquisa, revisão de anúncio e operação de marketplace.", en: "Shows connected research, listing review and marketplace operations." },
      urlpivot: { pt: "Demonstra regras automatizadas para links, QR Codes e páginas de campanha.", en: "Demonstrates automated rules for links, QR codes and campaign pages." },
      nexpanel: { pt: "Exemplo de fluxos operacionais, permissões e registro de atividades.", en: "An example of operational workflows, permissions and activity records." },
    },
    whatsappPrompt: {
      pt: "Olá! Quero avaliar uma automação. O processo repetitivo hoje é: ",
      en: "Hi! I want to evaluate an automation. The repetitive process today is: ",
    },
  },
  {
    id: "agents",
    slugs: { pt: "agentes-ia-privados", en: "private-ai-agents" },
    label: { pt: "Assistentes e agentes de IA personalizados", en: "Personalized AI assistants and agents" },
    title: {
      pt: "Um assistente de IA personalizado para você ou sua empresa",
      en: "Custom AI assistants for your website, work or everyday life",
    },
    metaTitle: {
      pt: "Assistentes e agentes de IA personalizados | JE4NDEV",
      en: "Custom AI assistants for websites & teams | JE4NDEV",
    },
    metaDescription: {
      pt: "Assistentes de IA para pessoas físicas e empresas: tarefas, estudos, pesquisas e trabalho. Contexto, integrações e permissões definidos para sua rotina.",
      en: "Get a custom AI assistant for your website, team or personal workflow. Explore Nora and discuss context, integrations, memory and human handoff with JE4NDEV.",
    },
    hero: {
      pt: "Organize tarefas, tenha apoio para estudar e pesquisar ou facilite etapas do trabalho com um assistente configurado para sua rotina, seus documentos e as ferramentas que você autorizar.",
      en: "An assistant built around your context: answer questions, collect a useful brief or help with a task using the tools you authorize.",
    },
    intro: {
      pt: "Atendemos pessoas físicas e jurídicas. Podemos criar um assistente para sua organização pessoal, estudos e pesquisas, para o trabalho de um profissional autônomo ou para tarefas de uma equipe. Começamos pelo que ele deve ajudar a fazer e definimos contexto, documentos, integrações e permissões. Hermes, OpenClaw ou outra ferramenta podem ser avaliados conforme a tarefa, o ambiente e os acessos necessários. Custos e condições de provedores externos são definidos antes.",
      en: "For individuals, independent professionals and businesses. Start with a website assistant like Nora, support for your documents or a specific team workflow. We define what it should know, which tools it can use, how memory works and when a person should take over. The interface, deployment, provider usage and maintenance are agreed before the build.",
    },
    buyerFit: [
      {
        pt: "Você quer organizar tarefas ou consultar materiais de estudo e pesquisa com um assistente ajustado ao seu contexto.",
        en: "You want to organize tasks or consult study and research materials with an assistant tailored to your context.",
      },
      {
        pt: "Você trabalha por conta própria e precisa de apoio para consultar documentos ou executar etapas repetitivas com ferramentas autorizadas.",
        en: "You work independently and need help consulting documents or carrying out repetitive steps with authorized tools.",
      },
      {
        pt: "Sua empresa precisa de um agente que consulte documentos e sistemas, com permissões, limites e revisão humana definidos.",
        en: "Your business needs an agent that can consult documents and systems with defined permissions, limits and human review.",
      },
    ],
    deliverables: [
      { pt: "Tarefa-alvo, usuário e critério de sucesso", en: "Target task, user and success criteria" },
      { pt: "Identidade, contexto e política de memória", en: "Identity, context and memory policy" },
      { pt: "Ferramentas autorizadas e permissões por perfil; Hermes ou OpenClaw podem ser avaliados quando adequados ao caso", en: "Permitted tools and role-based access; Hermes or OpenClaw can be evaluated when suitable for the use case" },
      { pt: "Logs, limites, fallback e gates humanos", en: "Logs, limits, fallback and human gates" },
      { pt: "Instalação em VPS do cliente ou ambiente definido na proposta", en: "Deployment to a client VPS or environment agreed in the proposal" },
      { pt: "Documentação, instruções de acesso e transferência de controle", en: "Documentation, access instructions and transfer of control" },
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
        question: { pt: "Preciso ter uma empresa para contratar?", en: "Do I need a business to hire you?" },
        answer: {
          pt: "Não. Atendemos pessoas físicas e jurídicas e podemos criar um assistente de IA personalizado para uso pessoal ou profissional. Organização de tarefas, apoio a estudos, pesquisa e consulta aos seus documentos são exemplos. As funções, ferramentas conectadas, permissões e custos são combinados conforme sua necessidade.",
          en: "No. We work with individuals and businesses and can create a personalized AI assistant for personal or professional use. Task organization, study support, research and consulting your documents are examples. Functions, connected tools, permissions and costs are agreed around your needs.",
        },
      },
      {
        question: { pt: "É um chatbot?", en: "Is this a chatbot?" },
        answer: {
          pt: "Pode ter interface conversacional, mas o foco é executar uma tarefa operacional com contexto, ferramentas, memória e controles definidos.",
          en: "It may have a conversational interface, but the focus is executing an operational task with defined context, tools, memory and controls.",
        },
      },
      {
        question: { pt: "Que integrações e implantação estão incluídas?", en: "Which integrations and deployment are included?" },
        answer: {
          pt: "O primeiro passo é definir a tarefa, os sistemas e as APIs acessíveis, permissões, ambiente de execução e critério de aceite. A proposta lista cada integração e se a implantação será em VPS do cliente ou outro ambiente acordado. Licenças, contas, infraestrutura e conectores de terceiros não são presumidos como incluídos.",
          en: "We first define the task, accessible systems and APIs, permissions, runtime and acceptance criteria. The proposal lists each integration and whether deployment is to a client-owned VPS or another agreed environment. Third-party licenses, accounts, infrastructure and connectors are not assumed to be included.",
        },
      },
      {
        question: { pt: "Meus dados vão para treino?", en: "Will my data be used for training?" },
        answer: {
          pt: "A hospedagem do agente e o provedor de modelo são decisões diferentes. Antes do trabalho, combinamos quais dados podem sair do ambiente, qual provedor externo ou modelo local será usado, as configurações de retenção e uso para treinamento disponíveis no provedor e os custos. Não presumo que dados enviados a um serviço externo sejam privados ou excluídos de treinamento; isso depende dos termos e configurações vigentes desse provedor. Hospedagem privada não significa que todo modelo rode localmente.",
          en: "Agent hosting and model provider are separate choices. Before work begins, we agree what data may leave the environment, which external provider or local model will be used, the provider's available retention and training settings, and usage costs. I do not assume data sent to an external service is private or excluded from training; that depends on the provider's current terms and settings. Private hosting does not mean every model runs locally.",
        },
      },
      {
        question: { pt: "O agente pode publicar ou gastar sozinho?", en: "Can the agent publish or spend autonomously?" },
        answer: {
          pt: "Ações externas, gastos, produção e dados sensíveis devem ter permissões explícitas e gates proporcionais ao risco. Autonomia não significa ausência de controle.",
          en: "External actions, spending, production and sensitive data require explicit permissions and risk-proportionate gates. Autonomy does not mean lack of control.",
        },
      },
      {
        question: { pt: "Como ficam os acessos e a manutenção?", en: "What happens to access and maintenance?" },
        answer: {
          pt: "A proposta registra ferramentas autorizadas, integrações, ambiente, entregáveis, exclusões, aceite e eventual período de suporte. Ao encerrar, o handoff inclui documentação e transferência de acessos conforme o combinado; esses acessos podem ser revogados pelo responsável pela infraestrutura. Hospedagem, consumo de modelos, suporte recorrente e manutenção contínua são itens separados, salvo previsão expressa na proposta. Segurança, privacidade ou conformidade regulatória dependem do ambiente e das obrigações aplicáveis e não são garantidas apenas pela instalação.",
          en: "The proposal records permitted tools, integrations, runtime, deliverables, exclusions, acceptance and any support period. At close, handoff includes documentation and access transfer as agreed; access can be revoked by the infrastructure owner. Hosting, model usage, recurring support and ongoing maintenance are separate unless expressly included in the proposal. Security, privacy or regulatory compliance depend on the environment and applicable obligations and are not guaranteed by installation alone.",
        },
      },
      {
        question: { pt: "Hermes ou OpenClaw são obrigatórios ou oficiais?", en: "Are Hermes or OpenClaw required or official?" },
        answer: {
          pt: "Não. Podemos avaliar Hermes ou OpenClaw como opções de configuração e integração para uma tarefa definida, considerando permissões e operação. A ferramenta é escolhida conforme o ambiente e o caso; este serviço não declara vínculo ou certificação oficial e não promete compatibilidade universal.",
          en: "No. Hermes or OpenClaw may be evaluated as configuration and integration options for a defined task, including permissions and operation. Tool choice depends on the runtime and use case; this service claims no official affiliation or certification and does not promise universal compatibility.",
        },
      },
    ],
    relatedProjectSlugs: ["nora", "hermes-agentes", "openclaw-gateway", "nexpanel"],
    relatedProjectReasons: {
      nora: { pt: "Assistente em produção no site, com briefing de projeto, contato autorizado e retorno humano.", en: "A live website assistant with a project brief, consent-based contact capture and human follow-up." },
      "hermes-agentes": { pt: "Laboratório próprio que demonstra configuração de perfis, ferramentas e revisão; não é case de cliente.", en: "An in-house lab demonstrating profile, tool and review configuration; not a client case." },
      "openclaw-gateway": { pt: "Demonstra infraestrutura privada para conectar modelos e ferramentas; demonstração restrita.", en: "Demonstrates private infrastructure connecting models and tools; restricted demo." },
      nexpanel: { pt: "Exemplo de sistema de operação em que agentes podem complementar fluxos, não substituir o produto.", en: "An operational system example where agents may complement workflows, not replace the product." },
    },
    whatsappPrompt: {
      pt: "Olá! Quero avaliar um agente de IA privado. A tarefa que ele precisa executar é: ",
      en: "Hi! I want to evaluate a private AI agent. The task it needs to execute is: ",
    },
  },
  {
    id: "websites",
    slugs: { pt: "criacao-de-sites", en: "business-websites" },
    label: { pt: "Sites profissionais", en: "Professional websites" },
    title: {
      pt: "Criação de sites para profissionais e empresas",
      en: "Custom website design and development",
    },
    metaTitle: {
      pt: "Criação de sites para profissionais e empresas | JE4NDEV",
      en: "Custom website design & development | JE4NDEV",
    },
    metaDescription: {
      pt: "Apresente seu trabalho ou sua empresa com um site responsivo e claro. Portfólios, serviços e produtos com estrutura, conteúdo e integrações definidos por escopo.",
      en: "Present your services or product with a custom website built for clear messaging, responsive browsing and contact. Remote design and development in English.",
    },
    hero: {
      pt: "Um site que apresenta seu trabalho ou sua empresa e ajuda cada visitante a encontrar o próximo passo.",
      en: "Show people what you do, why it matters and how to take the next step. A website designed around your offer.",
    },
    intro: {
      pt: "Para pessoas físicas, profissionais autônomos e empresas que precisam de uma presença digital clara, seja um portfólio pessoal ou um site para apresentar serviços, produtos e informações institucionais. Definimos páginas, conteúdo disponível, identidade visual, formulários e integrações antes de construir. Redação especializada, fotografia, domínio, hospedagem, manutenção contínua e serviços de terceiros só fazem parte quando estiverem descritos na proposta.",
      en: "For individuals, independent professionals and businesses that need a portfolio, service website or product presence. We agree on the audience, content, visual identity and contact flow, then build and review a responsive site together. English and Portuguese versions, technical SEO and a custom assistant can be scoped when useful. Content production, hosting and ongoing support are listed in the proposal.",
    },
    buyerFit: [
      { pt: "Você depende de redes sociais ou indicações, mas ainda não tem um lugar próprio para apresentar seu trabalho ou sua oferta.", en: "You rely on social media or referrals but lack a dedicated place to showcase your work or offer." },
      { pt: "O site atual está desatualizado, difícil de usar no celular ou não deixa claro como entrar em contato.", en: "Your current site is outdated, hard to use on mobile or unclear about how to get in touch." },
      { pt: "Você precisa apresentar serviços, equipe, localização ou informações institucionais em páginas organizadas.", en: "You need organized pages for services, team, location or company information." },
    ],
    deliverables: [
      { pt: "Mapa de páginas, navegação e conteúdo fornecido pelo cliente", en: "Page map, navigation and client-provided content" },
      { pt: "Interface responsiva alinhada à sua identidade e às necessidades do projeto", en: "Responsive interface aligned with your identity and project needs" },
      { pt: "Páginas e componentes acordados, com estados de formulário quando aplicável", en: "Agreed pages and components, with form states where applicable" },
      { pt: "Configuração técnica e integrações explicitamente incluídas no escopo", en: "Technical setup and integrations explicitly included in scope" },
      { pt: "Revisão de conteúdo recebido, QA e instruções de handoff", en: "Review of supplied content, QA and handoff instructions" },
    ],
    process: [
      { title: { pt: "Entender a oferta", en: "Understand the offer" }, description: { pt: "Alinhamos público, objetivo do site, páginas necessárias e materiais existentes.", en: "We align on audience, website goals, required pages and available materials." } },
      { title: { pt: "Definir o escopo", en: "Define the scope" }, description: { pt: "Registramos conteúdo, design, funcionalidades, exclusões e critérios de aceite.", en: "We document content, design, functionality, exclusions and acceptance criteria." } },
      { title: { pt: "Construir e revisar", en: "Build and review" }, description: { pt: "Você revisa uma versão navegável e os itens acordados antes do handoff ou publicação.", en: "You review a navigable version and the agreed items before handoff or publication." } },
    ],
    faq: [
      { question: { pt: "Vocês também escrevem os textos?", en: "Do you also write the copy?" }, answer: { pt: "Podemos organizar e implementar o conteúdo fornecido. Pesquisa, entrevistas, redação profissional, tradução e produção de fotos precisam ser combinadas separadamente e incluídas expressamente no escopo.", en: "We can organize and implement the content you provide. Research, interviews, professional copywriting, translation and photography need separate agreement and must be expressly included in scope." } },
      { question: { pt: "O site inclui domínio e hospedagem?", en: "Are domain and hosting included?" }, answer: { pt: "Domínio, hospedagem, licenças e serviços de terceiros são contas e condições separadas, salvo se a proposta disser explicitamente o contrário. As opções e responsabilidades ficam claras antes do início.", en: "Domain, hosting, licenses and third-party services have separate accounts and terms unless the proposal explicitly says otherwise. Options and responsibilities are clarified before work starts." } },
      { question: { pt: "O site vai aparecer no topo do Google?", en: "Will the site rank at the top of Google?" }, answer: { pt: "Não há garantia de posição ou tráfego. A entrega pode incluir estrutura técnica acessível e metadados acordados, mas conteúdo, concorrência, indexação e resultados orgânicos dependem de vários fatores fora do controle do desenvolvimento.", en: "No ranking or traffic position can be guaranteed. Delivery can include agreed technical structure and metadata, but content, competition, indexing and organic results depend on factors beyond the development work." } },
    ],
    relatedProjectSlugs: ["nora", "nexpanel", "vultrix-3d", "archscene"],
    relatedProjectReasons: {
      nora: { pt: "Assistente em produção no site, com briefing de projeto, contato autorizado e retorno humano.", en: "A live website assistant with a project brief, consent-based contact capture and human follow-up." },
      nexpanel: { pt: "Presença comercial pública ligada a um produto SaaS operacional.", en: "A public business-facing site connected to an operational SaaS product." },
      "vultrix-3d": { pt: "Produto público com páginas de apresentação e acesso à ferramenta.", en: "A public product presence with presentation pages and a path to its tool." },
      archscene: { pt: "Produto visual com experiência pública para explicar o serviço e iniciar o fluxo.", en: "A visual product with a public experience that explains the service and starts its workflow." },
    },
    whatsappPrompt: {
      pt: "Olá! Quero conversar sobre um site. O que quero apresentar e meu objetivo principal são: ",
      en: "Hi! I would like to discuss a website. What I want to showcase and my main goal are: ",
    },
  },
  {
    id: "landing-pages",
    slugs: { pt: "criacao-de-landing-pages", en: "landing-page-development" },
    label: { pt: "Landing pages", en: "Landing pages" },
    title: {
      pt: "Criação de landing pages para campanhas e ofertas",
      en: "Landing page development for campaigns and offers",
    },
    metaTitle: {
      pt: "Criação de landing pages para campanhas | JE4NDEV",
      en: "Landing page development for campaigns | JE4NDEV",
    },
    metaDescription: {
      pt: "Apresente uma oferta em uma página focada, com mensagem, prova e chamada para ação alinhadas à campanha. Conteúdo e integrações definidos por escopo.",
      en: "Launch a focused landing page for your service, product or campaign. Clear messaging, responsive design and an agreed contact flow, with delivery in English.",
    },
    hero: {
      pt: "Uma página de campanha com mensagem consistente e um próximo passo fácil de entender.",
      en: "Give one offer a clear story and one useful next step. A focused page for a launch, service or campaign.",
    },
    intro: {
      pt: "Para lançar uma oferta, evento, produto ou campanha que precisa de uma página própria em vez de dispersar a mensagem em vários canais. Definimos público, promessa verificável, conteúdo, CTA e integrações de acordo com os materiais disponíveis. Mídia paga, estratégia de campanha, redação, produção de conteúdo, ferramentas externas e operação contínua não estão incluídas sem previsão na proposta.",
      en: "For a product, event, offer or campaign that needs its own page instead of splitting the message across channels. We define the audience, supportable message, content, CTA and integrations based on available materials. Paid media, campaign strategy, copywriting, content production, external tools and ongoing operation are excluded unless specified in the proposal.",
    },
    buyerFit: [
      { pt: "Uma campanha precisa de uma página de destino com uma oferta e ação principais bem definidas.", en: "A campaign needs a destination page with one clearly defined offer and primary action." },
      { pt: "O conteúdo atual está espalhado e dificulta entender benefícios, condições ou próximos passos.", en: "Current content is scattered, making benefits, terms or next steps hard to understand." },
      { pt: "Você quer apresentar um produto, evento ou captação sem refazer todo o site institucional.", en: "You want to present a product, event or lead form without rebuilding the full company website." },
    ],
    deliverables: [
      { pt: "Hierarquia de conteúdo para a oferta e o público definidos", en: "Content hierarchy for the agreed offer and audience" },
      { pt: "Página responsiva com seções e chamada para ação acordadas", en: "Responsive page with agreed sections and call to action" },
      { pt: "Formulário ou link de contato, se especificado no escopo", en: "Form or contact link, if specified in scope" },
      { pt: "Metadados e compartilhamento social básicos quando acordados", en: "Basic metadata and social sharing setup when agreed" },
      { pt: "QA dos links e formulários incluídos e orientações de publicação", en: "QA of included links and forms plus publishing guidance" },
    ],
    process: [
      { title: { pt: "Oferta e público", en: "Offer and audience" }, description: { pt: "Alinhamos quem a página atende, a ação desejada e as evidências disponíveis.", en: "We align on who the page serves, the intended action and available evidence." } },
      { title: { pt: "Mensagem e estrutura", en: "Message and structure" }, description: { pt: "Organizamos conteúdo, objeções, prova e CTA sem prometer resultados não comprovados.", en: "We organize content, objections, evidence and CTA without promising unsubstantiated results." } },
      { title: { pt: "Implementar e conferir", en: "Implement and check" }, description: { pt: "Revisamos a página em telas diferentes e testamos somente as integrações contratadas.", en: "We review the page across screen sizes and test only the integrations included in scope." } },
    ],
    faq: [
      { question: { pt: "A landing page garante mais conversões?", en: "Will the landing page guarantee more conversions?" }, answer: { pt: "Não. Uma página bem estruturada pode tornar a oferta e a ação mais claras, mas conversão depende também de público, proposta, tráfego, preço e contexto. Não prometemos taxa de conversão nem resultado de campanha.", en: "No. A well-structured page can make an offer and action clearer, but conversion also depends on audience, offer, traffic, pricing and context. We do not promise conversion rates or campaign results." } },
      { question: { pt: "Vocês cuidam dos anúncios e da campanha?", en: "Do you manage ads and the campaign?" }, answer: { pt: "O serviço é a página e os itens de implementação acordados. Compra de mídia, gestão de anúncios, estratégia de campanha, analytics e ferramentas de terceiros são serviços separados e só entram se descritos na proposta.", en: "The service covers the page and agreed implementation items. Media buying, ad management, campaign strategy, analytics and third-party tools are separate and included only if listed in the proposal." } },
      { question: { pt: "Preciso entregar os textos e imagens?", en: "Do I need to provide copy and images?" }, answer: { pt: "O escopo define quais materiais você fornece e quais tarefas de conteúdo são contratadas. Redação, pesquisa, identidade visual, fotos, vídeos ou licenças não devem ser presumidos; qualquer produção adicional é combinada antes.", en: "Scope defines which materials you provide and which content tasks are commissioned. Copywriting, research, visual identity, photography, video or licenses should not be assumed; additional production is agreed upfront." } },
    ],
    relatedProjectSlugs: ["urlpivot", "vultrix-3d", "nexpanel"],
    relatedProjectReasons: {
      urlpivot: { pt: "Produto de links e páginas de campanha, relacionado à apresentação de destinos e ações.", en: "A link and campaign-page product related to presenting destinations and actions." },
      "vultrix-3d": { pt: "Produto público com páginas de apresentação e acesso à ferramenta.", en: "A public product presence with presentation pages and a path to its tool." },
      nexpanel: { pt: "Página comercial pública de um produto com chamada para conhecer e iniciar o uso.", en: "A public product page with calls to learn about and start using the product." },
    },
    whatsappPrompt: {
      pt: "Olá! Quero conversar sobre uma landing page. A oferta, público e ação que quero apresentar são: ",
      en: "Hi! I would like to discuss a landing page. The offer, audience and action I want to present are: ",
    },
  },
];

export function getServiceOffer(locale: ServiceLocale, slug: string) {
  return serviceOffers.find((offer) => offer.slugs[locale] === slug);
}
