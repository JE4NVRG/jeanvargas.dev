export const en = {
  nav: {
    work: "Work",
    about: "About",
    services: "Services",
    stack: "Stack",
    contact: "Get in touch",
  },
  hero: {
    badge: "Available for remote contract work worldwide",
    title: "Full-Stack Engineer for SaaS,",
    titleHighlight: "AI Automation and Internal Tools",
    subtitle:
      "I build web products, business systems, and AI workflows for companies that need speed, clarity, and reliable execution.",
    cta: "View selected work",
    email: "jean@je4ndev.com",
    signals: [
      { label: "Work mode", value: "Remote contract" },
      { label: "Primary focus", value: "SaaS + internal tools" },
      { label: "Automation", value: "AI workflows" },
      { label: "Collaboration", value: "Async-friendly" },
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
    bio: "Full-stack engineer focused on SaaS, internal tools and AI automations. I work across frontend, backend, APIs, auth, payments and deployment — with a strong business/operations background from building and running companies before software. Based in Paranavaí, Brazil, available for remote work worldwide.",
    experience: "5+ years in software",
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
      tools: "Tools",
    },
  },
  services: {
    label: "Services",
    title: "What I offer",
    items: [
      { title: "Web Applications", description: "Full-stack apps with Next.js, React, and modern frameworks" },
      { title: "SaaS Platforms", description: "Scalable systems with auth, billing, and admin panels" },
      { title: "AI Automations", description: "Intelligent bots, workflows, and integrations with OpenAI" },
      { title: "API Integrations", description: "Connect systems, automate processes, sync data" },
      { title: "Mobile Apps", description: "Cross-platform apps with FlutterFlow and React Native" },
      { title: "Consulting", description: "Technical architecture, code review, and system design" },
    ],
    cta: "Learn more",
  },
  contact: {
    title: "Let's build something",
    titleHighlight: "that ships",
    subtitle: "Tell me what you're building, what is blocked, and what outcome you need. I can help with SaaS, internal tools, and AI automations.",
    whatsapp: "WhatsApp",
  },
  footer: {
    copyright: "© 2026 Jean Carlos Vargas",
  },
  testimonials: {
    label: "Testimonials",
    title: "What clients say",
    items: [
      {
        initials: "R.C.",
        name: "Rafael Costa",
        role: "CEO, TechFlow",
        quote:
          "Jean delivered an automation solution that transformed our operations. We reduced manual work by 80%.",
      },
      {
        initials: "A.S.",
        name: "Amanda Silva",
        role: "Founder, PrintLab 3D",
        quote:
          "Vultrix 3D completely changed how we price our products. Finally a tool made by someone who understands the business.",
      },
      {
        initials: "M.O.",
        name: "Marcos Oliveira",
        role: "CTO, DataStream",
        quote:
          "The OpenClaw integration was flawless. Jean understands both the technical and business sides perfectly.",
      },
    ],
  },
  project: {
    breadcrumbWork: "Work",
    problem: "The Problem",
    solution: "The Solution",
    visitLive: "Visit live",
    github: "GitHub",
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
    cta: string;
    email: string;
    signals: ReadonlyArray<{ label: string; value: string }>;
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
      initials: string;
      name: string;
      role: string;
      quote: string;
    }>;
  };
  project: {
    breadcrumbWork: string;
    problem: string;
    solution: string;
    visitLive: string;
    github: string;
    nextProject: string;
  };
};
