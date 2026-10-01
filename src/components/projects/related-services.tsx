import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { serviceOffers, type ServiceLocale } from "@/data/services";
import { COMPANY } from "@/data/company";

export function getRelatedServiceOffers(projectSlug: string) {
  return serviceOffers.filter((offer) => offer.relatedProjectSlugs.includes(projectSlug));
}

interface RelatedServicesProps {
  projectSlug: string;
  locale: ServiceLocale;
}

export function RelatedServices({ projectSlug, locale }: RelatedServicesProps) {
  const offers = getRelatedServiceOffers(projectSlug);
  if (offers.length === 0) return null;

  const isPt = locale === "pt";
  const message = isPt
    ? "Olá! Quero conversar sobre um trabalho relacionado a este projeto."
    : "Hi! I would like to discuss work related to this project.";

  return (
    <section aria-labelledby="related-services-title" className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
        {isPt ? "Serviços relacionados" : "Related services"}
      </p>
      <h2 id="related-services-title" className="mt-3 text-2xl font-bold">
        {isPt ? "Precisa de algo parecido?" : "Need something similar?"}
      </h2>
      <ul className="mt-5 space-y-4">
        {offers.map((offer) => (
          <li key={offer.id} className="rounded-2xl border border-white/[0.06] p-4">
            <Link href={`/${locale}/services/${offer.slugs[locale]}`} className="group inline-flex min-h-11 items-center gap-2 font-semibold text-white hover:text-cyan-200">
              {offer.title[locale]} <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <p className="mt-1 text-sm leading-6 text-zinc-400">
              {offer.relatedProjectReasons[projectSlug]?.[locale]}
            </p>
          </li>
        ))}
      </ul>
      <a
        href={`${COMPANY.whatsappUrl}?text=${encodeURIComponent(message)}`}
        target="_blank"
        rel="noopener noreferrer"
        data-analytics-event="lead-cta-click"
        data-cta="case-related-services-contact"
        data-project={projectSlug}
        data-offer="diagnosis-first-milestone"
        className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cyan-300 hover:text-cyan-100"
      >
        <MessageCircle aria-hidden="true" className="h-4 w-4" />
        {isPt ? "Conversar sobre um trabalho parecido" : "Discuss similar work"}
      </a>
    </section>
  );
}
