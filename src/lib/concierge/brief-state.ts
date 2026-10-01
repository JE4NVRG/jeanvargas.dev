import type { ConversationBrief, Message } from "./concierge";

export const BRIEF_FIELDS = ["goal", "situation", "desiredSolution", "constraints", "openQuestions"] as const;
const empty = (): ConversationBrief => ({ goal: "", situation: "", desiredSolution: "", constraints: "", openQuestions: "" });
const fold = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const clauses = (text: string) => text.split(/(?<=[.!?;])\s+|\n+|,\s+/).map(part => part.trim()).filter(Boolean);
const unquoted = (text: string) => text.replace(/"[^"\n]*"|“[^”\n]*”|‘[^’\n]*’|(?<!\p{L})'[^'\n]*'(?!\p{L})/gu, "");
const ignoredWords = new Set("corrigindo correction actually verdade preciso quero need want sistema system painel dashboard projeto project primeira versao first version agora hoje today this that with com sem without nao not the and para uma um que fica ficar fora out fora inclui incluir include excluding remove excluir de do da dos das meu minha my nosso nossa our por ainda only so apenas precisa se it its is are on in as be eu i we a o os e em no na an to for cliente clientes customer customers client clients oficina workshop tecnico tecnicos team equipe".split(" "));
const clearTargets: Record<typeof BRIEF_FIELDS[number], RegExp> = {
  goal: /\b(?:objetivo|goal|pedido principal)\b/,
  situation: /\b(?:situacao|situation|contexto|context)\b/,
  desiredSolution: /\b(?:solucao|solution|resultado desejado|desired outcome)\b/,
  constraints: /\b(?:restricao|restricoes|constraint|constraints|limitacao|limitacoes)\b/,
  openQuestions: /\b(?:pergunta|perguntas|question|questions|duvida|duvidas|unknowns)\b/,
};
const terms = (text: string) => new Set(fold(text).match(/[a-z0-9]{3,}/g)?.filter(word => !ignoredWords.has(word)).map(word => word.replace(/s$/, "")) || []);
const overlaps = (a: string, b: string) => { const source = terms(a); return [...terms(b)].some(word => source.has(word)); };
function exclusions(latest: string): string[] {
  // This is only a conservative stale-fact fence, not a semantic truth engine.
  // Field decisions remain in the single model envelope; quoted examples are not corrections.
  const plain = unquoted(latest);
  if (/\b(?:traduza|translate|exemplo|example)\b/i.test(plain)) return [];
  return clauses(plain).filter(part => /\b(?:sem|without|exclude|excluding|remove|remover|excluir)\b|\bno\s+(?:payments?|notifications?|registration|public area)\b|\b(?:nao|not|don.t|do not)\b.{0,35}\b(?:quero|preciso|want|need|incluir|include)\b|\b(?:fica|ficam|leave|keep).{0,20}\b(?:fora|out)\b/i.test(fold(part)));
}
function replacesProject(latest: string, previous?: ConversationBrief): boolean {
  const text = fold(unquoted(latest));
  if (/\b(?:(?:novo|outro) projeto|(?:new|different) project|change my goal|mudar (?:o )?objetivo)\b/.test(text)) return true;
  // "rather than SMS" edits a channel, not a work-order dashboard goal.
  const goal = fold(previous?.goal || "");
  return ["brochure", "website", "site", "loja virtual", "ecommerce", "app", "sistema", "system", "painel", "dashboard"].some(kind =>
    new RegExp(`\\b${kind}\\b`).test(goal) && new RegExp(`\\b(?:not|nao|instead of|rather than|(?:em vez|no lugar) (?:de|do|da)) (?:a |an |the |um |uma |o |a )?${kind}\\b`).test(text));
}

function inclusions(latest: string): string[] {
  const plain = unquoted(latest);
  if (/\b(?:traduza|translate|exemplo|example)\b/i.test(plain)) return [];
  return clauses(plain).filter(part => exclusions(part).length === 0 && /\b(?:incluir|inclua|include|including|enable|ativar)\b|\b(?:corrigindo|correction|actually|afinal|now|agora)\b.{0,55}\b(?:com|with)\b/i.test(fold(part)));
}

/** Resolve field operations to the unchanged browser/API string-brief contract.
 * A blank legacy string means keep, never destructive clear. No second inference.
 * Bad metadata preserves known fields, rejects invitations, and never eats a reply.
 */
