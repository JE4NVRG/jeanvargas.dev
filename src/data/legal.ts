import { COMPANY } from "./company";

export type LegalSlug = "termos" | "privacidade";

export interface LegalSection {
  title: string;
  paragraphs: string[];
}

export interface LegalDocument {
  slug: LegalSlug;
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
}

const UPDATED_AT = "2026-09-02";

const termsPt: LegalDocument = {
  slug: "termos",
  title: "Termos de uso",
  description: `Regras de uso do site ${COMPANY.siteUrl.replace("https://", "")} e dos serviços da ${COMPANY.brand}.`,
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: "1. Quem somos",
      paragraphs: [
        `Este site é operado por ${COMPANY.legalName}, nome fantasia ${COMPANY.tradeName}, marca ${COMPANY.brand}, inscrita no CNPJ ${COMPANY.cnpj}.`,
        COMPANY.activityPt,
      ],
    },
    {
      title: "2. Aceite",
      paragraphs: [
        "Ao acessar o site, você concorda com estes Termos de uso e com a Política de privacidade. Se não concordar, não utilize o site.",
      ],
    },
    {
      title: "3. Serviços",
      paragraphs: [
        "A JE4NDEV apresenta portfólio, cases e ofertas de desenvolvimento de software, SaaS, sistemas internos, integrações, automações e agentes de IA.",
        "Propostas, prazos, valores, escopo e garantias só valem quando estiverem por escrito em contrato, proposta aceita ou ordem de serviço. Páginas de case, prints e métricas descrevem evidência disponível; não são garantia de resultado futuro.",
      ],
    },
    {
      title: "4. Contato e propostas",
      paragraphs: [
        `Canal principal: e-mail ${COMPANY.email} ou WhatsApp ${COMPANY.whatsappDisplay}.`,
        "Mensagens enviadas por esses canais podem ser usadas para responder pedidos, elaborar proposta e registrar o atendimento.",
      ],
    },
    {
      title: "5. Propriedade intelectual",
      paragraphs: [
        "Marca, textos, layout, código e materiais deste site pertencem à JE4NDEV ou aos respectivos titulares, salvo indicação em contrário.",
        "É vedado copiar, republicar ou usar o conteúdo para fins comerciais sem autorização prévia.",
      ],
    },
    {
      title: "6. Limitação",
      paragraphs: [
        "O site pode ficar indisponível por manutenção, falha técnica ou fatores de terceiros. Não garantimos disponibilidade ininterrupta.",
        "Links para produtos, repositórios e sites de terceiros são responsabilidade dos respectivos operadores.",
      ],
    },
    {
      title: "7. Pagamentos",
      paragraphs: [
        "Cobranças de serviços ou produtos digitais, quando houver, seguem o contrato ou checkout aplicável, a legislação brasileira e o meio de pagamento escolhido.",
        "Reembolso, cancelamento e suporte seguem o que estiver descrito na proposta aceita ou nestes termos, o que for mais específico.",
      ],
    },
    {
      title: "8. Lei aplicável",
      paragraphs: [
        "Estes termos são regidos pelas leis da República Federativa do Brasil.",
        `Dúvidas: ${COMPANY.email}.`,
      ],
    },
  ],
};

const privacyPt: LegalDocument = {
  slug: "privacidade",
  title: "Política de privacidade",
  description: `Como a ${COMPANY.brand} trata dados pessoais no site e nos canais de contato, em conformidade com a LGPD.`,
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: "1. Controlador",
      paragraphs: [
        `Controlador: ${COMPANY.legalName}, ${COMPANY.tradeName} / ${COMPANY.brand}, CNPJ ${COMPANY.cnpj}.`,
        `Contato do titular: ${COMPANY.email} ou WhatsApp ${COMPANY.whatsappDisplay}.`,
      ],
    },
    {
      title: "2. Quais dados tratamos",
      paragraphs: [
        "Dados que você envia: nome, e-mail, telefone/WhatsApp, empresa e o conteúdo da mensagem.",
        "Dados técnicos do site: páginas visitadas, idioma, origem da visita e eventos de conversão em analytics próprio, sem vender lista de leads.",
        "Não pedimos cartão de crédito neste site. Pagamentos, quando existirem, ocorrem em provedor contratado.",
      ],
    },
    {
      title: "3. Para que usamos",
      paragraphs: [
        "Responder contato comercial, elaborar proposta, prestar o serviço contratado, melhorar o site e cumprir obrigação legal.",
        "Base legal principal: execução de procedimentos preliminares e de contrato, legítimo interesse em operar o site e consentimento quando você inicia o contato.",
      ],
    },
    {
      title: "4. Com quem compartilhamos",
      paragraphs: [
        "Provedores de hospedagem, e-mail, WhatsApp e, quando houver cobrança, o processador de pagamento. Cada um recebe só o necessário para a finalidade.",
        "Não vendemos dados pessoais.",
      ],
    },
    {
      title: "5. Cookies e analytics",
      paragraphs: [
        "Usamos cookies estritamente necessários ao funcionamento do site, inclusive preferência de idioma.",
        "O analytics do portfólio é first-party. Não usamos pixels de anúncio neste site, salvo se isso for informado de forma explícita no futuro.",
      ],
    },
    {
      title: "6. Retenção e direitos",
      paragraphs: [
        "Guardamos dados de contato pelo tempo necessário ao atendimento, à proposta, ao contrato e às obrigações legais.",
        "Você pode solicitar acesso, correção, anonimização, portabilidade ou exclusão pelo e-mail informado, ressalvadas retenções legais.",
      ],
    },
    {
      title: "7. Atualizações",
      paragraphs: [
        "Esta política pode ser atualizada para refletir mudanças legais ou operacionais. A data de atualização aparece no topo da página.",
      ],
    },
  ],
};

