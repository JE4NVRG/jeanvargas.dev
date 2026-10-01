type Turn = { role: "user" | "assistant"; content: string };
const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']/g, "").trim();

// Use the same refusal boundary for form opening and proactive offers.
const contactRefusal = /\b(nao|nunca|sem|not|never|dont|do not)\b.{0,45}\b(contato|contact|retorno|cadastro|register|registration|dados|details|telefone|email|phone|ligue|ligar|call|callback|falar|fale|conversar|chamar|talk|speak|me|mim)\b/;
function hasContactRefusal(text: string): boolean {
  // Evaluate each clause: a product exclusion must not swallow a later
  // personal refusal, nor let its negation reach a later handoff request.
  return normalize(text).split(/[.!?;\n]|\b(?:e|mas|and|but)\b/).some(clause => {
    if (!contactRefusal.test(clause)) return false;
    const productRegistration = /\b(cadastro|register|registration|dados|details|telefone|email|phone)\b/.test(clause)
      && /\b(clientes?|customers?|painel|dashboard|sistema|system|produto|product|app)\b/.test(clause);
    const personalTarget = /\b(comigo|mim|me|myself|jean|contato|contact|retorno|ligue|ligar|call|callback|falar|fale|conversar|chamar|talk|speak)\b/.test(clause)
      || /\b(meu|minha|meus|minhas|my)\s+(?:cadastro|registration|dados|details|telefone|email|phone)\b/.test(clause);
    return !productRegistration || personalTarget;
  });
}

