import { COMPANY } from "@/data/company";

/** Opens a draft; sending and call scheduling stay with the visitor and team. */
export function contactEmailHref(locale: "pt" | "en", topic = "", summary = "") {
  const subject = locale === "pt" ? `Projeto JE4NDEV${topic ? ` — ${topic}` : ""}` : `JE4NDEV project${topic ? ` — ${topic}` : ""}`;
  const body = summary || (locale === "pt"
    ? "Olá, Jean!\n\nO que quero construir ou melhorar:\nQuem vai usar:\nPrazo ou restrições:\n\nSe uma conversa por vídeo ajudar, meu fuso e horários disponíveis são:\n"
    : "Hi Jean,\n\nWhat I want to build or improve:\nWho will use it:\nTimeline or constraints:\n\nIf a video call would help, my time zone and availability are:\n");
  return `mailto:${COMPANY.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