const termsEn: LegalDocument = {
  slug: "termos",
  title: "Terms of use",
  description: `Terms for using ${COMPANY.siteUrl.replace("https://", "")} and ${COMPANY.brand} services.`,
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: "1. Who we are",
      paragraphs: [
        `This website is operated by ${COMPANY.legalName}, trade name ${COMPANY.tradeName}, brand ${COMPANY.brand}, CNPJ ${COMPANY.cnpj}.`,
        COMPANY.activityEn,
      ],
    },
    {
      title: "2. Acceptance",
      paragraphs: [
        "By using the site you accept these Terms and the Privacy Policy. If you do not agree, do not use the site.",
      ],
    },
    {
      title: "3. Services",
      paragraphs: [
        "JE4NDEV publishes a portfolio and offers founder-led software, SaaS, internal systems, integrations, automations and AI agents.",
        "Prices, timelines, scope and warranties apply only when written in an accepted proposal or contract. Case studies describe available evidence, not a future-result guarantee.",
      ],
    },
    {
      title: "4. Contact",
      paragraphs: [
        `Primary channels: ${COMPANY.email} or WhatsApp ${COMPANY.whatsappDisplay}.`,
        "Messages sent through these channels may be used to reply, prepare a proposal and keep a record of the conversation.",
      ],
    },
    {
      title: "5. Intellectual property",
      paragraphs: [
        "Brand, copy, layout, code and materials on this site belong to JE4NDEV or their respective owners unless stated otherwise.",
      ],
    },
    {
      title: "6. Limitation",
      paragraphs: [
        "The site may be unavailable for maintenance or third-party failures. Third-party product and repository links are the responsibility of their operators.",
      ],
    },
    {
      title: "7. Payments",
      paragraphs: [
        "If a paid service or digital product is purchased, the accepted proposal or checkout, Brazilian law and the chosen payment provider apply.",
      ],
    },
    {
      title: "8. Governing law",
      paragraphs: [
        "These terms are governed by the laws of Brazil.",
        `Questions: ${COMPANY.email}.`,
      ],
    },
  ],
};

const privacyEn: LegalDocument = {
  slug: "privacidade",
  title: "Privacy policy",
  description: `How ${COMPANY.brand} handles personal data on this site under Brazil's LGPD.`,
  updatedAt: UPDATED_AT,
  sections: [
    {
      title: "1. Controller",
      paragraphs: [
        `Controller: ${COMPANY.legalName}, ${COMPANY.tradeName} / ${COMPANY.brand}, CNPJ ${COMPANY.cnpj}.`,
        `Contact: ${COMPANY.email} or WhatsApp ${COMPANY.whatsappDisplay}.`,
      ],
    },
    {
      title: "2. Data we process",
      paragraphs: [
        "Data you send: name, email, phone/WhatsApp, company and message content.",
        "Technical data: pages viewed, locale, visit source and first-party conversion events.",
        "This site does not collect card numbers. Payments, when they exist, are handled by the contracted provider.",
      ],
    },
    {
      title: "3. Purposes",
      paragraphs: [
        "We use data to answer commercial contact, prepare proposals, deliver contracted work, operate the site and meet legal duties.",
        "Main legal bases: pre-contractual steps and contract, legitimate interest in operating the site, and consent when you start contact.",
      ],
    },
    {
      title: "4. Sharing",
      paragraphs: [
        "Hosting, email, WhatsApp and, when billing exists, the payment processor receive only what they need. We do not sell personal data.",
      ],
    },
    {
      title: "5. Cookies and analytics",
      paragraphs: [
        "We use strictly necessary cookies, including language preference, and first-party analytics. This site does not run ad pixels unless that is later disclosed explicitly.",
      ],
    },
    {
      title: "6. Retention and rights",
      paragraphs: [
        "We keep contact data for as long as needed for the inquiry, proposal, contract and legal duties.",
        "You may request access, correction, anonymization, portability or deletion at the email above, subject to legal retention.",
      ],
    },
    {
      title: "7. Updates",
      paragraphs: [
        "This policy may be updated for legal or operational changes. The update date appears at the top of the page.",
      ],
    },
  ],
};

export function getLegalDocument(slug: LegalSlug, locale: "pt" | "en"): LegalDocument {
  if (slug === "termos") return locale === "en" ? termsEn : termsPt;
  return locale === "en" ? privacyEn : privacyPt;
}
