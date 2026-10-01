import { COMPANY } from "@/data/company";
import { projects } from "@/data/projects";
import { serviceOffers } from "@/data/services";
import { studioPositioning } from "./studio-context";
import type { ConciergeLocale, Message } from "./concierge";

const normalize = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const projectNeeds: Record<string, RegExp> = {
  mepmail: /\b(?:resend|smtp|email|e-mail|ses|transacional|transactional)\b/,
  archscene: /\b(?:render\w*|arquitet\w*|architect\w*|interior\w*|sketchup)\b/,
  fullcommerce360: /\b(?:marketplace\w*|mercado livre|mercadolivre|seller\w*)\b/,
  urlpivot: /\b(?:qr(?:\s*code)?|link\w* dinamico\w*|dynamic links?|encurtador|shortener|destino do link|link destination)\b/,
};
const serviceNeeds: Record<string, RegExp> = {
  saas: /\b(?:saas|sistema\w*|systems?|aplicativo\w*|apps?|mvp|marketplace\w*)\b/,
  automation: /\b(?:automat\w*|integrac\w*|integrat\w*|planilha\w*|spreadsheet\w*|repetitiv\w*)\b/,
  agents: /\b(?:assistent\w*|assistente\w*|agent\w*|estudo\w*|stud\w*)\b/,
  websites: /\b(?:sites?|websites?|portfolio|dominio|domain|hospedagem|hosting)\b/,
  "landing-pages": /\b(?:landing|campanha\w*|campaign\w*|pagina de vendas|sales page)\b/,
};
const faqTerms = /\b(?:dominio|domain|hospedagem|hosting|manutencao|maintenance|suporte|support|prazo|timeline|preco|price|custo|cost|textos?|copy|seo|local|privad\w*|private|autonomia|autonomy|aprovac\w*|approval|permiss\w*|permission)\b/g;

/** Bounded cards from the actual public catalog, never private sessions or a second inference. */
export function publicKnowledge(locale: ConciergeLocale, history: readonly Message[]): string {
  const catalog = projects.filter(project => project.status !== "archived" && ["public-live", "public-demo"].includes(project.proofLevel) && typeof project.links.live === "string");
  const visitorMessages = history.filter(message => message.role === "user");
  const visitorText = normalize(visitorMessages.map(message => message.content).join(" "));
  const latestText = normalize(visitorMessages.at(-1)?.content || "");
  const matchesProject = (text: string) => catalog.filter(project => text.includes(normalize(project.title)) || text.includes(project.slug) || projectNeeds[project.slug]?.test(text));
  const latestProjects = matchesProject(latestText);
  const relevant = (latestProjects.length ? latestProjects : matchesProject(visitorText)).slice(0, 3);
  const cards = catalog.map(project => `- ${project.title}: ${project.description[locale]} Status: ${project.status}; role: ${project.role}; evidence: ${project.proofLevel}. URL: ${project.links.live}${project.links.docs ? `; docs: ${project.links.docs}` : ""}`).join("\n");
  const details = relevant.map(project => `- ${project.title}\nPurpose/capabilities: ${project.longDescription[locale]}\nResponsibility: ${project.deliveryRecord?.responsibility[locale] || project.scope[locale]}\nLimitations: ${project.deliveryRecord?.limitations[locale] || "Only the public catalog scope is verified; do not invent features, results or commercial figures."}\nLinks: ${Object.entries(project.links).filter(([, value]) => value).map(([kind, value]) => `${kind}=${value}`).join("; ")}`).join("\n");
  const offers = serviceOffers.map(offer => `- ${offer.title[locale]}: ${offer.intro[locale].split(/(?<=[.!?])\s+/)[0]} Deliverables: ${offer.deliverables.slice(0, 3).map(item => item[locale]).join("; ")}`).join("\n");
  const terms = [...new Set(latestText.match(faqTerms) || visitorText.match(faqTerms) || [])];
  const latestServices = serviceOffers.filter(offer => serviceNeeds[offer.id]?.test(latestText));
  const selectedServices = latestServices.length ? latestServices : serviceOffers.filter(offer => serviceNeeds[offer.id]?.test(visitorText));
  const serviceDetails = selectedServices.slice(0, 2).map(offer => {
    const ranked = offer.faq.map((faq, index) => ({ faq, index, score: terms.filter(term => normalize(`${faq.question[locale]} ${faq.answer[locale]}`).includes(term)).length }))
      .sort((a, b) => b.score - a.score || a.index - b.index);
    const faqs = ranked.filter(item => item.score > 0).slice(0, 2);
    if (!faqs.length && ranked.length) faqs.push(ranked[0]);
    return `- ${offer.title[locale]}\nScope: ${offer.intro[locale]}\nProcess: ${offer.process.map(step => `${step.title[locale]}: ${step.description[locale]}`).join("; ")}\nFAQ: ${faqs.map(({ faq }) => `${faq.question[locale]} ${faq.answer[locale]}`).join("\n")}\nURL: ${COMPANY.siteUrl}/${locale}/services/${offer.slugs[locale]}`;
  }).join("\n");
  return `Company: ${COMPANY.brand}. ${locale === "pt" ? COMPANY.activityPt : COMPANY.activityEn}\n${studioPositioning(locale)}\nJE4NDEV scopes websites, landing pages, SaaS MVPs, internal systems, automation and agent integrations. Founder-market fit starts with the founder's domain knowledge, user access and an understood problem; it does not guarantee product-market fit, demand, revenue or investment. Hermes and OpenClaw are third-party open-source tools configured/integrated by JE4NDEV, not original JE4NDEV software or an official vendor partnership. Agent permissions and human review depend on the agreed task; never promise unrestricted autonomy. Private hosting does not imply local inference or no third-party processing. MepMail SDK compatibility does not imply complete provider parity; preserve its open-source/AGPL attribution. URLPivot public demo does not imply access to all private features. Direct business contact: ${COMPANY.whatsappUrl} or ${COMPANY.email}.\nServices:\n${offers}${serviceDetails ? `\nRelevant published service details (reference only):\n${serviceDetails}` : ""}\nPublic products/cases: role distinguishes own products, client work and other contributions; a public demo does not prove every private feature:\n${cards}${details ? `\nRelevant catalog details (reference only):\n${details}` : ""}`;
}
