import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { COMPANY } from "@/data/company";
import { getGuide, GUIDE_PUBLISHED, GUIDE_SLUG } from "@/data/guides";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return ["en", "pt"].map(locale => ({ locale, slug: GUIDE_SLUG }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const guide = getGuide(locale, slug);
  if (!guide) return {};
  const canonical = `${COMPANY.siteUrl}/${locale}/guides/${slug}`;
  const title = `${guide.title} | JE4NDEV`;
  return {
    title, description: guide.description,
    authors: [{ name: "Jean Carlos Vargas", url: `${COMPANY.siteUrl}/${locale}#about` }],
    alternates: { canonical, languages: { "en-US": `${COMPANY.siteUrl}/en/guides/${slug}`, "pt-BR": `${COMPANY.siteUrl}/pt/guides/${slug}`, "x-default": `${COMPANY.siteUrl}/en/guides/${slug}` } },
    openGraph: { title, description: guide.description, url: canonical, type: "article", siteName: "JE4NDEV", locale: locale === "pt" ? "pt_BR" : "en_US", alternateLocale: [locale === "pt" ? "en_US" : "pt_BR"], publishedTime: GUIDE_PUBLISHED, authors: ["Jean Carlos Vargas"], images: [{ url: "/og-image.png", width: 1200, height: 630, alt: guide.title }] },
    twitter: { title, description: guide.description, card: "summary_large_image", images: ["/og-image.png"] },
  };
}

export default async function GuidePage({ params }: Props) {
  const { locale, slug } = await params;
  const guide = getGuide(locale, slug);
  if (!guide) notFound();
  const isPt = locale === "pt";
  const canonical = `${COMPANY.siteUrl}/${locale}/guides/${slug}`;
  const emailHref = `mailto:${COMPANY.email}?subject=${encodeURIComponent(guide.cta.subject)}&body=${encodeURIComponent(guide.cta.body)}`;
  const schema = [
    { "@context": "https://schema.org", "@type": "Article", "@id": `${canonical}#article`, headline: guide.title, description: guide.description, url: canonical, mainEntityOfPage: canonical, inLanguage: isPt ? "pt-BR" : "en", datePublished: GUIDE_PUBLISHED, author: { "@type": "Person", name: "Jean Carlos Vargas", url: `${COMPANY.siteUrl}/${locale}#about` }, publisher: { "@id": `${COMPANY.siteUrl}/#organization` }, image: `${COMPANY.siteUrl}/og-image.png` },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: isPt ? "Início" : "Home", item: `${COMPANY.siteUrl}/${locale}` },
      { "@type": "ListItem", position: 2, name: isPt ? "Guias" : "Guides", item: `${COMPANY.siteUrl}/${locale}/guides` },
      { "@type": "ListItem", position: 3, name: guide.title, item: canonical },
    ] },
  ];
  return (
    <main className="bg-[#050505] pb-24 pt-24 text-white sm:pt-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <article>
        <header className="border-b border-white/10 px-6 pb-14 pt-6 sm:pb-20">
          <div className="mx-auto max-w-5xl">
            <Link href={`/${locale}/guides`} className="inline-flex min-h-11 items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} aria-hidden="true" />{isPt ? "Todos os guias" : "All guides"}</Link>
            <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-[#d8caa9]">{isPt ? "Um guia para decidir" : "A guide to your next decision"}</p>
            <h1 className="mt-6 max-w-4xl text-[2.3rem] font-semibold leading-[1.12] tracking-[-0.035em] sm:text-6xl lg:text-7xl">{guide.title}</h1>
            <p className="mt-7 max-w-3xl text-lg leading-8 text-zinc-300 sm:text-xl sm:leading-9">{guide.lead}</p>
            <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-zinc-500"><span>Jean Carlos Vargas · JE4NDEV</span><time dateTime={GUIDE_PUBLISHED}>{isPt ? "1 de outubro de 2026" : "October 1, 2026"}</time><span>{isPt ? "6 min de leitura" : "6 min read"}</span></div>
          </div>
        </header>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 pt-12 lg:grid-cols-[210px_minmax(0,1fr)] lg:gap-16 lg:pt-16">
          <aside>
            <nav aria-label={isPt ? "Neste guia" : "In this guide"} className="lg:sticky lg:top-28">
              <p className="mb-4 font-mono text-xs uppercase tracking-widest text-zinc-500">{isPt ? "Neste guia" : "In this guide"}</p>
              <ol className="space-y-2 border-l border-white/10 pl-4">{guide.sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`} className="block py-2 text-sm leading-6 text-zinc-400 hover:text-white"><span className="mr-2 font-mono text-xs text-zinc-600">0{index + 1}</span>{section.title}</a></li>)}<li><a href="#questions" className="block py-2 text-sm text-zinc-400 hover:text-white">{isPt ? "Dúvidas frequentes" : "Common questions"}</a></li></ol>
            </nav>
          </aside>
          <div className="min-w-0 space-y-14">
            {guide.sections.map((section, index) => (
              <Fragment key={section.id}>
                <section id={section.id} className="scroll-mt-28">
                  <p className="font-mono text-xs tracking-widest text-[#d8caa9]">0{index + 1}</p>
                  <h2 className="mt-3 text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">{section.title}</h2>
                  <div className="mt-5 space-y-5 text-base leading-8 text-zinc-300">{section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
                  {section.bullets.length > 0 && <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-7 text-zinc-300 marker:text-[#d8caa9]">{section.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>}
                  {section.links.map(link => <p className="mt-5 text-sm leading-6" key={link.href}><a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[#aff1ea] underline decoration-[#aff1ea]/30 underline-offset-4 hover:decoration-[#aff1ea]">{link.label}</a></p>)}
                </section>
                {section.id === guide.comparison.afterSection && <section aria-label={guide.comparison.title}>
                  <div tabIndex={0} role="region" aria-label={guide.comparison.title} className="overflow-x-auto rounded-2xl border border-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#aff1ea]">
                    <table className="w-full min-w-[620px] text-left text-sm leading-6">
                      <caption className="px-5 py-5 text-left text-base font-semibold text-white">{guide.comparison.title}</caption>
                      <thead className="border-y border-white/10 bg-white/[0.04] text-white"><tr>{guide.comparison.columns.map(column => <th key={column} scope="col" className="px-5 py-4 font-medium">{column}</th>)}</tr></thead>
                      <tbody>{guide.comparison.rows.map(row => <tr key={row[0]} className="border-b border-white/[0.06] last:border-0"><th scope="row" className="px-5 py-4 align-top font-medium text-[#d8caa9]">{row[0]}</th>{row.slice(1).map((cell, cellIndex) => <td key={cellIndex} className="px-5 py-4 align-top text-zinc-300">{cell}</td>)}</tr>)}</tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-zinc-500">{guide.comparison.note}</p>
                </section>}
                {section.id === guide.case.afterSection && <section className="rounded-3xl border border-[#aff1ea]/20 bg-[#aff1ea]/[0.035] p-6 sm:p-8">
                  <p className="font-mono text-[11px] uppercase tracking-widest text-[#aff1ea]">{guide.case.label}</p>
                  <h2 className="mt-4 text-2xl font-semibold leading-snug">{guide.case.title}</h2>
                  <div className="mt-5 space-y-4 text-base leading-8 text-zinc-300">{guide.case.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
                  <ul className="mt-5 list-disc space-y-3 pl-5 text-sm leading-7 text-zinc-400 marker:text-[#aff1ea]">{guide.case.limitations.map(limitation => <li key={limitation}>{limitation}</li>)}</ul>
                  <p className="mt-5 text-sm leading-6 text-zinc-500">{guide.case.note}</p>
                  <Link href={guide.case.link.href} data-analytics-event="portfolio-proof-cta" data-cta="guide-nora-case" className="mt-5 inline-flex min-h-11 items-center gap-3 text-sm text-[#aff1ea] hover:underline">{guide.case.link.label}<ArrowRight className="shrink-0" size={16} aria-hidden="true" /></Link>
                </section>}
              </Fragment>
            ))}
            <section id="questions" className="scroll-mt-28 border-t border-white/10 pt-12">
              <h2 className="text-2xl font-semibold sm:text-3xl">{isPt ? "Dúvidas frequentes" : "Common questions"}</h2>
              <div className="mt-6 divide-y divide-white/10">{guide.faqs.map(faq => <details key={faq.question} className="group py-5"><summary className="cursor-pointer text-base font-medium leading-7 text-white marker:text-[#d8caa9]">{faq.question}</summary><p className="mt-4 text-base leading-8 text-zinc-400">{faq.answer}</p></details>)}</div>
            </section>
            <section className="rounded-3xl border border-white/10 bg-white/[0.025] p-6 sm:p-8">
              <h2 className="text-2xl font-semibold sm:text-3xl">{guide.cta.title}</h2>
              <p className="mt-5 text-base leading-8 text-zinc-300">{guide.cta.text}</p>
              <a href={emailHref} data-analytics-event="lead-cta-click" data-cta="guide-workflow-email" className="mt-7 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-black transition-colors hover:bg-[#aff1ea]"><Mail size={18} className="shrink-0" aria-hidden="true" />{guide.cta.label}</a>
              <p className="mt-4 text-xs leading-6 text-zinc-500">{guide.cta.note}</p>
              <div className="mt-6 flex flex-col items-start gap-3">{guide.cta.links.map(link => <Link href={link.href} key={link.href} data-analytics-event="portfolio-navigation-click" data-cta="guide-related-service" className="inline-flex min-h-11 items-center gap-2 text-sm leading-6 text-[#d8caa9] hover:underline">{link.label}<ArrowRight size={16} aria-hidden="true" className="shrink-0" /></Link>)}</div>
            </section>
          </div>
        </div>
      </article>
    </main>
  );
}
