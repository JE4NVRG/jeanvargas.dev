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

const UPDATED_AT = "2026-09-23";

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
        "O assistente de IA ajuda a entender o pedido, mas pode cometer erros. Ele não confirma contratação, preço ou prazo e não envia mensagens ao WhatsApp automaticamente.",
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
  updatedAt: "2026-10-01",
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
        "Usamos cookies estritamente necessários ao funcionamento do site, inclusive preferência de idioma e uma sessão da Nora vinculada a este navegador para continuidade e controles de uso. Essa sessão não comprova a identidade da pessoa em um dispositivo compartilhado.",
        "O analytics do portfólio é first-party. Não usamos pixels de anúncio neste site, salvo se isso for informado de forma explícita no futuro.",
      ],
    },
    {
      title: "Atendimento com inteligência artificial",
      paragraphs: [
        "Ao enviar uma mensagem ao assistente, seu texto e o contexto da conversa são processados por uma instância dedicada do Hermes em nossa infraestrutura e pelo OpenCode Go, com o modelo DeepSeek V4.1 Flash. Esse processamento pode ocorrer fora do Brasil. Não envie senhas, tokens, dados sensíveis ou informações confidenciais.",
        "Para iniciar a conversa, pedimos nome, WhatsApp e autorização para registrar esses dados e um resumo do atendimento. O cadastro distingue demonstração de interesse em um projeto e não autoriza marketing. A Nora recebe seu nome para personalizar o atendimento; seu WhatsApp fica no registro de contato e não é incluído no contexto enviado ao modelo.",
        "O nome, contato e um resumo atualizado das necessidades, orientações da Nora, restrições e dúvidas podem ser registrados na planilha privada da equipe no Google Sheets para organizar o atendimento. Esse resumo é separado da memória opcional e não contém automaticamente a transcrição completa. O Google pode processar esses dados fora do Brasil.",
        "Usamos Cloudflare Turnstile para verificar o acesso e reduzir automação abusiva. O navegador se comunica com a Cloudflare para essa verificação; o servidor valida o token antes de aceitar um novo cadastro ou uma mensagem. Não enviamos o conteúdo da conversa nem os dados do cadastro nessa validação.",
        "O histórico não é salvo no armazenamento persistente do navegador. O runtime de atendimento pode registrar conversas e dados técnicos no servidor para operação, diagnóstico e atendimento. O conteúdo do chat não é enviado ao analytics do portfólio. Para controles de abuso, o mecanismo de quota usa um identificador derivado do IP por hash, sem salvar o IP em texto nesse registro.",
        `Você pode solicitar esclarecimentos ou exclusão pelo e-mail ${COMPANY.email}. Para atendimento sem IA, use diretamente os links de e-mail ou WhatsApp. O botão de WhatsApp prepara uma mensagem para sua revisão; o envio depende de você.`,
      ],
    },
    {
      title: "Pedidos de retorno e Telegram",
      paragraphs: [
        "O formulário de retorno solicita nome, e-mail ou WhatsApp, um contato alternativo opcional e um resumo que você pode revisar. O envio exige seu consentimento explícito. O pedido é salvo em nosso servidor e esses dados são encaminhados ao Telegram privado da equipe JE4NDEV para atendimento. Não enviamos automaticamente o histórico completo da conversa.",
        "Salvar o pedido não significa que a notificação já foi entregue ou que a equipe leu a mensagem. A interface distingue o pedido registrado da entrega confirmada. Essa autorização é para responder à sua solicitação, não para campanhas de marketing.",
        "O registro do pedido, a mensagem no Telegram e eventuais registros de atendimento ou backup são cópias distintas. Apagar a memória da Nora não exclui essas cópias; pedidos de acesso, correção ou exclusão devem ser feitos pelo contato informado nesta política.",
      ],
    },
    {
      title: "Memória opcional da Nora",
      paragraphs: [
        "A memória é desativada por padrão e exige uma permissão separada do cadastro e do pedido de contato. Quando ativada, fatos sobre seus projetos podem ser salvos no servidor por até 30 dias após a última atualização. Você pode vinculá-los ao número informado no cadastro e a um código pessoal de recuperação para retomar em outro navegador. Somente informar o número não dá acesso à memória; esse mecanismo não verifica a titularidade do WhatsApp. Guarde o código em local privado.",
        "Você pode visualizar, editar e apagar os fatos salvos, excluir projetos ou apagar toda a memória pelos controles da Nora. Pessoas que utilizem o mesmo navegador podem acessar esse contexto. A exclusão da memória não apaga automaticamente os registros separados de atendimento, do provedor de IA ou de backup.",
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
        "The AI assistant helps clarify inquiries but can make mistakes. It does not confirm contracts, prices or deadlines and does not automatically send WhatsApp messages.",
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
  updatedAt: "2026-10-01",
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
        "We use strictly necessary cookies, including language preference and a Nora session linked to this browser for continuity and usage controls, plus first-party analytics. This session does not verify who is using a shared device. This site does not run ad pixels unless that is later disclosed explicitly.",
      ],
    },
    {
      title: "AI-assisted inquiries",
      paragraphs: [
        "When you send a message to the assistant, your text and conversation context are processed by a dedicated Hermes instance on our infrastructure and by OpenCode Go using DeepSeek V4.1 Flash. Processing may occur outside Brazil. Do not submit passwords, tokens, sensitive personal data or confidential information.",
        "Before starting a conversation, we ask for your name, WhatsApp and permission to register those details and a support summary. Registration distinguishes a demonstration from interest in a project and does not authorize marketing. Nora receives your name to personalize the conversation; your WhatsApp stays in the contact record and is not included in the model context.",
        "Your name, contact and an updated summary of your needs, Nora's guidance, constraints and questions may be saved in the team's private Google Sheets to organize follow-up. This summary is separate from optional memory and does not automatically contain a full transcript. Google may process these details outside Brazil.",
        "We use Cloudflare Turnstile to verify access and reduce automated abuse. Your browser communicates with Cloudflare for verification; our server validates the token before accepting a new registration or message. We do not send conversation content or registration details in that validation.",
        "Chat history is not saved in persistent browser storage. The assistant runtime may record conversations and technical data on the server for operation, troubleshooting and support. Chat content is not sent to portfolio analytics. Abuse quotas use an IP-derived hash identifier rather than saving the plain IP in that quota record.",
        `For questions or deletion requests, contact ${COMPANY.email}. To contact us without AI, use the email or WhatsApp links directly. The WhatsApp button prepares a message for your review; you decide whether to send it.`,
      ],
    },
    {
      title: "Reply requests and Telegram",
      paragraphs: [
        "The reply form asks for your name, email or WhatsApp, an optional alternate contact and a summary you can review. Submission requires your explicit consent. The request is saved on our server and these details are forwarded to the private JE4NDEV team Telegram for follow-up. We do not automatically send the full conversation history.",
        "Saving a request does not mean the notification has been delivered or that the team has read it. The interface distinguishes a saved request from confirmed delivery. This permission is for responding to your inquiry, not for marketing campaigns.",
        "The request record, Telegram message and any follow-up or backup records are separate copies. Forgetting Nora memory does not delete these copies; use the contact in this policy to request access, correction or deletion.",
      ],
    },
    {
      title: "Optional Nora memory",
      paragraphs: [
        "Memory is off by default and requires permission separate from registration and contact requests. When enabled, project facts may be saved on the server for up to 30 days after their last update. You can link them to the registered number and a personal recovery code to restore them in another browser. The number alone cannot access memory; this mechanism does not verify WhatsApp ownership. Keep the code private.",
        "You can view, edit and delete saved facts, delete projects or forget all memory through Nora's controls. People using the same browser may access this context. Deleting memory does not automatically delete separate follow-up, AI-provider or backup records.",
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
