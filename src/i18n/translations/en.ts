export const en = {
  nav: {
    work: "Work",
    about: "About",
    services: "Services",
    stack: "Stack",
    contact: "Get in touch",
  },
  hero: {
    badge: "Available for selected projects",
    title: "I build SaaS and automations",
    titleHighlight: "for business growth",
    subtitle:
      "Full-stack developer helping founders and teams launch revenue-ready products, connect APIs, and remove manual work with AI.",
    terminalTitle: "je4ndev/build",
    terminalCommand: "ship product --saas --automation --web3",
    terminalOutput: "scope -> architecture -> code -> deploy -> monitoring",
    cta: "Start a project",
    secondaryCta: "View case studies",
    email: "jean@je4ndev.com",
    whatsapp: "Talk on WhatsApp",
    proof:
      "From idea to production: strategy, interface, backend, database, automations and deployment.",
    stats: [
      { value: "10+", label: "years building systems" },
      { value: "R$181k+", label: "tracked in client platforms" },
      { value: "24/7", label: "automation and monitoring" },
    ],
    strengths: [
      "SaaS MVPs with auth, billing and admin panels",
      "AI workflows that reduce repetitive work",
      "Integrations with APIs, dashboards and databases",
      "Solidity audits for smart contracts",
    ],
  },
  work: {
    label: "Featured Work",
    title: "Selected projects",
    viewCase: "View case study",
    viewProject: "View project",
  },
  about: {
    label: "About",
    name: "Jean Carlos Vargas",
    bio: "Full-stack developer and Founder of Vultrix 3D. Building production systems for over 10 years, from SaaS platforms to AI-powered bots, API integrations, Solidity smart contract audits, and automation pipelines. Based in Paranavai, Brazil, working globally.",
    experience: "10+ years",
  },
  stack: {
    label: "Tech Stack",
    title: "Tools I work with",
    categories: {
      frontend: "Frontend",
      backend: "Backend",
      database: "Database",
      ai: "AI & Automation",
      devops: "DevOps",
      web3: "Web3 & Smart Contracts",
      tools: "Tools",
    },
  },
  services: {
    label: "Services",
    title: "What I can build for your business",
    items: [
      {
        title: "Web Applications",
        description:
          "Fast, polished full-stack apps with dashboards, forms and real business flows",
      },
      {
        title: "SaaS Platforms",
        description:
          "Products with auth, billing, roles, admin panels and production-ready architecture",
      },
      {
        title: "AI Automations",
        description:
          "Bots, agents and workflows that cut manual tasks and connect your tools",
      },
      {
        title: "API Integrations",
        description:
          "Connect ERPs, CRMs, marketplaces, payments and internal databases",
      },
      {
        title: "Solidity Audits",
        description:
          "Smart contract review for security risks, business logic, and exploit paths",
      },
      {
        title: "Mobile Apps",
        description: "Cross-platform apps for teams, customers and field operations",
      },
      {
        title: "Consulting",
        description:
          "Architecture, product decisions and technical review before you spend months building",
      },
    ],
    cta: "Learn more",
  },
  contact: {
    title: "Let's build something",
    titleHighlight: "extraordinary",
    subtitle: "Have a project in mind? I'd love to hear about it.",
    whatsapp: "WhatsApp",
  },
  footer: {
    copyright: "(c) 2026 Jean Carlos Vargas",
  },
  testimonials: {
    label: "Comments",
    title: "Representative clients and projects",
    items: [
      {
        avatar: "/images/testimonials/marina-lopes.webp",
        name: "Marina Lopes",
        role: "Founder",
        company: "NexCommerce",
        quote:
          "Jean turned a loose idea into a SaaS with a clear flow, dashboard, permissions and production deployment. It felt like a product, not a prototype.",
        result: "SaaS MVP validated in weeks",
      },
      {
        avatar: "/images/testimonials/rafael-costa.webp",
        name: "Rafael Costa",
        role: "Head of Operations",
        company: "MarketOps",
        quote:
          "The automation reduced rework across orders, messages and reconciliation. The team stopped depending on spreadsheets and started working from one routine.",
        result: "Orders and support centralized",
      },
      {
        avatar: "/images/testimonials/camila-torres.webp",
        name: "Camila Torres",
        role: "Product Lead",
        company: "Voxly AI",
        quote:
          "He did not just create a bot. He built a complete flow with context, logs, fallback and API integration, ready for real operational use.",
        result: "AI connected to the real process",
      },
      {
        avatar: "/images/testimonials/daniel-prado.webp",
        name: "Daniel Prado",
        role: "CTO",
        company: "DataBridge",
        quote:
          "Jean understands both the technical side and the business impact. The integration became organized, observable and easy to maintain without unnecessary dependency.",
        result: "APIs, jobs and monitoring",
      },
      {
        avatar: "/images/testimonials/beatriz-almeida.webp",
        name: "Beatriz Almeida",
        role: "Finance Director",
        company: "PrintLab 3D",
        quote:
          "The system made cost, margin and revenue visible. Pricing stopped being trial and error and became a decision backed by reliable data.",
        result: "Finance with reliable data",
      },
      {
        avatar: "/images/testimonials/lucas-mota.webp",
        name: "Lucas Mota",
        role: "Web3 Founder",
        company: "ChainProof",
        quote:
          "The Solidity audit found permission and logic risks before deployment. The report was clear, straight to the point and helped the team fix fast.",
        result: "Contract reviewed before production",
      },
    ],
  },
  project: {
    breadcrumbWork: "Work",
    visuals: "Product Screenshots",
    visualIntro: "Real screens from the product, landing page, and conversion flows.",
    mainVisual: "Featured screenshot",
    impact: "Business Impact",
    before: "Before",
    build: "What I built",
    result: "Result",
    resultIntro: "The strongest proof points from the project.",
    problem: "The Problem",
    solution: "The Solution",
    visitLive: "Visit live",
    github: "GitHub",
    ctaTitle: "Need a system like this?",
    ctaSubtitle:
      "Tell me what is manual, slow, or hard to measure in your operation. I can help turn it into a real product.",
    ctaWhatsapp: "Talk about my project",
    ctaEmail: "Send an email",
    nextProject: "Next project",
  },
} as const;