/** Opens a form, never submits a lead or grants consent. */
export function requestsContact(text: string): boolean {
  const value = normalize(text);
  if (!value || value.length > 300 || /\b(exemplo|example|traduza|translate|significa|means|hipoteticamente|hypothetically|if only|e se)\b/.test(value)) return false;
  if (/[\"“”]/.test(text) || /‘[^’]+’|(?:^|\s)'[^']+'/.test(text) || hasContactRefusal(text)) return false;
  return /\b(solicitar|solicito|solicite|pedir|peco|quero|gostaria|preciso|pode|podem)\b.{0,55}\b(contato|retorno|me ligar|me ligue|me chamar|me chame)\b/.test(value)
    || /\b(falar|conversar|chamar|contatar|fale)\b.{0,25}\b(jean|humano|pessoa|equipe|especialista)\b/.test(value)
    || /\bjean\s+(?:(?:pode|poderia|will|can|could|please)\s+)?(?:falar|conversar|ligar|chamar|contatar|call|email|contact|reach|talk|speak)\s+(?:comigo|para mim|pra mim|me|us)\b/.test(value)
    || /\b(?:peco|pode|podem|quero|gostaria|preciso|ask|have|want|need|please)\b.{0,30}\bjean\b.{0,25}\b(?:falar|conversar|ligar|chamar|call|email|contact|reach)\b.{0,20}\b(?:comigo|para mim|pra mim|me|us)\b/.test(value)
    || /^(me ligue|me chama|me chame|retorno|contato|pode ligar|call me|contact me|callback|request contact|request a callback|request a reply)[.!?\s]*$/.test(value)
    || /\b(want|like|need|please|can you|could you|have jean|ask jean)\b.{0,40}\b(contact|callback|call me|call back|reach me|get in touch)\b/.test(value)
    || /\b(talk|speak)\s+(?:to|with)\s+(?:jean|a human|a person|someone)\b/.test(value);
}
export function declinesContact(text: string): boolean { return hasContactRefusal(text); }

/** Visitor-chosen handoff channel, not a request to integrate WhatsApp in a product. */
export function requestsWhatsApp(text: string): boolean {
  const value = normalize(text);
  if (!value || value.length > 500 || !/\bwhatsapp\b/.test(value) || /["“”]|‘[^’]+’|(?:^|\s)'[^']+'/.test(text) || /\b(exemplo|example|traduza|translate|hipoteticamente|hypothetically)\b/.test(value)) return false;
  if (/\b(nao|nunca)\s+(?:(?:quero|prefiro|use|usar|falar|conversar|continuar|chamar|seguir|contato|com|o|jean|voce|pelo|por|no|via)\s+){0,10}whatsapp\b/.test(value)
    || /\b(not|never|dont|do not)\s+(?:(?:want|use|contact|on|via|by|to|talk|speak|continue|move|me|with|jean|you|the|conversation)\s+){0,10}whatsapp\b/.test(value)) return false;
  return /\b(continuar|falar|conversar|chamar|seguir)\s+(?:(?:a conversa|com (?:o )?jean|com voce|com voces|com a equipe)\s+)?(?:pelo|por|no|via)\s+(?:o\s+)?whatsapp\b/.test(value)
    || /\b(continue|talk|speak|move|contact)\s+(?:(?:the conversation|to jean|with jean|to you|me)\s+)?(?:on|via|to|over)\s+whatsapp\b/.test(value)
    || /\b(abrir|open)\s+(?:o\s+)?whatsapp\b/.test(value)
    || /\b(quero|prefiro|vamos|want|prefer)\s+(?:(?:ir|seguir|usar|contato|retorno|contact|pelo|por|no|o|to|use|on|via)\s+){0,3}whatsapp\b/.test(value);
}

function isStandaloneContactRequest(text: string): boolean {
  const value = normalize(text).replace(/[.!?,;:]+/g, " ").replace(/\s+/g, " ").trim()
    .replace(/^(?:por favor|please)\s+|\s+(?:por favor|please)$/g, "");
  return /^(?:(?:eu\s+)?(?:quero|gostaria|preciso|solicitar|solicito|solicite|pedir|peco|pode|podem)\s+(?:de\s+)?(?:um\s+|uma\s+)?)?(?:contato|retorno)$/.test(value)
    || /^(?:(?:eu\s+)?(?:quero|gostaria|preciso|pode|podem)\s+(?:de\s+)?)?(?:falar|conversar|chamar|contatar|fale)\s+(?:com\s+)?(?:o\s+)?(?:jean|humano|um humano|uma pessoa|a equipe|um especialista)$/.test(value)
    || /^(?:(?:pode|podem)\s+)?(?:me\s+(?:ligar|ligue|chamar|chame)|jean\s+(?:falar|conversar|ligar|chamar|contatar)\s+(?:comigo|para mim|pra mim))$/.test(value)
    || /^(?:pode\s+)?pedir\s+(?:pro|para o)\s+jean\s+(?:falar|ligar|chamar)\s+comigo$/.test(value)
    || /^(?:(?:i\s+)?(?:want|would like|id like|need)\s+(?:a\s+|to\s+)?|(?:request|can you|could you)\s+)?(?:contact(?: me)?|callback|call me|call back|(?:talk|speak)\s+(?:to|with)\s+(?:jean|a human|a person|someone))$/.test(value)
    || /^(?:(?:can you|could you)\s+ask\s+|(?:i\s+)?(?:want|would like|id like)\s+)?jean\s+(?:to\s+)?(?:call|email|contact|reach)\s+me$/.test(value);
}

function isStandaloneWhatsAppRequest(text: string): boolean {
  // Remove only explicit channel/registration choices and summary-carrying
  // courtesy text. Any remaining product requirement keeps the full turn.
  const value = normalize(text).replace(/[.!?,;:]+/g, " ").replace(/\s+/g, " ").trim()
    .replace(/^(?:agora sim|now)\s+/, "")
    .replace(/\s+como faco$/, "")
    .replace(/\s+quero levar esse resumo para nao precisar explicar tudo de novo$/, "")
    .replace(/\s+(?:sem (?:preencher (?:um )?)?cadastro(?: aqui)?|without (?:registration|signing up))$/, "")
    .replace(/\s+(?:pelo|por|no|on|via) whatsapp\b/, "").trim();
  return isStandaloneContactRequest(value)
    || /^(?:quero|prefiro|vamos|i want to|i prefer to)\s+(?:continuar|seguir|continue|talk|speak)(?:\s+(?:com|with)\s+(?:o\s+)?jean)?$/.test(value)
    || /^(?:quero|prefiro|vamos|i want|i prefer)\s+(?:whatsapp|usar whatsapp|use whatsapp)$/.test(value);
}

function isBriefingSource(text: string): boolean {
  if (requestsWhatsApp(text)) return !isStandaloneWhatsAppRequest(text);
  if (!requestsContact(text)) return true;
  // Routing intent is not evidence that the whole turn is only a handoff.
  // Remove only a full standalone request; retain mixed/unknown text verbatim.
  return !isStandaloneContactRequest(text);
}

/** Only surface proactive handoff on explicit readiness, never turn count alone. */
export function shouldOfferContact(turns: readonly Turn[]): boolean {
  const users = turns.filter(turn => turn.role === "user");
  if (users.some(turn => declinesContact(turn.content))) return false;
  const readiness = /\b(orcamento|preco|quanto custa|contratar|proposta|quote|pricing|how much|hire|proposal|prazo|timeline|jean|humano|pessoa|equipe|especialista|human|person|team|specialist)\b/;
  return users.some(turn => readiness.test(normalize(turn.content)) && turn.content.trim().length >= 10);
}

export type BriefFields = { goal: string; situation: string; desiredSolution: string; constraints: string; openQuestions: string };
const briefLabels = {
  pt: { goal: "Objetivo", situation: "Contexto", desiredSolution: "Solução desejada", constraints: "Restrições", openQuestions: "Em aberto" },
  en: { goal: "Goal", situation: "Context", desiredSolution: "Desired solution", constraints: "Constraints", openQuestions: "Open questions" },
} as const;
export function formatConversationBrief(brief: BriefFields, locale: "pt" | "en", latestVisitorMessage = "", initialVisitorMessage = "", maxChars = 1500): string {
  if (!Object.values(brief).some(value => value.trim()) && !latestVisitorMessage.trim()) return "";
  // Reserve space for every field instead of cutting off the last correction.
  const latest = latestVisitorMessage.trim().slice(-1200);
  const suffix = latest ? `\n${locale === "pt" ? "Última mensagem do visitante" : "Latest visitor message"}: ${latest}` : "";
  const initialBudget = Math.min(220, Math.max(0, maxChars - suffix.length - 330));
  const initial = initialVisitorMessage.trim().slice(0, initialBudget);
  const prefix = initial && initial !== latest ? `${locale === "pt" ? "Contexto inicial (antes dos ajustes)" : "Initial context (before changes)"}: ${initial}\n` : "";
  const fieldBudget = Math.min(260, Math.max(20, Math.floor((maxChars - suffix.length - prefix.length - 110) / 5)));
  const excerpt = (value: string) => value.length <= fieldBudget ? value : `${value.slice(0, fieldBudget - 1).trimEnd()}…`;
  return prefix + (Object.keys(briefLabels[locale]) as (keyof BriefFields)[]).map(field => `${briefLabels[locale][field]}: ${excerpt(brief[field].trim()) || (locale === "pt" ? "Não informado" : "Not provided")}`).join("\n") + suffix;
}

/** Bounded extractive fallback: opening need + latest visitor detail/correction.
 * Assistant suggestions are never promoted to visitor facts.
 */
export function contactSummary(turns: readonly Turn[], locale: "pt" | "en"): string {
  const users = turns.filter(turn => turn.role === "user" && isBriefingSource(turn.content)).map(turn => turn.content.trim()).filter(Boolean);
  if (!users.length) return locale === "pt" ? "Visitante solicitou um retorno pelo chat do site." : "Visitor requested a reply through the website chat.";
  const first = users[0], latest = users.at(-1)!;
  if (first === latest) return first.slice(0, 1_500);
  const latestPart = latest.slice(-1_350);
  return `${first.slice(0, Math.max(0, 1_498 - latestPart.length))}\n\n${latestPart}`;
}

export function reviewedContactSummary(turns: readonly Turn[], locale: "pt" | "en", brief?: BriefFields): string {
  const users = turns.filter(turn => turn.role === "user" && isBriefingSource(turn.content));
  const latest = users.at(-1)?.content || "";
  // A compact model brief can omit earlier explicit requirements. Keep a
  // bounded source-only supplement, newest first, rather than treating a
  // missing model field as proof that the visitor never supplied that fact.
  const budget = Math.max(1000, Math.min(1500, latest.length + 200));
  let summary = formatConversationBrief(brief || {goal:"",situation:"",desiredSolution:"",constraints:"",openQuestions:""}, locale, latest, users[0]?.content, budget) || contactSummary(turns, locale);
  const title = locale === "pt" ? "\nOutros detalhes informados (mais recentes primeiro):" : "\nOther stated details (newest first):";
  let added = false;
  for (const turn of [...users].reverse()) {
    const sentences = turn.content.split(/(?<=[.!?])\s+|\n+/).map(value => value.trim()).filter(Boolean);
    for (const sentence of sentences) {
      if (sentence.endsWith("?") || /^(pode seguir sem cadastro|ainda n[aã]o quero deixar|sem cadastro|oi[,!]|hello[,!]|hi[,!])/i.test(sentence)) continue;
      if (normalize(summary).includes(normalize(sentence))) continue;
      const addition = `${added ? "" : title}\n• ${sentence}`;
      if (summary.length + addition.length > 1500) continue;
      summary += addition; added = true;
    }
  }
  return added ? summary.split("\n").filter(line => !line.endsWith(": Não informado") && !line.endsWith(": Not provided")).join("\n") : summary;
}
