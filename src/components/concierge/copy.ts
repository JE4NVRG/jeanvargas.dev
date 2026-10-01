import { CONCIERGE_NAME } from "@/lib/concierge/identity";

export type ConciergeErrorKind = "rate_limited" | "busy" | "upstream" | "verification" | "unknown";

export function conciergeErrorKind(code: unknown): ConciergeErrorKind {
  if (code === "rate_limited") return "rate_limited";
  if (code === "busy" || code === "temporarily_unavailable") return "busy";
  if (code === "upstream_unavailable") return "upstream";
  if (code === "verification_required" || code === "protection_unavailable") return "verification";
  return "unknown";
}

export const conciergeCopy = {
  pt: {
    open: "Conversar com Nora", close: "Fechar conversa", title: "Vamos entender seu projeto?", ai: `${CONCIERGE_NAME} · assistente de IA da JE4NDEV`,
    intro: "Oi! Eu sou Nora. O que você quer criar ou melhorar?",
    subtitle: "Assistente de IA · JE4NDEV", human: "Pedir retorno da equipe", back: "Voltar à conversa",
    contactOpened: "Claro. Deixe seu nome e como a equipe pode falar com você. Revise o pedido abaixo e autorize o envio; retornamos assim que possível.",
    contactOffer: "Quer que a JE4NDEV avalie seu projeto e fale com você?",
    contactOfferDetail: "Deixe seu nome e contato. Você revisa e autoriza antes de enviar.",
    contactDecline: "Agora não",
    privacyLabel: "Privacidade da conversa",
    placeholder: "Conte o que você precisa…", send: "Enviar", loading: "Preparando uma resposta…", retry: "Tentar novamente",
    error: "Não consegui responder agora. Seu pedido continua aqui; você pode editá-lo ou tentar novamente.",
    privacy: "A memória entre visitas é opcional e depende da sua autorização; mensagens podem constar nos logs dos serviços de IA (Hermes e OpenCode Go), e seu cadastro e um resumo do atendimento são registrados com sua autorização, inclusive na planilha privada Google Sheets da equipe. Não envie senhas ou dados sensíveis. Usamos Cloudflare Turnstile para verificar acessos e reduzir abuso. Nada é enviado ao WhatsApp automaticamente.",
    unavailable: "O serviço de IA está indisponível no momento. Seu pedido continua aqui; você pode revisá-lo e falar com a equipe por e-mail ou WhatsApp.",
    busy: "A assistente está ocupada no momento. Seu pedido foi preservado; aguarde um instante e tente novamente.",
    rateLimited: "Este acesso atingiu o limite de mensagens. Para continuar, revise seu pedido e fale com a equipe por e-mail ou WhatsApp.",
    upstream: "O serviço de IA não respondeu. Seu pedido continua aqui; tente novamente mais tarde ou fale com a equipe por e-mail ou WhatsApp.",
    handoff: "WhatsApp", restart: "Começar outra conversa",
    limit: "Esta conversa chegou ao limite. Revise seu pedido por e-mail ou WhatsApp para continuar com a equipe, ou comece outra conversa. Reiniciar não redefine limites do serviço.",
    prompts: ["Quero testar a Nora", "Como ter uma Nora no meu site ou app?", "Quero um assistente personalizado"],
  },
  en: {
    open: "Chat with Nora", close: "Close conversation", title: "Let's explore your project", ai: `${CONCIERGE_NAME} · JE4NDEV AI assistant`,
    intro: "Hi, I'm Nora. What would you like to build or improve?",
    subtitle: "AI assistant · JE4NDEV", human: "Request a reply from the team", back: "Back to chat",
    contactOpened: "Of course. Leave your name and how the team can reach you. Review the request below and authorize sending; we will get back to you as soon as we can.",
    contactOffer: "Would you like JE4NDEV to review your project and get in touch?",
    contactOfferDetail: "Leave your name and contact details. You review and authorize before sending.",
    contactDecline: "Not now",
    privacyLabel: "Conversation privacy",
    placeholder: "Tell us what you need…", send: "Send", loading: "Preparing a reply…", retry: "Try again",
    error: "I couldn't reply just now. Your request is still here; you can edit it or try again.",
    privacy: "Memory between visits is optional and requires your permission; messages may appear in AI service logs (Hermes and OpenCode Go), and your registration and a support summary are saved with your permission, including in the private Google Sheets used by the team. Do not share passwords or sensitive data. We use Cloudflare Turnstile to verify access and reduce abuse. Nothing is sent to WhatsApp automatically.",
    unavailable: "The AI service is currently unavailable. Your request is still here; review it and contact the team by email or WhatsApp.",
    busy: "The assistant is busy right now. Your request was preserved; wait a moment and try again.",
    rateLimited: "This access has reached its message limit. To continue, review your request and contact the team by email or WhatsApp.",
    upstream: "The AI service did not respond. Your request is still here; try again later or contact the team by email or WhatsApp.",
    handoff: "WhatsApp", restart: "Start a new conversation",
    limit: "This conversation reached its limit. Review your request by email or WhatsApp to continue with the team, or start a new conversation. Restarting does not reset service limits.",
    prompts: ["I want to try Nora", "How can I have Nora on my website or app?", "I want a personalized assistant"],
  },
} as const;

