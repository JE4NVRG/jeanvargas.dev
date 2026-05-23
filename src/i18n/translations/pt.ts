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
    badge: "Vem tirar sua ideia do papel · equipe transparente",
    title: "Agência de produto",
    titleHighlight: "que tira sua ideia do papel",
    subtitle:
      "Você acompanha o desenvolvimento em tempo real — preview público no Vercel com domínio próprio do projeto, commits e screenshots a cada milestone. Equipe experiente, transparente, com garantia de 1 ano nos produtos em produção. Trabalhamos por produção ou por metas: pequena entrada, e vamos recebendo conforme entregamos. A partir de R$ 500.",
    subtitleMobile:
      "SaaS, IA e automações em produção — com founder revisando cada entrega. A partir de R$ 500.",
    terminalTitle: "je4ndev/agency",
    terminalCommand: "ship produto --saas --automacao --web3",
    terminalOutput: "scope -> arquitetura -> codigo -> deploy -> mrr",
    cta: "Ver nossos produtos",
    secondaryCta: "Falar com o founder",
    email: "jean@je4ndev.com",
    whatsapp: "Falar no WhatsApp",
    proof:
      "Da ideia ao produto em produção: estratégia, interface, backend, banco, automações e deploy.",
    stats: [
      { value: "10+", label: "produtos próprios no portfólio" },
      { value: "10+", label: "anos shippando SaaS" },
      { value: "1 ano", label: "garantia em produção" },
      { value: "24/7", label: "operação e suporte" },
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
          "Site institucional, landing de alta conversão ou blog em Vercel com domínio próprio · a partir de R$ 500",
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
    title: "Vamos construir algo",
    titleHighlight: "extraordinário",
    subtitle: "Tem um projeto em mente? Conta o que é manual, lento ou difícil de medir na sua operação — a gente devolve uma proposta com escopo, prazo e parcelas em até 1 dia útil.",
    whatsapp: "WhatsApp",
    trustline: "Resposta direta com o founder · escopo fechado por entrega · garantia de 1 ano",
    founderName: "Jean Carlos Vargas",
    founderRole: "Founder · Product Engineer · Smart Contract Security Researcher",
    founderLocation: "São Paulo · BR · Operando remoto pra clientes no mundo todo",
    terminalTitle: "je4ndev/agency · proxima entrega",
    terminalLines: [
      "briefing recebido",
      "escopo fechado em até 1 dia útil",
      "build iniciado · preview público no Vercel",
      "qa + security gate (gitleaks + npm audit)",
      "deploy em produção · garantia de 1 ano",
    ],
    githubCta: "Ver GitHub",
  },
  githubProof: {
    label: "Open source · proof of work",
    title: "github.com/JE4NVRG",
    subtitle:
      "Não acreditem só na vitrine. Cada commit é público — Hermes Kanban open source (MIT), tools internas que viraram OSS, audits Solidity e SaaS em produção. Tudo rastreável.",
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
        body: "ArchScene, NexPanel, StopUltimate, GestãoML, HypeFC — todos shipping.",
      },
    ],
    metricsTitle: "Atividade em 2026",
    metrics: [
      { label: "Repos públicos", value: "30+" },
      { label: "Commits no último ano", value: "1.6k+" },
      { label: "Stars em projetos OSS", value: "120+" },
      { label: "Audit reports", value: "8+" },
    ],
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
    title: "Tudo que a gente já entregou",
    subtitle:
      "Os 6 flagship cinematográficos lá em cima vendem direto. Aqui tu vê o resto — tools internos, MVPs, audits e experimentos que provam que a agência ship há tempo.",
    filters: {
      all: "Tudo",
      saas: "SaaS",
      ai: "AI",
      web3: "Web3 / Security",
      internal: "Internal tools",
      games: "Games / Social",
    },
    footer: "Cada card abre um case study com prints reais, stack, problema e entrega.",
  },
  pricing: {
    label: "Como cobramos · transparente e flexível",
    title: "A partir de R$ 500. Pague conforme entregamos.",
    subtitle:
      "Não cobramos por hora. Trabalhamos por produção ou por metas: você dá uma pequena entrada e o restante vai sendo pago conforme a gente entrega cada parte do projeto. Sem surpresa, sem retainer eterno.",
    plans: [
      {
        name: "Site / Landing / Blog",
        tagline: "Página, site institucional ou blog",
        price: "A partir de",
        priceSuffix: "R$ 500",
        priceNote: "Entrada de 30% · resto na entrega",
        features: [
          "Site institucional, landing de alta conversão ou blog",
          "Design custom, dark/light, mobile-first",
          "Deploy em Vercel com domínio próprio",
          "Acompanhamento em tempo real via Vercel preview",
          "Garantia de 1 ano + suporte por WhatsApp",
        ],
        cta: "Pedir orçamento",
        featured: false,
      },
      {
        name: "SaaS / Produto",
        tagline: "Tira sua ideia do papel — sistema completo",
        price: "Sob medida",
        priceSuffix: "por metas",
        priceNote: "Cobramos por entrega · pequena entrada + parcelas",
        features: [
          "Auth, billing, painel admin, multi-tenant",
          "Backend + DB + integrações com APIs",
          "Acompanha cada commit no preview Vercel",
          "Deploy + 30 dias de operação inclusos",
          "1 ano de garantia · planos mensais de manutenção",
        ],
        cta: "Tirar do papel",
        featured: true,
        badge: "Mais escolhido",
      },
      {
        name: "Web3 / NFT / Audit",
        tagline: "Smart contracts, plataformas NFT e auditoria",
        price: "Sob medida",
        priceNote: "Conforme escopo · planos mensais disponíveis",
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
      "Trabalhamos por produção ou por metas. Pequena entrada, o resto vai sendo pago conforme entregamos. Garantia de 1 ano em produtos em produção. Planos mensais de manutenção e suporte 24/7 disponíveis.",
  },
  faq: {
    label: "FAQ",
    title: "Dúvidas antes de fechar",
    subtitle: "As respostas honestas que a gente gostaria de ter ouvido antes de contratar uma agência IA.",
    items: [
      {
        q: "Como isso é diferente de contratar freela ou agência de dev tradicional?",
        a: "Freela é 1 pessoa, 40h por semana, cobra hora e tira férias. A gente é founder + 21 perfis de agente IA (dev, QA, security, design, content) orquestrados no mesmo Kanban, cobrando por resultado entregue — não hora. Founder revisa cada entrega antes de subir; os agentes destravam o trabalho repetitivo que segura agência tradicional em reunião pra marcar reunião.",
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
        a: "Plano Sprint: 21 dias do spec à produção. Já entregamos MVP em 14 dias pra escopo bem apertado. Mais rápido que isso é mentira — qualidade tem um piso.",
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
        a: "Porque a agência roda nos produtos que vende. Hermes Agentes, OpenClaw Gateway, ArchScene, NexPanel, HypeFC, Vultrix 3D, StopUltimate — todos live em produção e construídos com o mesmo pipeline que tu contrataria. O dogfood é a prova: cada produto tem link público, commits, changelog. Tu pode auditar antes de fechar.",
      },
    ],
  },
  project: {
    breadcrumbWork: "Projetos",
    demoLabel: "Demo em movimento",
    demoIntro: "Visualização animada do produto em ação.",
    visuals: "Prints do produto",
    visualIntro: "Telas reais do produto, landing page e fluxos de conversão.",
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
    ctaTitle: "Quer um sistema parecido?",
    ctaSubtitle:
      "Me conte o que hoje e manual, lento ou dificil de medir na sua operação. Eu posso ajudar a transformar isso em produto real.",
    ctaWhatsapp: "Conversar sobre meu projeto",
    ctaEmail: "Enviar email",
    nextProject: "Próximo projeto",
  },
};
