import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, MessageCircle } from "lucide-react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug } from "@/data/projects";
import {
  getServiceOffer,
  serviceOffers,
  type ServiceLocale,
} from "@/data/services";

interface Props {
  params: Promise<{ locale: ServiceLocale; slug: string }>;
}

const SITE_URL = "https://je4ndev.com";
const WHATSAPP_URL = "https://wa.me/5511948477047";

export function generateStaticParams() {
  return serviceOffers.flatMap((offer) =>
    (["pt", "en"] as const).map((locale) => ({
      locale,
      slug: offer.slugs[locale],
    }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const offer = getServiceOffer(locale, slug);
  if (!offer) return {};

  const canonical = `${SITE_URL}/${locale}/services/${offer.slugs[locale]}`;

  return {
    title: offer.metaTitle[locale],
    description: offer.metaDescription[locale],
    alternates: {
      canonical,
      languages: {
        "pt-BR": `${SITE_URL}/pt/services/${offer.slugs.pt}`,
        "en-US": `${SITE_URL}/en/services/${offer.slugs.en}`,
        "x-default": `${SITE_URL}/en/services/${offer.slugs.en}`,
      },
    },
    openGraph: {
      title: offer.metaTitle[locale],
      description: offer.metaDescription[locale],
      url: canonical,
      siteName: "JE4NDEV",
      type: "website",
      locale: locale === "pt" ? "pt_BR" : "en_US",
      alternateLocale: [locale === "pt" ? "en_US" : "pt_BR"],
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: offer.title[locale],
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: offer.metaTitle[locale],
      description: offer.metaDescription[locale],
      images: [`${SITE_URL}/og-image.png`],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params;
  const offer = getServiceOffer(locale, slug);
  if (!offer) notFound();

  const isPt = locale === "pt";
  const pageUrl = `${SITE_URL}/${locale}/services/${offer.slugs[locale]}`;
  const relatedProjects = offer.relatedProjectSlugs
    .map((projectSlug) => getProjectBySlug(projectSlug))
    .filter((project) => project !== undefined);
  const whatsappHref = `${WHATSAPP_URL}?text=${encodeURIComponent(offer.whatsappPrompt[locale])}`;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      "@id": pageUrl,
      name: offer.title[locale],
      description: offer.metaDescription[locale],
      url: pageUrl,
      areaServed: ["BR", "Worldwide"],
      provider: {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#organization`,
        name: "JE4NDEV",
        url: SITE_URL,
      },
      serviceType: offer.label[locale],
      availableLanguage: ["pt-BR", "en"],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: offer.faq.map((item) => ({
        "@type": "Question",
        name: item.question[locale],
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer[locale],
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: isPt ? "Início" : "Home",
          item: `${SITE_URL}/${locale}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: isPt ? "Serviços" : "Services",
          item: `${SITE_URL}/${locale}#services`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: offer.title[locale],
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <main className="overflow-hidden bg-[#050505] pt-24 text-white">
      {/* JSON-LD uses only repository-owned static content; no user input is serialized. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="relative border-b border-white/[0.06] px-6 py-20 sm:py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-500/[0.08] blur-[140px]" />
        <div className="relative mx-auto max-w-5xl">
          <Link
            href={`/${locale}#services`}
            className="inline-flex min-h-11 items-center gap-2 text-sm text-zinc-300 transition-colors hover:text-cyan-200"
          >
            <ArrowLeft className="h-4 w-4" />
            {isPt ? "Voltar às capacidades" : "Back to capabilities"}
          </Link>

          <p className="mt-12 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            {offer.label[locale]}
          </p>
          <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {offer.title[locale]}
          </h1>
          <p className="mt-8 max-w-3xl text-xl leading-8 text-zinc-200 sm:text-2xl sm:leading-9">
            {offer.hero[locale]}
          </p>
          <p className="mt-6 max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg">
            {offer.intro[locale]}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-analytics-event="lead-cta-click"
              data-cta={`service-page-${offer.id}-hero`}
              data-service={offer.id}
              data-offer="diagnosis-first-milestone"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-cyan-300 px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-cyan-200"
            >
              <MessageCircle className="h-4 w-4" />
              {isPt ? "Avaliar meu caso" : "Evaluate my case"}
            </a>
            <a
              href="#process"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/[0.12] px-6 py-3 text-sm font-semibold text-zinc-200 transition-colors hover:border-white/25 hover:text-white"
            >
              {isPt ? "Ver como começa" : "See how it starts"}
            </a>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-purple-300">
              {isPt ? "Quando faz sentido" : "When it fits"}
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
              {isPt ? "Problemas que este trabalho resolve" : "Problems this engagement solves"}
            </h2>
            <ul className="mt-8 space-y-5">
              {offer.buyerFit.map((item) => (
                <li key={item[locale]} className="flex gap-3 text-base leading-7 text-zinc-300">
                  <Check className="mt-1 h-5 w-5 shrink-0 text-cyan-300" />
                  <span>{item[locale]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/[0.08] bg-white/[0.025] p-7 sm:p-9">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
              {isPt ? "Escopo possível" : "Possible scope"}
            </p>
            <h2 className="mt-4 text-3xl font-bold">
              {isPt ? "O primeiro marco pode incluir" : "The first milestone may include"}
            </h2>
            <ul className="mt-7 grid gap-4">
              {offer.deliverables.map((item) => (
                <li
                  key={item[locale]}
                  className="flex gap-3 rounded-xl border border-white/[0.05] bg-black/20 px-4 py-3 text-sm leading-6 text-zinc-300"
                >
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-300" />
                  <span>{item[locale]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="process" className="border-y border-white/[0.06] bg-white/[0.015] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            {isPt ? "Processo por marcos" : "Milestone-based process"}
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-bold sm:text-4xl">
            {isPt
              ? "Cada etapa termina em algo que você consegue abrir, testar ou aprovar."
              : "Every step ends in something you can open, test or approve."}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {offer.process.map((step, index) => (
              <article key={step.title[locale]} className="rounded-2xl border border-white/[0.07] bg-[#090909] p-6">
                <span className="font-mono text-xs text-purple-300">0{index + 1}</span>
                <h3 className="mt-5 text-lg font-bold">{step.title[locale]}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description[locale]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-purple-300">
                {isPt ? "Prova relacionada" : "Related proof"}
              </p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                {isPt ? "Cases para inspecionar" : "Cases you can inspect"}
              </h2>
            </div>
            <Link
              href={`/${locale}#work`}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cyan-300"
            >
              {isPt ? "Ver vitrine completa" : "View full showcase"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {relatedProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/${locale}/projects/${project.slug}`}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 transition-colors hover:border-cyan-300/30"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-400">
                  {project.category}
                </p>
                <h3 className="mt-4 text-xl font-bold">{project.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-6 text-zinc-400">
                  {project.shortDescription[locale]}
                </p>
                <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cyan-300">
                  {isPt ? "Abrir case" : "Open case"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">FAQ</p>
          <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
            {isPt ? "Perguntas antes de começar" : "Questions before starting"}
          </h2>
          <div className="mt-9 divide-y divide-white/[0.07] border-y border-white/[0.07]">
            {offer.faq.map((item) => (
              <article key={item.question[locale]} className="py-7">
                <h3 className="text-lg font-bold">{item.question[locale]}</h3>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
                  {item.answer[locale]}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="mx-auto max-w-5xl rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-400/[0.10] via-white/[0.025] to-purple-500/[0.10] p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            {isPt ? "Qual gargalo você quer tirar da operação?" : "Which bottleneck do you want to remove?"}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-zinc-300">
            {isPt
              ? "Descreva o fluxo atual, quem usa e onde ele trava. Eu devolvo perguntas objetivas e um primeiro marco possível."
              : "Describe the current workflow, who uses it and where it breaks. I will return objective questions and a possible first milestone."}
          </p>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            data-analytics-event="lead-cta-click"
            data-cta={`service-page-${offer.id}-footer`}
            data-service={offer.id}
            data-offer="diagnosis-first-milestone"
            className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-colors hover:bg-cyan-100"
          >
            <MessageCircle className="h-4 w-4" />
            {isPt ? "Descrever meu caso" : "Describe my case"}
          </a>
        </div>
      </section>
    </main>
  );
}