export const leadCopy = {
  pt: {
    title: "Pedir retorno da equipe", explain: "Revise seu contato e o resumo. Ao marcar o consentimento e clicar em Enviar pedido de retorno, você autoriza o registro e o aviso à equipe.",
    savedExplanation: "A equipe da JE4NDEV é responsável pelo retorno. O status abaixo mostra o aviso do seu pedido, não a confirmação de leitura ou de atendimento.",
    copyReceipt: "Copiar protocolo", copiedReceipt: "Protocolo copiado", copyFailed: "Não foi possível copiar. Selecione o protocolo completo abaixo para guardar.", fullReceipt: "Protocolo completo",
    name: "Seu nome", contactMethod: "Como a equipe pode responder?", email: "E-mail", whatsapp: "WhatsApp", emailAddress: "Seu e-mail", whatsappNumber: "Seu número com código do país",
    alternatePhone: "WhatsApp de apoio (opcional)", alternateEmail: "E-mail de apoio (opcional)", alternateHelp: "Um segundo contato ajuda se não conseguirmos falar pelo principal.",
    summary: "O que você precisa", consent: "Autorizo a JE4NDEV a registrar meu contato e este resumo no servidor e na planilha privada Google Sheets, e avisar a equipe pelo Telegram para responder ao pedido.",
    send: "Enviar pedido de retorno", saving: "Enviando pedido…", retryButton: "Tentar novamente com os mesmos dados", retrySame: "Não consegui confirmar o envio. Seus dados continuam aqui. Confira sua conexão e tente novamente; não vamos criar outro pedido.",
    conflict: "Não foi possível confirmar este envio após uma mudança na conexão. Mantivemos o pedido original para evitar duplicação. Você também pode falar com a equipe por e-mail ou WhatsApp.",
    unconfirmed: "Seu pedido está salvo, mas não foi possível confirmar o aviso à equipe. Você não precisa enviar o formulário novamente.",
    newOperation: "Editar em uma nova operação", validation: "Preencha nome, contato e um resumo de pelo menos 10 caracteres; marque o consentimento para continuar.",
    saveError: "O pedido não foi confirmado. Nenhum sucesso foi informado.", pending: "Seu pedido foi registrado. A equipe ainda precisa revisar e responder; a notificação está pendente.", sent: "Seu pedido foi registrado e a notificação foi enviada à equipe. A revisão e a resposta ainda estão pendentes.", receipt: "Protocolo", close: "Fechar formulário",
  },
  en: {
    title: "Request a reply from the team", explain: "Review your contact details and summary. Checking consent and clicking Send reply request authorizes saving the request and notifying the team.",
    savedExplanation: "The JE4NDEV team is responsible for replying. The status below tracks the notification, not whether your request has been read or handled.",
    copyReceipt: "Copy receipt", copiedReceipt: "Receipt copied", copyFailed: "Couldn't copy. Select the full receipt below to save it.", fullReceipt: "Full receipt",
    name: "Your name", contactMethod: "How can the team reply?", email: "Email", whatsapp: "WhatsApp", emailAddress: "Your email", whatsappNumber: "Your number with country code",
    alternatePhone: "Backup WhatsApp (optional)", alternateEmail: "Backup email (optional)", alternateHelp: "A second contact helps if we cannot reach you through the first one.",
    summary: "What you need", consent: "I authorize JE4NDEV to save my contact and this summary on its server and private Google Sheets, and notify the team on Telegram to answer my request.",
    send: "Send reply request", saving: "Sending request…", retryButton: "Retry with the same details", retrySame: "We couldn't confirm delivery. Your details are still here. Check your connection and retry with the same details; we won't create another request.",
    conflict: "We couldn't confirm this submission after a connection change. We kept the original request to avoid duplicates. You can also contact the team by email or WhatsApp.",
    unconfirmed: "Your request is saved, but we couldn't confirm the notification to the team. You don't need to submit the form again.",
    newOperation: "Edit in a new operation", validation: "Enter your name, contact and a summary of at least 10 characters; check consent to continue.",
    saveError: "The request was not confirmed. No success was reported.", pending: "Your request was saved. The team still needs to review and reply; notification is pending.", sent: "Your request was saved and the notification was sent to the team. Review and reply are still pending.", receipt: "Receipt", close: "Close form",
  },
} as const;