export function resolveBriefUpdate(value: unknown, messages: readonly Message[], previous?: ConversationBrief): { brief?: ConversationBrief; valid: boolean } {
  const userText = messages.filter(message => message.role === "user").map(message => message.content);
  const latest = userText.at(-1) || "";
  const brief = empty();
  for (const field of BRIEF_FIELDS) brief[field] = previous?.[field] || "";
  const supplied = value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : undefined;
  const shapeValid = !!supplied && Object.keys(supplied).length === BRIEF_FIELDS.length && Object.keys(supplied).every(key => BRIEF_FIELDS.includes(key as typeof BRIEF_FIELDS[number]));
  let valid = shapeValid, acceptedAny = false;
  const explicitClears = new Set<string>();
  const grounded = (quote: string, field: typeof BRIEF_FIELDS[number]) => clauses(quote).every(part => userText.some(text => text.includes(part)) || !!previous?.[field]?.includes(part));
  if (shapeValid) for (const field of BRIEF_FIELDS) {
    const suppliedField = supplied![field];
    let quote: string | undefined;
    if (typeof suppliedField === "string") {
      if (suppliedField.length <= 500) quote = suppliedField.trim();
    } else if (suppliedField && typeof suppliedField === "object" && !Array.isArray(suppliedField)) {
      const operation = suppliedField as Record<string, unknown>;
      const keys = Object.keys(operation);
      if (operation.action === "keep" && keys.length === 1) { acceptedAny = true; continue; }
      if (operation.action === "replace" && keys.every(key => ["action", "value", "evidence"].includes(key)) && typeof operation.value === "string" && operation.value.trim() && operation.value.length <= 500) {
        const currentEvidence = operation.evidence === undefined ? operation.value : operation.evidence;
        if (typeof currentEvidence === "string" && currentEvidence.trim() && unquoted(latest).includes(currentEvidence.trim())) quote = operation.value.trim();
      }
      if (operation.action === "clear" && keys.length === 2 && keys.includes("evidence") && typeof operation.evidence === "string" && operation.evidence.trim() && unquoted(latest).includes(operation.evidence.trim()) && /\b(?:limpar|limpe|esqueca|remov|retir|desconsidere|clear|forget|remove|disregard)\w*\b/i.test(fold(operation.evidence)) && (clearTargets[field].test(fold(operation.evidence)) || /\b(?:tudo|all previous|whole brief)\b/.test(fold(operation.evidence)) || (!!previous?.[field] && overlaps(previous[field], operation.evidence)))) {
        brief[field] = ""; explicitClears.add(field); acceptedAny = true; continue;
      }
    }
    if (quote === undefined || !grounded(quote, field)) { valid = false; continue; }
    acceptedAny = true;
    if (quote) brief[field] = quote; // Legacy omission/blank must not erase known facts.
  }
  // Only an actual project replacement invalidates older goal/solution fields.
  // Merely "actually, I want the system without payments" is a scope edit.
  if (replacesProject(latest, previous)) for (const field of ["goal", "desiredSolution"] as const) {
    if (brief[field] && !latest.includes(brief[field])) { brief[field] = ""; valid = false; }
  }
  const excluded = exclusions(latest);
  const included = inclusions(latest);
  const edits = [...excluded, ...included];
  for (const field of BRIEF_FIELDS) {
    if (!brief[field] || explicitClears.has(field)) continue;
    const parts = clauses(brief[field]);
    const remaining = parts.filter(part => !edits.some(excerpt => overlaps(part, excerpt) && (exclusions(part).length > 0) !== excluded.includes(excerpt)) || unquoted(latest).includes(part));
    if (remaining.length !== parts.length) {
      brief[field] = remaining.join(" ");
      valid = false; // Model retained a stale fact; no automatic contact invitation.
      if (field === "constraints") {
        const corrected = edits.filter(excerpt => parts.some(part => overlaps(part, excerpt) && (exclusions(part).length > 0) !== excluded.includes(excerpt)));
        const next = [...remaining, ...corrected.filter(excerpt => !remaining.includes(excerpt))].join(" ");
        brief.constraints = next.length <= 500 ? next : corrected.join(" ").slice(0, 500);
      }
    }
  }
  // Missing a newly stated exclusion is not contact-ready even when older facts
  // are not contradictory. Carry the literal latest exclusion into review.
  if (!explicitClears.has("constraints")) {
    const missing = excluded.filter(excerpt => !clauses(brief.constraints).some(part => unquoted(latest).includes(part) && (overlaps(part, excerpt) || part === excerpt)));
    if (missing.length) {
      const next = [brief.constraints, ...missing].filter(Boolean).join(" ");
      brief.constraints = next.length <= 500 ? next : missing.join(" ").slice(0, 500);
      valid = false;
    }
  }
  return { ...((acceptedAny && valid) || BRIEF_FIELDS.some(field => brief[field]) ? { brief } : {}), valid };
}
