import type { Translations } from "./en";

export const pt: Translations = {
  nav: {
    work: "Projetos",
    about: "Sobre",
    services: "Serviços",
    stack: "Stack",
    contact: "Entre em contato",
  },
  hero: {
    badge: "Produto real · escopo claro · acompanhamento direto",
    title: "Sites, sistemas e SaaS",
    titleHighlight: "para vender, operar e crescer.",
    subtitle:
      "Você fala direto com o founder e acompanha cada entrega em preview navegável. Cuidamos da interface, backend, integrações e deploy — com escopo claro, revisão humana e pagamento por marcos.",
    subtitleMobile:
      "Sites, SaaS e automações com preview navegável, escopo claro e revisão do founder.",
    terminalTitle: "je4ndev/agency",
    terminalCommand: "ship produto --saas --automacao --web3",
    terminalOutput: "scope -> arquitetura -> codigo -> deploy -> mrr",
    cta: "Ver produtos funcionando",
    secondaryCta: "Contar meu projeto",
    email: "jean@je4ndev.com",
    whatsapp: "Falar no WhatsApp",
    proof:
      "Da ideia ao produto em produção: estratégia, interface, backend, banco, automações e deploy.",
    stats: [
      { value: "12", label: "projetos catalogados" },
      { value: "6", label: "produtos públicos" },
      { value: "7", label: "provas visuais revisadas" },
      { value: "PT/EN", label: "portfolio bilíngue" },
    ],
    strengths: [
      "MVPs SaaS com auth, billing e painel admin",
      "Fluxos com IA que reduzem tarefas repetitivas",
      "Integrações com APIs, dashboards e bancos",
      "Auditoria Solidity para contratos inteligentes",
    ],
  },
  work: {
    label: "Nossos produtos · live em produção",
    title: "Construímos, entregamos e mantemos",
    viewCase: "Ver estudo de caso",
    viewProject: "Ver projeto",
    hoverProblem: "Problema",
    hoverDelivery: "Entrega",
    hoverResult: "Resultado",
    hoverCtaLive: "Acessar demo",
    hoverCtaCode: "Ver código",
    hoverCtaLike: "Quero algo parecido",
    likeWhatsappTemplate: "Oi Jean, quero algo parecido com {project}.",
  },
  about: {
    label: "Sobre",
    name: "Jean Carlos Vargas",
    bio: "Desenvolvedor full-stack e Fundador da Vultrix 3D. Construindo sistemas em produção há mais de 10 anos, de plataformas SaaS a bots com IA, integrações de APIs, auditoria de contratos inteligentes em Solidity e pipelines de automação. Baseado em São Paulo, Brasil, operando remoto pra clientes no mundo todo.",
    experience: "10+ anos",
  },
  stack: {
    label: "Tech Stack",
    title: "Ferramentas que uso",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "Banco de Dados",
      ai: "IA & Automação",
      devops: "DevOps",
      web3: "Web3 & Smart Contracts",
      tools: "Ferramentas",
    },
  },
  services: {
    label: "Serviços",
    title: "O que a equipe entrega",
    items: [
      {
        title: "Sites, landings e blogs",
        description:
          "Site institucional, landing de alta conversão ou blog com domínio próprio, escopo fechado e entrega em preview navegável",
      },
      {
        title: "SaaS sob medida",
        description:
          "Da planilha ao produto: auth, billing Stripe, permissões, multi-tenant, painel admin, LMS e analytics · cobrança por entrega",
      },
      {
        title: "Integrações & automações",
        description:
          "ERPs, CRMs, marketplaces, gateways de pagamento, WhatsApp Business e ferramentas internas conectadas via API",
      },
      {
        title: "Web3, NFT e auditoria Solidity",
        description:
          "Coleções NFT, smart contracts customizados, plataformas Web3 e auditoria Solidity/EVM com relatório técnico",
      },
      {
        title: "Hermes / OpenClaw na sua VPS",
        description:
          "Instalamos, configuramos os 21 perfis de agente, treinamos seu time e damos suporte · sua infra, seus dados",
      },
      {
        title: "Manutenção & consultoria técnica",
        description:
          "Operação contínua, monitoramento, hotfixes, arquitetura e revisão antes de gastar meses construindo · garantia de 1 ano",
      },
    ],
    cta: "Pedir orçamento",
    whatsappMessage: "Oi Jean, quero saber mais sobre o serviço de {service}.",
  },
  contact: {
    title: "Vamos transformar o problema",
    titleHighlight: "em produto real",
    subtitle: "Conte o que hoje é manual, lento ou difícil de medir. Você recebe uma resposta direta do founder com as perguntas e o próximo passo para fechar um escopo responsável.",
    whatsapp: "WhatsApp",
    trustline: "Resposta direta com o founder · escopo fechado por entrega · garantia de 1 ano",
    founderName: "Jean Carlos Vargas",
    founderRole: "Founder · Product Engineer · Smart Contract Security Researcher",
    founderLocation: "São Paulo · BR · Operando remoto pra clientes no mundo todo",
    terminalTitle: "je4ndev/agency · proxima entrega",
    terminalLines: [
      "briefing recebido",
      "riscos e integrações mapeados",
      "build iniciado · preview navegável do produto",
      "qa + security gate (gitleaks + npm audit)",
      "deploy em produção · garantia de 1 ano",
    ],
    githubCta: "Ver GitHub",
  },
  githubProof: {
    label: "Open source · proof of work",
    title: "github.com/JE4NVRG",
    subtitle:
      "Não acredite só na vitrine. Parte do código e do histórico é pública — Hermes Kanban open source (MIT), ferramentas, audits Solidity e produtos em produção. Abra a fonte e confira.",
    bullets: [
      {
        title: "Hermes Kanban",
        body: "21 perfis de agente IA orquestrando produção real. Open source, MIT.",
      },
      {
        title: "OpenClaw Gateway",
        body: "Gateway proprietário pra orquestrar Claude/GPT/Gemini num único endpoint.",
      },
      {
        title: "Solidity Audits",
        body: "Reports públicos de auditoria — Alchemix, Ethena, bounty hunter MVP.",
      },
      {
        title: "SaaS em produção",
        body: "ArchScene, NexPanel, StopUltimate e GestãoML — produtos públicos em produção.",
      },
    ],
    metricsTitle: "Prova pública verificável",
    metrics: [
      { label: "Repositórios públicos", value: "83" },
      { label: "Seguidores públicos", value: "216" },
      { label: "Código do Hermes", value: "MIT" },
      { label: "Perfil e histórico", value: "Live" },
    ],
    verificationNote: "Contagens conferidas no perfil público em 17/07/2026. Os links abrem a fonte original no GitHub.",
    cta: "github.com/JE4NVRG",
  },
  footer: {
    copyright: "(c) 2026 Jean Carlos Vargas",
  },
  testimonials: {
    label: "Comentários",
    title: "Clientes e projetos representativos",
    items: [
      {
        avatar: "/images/testimonials/marina-lopes.webp",
        name: "Marina Lopes",
        role: "Founder",
        company: "ComércioNex",
        quote:
          "Jean transformou uma ideia solta em um SaaS com fluxo claro, painel, permissões e deploy pronto para vender. O projeto saiu com cara de produto, nao de prototipo.",
        result: "MVP SaaS validado em semanas",
      },
      {
        avatar: "/images/testimonials/rafael-costa.webp",
        name: "Rafael Costa",
        role: "Head de Operações",
        company: "Operações Mercado",
        quote:
          "A automação reduziu retrabalho em pedidos, mensagens e conciliação. O time parou de depender de planilha e passou a acompanhar tudo em uma rotina única.",
        result: "Pedidos e aténdimento centralizados",
      },
      {
        avatar: "/images/testimonials/camila-torres.webp",
        name: "Camila Torres",
        role: "Product Lead",
        company: "Vozly IA",
        quote:
          "Ele nao criou so um bot. Criou um fluxo completo com contexto, logs, fallback e integracao com nossas APIs, deixando a automação pronta para uso real.",
        result: "IA conectada ao processo real",
      },
      {
        avatar: "/images/testimonials/daniel-prado.webp",
        name: "Daniel Prado",
        role: "CTO",
        company: "PonteDados",
        quote:
          "Jean entende o lado técnico e o impacto no negócio. A integracao saiu organizada, monitorável e fácil de manter, sem criar dependencia desnecessaria.",
        result: "APIs, jobs e monitoramento",
      },
      {
        avatar: "/images/testimonials/beatriz-almeida.webp",
        name: "Beatriz Almeida",
        role: "Diretora Financeira",
        company: "PrintLab 3D",
        quote:
          "O sistema deixou custo, margem e faturamento visíveis. A precificacao parou de ser tentativa e erro e virou uma decisão baseada em dados.",
        result: "Financeiro com dados confiaveis",
      },
      {
        avatar: "/images/testimonials/lucas-mota.webp",
        name: "Lucas Mota",
        role: "Founder Web3",
        company: "ProvaChain",
        quote:
          "A auditoria Solidity encontrou riscos de permissao e lógica antes do deploy. O relatorio foi direto ao ponto e ajudou o time a corrigir rápido.",
        result: "Contrato revisado antes de produção",
      },
    ],
  },
  process: {
    label: "Como entregamos",
    title: "Briefing entra. Produto sai. Sem reunião pra marcar reunião.",
    subtitle:
      "Pipeline de 4 etapas que transforma ideia em produção. Founder dirigindo cada sprint, stack próprio acelerando execução.",
    steps: [
      {
        title: "Briefing & escopo",
        description:
          "Call direto com o founder. Mapeamos seu problema, escrevemos o spec, acertamos o que é 'pronto' e fechamos o escopo do sprint.",
        deliverable: "Dia 1 → Spec",
      },
      {
        title: "Sprint dirigido pelo founder",
        description:
          "Founder no controle do código, com stack próprio de automação acelerando dev, QA e security em paralelo. Atualizações diárias com diff e screenshot.",
        deliverable: "Dia 2-21 → Build funcional",
      },
      {
        title: "Gate de QA + Security",
        description:
          "Suite de testes automatizada + revisão manual de segurança + walkthrough no browser. Só sai pra produção quando todo ponto vermelho vira verde.",
        deliverable: "Dia 22-24 → Auditoria OK",
      },
      {
        title: "Deploy + operação",
        description:
          "Em produção na nossa infra, monitoramento, alerta 24/7 via Telegram e operação contínua pela agência. Você recebe produto, não manutenção.",
        deliverable: "Dia 25+ → Produção",
      },
    ],
  },
  team: {
    label: "",
    title: "",
    subtitle: "",
  },
  universe: {
    label: "Project universe · 12 projetos catalogados",
    title: "Produtos, sistemas e experimentos reais",
    subtitle:
      "Explore o volume real de entregas da JE4NDEV. Filtre por área, busque por tecnologia e abra a prova mais relevante de cada projeto.",
    filters: {
      all: "Tudo",
      saas: "SaaS",
      ai: "AI",
      web3: "Web3 / Security",
      internal: "Internal tools",
      games: "Games / Social",
    },
    searchPlaceholder: "Buscar projeto, tecnologia ou categoria...",
    resultLabel: "projeto encontrado",
    resultsLabel: "projetos encontrados",
    emptyTitle: "Nenhum projeto nesse recorte",
    emptyBody: "Tente outro filtro ou remova parte da busca.",
    proofApproved: "Prova real",
    proofPrivate: "Demo privada",
    proofPending: "Nova captura pendente",
    proofEditorial: "Case editorial",
    footer: "Cada card abre um case com prova visual, stack, problema, entrega e ação principal.",
  },
  pricing: {
    label: "Como trabalhamos · escopo e pagamento claros",
    title: "Projeto fechado. Pagamento por etapas.",
    subtitle:
      "Entendemos o problema, definimos os entregáveis e apresentamos uma proposta antes de começar. Você acompanha cada marco em preview navegável e só avança com clareza sobre escopo, prazo e investimento.",
    plans: [
      {
        name: "Site / Landing / Blog",
        tagline: "Página, site institucional ou blog",
        price: "Projeto fechado",
        priceNote: "Valor definido após o briefing · entrada para iniciar",
        features: [
          "Site institucional, landing de alta conversão ou blog",
          "Design custom, dark/light, mobile-first",
          "Deploy em Vercel ou VPS com domínio próprio",
          "Acompanhamento por preview navegável",
          "Garantia de 1 ano + suporte por WhatsApp",
        ],
        cta: "Pedir diagnóstico",
        featured: false,
      },
      {
        name: "SaaS / Produto",
        tagline: "Tira sua ideia do papel — sistema completo",
        price: "Por etapas",
        priceNote: "Escopo e marcos definidos na proposta",
        features: [
          "Auth, billing, painel admin, multi-tenant",
          "Backend + DB + integrações com APIs",
          "Acompanha cada marco em preview navegável",
          "Deploy + 30 dias de operação inclusos",
          "1 ano de garantia · planos mensais de manutenção",
        ],
        cta: "Planejar meu produto",
        featured: true,
        badge: "Mais escolhido",
      },
      {
        name: "Web3 / NFT / Audit",
        tagline: "Smart contracts, plataformas NFT e auditoria",
        price: "Por escopo",
        priceNote: "Diagnóstico técnico antes da proposta",
        features: [
          "Auditoria Solidity / EVM com relatório técnico",
          "Criação de NFT collections + smart contracts",
          "Plataformas NFT completas com marketplace",
          "Pentest interno e verificação de exploits",
          "Setup de Hermes e OpenClaw na sua VPS + treinamento",
        ],
        cta: "Conversar sobre escopo",
        featured: false,
      },
    ],
    disclaimer:
      "Cada proposta informa entregáveis, prazo, marcos de pagamento e o que fica fora do escopo. Manutenção e suporte contínuo são opcionais.",
  },
  faq: {
    label: "FAQ",
    title: "Dúvidas antes de fechar",
    subtitle: "Respostas diretas sobre processo, escopo, segurança e suporte.",
    items: [
      {
        q: "Como isso é diferente de contratar freela ou agência de dev tradicional?",
        a: "A JE4NDEV é uma operação founder-led: você fala diretamente com quem define a arquitetura e revisa cada entrega. Agentes especializados apoiam desenvolvimento, QA, segurança e documentação, enquanto o escopo, as decisões e a responsabilidade final continuam sob revisão humana.",
      },
      {
        q: "Quem está no controle de verdade?",
        a: "O founder (Jean) acompanha cada sprint. Agentes executam sob spec rígido, todo PR passa por security-gate, e tu recebe update diário no Telegram com diff + screenshot. Pode pausar qualquer sprint quando quiser.",
      },
      {
        q: "E se um agente errar?",
        a: "Três redes de segurança: (1) QA agent roda testes automatizados em todo PR antes do merge; (2) security agent audita cada mudança procurando padrão de risco; (3) o founder revisa cada deploy de produção. Erros que escapam entram em hotfix prioritário no Kanban e a gente comunica o ETA real assim que abre o ticket — sem SLA inventado.",
      },
      {
        q: "Quanto tempo até o primeiro produto pronto?",
        a: "Depois do briefing, entregamos um cronograma dividido em marcos verificáveis. O primeiro checkpoint navegável entra cedo no processo, mas o prazo final só é fechado depois de validar escopo, integrações e riscos técnicos.",
      },
      {
        q: "Vocês assinam NDA e lidam com negócio confidencial?",
        a: "Sim. NDA mútuo padrão incluído no contrato. Código fica no teu GitHub org ou em repo privado nosso com teu acesso. Não treinamos modelo com teus dados, não compartilhamos com outros clientes, e tu é dono de tudo que a gente constrói.",
      },
      {
        q: "Qual stack vocês usam pra shippar?",
        a: "Padrão: Next.js + TypeScript + Tailwind + Supabase + Stripe. Conseguimos casar com teu stack existente — Python/Django, Node/Express, React Native, Solidity pra smart contract, Three.js pra 3D. Os agentes são model-agnostic via OpenClaw Gateway.",
      },
      {
        q: "Por que confiar em uma agência IA que vende ferramentas de agência IA?",
        a: "Porque mostramos evidência verificável antes da proposta. ArchScene, NexPanel, Vultrix 3D, StopUltimate, Alchemix Auditor e Ethena Scanner têm acesso público; outros cases deixam claro quando a prova é privada, editorial ou está em revisão. Você pode navegar pelos produtos e avaliar a entrega antes de fechar.",
      },
    ],
  },
  project: {
    breadcrumbWork: "Projetos",
    demoLabel: "Demo em movimento",
    demoIntro: "Demonstração complementar do fluxo ou resultado do produto.",
    visuals: "Prints do produto",
    visualIntro: "Telas reais, resultados e artefatos revisados do produto.",
    mainVisual: "Print em destaque",
    impact: "Impacto no negócio",
    before: "Antes",
    build: "O que eu construi",
    result: "Resultado",
    resultIntro: "Os principais sinais de resultado do projeto.",
    problem: "O Problema",
    solution: "A Solução",
    visitLive: "Visitar site",
    github: "GitHub",
    docs: "Documentação",
    contact: "Solicitar demonstração",
    proofLabel: "Prova revisada",
    privateProof: "Demonstração privada",
    pendingProof: "Captura do produto em revisão",
    editorialProof: "Apresentação editorial",
    contextLabel: "Contexto do projeto",
    ctaTitle: "Quer um sistema parecido?",
    ctaSubtitle:
      "Me conte o que hoje e manual, lento ou dificil de medir na sua operação. Eu posso ajudar a transformar isso em produto real.",
    ctaWhatsapp: "Conversar sobre meu projeto",
    ctaEmail: "Enviar email",
    nextProject: "Próximo projeto",
  },
};