export type Translations = {
  nav: {
    work: string;
    about: string;
    services: string;
    stack: string;
    contact: string;
  };
  hero: {
    badge: string;
    title: string;
    titleHighlight: string;
    subtitle: string;
    terminalTitle: string;
    terminalCommand: string;
    terminalOutput: string;
    cta: string;
    secondaryCta: string;
    email: string;
    whatsapp: string;
    proof: string;
    stats: ReadonlyArray<{ value: string; label: string }>;
    strengths: ReadonlyArray<string>;
  };
  work: {
    label: string;
    title: string;
    viewCase: string;
    viewProject: string;
  };
  about: {
    label: string;
    name: string;
    bio: string;
    experience: string;
  };
  stack: {
    label: string;
    title: string;
    categories: {
      frontend: string;
      backend: string;
      database: string;
      ai: string;
      devops: string;
      web3: string;
      tools: string;
    };
  };
  services: {
    label: string;
    title: string;
    items: ReadonlyArray<{ title: string; description: string }>;
    cta: string;
  };
  contact: {
    title: string;
    titleHighlight: string;
    subtitle: string;
    whatsapp: string;
  };
  footer: {
    copyright: string;
  };
  testimonials: {
    label: string;
    title: string;
    items: ReadonlyArray<{
      avatar: string;
      name: string;
      role: string;
      company: string;
      quote: string;
      result: string;
    }>;
  };
  project: {
    breadcrumbWork: string;
    visuals: string;
    visualIntro: string;
    mainVisual: string;
    impact: string;
    before: string;
    build: string;
    result: string;
    resultIntro: string;
    problem: string;
    solution: string;
    visitLive: string;
    github: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaWhatsapp: string;
    ctaEmail: string;
    nextProject: string;
  };
};
