import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { COMPANY } from "@/data/company";
import { getGuide, GUIDE_SLUG } from "@/data/guides";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!getGuide(locale)) return {};
  const isPt = locale === "pt";
  const title = isPt ? "Guias de produto, automação e IA | JE4NDEV" : "Product, automation and AI guides | JE4NDEV";
  const description = isPt
    ? "Guias práticos para decidir o que construir, avaliar automações e entender assistentes de IA. Exemplos concretos e próximos passos para sua rotina ou negócio."
    : "Practical guides to decide what to build, evaluate workflow automation and understand AI assistants. Concrete examples and next steps for your work or business.";
  const canonical = `${COMPANY.siteUrl}/${locale}/guides`;
  return {
    title, description,
    alternates: { canonical, languages: { "en-US": `${COMPANY.siteUrl}/en/guides`, "pt-BR": `${COMPANY.siteUrl}/pt/guides`, "x-default": `${COMPANY.siteUrl}/en/guides` } },
    openGraph: { title, description, url: canonical, type: "website", siteName: "JE4NDEV", locale: isPt ? "pt_BR" : "en_US", images: [{ url: "/og-image.png", width: 1200, height: 630 }] },
    twitter: { title, description, card: "summary_large_image", images: ["/og-image.png"] },
  };
}

export default async function GuidesPage({ params }: Props) {
  const { locale } = await params;
  const guide = getGuide(locale);
  if (!guide) notFound();
  const isPt = locale === "pt";
  return (
    <main className="min-h-[75vh] bg-[#050505] px-6 pb-24 pt-28 text-white sm:pt-36">
      <div className="mx-auto max-w-5xl">
        <Link href={`/${locale}`} className="inline-flex min-h-11 items-center gap-2 text-sm text-zinc-400 hover:text-white"><ArrowLeft size={16} aria-hidden="true" />{isPt ? "Início" : "Home"}</Link>
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-[#d8caa9]">JE4NDEV / {isPt ? "Guias" : "Guides"}</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">{isPt ? "Mais clareza para decidir o que construir." : "A clearer path to what you should build."}</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">{isPt ? "Entenda as opções, veja exemplos e encontre um primeiro passo que faça sentido para sua rotina ou seu negócio." : "Understand your options, see concrete examples and find a first step that fits your work or business."}</p>
        <Link href={`/${locale}/guides/${GUIDE_SLUG}`} data-analytics-event="portfolio-navigation-click" data-cta="guide-index-workflow" className="group mt-14 block rounded-3xl border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-[#d8caa9]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:p-10">
          <span className="font-mono text-xs uppercase tracking-widest text-[#aff1ea]">{isPt ? "Automação e IA" : "Automation & AI"}</span>
          <h2 className="mt-5 max-w-3xl text-2xl font-semibold leading-snug sm:text-4xl">{guide.title}</h2>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400">{guide.description}</p>
          <span className="mt-8 inline-flex min-h-11 items-center gap-3 text-sm text-[#d8caa9]">{isPt ? "Ler o guia" : "Read the guide"}<ArrowRight size={18} aria-hidden="true" className="transition-transform group-hover:translate-x-1" /></span>
        </Link>
      </div>
    </main>
  );
}
